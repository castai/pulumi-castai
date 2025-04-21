/**
 * CAST AI Azure Example
 *
 * This example demonstrates how to connect an existing AKS cluster to CAST AI
 * and install all necessary components using the Pulumi CAST AI provider.
 *
 * Required environment variables:
 * - CASTAI_API_TOKEN: Your CAST AI API token
 * - AZURE_SUBSCRIPTION_ID: Your Azure subscription ID
 * - AZURE_TENANT_ID: Your Azure tenant ID
 * - AZURE_RESOURCE_GROUP: Your Azure resource group name
 *
 * Optional environment variables:
 * - AKS_CLUSTER_NAME: Name of your AKS cluster (default: cast_ai_test_cluster)
 * - CASTAI_API_URL: Custom CAST AI API URL (default: https://api.cast.ai)
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";
import * as azure from "@pulumi/azure-native";
import * as k8s from "@pulumi/kubernetes";

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

const castaiApiToken = process.env.CASTAI_API_TOKEN;
if (!castaiApiToken) {
    console.error("ERROR: CASTAI_API_TOKEN environment variable is required");
    process.exit(1);
}

const provider = new castai.Provider("castai-provider", {
    apiToken: castaiApiToken,
    apiUrl: process.env.CASTAI_API_URL || "https://api.cast.ai",
});

const azureSubscriptionId = process.env.AZURE_SUBSCRIPTION_ID || "00000000-0000-0000-0000-000000000000";
const azureTenantId = process.env.AZURE_TENANT_ID || "00000000-0000-0000-0000-000000000000";
const azureResourceGroup = process.env.AZURE_RESOURCE_GROUP || "my-resource-group";
const aksClusterName = process.env.AKS_CLUSTER_NAME || "cast_ai_test_cluster";

// Get the existing AKS cluster details
const aksClusterInfo = pulumi.output(azure.containerservice.getManagedCluster({
    resourceGroupName: azureResourceGroup,
    resourceName: aksClusterName,
}));

// Create a connection to an AKS cluster
const aksCluster = new castai.AksCluster("aks-cluster-connection", {
    subscriptionId: azureSubscriptionId,
    resourceGroupName: azureResourceGroup,
    aksClusterName: aksClusterName,
    tenantId: azureTenantId,
    deleteNodesOnDisconnect: true,
}, { provider });

// Create a Kubernetes provider to interact with the AKS cluster
const k8sProvider = new k8s.Provider("aks-k8s", {
    kubeconfig: aksClusterInfo.apply(info => {
        return azure.containerservice.listManagedClusterUserCredentials({
            resourceGroupName: azureResourceGroup,
            resourceName: aksClusterName,
        }).apply(creds => {
            const kubeconfig = Buffer.from(creds.kubeconfigs[0].value, "base64").toString();
            return kubeconfig;
        });
    }),
});

// Install the CAST AI agent using Helm
const castaiAgent = new k8s.helm.v3.Release("castai-agent", {
    metadata: {
        name: "castai-agent", // This will be the exact name used, without a suffix
    },
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
        provider: "aks",
        additionalEnv: {
            STATIC_CLUSTER_ID: aksCluster.id,
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
    dependsOn: [aksCluster],
    customTimeouts: {
        create: "1m",
        update: "1m",
        delete: "5m",
    },
});

// Install the CAST AI cluster controller
const clusterController = new k8s.helm.v3.Release("cluster-controller", {
    metadata: {
        name: "cluster-controller", // This will be the exact name used, without a suffix
    },
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
            clusterID: aksCluster.id,
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
    dependsOn: [castaiAgent, aksCluster],
    customTimeouts: {
        create: "1m",
        update: "1m",
        delete: "5m",
    },
});

// Install the CAST AI evictor
const castaiEvictor = new k8s.helm.v3.Release("castai-evictor", {
    metadata: {
        name: "castai-evictor", // This will be the exact name used, without a suffix
    },
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
const castaiPodPinner = new k8s.helm.v3.Release("castai-pod-pinner", {
    metadata: {
        name: "castai-pod-pinner", // This will be the exact name used, without a suffix
    },
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
            clusterID: aksCluster.id,
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
export const clusterName = aksClusterName;
export const clusterId = aksCluster.id;
export const agentHelmRelease = castaiAgent.name;
export const controllerHelmRelease = clusterController.name;
export const evictorHelmRelease = castaiEvictor.name;
export const podPinnerHelmRelease = castaiPodPinner.name;