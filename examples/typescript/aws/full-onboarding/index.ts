/**
 * CAST AI EKS Full Onboarding Example (Phase 1 + Phase 2)
 *
 * This example connects an existing EKS cluster to CAST AI with full management
 * capabilities using the high-level CastAiEksCluster component.
 *
 * What this example does:
 * - Phase 1: Registers cluster and installs castai-agent for monitoring
 * - Phase 2: Sets up IAM infrastructure and enables full cluster management
 * - Creates default node configuration with instance profile and security groups
 * - Installs all necessary Helm charts (agent, controller, spot-handler, evictor, pod-pinner)
 * - Handles all EKS authentication modes (API, CONFIG_MAP, API_AND_CONFIG_MAP)
 *
 * Prerequisites:
 * - Existing EKS cluster
 * - AWS credentials configured
 * - kubectl configured to access the cluster
 * - CAST AI API token
 *
 * Required environment variables:
 * - CASTAI_API_TOKEN: Your CAST AI API token
 * - EKS_CLUSTER_NAME: Name of your existing EKS cluster
 * - AWS_REGION: AWS region (e.g., us-east-1)
 *
 * Optional environment variables:
 * - CASTAI_API_URL: CAST AI API URL (defaults to https://api.cast.ai)
 * - DELETE_NODES_ON_DISCONNECT: Remove nodes when disconnecting (defaults to false)
 */

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as castai from "@castai/pulumi";
import { CastAiEksCluster } from "../../../../components/eks-cluster/typescript";

// ============================================================================
// Configuration
// ============================================================================

const castaiApiToken = process.env.CASTAI_API_TOKEN!;
const clusterName = process.env.EKS_CLUSTER_NAME!;
const region = process.env.AWS_REGION!;
const castaiApiUrl = process.env.CASTAI_API_URL;
const deleteNodesOnDisconnect = process.env.DELETE_NODES_ON_DISCONNECT === "true";

if (!castaiApiToken || !clusterName || !region) {
    throw new Error("Missing required environment variables: CASTAI_API_TOKEN, EKS_CLUSTER_NAME, AWS_REGION");
}

// ============================================================================
// Get AWS and EKS Information
// ============================================================================

// Get AWS account ID
const caller = aws.getCallerIdentity({});
const accountId = caller.then(c => c.accountId);

// Get EKS cluster details
const eksCluster = pulumi.output(aws.eks.getCluster({
    name: clusterName,
}));

// Extract networking information
const clusterSecurityGroupId = eksCluster.vpcConfig.clusterSecurityGroupId;
const subnetIds = eksCluster.vpcConfig.subnetIds;

// ============================================================================
// Connect Cluster to CAST AI (Full Management)
// ============================================================================

const cluster = new CastAiEksCluster("castai-cluster", {
    clusterName: clusterName,
    region: region,
    accountId: accountId,
    apiToken: castaiApiToken,
    apiUrl: castaiApiUrl,

    // Networking configuration for CAST AI provisioned nodes
    // The component automatically creates a default node configuration
    // with instance profile ARN and security groups
    subnets: subnetIds,
    securityGroups: [clusterSecurityGroupId],

    // Cluster management settings
    deleteNodesOnDisconnect: deleteNodesOnDisconnect,

    // Optional: Enable additional features
    installWorkloadAutoscaler: false,
    installEgressd: false,

    autoscalerEnabled: true,
});

// ============================================================================
// Optional: Create Additional Node Configurations
// ============================================================================
//
// The component automatically creates a "default" node configuration.
// You can create additional custom configurations with different settings.
//
// Common use cases:
// - GPU-optimized nodes with specific instance types
// - High-throughput nodes with custom EBS volumes
// - Nodes with custom kubelet/container runtime settings
// - Different subnet configurations for different workloads
//
// Uncomment the example below to add a custom configuration:

/*
const customNodeConfig = new castai.config.NodeConfiguration("custom-config", {
    clusterId: cluster.clusterId,
    name: "gpu-nodes",  // Custom name for this configuration
    subnets: subnetIds,
    tags: {
        "node-type": "gpu-optimized",
        "environment": "production",
    },

    // EKS-specific configuration
    eks: {
        instanceProfileArn: cluster.instanceProfileArn!,
        securityGroups: pulumi.all([cluster.securityGroupId!, clusterSecurityGroupId])
            .apply(([castaiSG, clusterSG]) => [castaiSG, clusterSG]),

        // Use containerd instead of dockerd
        containerRuntime: "containerd",

        // Enable IMDSv1 for legacy workloads
        imdsV1: true,

        // Use gp3 volumes with custom IOPS and throughput
        volumeType: "gp3",
        volumeIops: 3100,
        volumeThroughput: 130,
    },

    // Custom kubelet configuration (JSON string)
    kubeletConfig: JSON.stringify({
        "registryBurst": 20,
        "registryPullQPS": 10,
        "maxPods": 110,
    }),

    // Minimum disk size in GiB
    minDiskSize: 100,
}, {
    dependsOn: [cluster],
});

// Additional EKS options available (not shown above):
// - eks.dnsClusterIp: Custom DNS cluster IP
// - eks.eksImageFamily: "al2", "al2023", or "bottlerocket"
// - eks.imdsHopLimit: IMDSv2 hop limit (default: 2)
// - eks.keyPairId: AWS key pair for SSH access
// - eks.maxPodsPerNodeFormula: Custom formula for max pods
// - eks.volumeKmsKeyArn: KMS key for EBS encryption
// - containerRuntime: "dockerd" or "containerd"
// - dockerConfig: Custom Docker daemon config (JSON string)
// - initScript: Base64-encoded init script
// - sshPublicKey: SSH public key for node access
// - diskCpuRatio: GiB per CPU ratio
// - drainTimeoutSec: Node drain timeout
//
// See: /Users/leonkuperman/LKDev/CAST/pulumi-castai/sdk/nodejs/config/nodeConfiguration.d.ts
*/

// ============================================================================
// Exports
// ============================================================================

export const clusterId = cluster.clusterId;
export const clusterToken = pulumi.secret(cluster.clusterToken);
export const castaiRoleArn = cluster.castaiRoleArn;
export const instanceProfileArn = cluster.instanceProfileArn;
export const nodeRoleArn = cluster.nodeRoleArn;
export const securityGroupId = cluster.securityGroupId;

export const message = pulumi.interpolate`
✅ CAST AI full onboarding complete!

Your EKS cluster "${clusterName}" is now fully connected to CAST AI.

Resources created:
- Cluster ID: ${clusterId}
- IAM Role: ${castaiRoleArn}
- Instance Profile: ${instanceProfileArn}
- Node Role: ${nodeRoleArn}
- Security Group: ${securityGroupId}
- Default Node Configuration (visible in CAST AI console)

Next steps:
1. Log in to CAST AI console: https://console.cast.ai
2. Navigate to your cluster
3. Review the default node configuration and template
4. Enable the autoscaler when ready
5. Configure additional node templates and policies as needed

Note: The cluster is registered with a default node configuration.
Autoscaling is disabled by default - enable it in the CAST AI console
when you're ready to start optimizing.
`;
