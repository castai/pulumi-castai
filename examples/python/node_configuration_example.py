"""
CAST AI Node Configuration Example for Python

This example demonstrates how to configure node settings for a CAST AI cluster.
"""

import pulumi
import pulumi_castai as castai
import base64
import json
import os
from typing import Dict, List, Optional, Any
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

# Pydantic models for Node Configuration
class NodeConfigurationEksArgs(BaseModel):
    """AWS EKS specific node configuration."""
    instance_profile_arn: str
    security_groups: List[str]
    dns_cluster_ip: Optional[str] = None

class NodeConfigurationModel(BaseModel):
    """Full node configuration model."""
    name: str
    cluster_id: str
    disk_cpu_ratio: int = 35
    min_disk_size: Optional[int] = None
    subnets: List[str]
    init_script: Optional[str] = None
    docker_config: Optional[str] = None
    kubelet_config: Optional[str] = None
    container_runtime: str = "containerd"
    tags: Optional[Dict[str, str]] = None
    eks: Optional[NodeConfigurationEksArgs] = None

class NodeConfigurationDefaultModel(BaseModel):
    """Model for setting a node configuration as default."""
    cluster_id: str
    configuration_id: Any  # Using Any to handle Output type

# Placeholder: Assume these IDs/values are obtained from other resources or config
cluster_id = "your-cluster-id"
subnet_ids = ["subnet-12345abc", "subnet-67890def"] # Example subnet IDs
instance_profile_arn = "arn:aws:iam::123456789012:instance-profile/YourProfile" # Example EKS profile ARN
security_group_ids = ["sg-12345abc"] # Example EKS SG ID

init_script = """#!/bin/bash
echo "Hello from Pulumi-managed node!"
# Add other initialization commands here
"""

docker_config = json.dumps({
    "insecure-registries": ["my-registry.local:5000"],
    "max-concurrent-downloads": 10,
})

kubelet_config = json.dumps({
    "registryBurst": 20,
    "registryPullQPS": 10,
})

# Create a Node Configuration using Pydantic model
node_config_model = NodeConfigurationModel(
    name="default-py-config",
    cluster_id=cluster_id,
    disk_cpu_ratio=35,
    # min_disk_size=133,  # Optional
    subnets=subnet_ids,
    init_script=base64.b64encode(init_script.encode('utf-8')).decode('utf-8'),
    docker_config=docker_config,
    kubelet_config=kubelet_config,
    container_runtime="containerd",  # Or dockerd
    tags={
        "provisioner": "castai-pulumi",
        "environment": "dev",
    },
    # Cloud-specific settings (EKS example)
    eks=NodeConfigurationEksArgs(
        instance_profile_arn=instance_profile_arn,
        # dns_cluster_ip="10.100.0.10",  # Optional
        security_groups=security_group_ids,
    )
)

# Convert the model to dictionary and use it as keyword arguments
node_args = node_config_model.dict(exclude_none=True)

# Create the Node Configuration resource
try:
    # Try creating with the correct resource path
    node_config = castai.NodeConfiguration("example-py-node-config",
        **node_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )

    # Create a simple dictionary for the default config
    # Instead of trying to use a complex model or namespace path
    default_args = {
        "cluster_id": cluster_id,
        "configuration_id": node_config.id
    }

    # Use the direct type for the default configuration
    default_config = castai.NodeConfigurationDefault(
        "example-py-default-config",
        **default_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )

    # Export the configuration ID
    pulumi.export("node_configuration_py_id", node_config.id)
    # Export the ID of the default setting resource
    pulumi.export("default_config_py_resource_id", default_config.id)
except Exception as e:
    pulumi.log.warn(f"Failed to create node configuration: {str(e)}")
    # Still demonstrate the configuration that would be created
    pulumi.export("node_configuration_model", node_args)
    pulumi.export("provider_configured", True) 