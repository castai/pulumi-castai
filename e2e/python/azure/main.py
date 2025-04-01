"""
E2E test for CAST AI Azure (AKS) integration using Python
"""

import json
import base64
import pulumi
import pulumi_azure_native as azure
import pulumi_kubernetes as k8s
import pulumi_castai as castai
from pulumi import Output

# Configuration
config = pulumi.Config()
location = config.get("azure:location") or "eastus"
subscription_id = config.require_secret("azure:subscriptionId")
tenant_id = config.require_secret("azure:tenantId")
client_id = config.require_secret("azure:clientId")
client_secret = config.require_secret("azure:clientSecret")
castai_token = config.require_secret("castai:apiToken")
castai_url = config.get("castai:apiUrl") or "https://api.cast.ai"
cluster_name = "pulumi-castai-e2e-test-aks-py"

# Create a resource group for all resources
resource_group = azure.resources.ResourceGroup(
    "castai-e2e-rg-py",
    location=location,
)

# Create a virtual network
vnet = azure.network.VirtualNetwork(
    "castai-e2e-vnet-py",
    resource_group_name=resource_group.name,
    location=resource_group.location,
    address_space=azure.network.AddressSpaceArgs(
        address_prefixes=["10.0.0.0/16"],
    ),
)

# Create a subnet for the AKS cluster
subnet = azure.network.Subnet(
    "castai-e2e-subnet-py",
    resource_group_name=resource_group.name,
    virtual_network_name=vnet.name,
    address_prefix="10.0.0.0/24",
)

# Create an AKS cluster
managed_cluster = azure.containerservice.ManagedCluster(
    "castai-e2e-aks-py",
    resource_group_name=resource_group.name,
    location=resource_group.location,
    agent_pool_profiles=[
        azure.containerservice.ManagedClusterAgentPoolProfileArgs(
            count=1,
            max_pods=110,
            mode="System",
            name="agentpool",
            os_disk_size_gb=30,
            os_type="Linux",
            vm_size="Standard_DS2_v2",
            vnet_subnet_id=subnet.id,
        )
    ],
    dns_prefix=cluster_name,
    enable_rbac=True,
    kubernetes_version="1.27.3",
    network_profile=azure.containerservice.ContainerServiceNetworkProfileArgs(
        network_plugin="azure",
        service_cidr="10.96.0.0/16",
        dns_service_ip="10.96.0.10",
    ),
    identity=azure.containerservice.ManagedClusterIdentityArgs(
        type="SystemAssigned",
    ),
)

# Export kubeconfig
creds = Output.all(
    resource_group.name, managed_cluster.name
).apply(
    lambda args: azure.containerservice.list_managed_cluster_user_credentials(
        resource_group_name=args[0],
        resource_name=args[1],
    )
)

kubeconfig = creds.kubeconfigs[0].value.apply(
    lambda enc: base64.b64decode(enc).decode()
)

# Create a Kubernetes provider instance
k8s_provider = k8s.Provider(
    "k8s-provider-py",
    kubeconfig=kubeconfig,
)

# Create a service principal for CAST AI
castai_sp = azure.authorization.Application(
    "castai-e2e-sp-py",
    display_name="castai-e2e-sp-py",
)

castai_service_principal = azure.authorization.ServicePrincipal(
    "castai-e2e-service-principal-py",
    application_id=castai_sp.application_id,
)

castai_password = azure.authorization.ServicePrincipalPassword(
    "castai-e2e-sp-password-py",
    service_principal_id=castai_service_principal.id,
    end_date="2099-01-01T00:00:00Z",
)

# Grant CAST AI permissions to the cluster
role_assignment = azure.authorization.RoleAssignment(
    "castai-e2e-role-assignment-py",
    principal_id=castai_service_principal.id,
    principal_type="ServicePrincipal",
    role_definition_id="/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",  # Contributor
    scope=Output.concat("/subscriptions/", subscription_id, "/resourceGroups/", resource_group.name),
)

# Get the node resource group name
node_resource_group_name = Output.concat(
    "MC_", resource_group.name, "_", managed_cluster.name, "_", location
)

# Create the CAST AI AKS integration
castai_aks_cluster = castai.AksCluster(
    "castai-e2e-aks-py",
    resource_group_name=resource_group.name,
    cluster_name=managed_cluster.name,
    subscription_id=subscription_id,
    tenant_id=tenant_id,
    client_id=castai_sp.application_id,
    client_secret=castai_password.value,
    location=location,
    delete_nodes_on_disconnect=True,
    node_resource_group_name=node_resource_group_name,
    node_configurations={
        "default": castai.AksClusterNodeConfigurationArgs(
            subnet_id=subnet.id,
            vm_sizes=["Standard_D2s_v3", "Standard_D4s_v3"],
            tags={
                "castai-e2e-test-py": "true",
            },
        ),
    },
    node_templates={
        "default": castai.AksClusterNodeTemplateArgs(
            name="default-by-castai",
            configuration_id="${castai_node_configuration_id.default}",
            is_default=True,
            should_taint=False,
            constraints=castai.AksClusterNodeTemplateConstraintsArgs(
                on_demand=True,
                spot=True,
                use_spot_fallbacks=True,
                enable_spot_diversity=False,
                spot_diversity_price_increase_limit_percent=20,
            ),
        ),
        "spot_template": castai.AksClusterNodeTemplateArgs(
            configuration_id="${castai_node_configuration_id.default}",
            should_taint=True,
            constraints=castai.AksClusterNodeTemplateConstraintsArgs(
                on_demand=False,
                spot=True,
                use_spot_fallbacks=True,
                min_cpu=2,
                max_cpu=8,
            ),
        ),
    },
    autoscaler_policies_json=json.dumps({
        "enabled": True,
        "isScopedMode": True,
        "unschedulablePods": {
            "enabled": True,
        },
        "nodeDownscaler": {
            "emptyNodes": {
                "enabled": True,
            },
        },
    }),
)

# Export the CAST AI cluster ID
pulumi.export("castai_cluster_id", castai_aks_cluster.id) 