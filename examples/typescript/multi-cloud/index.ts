import * as pulumi from '@pulumi/pulumi';
import * as castai from '@castai/pulumi-castai';

// AWS EKS cluster connection
const eksCluster = new castai.aws.EksClusterConnection("eks-cluster", {
    region: "us-east-1",
    accountId: "123456789012",
    eksClusterName: "my-eks-cluster",
});

// GCP GKE cluster connection
const gkeCluster = new castai.gcp.GkeClusterConnection("gke-cluster", {
    projectId: "my-gcp-project",
    location: "us-central1",
    gkeClusterName: "my-gke-cluster",
});

// Azure AKS cluster connection
const aksCluster = new castai.azure.AksClusterConnection("aks-cluster", {
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
): castai.nodeconfig.NodeConfiguration {
    return new castai.nodeconfig.NodeConfiguration(name, {
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
): castai.autoscaling.Autoscaler {
    return new castai.autoscaling.Autoscaler(name, {
        clusterId: clusterId,
        unschedulablePods: {
            enabled: true,
        },
        nodeDownscaler: {
            enabled: true,
            params: {
                emptyNodes: {
                    enabled: true,
                },
            },
        },
        clusterLimits: {
            cpu: {
                maxCores: 100,
                minCores: 10,
                maxCorePct: 80.0,
                minCorePct: 20.0,
                coresPerVcpu: 1.0,
            },
            memory: {
                maxGb: 400,
                minGb: 40,
                maxGbPct: 80.0,
                minGbPct: 20.0,
            }
        },
    });
}

// Create autoscalers for each cluster
const eksAutoscaler = createAutoscaler("eks-autoscaler", eksCluster.id);
const gkeAutoscaler = createAutoscaler("gke-autoscaler", gkeCluster.id);
const aksAutoscaler = createAutoscaler("aks-autoscaler", aksCluster.id);

// IAM setup for AWS
const awsPolicy = new castai.iam.AwsIamPolicy("eks-policy", {
    accountId: "123456789012",
    eksClusterName: "my-eks-cluster",
    name: "castai-eks-policy",
});

const awsRole = new castai.iam.AwsIamRole("eks-role", {
    accountId: "123456789012",
    name: "castai-eks-role",
    externalId: "castai-eks",
    policyARNs: [awsPolicy.arn],
});

// IAM setup for GCP
const gcpServiceAccount = new castai.iam.GcpServiceAccount("gke-sa", {
    projectId: "my-gcp-project",
    name: "castai-gke-sa",
});

// IAM setup for Azure
const azureServicePrincipal = new castai.iam.AzureServicePrincipal("aks-sp", {
    tenantId: "tenant-id",
    subscriptionId: "subscription-id",
    name: "castai-aks-sp",
});

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