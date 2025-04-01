import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai"; // Use your actual package name

// Placeholder: Assume these IDs are obtained from other resources
const clusterId = "your-cluster-id";
const nodeConfigurationId = "your-node-config-id";

const nodeTemplate = new castai.NodeTemplate("example-ts-node-template", {
    clusterId: clusterId,
    name: "default-ts-template",
    isEnabled: true,
    configurationId: nodeConfigurationId,
    shouldTaint: true,
    customLabels: {
        "environment": "production",
        "pulumi-managed": "true",
    },
    customTaints: [{
        key: "pulumi-dedicated",
        value: "backend",
        effect: "NoSchedule",
    }],
    constraints: {
        onDemand: true,
        spot: false,
        useSpotFallbacks: true,
        fallbackRestoreRateSeconds: 300,
        enableSpotDiversity: true,
        spotDiversityPriceIncreaseLimitPercent: 20,
        spotInterruptionPredictionsEnabled: true,
        spotInterruptionPredictionsType: "aws-rebalance-recommendations", // Or other types
        computeOptimizedState: "disabled", // enabled, disabled
        storageOptimizedState: "disabled", // enabled, disabled
        isGpuOnly: false,
        minCpu: 2,
        maxCpu: 8,
        minMemory: 4096, // MiB
        maxMemory: 16384, // MiB
        architectures: ["amd64"], // , "arm64"
        azs: ["us-east-1a", "us-east-1b"], // Adjust AZs
        burstableInstances: "disabled", // enabled, disabled
        // customerSpecific: "disabled", // Needs specific config if enabled
        instanceFamilies: {
            include: ["m5", "c5"], // Example families
            // exclude: []
        },
        // customPriority: { ... } // Optional
    },
    // isDefault: false, // Only one template can be default
});

// Export the template ID
export const nodeTemplateId = nodeTemplate.id; 