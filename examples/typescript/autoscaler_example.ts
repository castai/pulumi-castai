import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi-castai"; // Use your actual package name

// Placeholder: Assume clusterId is obtained from another resource
const clusterId = "your-cluster-id";

const autoscalerSettings = new castai.Autoscaler("example-ts-autoscaler", {
    clusterId: clusterId,
    // TF example had this nested, but the name implies top-level settings
    // Assuming the SDK might flatten this slightly or use a direct settings object
    enabled: true,
    isScopedMode: false, // Whether autoscaler only considers nodes with specific labels
    // nodeTemplatesPartialMatchingEnabled: false, // Optional

    unschedulablePods: { // Settings for handling unschedulable pods
        enabled: true,
        // headroomCpuPercentage: 10, // Optional headroom
        // headroomMemoryPercentage: 10, // Optional headroom
    },

    clusterLimits: { // Overall cluster resource limits for autoscaling
        enabled: true,
        cpu: {
            minCores: 1,
            maxCores: 50, // Example limit
        },
        // memory: { minGib: 4, maxGib: 200 }, // Optional memory limits
        // count: { minNodes: 1, maxNodes: 20}, // Optional node count limits
    },

    nodeDownscaler: { // Settings for scaling down nodes
        enabled: true,
        emptyNodes: { // Settings for removing empty nodes
            enabled: true,
            delaySeconds: 180, // Wait 3 minutes before removing empty node
        },
        evictor: { // Settings for the component that evicts pods from nodes to allow downscaling
            enabled: true,
            // dryRun: false, // Optional: Simulate eviction without actual changes
            // aggressiveMode: false, // Optional: More aggressive eviction strategy
            // scopedMode: false, // Optional: Evictor only considers nodes with specific labels
            // cycleInterval: "60s", // Optional: How often evictor runs
            // nodeGracePeriodMinutes: 10, // Optional: Grace period before node is eligible for eviction
            // podEvictionFailureBackOffInterval: "30s", // Optional: Backoff interval if pod eviction fails
            // ignorePodDisruptionBudgets: false, // Optional: Whether to ignore PDBs
        },
    },
});

// Export the ID (often the cluster ID itself for singleton resources like this)
export const autoscalerResourceId = autoscalerSettings.id; // Or potentially clusterId if it modifies in place 