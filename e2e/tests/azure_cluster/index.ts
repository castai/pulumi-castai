import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";
import * as k8s from "@pulumi/kubernetes";
import * as castai from "@castai/pulumi-castai";

// Configuration
const config = new pulumi.Config();
const location = config.get("azure:location") || "eastus";
const subscriptionId = config.requireSecret("azure:subscriptionId");
const tenantId = config.requireSecret("azure:tenantId");
const clientId = config.requireSecret("azure:clientId");
const clientSecret = config.requireSecret("azure:clientSecret");
const castaiToken = config.requireSecret("castai:apiToken");
const castaiUrl = config.get("castai:apiUrl") || "https://api.cast.ai";
const clusterName = "pulumi-castai-e2e-test-aks";

// Create a resource group for all resources
const resourceGroup = new azure.resources.ResourceGroup("castai-e2e-rg", {
    location: location,
});

// Create a virtual network
const vnet = new azure.network.VirtualNetwork("castai-e2e-vnet", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    addressSpace: {
        addressPrefixes: ["10.0.0.0/16"],
    },
});

// Create a subnet for the AKS cluster
const subnet = new azure.network.Subnet("castai-e2e-subnet", {
    resourceGroupName: resourceGroup.name,
    virtualNetworkName: vnet.name,
    addressPrefix: "10.0.0.0/24",
});

// Create an AKS cluster
const managedCluster = new azure.containerservice.ManagedCluster("castai-e2e-aks", {
    resourceGroupName: resourceGroup.name,
    location: resourceGroup.location,
    agentPoolProfiles: [{
        count: 1,
        maxPods: 110,
        mode: "System",
        name: "agentpool",
        osDiskSizeGB: 30,
        osType: "Linux",
        vmSize: "Standard_DS2_v2",
        vnetSubnetID: subnet.id,
    }],
    dnsPrefix: clusterName,
    enableRBAC: true,
    kubernetesVersion: "1.27.3",
    networkProfile: {
        networkPlugin: "azure",
        serviceCidr: "10.96.0.0/16",
        dnsServiceIP: "10.96.0.10",
    },
    identity: {
        type: "SystemAssigned",
    },
});

// Export kubeconfig
const creds = pulumi.all([resourceGroup.name, managedCluster.name]).apply(
    ([rgName, clusterName]) => {
        return azure.containerservice.listManagedClusterUserCredentials({
            resourceGroupName: rgName,
            resourceName: clusterName,
        });
    }
);

const kubeconfig = creds.kubeconfigs[0].value.apply(
    enc => Buffer.from(enc, "base64").toString()
);

// Create a Kubernetes provider instance
const k8sProvider = new k8s.Provider("k8s-provider", {
    kubeconfig: kubeconfig,
});

// Create a service principal for CAST AI
const castaiSp = new azure.authorization.Application("castai-e2e-sp", {});

const castaiServicePrincipal = new azure.authorization.ServicePrincipal("castai-e2e-service-principal", {
    applicationId: castaiSp.applicationId,
});

const castaiPassword = new azure.authorization.ServicePrincipalPassword("castai-e2e-sp-password", {
    servicePrincipalId: castaiServicePrincipal.id,
    endDate: "2099-01-01T00:00:00Z",
});

// Grant CAST AI permissions to the cluster
const roleAssignment = new azure.authorization.RoleAssignment("castai-e2e-role-assignment", {
    principalId: castaiServicePrincipal.id,
    principalType: "ServicePrincipal",
    roleDefinitionId: "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c", // Contributor
    scope: pulumi.interpolate`/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup.name}`,
});

// Create the CAST AI AKS integration
const castaiAksCluster = new castai.AksCluster("castai-e2e-aks", {
    resourceGroupName: resourceGroup.name,
    clusterName: managedCluster.name,
    subscriptionId: subscriptionId,
    tenantId: tenantId,
    clientId: castaiSp.applicationId,
    clientSecret: castaiPassword.value,
    location: location,
    deleteNodesOnDisconnect: true,
    nodeResourceGroupName: pulumi.interpolate`MC_${resourceGroup.name}_${managedCluster.name}_${location}`,
    nodeConfigurations: {
        default: {
            subnetId: subnet.id,
            vmSizes: ["Standard_D2s_v3", "Standard_D4s_v3"],
            tags: {
                "castai-e2e-test": "true",
            },
        },
    },
    nodeTemplates: {
        default: {
            name: "default-by-castai",
            configurationId: "${castai_node_configuration_id.default}",
            isDefault: true,
            shouldTaint: false,
            constraints: {
                onDemand: true,
                spot: true,
                useSpotFallbacks: true,
                enableSpotDiversity: false,
                spotDiversityPriceIncreaseLimitPercent: 20,
            },
        },
        spotTemplate: {
            configurationId: "${castai_node_configuration_id.default}",
            shouldTaint: true,
            constraints: {
                onDemand: false,
                spot: true,
                useSpotFallbacks: true,
                minCpu: 2,
                maxCpu: 8,
            },
        },
    },
    autoscalerPoliciesJson: JSON.stringify({
        enabled: true,
        isScopedMode: true,
        unschedulablePods: {
            enabled: true,
        },
        nodeDownscaler: {
            emptyNodes: {
                enabled: true,
            },
        },
    }),
});

// Export the CAST AI cluster ID
export const castaiClusterId = castaiAksCluster.id; 