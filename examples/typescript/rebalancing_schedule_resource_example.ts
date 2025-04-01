import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi-castai"; // Use your actual package name

const spotSchedule = new castai.RebalancingSchedule("example-ts-spot-schedule", {
    name: "rebalance-ts-spots-hourly",
    schedule: {
        cron: "0 * * * *", // Every hour at minute 0
    },
    triggerConditions: {
        savingsPercentage: 15, // Trigger if potential savings > 15%
    },
    launchConfiguration: {
        nodeTtlSeconds: 600, // Only consider nodes older than 10 minutes
        numTargetedNodes: 5, // Target up to 5 nodes per run
        // rebalancingMinNodes: 2, // Optional: Minimum nodes to keep during rebalancing
        // keepDrainTimeoutNodes: false, // Optional
        selector: JSON.stringify({ // Node selector as a JSON string
            nodeSelectorTerms: [{
                matchExpressions: [{
                    key: "scheduling.cast.ai/spot",
                    operator: "Exists",
                }],
            }],
        }),
        executionConditions: {
            enabled: true,
            // achievedSavingsPercentage: 5, // Optional: Only execute if savings > 5%
        },
    },
});

// Export the schedule ID
export const spotScheduleId = spotSchedule.id; 