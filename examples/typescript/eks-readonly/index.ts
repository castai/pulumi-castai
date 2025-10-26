/**
 * CAST AI EKS Read-Only Example (Phase 1)
 *
 * This example connects an existing EKS cluster to CAST AI in read-only mode.
 * CAST AI will monitor your cluster and provide optimization recommendations
 * without making any changes.
 *
 * Prerequisites:
 * - Existing EKS cluster
 * - AWS credentials configured
 * - kubectl configured to access the cluster
 * - CAST AI API token
 *
 * Required environment variables:
 * - CASTAI_API_TOKEN: Your CAST AI API token
 * - EKS_CLUSTER_NAME: Name of your EKS cluster
 * - AWS_REGION: AWS region where your cluster is located
 * - AWS_ACCOUNT_ID: Your AWS account ID
 */

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as castai from "@castai/pulumi";
import * as k8s from "@pulumi/kubernetes";

// Get configuration from environment or Pulumi config
const config = new pulumi.Config();
const awsConfig = new pulumi.Config("aws");

const castaiApiToken = process.env.CASTAI_API_TOKEN || config.require("castaiApiToken");
const clusterName = process.env.EKS_CLUSTER_NAME || config.require("clusterName");
const awsRegion = process.env.AWS_REGION || awsConfig.require("region");
const awsAccountId = process.env.AWS_ACCOUNT_ID || config.get("awsAccountId");

// Validate required variables
if (!castaiApiToken) {
    throw new Error("CASTAI_API_TOKEN environment variable or castaiApiToken config is required");
}

if (!clusterName) {
    throw new Error("EKS_CLUSTER_NAME environment variable or clusterName config is required");
}

// Get AWS account ID if not provided
const callerIdentity = awsAccountId
    ? pulumi.output(awsAccountId)
    : aws.getCallerIdentity({}).then(id => id.accountId);

// Get EKS cluster information
const cluster = aws.eks.getClusterOutput({
    name: clusterName,
});

// Configure CAST AI provider
const castaiProvider = new castai.Provider("castai", {
    apiToken: castaiApiToken,
    apiUrl: process.env.CASTAI_API_URL || "https://api.cast.ai",
});

// Register EKS cluster with CAST AI (read-only mode)
const castaiCluster = new castai.EksCluster("castai-eks-cluster", {
    accountId: callerIdentity,
    region: awsRegion,
    name: clusterName,
}, {
    provider: castaiProvider,
});

// Configure Kubernetes provider to access the EKS cluster
const k8sProvider = new k8s.Provider("eks-k8s", {
    kubeconfig: cluster.apply(c => {
        // Get cluster CA certificate
        const clusterCert = pulumi.output(aws.eks.getCluster({
            name: clusterName,
        })).apply(c => c.certificateAuthorities[0].data);

        // Build kubeconfig
        return pulumi.interpolate`apiVersion: v1
kind: Config
clusters:
- cluster:
    server: ${c.endpoint}
    certificate-authority-data: ${clusterCert}
  name: ${clusterName}
contexts:
- context:
    cluster: ${clusterName}
    user: ${clusterName}
  name: ${clusterName}
current-context: ${clusterName}
users:
- name: ${clusterName}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: aws
      args:
        - eks
        - get-token
        - --cluster-name
        - ${clusterName}
        - --region
        - ${awsRegion}
`;
    }),
});

// Install CAST AI agent using Helm
const castaiAgent = new k8s.helm.v3.Release("castai-agent", {
    name: "castai-agent",
    chart: "castai-agent",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: true,
    cleanupOnFail: true,
    timeout: 300,
    values: {
        provider: "eks",
        createNamespace: false, // Required until https://github.com/castai/helm-charts/issues/135 is fixed
        apiURL: process.env.CASTAI_API_URL || "https://api.cast.ai",
        apiKey: castaiCluster.clusterToken,
    },
}, {
    provider: k8sProvider,
    dependsOn: [castaiCluster],
});

// Export useful information
export const clusterId = castaiCluster.id;
export const clusterToken = pulumi.secret(castaiCluster.clusterToken);
export const agentStatus = castaiAgent.status;
export const eksClusterEndpoint = cluster.endpoint;
export const eksClusterName = clusterName;
export const message = pulumi.interpolate`
✅ CAST AI agent installed successfully!

Your EKS cluster "${clusterName}" is now connected to CAST AI in READ-ONLY mode.

Next steps:
1. Log in to CAST AI console: https://console.cast.ai
2. Navigate to your cluster to see optimization recommendations
3. Review the recommendations and cost savings potential

Note: In read-only mode, CAST AI will NOT make any changes to your cluster.
It will only provide recommendations and cost analysis.

To enable optimization, you'll need to configure Phase 2 (full onboarding).
`;
