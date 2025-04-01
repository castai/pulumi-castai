import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai"; // Use your actual package name

// Placeholder: Replace with actual Azure AD application details
// These would typically come from Pulumi config or other resources
const azureAdClientId = "your-azure-ad-client-id";
// Use Pulumi config for secrets like the client secret
const config = new pulumi.Config();
const azureAdClientSecret = config.requireSecret("azureAdClientSecret");
const azureAdDomain = "your-organization.onmicrosoft.com";
const primaryEmailDomain = "your-organization.com"; // Your org's email domain

// Assuming the resource is castai.SSOConnection
const ssoConnection = new castai.SSOConnection("example-azure-sso", {
    name: "AzureAD-SSO", // A descriptive name for the connection in CAST AI
    emailDomain: primaryEmailDomain,
    // Optional: Add other domains if needed
    // additionalEmailDomains: ["secondary.com"],

    // Configuration specific to Azure AD
    aad: {
        clientId: azureAdClientId,
        clientSecret: azureAdClientSecret,
        adDomain: azureAdDomain,
    },

    // You might also configure SAML/other providers instead of AAD
    // saml: { idpMetadataUrl: "..." }
});

// Export the ID of the created SSO Connection
export const ssoConnectionId = ssoConnection.id;
// Export the Single Sign-On URL provided by CAST AI (if available as output)
// export const castaiSsoUrl = ssoConnection.ssoUrl; // Adjust property name if needed 