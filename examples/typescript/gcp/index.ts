/**
 * CAST AI GCP Example - Working Configuration
 *
 * This example replicates the successful manual Helm installation using Pulumi.
 * Based on the working manual installation with proper namespace management.
 *
 * Required environment variables:
 * - CASTAI_API_TOKEN: Your CAST AI API token
 * 
 * Optional environment variables:
 * - GCP_PROJECT_ID: Your GCP project ID (defaults to "my-gcp-project-id")
 * - GKE_CLUSTER_NAME: Name of your GKE cluster (defaults to "my-gke-cluster")
 * - GKE_LOCATION: GKE cluster location (defaults to "us-central1")
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";
import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";

const gcpProjectId = process.env.GCP_PROJECT_ID || "my-gcp-project-id";
const gkeClusterName = process.env.GKE_CLUSTER_NAME || "my-gke-cluster";
const gkeLocation = process.env.GKE_LOCATION || "us-central1";

// Step 1: Create a service account for CAST AI
const castaiServiceAccount = new gcp.serviceaccount.Account("castai-service-account", {
    accountId: "castai-gke-working",
    displayName: "CAST AI GKE Access Service Account (Working)",
    description: "Service account for CAST AI to manage GKE cluster",
    project: gcpProjectId,
});

// Step 2: Define the required roles for CAST AI (using broader permissions)
const requiredRoles = [
    "roles/container.admin",
    "roles/compute.admin",
    "roles/iam.serviceAccountUser",
];

// Step 3: Assign roles to the service account
requiredRoles.forEach((role, index) => {
    new gcp.projects.IAMMember(`castai-role-${index}`, {
        project: gcpProjectId,
        role: role,
        member: castaiServiceAccount.email.apply(email => `serviceAccount:${email}`),
    });
});

// Step 4: Create a service account key
const serviceAccountKey = new gcp.serviceaccount.Key("castai-service-account-key", {
    serviceAccountId: castaiServiceAccount.name,
});

// Step 5: Initialize the CAST AI provider
const provider = new castai.Provider("castai-provider", {
    apiToken: process.env.CASTAI_API_TOKEN,
});

// Step 6: Create a Kubernetes provider
const k8sProvider = new k8s.Provider("gke-k8s", {
    // Uses default kubeconfig from ~/.kube/config
});

// Step 7: Create namespace with proper Helm labels (replicating manual success)
const castaiNamespace = new k8s.core.v1.Namespace("castai-namespace", {
    metadata: {
        name: "castai-agent",
        labels: {
            "app.kubernetes.io/managed-by": "Helm",
        },
        annotations: {
            "meta.helm.sh/release-name": "castai-agent",
            "meta.helm.sh/release-namespace": "castai-agent",
        },
    },
}, {
    provider: k8sProvider,
});

// Step 8: Install CAST AI agent (replicating successful manual installation)
const castaiAgent = new k8s.helm.v3.Release("castai-agent", {
    name: "castai-agent",
    chart: "castai-agent",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: false, // We created it with proper labels above
    cleanupOnFail: true,
    timeout: 300,
    values: {
        apiKey: process.env.CASTAI_API_TOKEN,
        provider: "gke",
        apiURL: "https://api.cast.ai",
        // Additional values that might be needed
        replicaCount: 1,
    },
}, {
    provider: k8sProvider,
    dependsOn: [castaiNamespace],
});

// Step 9: Install CAST AI cluster controller
const clusterController = new k8s.helm.v3.Release("cluster-controller", {
    name: "cluster-controller",
    chart: "castai-cluster-controller",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: false, // Namespace already exists
    cleanupOnFail: true,
    timeout: 300,
    values: {
        castai: {
            apiKey: process.env.CASTAI_API_TOKEN,
            apiURL: "https://api.cast.ai",
        },
    },
}, {
    provider: k8sProvider,
    dependsOn: [castaiAgent],
});

// Step 10: Create CAST AI cluster connection AFTER agent installation
const gkeCluster = new castai.GkeCluster("gke-cluster-connection", {
    projectId: gcpProjectId,
    location: gkeLocation,
    name: gkeClusterName,
    deleteNodesOnDisconnect: true,
    credentialsJson: serviceAccountKey.privateKey,
}, { 
    provider,
    dependsOn: [castaiAgent, clusterController],
});

// Export useful information
export const clusterId = gkeCluster.id;
export const serviceAccountEmail = castaiServiceAccount.email;
export const agentStatus = castaiAgent.status;
export const controllerStatus = clusterController.status;
export const namespaceName = castaiNamespace.metadata.name;
export const clusterName = gkeClusterName;
export const projectId = gcpProjectId;
export const location = gkeLocation;
