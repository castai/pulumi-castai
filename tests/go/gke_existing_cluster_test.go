package tests

import (
	"testing"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/stretchr/testify/assert"
)

// Mock Tests for Connecting Existing GKE Clusters to CAST AI (Go)
//
// These tests simulate connecting an existing GKE cluster to CAST AI for optimization.
// The cluster already exists - we're just onboarding it to CAST AI.
//
// Run with: go test -v -run TestConnectExistingGke

func TestConnectExistingGkeCluster(t *testing.T) {
	// Test connecting an existing GKE cluster to CAST AI
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Simulated GCP service account credentials
		mockCredentials := `{"type": "service_account", "project_id": "my-gcp-project"}`

		// Connect existing cluster - in real scenario, cluster already exists in GCP
		cluster, err := castai.NewGkeCluster(ctx, "existing-gke-cluster", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("my-gcp-project-123"),
			Location:                pulumi.String("us-central1"),
			Name:                    pulumi.String("production-gke-cluster"), // Existing cluster name
			DeleteNodesOnDisconnect: pulumi.Bool(false),                     // Don't delete nodes when disconnecting
			CredentialsJson:         pulumi.String(mockCredentials),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)

		// Verify outputs
		cluster.ID().ApplyT(func(id string) error {
			assert.NotEmpty(t, id, "Cluster ID should not be empty")
			return nil
		})

		cluster.Name.ApplyT(func(name string) error {
			assert.Equal(t, "production-gke-cluster", name)
			return nil
		})

		cluster.ClusterToken.ApplyT(func(token string) error {
			assert.NotEmpty(t, token, "Cluster token should not be empty")
			return nil
		})

		cluster.ProjectId.ApplyT(func(projectId string) error {
			assert.Equal(t, "my-gcp-project-123", projectId)
			return nil
		})

		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingGkeRegionalCluster(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		mockCredentials := `{"type": "service_account", "project_id": "prod-project"}`

		// Regional cluster for HA (vs zonal cluster)
		cluster, err := castai.NewGkeCluster(ctx, "existing-gke-regional", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("prod-project-789"),
			Location:                pulumi.String("us-central1"), // Region (not a zone like us-central1-a)
			Name:                    pulumi.String("ha-gke-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
			CredentialsJson:         pulumi.String(mockCredentials),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingGkeZonalCluster(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		mockCredentials := `{"type": "service_account", "project_id": "dev-project"}`

		// Zonal cluster (single zone)
		cluster, err := castai.NewGkeCluster(ctx, "existing-gke-zonal", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("dev-project-321"),
			Location:                pulumi.String("us-east1-b"), // Specific zone
			Name:                    pulumi.String("dev-gke-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			CredentialsJson:         pulumi.String(mockCredentials),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingGkeMinimalConfig(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		mockCredentials := `{"type": "service_account", "project_id": "minimal-proj"}`

		// Minimal required configuration
		cluster, err := castai.NewGkeCluster(ctx, "existing-gke-minimal", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("minimal-proj-999"),
			Location:                pulumi.String("asia-southeast1"),
			Name:                    pulumi.String("minimal-gke"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			CredentialsJson:         pulumi.String(mockCredentials),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingGkeCredentialsHandling(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Realistic service account JSON structure
		realisticCredentials := `{
			"type": "service_account",
			"project_id": "my-production-project",
			"private_key_id": "abc123def456",
			"private_key": "-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----\n",
			"client_email": "castai-sa@my-production-project.iam.gserviceaccount.com",
			"client_id": "123456789012345678901",
			"auth_uri": "https://accounts.google.com/o/oauth2/auth",
			"token_uri": "https://oauth2.googleapis.com/token"
		}`

		cluster, err := castai.NewGkeCluster(ctx, "existing-gke-creds", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("my-production-project"),
			Location:                pulumi.String("us-west1"),
			Name:                    pulumi.String("prod-main-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
			CredentialsJson:         pulumi.String(realisticCredentials),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingGkeProductionVsDev(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		mockCreds := `{"type": "service_account", "project_id": "test-proj"}`

		// Production: keep nodes when disconnecting (safety)
		prodCluster, err := castai.NewGkeCluster(ctx, "existing-gke-prod", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("prod-project-001"),
			Location:                pulumi.String("us-central1"),
			Name:                    pulumi.String("prod-critical-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false), // IMPORTANT: Don't delete in production
			CredentialsJson:         pulumi.String(mockCreds),
		})
		assert.NoError(t, err)
		assert.NotNil(t, prodCluster)

		// Dev: can delete nodes when disconnecting
		devCluster, err := castai.NewGkeCluster(ctx, "existing-gke-dev", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("dev-project-001"),
			Location:                pulumi.String("us-east1"),
			Name:                    pulumi.String("dev-test-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true), // Safe for dev environments
			CredentialsJson:         pulumi.String(mockCreds),
		})
		assert.NoError(t, err)
		assert.NotNil(t, devCluster)

		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}

func TestConnectMultipleExistingGkeClusters(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		mockCreds := `{"type": "service_account", "project_id": "global-project"}`
		regions := []string{"us-central1", "europe-west1", "asia-east1"}

		for i, region := range regions {
			cluster, err := castai.NewGkeCluster(ctx, "existing-gke-"+region, &castai.GkeClusterArgs{
				ProjectId:               pulumi.String("global-project-001"),
				Location:                pulumi.String(region),
				Name:                    pulumi.String("cluster-" + region),
				DeleteNodesOnDisconnect: pulumi.Bool(false),
				CredentialsJson:         pulumi.String(mockCreds),
			})
			assert.NoError(t, err)
			assert.NotNil(t, cluster, "Cluster %d should not be nil", i)
		}

		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingGkeAutopilotCluster(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		mockCreds := `{"type": "service_account", "project_id": "autopilot-proj"}`

		// GKE Autopilot clusters are fully managed
		cluster, err := castai.NewGkeCluster(ctx, "existing-gke-autopilot", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("autopilot-proj-555"),
			Location:                pulumi.String("us-central1"),
			Name:                    pulumi.String("autopilot-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false), // Autopilot handles node lifecycle
			CredentialsJson:         pulumi.String(mockCreds),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}
