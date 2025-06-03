package main

import (
	"fmt"
	"os"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi-gcp/sdk/v7/go/gcp/projects"
	"github.com/pulumi/pulumi-gcp/sdk/v7/go/gcp/serviceaccount"
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

		// Create a service account for CAST AI
		fmt.Println("Creating CAST AI service account...")
		castaiServiceAccount, err := serviceaccount.NewAccount(ctx, "castai-service-account", &serviceaccount.AccountArgs{
			AccountId:   pulumi.String("castai-gke-access"),
			DisplayName: pulumi.String("CAST AI GKE Access Service Account"),
			Description: pulumi.String("Service account for CAST AI to manage GKE cluster"),
			Project:     pulumi.String(projectID),
		})
		if err != nil {
			fmt.Println("Error creating service account:", err)
			return err
		}
		fmt.Println("Service account created successfully")

		// Define the required roles for CAST AI
		requiredRoles := []string{
			"roles/container.clusterAdmin",
			"roles/compute.instanceAdmin.v1",
			"roles/iam.serviceAccountUser",
		}

		// Assign roles to the service account
		fmt.Println("Assigning roles to service account...")
		for i, role := range requiredRoles {
			_, err := projects.NewIAMMember(ctx, pulumi.Sprintf("castai-role-%d", i), &projects.IAMMemberArgs{
				Project: pulumi.String(projectID),
				Role:    pulumi.String(role),
				Member:  pulumi.Sprintf("serviceAccount:%s", castaiServiceAccount.Email),
			})
			if err != nil {
				fmt.Printf("Error assigning role %s: %v\n", role, err)
				return err
			}
		}
		fmt.Println("Roles assigned successfully")

		// Create a service account key
		fmt.Println("Creating service account key...")
		serviceAccountKey, err := serviceaccount.NewKey(ctx, "castai-service-account-key", &serviceaccount.KeyArgs{
			ServiceAccountId: castaiServiceAccount.Name,
			PublicKeyType:    pulumi.String("TYPE_X509_PEM_FILE"),
		})
		if err != nil {
			fmt.Println("Error creating service account key:", err)
			return err
		}
		fmt.Println("Service account key created successfully")

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

		// Create a connection to a GKE cluster using the service account credentials
		fmt.Println("Creating GKE cluster connection...")
		gkeArgs := &castai.GkeClusterArgs{
			ProjectId:               pulumi.String(projectID),
			Location:                pulumi.String("us-central1"),
			Name:                    pulumi.String(clusterName),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			CredentialsJson:         serviceAccountKey.PrivateKey,
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
		ctx.Export("serviceAccountEmail", castaiServiceAccount.Email)
		ctx.Export("serviceAccountName", castaiServiceAccount.Name)

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
