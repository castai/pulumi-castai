package tests

import (
	"fmt"
	"testing"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi/sdk/v3/go/common/resource"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/stretchr/testify/assert"
)

// CastAIMocks implements pulumi.MockResourceMonitor for CAST AI resources
type CastAIMocks struct {
	pulumi.MockResourceMonitor
}

// NewResource mocks resource creation
func (m *CastAIMocks) NewResource(args pulumi.MockResourceArgs) (string, resource.PropertyMap, error) {
	outputs := args.Inputs.Copy()

	switch args.TypeToken {
	case "castai:aws:EksCluster":
		// Generate mock outputs for EKS cluster
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-cluster-id-%d", args.Name, hashString(args.Name)))
		outputs["clusterToken"] = resource.NewStringProperty(fmt.Sprintf("mock-eks-token-%d", hashString(args.Name)))
		outputs["credentialsId"] = resource.NewStringProperty(fmt.Sprintf("mock-credentials-%d", hashString(args.Name)))

	default:
		// Default mock for other resources
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-id", args.Name))
	}

	return args.Name + "-id", outputs, nil
}

// Call mocks function/data source calls
func (m *CastAIMocks) Call(args pulumi.MockCallArgs) (resource.PropertyMap, error) {
	return resource.PropertyMap{}, nil
}

// Simple hash function for generating consistent mock IDs
func hashString(s string) int {
	hash := 0
	for _, char := range s {
		hash = (hash << 5) - hash + int(char)
	}
	if hash < 0 {
		hash = -hash
	}
	return hash % 1000
}

func TestEksClusterCreation(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		cluster, err := castai.NewEksCluster(ctx, "test-eks-cluster", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("my-eks-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestEksClusterWithAssumeRole(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		assumeRoleArn := "arn:aws:iam::123456789012:role/CastAIRole"

		cluster, err := castai.NewEksCluster(ctx, "test-eks-assume-role", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-east-1"),
			Name:                    pulumi.String("assume-role-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			AssumeRoleArn:           pulumi.String(assumeRoleArn),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestEksClusterWithName(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		clusterName := "my-custom-cluster"

		cluster, err := castai.NewEksCluster(ctx, "test-eks-name", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String(clusterName),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestEksClusterDeleteNodesOnDisconnect(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		clusterDelete, err := castai.NewEksCluster(ctx, "test-eks-delete", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("delete-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
		})
		assert.NoError(t, err)
		assert.NotNil(t, clusterDelete)

		clusterKeep, err := castai.NewEksCluster(ctx, "test-eks-keep", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("keep-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
		})
		assert.NoError(t, err)
		assert.NotNil(t, clusterKeep)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestEksClusterMultipleRegions(t *testing.T) {
	regions := []string{"us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"}

	for _, region := range regions {
		region := region // Capture range variable
		t.Run(region, func(t *testing.T) {
			err := pulumi.RunErr(func(ctx *pulumi.Context) error {
				cluster, err := castai.NewEksCluster(ctx, fmt.Sprintf("test-eks-%s", region), &castai.EksClusterArgs{
					AccountId:               pulumi.String("123456789012"),
					Region:                  pulumi.String(region),
					Name:                    pulumi.String(fmt.Sprintf("cluster-%s", region)),
					DeleteNodesOnDisconnect: pulumi.Bool(true),
				})
				assert.NoError(t, err)
				assert.NotNil(t, cluster)
				return nil
			}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

			assert.NoError(t, err)
		})
	}
}

func TestEksClusterCredentials(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		cluster, err := castai.NewEksCluster(ctx, "test-eks-credentials", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("creds-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}
