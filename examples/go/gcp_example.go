package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/castai/pulumi-castai/sdk/go/castai/autoscaling"
	"github.com/castai/pulumi-castai/sdk/go/castai/gcp"
	"github.com/castai/pulumi-castai/sdk/go/castai/iam"
	"github.com/castai/pulumi-castai/sdk/go/castai/nodeconfig"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runGcpExample shows how to use CAST AI with GCP GKE
func runGcpExample() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Initialize the provider (API token will be read from environment variable CASTAI_API_TOKEN)
		provider, err := castai.NewProvider(ctx, "castai-provider-gcp", nil)
		if err != nil {
			return err
		}

		// Create a connection to a GKE cluster
		gkeArgs := &gcp.GkeClusterArgs{}
		gkeCluster, err := gcp.NewGkeCluster(ctx, "gke-cluster", gkeArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Create a node configuration
		nodeArgs := &nodeconfig.NodeConfigurationArgs{
			ClusterID: gkeCluster.ID(),
		}
		nodeConfig, err := nodeconfig.NewNodeConfiguration(ctx, "gke-node-config", nodeArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Configure autoscaling
		autoscalerArgs := &autoscaling.AutoscalerArgs{
			ClusterID: gkeCluster.ID(),
			Enabled:   pulumi.Bool(true),
		}
		_, err = autoscaling.NewAutoscaler(ctx, "gke-autoscaler", autoscalerArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Create a GCP service account for CAST AI
		saArgs := &iam.GcpServiceAccountArgs{}
		gcpServiceAccount, err := iam.NewGcpServiceAccount(ctx, "cast-ai-service-account", saArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Export relevant IDs
		ctx.Export("clusterId", gkeCluster.ID())
		ctx.Export("nodeConfigId", nodeConfig.ID)
		ctx.Export("serviceAccountEmail", gcpServiceAccount.Email)

		return nil
	})
}
