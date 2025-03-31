import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as castai from "@cast-ai/pulumi-castai";

// Create an EKS cluster
const eksCluster = new aws.eks.Cluster("my-cluster", {
    roleArn: aws.iam.getRole({ name: "eks-cluster-role" }).then(role => role.arn),
    vpcConfig: {
        subnetIds: ["subnet-12345", "subnet-67890"],
    },
});

// Connect the EKS cluster to CAST AI
const castaiCluster = new castai.aws.EksCluster("castai-eks-cluster", {
    accountId: "12345678901",
    region: "us-west-2",
    eksClusterName: eksCluster.name,
    deleteNodesOnDisconnect: true,
    tags: {
        environment: "dev",
        "managed-by": "pulumi",
    },
});

// Export the CAST AI cluster ID
export const castaiClusterId = castaiCluster.id; 