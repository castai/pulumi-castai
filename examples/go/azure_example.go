package main

import (
	"github.com/cast-ai/pulumi-castai/sdk/go/castai"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/autoscaling"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/azure"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/iam"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/nodeconfig"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// Configuration for the Azure cluster
type AksClusterConfig struct {
	SubscriptionID string
	TenantID       string
	ResourceGroup  string
	Location       string
	ClusterName    string
}

// runAzureExample shows how to use CAST AI with Azure AKS
func runAzureExample() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Initialize the provider (API token will be read from environment variable CASTAI_API_TOKEN)
		provider, err := castai.NewProvider(ctx, "castai-provider-azure", nil)
		if err != nil {
			return err
		}

		// Create a connection to an AKS cluster
		aksArgs := &azure.AksClusterArgs{}
		aksCluster, err := azure.NewAksCluster(ctx, "aks-cluster", aksArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Create a node configuration for the AKS cluster
		nodeArgs := &nodeconfig.NodeConfigurationArgs{
			ClusterID: aksCluster.ID(),
		}
		nodeConfig, err := nodeconfig.NewNodeConfiguration(ctx, "aks-node-config", nodeArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Configure autoscaling for the AKS cluster
		autoscalerArgs := &autoscaling.AutoscalerArgs{
			ClusterID: aksCluster.ID(),
			Enabled:   pulumi.Bool(true),
		}
		_, err = autoscaling.NewAutoscaler(ctx, "aks-autoscaler", autoscalerArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Create an Azure service principal for CAST AI
		spArgs := &iam.AzureServicePrincipalArgs{}
		servicePrincipal, err := iam.NewAzureServicePrincipal(ctx, "cast-ai-service-principal", spArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Export relevant IDs
		ctx.Export("clusterId", aksCluster.ID())
		ctx.Export("nodeConfigId", nodeConfig.ID)
		ctx.Export("servicePrincipalId", servicePrincipal.ID())

		return nil
	})
}
