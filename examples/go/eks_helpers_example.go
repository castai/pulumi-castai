package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai" // Assuming main package
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws"    // To get caller identity
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runEksHelpersExample demonstrates EKS helper resources.
// Renamed from main to avoid conflicts.
func runEksHelpersExample(ctx *pulumi.Context) error {
	// Placeholder values
	clusterRegion := "us-west-2"
	clusterName := "my-production-eks"

	// Get current AWS Account ID
	callerIdentity, err := aws.GetCallerIdentity(ctx, nil)
	if err != nil {
		return err
	}
	accountId := callerIdentity.AccountId

	// Get the CAST AI Cluster ID for the EKS cluster
	castaiClusterId, err := castai.NewEksClusterid(ctx, "example-go-eks-clusterid", &castai.EksClusteridArgs{
		AccountId:   pulumi.String(accountId),
		Region:      pulumi.String(clusterRegion),
		ClusterName: pulumi.String(clusterName),
	})
	if err != nil {
		return err
	}

	// Get the required User ARN using the CAST AI Cluster ID
	castaiUserArn, err := castai.NewEksUserArn(ctx, "example-go-eks-userarn", &castai.EksUserArnArgs{
		ClusterId: castaiClusterId.ID(), // Use the output from the previous resource
	})
	if err != nil {
		return err
	}

	// Export the Cluster ID and User ARN
	ctx.Export("eks_castai_go_cluster_id", castaiClusterId.ID())
	ctx.Export("eks_castai_go_user_arn", castaiUserArn.Arn) // Assuming the output property is 'Arn'

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runEksHelpersExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
