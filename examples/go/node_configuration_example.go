package main

import (
	"encoding/base64"
	"encoding/json"

	"github.com/castai/pulumi-castai/sdk/go/castai" // Assuming main package
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runNodeConfigurationExample demonstrates node configuration.
// Renamed from main to avoid conflicts.
func runNodeConfigurationExample(ctx *pulumi.Context) error {
	// Placeholder: Assume these IDs/values are obtained from other resources or config
	clusterId := pulumi.String("your-cluster-id")
	subnetIds := pulumi.StringArray{pulumi.String("subnet-12345abc"), pulumi.String("subnet-67890def")} // Example subnet IDs
	instanceProfileArn := pulumi.String("arn:aws:iam::123456789012:instance-profile/YourProfile")       // Example EKS profile ARN
	securityGroupIds := pulumi.StringArray{pulumi.String("sg-12345abc")}                                // Example EKS SG ID

	initScript := `#!/bin/bash
echo "Hello from Pulumi-managed node!"
# Add other initialization commands here
`
	initScriptBase64 := base64.StdEncoding.EncodeToString([]byte(initScript))

	dockerConfigJSON, _ := json.Marshal(map[string]interface{}{
		"insecure-registries":      []string{"my-registry.local:5000"},
		"max-concurrent-downloads": 10,
	})

	kubeletConfigJSON, _ := json.Marshal(map[string]interface{}{
		"registryBurst":   20,
		"registryPullQPS": 10,
	})

	// Create a Node Configuration
	nodeConfig, err := castai.NewNodeConfiguration(ctx, "example-go-node-config", &castai.NodeConfigurationArgs{
		Name:         pulumi.String("default-go-config"),
		ClusterId:    clusterId,
		DiskCpuRatio: pulumi.Int(35),
		// MinDiskSize:      pulumi.Int(133), // Optional
		Subnets:          subnetIds,
		InitScript:       pulumi.String(initScriptBase64),
		DockerConfig:     pulumi.String(string(dockerConfigJSON)),
		KubeletConfig:    pulumi.String(string(kubeletConfigJSON)),
		ContainerRuntime: pulumi.String("containerd"), // Or dockerd
		Tags: pulumi.StringMap{
			"provisioner": pulumi.String("castai-pulumi"),
			"environment": pulumi.String("dev"),
		},
		// Cloud-specific settings (EKS example)
		Eks: &castai.NodeConfigurationEksArgs{
			InstanceProfileArn: instanceProfileArn,
			// DnsClusterIp:       pulumi.String("10.100.0.10"), // Optional
			SecurityGroups: securityGroupIds,
		},
		// Other cloud providers (gke, aks) would have their own blocks
	})
	if err != nil {
		return err
	}

	// Set the created configuration as the default for the cluster
	defaultConfig, err := castai.NewNodeConfigurationDefault(ctx, "example-go-default-config", &castai.NodeConfigurationDefaultArgs{
		ClusterId:       clusterId,
		ConfigurationId: nodeConfig.ID(),
	})
	if err != nil {
		return err
	}

	// Export the configuration ID
	ctx.Export("node_configuration_go_id", nodeConfig.ID())
	// Export the ID of the default setting resource
	ctx.Export("default_config_go_resource_id", defaultConfig.ID())

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runNodeConfigurationExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
