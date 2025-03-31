"""
CAST AI AWS (EKS) Example for Python
This example demonstrates how to connect an AWS EKS cluster to CAST AI.
"""

import pulumi
import os
from pulumi_castai import Provider, EksCluster, EksClusterArgs

# Initialize the CAST AI provider
# You can set these via environment variables CASTAI_API_TOKEN and CASTAI_API_URL
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider = Provider("castai-provider", api_token=api_token)

# Create arguments for EKS cluster
args = EksClusterArgs(
    account_id="123456789012",            # AWS account ID
    region="us-west-2",                   # AWS region
    eks_cluster_name="demo-eks-cluster",  # EKS cluster name
    security_group_id="sg-12345678",      # Security group ID
    subnet_ids=["subnet-12345678", "subnet-87654321"], # Subnet IDs
    # Optional parameters
    # assume_role_arn="arn:aws:iam::123456789012:role/CastAiRole",
    delete_nodes_on_disconnect=True       # Remove nodes on disconnect
)

# Create a connection to an EKS cluster
eks_cluster = EksCluster("eks-cluster-connection",
    args,
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the cluster ID
pulumi.export("cluster_id", eks_cluster.id)