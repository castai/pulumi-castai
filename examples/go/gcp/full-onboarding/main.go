package main

import (
	"os"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi-gcp/sdk/v7/go/gcp/projects"
	"github.com/pulumi/pulumi-gcp/sdk/v7/go/gcp/serviceaccount"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
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
		castaiServiceAccount, err := serviceaccount.NewAccount(ctx, "castai-service-account", &serviceaccount.AccountArgs{
			AccountId:   pulumi.String("castai-gke-access"),
			DisplayName: pulumi.String("CAST AI GKE Access Service Account"),
			Description: pulumi.String("Service account for CAST AI to manage GKE cluster"),
			Project:     pulumi.String(projectID),
		})
		if err != nil {
			return err
		}

		// Define the required roles for CAST AI
		requiredRoles := []string{
			"roles/container.clusterAdmin",
			"roles/compute.instanceAdmin.v1",
			"roles/iam.serviceAccountUser",
		}

		// Assign roles to the service account
		for i, role := range requiredRoles {
			_, err := projects.NewIAMMember(ctx, pulumi.Sprintf("castai-role-%d", i), &projects.IAMMemberArgs{
				Project: pulumi.String(projectID),
				Role:    pulumi.String(role),
				Member:  pulumi.Sprintf("serviceAccount:%s", castaiServiceAccount.Email),
			})
			if err != nil {
				return err
			}
		}

		// Create a service account key
		serviceAccountKey, err := serviceaccount.NewKey(ctx, "castai-service-account-key", &serviceaccount.KeyArgs{
			ServiceAccountId: castaiServiceAccount.Name,
			PublicKeyType:    pulumi.String("TYPE_X509_PEM_FILE"),
		})
		if err != nil {
			return err
		}

		// Initialize the CAST AI provider
		provider, err := castai.NewProvider(ctx, "castai-provider", &castai.ProviderArgs{
			ApiToken: pulumi.String(os.Getenv("CASTAI_API_TOKEN")),
		})
		if err != nil {
			return err
		}

		// Create a connection to a GKE cluster using the service account credentials
		gkeArgs := &castai.GkeClusterArgs{
			ProjectId:               pulumi.String(projectID),
			Location:                pulumi.String("us-central1"),
			Name:                    pulumi.String(clusterName),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			CredentialsJson:         serviceAccountKey.PrivateKey,
		}

		gkeCluster, err := castai.NewGkeCluster(ctx, "gke-cluster-connection", gkeArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Export useful information
		ctx.Export("clusterId", gkeCluster.ID())
		ctx.Export("serviceAccountEmail", castaiServiceAccount.Email)
		ctx.Export("serviceAccountName", castaiServiceAccount.Name)

		return nil
	})
}
