package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai/organization" // Assuming organization module
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi/config"
)

// runSsoConnectionExample demonstrates creating an SSO connection.
// Renamed from main to avoid conflicts.
func runSsoConnectionExample(ctx *pulumi.Context) error {
	// Placeholder: Replace with actual Azure AD application details
	// These would typically come from Pulumi config or other resources
	azureAdClientId := "your-azure-ad-client-id"
	// Use Pulumi config for secrets like the client secret
	cfg := config.New(ctx, "")
	azureAdClientSecret := cfg.RequireSecret("azureAdClientSecret")
	azureAdDomain := "your-organization.onmicrosoft.com"
	primaryEmailDomain := "your-organization.com" // Your org's email domain

	// Assuming the resource is organization.NewSSOConnection
	ssoConnection, err := organization.NewSSOConnection(ctx, "example-azure-sso", &organization.SSOConnectionArgs{
		Name:        pulumi.String("AzureAD-SSO"), // A descriptive name for the connection in CAST AI
		EmailDomain: pulumi.String(primaryEmailDomain),
		// Optional: Add other domains if needed
		// AdditionalEmailDomains: pulumi.StringArray{pulumi.String("secondary.com")},

		// Configuration specific to Azure AD
		Aad: &organization.SSOConnectionAadArgs{
			ClientId:     pulumi.String(azureAdClientId),
			ClientSecret: azureAdClientSecret, // Pass the secret Output directly
			AdDomain:     pulumi.String(azureAdDomain),
		},

		// You might also configure SAML/other providers instead of AAD
		// Saml: &organization.SSOConnectionSamlArgs{ IdpMetadataUrl: pulumi.String("...") }
	})
	if err != nil {
		return err
	}

	// Export the ID of the created SSO Connection
	ctx.Export("sso_connection_id", ssoConnection.ID())
	// Export the Single Sign-On URL provided by CAST AI (if available as output)
	// ctx.Export("castai_sso_url", ssoConnection.SsoUrl) // Adjust property name if needed

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runSsoConnectionExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
