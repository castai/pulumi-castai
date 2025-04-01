package main

import (
	// Assuming the lookup is directly under the main castai package
	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runDataSourceRebalancingScheduleExample demonstrates fetching rebalancing schedule data.
// Renamed from main to avoid conflicts.
func runDataSourceRebalancingScheduleExample(ctx *pulumi.Context) error {
	// Placeholder: Replace with the actual name of the schedule to fetch.
	scheduleName := "my-existing-rebalancing-schedule"

	// Assuming LookupRebalancingSchedule is directly under castai
	scheduleInfo, err := castai.LookupRebalancingSchedule(ctx, &castai.LookupRebalancingScheduleArgs{
		Name: scheduleName,
	})
	if err != nil {
		return err
	}

	// Export details retrieved from the data source.
	// Adjust the exported properties based on what the data source actually returns.
	ctx.Export("retrieved_schedule_id", pulumi.String(scheduleInfo.Id))
	ctx.Export("retrieved_schedule_name", pulumi.String(scheduleInfo.Name))
	// Example: ctx.Export("retrieved_schedule_cron", pulumi.String(scheduleInfo.Schedule.Cron)) // Access structure might vary

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runDataSourceRebalancingScheduleExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
