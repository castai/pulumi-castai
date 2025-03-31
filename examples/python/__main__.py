"""
CAST AI GCP (GKE) Example for Python
This example demonstrates how to connect a GCP GKE cluster to CAST AI.
"""

import pulumi
import os
from pulumi_castai import Provider, GkeCluster

# Initialize the CAST AI provider
# You can set these via environment variables CASTAI_API_TOKEN and CASTAI_API_URL
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider = Provider("castai-provider",
                   api_token=api_token,
                   opts=pulumi.ResourceOptions(version="0.1.2"))

# Create a connection to a GKE cluster
gke_cluster = GkeCluster("gke-cluster-connection",
    project_id="demo-gcp-project-id",  # Replace with your GCP project ID
    location="us-central1",           # Replace with your GCP region
    name="demo-gke-cluster",          # Replace with your GKE cluster name
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the cluster ID
pulumi.export("cluster_id", gke_cluster.id)
pulumi.export("cluster_token", gke_cluster.cluster_token)