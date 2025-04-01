import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";

// Initialize the CAST AI provider
const provider = new castai.Provider("castai", {
    // API token will be read from the environment variable CASTAI_API_TOKEN
});

// Example EKS cluster configuration
const eksCluster = new castai.EksCluster("example-eks-cluster", {
    accountId: "123456789012", // Replace with your AWS account ID
    region: "us-west-2",       // Replace with your AWS region
    eksClusterName: "my-eks-cluster", // Replace with your EKS cluster name
    
    // The following values need to be replaced with actual values from your AWS account
    securityGroupId: "sg-12345678", 
    subnetIds: ["subnet-12345678", "subnet-87654321"],
});

// Configure autoscaling for the EKS cluster
const autoscaler = new castai.Autoscaler("eks-autoscaler", {
    clusterId: eksCluster.id,
    enabled: true,
    unschedulablePods: [{
        enabled: true,
    }],
    nodeDownscaler: [{
        enabled: true,
        emptyNodes: [{
            delaySeconds: 300,
        }],
    }],
});

// Example of configuring a node template for EKS
const nodeTemplate = new castai.NodeTemplate("eks-node-template", {
    clusterId: eksCluster.id,
    name: "eks-optimized-nodes",
    enabled: true,
    constraints: {
        onDemandPct: 50,
        spotPct: 50,
    },
    labels: {
        "environment": "production",
        "service": "backend"
    },
    taints: [
        {
            key: "dedicated",
            value: "backend",
            effect: "NoSchedule",
        },
    ],
});

// Setup node configuration for EKS
const nodeConfiguration = new castai.NodeConfiguration("eks-node-configuration", {
    clusterId: eksCluster.id,
    subnets: [
        {
            id: "subnet-12345678",
            zone: "us-west-2a",
        },
        {
            id: "subnet-87654321",
            zone: "us-west-2b",
        },
    ],
    securityGroups: ["sg-12345678"],
    instanceProfileArn: "arn:aws:iam::123456789012:instance-profile/eks-node-instance-profile",
    tags: {
        "ManagedBy": "CASTAI",
        "Environment": "Production"
    },
});

// Comment out unsupported AWS IAM resources
/*
// Configure AWS IAM policy and role
const awsIamPolicy = new castai.AwsIamPolicy("eks-iam-policy", {
    accountId: "123456789012", // Your AWS account ID
    policyDocument: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    "ec2:DescribeInstances",
                    "ec2:DescribeRegions",
                    "ec2:DescribeInstanceTypes",
                    "ec2:DescribeLaunchTemplateVersions",
                    "ec2:RunInstances",
                    "ec2:TerminateInstances",
                    "ec2:CreateTags",
                    "iam:PassRole",
                    "eks:DescribeCluster"
                ],
                Resource: "*"
            }
        ]
    })
});

const awsIamRole = new castai.AwsIamRole("eks-iam-role", {
    accountId: "123456789012", // Your AWS account ID
    assumeRolePolicyDocument: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: {
                    Service: "castai.com"
                },
                Action: "sts:AssumeRole",
                Condition: {
                    StringEquals: {
                        "sts:ExternalId": "${eksCluster.id}"
                    }
                }
            }
        ]
    }),
    attachedPolicies: [awsIamPolicy.arn]
});
*/

// Set up a rebalancing schedule
const rebalancingSchedule = new castai.RebalancingSchedule("eks-rebalancing-schedule", {
    clusterId: eksCluster.id,
    enabled: true,
    schedule: {
        expressions: ["0 2 * * *"], // Run at 2 AM every day
        timezone: "UTC",
    },
    configuration: {
        analysisType: "save_money",
        rebalancingSpeed: "moderate",
        spotBackups: true,
        spotBackupRetries: 1
    }
});

// Export relevant resources
export const clusterId = eksCluster.id;
export const nodeTemplateId = nodeTemplate.id;
// export const awsRoleArn = awsIamRole.arn; 