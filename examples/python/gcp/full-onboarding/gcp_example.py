"""
CAST AI GCP (GKE) Example for Python
This example demonstrates how to connect a GCP GKE cluster to CAST AI
by creating a service account with the necessary permissions.
"""

import pulumi
import os
from pulumi_castai import Provider, GkeCluster
from pulumi_gcp import serviceaccount, projects

# Check for required GCP credentials
required_vars = [
    "GCP_PROJECT_ID",
    "CASTAI_API_TOKEN"
]

missing_vars = [var for var in required_vars if not os.environ.get(var)]
if missing_vars:
    print(f"Warning: Missing required GCP credentials: {', '.join(missing_vars)}")
    print("This example will create a service account for GCP authentication.")

# Get GCP project ID from environment variable or use a default value
project_id = os.environ.get("GCP_PROJECT_ID", "my-gcp-project-id")

# Create a service account for CAST AI
castai_service_account = serviceaccount.Account(
    "castai-service-account",
    account_id="castai-gke-access",
    display_name="CAST AI GKE Access Service Account",
    description="Service account for CAST AI to manage GKE cluster",
    project=project_id
)

# Define the required roles for CAST AI
required_roles = [
    "roles/container.clusterAdmin",
    "roles/compute.instanceAdmin.v1",
    "roles/iam.serviceAccountUser",
]

# Assign roles to the service account
for i, role in enumerate(required_roles):
    projects.IAMMember(
        f"castai-role-{i}",
        project=project_id,
        role=role,
        member=castai_service_account.email.apply(lambda email: f"serviceAccount:{email}")
    )

# Create a service account key
service_account_key = serviceaccount.Key(
    "castai-service-account-key",
    service_account_id=castai_service_account.name,
    public_key_type="TYPE_X509_PEM_FILE"
)

# Initialize the CAST AI provider
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider = Provider("castai-provider", api_token=api_token)

# Get GKE cluster name from environment variable or use a default value
cluster_name = os.environ.get("GKE_CLUSTER_NAME", "cast_ai_test_cluster")

# Create keyword arguments for GKE cluster using the service account credentials
kwargs = {
    "project_id": project_id,
    "location": "us-central1",
    "name": cluster_name,
    "delete_nodes_on_disconnect": True,
    "credentials_json": service_account_key.private_key,
    "tags": {
        "environment": "dev",
        "managed-by": "pulumi",
        "created-by": "castai-example",
    }
}

# Create a connection to a GKE cluster
gke_cluster = GkeCluster("gke-cluster-connection", **kwargs,
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the cluster ID, token, and service account information
pulumi.export("cluster_id", gke_cluster.id)
pulumi.export("cluster_token", gke_cluster.cluster_token)
pulumi.export("service_account_email", castai_service_account.email)
pulumi.export("service_account_name", castai_service_account.name)