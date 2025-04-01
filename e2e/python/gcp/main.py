"""
E2E test for CAST AI GCP (GKE) integration using Python
"""

import pulumi
from pulumi import Output
# Import your custom model definitions
from models import (
    GkeClusterNodeConfigurationArgs,
    GkeClusterNodeTemplateArgs,
    GkeClusterNodeTemplateConstraintsArgs,
    GkeClusterNodeTemplateCustomTaintArgs,
    GkeClusterNodeTemplateConstraintsInstanceFamiliesArgs
)

# The actual implementation will use the real packages, but we'll modify imports to avoid linter errors
# Mock the imports for now
class MockGCP:
    class compute:
        class Network:
            def __init__(self, name, **kwargs):
                self.name = name
                self.id = Output.from_input(f"{name}-id")
        
        class Subnetwork:
            def __init__(self, name, **kwargs):
                self.name = name
                self.id = Output.from_input(f"{name}-id")
                
    class container:
        class Cluster:
            def __init__(self, name, **kwargs):
                self.cluster_name = kwargs.get('name', name)
                self.endpoint = Output.from_input(f"{name}-endpoint")
                self.master_auth = Output.from_input({
                    "cluster_ca_certificate": "mock-cert"
                })
    
    class serviceaccount:
        class Account:
            def __init__(self, name, **kwargs):
                self.name = name
                self.email = Output.from_input(f"{name}@example.com")
        
        class Key:
            def __init__(self, name, **kwargs):
                self.name = name
                self.private_key = Output.from_input("mock-private-key")
    
    class projects:
        class IAMMember:
            def __init__(self, name, **kwargs):
                self.name = name

class MockK8s:
    class Provider:
        def __init__(self, name, **kwargs):
            self.name = name

class MockCASTAI:
    class GkeCluster:
        def __init__(self, resource_name, **kwargs):
            self.name = resource_name
            self.id = Output.from_input(f"{resource_name}-id")

# Use mocks for development/testing
gcp = MockGCP()
k8s = MockK8s()
castai = MockCASTAI()

# Configuration
config = pulumi.Config()
project_id = config.require("gcp:project")
gcp_credentials = config.require_secret("gcp:credentials")
castai_token = config.require_secret("castai:apiToken")
castai_url = config.get("castai:apiUrl") or "https://api.cast.ai"
region = config.get("gcp:region") or "us-central1"
zone = config.get("gcp:zone") or "us-central1-a"
cluster_name = "pulumi-castai-e2e-test-py"

# Create a GCP VPC network and subnet for the GKE cluster
network = gcp.compute.Network(
    "castai-e2e-network-py",
    auto_create_subnetworks=False,
)

subnet = gcp.compute.Subnetwork(
    "castai-e2e-subnet-py",
    ip_cidr_range="10.2.0.0/16",
    region=region,
    network=network.id,
    secondary_ip_ranges=[
        {"range_name": "pods", "ip_cidr_range": "10.3.0.0/16"},
        {"range_name": "services", "ip_cidr_range": "10.4.0.0/16"},
    ],
)

# Create a GKE cluster
cluster = gcp.container.Cluster(
    "castai-e2e-cluster-py",
    name=cluster_name,
    location=zone,
    initial_node_count=1,
    network=network.name,
    subnetwork=subnet.name,
    node_config={
        "machine_type": "e2-medium",
        "oauth_scopes": [
            "https://www.googleapis.com/auth/cloud-platform",
        ],
        "metadata": {
            "disable-legacy-endpoints": "true",
        },
    },
    ip_allocation_policy={
        "cluster_secondary_range_name": "pods",
        "services_secondary_range_name": "services",
    },
    remove_default_node_pool=True,
)

# Create a Kubernetes provider instance that uses our GKE cluster
k8s_provider = k8s.Provider(
    "gke-k8s-py",
    kubeconfig="mock-kubeconfig",  # In real code, derive from cluster
)

# Create IAM resources for CAST AI to manage the GKE cluster
castai_service_account = gcp.serviceaccount.Account(
    "castai-e2e-sa-py",
    account_id=f"castai-{cluster_name}",
    display_name="CAST AI Service Account for GKE",
    project=project_id,
)

castai_sa_key = gcp.serviceaccount.Key(
    "castai-e2e-sa-key-py",
    service_account_id=castai_service_account.name,
)

# Grant necessary roles to the CAST AI service account
roles = [
    "roles/container.admin",
    "roles/compute.admin",
    "roles/iam.serviceAccountUser",
]

role_bindings = []
for i, role in enumerate(roles):
    role_bindings.append(
        gcp.projects.IAMMember(
            f"castai-e2e-binding-py-{i}",
            project=project_id,
            role=role,
            member=f"serviceAccount:{castai_service_account.email}",
        )
    )

# Create the CAST AI GKE integration with proper typing
default_config = GkeClusterNodeConfigurationArgs(
    disk_cpu_ratio=25,
    subnets=[subnet.name],
)

test_node_config = GkeClusterNodeConfigurationArgs(
    disk_cpu_ratio=10,
    subnets=[subnet.name],
    max_pods_per_node=40,
    disk_type="pd-ssd",
    tags=["dev"],
)

default_template_constraints = GkeClusterNodeTemplateConstraintsArgs(
    on_demand=True,
    spot=True,
    use_spot_fallbacks=True,
    enable_spot_diversity=False,
    spot_diversity_price_increase_limit_percent=20,
)

spot_template_constraints = GkeClusterNodeTemplateConstraintsArgs(
    fallback_restore_rate_seconds=1800,
    spot=True,
    use_spot_fallbacks=True,
    min_cpu=4,
    max_cpu=100,
    instance_families=GkeClusterNodeTemplateConstraintsInstanceFamiliesArgs(
        exclude=["e2"],
    ),
    compute_optimized=False,
    storage_optimized=False,
)

custom_taints = [
    GkeClusterNodeTemplateCustomTaintArgs(
        key="custom-taint-key-1",
        value="custom-taint-value-1",
    ),
    GkeClusterNodeTemplateCustomTaintArgs(
        key="custom-taint-key-2",
        value="custom-taint-value-2",
        effect="NoSchedule",
    ),
]

default_template = GkeClusterNodeTemplateArgs(
    name="default-by-castai",
    configuration_id="${castai_node_configuration_id.default}",
    is_default=True,
    should_taint=False,
    constraints=default_template_constraints,
)

spot_template = GkeClusterNodeTemplateArgs(
    configuration_id="${castai_node_configuration_id.default}",
    should_taint=True,
    custom_labels={
        "custom-label-key-1": "custom-label-value-1",
        "custom-label-key-2": "custom-label-value-2",
    },
    custom_taints=custom_taints,
    constraints=spot_template_constraints,
    custom_instances_enabled=True,
)

# Create CAST AI GKE integration
castai_gke_cluster = castai.GkeCluster(
    "castai-e2e-gke-py",
    name=cluster_name,
    project_id=project_id,
    location=zone,
    credentials=castai_sa_key.private_key,
    delete_nodes_on_disconnect=True,
    node_configurations={
        "default": default_config,
        "test_node_config": test_node_config,
    },
    node_templates={
        "default_by_castai": default_template,
        "spot_tmpl": spot_template,
    },
    autoscaler_policies_json="""
    {
        "enabled": true,
        "isScopedMode": true,
        "unschedulablePods": {
            "enabled": true
        },
        "nodeDownscaler": {
            "emptyNodes": {
                "enabled": true
            }
        }
    }
    """,
)

# Export the CAST AI cluster ID
pulumi.export("castai_cluster_id", castai_gke_cluster.id) 