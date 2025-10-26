package main

import (
	"os"

	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/eks"
	castai "github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi-kubernetes/sdk/v4/go/kubernetes"
	helm "github.com/pulumi/pulumi-kubernetes/sdk/v4/go/kubernetes/helm/v3"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi/config"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Get configuration from environment or Pulumi config
		cfg := config.New(ctx, "")
		awsCfg := config.New(ctx, "aws")

		castaiApiToken := getEnvOrConfig(cfg, "CASTAI_API_TOKEN", "castaiApiToken", true)
		clusterName := getEnvOrConfig(cfg, "EKS_CLUSTER_NAME", "clusterName", true)
		awsRegion := getEnvOrConfig(awsCfg, "AWS_REGION", "region", true)
		awsAccountId := getEnvOrConfig(cfg, "AWS_ACCOUNT_ID", "awsAccountId", false)

		// Get AWS account ID if not provided
		var callerIdentity pulumi.StringInput
		if awsAccountId != "" {
			callerIdentity = pulumi.String(awsAccountId)
		} else {
			identity, err := aws.GetCallerIdentity(ctx, nil, nil)
			if err != nil {
				return err
			}
			callerIdentity = pulumi.String(identity.AccountId)
		}

		// Get EKS cluster information
		cluster, err := eks.LookupCluster(ctx, &eks.LookupClusterArgs{
			Name: clusterName,
		})
		if err != nil {
			return err
		}

		// Configure CAST AI provider
		castaiProvider, err := castai.NewProvider(ctx, "castai", &castai.ProviderArgs{
			ApiToken: pulumi.String(castaiApiToken),
			ApiUrl:   pulumi.String(getEnvOrDefault("CASTAI_API_URL", "https://api.cast.ai")),
		})
		if err != nil {
			return err
		}

		// Register EKS cluster with CAST AI (read-only mode)
		castaiCluster, err := castai.NewEksCluster(ctx, "castai-eks-cluster", &castai.EksClusterArgs{
			AccountId: callerIdentity,
			Region:    pulumi.String(awsRegion),
			Name:      pulumi.String(clusterName),
		}, pulumi.Provider(castaiProvider))
		if err != nil {
			return err
		}

		// Build kubeconfig for EKS cluster
		kubeconfig := pulumi.Sprintf(`apiVersion: v1
kind: Config
clusters:
- cluster:
    server: %s
    certificate-authority-data: %s
  name: %s
contexts:
- context:
    cluster: %s
    user: %s
  name: %s
current-context: %s
users:
- name: %s
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: aws
      args:
        - eks
        - get-token
        - --cluster-name
        - %s
        - --region
        - %s
`,
			cluster.Endpoint,
			cluster.CertificateAuthorities[0].Data,
			clusterName,
			clusterName,
			clusterName,
			clusterName,
			clusterName,
			clusterName,
			clusterName,
			awsRegion,
		)

		// Configure Kubernetes provider to access the EKS cluster
		k8sProvider, err := kubernetes.NewProvider(ctx, "eks-k8s", &kubernetes.ProviderArgs{
			Kubeconfig: kubeconfig,
		})
		if err != nil {
			return err
		}

		// Install CAST AI agent using Helm
		castaiAgent, err := helm.NewRelease(ctx, "castai-agent", &helm.ReleaseArgs{
			Name:  pulumi.String("castai-agent"),
			Chart: pulumi.String("castai-agent"),
			RepositoryOpts: &helm.RepositoryOptsArgs{
				Repo: pulumi.String("https://castai.github.io/helm-charts"),
			},
			Namespace:       pulumi.String("castai-agent"),
			CreateNamespace: pulumi.Bool(true),
			CleanupOnFail:   pulumi.Bool(true),
			Timeout:         pulumi.Int(300),
			Values: castaiCluster.ClusterToken.ApplyT(func(token string) map[string]interface{} {
				return map[string]interface{}{
					"provider":        "eks",
					"createNamespace": false, // Required until https://github.com/castai/helm-charts/issues/135 is fixed
					"apiURL":          getEnvOrDefault("CASTAI_API_URL", "https://api.cast.ai"),
					"apiKey":          token,
				}
			}).(pulumi.MapInput),
		}, pulumi.Provider(k8sProvider), pulumi.DependsOn([]pulumi.Resource{castaiCluster}))
		if err != nil {
			return err
		}

		// Export useful information
		ctx.Export("clusterId", castaiCluster.ID())
		ctx.Export("clusterToken", pulumi.ToSecret(castaiCluster.ClusterToken))
		ctx.Export("agentStatus", castaiAgent.Status)
		ctx.Export("eksClusterEndpoint", pulumi.String(cluster.Endpoint))
		ctx.Export("eksClusterName", pulumi.String(clusterName))
		ctx.Export("message", pulumi.Sprintf(`
✅ CAST AI agent installed successfully!

Your EKS cluster "%s" is now connected to CAST AI in READ-ONLY mode.

Next steps:
1. Log in to CAST AI console: https://console.cast.ai
2. Navigate to your cluster to see optimization recommendations
3. Review the recommendations and cost savings potential

Note: In read-only mode, CAST AI will NOT make any changes to your cluster.
It will only provide recommendations and cost analysis.

To enable optimization, you'll need to configure Phase 2 (full onboarding).
`, clusterName))

		return nil
	})
}

// Helper function to get value from environment variable or Pulumi config
func getEnvOrConfig(cfg *config.Config, envVar, configKey string, required bool) string {
	if val := os.Getenv(envVar); val != "" {
		return val
	}
	if required {
		return cfg.Require(configKey)
	}
	return cfg.Get(configKey)
}

// Helper function to get value from environment variable or use default
func getEnvOrDefault(envVar, defaultVal string) string {
	if val := os.Getenv(envVar); val != "" {
		return val
	}
	return defaultVal
}
