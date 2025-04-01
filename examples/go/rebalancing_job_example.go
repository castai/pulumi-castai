package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai" // Assuming main package
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runRebalancingJobExample demonstrates creating a rebalancing job.
// Renamed from main to avoid conflicts.
func runRebalancingJobExample(ctx *pulumi.Context) error {
	// Placeholder: Assume these IDs are obtained from other resources
	// e.g., from cluster and schedule resources
	clusterId := pulumi.String("your-cluster-id")
	scheduleId := pulumi.String("your-rebalancing-schedule-id")

	rebalancingJob, err := castai.NewRebalancingJob(ctx, "example-go-rebalancing-job", &castai.RebalancingJobArgs{
		ClusterId:             clusterId,
		RebalancingScheduleId: scheduleId,
		Enabled:               pulumi.Bool(true), // Set to false to disable the job
	})
	if err != nil {
		return err
	}

	// Export the job ID
	ctx.Export("rebalancing_job_go_id", rebalancingJob.ID())

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runRebalancingJobExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
