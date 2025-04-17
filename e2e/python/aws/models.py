"""
Pydantic models for CAST AI AWS EKS integration
"""
from typing import List, Dict, Optional, Any, Union
from pydantic import BaseModel

class EksClusterNodeConfigurationArgs(BaseModel):
    """Arguments for EKS cluster node configuration"""
    subnets: List[str]
    security_groups: List[str]
    instance_profile_arn: str
    tags: Optional[Dict[str, str]] = None

class EksClusterNodeTemplateConstraintsInstanceFamiliesArgs(BaseModel):
    """Arguments for EKS cluster node template constraints instance families"""
    exclude: List[str]

class EksClusterNodeTemplateConstraintsArgs(BaseModel):
    """Arguments for EKS cluster node template constraints"""
    on_demand: Optional[bool] = None
    spot: Optional[bool] = None
    use_spot_fallbacks: Optional[bool] = None
    enable_spot_diversity: Optional[bool] = None
    spot_diversity_price_increase_limit_percent: Optional[int] = None
    fallback_restore_rate_seconds: Optional[int] = None
    min_cpu: Optional[int] = None
    max_cpu: Optional[int] = None
    instance_families: Optional[EksClusterNodeTemplateConstraintsInstanceFamiliesArgs] = None

class EksClusterNodeTemplateArgs(BaseModel):
    """Arguments for EKS cluster node template"""
    name: Optional[str] = None
    configuration_id: str
    is_default: Optional[bool] = None
    should_taint: Optional[bool] = None
    constraints: Optional[EksClusterNodeTemplateConstraintsArgs] = None 