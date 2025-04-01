package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai" // Assuming main package
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runAutoscalerExample demonstrates autoscaler configuration.
// Renamed from main to avoid conflicts.
func runAutoscalerExample(ctx *pulumi.Context) error {
	// Placeholder: Assume clusterId is obtained from another resource
	clusterId := pulumi.String("your-cluster-id")

	autoscalerSettings, err := castai.NewAutoscaler(ctx, "example-go-autoscaler", &castai.AutoscalerArgs{
		ClusterId:    clusterId,
		Enabled:      pulumi.Bool(true),
		IsScopedMode: pulumi.Bool(false), // Whether autoscaler only considers nodes with specific labels
		// NodeTemplatesPartialMatchingEnabled: pulumi.Bool(false), // Optional

		UnschedulablePods: &castai.AutoscalerUnschedulablePodsArgs{
			Enabled: pulumi.Bool(true),
			// HeadroomCpuPercentage: pulumi.Int(10), // Optional headroom
			// HeadroomMemoryPercentage: pulumi.Int(10), // Optional headroom
		},

		ClusterLimits: &castai.AutoscalerClusterLimitsArgs{
			Enabled: pulumi.Bool(true),
			Cpu: &castai.AutoscalerClusterLimitsCpuArgs{
				MinCores: pulumi.Int(1),
				MaxCores: pulumi.Int(50), // Example limit
			},
			// Memory: &castai.AutoscalerClusterLimitsMemoryArgs{ MinGib: pulumi.Int(4), MaxGib: pulumi.Int(200) }, // Optional
			// Count: &castai.AutoscalerClusterLimitsCountArgs{ MinNodes: pulumi.Int(1), MaxNodes: pulumi.Int(20) }, // Optional
		},

		NodeDownscaler: &castai.AutoscalerNodeDownscalerArgs{
			Enabled: pulumi.Bool(true),
			EmptyNodes: &castai.AutoscalerNodeDownscalerEmptyNodesArgs{
				Enabled:      pulumi.Bool(true),
				DelaySeconds: pulumi.Int(180), // Wait 3 minutes before removing empty node
			},
			Evictor: &castai.AutoscalerNodeDownscalerEvictorArgs{
				Enabled: pulumi.Bool(true),
				// DryRun:                               pulumi.Bool(false), // Optional: Simulate eviction
				// AggressiveMode:                       pulumi.Bool(false), // Optional
				// ScopedMode:                           pulumi.Bool(false), // Optional
				// CycleInterval:                        pulumi.String("60s"), // Optional
				// NodeGracePeriodMinutes:              pulumi.Int(10),    // Optional
				// PodEvictionFailureBackOffInterval:     pulumi.String("30s"), // Optional
				// IgnorePodDisruptionBudgets:          pulumi.Bool(false), // Optional
			},
		},
	})
	if err != nil {
		return err
	}

	// Export the ID
	ctx.Export("autoscaler_go_resource_id", autoscalerSettings.ID())

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runAutoscalerExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
