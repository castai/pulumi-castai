/**
 * CAST AI EKS Basic Example
 *
 * This example shows the simplest way to connect an existing EKS cluster to CAST AI
 * using the high-level CastAiEksCluster component.
 *
 * Prerequisites:
 * - Existing EKS cluster
 * - AWS credentials configured
 * - kubectl configured to access the cluster
 * - CAST AI API token
 *
 * Required environment variables:
 * - CASTAI_API_TOKEN: Your CAST AI API token
 * - EKS_CLUSTER_NAME: Name of your existing EKS cluster
 * - AWS_REGION: AWS region (e.g., us-east-1)
 */

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import { CastAiEksCluster } from "../../../../components/eks-cluster/typescript";

// Configuration
const castaiApiToken = process.env.CASTAI_API_TOKEN!;
const clusterName = process.env.EKS_CLUSTER_NAME!;
const region = process.env.AWS_REGION!;

if (!castaiApiToken || !clusterName || !region) {
    throw new Error("Missing required environment variables: CASTAI_API_TOKEN, EKS_CLUSTER_NAME, AWS_REGION");
}

// Get AWS account ID
const caller = aws.getCallerIdentity({});
const accountId = caller.then(c => c.accountId);

// Get EKS cluster details
const eksCluster = pulumi.output(aws.eks.getCluster({
    name: clusterName,
}));

// Get cluster security group and subnets
const clusterSecurityGroupId = eksCluster.vpcConfig.clusterSecurityGroupId;
const subnetIds = eksCluster.vpcConfig.subnetIds;

// Connect cluster to CAST AI
const cluster = new CastAiEksCluster("castai-cluster", {
    clusterName: clusterName,
    region: region,
    accountId: accountId,
    apiToken: castaiApiToken,

    // Networking
    subnets: subnetIds,
    securityGroups: [clusterSecurityGroupId],

    // Optional: Enable additional features
    installWorkloadAutoscaler: true,
    installEgressd: true,
    autoscalerEnabled: false, // Enable manually in CAST AI console
});

// Export useful information
export const clusterId = cluster.clusterId;
export const castaiRoleArn = cluster.castaiRoleArn;
export const instanceProfileArn = cluster.instanceProfileArn;
