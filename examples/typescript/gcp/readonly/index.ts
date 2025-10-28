/**
 * CAST AI GKE Read-Only Example (Phase 1)
 *
 * This example connects an existing GKE cluster to CAST AI in read-only mode
 * using the high-level CastAiGkeCluster component. CAST AI will monitor your
 * cluster and provide optimization recommendations without making any changes.
 *
 * Prerequisites:
 * - Existing GKE cluster
 * - GCP credentials configured (gcloud auth application-default login)
 * - kubectl configured to access the cluster
 * - CAST AI API token
 *
 * Required environment variables:
 * - CASTAI_API_TOKEN: Your CAST AI API token
 * - GKE_CLUSTER_NAME: Name of your existing GKE cluster
 * - GCP_PROJECT_ID: GCP project ID
 * - GKE_LOCATION: GCP location (zone or region, e.g., us-central1-a or us-central1)
 */

import * as pulumi from "@pulumi/pulumi";
import { CastAiGkeCluster } from "../../../../components/gke-cluster/typescript";

// Configuration
const castaiApiToken = process.env.CASTAI_API_TOKEN!;
const clusterName = process.env.GKE_CLUSTER_NAME!;
const projectId = process.env.GCP_PROJECT_ID!;
const location = process.env.GKE_LOCATION!;

if (!castaiApiToken || !clusterName || !projectId || !location) {
    throw new Error("Missing required environment variables: CASTAI_API_TOKEN, GKE_CLUSTER_NAME, GCP_PROJECT_ID, GKE_LOCATION");
}

// Connect cluster to CAST AI in read-only mode
const cluster = new CastAiGkeCluster("castai-cluster", {
    clusterName: clusterName,
    location: location,
    projectId: projectId,
    apiToken: castaiApiToken,

    // KEY: Enable read-only mode (Phase 1 only - monitoring)
    readOnlyMode: true,
});

// Export useful information
export const clusterId = cluster.clusterId;
export const clusterToken = pulumi.secret(cluster.clusterToken);

export const message = pulumi.interpolate`
✅ CAST AI agent installed successfully in READ-ONLY mode!

Your GKE cluster "${clusterName}" is now connected to CAST AI for monitoring.

Next steps:
1. Log in to CAST AI console: https://console.cast.ai
2. Navigate to your cluster to see optimization recommendations
3. Review the recommendations and cost savings potential

Note: In read-only mode, CAST AI will NOT make any changes to your cluster.
It will only provide recommendations and cost analysis.

To enable full cluster management (Phase 2):
- Set readOnlyMode: false and provide subnets/networkTags
- Or use the 'full-onboarding' example
`;
