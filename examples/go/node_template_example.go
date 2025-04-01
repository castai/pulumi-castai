package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai" // Assuming main package
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runNodeTemplateExample demonstrates creating a node template.
// Renamed from main to avoid conflicts.
func runNodeTemplateExample(ctx *pulumi.Context) error {
	// Placeholder: Assume these IDs are obtained from other resources
	clusterId := pulumi.String("your-cluster-id")
	nodeConfigurationId := pulumi.String("your-node-config-id")

	nodeTemplate, err := castai.NewNodeTemplate(ctx, "example-go-node-template", &castai.NodeTemplateArgs{
		ClusterId:       clusterId,
		Name:            pulumi.String("default-go-template"),
		IsEnabled:       pulumi.Bool(true),
		ConfigurationId: nodeConfigurationId,
		ShouldTaint:     pulumi.Bool(true),
		CustomLabels: pulumi.StringMap{
			"environment":    pulumi.String("production"),
			"pulumi-managed": pulumi.String("true"),
		},
		CustomTaints: castai.NodeTemplateCustomTaintArray{
			&castai.NodeTemplateCustomTaintArgs{
				Key:    pulumi.String("pulumi-dedicated"),
				Value:  pulumi.String("backend"),
				Effect: pulumi.String("NoSchedule"),
			},
		},
		Constraints: &castai.NodeTemplateConstraintsArgs{
			OnDemand:                               pulumi.Bool(true),
			Spot:                                   pulumi.Bool(false),
			UseSpotFallbacks:                       pulumi.Bool(true),
			FallbackRestoreRateSeconds:             pulumi.Int(300),
			EnableSpotDiversity:                    pulumi.Bool(true),
			SpotDiversityPriceIncreaseLimitPercent: pulumi.Int(20),
			SpotInterruptionPredictionsEnabled:     pulumi.Bool(true),
			SpotInterruptionPredictionsType:        pulumi.String("aws-rebalance-recommendations"), // Or other types
			ComputeOptimizedState:                  pulumi.String("disabled"),                      // enabled, disabled
			StorageOptimizedState:                  pulumi.String("disabled"),                      // enabled, disabled
			IsGpuOnly:                              pulumi.Bool(false),
			MinCpu:                                 pulumi.Int(2),
			MaxCpu:                                 pulumi.Int(8),
			MinMemory:                              pulumi.Int(4096),                                                             // MiB
			MaxMemory:                              pulumi.Int(16384),                                                            // MiB
			Architectures:                          pulumi.StringArray{pulumi.String("amd64")},                                   // , "arm64"
			Azs:                                    pulumi.StringArray{pulumi.String("us-east-1a"), pulumi.String("us-east-1b")}, // Adjust AZs
			BurstableInstances:                     pulumi.String("disabled"),                                                    // enabled, disabled
			// CustomerSpecific:                   pulumi.String("disabled"), // Needs specific config if enabled
			InstanceFamilies: &castai.NodeTemplateConstraintsInstanceFamiliesArgs{
				Include: pulumi.StringArray{pulumi.String("m5"), pulumi.String("c5")}, // Example families
				// Exclude: pulumi.StringArray{},
			},
			// CustomPriority: &castai.NodeTemplateConstraintsCustomPriorityArgs{...}, // Optional
		},
		// IsDefault:       pulumi.Bool(false), // Only one template can be default
	})
	if err != nil {
		return err
	}

	// Export the template ID
	ctx.Export("node_template_go_id", nodeTemplate.ID())

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runNodeTemplateExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
