package main

import (
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/aws"
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/eks"
	"github.com/pulumi/pulumi-aws/sdk/v5/go/aws/iam"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Get the EKS cluster role
		role, err := iam.GetRole(ctx, "eks-cluster-role", nil)
		if err != nil {
			return err
		}

		// Create an EKS cluster
		eksCluster, err := eks.NewCluster(ctx, "my-cluster", &eks.ClusterArgs{
			RoleArn: pulumi.String(role.Arn),
			VpcConfig: &eks.ClusterVpcConfigArgs{
				SubnetIds: pulumi.ToStringArray([]string{"subnet-12345", "subnet-67890"}),
			},
		})
		if err != nil {
			return err
		}

		// Connect the EKS cluster to CAST AI
		castaiCluster, err := aws.NewEksCluster(ctx, "castai-eks-cluster", &aws.EksClusterArgs{
			AccountId:               pulumi.String("12345678901"),
			Region:                  pulumi.String("us-west-2"),
			EksClusterName:          eksCluster.Name,
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			Tags: pulumi.StringMap{
				"environment": pulumi.String("dev"),
				"managed-by":  pulumi.String("pulumi"),
			},
		})
		if err != nil {
			return err
		}

		// Export the CAST AI cluster ID
		ctx.Export("castaiClusterId", castaiCluster.ID())
		return nil
	})
}
