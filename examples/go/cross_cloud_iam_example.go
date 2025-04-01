package main

import (
	"encoding/json"
	"fmt"

	"github.com/castai/pulumi-castai/sdk/go/castai/iam" // Assuming iam module
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi/config"
)

// runCrossCloudIamExample demonstrates creating IAM resources across clouds.
// Renamed from main to avoid conflicts.
func runCrossCloudIamExample(ctx *pulumi.Context) error {
	// --- AWS IAM Configuration ---
	awsAccountId := "123456789012"
	// Placeholder for a cluster ID
	awsClusterIdOutput := pulumi.String("dummy-eks-cluster-id") // Replace with actual cluster.ID()

	awsPolicyDocJSON, _ := json.Marshal(map[string]interface{}{
		"Version": "2012-10-17",
		"Statement": []map[string]interface{}{{
			"Effect": "Allow",
			"Action": []string{
				"ec2:DescribeInstances", "ec2:RunInstances", "ec2:TerminateInstances",
				"ec2:CreateTags", "iam:PassRole", "eks:DescribeCluster",
			},
			"Resource": "*",
		}},
	})

	awsAssumeRolePolicyDocJSON := awsClusterIdOutput.ApplyT(func(clusterId string) (string, error) {
		doc, err := json.Marshal(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{{
				"Effect":    "Allow",
				"Principal": map[string]string{"Service": "castai.amazonaws.com"},
				"Action":    "sts:AssumeRole",
				"Condition": map[string]map[string]string{
					"StringEquals": {"sts:ExternalId": clusterId}, // Use cluster ID here
				},
			}},
		})
		if err != nil {
			return "", err
		}
		return string(doc), nil
	}).(pulumi.StringOutput)

	awsIamPolicy, err := iam.NewAwsIamPolicy(ctx, "aws-go-iam-policy", &iam.AwsIamPolicyArgs{
		AccountId:      pulumi.String(awsAccountId),
		PolicyDocument: pulumi.String(string(awsPolicyDocJSON)),
	})
	if err != nil {
		return err
	}

	awsIamRole, err := iam.NewAwsIamRole(ctx, "aws-go-iam-role", &iam.AwsIamRoleArgs{
		AccountId:                pulumi.String(awsAccountId),
		AssumeRolePolicyDocument: awsAssumeRolePolicyDocJSON,
		AttachedPolicies:         pulumi.StringArray{awsIamPolicy.Arn},
	})
	if err != nil {
		return err
	}

	awsIamUser, err := iam.NewAwsIamUser(ctx, "aws-go-iam-user", &iam.AwsIamUserArgs{
		AccountId:  pulumi.String(awsAccountId),
		Username:   pulumi.String("castai-go-automation"),
		PolicyArns: pulumi.StringArray{awsIamPolicy.Arn}, // Attach the same policy
	})
	if err != nil {
		return err
	}

	// --- GCP IAM Configuration ---
	gcpProjectId := "my-gcp-project"
	gcpSaId := "castai-go-sa"
	gcpRoleId := "castaiGoClusterManager"

	gcpServiceAccount, err := iam.NewGcpServiceAccount(ctx, "gcp-go-service-account", &iam.GcpServiceAccountArgs{
		ProjectId:          pulumi.String(gcpProjectId),
		ServiceAccountId:   pulumi.String(gcpSaId),
		ServiceAccountName: pulumi.String("CAST AI Go Service Account"),
		Description:        pulumi.String("Service account for CAST AI Go example"),
	})
	if err != nil {
		return err
	}

	gcpIamRole, err := iam.NewGcpIamRole(ctx, "gcp-go-iam-role", &iam.GcpIamRoleArgs{
		ProjectId:   pulumi.String(gcpProjectId),
		RoleName:    pulumi.String(gcpRoleId),
		Title:       pulumi.String("CAST AI Go Cluster Manager"),
		Description: pulumi.String("Role for CAST AI Go example"),
		Permissions: pulumi.StringArray{
			pulumi.String("container.clusters.get"), pulumi.String("container.clusters.list"), pulumi.String("container.clusters.update"),
			pulumi.String("container.operations.get"), pulumi.String("container.operations.list"), pulumi.String("compute.instances.create"),
			pulumi.String("compute.instances.delete"), pulumi.String("compute.instances.get"), pulumi.String("compute.instances.list"),
			pulumi.String("compute.instances.setMetadata"), pulumi.String("compute.instances.setTags"),
		},
	})
	if err != nil {
		return err
	}

	// Construct policy binding JSON using Outputs
	gcpPolicyDocJSON := pulumi.All(gcpIamRole.RoleName, gcpServiceAccount.ServiceAccountId).ApplyT(
		func(args []interface{}) (string, error) {
			roleName := args[0].(string)
			saId := args[1].(string)
			doc, err := json.Marshal(map[string]interface{}{
				"bindings": []map[string]interface{}{{
					"role":    fmt.Sprintf("projects/%s/roles/%s", gcpProjectId, roleName),
					"members": []string{fmt.Sprintf("serviceAccount:%s@%s.iam.gserviceaccount.com", saId, gcpProjectId)},
				}},
			})
			if err != nil {
				return "", err
			}
			return string(doc), nil
		}).(pulumi.StringOutput)

	gcpIamPolicy, err := iam.NewGcpIamPolicy(ctx, "gcp-go-iam-policy", &iam.GcpIamPolicyArgs{
		ProjectId:  pulumi.String(gcpProjectId),
		PolicyJson: gcpPolicyDocJSON,
	})
	if err != nil {
		return err
	}

	// --- Azure IAM Configuration ---
	azureSubscriptionId := "00000000-0000-0000-0000-000000000000"
	azureTenantId := "00000000-0000-0000-0000-000000000000"
	azureRoleName := "CastAIGoClusterManager"
	azureClientId := "00000000-0000-0000-0000-000000000001" // Example Client ID

	cfg := config.New(ctx, "")
	azureClientSecret := cfg.RequireSecret("azureClientSecret") // Get secret from config

	azureRoleDefJSON, _ := json.Marshal(map[string]interface{}{
		"name":             azureRoleName,
		"description":      "Role for CAST AI Go example (Azure)",
		"assignableScopes": []string{fmt.Sprintf("/subscriptions/%s", azureSubscriptionId)},
		"permissions": []map[string]interface{}{{
			"actions": []string{
				"Microsoft.ContainerService/managedClusters/read", "Microsoft.ContainerService/managedClusters/write",
				"Microsoft.ContainerService/managedClusters/agentPools/read", "Microsoft.ContainerService/managedClusters/agentPools/write",
				"Microsoft.Compute/virtualMachines/read", "Microsoft.Compute/virtualMachines/write", "Microsoft.Compute/virtualMachines/delete",
				"Microsoft.Compute/disks/read", "Microsoft.Compute/disks/write", "Microsoft.Compute/disks/delete",
				"Microsoft.Network/networkInterfaces/read", "Microsoft.Network/networkInterfaces/write", "Microsoft.Network/networkInterfaces/delete",
			},
			"notActions": []string{},
		}},
	})

	azureIamRole, err := iam.NewAzureIamRole(ctx, "azure-go-iam-role", &iam.AzureIamRoleArgs{
		SubscriptionId: pulumi.String(azureSubscriptionId),
		RoleName:       pulumi.String(azureRoleName),
		RoleDefinition: pulumi.String(string(azureRoleDefJSON)),
	})
	if err != nil {
		return err
	}

	azureServicePrincipal, err := iam.NewAzureServicePrincipal(ctx, "azure-go-service-principal", &iam.AzureServicePrincipalArgs{
		TenantId:         pulumi.String(azureTenantId),
		ClientId:         pulumi.String(azureClientId),
		ClientSecret:     azureClientSecret, // Pass secret Output
		SubscriptionId:   pulumi.String(azureSubscriptionId),
		RoleDefinitionId: azureIamRole.ID(), // Reference the created role
	})
	if err != nil {
		return err
	}

	// Exports
	ctx.Export("aws_go_role_arn", awsIamRole.Arn)
	ctx.Export("aws_go_username", awsIamUser.Username)
	ctx.Export("gcp_go_sa_email", gcpServiceAccount.Email)
	ctx.Export("gcp_go_role_name", gcpIamRole.RoleName)
	ctx.Export("azure_go_role_name", azureIamRole.RoleName)
	ctx.Export("azure_go_client_id", azureServicePrincipal.ClientId)

	// Reference GcpIamPolicy explicitly if not exporting anything from it
	ctx.Export("gcpIamPolicyIdRef", gcpIamPolicy.ID())

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runCrossCloudIamExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
