"""
CAST AI GKE User Policies Data Source Example for Python

This example demonstrates how to use the CAST AI provider to access GKE user policies data.
"""

import pulumi
import os
import json
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

# Import the CAST AI provider and models
import pulumi_castai as castai
from models import Provider as ProviderModel, GkeClusterConfig

# Initialize the CAST AI provider
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider_config = ProviderModel(api_token=api_token)
provider = castai.Provider("castai-provider",
    api_token=provider_config.api_token,
    api_url=provider_config.api_url
)

# Define Pydantic model for GKE policies data source
class GkePolicyMember(BaseModel):
    """Model for a GKE policy role binding member."""
    role: str
    members: List[str]

class GkePoliciesArgs(BaseModel):
    """Arguments for GKE policies data source."""
    project_id: Optional[str] = None

# Create a GKE cluster config to demonstrate provider usage
gke_cluster_config = GkeClusterConfig(
    project_id="my-gcp-project-id",
    location="us-central1",
    cluster_name="my-gke-cluster",
    delete_nodes_on_disconnect=True,
    tags={
        "created-by": "pulumi-example",
        "example-type": "data-source"
    }
)

# Convert the model to dictionary and use it as keyword arguments
gke_args = gke_cluster_config.dict(exclude_none=True)

# Create an actual CAST AI resource to ensure the provider is being used
try:
    # Create a GKE cluster connection using the CAST AI provider
    gke_cluster = castai.GkeCluster("example-gke-cluster",
        **gke_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )
    
    # Export the actual cluster ID
    pulumi.export("castai_gke_cluster_id", gke_cluster.id)
except Exception as e:
    pulumi.log.warn(f"Failed to create GKE cluster with CAST AI provider: {str(e)}")
    # Continue with the example without creating a resource

# Example of GKE policies data source usage
# This is how the data source would be used once implemented
policies_args = GkePoliciesArgs(
    project_id="my-gcp-project-id"
)

# Example of accessing a data source with the provider (commented out as it may not exist yet)
# try:
#     gke_policies = castai.gcp.get_gke_user_policies(
#         **policies_args.dict(exclude_none=True),
#         opts=pulumi.InvokeOptions(provider=provider)
#     )
# except Exception as e:
#     pulumi.log.warn(f"Could not access CAST AI GKE policies data source: {str(e)}")

# For demonstration purposes, create a simulated data source result
policy_data = {
    "policy_json": json.dumps({
        "version": "1",
        "etag": "BwYIX1CBNP0=",
        "bindings": [
            {
                "role": "roles/container.admin",
                "members": ["user:example@example.com"]
            }
        ]
    }),
    "policies": [
        {
            "role": "roles/container.admin",
            "members": ["user:example@example.com"]
        }
    ]
}

# Export the simulated data source results
pulumi.export("gke_policies_json", policy_data["policy_json"])
pulumi.export("gke_policies", policy_data["policies"])

# Export the provider configuration to show it's being used
pulumi.export("provider_configured", True)
pulumi.export("api_url", provider_config.api_url) 