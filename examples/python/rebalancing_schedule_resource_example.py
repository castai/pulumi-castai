"""
CAST AI Rebalancing Schedule Example for Python

This example demonstrates how to create a rebalancing schedule in CAST AI.
"""

import pulumi
import pulumi_castai as castai
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

# Pydantic models for Rebalancing Schedule
class ScheduleArgs(BaseModel):
    """Configuration for the schedule's cron expression."""
    cron: str

class TriggerConditionsArgs(BaseModel):
    """Conditions that trigger the rebalancing."""
    savings_percentage: int

class ExecutionConditionsArgs(BaseModel):
    """Conditions for execution of the rebalancing."""
    enabled: bool
    achieved_savings_percentage: Optional[int] = None

class LaunchConfigurationArgs(BaseModel):
    """Configuration for the rebalancing launch."""
    node_ttl_seconds: int
    num_targeted_nodes: int
    rebalancing_min_nodes: Optional[int] = None
    keep_drain_timeout_nodes: Optional[bool] = None
    selector: str  # JSON string
    execution_conditions: ExecutionConditionsArgs

class RebalancingScheduleModel(BaseModel):
    """Full configuration for a rebalancing schedule."""
    name: str
    schedule: ScheduleArgs
    trigger_conditions: TriggerConditionsArgs
    launch_configuration: LaunchConfigurationArgs

# Create the rebalancing schedule model
spot_schedule_model = RebalancingScheduleModel(
    name="rebalance-py-spots-hourly",
    schedule=ScheduleArgs(
        cron="0 * * * *",  # Every hour at minute 0
    ),
    trigger_conditions=TriggerConditionsArgs(
        savings_percentage=15,  # Trigger if potential savings > 15%
    ),
    launch_configuration=LaunchConfigurationArgs(
        node_ttl_seconds=600,  # Only consider nodes older than 10 minutes
        num_targeted_nodes=5,  # Target up to 5 nodes per run
        # rebalancing_min_nodes=2,  # Optional: Minimum nodes to keep
        # keep_drain_timeout_nodes=False,  # Optional
        selector=json.dumps({  # Node selector as a JSON string
            "nodeSelectorTerms": [{
                "matchExpressions": [{
                    "key": "scheduling.cast.ai/spot",
                    "operator": "Exists",
                }],
            }],
        }),
        execution_conditions=ExecutionConditionsArgs(
            enabled=True,
            # achieved_savings_percentage=5,  # Optional: Only execute if savings > 5%
        ),
    )
)

# Convert the model to a dictionary
schedule_args = spot_schedule_model.dict(exclude_none=True)

# Create the rebalancing schedule resource
try:
    # Use the direct RebalancingSchedule type
    spot_schedule = castai.RebalancingSchedule(
        "example-py-spot-schedule",
        **schedule_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )
    
    # Export the schedule ID
    pulumi.export("spot_schedule_py_id", spot_schedule.id)
except Exception as e:
    pulumi.log.warn(f"Failed to create rebalancing schedule: {str(e)}")
    # Export the configuration as demonstration
    pulumi.export("rebalancing_schedule_config", schedule_args)
    pulumi.export("provider_configured", True) 