/**
 * CAST AI GKE Full Onboarding Example (Phase 1 + Phase 2)
 *
 * This example connects an existing GKE cluster to CAST AI with full management
 * capabilities using the high-level CastAiGkeCluster component.
 *
 * What this example does:
 * - Phase 1: Registers cluster and installs castai-agent for monitoring
 * - Phase 2: Sets up IAM infrastructure (service account, roles) and enables full cluster management
 * - Creates default node configuration with subnets and network tags
 * - Installs all necessary Helm charts (agent, controller, spot-handler, evictor, pod-pinner)
 * - Optionally creates custom node configurations and templates
 * - Configures autoscaler policies for cost optimization
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
 *
 * Optional environment variables:
 * - CASTAI_API_URL: CAST AI API URL (defaults to https://api.cast.ai)
 * - DELETE_NODES_ON_DISCONNECT: Remove nodes when disconnecting (defaults to false)
 */

import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as castai from "@castai/pulumi";
import { CastAiGkeCluster } from "../../../../components/gke-cluster/typescript";

// ============================================================================
// Configuration
// ============================================================================

const castaiApiToken = process.env.CASTAI_API_TOKEN!;
const clusterName = process.env.GKE_CLUSTER_NAME!;
const projectId = process.env.GCP_PROJECT_ID!;
const location = process.env.GKE_LOCATION!;
const castaiApiUrl = process.env.CASTAI_API_URL;
const deleteNodesOnDisconnect = process.env.DELETE_NODES_ON_DISCONNECT === "true";

if (!castaiApiToken || !clusterName || !projectId || !location) {
    throw new Error("Missing required environment variables: CASTAI_API_TOKEN, GKE_CLUSTER_NAME, GCP_PROJECT_ID, GKE_LOCATION");
}

// ============================================================================
// Get GKE Cluster Information
// ============================================================================

// Get GKE cluster details
const gkeCluster = pulumi.output(gcp.container.getCluster({
    name: clusterName,
    location: location,
    project: projectId,
}));

// Extract networking information
const network = gkeCluster.network;
const subnetwork = gkeCluster.subnetwork;

// ============================================================================
// Connect Cluster to CAST AI (Full Management)
// ============================================================================

const cluster = new CastAiGkeCluster("castai-cluster", {
    clusterName: clusterName,
    location: location,
    projectId: projectId,
    apiToken: castaiApiToken,
    apiUrl: castaiApiUrl,

    // Networking configuration for CAST AI provisioned nodes
    // The component automatically creates a default node configuration
    // with these subnets and network tags
    subnets: [subnetwork],
    networkTags: ["castai-managed"],

    // Cluster management settings
    deleteNodesOnDisconnect: deleteNodesOnDisconnect,

    // Optional: Add custom tags to all CAST AI provisioned nodes
    tags: {
        "managed-by": "castai",
        "environment": "production",
    },

    // Optional: Enable additional features
    installWorkloadAutoscaler: false,
    installSecurityAgent: false,
});

// ============================================================================
// Optional: Create Additional Node Configurations
// ============================================================================
//
// The component automatically creates a "default" node configuration.
// You can create additional custom configurations with different settings.
//
// Common use cases:
// - GPU-optimized nodes with specific machine types
// - High-throughput nodes with custom disk configurations
// - Nodes with custom GKE settings
// - Different subnet configurations for different workloads
//
// Uncomment the example below to add a custom configuration:

const customNodeConfig = new castai.config.NodeConfiguration("custom-config", {
    clusterId: cluster.clusterId,
    name: "gpu-nodes",  // Custom name for this configuration
    subnets: [subnetwork],
    tags: {
        "node-type": "gpu-optimized",
        "environment": "production",
    },

    // Minimum disk size in GiB
    minDiskSize: 100,

    // GKE-specific configuration
    gke: {
        diskType: "pd-ssd",  // Use SSD persistent disk for better performance
        networkTags: ["castai-managed", "gpu-nodes"],
        maxPodsPerNode: 110,
    },
}, {
    dependsOn: [cluster],
});

// ============================================================================
// Optional: Create Node Templates
// ============================================================================
//
// Node templates define instance selection criteria for autoscaling.
// They reference node configurations and add constraints on instance types.

const spotTemplate = new castai.config.NodeTemplate("spot-template", {
    clusterId: cluster.clusterId,
    name: "spot-instances",
    configurationId: customNodeConfig.id,  // Use the gpu-nodes config
    isEnabled: true,

    // Custom labels and taints for spot nodes
    customLabels: {
        "workload-type": "batch",
        "spot": "true",
    },
    shouldTaint: true,
    customTaints: [{
        key: "scheduling.cast.ai/spot",
        value: "true",
        effect: "NoSchedule",
    }],

    // Instance constraints for spot template
    constraints: {
        // Allow spot (preemptible) instances
        fallbackRestoreRateSeconds: 1800,
        spot: true,
        onDemand: false,

        // Use spot diversity to balance cost and availability
        enableSpotDiversity: true,
        spotDiversityPriceIncreaseLimitPercent: 20,

        // Architecture preferences
        architectures: ["amd64"],

        // CPU constraints
        computeOptimizedState: "enabled",
        minCpu: 2,
        maxCpu: 16,
        minMemory: 4096,  // 4 GiB
        maxMemory: 65536,  // 64 GiB

        // Instance families (GCP)
        instanceFamilies: {
            includes: [
                "c2", "c2d",      // Compute optimized
                "n2", "n2d",      // General purpose
                "e2",             // Cost-optimized
            ],
        },
    },
}, {
    dependsOn: [customNodeConfig],
});

// ============================================================================
// Configure Autoscaler Settings
// ============================================================================
//
// Configure CAST AI autoscaler policies for cluster optimization.

const autoscaler = new castai.Autoscaler("autoscaler", {
    clusterId: cluster.clusterId,

    autoscalerSettings: {
        enabled: true,

        // Unschedulable pods policy - add nodes when pods can't be scheduled
        unschedulablePods: {
            enabled: true,
            // Note: headroom and headroomSpot are deprecated
            // See: https://docs.cast.ai/docs/autoscaler-1#cluster-headroom
        },

        // Node downscaler - remove underutilized nodes
        nodeDownscaler: {
            enabled: true,
            emptyNodes: {
                enabled: true,
                delaySeconds: 300,  // Wait 5 minutes before removing empty nodes
            },
            evictor: {
                enabled: true,
                dryRun: false,
                aggressiveMode: false,
                scopedMode: true,  // Only CAST AI managed nodes
                cycleInterval: "5m",
                nodeGracePeriodMinutes: 10,
                podEvictionFailureBackOffInterval: "1m",
                ignorePodDisruptionBudgets: false,
            },
        },

        // Cluster resource limits
        clusterLimits: {
            enabled: true,
            cpu: {
                minCores: 4,   // Minimum 4 vCPUs
                maxCores: 100, // Maximum 100 vCPUs
            },
        },
    },
}, {
    dependsOn: [cluster, spotTemplate],
});

/*
// Additional GKE options available (not shown above):
// - gke.diskType: "pd-standard", "pd-ssd", "pd-balanced"
// - gke.minCpuPlatform: Minimum CPU platform (e.g., "Intel Cascade Lake")
// - gke.useEphemeralStorageLocalSsd: Use local SSD for ephemeral storage
// - gke.localSsdCount: Number of local SSDs to attach
// - gke.reservations: Consumption reservations
// - containerRuntime: "dockerd" or "containerd"
// - initScript: Base64-encoded init script
// - sshPublicKey: SSH public key for node access
// - diskCpuRatio: GiB per CPU ratio
// - drainTimeoutSec: Node drain timeout
//
// See: /Users/leonkuperman/LKDev/CAST/pulumi-castai/sdk/nodejs/config/nodeConfiguration.d.ts
*/

// ============================================================================
// Exports
// ============================================================================

export const clusterId = cluster.clusterId;
export const clusterToken = pulumi.secret(cluster.clusterToken);
export const serviceAccountEmail = cluster.serviceAccountEmail;
export const customNodeConfigId = customNodeConfig.id;
export const customNodeConfigName = customNodeConfig.name;
export const spotTemplateId = spotTemplate.id;
export const spotTemplateName = spotTemplate.name;
export const autoscalerEnabled = autoscaler.autoscalerSettings.apply(s => s?.enabled ?? false);

export const message = pulumi.interpolate`
✅ CAST AI full onboarding complete with autoscaling enabled!

Your GKE cluster "${clusterName}" is now fully connected to CAST AI.

Resources created:
- Cluster ID: ${clusterId}
- Service Account: ${serviceAccountEmail}
- Node Configurations: default, ${customNodeConfigName}
- Node Templates: ${spotTemplateName}
- Autoscaler: ENABLED with policies configured

Autoscaler policies configured:
- Unschedulable pods: Enabled
- Node downscaler: Enabled (empty nodes + evictor)
- Cluster limits: 4-100 vCPUs

Next steps:
1. Log in to CAST AI console: https://console.cast.ai
2. Navigate to your cluster
3. Review node configurations, templates, and autoscaler policies
4. Monitor the cluster as CAST AI optimizes your infrastructure
5. Deploy workloads and watch CAST AI scale automatically

Note: Autoscaling is ENABLED and will actively manage your cluster.
CAST AI will add/remove nodes based on workload demands and configured policies.
`;
