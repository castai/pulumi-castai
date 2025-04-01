package main

import (
	"encoding/json"

	"github.com/castai/pulumi-castai/sdk/go/castai" // Assuming main package
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runRebalancingScheduleResourceExample demonstrates the schedule resource.
// Renamed from main to avoid conflicts.
func runRebalancingScheduleResourceExample(ctx *pulumi.Context) error {

	selectorJSON, _ := json.Marshal(map[string]interface{}{
		"nodeSelectorTerms": []map[string]interface{}{{
			"matchExpressions": []map[string]interface{}{{
				"key":      "scheduling.cast.ai/spot",
				"operator": "Exists",
			}},
		}},
	})

	spotSchedule, err := castai.NewRebalancingSchedule(ctx, "example-go-spot-schedule", &castai.RebalancingScheduleArgs{
		Name: pulumi.String("rebalance-go-spots-hourly"),
		Schedule: &castai.RebalancingScheduleScheduleArgs{
			Cron: pulumi.String("0 * * * *"), // Every hour at minute 0
		},
		TriggerConditions: &castai.RebalancingScheduleTriggerConditionsArgs{
			SavingsPercentage: pulumi.Int(15), // Trigger if potential savings > 15%
		},
		LaunchConfiguration: &castai.RebalancingScheduleLaunchConfigurationArgs{
			NodeTtlSeconds:   pulumi.Int(600), // Only consider nodes older than 10 minutes
			NumTargetedNodes: pulumi.Int(5),   // Target up to 5 nodes per run
			// RebalancingMinNodes:    pulumi.Int(2),    // Optional: Minimum nodes to keep
			// KeepDrainTimeoutNodes: pulumi.Bool(false), // Optional
			Selector: pulumi.String(string(selectorJSON)), // Node selector as a JSON string
			ExecutionConditions: &castai.RebalancingScheduleLaunchConfigurationExecutionConditionsArgs{
				Enabled: pulumi.Bool(true),
				// AchievedSavingsPercentage: pulumi.Int(5), // Optional: Only execute if savings > 5%
			},
		},
	})
	if err != nil {
		return err
	}

	// Export the schedule ID
	ctx.Export("spot_schedule_go_id", spotSchedule.ID())

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runRebalancingScheduleResourceExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
