import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";

// Initialize the CAST AI provider
const provider = new castai.Provider("castai", {
    // API token will be read from the environment variable CASTAI_API_TOKEN
});

// Example AKS cluster configuration
const aksCluster = new castai.AksCluster("example-aks-cluster", {
    // Replace with your Azure subscription ID
    subscriptionId: "00000000-0000-0000-0000-000000000000",
    // Replace with your Azure resource group name
    resourceGroupName: "my-resource-group",
    // Replace with your AKS cluster name
    aksClusterName: "my-aks-cluster",
    // Replace with your Azure tenant ID
    tenantId: "00000000-0000-0000-0000-000000000000",
});

// Configure autoscaling for the AKS cluster
const autoscaler = new castai.Autoscaler("aks-autoscaler", {
    clusterId: aksCluster.id,
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

// Example of configuring a node template for AKS
const nodeTemplate = new castai.NodeTemplate("aks-node-template", {
    clusterId: aksCluster.id,
    name: "aks-optimized-nodes",
    enabled: true,
    constraints: {
        onDemandPct: 50,
        spotPct: 50,
    },
    labels: {
        "environment": "production",
        "service": "backend"
    },
    taints: [
        {
            key: "dedicated",
            value: "backend",
            effect: "NoSchedule",
        },
    ],
});

// Configure Azure service principal for CAST AI
const azureAuth = new castai.ClusterToken("aks-auth", {
    clusterId: aksCluster.id,
    // Remove client-specific properties that don't exist on ClusterToken
});

// Export relevant resources
export const clusterId = aksCluster.id;
export const nodeTemplateId = nodeTemplate.id;
export const azureAuthId = azureAuth.id;

/* 
// Azure IAM role configuration is not currently supported in the SDK
// This is a placeholder for future implementation
const azureIamRole = new castai.AzureIamRole("aks-iam-role", {
    subscriptionId: "00000000-0000-0000-0000-000000000000", 
    roleName: "CastAIClusterManager",
    roleDefinition: JSON.stringify({
        name: "CAST AI Cluster Manager",
        description: "Allows CAST AI to manage AKS clusters",
        assignableScopes: [
            "/subscriptions/00000000-0000-0000-0000-000000000000"
        ],
        permissions: [
            {
                actions: [
                    "Microsoft.ContainerService/managedClusters/read",
                    "Microsoft.ContainerService/managedClusters/write",
                    "Microsoft.ContainerService/managedClusters/agentPools/read",
                    "Microsoft.ContainerService/managedClusters/agentPools/write"
                ],
                notActions: [],
            }
        ],
    }),
});
*/ 