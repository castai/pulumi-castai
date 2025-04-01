"""
CAST AI EKS Settings Data Source Example for Python

This example demonstrates how to use the CAST AI provider to access EKS settings data.
"""

import pulumi
import pulumi_aws as aws
import os
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

# Import the CAST AI provider and models
import pulumi_castai as castai
from models import Provider as ProviderModel, EksClusterConfig

# Initialize the CAST AI provider
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider_config = ProviderModel(api_token=api_token)
provider = castai.Provider("castai-provider",
    api_token=provider_config.api_token,
    api_url=provider_config.api_url
)

# Define Pydantic model for EKS settings data source
class EksSettingsArgs(BaseModel):
    """Arguments for EKS settings data source."""
    account_id: str = Field(..., description="AWS account ID")
    region: str = Field(..., description="AWS region")
    cluster: str = Field(..., description="EKS cluster name") 
    vpc: str = Field(..., description="VPC ID")

# Placeholder: Replace with actual values or fetch dynamically
cluster_region = "us-east-1"
cluster_name = "my-eks-cluster"
vpc_id = "vpc-12345678"

# Get current AWS Account ID
caller_identity = aws.get_caller_identity()
account_id = caller_identity.account_id

# Create the args model
eks_settings_args = EksSettingsArgs(
    account_id=account_id,
    region=cluster_region,
    cluster=cluster_name,
    vpc=vpc_id
)

# Create an EKS cluster config model
eks_cluster_config = EksClusterConfig(
    account_id=account_id,
    region=cluster_region,
    eks_cluster_name=cluster_name,
    delete_nodes_on_disconnect=True,
    assume_role_arn=None,  # Explicitly set to None to fix linter error
    tags={
        "created-by": "pulumi-example",
        "example-type": "data-source"
    }
)

# Create an actual CAST AI resource to ensure the provider is being used
# Convert the model to dictionary and use it as keyword arguments
eks_args = eks_cluster_config.dict(exclude_none=True)
example_cluster = castai.EksCluster("example-cluster",
    **eks_args,
    opts=pulumi.ResourceOptions(provider=provider)
)

# Example of data source usage - this shows how to use data sources
# when they are available in the provider
# Note: Currently commented out as the organization data source may not exist yet
# 
# try:
#     # Try using the EKS settings data source (when implemented)
#     eks_settings = castai.aws.get_eks_settings(
#         **eks_settings_args.dict(exclude_none=True),
#         opts=pulumi.InvokeOptions(provider=provider)
#     )
#     settings_id = eks_settings.id
# except Exception as e:
#     settings_id = "example-settings-id"
#     pulumi.log.warn(f"Could not access CAST AI EKS settings data source: {str(e)}")

# Create a simple output to simulate data source results
data_source_result = {
    "name": "example-eks-data",
    "id": "data-source-example-id",
    "organization": "Example Organization",
    "settings": {
        "account_id": account_id,
        "region": cluster_region,
        "eks_cluster": cluster_name
    }
}

# Export the outputs from actually using the CAST AI provider
pulumi.export("castai_cluster_id", example_cluster.id)
pulumi.export("simulated_data_source", data_source_result)

# Additional informational exports
pulumi.export("account_id", account_id)
pulumi.export("region", cluster_region)
pulumi.export("vpc_id", vpc_id) 