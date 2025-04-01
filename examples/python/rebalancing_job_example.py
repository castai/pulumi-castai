"""
CAST AI Rebalancing Job Example for Python

This example demonstrates how to create a rebalancing job in CAST AI.
"""

import pulumi
import pulumi_castai as castai
import os
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

# Import the CAST AI provider and models
from models import Provider as ProviderModel

# Initialize the CAST AI provider
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider_config = ProviderModel(api_token=api_token)
provider = castai.Provider("castai-provider",
    api_token=provider_config.api_token,
    api_url=provider_config.api_url
)

# Pydantic model for Rebalancing Job
class RebalancingJobModel(BaseModel):
    """Configuration for a rebalancing job."""
    cluster_id: str
    rebalancing_schedule_id: str
    enabled: bool = True

# Placeholder: Assume these IDs are obtained from other resources
# e.g., from castai.Cluster and castai.RebalancingSchedule resources
cluster_id = "your-cluster-id"
schedule_id = "your-rebalancing-schedule-id"

# Create the rebalancing job model
rebalancing_job_model = RebalancingJobModel(
    cluster_id=cluster_id,
    rebalancing_schedule_id=schedule_id,
    enabled=True  # Set to False to disable the job
)

# Convert the model to a dictionary
job_args = rebalancing_job_model.dict(exclude_none=True)

# Create the rebalancing job resource
try:
    # Use the direct RebalancingJob type
    rebalancing_job = castai.RebalancingJob(
        "example-py-rebalancing-job",
        **job_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )
    
    # Export the job ID
    pulumi.export("rebalancing_job_py_id", rebalancing_job.id)
except Exception as e:
    pulumi.log.warn(f"Failed to create rebalancing job: {str(e)}")
    # Export the configuration as demonstration
    pulumi.export("rebalancing_job_config", job_args)
    pulumi.export("provider_configured", True) 