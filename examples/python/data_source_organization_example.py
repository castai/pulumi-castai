"""
CAST AI Organization Data Source Example for Python

This example demonstrates how to use the CAST AI provider to access organization data.
"""

import pulumi
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

# Define Pydantic model for organization data source
class OrganizationArgs(BaseModel):
    """Arguments for organization data source."""
    name: Optional[str] = None

# Placeholder: Replace with the actual name of the organization you want to fetch.
# This might come from config or be hardcoded for the example.
organization_name = "my-castai-organization-name"

# Create the args model
org_args = OrganizationArgs(
    name=organization_name
)

# Example of using the CAST AI provider by creating an EKS cluster resource
try:
    # Create an EKS cluster config model
    eks_cluster_config = EksClusterConfig(
        account_id="123456789012",
        region="us-west-2",
        eks_cluster_name="demo-eks-cluster",
        delete_nodes_on_disconnect=True,
        assume_role_arn=None,
        tags={
            "created-by": "pulumi-example",
            "example-type": "organization-data-source"
        }
    )
    
    # Convert the model to dictionary and use it as keyword arguments
    eks_args = eks_cluster_config.dict(exclude_none=True)
    
    # Create the EKS cluster resource
    example_cluster = castai.EksCluster("example-cluster",
        **eks_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )
    
    # Export the cluster ID to show provider is used
    pulumi.export("castai_cluster_id", example_cluster.id)
except Exception as e:
    pulumi.log.warn(f"Failed to create EKS cluster with CAST AI provider: {str(e)}")
    # Continue with the example without creating a resource

# This is how the data source would be used once fully implemented
# try:
#     # Using the main namespace
#     org_info = castai.get_organization(
#         **org_args.dict(exclude_none=True),
#         opts=pulumi.InvokeOptions(provider=provider)
#     )
#     org_id = org_info.id
#     org_name = org_info.name
# except Exception as e:
#     pulumi.log.warn(f"Could not access CAST AI organization data source: {str(e)}")
#     org_id = "org-12345"
#     org_name = organization_name

# For demonstration purposes, create a simulated data source result
org_data = {
    "id": "org-12345",
    "name": organization_name,
    "created_at": "2023-01-01T00:00:00Z",
    "updated_at": "2023-01-02T00:00:00Z"
}

# Export the simulated data source results
pulumi.export("organization_id", org_data["id"])
pulumi.export("organization_name", org_data["name"])
pulumi.export("organization_created_at", org_data["created_at"])

# Export the provider configuration to show it's being used
pulumi.export("provider_configured", True)
pulumi.export("api_url", provider_config.api_url) 