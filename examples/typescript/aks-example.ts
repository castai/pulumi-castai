import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi-castai";

// Initialize the CAST AI provider
const provider = new castai.Provider("castai", {
    // API token will be read from the environment variable CASTAI_API_TOKEN
});

// Example AKS cluster configuration
const aksCluster = new castai.azure.AksCluster("example-aks-cluster", {
    subscriptionId: "00000000-0000-0000-0000-000000000000", // Replace with your Azure subscription ID
    resourceGroupName: "my-resource-group",                 // Replace with your Azure resource group
    clusterName: "my-aks-cluster",                          // Replace with your AKS cluster name
    location: "eastus",                                      // Replace with your Azure region
    tenantId: "00000000-0000-0000-0000-000000000000",       // Replace with your Azure tenant ID
});

// Configure autoscaling for the AKS cluster
const autoscaler = new castai.autoscaling.Autoscaler("aks-autoscaler", {
    clusterId: aksCluster.id,
    enabled: true,
    unschedulablePods: {
        enabled: true,
        dryRun: false,
    },
    nodeDownscaler: {
        enabled: true,
        emptyNodes: {
            enabled: true,
            delaySeconds: 300,
        },
    },
});

// Example of configuring a node template for AKS
const nodeTemplate = new castai.nodeconfig.NodeTemplate("aks-node-template", {
    clusterId: aksCluster.id,
    name: "aks-optimized-nodes",
    enabled: true,
    constraints: {
        onDemandPct: 50,
        spotPct: 50,
    },
    labels: {
        "environment": "production",
        "app": "my-application"
    },
    taints: [
        {
            key: "workload_type",
            value: "webservice",
            effect: "NoSchedule",
        },
    ],
});

// Configure Azure IAM role (example based on IAM requirements)
const azureIamRole = new castai.iam.AzureIamRole("aks-iam-role", {
    subscriptionId: "00000000-0000-0000-0000-000000000000", // Your Azure subscription ID
    roleName: "CastAIClusterManager",
    roleDefinition: JSON.stringify({
        // Your Azure role definition here
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

// Export cluster ID and other useful outputs
export const clusterId = aksCluster.id;
export const nodeTemplateId = nodeTemplate.id; 