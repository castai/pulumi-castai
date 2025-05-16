/**
 * CAST AI AWS Example
 *
 * This example demonstrates how to connect an existing EKS cluster to CAST AI
 * and install all necessary components using the Pulumi CAST AI provider.
 *
 * Required environment variables:
 * - CASTAI_API_TOKEN: Your CAST AI API token
 * - AWS_ACCESS_KEY_ID: Your AWS access key ID
 * - AWS_SECRET_ACCESS_KEY: Your AWS secret access key
 * - AWS_REGION: Your AWS region
 *
 * Optional environment variables:
 * - EKS_CLUSTER_NAME: Name of your EKS cluster (default: cast_ai_test_cluster)
 * - AWS_ACCOUNT_ID: Your AWS account ID (default: 123456789012)
 * - CASTAI_API_URL: Custom CAST AI API URL (default: https://api.cast.ai)
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";
import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";

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

const castaiApiToken = process.env.CASTAI_API_TOKEN;
if (!castaiApiToken) {
    console.error("ERROR: CASTAI_API_TOKEN environment variable is required");
    process.exit(1);
}

const provider = new castai.Provider("castai-provider", {
    apiToken: castaiApiToken,
    apiUrl: process.env.CASTAI_API_URL || "https://api.cast.ai",
});

const awsRegion = process.env.AWS_REGION || "us-west-2";
const awsAccountId = process.env.AWS_ACCOUNT_ID || "123456789012";
const eksClusterName = process.env.EKS_CLUSTER_NAME || "cast_ai_test_cluster";

// Get the existing EKS cluster details
const eksClusterInfo = pulumi.output(aws.eks.getCluster({
    name: eksClusterName,
}));

// Example EKS cluster configuration
const eksCluster = new castai.EksCluster("eks-cluster-connection", {
    accountId: awsAccountId,
    region: awsRegion,
    name: eksClusterName,
    deleteNodesOnDisconnect: true,
    // The following values need to be replaced with actual values from your AWS account
    overrideSecurityGroups: ["sg-12345678"],
    subnets: ["subnet-12345678", "subnet-87654321"],
}, { provider });

// Create a Kubernetes provider to interact with the EKS cluster
const k8sProvider = new k8s.Provider("eks-k8s", {
    kubeconfig: eksClusterInfo.apply(info => {
        return aws.eks.getClusterAuth({
            name: eksClusterName,
        }).apply(auth => {
            return {
                apiVersion: "v1",
                clusters: [{
                    cluster: {
                        server: info.endpoint,
                        certificateAuthorityData: info.certificateAuthority.data,
                    },
                    name: "kubernetes",
                }],
                contexts: [{
                    context: {
                        cluster: "kubernetes",
                        user: "aws",
                    },
                    name: "aws",
                }],
                currentContext: "aws",
                users: [{
                    name: "aws",
                    user: {
                        token: auth.token,
                    },
                }],
            };
        });
    }),
});

// Install the CAST AI agent using Helm
const castaiAgent = new k8s.helm.v3.Release("castai-agent", {
    name: "castai-agent", // This will be the exact name used, without a suffix
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
        provider: "eks",
        additionalEnv: {
            STATIC_CLUSTER_ID: eksCluster.id,
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
    dependsOn: [eksCluster],
    customTimeouts: {
        create: "1m",
        update: "1m",
        delete: "5m",
    },
});

// Install the CAST AI cluster controller
const clusterController = new k8s.helm.v3.Release("cluster-controller", {
    name: "cluster-controller", // This will be the exact name used, without a suffix
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
            clusterID: eksCluster.id,
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
    dependsOn: [castaiAgent, eksCluster],
    customTimeouts: {
        create: "1m",
        update: "1m",
        delete: "5m",
    },
});

// Install the CAST AI evictor
const castaiEvictor = new k8s.helm.v3.Release("castai-evictor", {
    name: "castai-evictor", // This will be the exact name used, without a suffix
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
    name: "castai-pod-pinner", // This will be the exact name used, without a suffix
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
            clusterID: eksCluster.id,
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
export const clusterName = eksClusterName;
export const clusterId = eksCluster.id;
export const agentHelmRelease = castaiAgent.name;
export const controllerHelmRelease = clusterController.name;
export const evictorHelmRelease = castaiEvictor.name;
export const podPinnerHelmRelease = castaiPodPinner.name;