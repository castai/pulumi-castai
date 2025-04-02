"""
CAST AI AWS (EKS) Example for Python
This example demonstrates how to connect an AWS EKS cluster to CAST AI.
"""

import pulumi
import os
from pulumi_castai import Provider, EksCluster

# Check for required AWS credentials
required_vars = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
    "CASTAI_API_TOKEN"
]

missing_vars = [var for var in required_vars if not os.environ.get(var)]
if missing_vars:
    print(f"Warning: Missing required AWS credentials: {', '.join(missing_vars)}")
    print("This is a simulation only - not creating actual resources.")

# Initialize the CAST AI provider
# You can set these via environment variables CASTAI_API_TOKEN and CASTAI_API_URL
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider = Provider("castai-provider", api_token=api_token)

# Get AWS values from environment variables or use defaults
aws_region = os.environ.get("AWS_REGION", "us-west-2")
aws_account_id = os.environ.get("AWS_ACCOUNT_ID", "123456789012")

# Get EKS cluster name from environment variable or use a default value
eks_cluster_name = os.environ.get("EKS_CLUSTER_NAME", "cast_ai_test_cluster")

# Create a connection to an EKS cluster
eks_cluster = EksCluster("eks-cluster-connection",
    account_id=aws_account_id,           # AWS account ID
    region=aws_region,                   # AWS region
    eks_cluster_name=eks_cluster_name,   # EKS cluster name
    delete_nodes_on_disconnect=True,     # Remove nodes on disconnect
    
    # The following values need to be replaced with actual values from your AWS account
    # For demo purposes, we're using placeholder values
    security_group_id="sg-12345678",
    subnet_ids=["subnet-12345678", "subnet-87654321"],
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the cluster ID
pulumi.export("cluster_id", eks_cluster.id)
