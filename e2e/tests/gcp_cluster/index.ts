import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";
import * as castai from "@castai/pulumi-castai";

// Configuration
const config = new pulumi.Config();
const projectId = config.require("gcp:project");
const gcpCredentials = config.requireSecret("gcp:credentials");
const castaiToken = config.requireSecret("castai:apiToken");
const castaiUrl = config.get("castai:apiUrl") || "https://api.cast.ai";
const region = config.get("gcp:region") || "us-central1";
const zone = config.get("gcp:zone") || "us-central1-a";
const clusterName = "pulumi-castai-e2e-test";

// Create a GCP VPC network and subnet for the GKE cluster
const network = new gcp.compute.Network("castai-e2e-network", {
    autoCreateSubnetworks: false,
});

const subnet = new gcp.compute.Subnetwork("castai-e2e-subnet", {
    ipCidrRange: "10.2.0.0/16",
    region: region,
    network: network.id,
    secondaryIpRanges: [
        {
            rangeName: "pods",
            ipCidrRange: "10.3.0.0/16",
        },
        {
            rangeName: "services",
            ipCidrRange: "10.4.0.0/16",
        },
    ],
});

// Create a GKE cluster
const cluster = new gcp.container.Cluster("castai-e2e-cluster", {
    name: clusterName,
    location: zone,
    initialNodeCount: 1,
    network: network.name,
    subnetwork: subnet.name,
    nodeConfig: {
        machineType: "e2-medium",
        oauthScopes: [
            "https://www.googleapis.com/auth/cloud-platform",
        ],
        metadata: {
            "disable-legacy-endpoints": "true",
        },
    },
    ipAllocationPolicy: {
        clusterSecondaryRangeName: "pods",
        servicesSecondaryRangeName: "services",
    },
    removableDefaultNodePool: true,
});

// Create a Kubernetes provider instance that uses our GKE cluster
const k8sProvider = new k8s.Provider("gke-k8s", {
    kubeconfig: pulumi.interpolate`apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: ${cluster.masterAuth.clusterCaCertificate}
    server: https://${cluster.endpoint}
  name: ${cluster.name}
contexts:
- context:
    cluster: ${cluster.name}
    user: ${cluster.name}
  name: ${cluster.name}
current-context: ${cluster.name}
kind: Config
preferences: {}
users:
- name: ${cluster.name}
  user:
    auth-provider:
      config:
        cmd-args: config config-helper --format=json
        cmd-path: gcloud
        expiry-key: '{.credential.token_expiry}'
        token-key: '{.credential.access_token}'
      name: gcp
`,
});

// Create IAM resources for CAST AI to manage the GKE cluster
const castaiServiceAccount = new gcp.serviceaccount.Account("castai-e2e-sa", {
    accountId: pulumi.interpolate`castai-${clusterName}`,
    displayName: "CAST AI Service Account for GKE",
    project: projectId,
});

const castaiSaKey = new gcp.serviceaccount.Key("castai-e2e-sa-key", {
    serviceAccountId: castaiServiceAccount.name,
});

// Grant necessary roles to the CAST AI service account
const roles = [
    "roles/container.admin",
    "roles/compute.admin",
    "roles/iam.serviceAccountUser",
];

const roleBindings = roles.map((role, i) => {
    return new gcp.projects.IAMMember(`castai-e2e-binding-${i}`, {
        project: projectId,
        role: role,
        member: pulumi.interpolate`serviceAccount:${castaiServiceAccount.email}`,
    });
});

// Create the CAST AI GKE integration
const castaiGkeCluster = new castai.GkeCluster("castai-e2e-gke", {
    name: clusterName,
    projectId: projectId,
    location: zone, 
    credentials: castaiSaKey.privateKey,
    deleteNodesOnDisconnect: true,
    nodeConfigurations: {
        default: {
            diskCpuRatio: 25,
            subnets: [subnet.name],
        },
        testNodeConfig: {
            diskCpuRatio: 10,
            subnets: [subnet.name],
            maxPodsPerNode: 40,
            diskType: "pd-ssd",
            tags: ["dev"],
        }
    },
    nodeTemplates: {
        defaultByCastai: {
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
        spotTmpl: {
            configurationId: "${castai_node_configuration_id.default}",
            shouldTaint: true,
            customLabels: {
                "custom-label-key-1": "custom-label-value-1",
                "custom-label-key-2": "custom-label-value-2",
            },
            customTaints: [
                {
                    key: "custom-taint-key-1",
                    value: "custom-taint-value-1",
                },
                {
                    key: "custom-taint-key-2",
                    value: "custom-taint-value-2",
                    effect: "NoSchedule",
                },
            ],
            constraints: {
                fallbackRestoreRateSeconds: 1800,
                spot: true,
                useSpotFallbacks: true,
                minCpu: 4,
                maxCpu: 100,
                instanceFamilies: {
                    exclude: ["e2"],
                },
                computeOptimized: false,
                storageOptimized: false,
            },
            customInstancesEnabled: true,
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
export const castaiClusterId = castaiGkeCluster.id; 