package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai/organization" // Adjust import path if needed
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runDataSourceOrganizationExample demonstrates fetching organization data.
// Renamed from main to avoid conflicts.
func runDataSourceOrganizationExample(ctx *pulumi.Context) error {
	// Placeholder: Replace with the actual name of the organization you want to fetch.
	// This might come from config or be hardcoded for the example.
	organizationName := "my-castai-organization-name"

	// Using LookupOrganization based on common Go SDK patterns for data sources.
	// It typically takes context and an Args struct.
	orgInfo, err := organization.LookupOrganization(ctx, &organization.LookupOrganizationArgs{
		Name: organizationName,
	})
	if err != nil {
		return err
	}

	// Export the Organization ID retrieved from the data source.
	// Access attributes directly from the returned struct pointer.
	ctx.Export("retrieved_organization_id", pulumi.String(orgInfo.Id))
	// You can export other retrieved attributes as needed
	ctx.Export("retrieved_organization_name", pulumi.String(orgInfo.Name))

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runDataSourceOrganizationExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
