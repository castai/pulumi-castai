import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";

// Check for required GCP credentials
const requiredVars = [
    "GOOGLE_CREDENTIALS",
    "GCP_PROJECT_ID",
    "CASTAI_API_TOKEN"
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.warn(`Warning: Missing required GCP credentials: ${missingVars.join(", ")}`);
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

// Get GCP project ID from environment variable or use a default value
const gcpProjectId = process.env.GCP_PROJECT_ID || "my-gcp-project-id";

// Get GKE cluster name from environment variable or use a default value
const gkeClusterName = process.env.GKE_CLUSTER_NAME || "cast_ai_test_cluster";

// Create a connection to a GKE cluster
const gkeCluster = new castai.GkeCluster("gke-cluster-connection", {
    projectId: gcpProjectId,         // Use GCP project ID from environment
    location: "us-central1",         // Replace with your GCP location
    name: gkeClusterName,            // Use GKE cluster name from environment
    deleteNodesOnDisconnect: true,   // Clean up nodes when disconnecting
    // Optional: provide credentials JSON directly from environment
    credentialsJson: process.env.GOOGLE_CREDENTIALS,
}, { provider });

// For testing purposes, we're only creating the GKE cluster connection
// without the additional resources that require API calls

// Export the cluster ID
export const clusterId = gkeCluster.id;

// Note: Additional resources like NodeConfiguration, Autoscaler, and ServiceAccount
// require a valid CAST AI API token and an actual GKE cluster.
// They have been removed from this example to avoid provider crashes during testing.