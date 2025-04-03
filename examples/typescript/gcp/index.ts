import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";
import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";

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

const gkeLocation = process.env.GKE_LOCATION || "us-central1";

// Get the existing GKE cluster details
// Use apply to properly handle the Pulumi Output type
const gkeClusterInfo = pulumi.output(gcp.container.getCluster({
    name: gkeClusterName,
    location: gkeLocation,
    project: gcpProjectId,
}));

// Create a connection to a GKE cluster
// This follows the same pattern as the Terraform provider
const gkeCluster = new castai.GkeCluster("gke-cluster-connection", {
    projectId: gcpProjectId,         // Use GCP project ID from environment
    location: gkeLocation,           // Use GCP location from environment
    name: gkeClusterName,            // Use GKE cluster name from environment
    deleteNodesOnDisconnect: true,   // Clean up nodes when disconnecting
    // Optional: provide credentials JSON directly from environment
    credentialsJson: process.env.GOOGLE_CREDENTIALS,
}, {
    provider,
    // Set a custom timeout to prevent hanging
    customTimeouts: {
        create: "2m",  // Only wait 2 minutes for creation
        update: "2m",  // Only wait 2 minutes for updates
        delete: "5m",  // Give a bit more time for deletion
    },
});

// Create a Kubernetes provider to interact with the GKE cluster
// Use the same approach that worked with the gcloud command
const k8sProvider = new k8s.Provider("gke-k8s", {
    // Use the GCP project ID, location, and cluster name to create the kubeconfig
    kubeconfig: gkeClusterInfo.apply(info => {
        // This kubeconfig uses the gke-gcloud-auth-plugin which is the recommended approach
        // for authenticating with GKE clusters
        return `apiVersion: v1
kind: Config
clusters:
- cluster:
    server: https://${info.endpoint}
    insecure-skip-tls-verify: true
  name: ${gkeClusterName}
contexts:
- context:
    cluster: ${gkeClusterName}
    user: ${gkeClusterName}
  name: ${gkeClusterName}
current-context: ${gkeClusterName}
users:
- name: ${gkeClusterName}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: gke-gcloud-auth-plugin
      installHint: Install gke-gcloud-auth-plugin for use with kubectl by following https://cloud.google.com/blog/products/containers-kubernetes/kubectl-auth-changes-in-gke
`;
    }),
});

// Install the CAST AI agent using Helm
// This follows the same pattern as the Terraform provider
const castaiAgent = new k8s.helm.v3.Release("castai-agent", {
    chart: "castai-agent",
    version: "0.97.4", // Use a specific version
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: true,
    cleanupOnFail: true,
    // Set timeout to ensure the Helm installation doesn't hang
    timeout: 300, // 5 minutes timeout
    // Don't wait for the Helm chart to be ready
    skipAwait: true,
    values: {
        // These values match what the Terraform provider sets
        replicaCount: 1, // Reduced from 2 to avoid memory issues
        provider: "gke",
        additionalEnv: {
            // Use the cluster ID from the CAST AI GKE cluster
            // We use apply to properly handle the Pulumi Output type
            STATIC_CLUSTER_ID: gkeCluster.id,
        },
        createNamespace: false,
        apiURL: process.env.CASTAI_API_URL || "https://api.cast.ai",
        // Note: In a production environment, you should use a more secure method
        apiKey: castaiApiToken,
        // Reduce resource requirements to avoid scheduling issues
        resources: {
            agent: {
                requests: {
                    memory: "512Mi", // Reduced from 2Gi
                    cpu: "100m",
                },
                limits: {
                    memory: "1Gi", // Reduced from 2Gi
                    cpu: "500m",
                },
            },
            monitor: {
                requests: {
                    memory: "64Mi", // Reduced from 128Mi
                    cpu: "50m",
                },
            },
        },
    },
}, {
    provider: k8sProvider,
    dependsOn: [gkeCluster],
    customTimeouts: {
        create: "1m",  // Reduced timeout since we're not waiting
        update: "1m",  // Reduced timeout since we're not waiting
        delete: "5m",
    },
});

// Install the CAST AI cluster controller
// This follows the same pattern as the Terraform provider
const clusterController = new k8s.helm.v3.Release("cluster-controller", {
    chart: "castai-cluster-controller",
    version: "0.81.4", // Use a specific version
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: true,
    cleanupOnFail: true,
    // Set timeout to ensure the Helm installation doesn't hang
    timeout: 300, // 5 minutes timeout
    // Don't wait for the Helm chart to be ready
    skipAwait: true,
    values: {
        castai: {
            // Use the cluster ID from the CAST AI GKE cluster
            // We use apply to properly handle the Pulumi Output type
            clusterID: gkeCluster.id,
            apiURL: process.env.CASTAI_API_URL || "https://api.cast.ai",
            // Note: In a production environment, you should use a more secure method
            apiKey: castaiApiToken,
        },
        // Reduce resource requirements to avoid scheduling issues
        resources: {
            requests: {
                memory: "128Mi",
                cpu: "50m",
            },
            limits: {
                memory: "256Mi",
                cpu: "200m",
            },
        },
    },
}, {
    provider: k8sProvider,
    dependsOn: [castaiAgent, gkeCluster],
    customTimeouts: {
        create: "1m",  // Reduced timeout since we're not waiting
        update: "1m",  // Reduced timeout since we're not waiting
        delete: "5m",
    },
});

// Export the cluster name and other useful information
export const clusterName = gkeClusterName;
export const clusterId = gkeCluster.id;
export const agentHelmRelease = castaiAgent.name;
export const controllerHelmRelease = clusterController.name;