import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as eks from "@pulumi/eks";
import * as k8s from "@pulumi/kubernetes";
import * as castai from "@castai/pulumi-castai";

// Configuration
const config = new pulumi.Config();
const region = config.get("aws:region") || "us-west-2";
const castaiToken = config.requireSecret("castai:apiToken");
const castaiUrl = config.get("castai:apiUrl") || "https://api.cast.ai";
const clusterName = "pulumi-castai-e2e-test-eks";

// Create a VPC for our cluster
const vpc = new aws.ec2.Vpc("castai-e2e-vpc", {
    cidrBlock: "10.0.0.0/16",
    enableDnsHostnames: true,
    enableDnsSupport: true,
    tags: {
        Name: `${clusterName}-vpc`,
    },
});

// Create subnets in different AZs
const azs = pulumi.output(aws.getAvailabilityZones()).names;
const publicSubnetIds: pulumi.Output<string>[] = [];
const privateSubnetIds: pulumi.Output<string>[] = [];

// Create public subnets
for (let i = 0; i < 2; i++) {
    const publicSubnet = new aws.ec2.Subnet(`castai-e2e-public-subnet-${i}`, {
        vpcId: vpc.id,
        cidrBlock: `10.0.${i}.0/24`,
        availabilityZone: azs.apply(azs => azs[i]),
        mapPublicIpOnLaunch: true,
        tags: {
            Name: `${clusterName}-public-subnet-${i}`,
            "kubernetes.io/role/elb": "1",
        },
    });
    publicSubnetIds.push(publicSubnet.id);

    const privateSubnet = new aws.ec2.Subnet(`castai-e2e-private-subnet-${i}`, {
        vpcId: vpc.id,
        cidrBlock: `10.0.${i + 128}.0/24`,
        availabilityZone: azs.apply(azs => azs[i]),
        tags: {
            Name: `${clusterName}-private-subnet-${i}`,
            "kubernetes.io/role/internal-elb": "1",
        },
    });
    privateSubnetIds.push(privateSubnet.id);
}

// Create an internet gateway
const internetGateway = new aws.ec2.InternetGateway("castai-e2e-igw", {
    vpcId: vpc.id,
    tags: {
        Name: `${clusterName}-igw`,
    },
});

// Create a route table for public subnets
const publicRouteTable = new aws.ec2.RouteTable("castai-e2e-public-rt", {
    vpcId: vpc.id,
    routes: [
        {
            cidrBlock: "0.0.0.0/0",
            gatewayId: internetGateway.id,
        },
    ],
    tags: {
        Name: `${clusterName}-public-rt`,
    },
});

// Associate public subnets with the public route table
for (let i = 0; i < 2; i++) {
    new aws.ec2.RouteTableAssociation(`castai-e2e-public-rta-${i}`, {
        subnetId: publicSubnetIds[i],
        routeTableId: publicRouteTable.id,
    });
}

// Create EKS cluster
const cluster = new eks.Cluster(`${clusterName}`, {
    vpcId: vpc.id,
    subnetIds: [...publicSubnetIds, ...privateSubnetIds],
    instanceType: "t3.medium",
    desiredCapacity: 1,
    minSize: 1,
    maxSize: 2,
    storageClasses: "gp2",
    deployDashboard: false,
    version: "1.27",
    skipDefaultNodeGroup: false,
    nodeAssociatePublicIpAddress: true,
    endpointPrivateAccess: false,
    endpointPublicAccess: true,
    enabledClusterLogTypes: [
        "api",
        "audit",
        "authenticator",
    ],
    tags: {
        Name: clusterName,
        Environment: "test",
    },
});

// Create IAM resources for CAST AI
const castaiPolicy = new aws.iam.Policy("castai-e2e-policy", {
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    "autoscaling:*",
                    "ec2:*",
                    "eks:*",
                    "iam:*",
                    "ecr:*",
                ],
                Resource: "*",
            },
        ],
    }),
});

// Create a role for CAST AI
const castaiRole = new aws.iam.Role("castai-e2e-role", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: {
                    AWS: "arn:aws:iam::396686879907:root",
                },
                Action: "sts:AssumeRole",
                Condition: {
                    StringEquals: {
                        "sts:ExternalId": "castai-eks-test",
                    },
                },
            },
        ],
    }),
});

// Attach policy to role
const castaiPolicyAttachment = new aws.iam.RolePolicyAttachment("castai-e2e-policy-attachment", {
    role: castaiRole.name,
    policyArn: castaiPolicy.arn,
});

// Create the CAST AI EKS integration
const castaiEksCluster = new castai.EksCluster("castai-e2e-eks", {
    eksClusterName: cluster.eksCluster.name,
    eksClusterArn: cluster.eksCluster.arn,
    accountId: aws.getCallerIdentity().then(identity => identity.accountId),
    region: region,
    assumeRoleArn: castaiRole.arn,
    externalId: "castai-eks-test",
    deleteNodesOnDisconnect: true,
    nodeConfigurations: {
        default: {
            subnets: privateSubnetIds.map(id => id),
            securityGroups: [cluster.nodeSecurityGroup.id],
            instanceProfileArn: cluster.instanceProfile.arn,
            tags: {
                "castai-e2e-test": "true",
            },
        },
    },
    nodeTemplates: {
        default: {
            name: "default-by-castai",
            configurationId: "${castai_node_configuration_id.default}",
            isDefault: true,
            shouldTaint: false,
            constraints: {
                onDemand: true,
                spot: true,
                useSpotFallbacks: true,
                enableSpotDiversity: false,
                spotDiversityPriceIncreaseLimitPercent: 20,
            },
        },
        spotTemplate: {
            configurationId: "${castai_node_configuration_id.default}",
            shouldTaint: true,
            constraints: {
                onDemand: false,
                spot: true,
                useSpotFallbacks: true,
                minCpu: 4,
                maxCpu: 100,
                instanceFamilies: {
                    exclude: ["t2", "t3"],
                },
            },
        },
    },
    autoscalerPoliciesJson: JSON.stringify({
        enabled: true,
        isScopedMode: true,
        unschedulablePods: {
            enabled: true,
        },
        nodeDownscaler: {
            emptyNodes: {
                enabled: true,
            },
        },
    }),
});

// Export the CAST AI cluster ID
export const castaiClusterId = castaiEksCluster.id; 