import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";

// Check for required AWS credentials
const requiredVars = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
    "CASTAI_API_TOKEN"
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.warn(`Warning: Missing required AWS credentials: ${missingVars.join(", ")}`);
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

// Get AWS values from environment variables or use defaults
const awsRegion = process.env.AWS_REGION || "us-west-2";
const awsAccountId = process.env.AWS_ACCOUNT_ID || "123456789012";

// Get EKS cluster name from environment variable or use a default value
const eksClusterName = process.env.EKS_CLUSTER_NAME || "cast_ai_test_cluster";

// Example EKS cluster configuration
const eksCluster = new castai.EksCluster("eks-cluster-connection", {
    accountId: awsAccountId,         // Use AWS account ID from environment
    region: awsRegion,               // Use AWS region from environment
    eksClusterName: eksClusterName,  // Use EKS cluster name from environment
    deleteNodesOnDisconnect: true,   // Clean up nodes when disconnecting

    // The following values need to be replaced with actual values from your AWS account
    // For demo purposes, we're using placeholder values
    securityGroupId: "sg-12345678",
    subnetIds: ["subnet-12345678", "subnet-87654321"],
}, { provider });

// Export the cluster ID
export const clusterId = eksCluster.id;