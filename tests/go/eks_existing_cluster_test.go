package tests

import (
	"testing"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/stretchr/testify/assert"
)

// Tests for connecting existing EKS clusters to CAST AI

func TestConnectExistingEksCluster(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Connect existing cluster - in real scenario, cluster already exists in AWS
		cluster, err := castai.NewEksCluster(ctx, "existing-eks-cluster", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-east-1"),
			Name:                    pulumi.String("production-eks-cluster"), // Existing cluster name
			DeleteNodesOnDisconnect: pulumi.Bool(false),                     // Don't delete nodes when disconnecting
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-existing123"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-existing-a"),
				pulumi.String("subnet-existing-b"),
			},
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingEksWithAssumeRole(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Real-world scenario: Using cross-account assume role
		assumeRoleArn := "arn:aws:iam::123456789012:role/CastAI-CrossAccountRole"

		cluster, err := castai.NewEksCluster(ctx, "existing-eks-assume-role", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("staging-eks-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-existing456"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-existing-1"),
				pulumi.String("subnet-existing-2"),
			},
			AssumeRoleArn: pulumi.String(assumeRoleArn), // Use IAM role instead of access keys
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingEksWithSSHKey(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		sshPublicKey := "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ... existing-key"

		cluster, err := castai.NewEksCluster(ctx, "existing-eks-ssh", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("eu-west-1"),
			Name:                    pulumi.String("dev-eks-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-dev-123"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-dev-a"),
				pulumi.String("subnet-dev-b"),
				pulumi.String("subnet-dev-c"),
			},
			SshPublicKey: pulumi.String(sshPublicKey),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingEksWithTags(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		clusterTags := pulumi.StringMap{
			"Environment": pulumi.String("production"),
			"ManagedBy":   pulumi.String("castai"),
			"Team":        pulumi.String("platform"),
			"CostCenter":  pulumi.String("engineering"),
		}

		cluster, err := castai.NewEksCluster(ctx, "existing-eks-tags", &castai.EksClusterArgs{
			AccountId:               pulumi.String("987654321098"),
			Region:                  pulumi.String("us-east-2"),
			Name:                    pulumi.String("prod-eks-main"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-prod-main"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-prod-1a"),
				pulumi.String("subnet-prod-1b"),
			},
			Tags: clusterTags,
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingEksMinimalConfig(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Minimal config - just the required fields
		cluster, err := castai.NewEksCluster(ctx, "existing-eks-minimal", &castai.EksClusterArgs{
			AccountId:               pulumi.String("111111111111"),
			Region:                  pulumi.String("ap-southeast-1"),
			Name:                    pulumi.String("minimal-eks"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-minimal"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-min-a"),
			},
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingEksCustomDNS(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Some clusters use custom DNS cluster IP
		customDnsIp := "172.20.0.10"

		cluster, err := castai.NewEksCluster(ctx, "existing-eks-dns", &castai.EksClusterArgs{
			AccountId:               pulumi.String("222222222222"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("custom-dns-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-dns-123"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-dns-1"),
				pulumi.String("subnet-dns-2"),
			},
			DnsClusterIp: pulumi.String(customDnsIp),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestConnectExistingEksProductionVsDev(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Production: keep nodes when disconnecting (safety)
		prodCluster, err := castai.NewEksCluster(ctx, "existing-eks-prod", &castai.EksClusterArgs{
			AccountId:               pulumi.String("333333333333"),
			Region:                  pulumi.String("us-east-1"),
			Name:                    pulumi.String("prod-critical-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false), // IMPORTANT: Don't delete in production
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-prod"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-prod-a"),
				pulumi.String("subnet-prod-b"),
			},
		})
		assert.NoError(t, err)
		assert.NotNil(t, prodCluster)

		// Dev: can delete nodes when disconnecting
		devCluster, err := castai.NewEksCluster(ctx, "existing-eks-dev", &castai.EksClusterArgs{
			AccountId:               pulumi.String("333333333333"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("dev-test-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true), // Safe for dev environments
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-dev"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-dev-a"),
			},
		})
		assert.NoError(t, err)
		assert.NotNil(t, devCluster)

		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestConnectMultipleExistingEksClusters(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		regions := []string{"us-east-1", "us-west-2", "eu-west-1"}

		for i, region := range regions {
			cluster, err := castai.NewEksCluster(ctx, "existing-eks-"+region, &castai.EksClusterArgs{
				AccountId:               pulumi.String("444444444444"),
				Region:                  pulumi.String(region),
				Name:                    pulumi.String("cluster-" + region),
				DeleteNodesOnDisconnect: pulumi.Bool(false),
				OverrideSecurityGroups: pulumi.StringArray{
					pulumi.String("sg-multi"),
				},
				Subnets: pulumi.StringArray{
					pulumi.String("subnet-multi"),
				},
			})
			assert.NoError(t, err)
			assert.NotNil(t, cluster, "Cluster %d should not be nil", i)
		}

		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}
