package tests

import (
	"fmt"
	"testing"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi/sdk/v3/go/common/resource"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/stretchr/testify/assert"
)

// Mock Tests for CAST AI GKE Cluster Creation (Go)
//
// These tests use Pulumi's built-in mocking to test GKE cluster creation
// without making actual API calls to CAST AI or GCP.
//
// Run with: go test -v -run TestGke

// GcpMocks extends CastAIMocks to add GCP-specific mocking
type GcpMocks struct {
	CastAIMocks
}

// NewResource mocks resource creation for GCP and CAST AI resources
func (m *GcpMocks) NewResource(args pulumi.MockResourceArgs) (string, resource.PropertyMap, error) {
	outputs := args.Inputs.Copy()

	switch args.TypeToken {
	case "castai:gcp:GkeCluster":
		// Generate mock outputs for GKE cluster
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-cluster-id-%d", args.Name, hashString(args.Name)))
		outputs["clusterToken"] = resource.NewStringProperty(fmt.Sprintf("mock-gke-token-%d", hashString(args.Name)))
		outputs["credentialsId"] = resource.NewStringProperty(fmt.Sprintf("mock-credentials-%d", hashString(args.Name)))

	case "gcp:serviceaccount/account:Account":
		project := "project"
		accountId := "castai"
		if proj, ok := outputs["project"]; ok {
			project = proj.StringValue()
		}
		if acc, ok := outputs["accountId"]; ok {
			accountId = acc.StringValue()
		}
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-sa-id", args.Name))
		outputs["email"] = resource.NewStringProperty(fmt.Sprintf("%s@%s.iam.gserviceaccount.com", accountId, project))
		outputs["uniqueId"] = resource.NewStringProperty(fmt.Sprintf("%d", hashString(args.Name)))

	case "gcp:serviceaccount/key:Key":
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-key-id", args.Name))
		outputs["privateKey"] = resource.NewStringProperty("mock-private-key-base64")
		outputs["publicKey"] = resource.NewStringProperty("mock-public-key")

	case "gcp:projects/iAMMember:IAMMember":
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-iam-id", args.Name))
		outputs["etag"] = resource.NewStringProperty(fmt.Sprintf("mock-etag-%d", hashString(args.Name)))

	default:
		// Fall back to base mock implementation
		return m.CastAIMocks.NewResource(args)
	}

	return args.Name + "-id", outputs, nil
}

// Call mocks function/data source calls for GCP
func (m *GcpMocks) Call(args pulumi.MockCallArgs) (resource.PropertyMap, error) {
	outputs := resource.PropertyMap{}

	switch args.Token {
	case "gcp:compute/getZones:getZones":
		outputs["names"] = resource.NewArrayProperty([]resource.PropertyValue{
			resource.NewStringProperty("us-central1-a"),
			resource.NewStringProperty("us-central1-b"),
			resource.NewStringProperty("us-central1-c"),
		})
		return outputs, nil

	default:
		// Fall back to base mock implementation
		return m.CastAIMocks.Call(args)
	}
}

func TestGkeClusterCreation(t *testing.T) {
	// Test creating a GKE cluster with correct configuration
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		cluster, err := castai.NewGkeCluster(ctx, "test-gke-cluster", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("test-project-123"),
			Location:                pulumi.String("us-central1"),
			Name:                    pulumi.String("my-gke-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			CredentialsJson:         pulumi.String("mock-credentials-json"),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)

		// Verify outputs
		cluster.ID().ApplyT(func(id string) error {
			assert.NotEmpty(t, id, "Cluster ID should not be empty")
			assert.Contains(t, id, "cluster-id", "Cluster ID should contain 'cluster-id'")
			return nil
		})

		cluster.Name.ApplyT(func(name string) error {
			assert.Equal(t, "my-gke-cluster", name)
			return nil
		})

		cluster.ClusterToken.ApplyT(func(token string) error {
			assert.NotEmpty(t, token, "Cluster token should not be empty")
			assert.Contains(t, token, "mock-gke-token", "Cluster token should be mocked")
			return nil
		})

		cluster.ProjectId.ApplyT(func(projectId string) error {
			assert.Equal(t, "test-project-123", projectId)
			return nil
		})

		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}

func TestGkeClusterDeleteNodesOnDisconnect(t *testing.T) {
	// Test GKE cluster with different deletion behaviors
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Test with delete_nodes_on_disconnect=true
		clusterDelete, err := castai.NewGkeCluster(ctx, "test-gke-delete", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("test-project"),
			Location:                pulumi.String("us-west1"),
			Name:                    pulumi.String("delete-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			CredentialsJson:         pulumi.String("mock-creds"),
		})
		assert.NoError(t, err)
		assert.NotNil(t, clusterDelete)

		// Test with delete_nodes_on_disconnect=false
		clusterKeep, err := castai.NewGkeCluster(ctx, "test-gke-keep", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("test-project"),
			Location:                pulumi.String("us-west1"),
			Name:                    pulumi.String("keep-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
			CredentialsJson:         pulumi.String("mock-creds"),
		})
		assert.NoError(t, err)
		assert.NotNil(t, clusterKeep)

		// Verify deletion settings
		clusterDelete.DeleteNodesOnDisconnect.ApplyT(func(deleteSetting *bool) error {
			assert.True(t, *deleteSetting, "delete_nodes_on_disconnect should be true")
			return nil
		})

		clusterKeep.DeleteNodesOnDisconnect.ApplyT(func(keepSetting *bool) error {
			assert.False(t, *keepSetting, "delete_nodes_on_disconnect should be false")
			return nil
		})

		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}

func TestGkeClusterMultipleLocations(t *testing.T) {
	// Test GKE cluster creation in different locations
	locations := []string{"us-central1", "us-east1", "europe-west1", "asia-southeast1"}

	for _, location := range locations {
		location := location // Capture range variable
		t.Run(location, func(t *testing.T) {
			err := pulumi.RunErr(func(ctx *pulumi.Context) error {
				cluster, err := castai.NewGkeCluster(ctx, fmt.Sprintf("test-gke-%s", location), &castai.GkeClusterArgs{
					ProjectId:               pulumi.String("test-project"),
					Location:                pulumi.String(location),
					Name:                    pulumi.String(fmt.Sprintf("cluster-%s", location)),
					DeleteNodesOnDisconnect: pulumi.Bool(true),
					CredentialsJson:         pulumi.String("mock-creds"),
				})
				assert.NoError(t, err)
				assert.NotNil(t, cluster)

				// Verify location
				cluster.Location.ApplyT(func(loc string) error {
					assert.Equal(t, location, loc)
					return nil
				})

				return nil
			}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

			assert.NoError(t, err)
		})
	}
}

func TestGkeClusterCredentials(t *testing.T) {
	// Test that GKE cluster properly handles credentials
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		testCredentials := `{"type": "service_account", "project_id": "test"}`

		cluster, err := castai.NewGkeCluster(ctx, "test-gke-credentials", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("test-project"),
			Location:                pulumi.String("us-central1"),
			Name:                    pulumi.String("creds-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			CredentialsJson:         pulumi.String(testCredentials),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)

		// Verify credentials
		cluster.CredentialsJson.ApplyT(func(credsJson *string) error {
			assert.Equal(t, testCredentials, *credsJson, "Credentials JSON should match input")
			return nil
		})

		cluster.CredentialsId.ApplyT(func(credsId string) error {
			assert.NotEmpty(t, credsId, "Credentials ID should be returned")
			assert.Contains(t, credsId, "mock-credentials", "Credentials ID should be mocked")
			return nil
		})

		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}

func TestGkeClusterValidation(t *testing.T) {
	// Test that required fields are accepted
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		cluster, err := castai.NewGkeCluster(ctx, "test-validation", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String("test-project"),
			Location:                pulumi.String("us-central1"),
			Name:                    pulumi.String("validation-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			CredentialsJson:         pulumi.String("mock-creds"),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &GcpMocks{}))

	assert.NoError(t, err)
}
