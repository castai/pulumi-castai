import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai"; // Use your actual package name
import * as aws from "@pulumi/aws"; // Used for EKS example specifics
import { Buffer } from "buffer"; // Node.js Buffer for base64 encoding

// Placeholder: Assume these IDs/values are obtained from other resources or config
const clusterId = "your-cluster-id";
const subnetIds = ["subnet-12345abc", "subnet-67890def"]; // Example subnet IDs
const instanceProfileArn = "arn:aws:iam::123456789012:instance-profile/YourProfile"; // Example EKS profile ARN
const securityGroupIds = ["sg-12345abc"]; // Example EKS SG ID

const initScript = `#!/bin/bash
echo "Hello from Pulumi-managed node!"
# Add other initialization commands here
`;

const dockerConfig = JSON.stringify({
    "insecure-registries": ["my-registry.local:5000"],
    "max-concurrent-downloads": 10,
});

const kubeletConfig = JSON.stringify({
    "registryBurst": 20,
    "registryPullQPS": 10,
});

// Create a Node Configuration
const nodeConfig = new castai.NodeConfiguration("example-ts-node-config", {
    name: "default-ts-config",
    clusterId: clusterId,
    diskCpuRatio: 35,
    // minDiskSize: 133, // Optional
    subnets: subnetIds,
    initScript: Buffer.from(initScript).toString("base64"),
    dockerConfig: dockerConfig,
    kubeletConfig: kubeletConfig,
    containerRuntime: "containerd", // Or dockerd
    tags: {
        "provisioner": "castai-pulumi",
        "environment": "dev",
    },
    // Cloud-specific settings (EKS example)
    eks: {
        instanceProfileArn: instanceProfileArn,
        // dnsClusterIp: "10.100.0.10", // Optional
        securityGroups: securityGroupIds,
    },
    // Other cloud providers (gke, aks) would have their own blocks
});

// Set the created configuration as the default for the cluster
const defaultConfig = new castai.NodeConfigurationDefault("example-ts-default-config", {
    clusterId: clusterId,
    configurationId: nodeConfig.id,
});

// Export the configuration ID
export const nodeConfigurationId = nodeConfig.id;
// Export the ID of the default setting resource (might not be very useful itself)
export const defaultConfigResourceId = defaultConfig.id; 