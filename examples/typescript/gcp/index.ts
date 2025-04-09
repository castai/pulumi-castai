/**
 * CAST AI GCP Example
 *
 * This example demonstrates how to connect an existing GKE cluster to CAST AI
 * and install all necessary components using the Pulumi CAST AI provider.
 *
 * Required environment variables:
 * - CASTAI_API_TOKEN: Your CAST AI API token
 * - GCP_PROJECT_ID: Your GCP project ID
 * - GOOGLE_CREDENTIALS: GCP credentials JSON
 *
 * Optional environment variables:
 * - GKE_CLUSTER_NAME: Name of your GKE cluster (default: cast_ai_test_cluster)
 * - GKE_LOCATION: GCP region where your cluster is located (default: us-central1)
 * - CASTAI_API_URL: Custom CAST AI API URL (default: https://api.cast.ai)
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";
import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";

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

const castaiApiToken = process.env.CASTAI_API_TOKEN;
if (!castaiApiToken) {
    console.error("ERROR: CASTAI_API_TOKEN environment variable is required");
    process.exit(1);
}

const provider = new castai.Provider("castai-provider", {
    apiToken: castaiApiToken,
    apiUrl: process.env.CASTAI_API_URL || "https://api.cast.ai",
});

const gcpProjectId = process.env.GCP_PROJECT_ID || "my-gcp-project-id";
const gkeClusterName = process.env.GKE_CLUSTER_NAME || "cast_ai_test_cluster";
const gkeLocation = process.env.GKE_LOCATION || "us-central1";

// Get the existing GKE cluster details
const gkeClusterInfo = pulumi.output(gcp.container.getCluster({
    name: gkeClusterName,
    location: gkeLocation,
    project: gcpProjectId,
}));

// Create a connection to a GKE cluster
const gkeCluster = new castai.GkeCluster("gke-cluster-connection", {
    projectId: gcpProjectId,
    location: gkeLocation,
    name: gkeClusterName,
    deleteNodesOnDisconnect: true,
    credentialsJson: process.env.GOOGLE_CREDENTIALS,
}, {
    provider,
    customTimeouts: {
        create: "2m",
        update: "2m",
        delete: "5m",
    },
});

// Create a Kubernetes provider to interact with the GKE cluster
const k8sProvider = new k8s.Provider("gke-k8s", {
    kubeconfig: gkeClusterInfo.apply(info => {
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
const castaiAgent = new k8s.helm.v3.Release("castai-agent", {
    chart: "castai-agent",
    version: "0.97.4",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: true,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        replicaCount: 1,
        provider: "gke",
        additionalEnv: {
            STATIC_CLUSTER_ID: gkeCluster.id,
        },
        createNamespace: false,
        apiURL: process.env.CASTAI_API_URL || "https://api.cast.ai",
        apiKey: castaiApiToken,
        resources: {
            agent: {
                requests: {
                    memory: "512Mi",
                    cpu: "100m",
                },
                limits: {
                    memory: "1Gi",
                    cpu: "500m",
                },
            },
            monitor: {
                requests: {
                    memory: "64Mi",
                    cpu: "50m",
                },
            },
        },
    },
}, {
    provider: k8sProvider,
    dependsOn: [gkeCluster],
    customTimeouts: {
        create: "1m",
        update: "1m",
        delete: "5m",
    },
});

// Install the CAST AI cluster controller
const clusterController = new k8s.helm.v3.Release("cluster-controller", {
    chart: "castai-cluster-controller",
    version: "0.81.4",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: true,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        castai: {
            clusterID: gkeCluster.id,
            apiURL: process.env.CASTAI_API_URL || "https://api.cast.ai",
            apiKey: castaiApiToken,
        },
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
        create: "1m",
        update: "1m",
        delete: "5m",
    },
});

// Install the CAST AI evictor
const castaiEvictor = new k8s.helm.v3.Release("castai-evictor", {
    chart: "castai-evictor",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: true,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        replicaCount: 1,
    },
}, {
    provider: k8sProvider,
    dependsOn: [castaiAgent, clusterController],
    customTimeouts: {
        create: "1m",
        update: "1m",
        delete: "5m",
    },
});

// Install the CAST AI pod pinner
const castaiPodPinner = new k8s.helm.v3.Release("castai-pod-pinner", {
    chart: "castai-pod-pinner",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: true,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        castai: {
            apiKey: castaiApiToken,
            clusterID: gkeCluster.id,
        },
        replicaCount: 0,
    },
}, {
    provider: k8sProvider,
    dependsOn: [castaiAgent, clusterController],
    customTimeouts: {
        create: "1m",
        update: "1m",
        delete: "5m",
    },
});

// Export useful information
export const clusterName = gkeClusterName;
export const clusterId = gkeCluster.id;
export const agentHelmRelease = castaiAgent.name;
export const controllerHelmRelease = clusterController.name;
export const evictorHelmRelease = castaiEvictor.name;
export const podPinnerHelmRelease = castaiPodPinner.name;