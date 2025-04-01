package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai" // Assuming main package
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runDataSourceGkeUserPoliciesExample demonstrates fetching GKE user policies data.
// Renamed from main to avoid conflicts.
func runDataSourceGkeUserPoliciesExample(ctx *pulumi.Context) error {

	// Assuming LookupGkeUserPolicies is directly under castai and takes nil args
	gkePolicies, err := castai.LookupGkeUserPolicies(ctx, nil) // Pass nil for no arguments
	if err != nil {
		return err
	}

	// Export details retrieved from the data source.
	// Adjust exported properties based on the actual return value.
	// It might return a JSON string or a structured object.
	ctx.Export("retrieved_gke_policies", pulumi.String(gkePolicies.PolicyJson)) // Example property name
	// Or perhaps ctx.Export("retrieved_gke_policies", gkePolicies.Policies)

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runDataSourceGkeUserPoliciesExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
