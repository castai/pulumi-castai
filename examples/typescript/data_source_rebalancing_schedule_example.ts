import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi-castai"; // Use your actual package name

// Placeholder: Replace with the actual name of the rebalancing schedule to fetch.
const scheduleName = "my-existing-rebalancing-schedule";

// Assuming the invoke is directly under castai
const scheduleInfo = castai.getRebalancingSchedule({
    name: scheduleName,
});

// Export details retrieved from the data source.
// Adjust the exported properties based on what the data source actually returns.
export const retrievedScheduleId = scheduleInfo.then(info => info.id);
export const retrievedScheduleName = scheduleInfo.then(info => info.name);
// Example: export const retrievedScheduleCron = scheduleInfo.then(info => info.schedule?.cron); 