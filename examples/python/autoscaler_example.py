"""
CAST AI Autoscaler Example for Python
This example demonstrates how to configure autoscaling settings for a CAST AI cluster.
"""

import pulumi
import pulumi_castai as castai
from models import (
    AutoscalerConfig, 
    UnschedulablePodsConfig,
    HeadroomConfig, 
    ClusterLimit, 
    CpuLimit,
    NodeDownscalerConfig,
    EmptyNodesConfig,
    EvictorConfig
)

# Placeholder: Assume cluster_id is obtained from another resource
cluster_id = "your-cluster-id"

# Using Pydantic models for autoscaler configuration
autoscaler_config = AutoscalerConfig(
    cluster_id=cluster_id,
    enabled=True,
    is_scoped_mode=False,
    unschedulable_pods=[
        UnschedulablePodsConfig(
            enabled=True,
            headroom=[
                HeadroomConfig(
                    enabled=True,
                    cpu_percentage=10,
                    memory_percentage=10
                )
            ]
        )
    ],
    cluster_limits=[
        ClusterLimit(
            enabled=True,
            cpu=[
                CpuLimit(
                    min_cores=1,
                    max_cores=50
                )
            ]
        )
    ],
    node_downscaler=[
        NodeDownscalerConfig(
            enabled=True,
            empty_nodes=[
                EmptyNodesConfig(
                    enabled=True,
                    delay_seconds=180
                )
            ],
            evictor=[
                EvictorConfig(
                    enabled=True
                )
            ]
        )
    ]
)

# Convert Pydantic model to arguments dictionary
autoscaler_args = autoscaler_config.dict(exclude_none=True)

# Create autoscaler settings resource
autoscaler_settings = castai.Autoscaler("example-py-autoscaler", **autoscaler_args)

# Export the ID
pulumi.export("autoscaler_py_resource_id", autoscaler_settings.id) 