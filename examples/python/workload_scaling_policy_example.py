"""
CAST AI Workload Scaling Policy Example for Python
This example demonstrates how to configure workload scaling policies for a CAST AI cluster.
"""

import pulumi
import pulumi_castai as castai
import os
from models import (
    Provider as ProviderModel,
    ScalingPolicy,
    NamespaceSelector,
    ScalingPolicyMetric, 
    MetricThreshold,
    VerticalScaling,
    VerticalScalingVpa,
    VerticalScalingVpaMinAllowed,
    VerticalScalingVpaMaxAllowed,
    HorizontalScaling,
    HorizontalScalingHpa,
    HorizontalScalingHpaBehavior,
    HorizontalScalingHpaBehaviorScaleDown,
    HorizontalScalingHpaBehaviorScaleUp,
    HorizontalScalingHpaBehaviorPolicy
)

# Initialize the CAST AI provider
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider_config = ProviderModel(api_token=api_token)
provider = castai.Provider("castai-provider",
    api_token=provider_config.api_token,
    api_url=provider_config.api_url
)

# Placeholder: Assume cluster_id is obtained from an existing cluster resource
# e.g., eks_cluster = castai.aws.EksCluster(...)
# cluster_id = eks_cluster.id
cluster_id = "your-cluster-id" # Replace with a valid cluster ID

# Create a workload scaling policy using Pydantic models
scaling_policy_config = ScalingPolicy(
    cluster_id=cluster_id,
    name="web-services-py-scaling",
    enabled=True,
    namespace_selector=NamespaceSelector(
        match_labels={
            "environment": "production"
        }
    ),
    metrics=[
        ScalingPolicyMetric(
            type="cpu",
            weight=70,
            stable_window="5m",
            threshold=MetricThreshold(
                utilization_percentage=80
            )
        ),
        ScalingPolicyMetric(
            type="memory",
            weight=30,
            stable_window="5m",
            threshold=MetricThreshold(
                utilization_percentage=75
            )
        ),
    ],
    vertical_scaling=VerticalScaling(
        enabled=True,
        vpa=VerticalScalingVpa(
            update_mode="Auto",
            min_allowed=VerticalScalingVpaMinAllowed(
                cpu="100m",
                memory="128Mi"
            ),
            max_allowed=VerticalScalingVpaMaxAllowed(
                cpu="4",
                memory="8Gi"
            ),
            controlled_resources=["cpu", "memory"]
        )
    ),
    horizontal_scaling=HorizontalScaling(
        enabled=True,
        hpa=HorizontalScalingHpa(
            min_replicas=2,
            max_replicas=10,
            behavior=HorizontalScalingHpaBehavior(
                scale_down=HorizontalScalingHpaBehaviorScaleDown(
                    stabilization_window_seconds=300,
                    policies=[
                        HorizontalScalingHpaBehaviorPolicy(
                            type="Percent",
                            value=10,
                            period_seconds=60
                        )
                    ]
                ),
                scale_up=HorizontalScalingHpaBehaviorScaleUp(
                    stabilization_window_seconds=0,
                    policies=[
                        HorizontalScalingHpaBehaviorPolicy(
                            type="Percent",
                            value=100,
                            period_seconds=15
                        )
                    ]
                )
            )
        )
    )
)

# Convert Pydantic model to arguments dictionary
scaling_policy_args = scaling_policy_config.dict(exclude_none=True)

# Create the scaling policy resource using the direct type
scaling_policy = castai.ScalingPolicy(
    "example-py-scaling-policy",
    **scaling_policy_args,
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the policy ID
pulumi.export("policy_py_id", scaling_policy.id) 