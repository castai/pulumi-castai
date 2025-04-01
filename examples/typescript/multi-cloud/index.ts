import * as pulumi from '@pulumi/pulumi';
import * as castai from '@pulumi/castai';

// AWS EKS cluster connection
const eksCluster = new castai.EksCluster("eks-cluster", {
    region: "us-east-1",
    accountId: "123456789012",
    eksClusterName: "my-eks-cluster",
});

// GCP GKE cluster connection
const gkeCluster = new castai.GkeCluster("gke-cluster", {
    projectId: "my-gcp-project",
    location: "us-central1",
    name: "my-gke-cluster",
});

// Azure AKS cluster connection
const aksCluster = new castai.AksCluster("aks-cluster", {
    tenantId: "tenant-id",
    subscriptionId: "subscription-id",
    resourceGroupName: "resource-group",
    aksClusterName: "my-aks-cluster",
});

// Define a function for creating node configurations
function createNodeConfig(
    name: string, 
    clusterId: pulumi.Output<string>,
    provider: string
): castai.NodeConfiguration {
    return new castai.NodeConfiguration(name, {
        clusterId: clusterId,
        constraints: {
            spotInstances: {
                enabled: true,
            },
            onDemandInstances: {
                enabled: true,
            },
        },
        tags: {
            env: "production",
            provider: provider,
        },
    });
}

// Create node configurations for each cluster
const eksNodeConfig = createNodeConfig(
    "eks-node-config", 
    eksCluster.id, 
    "aws"
);

const gkeNodeConfig = createNodeConfig(
    "gke-node-config", 
    gkeCluster.id, 
    "gcp"
);

const aksNodeConfig = createNodeConfig(
    "aks-node-config", 
    aksCluster.id, 
    "azure"
);

// Define a function for creating autoscalers
function createAutoscaler(
    name: string, 
    clusterId: pulumi.Output<string>
): castai.Autoscaler {
    return new castai.Autoscaler(name, {
        clusterId: clusterId,
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
    });
}

// Create autoscalers for each cluster
const eksAutoscaler = createAutoscaler("eks-autoscaler", eksCluster.id);
const gkeAutoscaler = createAutoscaler("gke-autoscaler", gkeCluster.id);
const aksAutoscaler = createAutoscaler("aks-autoscaler", aksCluster.id);

// Note: IAM setup sections (AwsIamPolicy, AwsIamRole, GcpServiceAccount, AzureServicePrincipal)
// were removed as these resources are not available in the current SDK

// Export cluster IDs
export const eksClusterId = eksCluster.id;
export const gkeClusterId = gkeCluster.id;
export const aksClusterId = aksCluster.id;

// Export node configuration IDs
export const eksNodeConfigId = eksNodeConfig.id;
export const gkeNodeConfigId = gkeNodeConfig.id;
export const aksNodeConfigId = aksNodeConfig.id;

// Export autoscaler IDs
export const eksAutoscalerId = eksAutoscaler.id;
export const gkeAutoscalerId = gkeAutoscaler.id;
export const aksAutoscalerId = aksAutoscaler.id; 