"""
CAST AI EKS Read-Only Example (Phase 1)

This example connects an existing EKS cluster to CAST AI in read-only mode.
CAST AI will monitor your cluster and provide optimization recommendations
without making any changes.

Prerequisites:
- Existing EKS cluster
- AWS credentials configured
- kubectl configured to access the cluster
- CAST AI API token

Required environment variables:
- CASTAI_API_TOKEN: Your CAST AI API token
- EKS_CLUSTER_NAME: Name of your EKS cluster
- AWS_REGION: AWS region where your cluster is located
- AWS_ACCOUNT_ID: Your AWS account ID (optional)
"""

import os
import pulumi
import pulumi_aws as aws
import pulumi_castai as castai
import pulumi_kubernetes as k8s

# Get configuration from environment or Pulumi config
config = pulumi.Config()
aws_config = pulumi.Config("aws")

castai_api_token = os.getenv("CASTAI_API_TOKEN") or config.require("castaiApiToken")
cluster_name = os.getenv("EKS_CLUSTER_NAME") or config.require("clusterName")
aws_region = os.getenv("AWS_REGION") or aws_config.require("region")
aws_account_id = os.getenv("AWS_ACCOUNT_ID") or config.get("awsAccountId")

# Get AWS account ID if not provided
if aws_account_id:
    caller_identity = aws_account_id
else:
    identity = aws.get_caller_identity()
    caller_identity = identity.account_id

# Get EKS cluster information
cluster = aws.eks.get_cluster(name=cluster_name)

# Configure CAST AI provider
castai_provider = castai.Provider(
    "castai",
    api_token=castai_api_token,
    api_url=os.getenv("CASTAI_API_URL", "https://api.cast.ai")
)

# Register EKS cluster with CAST AI (read-only mode)
castai_cluster = castai.EksCluster(
    "castai-eks-cluster",
    account_id=caller_identity,
    region=aws_region,
    name=cluster_name,
    opts=pulumi.ResourceOptions(provider=castai_provider)
)

# Build kubeconfig for EKS cluster
kubeconfig = pulumi.Output.all(
    cluster.endpoint,
    cluster.certificate_authorities[0].data,
    cluster_name,
    aws_region
).apply(lambda args: f"""apiVersion: v1
kind: Config
clusters:
- cluster:
    server: {args[0]}
    certificate-authority-data: {args[1]}
  name: {args[2]}
contexts:
- context:
    cluster: {args[2]}
    user: {args[2]}
  name: {args[2]}
current-context: {args[2]}
users:
- name: {args[2]}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: aws
      args:
        - eks
        - get-token
        - --cluster-name
        - {args[2]}
        - --region
        - {args[3]}
""")

# Configure Kubernetes provider to access the EKS cluster
k8s_provider = k8s.Provider(
    "eks-k8s",
    kubeconfig=kubeconfig
)

# Install CAST AI agent using Helm
castai_agent = k8s.helm.v3.Release(
    "castai-agent",
    k8s.helm.v3.ReleaseArgs(
        name="castai-agent",
        chart="castai-agent",
        repository_opts=k8s.helm.v3.RepositoryOptsArgs(
            repo="https://castai.github.io/helm-charts"
        ),
        namespace="castai-agent",
        create_namespace=True,
        cleanup_on_fail=True,
        timeout=300,
        values=castai_cluster.cluster_token.apply(lambda token: {
            "provider": "eks",
            "createNamespace": False,  # Required until https://github.com/castai/helm-charts/issues/135 is fixed
            "apiURL": os.getenv("CASTAI_API_URL", "https://api.cast.ai"),
            "apiKey": token,
        })
    ),
    opts=pulumi.ResourceOptions(
        provider=k8s_provider,
        depends_on=[castai_cluster]
    )
)

# Export useful information
pulumi.export("clusterId", castai_cluster.id)
pulumi.export("clusterToken", pulumi.Output.secret(castai_cluster.cluster_token))
pulumi.export("agentStatus", castai_agent.status)
pulumi.export("eksClusterEndpoint", cluster.endpoint)
pulumi.export("eksClusterName", cluster_name)
pulumi.export("message", pulumi.Output.concat(
    "\n✅ CAST AI agent installed successfully!\n\n",
    f"Your EKS cluster \"{cluster_name}\" is now connected to CAST AI in READ-ONLY mode.\n\n",
    "Next steps:\n",
    "1. Log in to CAST AI console: https://console.cast.ai\n",
    "2. Navigate to your cluster to see optimization recommendations\n",
    "3. Review the recommendations and cost savings potential\n\n",
    "Note: In read-only mode, CAST AI will NOT make any changes to your cluster.\n",
    "It will only provide recommendations and cost analysis.\n\n",
    "To enable optimization, you'll need to configure Phase 2 (full onboarding).\n"
))
