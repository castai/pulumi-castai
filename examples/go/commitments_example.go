package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai" // Assuming main package
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runCommitmentsExample demonstrates creating commitments and reservations.
// Renamed from main to avoid conflicts.
func runCommitmentsExample(ctx *pulumi.Context) error {
	// Placeholder: Assume clusterId is obtained from an existing cluster resource
	// e.g., eksCluster, err := aws.NewEksCluster(ctx, ...)
	// clusterId := eksCluster.ID()
	clusterId := pulumi.String("your-cluster-id") // Replace with a valid cluster ID

	// Create a commitment plan
	commitments, err := castai.NewCommitments(ctx, "example-go-commitments", &castai.CommitmentsArgs{
		Name:                  pulumi.String("production-go-commitments"),
		AutoApply:             pulumi.Bool(true),
		AutoApplyLabel:        pulumi.String("environment=production"),
		ComputeUnitHourlyRate: pulumi.Float64(0.0294), // Example rate, replace with actual value
		Instances: castai.CommitmentsInstanceArray{
			&castai.CommitmentsInstanceArgs{
				ClusterId:    clusterId,
				ComputeUnits: pulumi.Int(100),
				StartDate:    pulumi.String("2024-01-01T00:00:00Z"), // Adjust dates as needed
				EndDate:      pulumi.String("2024-12-31T23:59:59Z"),
			},
		},
	})
	if err != nil {
		return err
	}

	// Create a reservation of compute instances
	reservations, err := castai.NewReservations(ctx, "example-go-reservations", &castai.ReservationsArgs{
		ClusterId: clusterId,
		Instances: castai.ReservationsInstanceArray{
			&castai.ReservationsInstanceArgs{
				InstanceType: pulumi.String("m5.2xlarge"),
				Provider:     pulumi.String("aws"),        // Or gcp, azure
				Zone:         pulumi.String("us-west-2a"), // Adjust zone
				SpotInstance: pulumi.Bool(false),
				Count:        pulumi.Int(3),
				StartDate:    pulumi.String("2024-01-01T00:00:00Z"), // Adjust dates
				EndDate:      pulumi.String("2024-06-30T23:59:59Z"),
				Labels: pulumi.StringMap{
					"reserved": pulumi.String("true"),
					"workload": pulumi.String("database"),
				},
				Taints: castai.ReservationsInstanceTaintArray{
					&castai.ReservationsInstanceTaintArgs{
						Key:    pulumi.String("reserved"),
						Value:  pulumi.String("database"),
						Effect: pulumi.String("NoSchedule"),
					},
				},
			},
		},
		// NodeConfigurationId: pulumi.String("your-node-config-id"), // Optional
	})
	if err != nil {
		return err
	}

	// Export commitment and reservation IDs
	ctx.Export("commitment_go_id", commitments.ID())
	ctx.Export("reservation_go_id", reservations.ID())

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runCommitmentsExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
