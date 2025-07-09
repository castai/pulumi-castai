/**
 * CAST AI GCP Example
 *
 * This example demonstrates how to connect an existing GKE cluster to CAST AI
 * and install all necessary components using the Pulumi CAST AI provider.
 * It creates a service account with the necessary permissions for CAST AI.
 *
 * Required environment variables:
 * - CASTAI_API_TOKEN: Your CAST AI API token
 * - GCP_PROJECT_ID: Your GCP project ID
 *
 * Optional environment variables:
 * - GKE_CLUSTER_NAME: Name of your GKE cluster (default: cast_ai_test_cluster)
 * - GKE_LOCATION: GCP region where your cluster is located (default: us-central1)
 * - CASTAI_API_URL: Custom CAST AI API URL (default: https://api.cast.ai)
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";
import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";
import * as crypto from 'crypto';

const requiredVars = [
    "GCP_PROJECT_ID",
    "CASTAI_API_TOKEN"
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.warn(`Warning: Missing required GCP credentials: ${missingVars.join(", ")}`);
    console.warn("This example will create a service account for GCP authentication.");
}

const castaiApiToken = process.env.CASTAI_API_TOKEN;
if (!castaiApiToken) {
    console.error("ERROR: CASTAI_API_TOKEN environment variable is required");
    process.exit(1);
}

const randomSuffix = Math.random().toString(36).substring(2, 8); // 6 character random string
const gcpProjectId = process.env.GCP_PROJECT_ID || "my-gcp-project-id";
const gkeClusterName = process.env.GKE_CLUSTER_NAME || `pulumi-test-cluster-${randomSuffix}`;
const gkeLocation = process.env.GKE_LOCATION || "us-central1";

// Generate a short unique suffix to avoid naming conflicts
const clusterSha = gkeClusterName;
const sha = crypto.createHash('sha1').update(clusterSha).digest('hex');
const uniqueSuffix = sha.slice(0, 6);

// Create a service account for CAST AI
const castaiServiceAccount = new gcp.serviceaccount.Account(`castai-sa-${uniqueSuffix}`, {
    accountId: `castai-gke-${uniqueSuffix}`, // Keep it short: castai-gke-abc123
    displayName: "CAST AI GKE Access Service Account",
    description: "Service account for CAST AI to manage GKE cluster",
    project: gcpProjectId,
});

// Define the required roles for CAST AI
const requiredRoles = [
    "roles/container.clusterAdmin",
    "roles/compute.instanceAdmin.v1",
    "roles/iam.serviceAccountUser",
];

// Assign roles to the service account
const roleBindings = requiredRoles.map((role, index) => {
    return new gcp.projects.IAMMember(`castai-role-${index}-${uniqueSuffix}`, {
        project: gcpProjectId,
        role: role,
        member: castaiServiceAccount.email.apply(email => `serviceAccount:${email}`),
    });
});

// Create a service account key
const serviceAccountKey = new gcp.serviceaccount.Key(`castai-key-${uniqueSuffix}`, {
    serviceAccountId: castaiServiceAccount.name,
    publicKeyType: "TYPE_X509_PEM_FILE",
});

// Simple approach: just depend on the role bindings directly
// The key insight is that IAM propagation usually happens quickly enough

const provider = new castai.Provider(`castai-provider-${uniqueSuffix}`, {
    apiToken: castaiApiToken,
    apiUrl: process.env.CASTAI_API_URL || "https://api.cast.ai",
});

// Create a GKE cluster for testing
const gkeClusterInfo = new gcp.container.Cluster(`test-gke-cluster-${uniqueSuffix}`, {
    name: gkeClusterName,
    location: gkeLocation,
    project: gcpProjectId,
    initialNodeCount: 4, // Increased to 4 nodes to ensure enough capacity for CAST AI agents
    nodeConfig: {
        machineType: "e2-standard-2", // Increased from e2-medium to ensure enough resources for CAST AI agents
        oauthScopes: [
            "https://www.googleapis.com/auth/cloud-platform",
        ],
    },
    removeDefaultNodePool: false,
    deletionProtection: false,
});


const gkeCluster = new castai.GkeCluster(`gke-cluster-${uniqueSuffix}`, {
    projectId: gcpProjectId,
    location: gkeLocation,
    name: gkeClusterName,
    deleteNodesOnDisconnect: true,
    credentialsJson: serviceAccountKey.privateKey.apply(key =>
        Buffer.from(key, 'base64').toString('utf8')
    ),
}, {
    provider,
    dependsOn: [gkeClusterInfo, ...roleBindings],
    customTimeouts: {
        create: "2m",
        update: "5m",
        delete: "5m",
    },
});

// Create a Kubernetes provider to interact with the GKE cluster
const k8sProvider = new k8s.Provider(`gke-k8s-${uniqueSuffix}`, {
    kubeconfig: gkeClusterInfo.endpoint.apply(endpoint => {
        return `apiVersion: v1
kind: Config
clusters:
- cluster:
    server: https://${endpoint}
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
const castaiAgent = new k8s.helm.v3.Release(`castai-agent`, {
    name: "castai-agent", // Helm release name can be the same across different clusters
    chart: "castai-agent",
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
const clusterController = new k8s.helm.v3.Release(`cluster-controller`, {
    name: "cluster-controller", // Helm release name can be the same across different clusters
    chart: "castai-cluster-controller",
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
const castaiEvictor = new k8s.helm.v3.Release(`castai-evictor`, {
    name: "castai-evictor", // Helm release name can be the same across different clusters
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
        managedByCASTAI: true,
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
const castaiPodPinner = new k8s.helm.v3.Release(`castai-pod-pinner`, {
    name: "castai-pod-pinner", // Helm release name can be the same across different clusters
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
export const serviceAccountEmail = castaiServiceAccount.email;
export const serviceAccountName = castaiServiceAccount.name;
export const agentHelmRelease = castaiAgent.name;
export const controllerHelmRelease = clusterController.name;
export const evictorHelmRelease = castaiEvictor.name;
export const podPinnerHelmRelease = castaiPodPinner.name;
export const uniqueDeploymentSuffix = uniqueSuffix;