package main

import (
	"os"

	"github.com/castai/pulumi-castai"
	"github.com/castai/pulumi-castai/aws"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runAwsExample shows how to connect an AWS EKS cluster to CAST AI
func runAwsExample() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Initialize the provider (API token will be read from environment variable CASTAI_API_TOKEN)
		provider, err := castai.NewProvider(ctx, "castai-provider", nil)
		if err != nil {
			return err
		}

		// Get AWS account ID from environment variable or use a default value
		accountID := os.Getenv("AWS_ACCOUNT_ID")
		if accountID == "" {
			accountID = "123456789012"
		}

		// Get AWS region from environment variable or use a default value
		region := os.Getenv("AWS_REGION")
		if region == "" {
			region = "us-west-2"
		}

		// Get EKS cluster name from environment variable or use a default value
		clusterName := os.Getenv("EKS_CLUSTER_NAME")
		if clusterName == "" {
			clusterName = "cast_ai_test_cluster"
		}

		// Create a connection to an EKS cluster
		eksArgs := &aws.EksClusterArgs{
			AccountId:              pulumi.String(accountID),
			Region:                 pulumi.String(region),
			EksClusterName:         pulumi.String(clusterName),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			// The following values need to be replaced with actual values from your AWS account
			// For demo purposes, we're using placeholder values
			SecurityGroupId:        pulumi.String("sg-12345678"),
			SubnetIds:              pulumi.StringArray{pulumi.String("subnet-12345678"), pulumi.String("subnet-87654321")},
		}

		eksCluster, err := aws.NewEksCluster(ctx, "eks-cluster-connection", eksArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Export the cluster ID
		ctx.Export("clusterId", eksCluster.ID())

		return nil
	})
}
