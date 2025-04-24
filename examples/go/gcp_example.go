package main

import (
	castai "github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runGcpExample shows how to use CAST AI with GCP GKE
func runGcpExample() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Initialize the provider (API token will be read from environment variable CASTAI_API_TOKEN)
		provider, err := castai.NewProvider(ctx, "castai-provider-gcp", &castai.ProviderArgs{})
		if err != nil {
			return err
		}

		// Create a connection to a GKE cluster
		gkeArgs := &castai.GkeClusterArgs{
			ProjectId: pulumi.String("my-gcp-project"),
			Location:  pulumi.String("us-central1"),
			Name:      pulumi.String("my-gke-cluster"),
		}
		gkeCluster, err := castai.NewGkeCluster(ctx, "gke-cluster", gkeArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Configure autoscaling
		autoscalerArgs := &castai.AutoscalerArgs{
			ClusterId: gkeCluster.ID(),
		}
		autoscaler, err := castai.NewAutoscaler(ctx, "gke-autoscaler", autoscalerArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Export relevant IDs
		ctx.Export("clusterId", gkeCluster.ID())
		ctx.Export("autoscalerId", autoscaler.ID())

		return nil
	})
}
