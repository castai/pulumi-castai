"""
CAST AI GCP (GKE) Example for Python
This example demonstrates how to connect a GCP GKE cluster to CAST AI.
"""

import pulumi
import os
from pulumi_castai import Provider, GkeCluster

# Check for required GCP credentials
required_vars = [
    "GOOGLE_CREDENTIALS",
    "GCP_PROJECT_ID",
    "CASTAI_API_TOKEN"
]

missing_vars = [var for var in required_vars if not os.environ.get(var)]
if missing_vars:
    print(f"Warning: Missing required GCP credentials: {', '.join(missing_vars)}")
    print("This is a simulation only - not creating actual resources.")

# Initialize the CAST AI provider
# You can set these via environment variables CASTAI_API_TOKEN and CASTAI_API_URL
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider = Provider("castai-provider", api_token=api_token)

# Create keyword arguments for GKE cluster
kwargs = {
    "project_id": "demo-gcp-project-id",  # GCP project ID
    "location": "us-central1",            # GCP region or zone
    "name": "demo-gke-cluster",           # GKE cluster name
    "delete_nodes_on_disconnect": True,   # Remove nodes on disconnect
    "tags": {
        "environment": "dev",
        "managed-by": "pulumi",
    }
    # Optional parameters
    # "credentials_json": "...",         # Service account JSON credentials
}

# Create a connection to a GKE cluster
gke_cluster = GkeCluster("gke-cluster-connection", **kwargs,
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the cluster ID and token
pulumi.export("cluster_id", gke_cluster.id)
pulumi.export("cluster_token", gke_cluster.cluster_token)