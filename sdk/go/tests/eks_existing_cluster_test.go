package tests

import (
	"testing"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/stretchr/testify/assert"
)

// Mock Tests for Connecting Existing EKS Clusters to CAST AI (Go)
//
// These tests simulate connecting an existing EKS cluster to CAST AI for optimization.
// The cluster already exists - we're just onboarding it to CAST AI.
//
// Run with: go test -v -run TestConnectExisting

func TestConnectExistingEksCluster(t *testing.T) {
	// Test connecting an existing EKS cluster to CAST AI
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Connect existing cluster - in real scenario, cluster already exists in AWS
		cluster, err := castai.NewEksCluster(ctx, "existing-eks-cluster", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-east-1"),
			Name:                    pulumi.String("production-eks-cluster"), // Existing cluster name
			DeleteNodesOnDisconnect: pulumi.Bool(false),                      // Don't delete nodes when disconnecting
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)

		// Verify outputs
		cluster.ID().ApplyT(func(id string) error {
			assert.NotEmpty(t, id, "Cluster ID should not be empty")
			return nil
		})

		cluster.Name.ApplyT(func(name string) error {
			assert.Equal(t, "production-eks-cluster", name)
			return nil
		})

		cluster.ClusterToken.ApplyT(func(token string) error {
			assert.NotEmpty(t, token, "Cluster token should not be empty")
			return nil
		})

		cluster.AccountId.ApplyT(func(accountId string) error {
			assert.Equal(t, "123456789012", accountId)
			return nil
		})

		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingEksWithAssumeRole(t *testing.T) {
	// Test connecting existing EKS cluster using IAM assume role
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Real-world scenario: Using cross-account assume role
		assumeRoleArn := "arn:aws:iam::123456789012:role/CastAI-CrossAccountRole"

		cluster, err := castai.NewEksCluster(ctx, "existing-eks-assume-role", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("staging-eks-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
			AssumeRoleArn:           pulumi.String(assumeRoleArn), // Use IAM role instead of access keys
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)

		// Verify assume role ARN
		cluster.AssumeRoleArn.ApplyT(func(roleArn *string) error {
			assert.NotNil(t, roleArn, "Assume role ARN should not be nil")
			assert.Equal(t, assumeRoleArn, *roleArn)
			return nil
		})

		cluster.Name.ApplyT(func(name string) error {
			assert.Equal(t, "staging-eks-cluster", name)
			return nil
		})

		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingEksMinimalConfig(t *testing.T) {
	// Test connecting existing EKS cluster with minimal configuration
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Minimal config - just the required fields
		cluster, err := castai.NewEksCluster(ctx, "existing-eks-minimal", &castai.EksClusterArgs{
			AccountId:               pulumi.String("111111111111"),
			Region:                  pulumi.String("ap-southeast-1"),
			Name:                    pulumi.String("minimal-eks"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)

		// Verify minimal configuration
		cluster.ID().ApplyT(func(id string) error {
			assert.NotEmpty(t, id, "Cluster ID should not be empty")
			return nil
		})

		cluster.Name.ApplyT(func(name string) error {
			assert.Equal(t, "minimal-eks", name)
			return nil
		})

		cluster.AccountId.ApplyT(func(accountId string) error {
			assert.Equal(t, "111111111111", accountId)
			return nil
		})

		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}
