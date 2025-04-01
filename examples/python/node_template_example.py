"""
CAST AI Node Template Example for Python

This example demonstrates how to configure node templates for a CAST AI cluster.
"""

import pulumi
import pulumi_castai as castai
import os
from typing import Dict, List, Optional, Any, Literal
from pydantic import BaseModel, Field

# Import the CAST AI provider and models
from models import Provider as ProviderModel

# Initialize the CAST AI provider
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider_config = ProviderModel(api_token=api_token)
provider = castai.Provider("castai-provider",
    api_token=provider_config.api_token,
    api_url=provider_config.api_url
)

# Pydantic models for Node Template
class CustomTaint(BaseModel):
    """Custom taint configuration for node templates."""
    key: str
    value: str
    effect: str

class InstanceFamilies(BaseModel):
    """Instance family constraints for node templates."""
    include: List[str]
    exclude: Optional[List[str]] = None

class NodeTemplateConstraints(BaseModel):
    """Constraints configuration for node templates."""
    on_demand: bool = True
    spot: bool = False
    use_spot_fallbacks: bool = True
    fallback_restore_rate_seconds: int = 300
    enable_spot_diversity: bool = True
    spot_diversity_price_increase_limit_percent: int = 20
    spot_interruption_predictions_enabled: bool = True
    spot_interruption_predictions_type: str = "aws-rebalance-recommendations"
    compute_optimized_state: Literal["enabled", "disabled"] = "disabled"
    storage_optimized_state: Literal["enabled", "disabled"] = "disabled"
    is_gpu_only: bool = False
    min_cpu: int
    max_cpu: int
    min_memory: int
    max_memory: int
    architectures: List[str]
    azs: List[str]
    burstable_instances: Literal["enabled", "disabled"] = "disabled"
    instance_families: InstanceFamilies

class NodeTemplateModel(BaseModel):
    """Node template configuration model."""
    cluster_id: str
    name: str
    is_enabled: bool = True
    configuration_id: str
    should_taint: bool = True
    custom_labels: Optional[Dict[str, str]] = None
    custom_taints: Optional[List[CustomTaint]] = None
    constraints: NodeTemplateConstraints
    is_default: Optional[bool] = None

# Placeholder: Assume these IDs are obtained from other resources
cluster_id = "your-cluster-id"
node_configuration_id = "your-node-config-id"

# Create the node template model
node_template_model = NodeTemplateModel(
    cluster_id=cluster_id,
    name="default-py-template",
    is_enabled=True,
    configuration_id=node_configuration_id,
    should_taint=True,
    custom_labels={
        "environment": "production",
        "pulumi-managed": "true",
    },
    custom_taints=[
        CustomTaint(
            key="pulumi-dedicated",
            value="backend",
            effect="NoSchedule",
        )
    ],
    constraints=NodeTemplateConstraints(
        on_demand=True,
        spot=False,
        use_spot_fallbacks=True,
        fallback_restore_rate_seconds=300,
        enable_spot_diversity=True,
        spot_diversity_price_increase_limit_percent=20,
        spot_interruption_predictions_enabled=True,
        spot_interruption_predictions_type="aws-rebalance-recommendations",
        compute_optimized_state="disabled",
        storage_optimized_state="disabled",
        is_gpu_only=False,
        min_cpu=2,
        max_cpu=8,
        min_memory=4096,
        max_memory=16384,
        architectures=["amd64"],
        azs=["us-east-1a", "us-east-1b"],
        burstable_instances="disabled",
        instance_families=InstanceFamilies(
            include=["m5", "c5"],
        ),
    )
    # is_default=False,  # Only one template can be default
)

# Convert the model to a dictionary and create the resource
# Convert the model to a dictionary
template_args = node_template_model.dict(exclude_none=True)

# Create the node template using the direct type
node_template = castai.NodeTemplate(
    "example-py-node-template",
    **template_args,
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the template ID
pulumi.export("node_template_py_id", node_template.id) 