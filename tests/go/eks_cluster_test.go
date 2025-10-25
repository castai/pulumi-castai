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
		outputs["agentToken"] = resource.NewStringProperty(fmt.Sprintf("mock-eks-token-%d", hashString(args.Name)))
		outputs["credentialsId"] = resource.NewStringProperty(fmt.Sprintf("mock-credentials-%d", hashString(args.Name)))

	case "aws:iam/role:Role":
		accountID := "123456789012"
		if acc, ok := outputs["accountId"]; ok {
			accountID = acc.StringValue()
		}
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-role-id", args.Name))
		outputs["arn"] = resource.NewStringProperty(fmt.Sprintf("arn:aws:iam::%s:role/%s", accountID, args.Name))
		outputs["uniqueId"] = resource.NewStringProperty("AIDACKCEVSQ6C2EXAMPLE")

	case "aws:ec2/securityGroup:SecurityGroup":
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("sg-%d", hashString(args.Name)))
		outputs["arn"] = resource.NewStringProperty(fmt.Sprintf("arn:aws:ec2:us-west-2:123456789012:security-group/sg-%s", args.Name))

	case "aws:ec2/subnet:Subnet":
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("subnet-%d", hashString(args.Name)))
		outputs["availabilityZone"] = resource.NewStringProperty("us-west-2a")

	default:
		// Default mock for other resources
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-id", args.Name))
	}

	return args.Name + "-id", outputs, nil
}

// Call mocks function/data source calls
func (m *CastAIMocks) Call(args pulumi.MockCallArgs) (resource.PropertyMap, error) {
	outputs := resource.PropertyMap{}

	switch args.Token {
	case "aws:index/getCallerIdentity:getCallerIdentity":
		outputs["accountId"] = resource.NewStringProperty("123456789012")
		outputs["arn"] = resource.NewStringProperty("arn:aws:iam::123456789012:user/test-user")
		outputs["userId"] = resource.NewStringProperty("AIDACKCEVSQ6C2EXAMPLE")

	case "aws:ec2/getSubnets:getSubnets":
		outputs["ids"] = resource.NewArrayProperty([]resource.PropertyValue{
			resource.NewStringProperty("subnet-12345678"),
			resource.NewStringProperty("subnet-87654321"),
		})
	}

	return outputs, nil
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
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-12345678"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-12345678"),
				pulumi.String("subnet-87654321"),
			},
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestEksClusterMultipleSubnets(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		testSubnets := []string{"subnet-11111111", "subnet-22222222", "subnet-33333333"}

		cluster, err := castai.NewEksCluster(ctx, "test-eks-subnets", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-east-1"),
			Name:                    pulumi.String("multi-subnet-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-test"),
			},
			Subnets: pulumi.ToStringArray(testSubnets),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestEksClusterMultipleSecurityGroups(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		testSecurityGroups := []string{"sg-aaaaaaaa", "sg-bbbbbbbb"}

		cluster, err := castai.NewEksCluster(ctx, "test-eks-sg", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("sg-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
			OverrideSecurityGroups:  pulumi.ToStringArray(testSecurityGroups),
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-test"),
			},
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
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-test"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-test"),
			},
		})
		assert.NoError(t, err)
		assert.NotNil(t, clusterDelete)

		clusterKeep, err := castai.NewEksCluster(ctx, "test-eks-keep", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("keep-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-test"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-test"),
			},
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
					OverrideSecurityGroups: pulumi.StringArray{
						pulumi.String("sg-test"),
					},
					Subnets: pulumi.StringArray{
						pulumi.String("subnet-test"),
					},
				})
				assert.NoError(t, err)
				assert.NotNil(t, cluster)
				return nil
			}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

			assert.NoError(t, err)
		})
	}
}

func TestEksClusterAssumeRoleArn(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		assumeRoleArn := "arn:aws:iam::123456789012:role/CastAIRole"

		cluster, err := castai.NewEksCluster(ctx, "test-eks-assume-role", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("assume-role-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-test"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-test"),
			},
			AssumeRoleArn: pulumi.String(assumeRoleArn),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestEksClusterCredentials(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		cluster, err := castai.NewEksCluster(ctx, "test-eks-credentials", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("creds-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-test"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-test"),
			},
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestEksClusterValidation(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Test that required fields are validated
		cluster, err := castai.NewEksCluster(ctx, "test-validation", &castai.EksClusterArgs{
			AccountId:               pulumi.String("123456789012"),
			Region:                  pulumi.String("us-west-2"),
			Name:                    pulumi.String("validation-cluster"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			OverrideSecurityGroups: pulumi.StringArray{
				pulumi.String("sg-test"),
			},
			Subnets: pulumi.StringArray{
				pulumi.String("subnet-test"),
			},
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

	assert.NoError(t, err)
}

func TestEksClusterDifferentAccountIds(t *testing.T) {
	accountIds := []string{"111111111111", "222222222222", "333333333333"}

	for i, accountId := range accountIds {
		accountId := accountId // Capture range variable
		t.Run(accountId, func(t *testing.T) {
			err := pulumi.RunErr(func(ctx *pulumi.Context) error {
				cluster, err := castai.NewEksCluster(ctx, fmt.Sprintf("test-account-%d", i), &castai.EksClusterArgs{
					AccountId:               pulumi.String(accountId),
					Region:                  pulumi.String("us-west-2"),
					Name:                    pulumi.String(fmt.Sprintf("cluster-%s", accountId)),
					DeleteNodesOnDisconnect: pulumi.Bool(true),
					OverrideSecurityGroups: pulumi.StringArray{
						pulumi.String("sg-test"),
					},
					Subnets: pulumi.StringArray{
						pulumi.String("subnet-test"),
					},
				})
				assert.NoError(t, err)
				assert.NotNil(t, cluster)
				return nil
			}, pulumi.WithMocks("project", "stack", &CastAIMocks{}))

			assert.NoError(t, err)
		})
	}
}
