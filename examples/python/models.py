from typing import Dict, List, Optional, Union, Literal
from pydantic import BaseModel, Field


class Provider(BaseModel):
    """Pydantic model for CAST AI provider configuration."""
    api_token: str
    api_url: Optional[str] = "https://api.cast.ai"


# Common models
class Tag(BaseModel):
    """Model for resource tags."""
    key: str 
    value: str


# EKS specific models
class EksClusterConfig(BaseModel):
    """Configuration for connecting an AWS EKS cluster to CAST AI."""
    account_id: str = Field(..., description="AWS account ID")
    region: str = Field(..., description="AWS region")
    eks_cluster_name: str = Field(..., description="Name of the EKS cluster")
    delete_nodes_on_disconnect: bool = Field(False, description="Whether to delete nodes on disconnect")
    assume_role_arn: Optional[str] = Field(None, description="ARN of the role to assume")
    tags: Optional[Dict[str, str]] = Field(None, description="Resource tags")


# GCP specific models
class GkeClusterConfig(BaseModel):
    """Configuration for connecting a GCP GKE cluster to CAST AI."""
    project_id: str = Field(..., description="GCP project ID")
    location: str = Field(..., description="GCP location")
    cluster_name: str = Field(..., description="Name of the GKE cluster")
    delete_nodes_on_disconnect: bool = Field(False, description="Whether to delete nodes on disconnect")
    tags: Optional[Dict[str, str]] = Field(None, description="Resource tags")


# Azure specific models
class AksClusterConfig(BaseModel):
    """Configuration for connecting an Azure AKS cluster to CAST AI."""
    tenant_id: str = Field(..., description="Azure tenant ID")
    subscription_id: str = Field(..., description="Azure subscription ID")
    resource_group_name: str = Field(..., description="Azure resource group name")
    cluster_name: str = Field(..., description="Name of the AKS cluster")
    delete_nodes_on_disconnect: bool = Field(False, description="Whether to delete nodes on disconnect")
    tags: Optional[Dict[str, str]] = Field(None, description="Resource tags")


# Autoscaler models
class HeadroomConfig(BaseModel):
    """Configuration for autoscaler headroom."""
    enabled: bool = True
    cpu_percentage: Optional[int] = 10
    memory_percentage: Optional[int] = 10


class UnschedulablePodsConfig(BaseModel):
    """Configuration for unschedulable pods in autoscaler."""
    enabled: bool = True
    headroom: List[HeadroomConfig]


class CpuLimit(BaseModel):
    """CPU limits for autoscaler."""
    min_cores: int
    max_cores: int


class ClusterLimit(BaseModel):
    """Cluster limits for autoscaler."""
    enabled: bool = True
    cpu: List[CpuLimit]


class EmptyNodesConfig(BaseModel):
    """Configuration for empty nodes in autoscaler."""
    enabled: bool = True
    delay_seconds: int = 180


class EvictorConfig(BaseModel):
    """Configuration for evictor in autoscaler."""
    enabled: bool = True


class NodeDownscalerConfig(BaseModel):
    """Configuration for node downscaler in autoscaler."""
    enabled: bool = True
    empty_nodes: List[EmptyNodesConfig]
    evictor: List[EvictorConfig]


class AutoscalerConfig(BaseModel):
    """Configuration for CAST AI autoscaler."""
    cluster_id: str
    enabled: bool = True
    is_scoped_mode: bool = False
    unschedulable_pods: List[UnschedulablePodsConfig]
    cluster_limits: List[ClusterLimit]
    node_downscaler: List[NodeDownscalerConfig]


# Node configuration models
class NodeConfigurationEksArgs(BaseModel):
    """AWS EKS specific node configuration."""
    instance_profile_arn: str
    security_groups: List[str]
    dns_cluster_ip: Optional[str] = None


class NodeConfigurationGkeArgs(BaseModel):
    """GCP GKE specific node configuration."""
    service_account_key: str
    project_id: str


class NodeConfigurationAksArgs(BaseModel):
    """Azure AKS specific node configuration."""
    tenant_id: str
    subscription_id: str
    client_id: str
    client_secret: str


class NodeConfigurationBase(BaseModel):
    """Base configuration for CAST AI nodes."""
    name: str
    cluster_id: str
    disk_cpu_ratio: int = 35
    min_disk_size: Optional[int] = None
    subnets: List[str]
    init_script: Optional[str] = None
    docker_config: Optional[str] = None
    kubelet_config: Optional[str] = None
    container_runtime: Literal["containerd", "dockerd"] = "containerd"
    tags: Optional[Dict[str, str]] = None


class NodeConfiguration(NodeConfigurationBase):
    """Full node configuration including cloud-specific settings."""
    eks: Optional[NodeConfigurationEksArgs] = None
    gke: Optional[NodeConfigurationGkeArgs] = None
    aks: Optional[NodeConfigurationAksArgs] = None


class NodeConfigurationDefault(BaseModel):
    """Configuration to set a node configuration as default."""
    cluster_id: str
    configuration_id: str


# Node template models
class CustomTaint(BaseModel):
    """Custom taint for node templates."""
    key: str
    value: str
    effect: str


class InstanceFamilies(BaseModel):
    """Instance family constraints for node templates."""
    include: Optional[List[str]] = None
    exclude: Optional[List[str]] = None


class NodeTemplateConstraints(BaseModel):
    """Constraints for node templates."""
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


class NodeTemplate(BaseModel):
    """Configuration for CAST AI node templates."""
    cluster_id: str
    name: str
    is_enabled: bool = True
    configuration_id: str
    should_taint: bool = True
    custom_labels: Optional[Dict[str, str]] = None
    custom_taints: Optional[List[CustomTaint]] = None
    constraints: NodeTemplateConstraints
    is_default: Optional[bool] = None


# Workload scaling policy models
class MetricThreshold(BaseModel):
    """Threshold configuration for workload scaling metrics."""
    utilization_percentage: int


class ScalingPolicyMetric(BaseModel):
    """Metric configuration for workload scaling policy."""
    type: str
    weight: int
    stable_window: str
    threshold: MetricThreshold


class VerticalScalingVpaMinAllowed(BaseModel):
    """Minimum allowed resources for VPA."""
    cpu: str
    memory: str


class VerticalScalingVpaMaxAllowed(BaseModel):
    """Maximum allowed resources for VPA."""
    cpu: str
    memory: str


class VerticalScalingVpa(BaseModel):
    """VPA configuration for vertical scaling."""
    update_mode: str
    min_allowed: VerticalScalingVpaMinAllowed
    max_allowed: VerticalScalingVpaMaxAllowed
    controlled_resources: List[str]


class VerticalScaling(BaseModel):
    """Vertical scaling configuration."""
    enabled: bool
    vpa: VerticalScalingVpa


class HorizontalScalingHpaBehaviorPolicy(BaseModel):
    """HPA behavior policy for scaling."""
    type: str
    value: int
    period_seconds: int


class HorizontalScalingHpaBehaviorScaleDown(BaseModel):
    """HPA behavior for scale down."""
    stabilization_window_seconds: int
    policies: List[HorizontalScalingHpaBehaviorPolicy]


class HorizontalScalingHpaBehaviorScaleUp(BaseModel):
    """HPA behavior for scale up."""
    stabilization_window_seconds: int
    policies: List[HorizontalScalingHpaBehaviorPolicy]


class HorizontalScalingHpaBehavior(BaseModel):
    """HPA behavior configuration."""
    scale_down: HorizontalScalingHpaBehaviorScaleDown
    scale_up: HorizontalScalingHpaBehaviorScaleUp


class HorizontalScalingHpa(BaseModel):
    """HPA configuration for horizontal scaling."""
    min_replicas: int
    max_replicas: int
    behavior: HorizontalScalingHpaBehavior


class HorizontalScaling(BaseModel):
    """Horizontal scaling configuration."""
    enabled: bool
    hpa: HorizontalScalingHpa


class NamespaceSelector(BaseModel):
    """Namespace selector for workload scaling policy."""
    match_labels: Dict[str, str]


class ScalingPolicy(BaseModel):
    """Configuration for CAST AI workload scaling policy."""
    cluster_id: str
    name: str
    enabled: bool = True
    namespace_selector: NamespaceSelector
    metrics: List[ScalingPolicyMetric]
    vertical_scaling: VerticalScaling
    horizontal_scaling: HorizontalScaling


# Organization models
class ServiceAccount(BaseModel):
    """Configuration for CAST AI service account."""
    name: str
    description: Optional[str] = None
    roles: List[str]
    ttl: Optional[str] = None


class ServiceAccountKey(BaseModel):
    """Configuration for CAST AI service account key."""
    service_account_id: str
    description: Optional[str] = None


# Rebalancing models
class RebalancingSchedule(BaseModel):
    """Configuration for CAST AI rebalancing schedule."""
    name: str
    cluster_id: str
    enabled: bool = True
    execution_schedule: str
    max_nodes_to_restart_at_a_time: int = 1
    restart_timeout_seconds: int = 300


class RebalancingJob(BaseModel):
    """Configuration for CAST AI rebalancing job."""
    cluster_id: str
    rebalancing_schedule_id: str
    enabled: bool = True


# Evictor advanced configuration
class PodSelector(BaseModel):
    """Pod selector for evictor advanced configuration."""
    kind: Optional[str] = None
    namespace: str
    match_labels: Dict[str, str]


class EvictorAdvancedConfigItem(BaseModel):
    """Configuration item for evictor advanced configuration."""
    pod_selector: PodSelector
    aggressive: bool


class EvictorAdvancedConfig(BaseModel):
    """Configuration for CAST AI evictor advanced configuration."""
    cluster_id: str
    evictor_advanced_config: List[EvictorAdvancedConfigItem]


# Commitment and reservation models
class CommitmentInstance(BaseModel):
    """Instance configuration for commitments."""
    cluster_id: str
    compute_units: int
    start_date: str
    end_date: str


class Commitments(BaseModel):
    """Configuration for CAST AI commitments."""
    name: str
    auto_apply: bool = True
    auto_apply_label: Optional[str] = None
    compute_unit_hourly_rate: float
    instances: List[CommitmentInstance]


class ReservationTaint(BaseModel):
    """Taint configuration for reservations."""
    key: str
    value: str
    effect: str


class ReservationInstance(BaseModel):
    """Instance configuration for reservations."""
    instance_type: str
    provider: str
    zone: str
    spot_instance: bool = False
    count: int
    start_date: str
    end_date: str
    labels: Optional[Dict[str, str]] = None
    taints: Optional[List[ReservationTaint]] = None


class Reservations(BaseModel):
    """Configuration for CAST AI reservations."""
    cluster_id: str
    instances: List[ReservationInstance]
    node_configuration_id: Optional[str] = None 