"""
CAST AI Azure (AKS) Example for Python
This example demonstrates how to connect an Azure AKS cluster to CAST AI.

NOTE: This is a template example that needs to be updated with the correct 
parameters for your environment. Some parameter names or structures might
need adjustment based on the actual pulumi-castai SDK generated.

Please refer to the basic_example.py and the CAST AI Terraform Provider 
documentation for guidance on how to configure the resources correctly.
"""

import pulumi
import os
from typing import Optional
from pydantic import BaseModel, Field
from pulumi_castai import Provider, AksCluster

# Define the AksClusterArgs model to match expected structure in pulumi-castai
class AksClusterArgs(BaseModel):
    subscription_id: str 
    tenant_id: str
    resource_group: str
    location: str
    cluster_name: str
    delete_nodes_on_disconnect: Optional[bool] = Field(default=False)

    class Config:
        extra = "forbid"

# Initialize the CAST AI provider
# You can set these via environment variables CASTAI_API_TOKEN and CASTAI_API_URL
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider = Provider("castai-provider", api_token=api_token)

# Create arguments for AKS cluster
aks_args = {
    "subscription_id": "00000000-0000-0000-0000-000000000000",  # Azure subscription ID
    "tenant_id": "00000000-0000-0000-0000-000000000000",        # Azure tenant ID
    "resource_group": "my-resource-group",                      # Azure resource group
    "location": "eastus",                                       # Azure location/region
    "cluster_name": "demo-aks-cluster",                         # AKS cluster name
    "delete_nodes_on_disconnect": True                          # Remove nodes on disconnect
}

# Validate arguments through the pydantic model
config = AksClusterArgs(**aks_args)

# Create a connection to an AKS cluster
aks_cluster = AksCluster("aks-cluster-connection", 
    **aks_args,
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the cluster ID
pulumi.export("cluster_id", aks_cluster.id)