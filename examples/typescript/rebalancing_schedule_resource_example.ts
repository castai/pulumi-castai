import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai"; // Use your actual package name if different

// Placeholder: Assume clusterId is obtained from another resource
const clusterId = "your-cluster-id";

// Create a rebalancing schedule
const rebalancingSchedule = new castai.RebalancingSchedule("example-rebalancing-schedule", {
    clusterId: clusterId,
    enabled: true,
    schedule: {
        expressions: ["0 2 * * *"],  // Run at 2 AM every day
        timezone: "UTC",
    },
    configuration: {
        analysisType: "save_money",
        rebalancingSpeed: "moderate",
        spotBackups: true,
        spotBackupRetries: 1,
        enabledNodeTemplates: ["general-purpose", "compute-optimized"],
        waveTimeout: "60m", // 60 minutes timeout
        maxSurge: 5, // Deploy up to 5 new nodes at once
        disruptionBackupNodeCount: 1, // Keep 1 backup node if spot instances are disrupted
        // maxCleanNodesToDelete: 10, // Optional, for limiting node deletion
        // allowDeleteNodes: true, // Optional, if false it doesn't delete any nodes
    },
});

// Export the schedule ID
export const rebalancingScheduleId = rebalancingSchedule.id; 