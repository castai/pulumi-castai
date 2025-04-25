package main

import (
	"fmt"
	"os"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runGcpExample shows how to use CAST AI with GCP GKE
func runGcpExample() {
	fmt.Println("Starting GCP example...")
	fmt.Println("CASTAI_API_TOKEN:", maskToken(os.Getenv("CASTAI_API_TOKEN")))
	fmt.Println("GCP_PROJECT_ID:", os.Getenv("GCP_PROJECT_ID"))
	fmt.Println("GKE_CLUSTER_NAME:", os.Getenv("GKE_CLUSTER_NAME"))

	// Run the Pulumi program
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		fmt.Println("Inside pulumi.Run...")

		// Initialize the provider (API token will be read from environment variable CASTAI_API_TOKEN)
		fmt.Println("Creating provider...")
		provider, err := castai.NewProvider(ctx, "castai-provider-gcp", &castai.ProviderArgs{
			ApiToken: pulumi.String(os.Getenv("CASTAI_API_TOKEN")),
		})
		if err != nil {
			fmt.Println("Error creating provider:", err)
			return err
		}
		fmt.Println("Provider created successfully")

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
		fmt.Println("Creating GKE cluster connection...")
		gkeArgs := &castai.GkeClusterArgs{
			ProjectId: pulumi.String(projectID),
			Location:  pulumi.String("us-central1"),
			Name:      pulumi.String(clusterName),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
		}
		gkeCluster, err := castai.NewGkeCluster(ctx, "gke-cluster", gkeArgs, pulumi.Provider(provider))
		if err != nil {
			fmt.Println("Error creating GKE cluster connection:", err)
			return err
		}
		fmt.Println("GKE cluster connection created successfully")

		// Configure autoscaling
		fmt.Println("Creating autoscaler...")
		autoscalerArgs := &castai.AutoscalerArgs{
			ClusterId: gkeCluster.ID(),
		}
		autoscaler, err := castai.NewAutoscaler(ctx, "gke-autoscaler", autoscalerArgs, pulumi.Provider(provider))
		if err != nil {
			fmt.Println("Error creating autoscaler:", err)
			return err
		}
		fmt.Println("Autoscaler created successfully")

		// Export relevant IDs
		ctx.Export("clusterId", gkeCluster.ID())
		ctx.Export("autoscalerId", autoscaler.ID())

		fmt.Println("GCP example completed successfully!")
		return nil
	})

	if err != nil {
		fmt.Println("Error running Pulumi program:", err)
		// Don't exit with an error code, just print the error
		fmt.Println("GCP example completed with errors, but continuing...")
	}
}

// Helper function to mask tokens for security
func maskToken(token string) string {
	if len(token) <= 8 {
		return "***"
	}
	return token[:4] + "..." + token[len(token)-4:]
}
