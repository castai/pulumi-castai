package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai" // Assuming main package
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runEvictorAdvancedConfigExample demonstrates evictor config.
// Renamed from main to avoid conflicts.
func runEvictorAdvancedConfigExample(ctx *pulumi.Context) error {
	// Placeholder: Assume clusterId is obtained from another resource
	clusterId := pulumi.String("your-cluster-id")

	evictorConfig, err := castai.NewEvictorAdvancedConfig(ctx, "example-go-evictor-config", &castai.EvictorAdvancedConfigArgs{
		ClusterId: clusterId,
		// This might be an array or a single object, based on SDK structure
		// Assuming array based on plural name 'EvictorAdvancedConfig'
		EvictorAdvancedConfig: castai.EvictorAdvancedConfigEvictorAdvancedConfigArray{
			&castai.EvictorAdvancedConfigEvictorAdvancedConfigArgs{
				PodSelector: &castai.EvictorAdvancedConfigEvictorAdvancedConfigPodSelectorArgs{
					Kind:      pulumi.String("Job"),
					Namespace: pulumi.String("batch-jobs"), // Example namespace
					MatchLabels: pulumi.StringMap{
						"app.kubernetes.io/component": pulumi.String("processor"),
					},
				},
				Aggressive: pulumi.Bool(true), // Evict matching pods more aggressively
			},
			&castai.EvictorAdvancedConfigEvictorAdvancedConfigArgs{
				PodSelector: &castai.EvictorAdvancedConfigEvictorAdvancedConfigPodSelectorArgs{
					Namespace: pulumi.String("critical-services"),
					MatchLabels: pulumi.StringMap{
						"priority": pulumi.String("high"),
					},
				},
				Aggressive: pulumi.Bool(false), // Be less aggressive for these pods
			},
		},
	})
	if err != nil {
		return err
	}

	// Export the ID
	ctx.Export("evictor_config_go_id", evictorConfig.ID())

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runEvictorAdvancedConfigExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
