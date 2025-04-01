import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai"; // Use your actual package name

// Placeholder: Assume these IDs are obtained from other resources
// e.g., from castai.Cluster and castai.RebalancingSchedule resources
const clusterId = "your-cluster-id";
const scheduleId = "your-rebalancing-schedule-id";

const rebalancingJob = new castai.RebalancingJob("example-ts-rebalancing-job", {
    clusterId: clusterId,
    rebalancingScheduleId: scheduleId,
    enabled: true, // Set to false to disable the job
});

// Export the job ID
export const rebalancingJobId = rebalancingJob.id; 