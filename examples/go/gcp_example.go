package main

import (
	"os"

	"github.com/cast-ai/pulumi-castai/sdk/go/castai"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/gcp"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runGcpExample shows how to connect a GCP GKE cluster to CAST AI
func runGcpExample() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Initialize the provider (API token will be read from environment variable CASTAI_API_TOKEN)
		provider, err := castai.NewProvider(ctx, "castai-provider", nil)
		if err != nil {
			return err
		}

		// Get GCP project ID from environment variable or use a default value
		projectID := os.Getenv("GCP_PROJECT_ID")
		if projectID == "" {
			projectID = "my-gcp-project-id"
		}

		// Get GKE cluster name from environment variable or use a default value
		clusterName := os.Getenv("GKE_CLUSTER_NAME")
		if clusterName == "" {
			clusterName = "cast_ai_test_cluster"
		}

		// Create a connection to a GKE cluster
		gkeArgs := &gcp.GkeClusterArgs{
			ProjectId:              pulumi.String(projectID),
			Location:               pulumi.String("us-central1"),
			Name:                   pulumi.String(clusterName),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			// Optional: provide credentials JSON directly from environment
			CredentialsJson:        pulumi.String(os.Getenv("GOOGLE_CREDENTIALS")),
		}

		gkeCluster, err := gcp.NewGkeCluster(ctx, "gke-cluster-connection", gkeArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Export the cluster ID
		ctx.Export("clusterId", gkeCluster.ID())

		return nil
	})
}
