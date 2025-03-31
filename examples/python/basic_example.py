"""
CAST AI Basic Example
This example demonstrates basic usage of the CAST AI provider.
"""

import os
import pulumi
from pulumi_castai import Provider

# Get API token from environment variable
api_token = os.environ.get("CASTAI_API_TOKEN")
if not api_token:
    raise Exception("CASTAI_API_TOKEN environment variable is required")

# Initialize the CAST AI provider
provider = Provider("castai-provider", 
    api_token=api_token,
    api_url="https://api.cast.ai"  # Optional, defaults to https://api.cast.ai
)

# Note: To connect different Kubernetes cluster types to CAST AI, 
# you need to use the appropriate resource:
#
# For AWS EKS:
# from pulumi_castai import EksCluster
# eks_cluster = EksCluster("my-eks-cluster", ...)
#
# For Azure AKS:
# from pulumi_castai import AksCluster
# aks_cluster = AksCluster("my-aks-cluster", ...)
#
# For Google GKE:
# from pulumi_castai import GkeCluster
# gke_cluster = GkeCluster("my-gke-cluster", ...)
#
# For node configuration:
# from pulumi_castai import NodeConfiguration
# node_config = NodeConfiguration("my-node-config", ...)
#
# For autoscaling:
# from pulumi_castai import Autoscaler
# autoscaler = Autoscaler("my-autoscaler", ...)
#
# Refer to the CAST AI Terraform Provider documentation for detailed 
# configuration parameters required for each resource.

pulumi.export("provider_configured", True) 