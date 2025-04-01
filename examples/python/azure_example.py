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
from pulumi_castai import Provider, AksCluster

# Initialize the CAST AI provider
# You can set these via environment variables CASTAI_API_TOKEN and CASTAI_API_URL
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider = Provider("castai-provider", api_token=api_token)

# Create keyword arguments for AKS cluster
kwargs = {
    "subscription_id": "00000000-0000-0000-0000-000000000000",  # Azure subscription ID
    "tenant_id": "00000000-0000-0000-0000-000000000000",        # Azure tenant ID
    "resource_group": "my-resource-group",                      # Azure resource group
    "location": "eastus",                                       # Azure location/region
    "cluster_name": "demo-aks-cluster",                         # AKS cluster name
    "delete_nodes_on_disconnect": True,                         # Remove nodes on disconnect
    "tags": {
        "environment": "dev",
        "managed-by": "pulumi",
    }
}

# Create a connection to an AKS cluster
aks_cluster = AksCluster("aks-cluster-connection", **kwargs,
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the cluster ID
pulumi.export("cluster_id", aks_cluster.id)