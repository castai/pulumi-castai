"""
Pydantic models for CAST AI GCP integration
"""
from typing import List, Dict, Optional, Any, Union
from pydantic import BaseModel

class GkeClusterNodeConfigurationArgs(BaseModel):
    """Arguments for GKE cluster node configuration"""
    disk_cpu_ratio: int
    subnets: List[str]
    max_pods_per_node: Optional[int] = None
    disk_type: Optional[str] = None
    tags: Optional[List[str]] = None

class GkeClusterNodeTemplateConstraintsInstanceFamiliesArgs(BaseModel):
    """Arguments for GKE cluster node template constraints instance families"""
    exclude: List[str]

class GkeClusterNodeTemplateConstraintsArgs(BaseModel):
    """Arguments for GKE cluster node template constraints"""
    on_demand: Optional[bool] = None
    spot: Optional[bool] = None
    use_spot_fallbacks: Optional[bool] = None
    enable_spot_diversity: Optional[bool] = None
    spot_diversity_price_increase_limit_percent: Optional[int] = None
    fallback_restore_rate_seconds: Optional[int] = None
    min_cpu: Optional[int] = None
    max_cpu: Optional[int] = None
    instance_families: Optional[GkeClusterNodeTemplateConstraintsInstanceFamiliesArgs] = None
    compute_optimized: Optional[bool] = None
    storage_optimized: Optional[bool] = None

class GkeClusterNodeTemplateCustomTaintArgs(BaseModel):
    """Arguments for GKE cluster node template custom taint"""
    key: str
    value: str
    effect: Optional[str] = None

class GkeClusterNodeTemplateArgs(BaseModel):
    """Arguments for GKE cluster node template"""
    name: Optional[str] = None
    configuration_id: str
    is_default: Optional[bool] = None
    should_taint: Optional[bool] = None
    constraints: Optional[GkeClusterNodeTemplateConstraintsArgs] = None
    custom_labels: Optional[Dict[str, str]] = None
    custom_taints: Optional[List[GkeClusterNodeTemplateCustomTaintArgs]] = None
    custom_instances_enabled: Optional[bool] = None 