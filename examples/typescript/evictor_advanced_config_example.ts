import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi-castai"; // Use your actual package name

// Placeholder: Assume clusterId is obtained from another resource
const clusterId = "your-cluster-id";

const evictorConfig = new castai.EvictorAdvancedConfig("example-ts-evictor-config", {
    clusterId: clusterId,
    evictorAdvancedConfig: [{ // This might be an array or a single object, TF example shows one block
        podSelector: {
            kind: "Job",
            namespace: "batch-jobs", // Example namespace
            matchLabels: {
                "app.kubernetes.io/component": "processor",
            },
        },
        aggressive: true, // Evict matching pods more aggressively
    }, { // Example of another config block
       podSelector: {
            namespace: "critical-services",
             matchLabels: {
                "priority": "high",
            },
       },
       aggressive: false, // Be less aggressive for these pods
    }],
});

// Export the ID (might not be directly useful, but shows resource creation)
export const evictorConfigId = evictorConfig.id; 