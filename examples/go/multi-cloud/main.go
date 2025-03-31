package main

import (
	"github.com/cast-ai/pulumi-castai/sdk/autoscaling"
	"github.com/cast-ai/pulumi-castai/sdk/aws"
	"github.com/cast-ai/pulumi-castai/sdk/clusters"
	"github.com/cast-ai/pulumi-castai/sdk/gcp"
	"github.com/cast-ai/pulumi-castai/sdk/iam"
	"github.com/cast-ai/pulumi-castai/sdk/nodeconfig"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Create EKS cluster connection
		eksClusterConn, err := aws.NewEksClusterConnection(ctx, "eks-cluster", &aws.EksClusterConnectionArgs{
			Region:         pulumi.String("us-east-1"),
			AccountId:      pulumi.String("123456789012"),
			EksClusterName: pulumi.String("my-eks-cluster"),
		})
		if err != nil {
			return err
		}

		// Create GKE cluster connection
		gkeClusterConn, err := gcp.NewGkeClusterConnection(ctx, "gke-cluster", &gcp.GkeClusterConnectionArgs{
			ProjectId:      pulumi.String("my-gcp-project"),
			Location:       pulumi.String("us-central1"),
			GkeClusterName: pulumi.String("my-gke-cluster"),
		})
		if err != nil {
			return err
		}

		// Set up cluster connections
		eksConn, err := clusters.NewClusterConnection(ctx, "eks-conn", &clusters.ClusterConnectionArgs{
			ClusterID: eksClusterConn.ID(),
			Type:      pulumi.String("eks"),
		})
		if err != nil {
			return err
		}

		gkeConn, err := clusters.NewClusterConnection(ctx, "gke-conn", &clusters.ClusterConnectionArgs{
			ClusterID: gkeClusterConn.ID(),
			Type:      pulumi.String("gke"),
		})
		if err != nil {
			return err
		}

		// Create node configurations
		eksNodeConfig, err := nodeconfig.NewNodeConfiguration(ctx, "eks-node-config", &nodeconfig.NodeConfigurationArgs{
			ClusterID: eksClusterConn.ID(),
			Constraints: &nodeconfig.NodeConfigurationConstraintsArgs{
				SpotInstances: &nodeconfig.SpotInstancesConstraintArgs{
					Enabled: pulumi.Bool(true),
				},
				OnDemandInstances: &nodeconfig.OnDemandInstancesConstraintArgs{
					Enabled: pulumi.Bool(true),
				},
			},
			Tags: pulumi.StringMap{
				"env": pulumi.String("production"),
			},
		})
		if err != nil {
			return err
		}

		gkeNodeConfig, err := nodeconfig.NewNodeConfiguration(ctx, "gke-node-config", &nodeconfig.NodeConfigurationArgs{
			ClusterID: gkeClusterConn.ID(),
			Constraints: &nodeconfig.NodeConfigurationConstraintsArgs{
				SpotInstances: &nodeconfig.SpotInstancesConstraintArgs{
					Enabled: pulumi.Bool(true),
				},
				OnDemandInstances: &nodeconfig.OnDemandInstancesConstraintArgs{
					Enabled: pulumi.Bool(true),
				},
			},
			Tags: pulumi.StringMap{
				"env": pulumi.String("production"),
			},
		})
		if err != nil {
			return err
		}

		// Configure autoscaling for both clusters
		eksAutoscaler, err := autoscaling.NewAutoscaler(ctx, "eks-autoscaler", &autoscaling.AutoscalerArgs{
			ClusterID: eksClusterConn.ID(),
			UnschedulablePods: &autoscaling.AutoscalerUnschedulablePodsArgs{
				Enabled: pulumi.Bool(true),
			},
			NodeDownscaler: &autoscaling.AutoscalerNodeDownscalerArgs{
				Enabled: pulumi.Bool(true),
				Params: &autoscaling.AutoscalerNodeDownscalerParamsArgs{
					EmptyNodes: &autoscaling.AutoscalerNodeDownscalerEmptyNodesArgs{
						Enabled: pulumi.Bool(true),
					},
				},
			},
			ClusterLimits: &autoscaling.AutoscalerClusterLimitsArgs{
				Cpu: &autoscaling.AutoscalerClusterLimitsCpuArgs{
					MaxCores:     pulumi.Int(100),
					MinCores:     pulumi.Int(10),
					MaxCorePct:   pulumi.Float64(80.0),
					MinCorePct:   pulumi.Float64(20.0),
					CoresPerVcpu: pulumi.Float64(1.0),
				},
				Memory: &autoscaling.AutoscalerClusterLimitsMemoryArgs{
					MaxGb:    pulumi.Int(400),
					MinGb:    pulumi.Int(40),
					MaxGbPct: pulumi.Float64(80.0),
					MinGbPct: pulumi.Float64(20.0),
				},
			},
		})
		if err != nil {
			return err
		}

		gkeAutoscaler, err := autoscaling.NewAutoscaler(ctx, "gke-autoscaler", &autoscaling.AutoscalerArgs{
			ClusterID: gkeClusterConn.ID(),
			UnschedulablePods: &autoscaling.AutoscalerUnschedulablePodsArgs{
				Enabled: pulumi.Bool(true),
			},
			NodeDownscaler: &autoscaling.AutoscalerNodeDownscalerArgs{
				Enabled: pulumi.Bool(true),
				Params: &autoscaling.AutoscalerNodeDownscalerParamsArgs{
					EmptyNodes: &autoscaling.AutoscalerNodeDownscalerEmptyNodesArgs{
						Enabled: pulumi.Bool(true),
					},
				},
			},
			ClusterLimits: &autoscaling.AutoscalerClusterLimitsArgs{
				Cpu: &autoscaling.AutoscalerClusterLimitsCpuArgs{
					MaxCores:     pulumi.Int(100),
					MinCores:     pulumi.Int(10),
					MaxCorePct:   pulumi.Float64(80.0),
					MinCorePct:   pulumi.Float64(20.0),
					CoresPerVcpu: pulumi.Float64(1.0),
				},
				Memory: &autoscaling.AutoscalerClusterLimitsMemoryArgs{
					MaxGb:    pulumi.Int(400),
					MinGb:    pulumi.Int(40),
					MaxGbPct: pulumi.Float64(80.0),
					MinGbPct: pulumi.Float64(20.0),
				},
			},
		})
		if err != nil {
			return err
		}

		// Configure IAM for AWS
		awsPolicy, err := iam.NewAwsIamPolicy(ctx, "eks-policy", &iam.AwsIamPolicyArgs{
			AccountID:      pulumi.String("123456789012"),
			EksClusterName: pulumi.String("my-eks-cluster"),
			Name:           pulumi.String("castai-eks-policy"),
		})
		if err != nil {
			return err
		}

		awsRole, err := iam.NewAwsIamRole(ctx, "eks-role", &iam.AwsIamRoleArgs{
			AccountID:  pulumi.String("123456789012"),
			Name:       pulumi.String("castai-eks-role"),
			ExternalID: pulumi.String("castai-eks"),
			PolicyARNs: pulumi.StringArray{
				awsPolicy.Arn,
			},
		})
		if err != nil {
			return err
		}

		// Configure IAM for GCP
		gcpServiceAccount, err := iam.NewGcpServiceAccount(ctx, "gke-sa", &iam.GcpServiceAccountArgs{
			ProjectID: pulumi.String("my-gcp-project"),
			Name:      pulumi.String("castai-gke-sa"),
		})
		if err != nil {
			return err
		}

		// Export the cluster IDs
		ctx.Export("eksClusterId", eksClusterConn.ID())
		ctx.Export("gkeClusterId", gkeClusterConn.ID())

		// Export the node configurations
		ctx.Export("eksNodeConfigId", eksNodeConfig.ID())
		ctx.Export("gkeNodeConfigId", gkeNodeConfig.ID())

		// Export the autoscaler IDs
		ctx.Export("eksAutoscalerId", eksAutoscaler.ID())
		ctx.Export("gkeAutoscalerId", gkeAutoscaler.ID())

		return nil
	})
}
