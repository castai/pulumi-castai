"""
CAST AI AWS (EKS) Example for Python
This example demonstrates how to connect an AWS EKS cluster to CAST AI.
"""

import pulumi
import os
from pulumi_castai import Provider, EksCluster
from models import Provider as ProviderModel, EksClusterConfig

# Initialize the CAST AI provider
# You can set these via environment variables CASTAI_API_TOKEN and CASTAI_API_URL
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")

# Create provider model
provider_config = ProviderModel(
    api_token=api_token
)

# Initialize the provider
provider = Provider("castai-provider",
                    api_token=provider_config.api_token,
                    api_url=provider_config.api_url
                    )

# Create configuration for CAST AI EKS cluster using Pydantic model
eks_config = EksClusterConfig(
    account_id="123456789012",            # AWS account ID
    region="us-west-2",                   # AWS region
    eks_cluster_name="demo-eks-cluster",  # EKS cluster name
    delete_nodes_on_disconnect=True,      # Remove nodes on disconnect
    tags={
        "environment": "dev",
        "managed-by": "pulumi",
    },
    assume_role_arn="arn:aws:iam::123456789012:role/CastAiRole",
)

# Convert the model to dictionary and use it as keyword arguments
eks_args = eks_config.dict(exclude_none=True)

# Create a connection to an EKS cluster
eks_cluster = EksCluster("eks-cluster-connection",
                         **eks_args,  # Unpack the model as keyword arguments
                         opts=pulumi.ResourceOptions(provider=provider)
                         )

# Export the cluster ID
pulumi.export("cluster_id", eks_cluster.id)
