"""
CAST AI Azure (AKS) Example for Python
This example demonstrates how to connect an Azure AKS cluster to CAST AI.
"""

import pulumi
import os
from pulumi_castai import Provider, AksCluster

# Check for required Azure credentials
required_vars = [
    "AZURE_SUBSCRIPTION_ID",
    "AZURE_TENANT_ID",
    "AZURE_RESOURCE_GROUP",
    "CASTAI_API_TOKEN"
]

missing_vars = [var for var in required_vars if not os.environ.get(var)]
if missing_vars:
    print(f"Warning: Missing required Azure credentials: {', '.join(missing_vars)}")
    print("This is a simulation only - not creating actual resources.")

# Initialize the CAST AI provider
# You can set these via environment variables CASTAI_API_TOKEN and CASTAI_API_URL
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider = Provider("castai-provider", api_token=api_token)

# Get Azure values from environment variables or use defaults
azure_subscription_id = os.environ.get("AZURE_SUBSCRIPTION_ID", "00000000-0000-0000-0000-000000000000")
azure_tenant_id = os.environ.get("AZURE_TENANT_ID", "00000000-0000-0000-0000-000000000000")
azure_resource_group = os.environ.get("AZURE_RESOURCE_GROUP", "my-resource-group")

# Get AKS cluster name from environment variable or use a default value
aks_cluster_name = os.environ.get("AKS_CLUSTER_NAME", "cast_ai_test_cluster")

# Create a connection to an AKS cluster
aks_cluster = AksCluster("aks-cluster-connection",
    subscription_id=azure_subscription_id,    # Azure subscription ID
    tenant_id=azure_tenant_id,                # Azure tenant ID
    resource_group_name=azure_resource_group, # Azure resource group
    name=aks_cluster_name,        # AKS cluster name
    delete_nodes_on_disconnect=True,          # Remove nodes on disconnect
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the cluster ID
pulumi.export("cluster_id", aks_cluster.id)
