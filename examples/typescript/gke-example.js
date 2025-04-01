"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceAccountId = exports.nodeConfigId = exports.clusterId = void 0;
var castai = require("@pulumi/castai");
// Initialize the CAST AI provider
var provider = new castai.Provider("castai-provider", {
// API token will be read from environment variable CASTAI_API_TOKEN
});
// Create a connection to a GKE cluster
var gkeCluster = new castai.GkeCluster("gke-cluster-connection", {
    projectId: "my-gcp-project-id", // Replace with your GCP project ID
    location: "us-central1", // Replace with your GCP location
    name: "my-gke-cluster", // Replace with your GKE cluster name
    // Optional: provide credentials JSON directly
    // credentialsJson: "{ ... }",
}, { provider: provider });
// Create a node configuration
var nodeConfig = new castai.NodeConfiguration("gke-node-config", {
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
}, { provider: provider });
// Configure autoscaling
var autoscaler = new castai.Autoscaler("gke-autoscaler", {
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
}, { provider: provider });
// Create a service account for CAST AI
var serviceAccount = new castai.ServiceAccount("cast-ai-service-account", {
    name: "gke-service-account",
    description: "Service account for GKE integration",
    roles: ["admin"],
}, { provider: provider });
// Export relevant IDs
exports.clusterId = gkeCluster.id;
exports.nodeConfigId = nodeConfig.id;
exports.serviceAccountId = serviceAccount.id;
