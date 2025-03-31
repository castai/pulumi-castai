package main

import (
	"github.com/cast-ai/pulumi-castai/sdk/go/castai"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/autoscaling"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/gcp"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/nodeconfig"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Create a CAST AI provider instance
		provider, err := castai.NewProvider(ctx, "castai-provider", &castai.ProviderArgs{
			// API token will be read from environment variable CASTAI_API_TOKEN
		})
		if err != nil {
			return err
		}

		// Create a connection to a GKE cluster
		gkeCluster, err := gcp.NewGkeCluster(ctx, "gke-cluster-connection", &gcp.GkeClusterArgs{
			ProjectId: pulumi.String("my-gcp-project-id"), // Replace with your GCP project ID
			Location:  pulumi.String("us-central1"),       // Replace with your GCP location
			Name:      pulumi.String("my-gke-cluster"),    // Replace with your GKE cluster name
			// Optional: provide credentials JSON directly
			// CredentialsJson: pulumi.String("{ ... }"),
		}, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Create a node configuration
		nodeConfig, err := nodeconfig.NewNodeConfiguration(ctx, "gke-node-config", &nodeconfig.NodeConfigurationArgs{
			ClusterId: gkeCluster.ID(),
			Constraints: pulumi.Map{
				"spotInstances": pulumi.Map{
					"enabled": pulumi.Bool(true),
				},
				"onDemandInstances": pulumi.Map{
					"enabled": pulumi.Bool(true),
				},
			},
			Tags: pulumi.StringMap{
				"Environment": pulumi.String("Development"),
				"ManagedBy":   pulumi.String("CAST AI"),
			},
		}, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Configure autoscaling
		_, err = autoscaling.NewAutoscaler(ctx, "gke-autoscaler", &autoscaling.AutoscalerArgs{
			ClusterId: gkeCluster.ID(),
			Enabled:   pulumi.Bool(true),
			UnschedulablePods: pulumi.Map{
				"enabled": pulumi.Bool(true),
				"dryRun":  pulumi.Bool(false),
			},
			NodeDownscaler: pulumi.Map{
				"enabled": pulumi.Bool(true),
				"emptyNodes": pulumi.Map{
					"enabled":      pulumi.Bool(true),
					"delaySeconds": pulumi.Int(300),
				},
			},
		}, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Export relevant IDs
		ctx.Export("clusterId", gkeCluster.ID())
		ctx.Export("nodeConfigId", nodeConfig.ID())
		return nil
	})
}
