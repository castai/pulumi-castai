import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";

// Check for required Azure credentials
const requiredVars = [
    "AZURE_SUBSCRIPTION_ID",
    "AZURE_TENANT_ID",
    "AZURE_RESOURCE_GROUP",
    "CASTAI_API_TOKEN"
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.warn(`Warning: Missing required Azure credentials: ${missingVars.join(", ")}`);
    console.warn("This is a simulation only - not creating actual resources.");
}

// Get CAST AI API token from environment variable
const castaiApiToken = process.env.CASTAI_API_TOKEN;
if (!castaiApiToken) {
    console.error("ERROR: CASTAI_API_TOKEN environment variable is required");
    process.exit(1);
}

// Initialize the CAST AI provider with explicit API token
const provider = new castai.Provider("castai-provider", {
    apiToken: castaiApiToken,
    // Optional: specify API URL if using a non-default endpoint
    apiUrl: process.env.CASTAI_API_URL || "https://api.cast.ai",
});

// Get Azure values from environment variables or use defaults
const azureSubscriptionId = process.env.AZURE_SUBSCRIPTION_ID || "00000000-0000-0000-0000-000000000000";
const azureTenantId = process.env.AZURE_TENANT_ID || "00000000-0000-0000-0000-000000000000";
const azureResourceGroup = process.env.AZURE_RESOURCE_GROUP || "my-resource-group";

// Get AKS cluster name from environment variable or use a default value
const aksClusterName = process.env.AKS_CLUSTER_NAME || "cast_ai_test_cluster";

// Create a connection to an AKS cluster
const aksCluster = new castai.AksCluster("aks-cluster-connection", {
    // Use Azure subscription ID from environment
    subscriptionId: azureSubscriptionId,
    // Use Azure resource group from environment
    resourceGroupName: azureResourceGroup,
    // Use AKS cluster name from environment
    aksClusterName: aksClusterName,
    // Use Azure tenant ID from environment
    tenantId: azureTenantId,
    // Clean up nodes when disconnecting
    deleteNodesOnDisconnect: true,
}, { provider });

// Export the cluster ID
export const clusterId = aksCluster.id;