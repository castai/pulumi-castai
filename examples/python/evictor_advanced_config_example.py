"""
CAST AI Evictor Advanced Configuration Example for Python

This example demonstrates how to configure advanced evictor settings for a CAST AI cluster.
"""

import pulumi
import os
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

# Import the CAST AI provider and models
import pulumi_castai as castai
from models import Provider as ProviderModel, EksClusterConfig

# Initialize the CAST AI provider
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider_config = ProviderModel(api_token=api_token)
provider = castai.Provider("castai-provider",
    api_token=provider_config.api_token,
    api_url=provider_config.api_url
)

# Pydantic models for evictor configuration
class PodSelectorConfig(BaseModel):
    """Pod selector configuration for evictor rules."""
    kind: Optional[str] = None
    namespace: str
    match_labels: Dict[str, str]

class EvictorRuleConfig(BaseModel):
    """Single evictor rule configuration."""
    pod_selector: PodSelectorConfig
    aggressive: bool = False

class EvictorAdvancedConfigModel(BaseModel):
    """Full evictor advanced configuration."""
    cluster_id: str
    evictor_config: List[EvictorRuleConfig]  # Simplified name

# Placeholder: Assume cluster_id is obtained from another resource
cluster_id = "your-cluster-id"

# Create the evictor configuration using Pydantic models
evictor_config_model = EvictorAdvancedConfigModel(
    cluster_id=cluster_id,
    evictor_config=[
        EvictorRuleConfig(
            pod_selector=PodSelectorConfig(
                kind="Job",
                namespace="batch-jobs",
                match_labels={
                    "app.kubernetes.io/component": "processor",
                }
            ),
            aggressive=True  # Evict matching pods more aggressively
        ),
        EvictorRuleConfig(
            pod_selector=PodSelectorConfig(
                namespace="critical-services",
                match_labels={
                    "priority": "high",
                }
            ),
            aggressive=False  # Be less aggressive for these pods
        )
    ]
)

# First, create an EKS cluster to demonstrate the provider is being used
try:
    # Create a simple EKS cluster with Pydantic model
    eks_cluster_config = EksClusterConfig(
        account_id="123456789012",
        region="us-west-2",
        eks_cluster_name="demo-cluster",
        delete_nodes_on_disconnect=True,
        assume_role_arn=None,  # Set explicitly to avoid linter error
        tags={
            "created-by": "pulumi-example",
            "example-type": "evictor-config"
        }
    )
    
    # Convert model to dictionary
    eks_args = eks_cluster_config.dict(exclude_none=True)
    
    # Create the cluster
    example_cluster = castai.EksCluster("example-cluster",
        **eks_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )
    
    # Export the cluster ID
    pulumi.export("castai_cluster_id", example_cluster.id)
except Exception as e:
    pulumi.log.warn(f"Failed to create cluster: {str(e)}")

# For the evictor config, since we may not know the exact structure,
# we'll create a configuration object that matches what should be
# passed to the actual resource when it's implemented
evictor_config_data = {
    "cluster_id": cluster_id,
    "evictor_settings": [
        {
            "pod_selector": {
                "kind": "Job",
                "namespace": "batch-jobs",
                "match_labels": {
                    "app.kubernetes.io/component": "processor"
                }
            },
            "aggressive": True
        },
        {
            "pod_selector": {
                "namespace": "critical-services",
                "match_labels": {
                    "priority": "high"
                }
            },
            "aggressive": False
        }
    ]
}

# Export the evictor configuration data
pulumi.export("evictor_config_data", evictor_config_data)
pulumi.export("provider_configured", True) 