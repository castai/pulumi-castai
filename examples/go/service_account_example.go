package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai/organization" // Assuming organization module
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runServiceAccountExample demonstrates service account creation.
// Renamed from main to avoid conflicts.
func runServiceAccountExample(ctx *pulumi.Context) error {

	// Create a service account
	serviceAccount, err := organization.NewServiceAccount(ctx, "example-go-sa", &organization.ServiceAccountArgs{
		Name:        pulumi.String("ci-cd-go-automation"),
		Description: pulumi.String("Service account for Go CI/CD pipeline"),
		// Roles might be predefined strings or specific IDs
		Roles: pulumi.StringArray{
			pulumi.String("admin"),
			pulumi.String("viewer"),
		},
		// Ttl: pulumi.String("8760h"), // Optional TTL (e.g., 1 year)
	})
	if err != nil {
		return err
	}

	// Create a key for the service account
	serviceAccountKey, err := organization.NewServiceAccountKey(ctx, "example-go-sa-key", &organization.ServiceAccountKeyArgs{
		ServiceAccountId: serviceAccount.ID(),
		Description:      pulumi.String("API key for Go CI/CD integration"),
	})
	if err != nil {
		return err
	}

	// Export relevant details
	ctx.Export("service_account_go_id", serviceAccount.ID())
	ctx.Export("service_account_go_name", serviceAccount.Name)
	// The token is sensitive and should be treated carefully
	ctx.Export("service_account_key_go_token", pulumi.ToSecret(serviceAccountKey.Token))

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runServiceAccountExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
