import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";

// Initialize the CAST AI provider
const provider = new castai.Provider("castai-provider", {
    // API token will be read from environment variable CASTAI_API_TOKEN
});

// Create a connection to a GKE cluster
const gkeCluster = new castai.GkeCluster("gke-cluster-connection", {
    projectId: "my-gcp-project-id",  // Replace with your GCP project ID
    location: "us-central1",         // Replace with your GCP location
    name: "my-gke-cluster",          // Replace with your GKE cluster name
    // Optional: provide credentials JSON directly
    // credentialsJson: "{ ... }",
}, { provider });

// Create a node configuration
const nodeConfig = new castai.NodeConfiguration("gke-node-config", {
    clusterId: gkeCluster.id,
    constraints: {
        spotInstances: {
            enabled: true,
        },
        onDemandInstances: {
            enabled: true,
        },
    },
    tags: {
        Environment: "Development",
        ManagedBy: "CAST AI",
    },
}, { provider });

// Configure autoscaling
const autoscaler = new castai.Autoscaler("gke-autoscaler", {
    clusterId: gkeCluster.id,
    enabled: true,
    unschedulablePods: [{
        enabled: true,
    }],
    nodeDownscaler: [{
        enabled: true,
        emptyNodes: [{
            delaySeconds: 300,
        }],
    }],
}, { provider });

// Create a service account for CAST AI
const serviceAccount = new castai.ServiceAccount("cast-ai-service-account", {
    name: "gke-service-account",
    description: "Service account for GKE integration",
    roles: ["admin"],
}, { provider });

// Export relevant IDs
export const clusterId = gkeCluster.id;
export const nodeConfigId = nodeConfig.id;
export const serviceAccountId = serviceAccount.id;
