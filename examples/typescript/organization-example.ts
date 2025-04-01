import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";

// Initialize the CAST AI provider
const provider = new castai.Provider("castai", {
    // API token will be read from the environment variable CASTAI_API_TOKEN
});

// Create a service account for programmatic access
const serviceAccount = new castai.ServiceAccount("example-service-account", {
    name: "ci-cd-automation",
    description: "Service account for CI/CD pipeline automation",
    roles: ["admin", "viewer"],  // Roles to assign to the service account
    ttl: "8760h",                // 1 year expiration
});

// Create a service account API key
const serviceAccountKey = new castai.ServiceAccountKey("example-sa-key", {
    serviceAccountId: serviceAccount.id,
    description: "API key for CI/CD integration",
    // The token will be generated and available as an output
});

// Configure SSO for organization access
const ssoConnection = new castai.SSOConnection("example-sso", {
    idpMetadataUrl: "https://login.microsoftonline.com/tenant-id/federationmetadata/2007-06/federationmetadata.xml",
    // Or use idpMetadataXml: "...",
    
    name: "AzureAD-SSO",
    enabled: true,
    defaultRole: "viewer",
    
    // Map user attributes from the IdP to CAST AI
    attributeMapping: {
        email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
        firstName: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
        lastName: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
        groups: "http://schemas.microsoft.com/ws/2008/06/identity/claims/groups",
    },
    
    // Configure role mapping based on group membership
    roleMappings: [
        {
            role: "admin",
            values: ["cast-ai-admins"]
        },
        {
            role: "editor",
            values: ["cast-ai-editors"]
        }
    ]
});

// Manage organization members
const orgMembers = new castai.Members("example-org-members", {
    // Add members with specific roles
    members: [
        {
            email: "admin@example.com",
            role: "admin",
        },
        {
            email: "developer@example.com",
            role: "editor",
        },
        {
            email: "analyst@example.com",
            role: "viewer",
        }
    ]
});

// Create an organization group
const orgGroup = new castai.Group("example-org-group", {
    name: "DevOps Team",
    description: "Group for DevOps engineers",
    memberEmails: [
        "devops1@example.com",
        "devops2@example.com"
    ]
});

// Configure role bindings for the group
const roleBindings = new castai.RoleBindings("example-role-bindings", {
    bindings: [
        {
            role: "editor",
            subjects: [
                {
                    type: "group",
                    name: orgGroup.name
                }
            ]
        }
    ]
});

// Export the service account key (token)
export const apiToken = serviceAccountKey.token;
export const sapiUrl = ssoConnection.sapiUrl; 