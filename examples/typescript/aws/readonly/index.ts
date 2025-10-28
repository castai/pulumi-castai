/**
 * CAST AI EKS Read-Only Example (Phase 1)
 *
 * This example connects an existing EKS cluster to CAST AI in read-only mode
 * using the high-level CastAiEksCluster component. CAST AI will monitor your
 * cluster and provide optimization recommendations without making any changes.
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

// Connect cluster to CAST AI in read-only mode
const cluster = new CastAiEksCluster("castai-cluster", {
    clusterName: clusterName,
    region: region,
    accountId: accountId,
    apiToken: castaiApiToken,

    // KEY: Enable read-only mode (Phase 1 only - monitoring)
    readOnlyMode: true,
});

// Export useful information
export const clusterId = cluster.clusterId;
export const clusterToken = pulumi.secret(cluster.clusterToken);

export const message = pulumi.interpolate`
✅ CAST AI agent installed successfully in READ-ONLY mode!

Your EKS cluster "${clusterName}" is now connected to CAST AI for monitoring.

Next steps:
1. Log in to CAST AI console: https://console.cast.ai
2. Navigate to your cluster to see optimization recommendations
3. Review the recommendations and cost savings potential

Note: In read-only mode, CAST AI will NOT make any changes to your cluster.
It will only provide recommendations and cost analysis.

To enable full cluster management (Phase 2):
- Set readOnlyMode: false and provide subnets/securityGroups
- Or use the 'basic' or 'full-onboarding' examples
`;
