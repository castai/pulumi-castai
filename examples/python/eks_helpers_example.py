"""
CAST AI EKS Helpers Example for Python

This example demonstrates how to use CAST AI helper resources for EKS.
"""

import pulumi
import pulumi_aws as aws
import os
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

# Import the CAST AI provider and models
import pulumi_castai as castai
from models import Provider as ProviderModel

# Initialize the CAST AI provider
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider_config = ProviderModel(api_token=api_token)
provider = castai.Provider("castai-provider",
    api_token=provider_config.api_token,
    api_url=provider_config.api_url
)

# Pydantic models for EKS helpers
class EksClusterIdConfig(BaseModel):
    """Configuration for EKS Cluster ID resource."""
    account_id: str
    region: str
    cluster_name: str

class EksUserArnConfig(BaseModel):
    """Configuration for EKS User ARN resource."""
    cluster_id: Any  # Using Any to handle Output type

# Placeholder values
cluster_region = "us-west-2"
cluster_name = "my-production-eks"

# Get current AWS Account ID
caller_identity = aws.get_caller_identity()
account_id = caller_identity.account_id

# Create config model for EKS Cluster ID
eks_cluster_id_config = EksClusterIdConfig(
    account_id=account_id,
    region=cluster_region,
    cluster_name=cluster_name
)

# Get the CAST AI Cluster ID for the EKS cluster
# Note: The actual name of the resource might be different based on the provider implementation
castai_cluster_id = castai.EksClusterId("example-py-eks-clusterid",
    **eks_cluster_id_config.dict(exclude_none=True),
    opts=pulumi.ResourceOptions(provider=provider)
)

# Create config for User ARN resource
# Need to handle the Output type with a function
def create_user_arn_config(cluster_id):
    return EksUserArnConfig(
        cluster_id=cluster_id
    )

# Create the User ARN resource config once the cluster ID is resolved
user_arn_config_future = pulumi.Output.all(castai_cluster_id.id).apply(
    lambda args: create_user_arn_config(args[0]).dict(exclude_none=True)
)

# Get the required User ARN using the CAST AI Cluster ID
castai_user_arn = castai.EksUserArn("example-py-eks-userarn",
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the Cluster ID and User ARN
pulumi.export("eks_castai_py_cluster_id", castai_cluster_id.id)

# Export the user ARN - the exact property name might vary
# Dynamically try to access potential property names
pulumi.export("eks_castai_py_user_arn", pulumi.Output.concat("See CAST AI console for the ARN value (", castai_user_arn.id, ")")) 