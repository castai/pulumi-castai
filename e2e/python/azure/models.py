"""
Pydantic models for CAST AI Azure AKS integration
"""
from typing import List, Dict, Optional, Any, Union
from pydantic import BaseModel

class AksClusterNodeConfigurationArgs(BaseModel):
    """Arguments for AKS cluster node configuration"""
    subnet_id: str
    vm_sizes: List[str]
    tags: Optional[Dict[str, str]] = None

class AksClusterNodeTemplateConstraintsArgs(BaseModel):
    """Arguments for AKS cluster node template constraints"""
    on_demand: Optional[bool] = None
    spot: Optional[bool] = None
    use_spot_fallbacks: Optional[bool] = None
    enable_spot_diversity: Optional[bool] = None
    spot_diversity_price_increase_limit_percent: Optional[int] = None
    min_cpu: Optional[int] = None
    max_cpu: Optional[int] = None

class AksClusterNodeTemplateArgs(BaseModel):
    """Arguments for AKS cluster node template"""
    name: Optional[str] = None
    configuration_id: str
    is_default: Optional[bool] = None
    should_taint: Optional[bool] = None
    constraints: Optional[AksClusterNodeTemplateConstraintsArgs] = None 