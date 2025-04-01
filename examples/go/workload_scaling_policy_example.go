package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai/workload" // Assuming workload module
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runWorkloadScalingPolicyExample demonstrates creating a workload scaling policy.
// Renamed from main to avoid conflicts.
func runWorkloadScalingPolicyExample(ctx *pulumi.Context) error {
	// Placeholder: Assume clusterId is obtained from an existing cluster resource
	// e.g., eksCluster, err := aws.NewEksCluster(ctx, ...)
	// clusterId := eksCluster.ID()
	clusterId := pulumi.String("your-cluster-id") // Replace with a valid cluster ID

	// Create a workload scaling policy
	scalingPolicy, err := workload.NewScalingPolicy(ctx, "example-go-scaling-policy", &workload.ScalingPolicyArgs{
		ClusterId: clusterId,
		Name:      pulumi.String("web-services-go-scaling"),
		Enabled:   pulumi.Bool(true),
		NamespaceSelector: &workload.ScalingPolicyNamespaceSelectorArgs{
			MatchLabels: pulumi.StringMap{
				"environment": pulumi.String("production"),
			},
		},
		Metrics: workload.ScalingPolicyMetricArray{
			&workload.ScalingPolicyMetricArgs{
				Type:         pulumi.String("cpu"),
				Weight:       pulumi.Int(70),
				StableWindow: pulumi.String("5m"),
				Threshold: &workload.ScalingPolicyMetricThresholdArgs{
					UtilizationPercentage: pulumi.Int(80),
				},
			},
			&workload.ScalingPolicyMetricArgs{
				Type:         pulumi.String("memory"),
				Weight:       pulumi.Int(30),
				StableWindow: pulumi.String("5m"),
				Threshold: &workload.ScalingPolicyMetricThresholdArgs{
					UtilizationPercentage: pulumi.Int(75),
				},
			},
		},
		VerticalScaling: &workload.ScalingPolicyVerticalScalingArgs{
			Enabled: pulumi.Bool(true),
			Vpa: &workload.ScalingPolicyVerticalScalingVpaArgs{
				UpdateMode: pulumi.String("Auto"),
				MinAllowed: &workload.ScalingPolicyVerticalScalingVpaMinAllowedArgs{
					Cpu:    pulumi.String("100m"),
					Memory: pulumi.String("128Mi"),
				},
				MaxAllowed: &workload.ScalingPolicyVerticalScalingVpaMaxAllowedArgs{
					Cpu:    pulumi.String("4"),
					Memory: pulumi.String("8Gi"),
				},
				ControlledResources: pulumi.StringArray{
					pulumi.String("cpu"),
					pulumi.String("memory"),
				},
			},
		},
		HorizontalScaling: &workload.ScalingPolicyHorizontalScalingArgs{
			Enabled: pulumi.Bool(true),
			Hpa: &workload.ScalingPolicyHorizontalScalingHpaArgs{
				MinReplicas: pulumi.Int(2),
				MaxReplicas: pulumi.Int(10),
				Behavior: &workload.ScalingPolicyHorizontalScalingHpaBehaviorArgs{
					ScaleDown: &workload.ScalingPolicyHorizontalScalingHpaBehaviorScaleDownArgs{
						StabilizationWindowSeconds: pulumi.Int(300),
						Policies: workload.ScalingPolicyHorizontalScalingHpaBehaviorScaleDownPolicyArray{
							&workload.ScalingPolicyHorizontalScalingHpaBehaviorScaleDownPolicyArgs{
								Type:          pulumi.String("Percent"),
								Value:         pulumi.Int(10),
								PeriodSeconds: pulumi.Int(60),
							},
						},
					},
					ScaleUp: &workload.ScalingPolicyHorizontalScalingHpaBehaviorScaleUpArgs{
						StabilizationWindowSeconds: pulumi.Int(0),
						Policies: workload.ScalingPolicyHorizontalScalingHpaBehaviorScaleUpPolicyArray{
							&workload.ScalingPolicyHorizontalScalingHpaBehaviorScaleUpPolicyArgs{
								Type:          pulumi.String("Percent"),
								Value:         pulumi.Int(100),
								PeriodSeconds: pulumi.Int(15),
							},
						},
					},
				},
			},
		},
	})
	if err != nil {
		return err
	}

	// Export the policy ID
	ctx.Export("policy_go_id", scalingPolicy.ID())

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runWorkloadScalingPolicyExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
