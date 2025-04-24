package main

import (
	"os"

	castai "github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runAzureExample shows how to connect an Azure AKS cluster to CAST AI
func runAzureExample() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Initialize the provider (API token will be read from environment variable CASTAI_API_TOKEN)
		provider, err := castai.NewProvider(ctx, "castai-provider", &castai.ProviderArgs{})
		if err != nil {
			return err
		}

		// Get Azure values from environment variables or use defaults
		subscriptionID := os.Getenv("AZURE_SUBSCRIPTION_ID")
		if subscriptionID == "" {
			subscriptionID = "00000000-0000-0000-0000-000000000000"
		}

		tenantID := os.Getenv("AZURE_TENANT_ID")
		if tenantID == "" {
			tenantID = "00000000-0000-0000-0000-000000000000"
		}

		resourceGroup := os.Getenv("AZURE_RESOURCE_GROUP")
		if resourceGroup == "" {
			resourceGroup = "my-resource-group"
		}

		// Get AKS cluster name from environment variable or use a default value
		clusterName := os.Getenv("AKS_CLUSTER_NAME")
		if clusterName == "" {
			clusterName = "cast_ai_test_cluster"
		}

		// Create a connection to an AKS cluster
		aksArgs := &castai.AksClusterArgs{
			SubscriptionId:          pulumi.String(subscriptionID),
			TenantId:                pulumi.String(tenantID),
			NodeResourceGroup:       pulumi.String(resourceGroup),
			Name:                    pulumi.String(clusterName),
			Region:                  pulumi.String("eastus"), // Example region
			ClientId:                pulumi.String("00000000-0000-0000-0000-000000000000"), // Example client ID
			ClientSecret:            pulumi.String("client-secret"), // Example client secret
			DeleteNodesOnDisconnect: pulumi.Bool(true),
		}

		aksCluster, err := castai.NewAksCluster(ctx, "aks-cluster-connection", aksArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Export the cluster ID
		ctx.Export("clusterId", aksCluster.ID())

		return nil
	})
}
