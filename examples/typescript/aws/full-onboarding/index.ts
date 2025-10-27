/**
 * CAST AI AWS Full Onboarding Example (Phase 1 + Phase 2)
 *
 * This example provides a SIMPLIFIED approach to CAST AI onboarding for an EKS cluster.
 * It uses a reusable IAM component that encapsulates all AWS resource complexity.
 *
 * What this example does:
 * - Phase 1: Registers cluster and installs castai-agent for read-only monitoring
 * - Phase 2: Sets up IAM infrastructure and enables full cluster management
 * - Installs all necessary Helm charts (agent, controller, spot-handler, evictor, pod-pinner)
 *
 * Prerequisites:
 * - Existing EKS cluster
 * - AWS credentials configured
 * - kubectl configured to access the cluster
 * - CAST AI API token
 *
 * Required environment variables:
 * - CASTAI_API_TOKEN: Your CAST AI API token
 * - AWS_ACCESS_KEY_ID: Your AWS access key ID
 * - AWS_SECRET_ACCESS_KEY: Your AWS secret access key
 * - AWS_REGION: Your AWS region
 * - EKS_CLUSTER_NAME: Name of your existing EKS cluster
 *
 * Note: VPC ID is automatically discovered from the EKS cluster.
 *
 * EKS Authentication Modes:
 * This example handles ALL authentication modes by default (matching CAST AI onboarding script):
 * - API mode: Uses EKS access entries ✓
 * - CONFIG_MAP mode: Updates aws-auth ConfigMap ✓
 * - API_AND_CONFIG_MAP mode: Does both ✓
 *
 * The aws-auth ConfigMap is safely updated by reading existing entries and merging.
 * If your cluster uses pure API mode, you can skip ConfigMap updates by removing
 * the k8sProvider parameter (see line 119).
 *
 * For fine-grained control over IAM resources, see the "custom-iam" example.
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";
import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";
import { EksIamResources } from "./components/eks-iam";

// ============================================================================
// Configuration
// ============================================================================

const castaiApiToken = process.env.CASTAI_API_TOKEN!;
const awsRegion = process.env.AWS_REGION!;
const eksClusterName = process.env.EKS_CLUSTER_NAME!;
const castaiApiUrl = process.env.CASTAI_API_URL || "https://api.cast.ai";

if (!castaiApiToken || !awsRegion || !eksClusterName) {
    throw new Error("Missing required environment variables: CASTAI_API_TOKEN, AWS_REGION, EKS_CLUSTER_NAME");
}

// ============================================================================
// Providers
// ============================================================================

const castaiProvider = new castai.Provider("castai-provider", {
    apiToken: castaiApiToken,
    apiUrl: castaiApiUrl,
});

// ============================================================================
// Get AWS and EKS Information
// ============================================================================

const caller = aws.getCallerIdentity({});
const awsAccountId = caller.then((c: aws.GetCallerIdentityResult) => c.accountId);

const eksCluster = pulumi.output(aws.eks.getCluster({
    name: eksClusterName,
}));

// ============================================================================
// Phase 1: Register Cluster with CAST AI
// ============================================================================

// Register cluster (Phase 1 - creates cluster registration and gets cluster token)
const castaiClusterPhase1 = new castai.EksCluster("castai-eks-cluster-phase1", {
    accountId: awsAccountId,
    region: awsRegion,
    name: eksClusterName,
}, { provider: castaiProvider });

const castaiClusterId = castaiClusterPhase1.id;

// Get CAST AI user ARN for IAM trust relationship
const castaiUserArn = new castai.EksUserArn("castai-user-arn", {
    clusterId: castaiClusterId,
}, { provider: castaiProvider });

// ============================================================================
// Kubernetes Provider (needed for IAM component ConfigMap updates)
// ============================================================================

const k8sProvider = new k8s.Provider("eks-k8s", {
    kubeconfig: eksCluster.apply(cluster => {
        const clusterCert = pulumi.output(aws.eks.getCluster({
            name: eksClusterName,
        })).apply(c => c.certificateAuthorities[0].data);

        return pulumi.interpolate`apiVersion: v1
kind: Config
clusters:
- cluster:
    server: ${cluster.endpoint}
    certificate-authority-data: ${clusterCert}
  name: ${eksClusterName}
contexts:
- context:
    cluster: ${eksClusterName}
    user: ${eksClusterName}
  name: ${eksClusterName}
current-context: ${eksClusterName}
users:
- name: ${eksClusterName}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: aws
      args:
        - eks
        - get-token
        - --cluster-name
        - ${eksClusterName}
        - --region
        - ${awsRegion}
`;
    }),
});

// ============================================================================
// Phase 2: Create IAM Infrastructure (using component)
// ============================================================================

// Create all IAM resources using the reusable component
// This replaces ~300 lines of manual IAM resource creation!
//
// By default, this updates BOTH:
// - EKS access entries (for API and API_AND_CONFIG_MAP modes)
// - aws-auth ConfigMap (for CONFIG_MAP and API_AND_CONFIG_MAP modes)
//
// This matches the behavior of the official CAST AI onboarding script.
// The component will automatically:
// - Read the existing aws-auth ConfigMap
// - Merge in the CAST AI node role
// - Update the ConfigMap without overwriting existing entries
//
// If your cluster uses pure API mode and you want to skip ConfigMap updates,
// remove the k8sProvider parameter below.
const iamResources = new EksIamResources("castai-eks-iam", {
    clusterName: eksClusterName,
    region: awsRegion,
    accountId: awsAccountId,
    vpcId: eksCluster.vpcConfig.vpcId,
    castaiUserArn: castaiUserArn.arn,
    clusterId: castaiClusterId,
    k8sProvider: k8sProvider,  // Comment this out if using pure API mode
});

// Update cluster with IAM role to enable Phase 2 (full management)
const eksClusterConnection = new castai.EksCluster("eks-cluster-connection", {
    accountId: awsAccountId,
    region: awsRegion,
    name: eksClusterName,
    assumeRoleArn: iamResources.roleArn,
    deleteNodesOnDisconnect: false,
}, {
    provider: castaiProvider,
    dependsOn: [castaiClusterPhase1, iamResources],
});

// ============================================================================
// Install Helm Charts
// ============================================================================

// Install CAST AI agent (Phase 1 - read-only monitoring)
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
    skipAwait: false,
    values: {
        provider: "eks",
        createNamespace: false,
        apiURL: castaiApiUrl,
        apiKey: castaiClusterPhase1.clusterToken,
    },
}, {
    provider: k8sProvider,
    dependsOn: [castaiClusterPhase1],
});

// ============================================================================
// EKS Cluster Access
// ============================================================================

// Note: The EksIamResources component handles cluster access by default:
// - Always creates EKS access entry (for API mode)
// - Updates aws-auth ConfigMap if k8sProvider is provided (for CONFIG_MAP mode)
// This ensures compatibility with all EKS authentication modes, matching the
// behavior of the official CAST AI onboarding script.

// Install cluster controller (Phase 2 component)
const clusterController = new k8s.helm.v3.Release("cluster-controller", {
    name: "cluster-controller",
    chart: "castai-cluster-controller",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: false,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        castai: {
            clusterID: eksClusterConnection.id,
            apiURL: castaiApiUrl,
            apiKey: castaiApiToken,
        },
    },
}, {
    provider: k8sProvider,
    dependsOn: [castaiAgent, eksClusterConnection],
    customTimeouts: {
        create: "5m",
        update: "5m",
        delete: "5m",
    },
});

// Install spot handler (Phase 2 component)
const castaiSpotHandler = new k8s.helm.v3.Release("castai-spot-handler", {
    name: "castai-spot-handler",
    chart: "castai-spot-handler",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: false,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        castai: {
            clusterID: eksClusterConnection.id,
            provider: "eks",
        },
    },
}, {
    provider: k8sProvider,
    dependsOn: [clusterController],
    customTimeouts: {
        create: "5m",
        update: "5m",
        delete: "5m",
    },
});

// Install evictor (Phase 2 component)
const castaiEvictor = new k8s.helm.v3.Release("castai-evictor", {
    name: "castai-evictor",
    chart: "castai-evictor",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: false,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        replicaCount: 0,
    },
}, {
    provider: k8sProvider,
    dependsOn: [clusterController],
    customTimeouts: {
        create: "5m",
        update: "5m",
        delete: "5m",
    },
});

// Install pod pinner (Phase 2 component)
const castaiPodPinner = new k8s.helm.v3.Release("castai-pod-pinner", {
    name: "castai-pod-pinner",
    chart: "castai-pod-pinner",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: false,
    cleanupOnFail: true,
    timeout: 300,
    skipAwait: true,
    values: {
        castai: {
            apiKey: castaiApiToken,
            clusterID: eksClusterConnection.id,
        },
        replicaCount: 0,
    },
}, {
    provider: k8sProvider,
    dependsOn: [clusterController],
    customTimeouts: {
        create: "5m",
        update: "5m",
        delete: "5m",
    },
});

// ============================================================================
// Exports
// ============================================================================

export const clusterName = eksClusterName;
export const clusterId = eksClusterConnection.id;
export const castaiRoleArn = iamResources.roleArn;
export const instanceProfileArn = iamResources.instanceProfileArn;
export const controllerHelmRelease = clusterController.name;
export const evictorHelmRelease = castaiEvictor.name;
export const podPinnerHelmRelease = castaiPodPinner.name;
