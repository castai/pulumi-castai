"""
CAST AI Rebalancing Schedule Data Source Example for Python

This example demonstrates how to use the CAST AI provider to access rebalancing schedule data.
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

# Define Pydantic model for rebalancing schedule data source
class RebalancingScheduleArgs(BaseModel):
    """Arguments for rebalancing schedule data source."""
    name: str = Field(..., description="Name of the rebalancing schedule")

# Placeholder: Replace with the actual name of the rebalancing schedule to fetch.
schedule_name = "my-existing-rebalancing-schedule"

# Create the args model
schedule_args = RebalancingScheduleArgs(
    name=schedule_name
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
            "example-type": "rebalancing-schedule-data-source"
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
#     # Get the rebalancing schedule from the data source
#     schedule_info = castai.rebalancing.get_rebalancing_schedule(
#         **schedule_args.dict(exclude_none=True),
#         opts=pulumi.InvokeOptions(provider=provider)
#     )
#     schedule_id = schedule_info.id
#     schedule_cron = schedule_info.schedule.cron
# except Exception as e:
#     pulumi.log.warn(f"Could not access CAST AI rebalancing schedule data source: {str(e)}")
#     schedule_id = "rs-12345"
#     schedule_cron = "0 0 * * *"

# For demonstration purposes, create a simulated data source result
schedule_data = {
    "id": "rs-12345",
    "name": schedule_name,
    "schedule": {
        "cron": "0 0 * * *",
        "timezone": "UTC"
    },
    "created_at": "2023-01-01T00:00:00Z"
}

# Export the simulated data source results
pulumi.export("schedule_id", schedule_data["id"])
pulumi.export("schedule_name", schedule_data["name"])
pulumi.export("schedule_cron", schedule_data["schedule"]["cron"])
pulumi.export("schedule_timezone", schedule_data["schedule"]["timezone"])

# Export the provider configuration to show it's being used
pulumi.export("provider_configured", True)
pulumi.export("api_url", provider_config.api_url) 