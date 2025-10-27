/**
 * CAST AI AWS Custom IAM Example (Phase 1 + Phase 2)
 *
 * This example demonstrates CAST AI onboarding with MANUAL IAM resource creation.
 * It shows all the IAM roles, policies, and security groups created explicitly.
 *
 * Use this example if you need:
 * - Fine-grained control over IAM resources
 * - Custom IAM policies or permissions
 * - To understand the underlying AWS resources
 * - Integration with existing IAM infrastructure
 *
 * For a simpler approach, see the "full-onboarding" example which uses
 * a reusable component to handle IAM setup automatically.
 *
 * Prerequisites:
 * - Existing EKS cluster
 * - AWS credentials configured
 * - kubectl configured to access the cluster
 * - CAST AI API token
 *
 * This example creates:
 * 1. CAST AI agent (Phase 1) for monitoring
 * 2. IAM roles and policies for CAST AI with full permissions (manually defined)
 * 3. Instance profile for CAST AI worker nodes
 * 4. Security group for CAST AI nodes
 * 5. EKS access entry for node authentication
 * 6. Phase 2 connection with IAM role ARN
 * 7. Phase 2 Helm charts (controller, spot-handler, evictor, pod-pinner)
 *
 * Required environment variables:
 * - CASTAI_API_TOKEN: Your CAST AI API token
 * - AWS_ACCESS_KEY_ID: Your AWS access key ID
 * - AWS_SECRET_ACCESS_KEY: Your AWS secret access key
 * - AWS_REGION: Your AWS region
 * - EKS_CLUSTER_NAME: Name of your existing EKS cluster
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";
import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";

// ============================================================================
// Configuration
// ============================================================================

const castaiApiToken = process.env.CASTAI_API_TOKEN!;
const awsRegion = process.env.AWS_REGION!;
const eksClusterName = process.env.EKS_CLUSTER_NAME!;
const castaiApiUrl = process.env.CASTAI_API_URL || "https://api.cast.ai";

if (!castaiApiToken || !awsRegion || !eksClusterName) {
    throw new Error("Missing required environment variables");
}

// ============================================================================
// Providers
// ============================================================================

const castaiProvider = new castai.Provider("castai-provider", {
    apiToken: castaiApiToken,
    apiUrl: castaiApiUrl,
});

// ============================================================================
// Get AWS and EKS Information
// ============================================================================

const caller = aws.getCallerIdentity({});
const awsAccountId = caller.then((c: aws.GetCallerIdentityResult) => c.accountId);

const eksCluster = pulumi.output(aws.eks.getCluster({
    name: eksClusterName,
}));

// ============================================================================
// CAST AI Cluster Resources
// ============================================================================

// Register cluster with CAST AI (Phase 1 - creates cluster registration and gets cluster token)
// Note: We create this WITHOUT assumeRoleArn initially, then update it with Phase 2 IAM role
const castaiClusterPhase1 = new castai.EksCluster("castai-eks-cluster-phase1", {
    accountId: awsAccountId,
    region: awsRegion,
    name: eksClusterName,
}, { provider: castaiProvider });

// Get cluster ID for easier reference
const castaiClusterId = castaiClusterPhase1.id;

// Get CAST AI user ARN for IAM trust relationship (needed for Phase 2)
const castaiUserArn = new castai.EksUserArn("castai-user-arn", {
    clusterId: castaiClusterId,
}, { provider: castaiProvider });

// ============================================================================
// IAM Configuration for Phase 2
// ============================================================================

// Create IAM role for CAST AI with ExternalId for added security
const castaiRole = new aws.iam.Role("castai-eks-role", {
    name: pulumi.interpolate`cast-eks-${eksClusterName.substring(0, 30)}-role-${castaiClusterId.apply(id => id.substring(0, 8))}`,
    description: `CAST AI role for EKS cluster ${eksClusterName}`,
    assumeRolePolicy: pulumi.all([castaiUserArn.arn, castaiClusterId]).apply(([arn, clusterId]) => JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: {
                AWS: arn,
            },
            Action: "sts:AssumeRole",
            Condition: {
                StringEquals: {
                    "sts:ExternalId": clusterId,
                },
            },
        }],
    })),
    tags: {
        "cast:cluster-id": castaiClusterId,
    },
});

// Create IAM policy with required permissions
const castaiPolicy = new aws.iam.Policy("castai-eks-policy", {
    name: `castai-eks-${eksClusterName}`,
    description: `CAST AI policy for EKS cluster ${eksClusterName}`,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "RunInstancesTagging",
                Effect: "Allow",
                Action: "ec2:CreateTags",
                Resource: "*",
                Condition: {
                    StringEquals: {
                        "ec2:CreateAction": ["RunInstances"],
                    },
                },
            },
            {
                Sid: "RunInstances",
                Effect: "Allow",
                Action: "ec2:RunInstances",
                Resource: [
                    "arn:aws:ec2:*::image/*",
                    "arn:aws:ec2:*::snapshot/*",
                    "arn:aws:ec2:*:*:instance/*",
                    "arn:aws:ec2:*:*:key-pair/*",
                    "arn:aws:ec2:*:*:launch-template/*",
                    "arn:aws:ec2:*:*:network-interface/*",
                    "arn:aws:ec2:*:*:security-group/*",
                    "arn:aws:ec2:*:*:subnet/*",
                    "arn:aws:ec2:*:*:volume/*",
                ],
            },
            {
                Sid: "RunInstancesInstanceProfile",
                Effect: "Allow",
                Action: "iam:PassRole",
                Resource: "*",
                Condition: {
                    StringEquals: {
                        "iam:PassedToService": "ec2.amazonaws.com",
                    },
                },
            },
            {
                Sid: "InstanceActions",
                Effect: "Allow",
                Action: [
                    "ec2:TerminateInstances",
                    "ec2:StartInstances",
                    "ec2:StopInstances",
                    "ec2:ModifyInstanceAttribute",
                ],
                Resource: "*",
                Condition: {
                    StringEquals: {
                        [`ec2:ResourceTag/kubernetes.io/cluster/${eksClusterName}`]: "owned",
                    },
                },
            },
            {
                Sid: "AutoscalingGroups",
                Effect: "Allow",
                Action: [
                    "autoscaling:UpdateAutoScalingGroup",
                    "autoscaling:SuspendProcesses",
                    "autoscaling:ResumeProcesses",
                    "autoscaling:TerminateInstanceInAutoScalingGroup",
                ],
                Resource: "*",
                Condition: {
                    StringEquals: {
                        [`autoscaling:ResourceTag/kubernetes.io/cluster/${eksClusterName}`]: "owned",
                    },
                },
            },
            {
                Sid: "EKS",
                Effect: "Allow",
                Action: [
                    "eks:Describe*",
                    "eks:List*",
                ],
                Resource: "*",
            },
            {
                Sid: "EC2Tagging",
                Effect: "Allow",
                Action: "ec2:CreateTags",
                Resource: "*",
            },
            {
                Sid: "EC2Read",
                Effect: "Allow",
                Action: [
                    "ec2:DescribeInstances",
                    "ec2:DescribeImages",
                    "ec2:DescribeVolumes",
                    "ec2:DescribeSecurityGroups",
                    "ec2:DescribeSubnets",
                    "ec2:DescribeInstanceTypes",
                    "ec2:DescribeInstanceTypeOfferings",
                    "ec2:DescribeLaunchTemplateVersions",
                    "ec2:DescribeAvailabilityZones",
                    "ec2:DescribeSpotPriceHistory",
                    "ec2:DescribeRegions",
                ],
                Resource: "*",
            },
            {
                Sid: "AutoscalingRead",
                Effect: "Allow",
                Action: [
                    "autoscaling:DescribeAutoScalingGroups",
                    "autoscaling:DescribeLaunchConfigurations",
                    "autoscaling:DescribeScalingActivities",
                ],
                Resource: "*",
            },
            {
                Sid: "IAMRead",
                Effect: "Allow",
                Action: [
                    "iam:GetInstanceProfile",
                    "iam:GetRole",
                    "iam:SimulatePrincipalPolicy",
                ],
                Resource: "*",
            },
        ],
    }),
});

// Attach policy to role
const castaiRolePolicyAttachment = new aws.iam.RolePolicyAttachment("castai-role-policy-attachment", {
    role: castaiRole.name,
    policyArn: castaiPolicy.arn,
});

// Attach AWS managed policies for broader permissions
const castaiEc2ReadOnlyAttachment = new aws.iam.RolePolicyAttachment("castai-ec2-readonly", {
    role: castaiRole.name,
    policyArn: "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess",
});

const castaiIamReadOnlyAttachment = new aws.iam.RolePolicyAttachment("castai-iam-readonly", {
    role: castaiRole.name,
    policyArn: "arn:aws:iam::aws:policy/IAMReadOnlyAccess",
});

// ============================================================================
// Instance Profile and Worker Node IAM Role
// ============================================================================

// Create IAM role for CAST AI worker nodes
const castaiNodeRole = new aws.iam.Role("castai-node-role", {
    name: pulumi.interpolate`cast-${eksClusterName.substring(0, 40)}-eks-${castaiClusterId.apply(id => id.substring(0, 8))}`,
    description: "EKS node instance role used by CAST AI",
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [{
            Effect: "Allow",
            Principal: {
                Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
        }],
    }),
});

// Attach required AWS managed policies for EKS worker nodes
const nodeRolePolicies = [
    { name: "eks-worker-node", arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy" },
    { name: "ecr-readonly", arn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly" },
    { name: "eks-cni", arn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy" },
    { name: "ssm-managed", arn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore" },
    { name: "ebs-csi", arn: "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy" },
];

const nodeRolePolicyAttachments = nodeRolePolicies.map(policy =>
    new aws.iam.RolePolicyAttachment(`castai-node-${policy.name}`, {
        role: castaiNodeRole.name,
        policyArn: policy.arn,
    })
);

// Create instance profile
const castaiInstanceProfile = new aws.iam.InstanceProfile("castai-instance-profile", {
    name: pulumi.interpolate`cast-${eksClusterName.substring(0, 40)}-eks-${castaiClusterId.apply(id => id.substring(0, 8))}`,
    role: castaiNodeRole.name,
});

// ============================================================================
// EKS Cluster Access - Add CAST AI node role to cluster authentication
// ============================================================================

// Create EKS access entry for CAST AI nodes (for API or API_AND_CONFIG_MAP auth mode)
const castaiAccessEntry = new aws.eks.AccessEntry("castai-access-entry", {
    clusterName: eksClusterName,
    principalArn: castaiNodeRole.arn,
    type: "EC2_LINUX",
});

// ============================================================================
// Security Group for CAST AI Nodes
// ============================================================================

const eksClusterVpc = eksCluster.vpcConfig;

const castaiSecurityGroup = new aws.ec2.SecurityGroup("castai-security-group", {
    name: pulumi.interpolate`cast-${eksClusterName}-cluster/CastNodeSecurityGroup`,
    description: "CAST AI created security group that allows communication between CAST AI nodes",
    vpcId: eksClusterVpc.vpcId,
    egress: [{
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
    }],
    tags: {
        Name: pulumi.interpolate`cast-${eksClusterName}-cluster/CastNodeSecurityGroup`,
        "cast:cluster-id": castaiClusterId,
    },
});

// Allow all traffic from the security group to itself
const castaiSecurityGroupRule = new aws.ec2.SecurityGroupRule("castai-sg-self-ingress", {
    type: "ingress",
    fromPort: 0,
    toPort: 0,
    protocol: "-1",
    securityGroupId: castaiSecurityGroup.id,
    sourceSecurityGroupId: castaiSecurityGroup.id,
});

// ============================================================================
// Phase 2: Enable Full Management
// ============================================================================

// Update cluster with IAM role to enable Phase 2 (full management)
// This sends the assumeRoleArn to CAST AI, enabling Phase 2 capabilities
const eksClusterConnection = new castai.EksCluster("eks-cluster-connection", {
    accountId: awsAccountId,
    region: awsRegion,
    name: eksClusterName,
    assumeRoleArn: castaiRole.arn,
    deleteNodesOnDisconnect: false, // Set to true if you want CAST AI to remove its nodes on disconnect
}, {
    provider: castaiProvider,
    dependsOn: [
        castaiClusterPhase1,  // Phase 1 cluster must exist first
        // Note: Agent will be installed later, but Phase 2 IAM must be ready first
        castaiRole,
        castaiRolePolicyAttachment,
        castaiEc2ReadOnlyAttachment,
        castaiIamReadOnlyAttachment,
        castaiInstanceProfile,
        castaiSecurityGroup,
    ],
});

// ============================================================================
// Kubernetes Provider
// ============================================================================

const k8sProvider = new k8s.Provider("eks-k8s", {
    kubeconfig: eksCluster.apply(cluster => {
        const clusterCert = pulumi.output(aws.eks.getCluster({
            name: eksClusterName,
        })).apply(c => c.certificateAuthorities[0].data);

        return pulumi.interpolate`apiVersion: v1
kind: Config
clusters:
- cluster:
    server: ${cluster.endpoint}
    certificate-authority-data: ${clusterCert}
  name: ${eksClusterName}
contexts:
- context:
    cluster: ${eksClusterName}
    user: ${eksClusterName}
  name: ${eksClusterName}
current-context: ${eksClusterName}
users:
- name: ${eksClusterName}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: aws
      args:
        - eks
        - get-token
        - --cluster-name
        - ${eksClusterName}
        - --region
        - ${awsRegion}
`;
    }),
});

// ============================================================================
// Phase 1: Install CAST AI Agent
// ============================================================================

// Install CAST AI agent (Phase 1 - read-only monitoring)
// This is required before Phase 2 can be enabled
// Helm will handle updates idempotently if the agent is already installed
const castaiAgent = new k8s.helm.v3.Release("castai-agent", {
    name: "castai-agent",
    chart: "castai-agent",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: true,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: false,  // Wait for agent to be ready before proceeding to Phase 2
    values: {
        provider: "eks",
        createNamespace: false,
        apiURL: castaiApiUrl,
        apiKey: castaiClusterPhase1.clusterToken,
    },
}, {
    provider: k8sProvider,
    dependsOn: [castaiClusterPhase1],
});

// ============================================================================
// Phase 2 Helm Charts
// ============================================================================

// Install cluster controller (Phase 2 component)
const clusterController = new k8s.helm.v3.Release("cluster-controller", {
    name: "cluster-controller",
    chart: "castai-cluster-controller",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: false, // Namespace already exists from Phase 1
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        castai: {
            clusterID: eksClusterConnection.id,
            apiURL: castaiApiUrl,
            apiKey: castaiApiToken,
        },
        resources: {
            requests: {
                memory: "128Mi",
                cpu: "50m",
            },
            limits: {
                memory: "256Mi",
                cpu: "200m",
            },
        },
    },
}, {
    provider: k8sProvider,
    dependsOn: [eksClusterConnection],
    customTimeouts: {
        create: "5m",
        update: "5m",
        delete: "5m",
    },
});

// Install spot handler (Phase 2 component - manages spot instance interruptions)
const castaiSpotHandler = new k8s.helm.v3.Release("castai-spot-handler", {
    name: "castai-spot-handler",
    chart: "castai-spot-handler",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: false,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        castai: {
            apiURL: castaiApiUrl,
            clusterID: eksClusterConnection.id,
            provider: "aws",
        },
    },
}, {
    provider: k8sProvider,
    dependsOn: [clusterController],
    customTimeouts: {
        create: "5m",
        update: "5m",
        delete: "5m",
    },
});

// Install evictor (Phase 2 component)
const castaiEvictor = new k8s.helm.v3.Release("castai-evictor", {
    name: "castai-evictor",
    chart: "castai-evictor",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: false,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        replicaCount: 1,
        managedByCASTAI: true,
    },
}, {
    provider: k8sProvider,
    dependsOn: [clusterController, castaiSpotHandler],
    customTimeouts: {
        create: "5m",
        update: "5m",
        delete: "5m",
    },
});

// Install pod pinner (Phase 2 component)
const castaiPodPinner = new k8s.helm.v3.Release("castai-pod-pinner", {
    name: "castai-pod-pinner",
    chart: "castai-pod-pinner",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: false,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        castai: {
            apiKey: castaiApiToken,
            clusterID: eksClusterConnection.id,
        },
        replicaCount: 0,
    },
}, {
    provider: k8sProvider,
    dependsOn: [clusterController],
    customTimeouts: {
        create: "5m",
        update: "5m",
        delete: "5m",
    },
});

// ============================================================================
// Exports
// ============================================================================

export const clusterName = eksClusterName;
export const clusterId = eksClusterConnection.id;
export const castaiRoleArn = castaiRole.arn;
export const controllerHelmRelease = clusterController.name;
export const evictorHelmRelease = castaiEvictor.name;
export const podPinnerHelmRelease = castaiPodPinner.name;
