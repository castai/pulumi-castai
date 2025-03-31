package main

import (
	"github.com/cast-ai/pulumi-castai/sdk/go/castai"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/autoscaling"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/aws"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/iam"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/nodeconfig"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runAwsExample shows how to use CAST AI with AWS EKS
func runAwsExample() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Initialize the provider
		provider, err := castai.NewProvider(ctx, "castai-provider", nil)
		if err != nil {
			return err
		}

		// Create a connection to an EKS cluster
		eksArgs := &aws.EksClusterArgs{}
		eksCluster, err := aws.NewEksCluster(ctx, "eks-cluster", eksArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Create a node configuration
		nodeArgs := &nodeconfig.NodeConfigurationArgs{
			ClusterID: eksCluster.ID(),
		}
		nodeConfig, err := nodeconfig.NewNodeConfiguration(ctx, "node-config", nodeArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Configure autoscaling
		autoscalerArgs := &autoscaling.AutoscalerArgs{
			ClusterID: eksCluster.ID(),
			Enabled:   pulumi.Bool(true),
		}
		_, err = autoscaling.NewAutoscaler(ctx, "autoscaler", autoscalerArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Create AWS IAM policies
		policyArgs := &iam.AwsIamPolicyArgs{}
		awsIamPolicy, err := iam.NewAwsIamPolicy(ctx, "cast-ai-policy", policyArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Create AWS IAM role
		roleArgs := &iam.AwsIamRoleArgs{}
		awsIamRole, err := iam.NewAwsIamRole(ctx, "cast-ai-role", roleArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Export relevant IDs and ARNs
		ctx.Export("clusterId", eksCluster.ID())
		// Use ID field directly
		ctx.Export("nodeConfigId", nodeConfig.ID)
		ctx.Export("policyArn", awsIamPolicy.Arn)
		ctx.Export("roleArn", awsIamRole.Arn)

		return nil
	})
}
