"""
CAST AI GCP (GKE) Example for Python
This example demonstrates how to connect a GCP GKE cluster to CAST AI.
"""

import pulumi
import os
from pulumi_castai import Provider, GkeCluster, GkeClusterArgs

# Initialize the CAST AI provider
# You can set these via environment variables CASTAI_API_TOKEN and CASTAI_API_URL
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider = Provider("castai-provider", api_token=api_token)

# Create arguments for GKE cluster
args = GkeClusterArgs(
    project_id="demo-gcp-project-id",  # GCP project ID
    location="us-central1",            # GCP region or zone
    name="demo-gke-cluster",           # GKE cluster name (optional)
    # Optional parameters
    # credentials_json="...",          # Service account JSON credentials
    delete_nodes_on_disconnect=True    # Remove nodes on disconnect
)

# Create a connection to a GKE cluster
gke_cluster = GkeCluster("gke-cluster-connection",
    args=args,
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the cluster ID and token
pulumi.export("cluster_id", gke_cluster.id)
pulumi.export("cluster_token", gke_cluster.cluster_token)