# Pulumi CASTAI Provider

This repository contains the Pulumi provider for CAST AI, enabling developers to use CAST AI resources in their Pulumi infrastructure.

## Overview

The Pulumi CASTAI provider allows users to interact with CAST AI resources using the Pulumi Infrastructure as Code framework. This provider is built on top of the Pulumi Terraform bridge, which transforms the existing CAST AI Terraform provider into a native Pulumi package.

## Prerequisites

- [Pulumi CLI](https://www.pulumi.com/docs/install/)
- [Go 1.18 or later](https://golang.org/doc/install)
- [Node.js 14 or later](https://nodejs.org/en/download/) (for TypeScript SDK)
- [Python 3.7 or later](https://www.python.org/downloads/) (for Python SDK)
- [CAST AI API Token](https://cast.ai/docs/api/) - Get this from your CAST AI account

## Installation

### Building from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/castai/pulumi-castai.git
   cd pulumi-castai
   ```

2. Build the provider and SDKs (this automatically installs the provider with proper metadata):
   ```bash
   make provider       # Build the provider binary
   make build_sdks     # Build all SDKs
   make install_provider  # Install the provider locally with PulumiPlugin.yaml
   ```

3. Choose your preferred language SDK:

   **For Python:**
   ```bash
   pip install -e ./sdk/python/
   ```

   **For TypeScript/JavaScript:**
   ```bash
   yarn link ./sdk/nodejs/
   # OR in your project:
   npm install ../path/to/pulumi-castai/sdk/nodejs
   ```

   **For Go:**
   ```bash
   # Add this to your go.mod file:
   require github.com/castai/pulumi-castai v0.0.0
   replace github.com/castai/pulumi-castai => /path/to/pulumi-castai

   # Then import the SDK in your code:
   # import "github.com/castai/pulumi-castai/sdk/go/castai"
   ```

   For published versions, use:
   ```bash
   go get github.com/castai/pulumi-castai@v0.1.71
   ```

   Then import the SDK in your code:
   ```go
   import "github.com/castai/pulumi-castai"
   ```

### Quick Installation for Testing

To quickly install just the provider plugin:

```bash
# Install the plugin binary
pulumi plugin install resource castai v$(cat version.txt) -f /path/to/pulumi-castai/bin/pulumi-resource-castai

# Create the necessary PulumiPlugin.yaml file
mkdir -p ~/.pulumi/plugins/resource-castai-v$(cat version.txt)/
cat > ~/.pulumi/plugins/resource-castai-v$(cat version.txt)/PulumiPlugin.yaml << EOF
resource: true
name: castai
version: $(cat version.txt)
server: pulumi-resource-castai
EOF
```

## Configuration

Set up your CAST AI credentials:

```bash
# Set your CAST AI API token
export CASTAI_API_TOKEN=your_api_token_here

# Optional: Set a custom API URL (defaults to https://api.cast.ai)
export CASTAI_API_URL=https://api.cast.ai
```

## Using the Provider

The CAST AI provider allows you to connect your Kubernetes clusters to CAST AI for cost optimization and management. We provide examples for connecting GKE, EKS, and AKS clusters in TypeScript, Python, and Go.

### Running the Examples

We provide a set of `just` commands to run the examples:

```bash
# Set up your environment
just clean && just dev

# Run TypeScript examples
just run-typescript-gcp-example
just run-typescript-aws-example
just run-typescript-azure-example

# Run Python examples
just run-python-gcp-example
just run-python-aws-example
just run-python-azure-example

# Run Go examples
just run-go-gcp-example
just run-go-aws-example
just run-go-azure-example

# Run all examples for a specific language
just run-typescript-examples
just run-python-examples
just run-go-examples

# Run all examples
just run-all-language-examples
```

### Python Example

```python
import pulumi
import os
from pulumi_castai import Provider, GkeCluster

# Initialize the CAST AI provider
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider = Provider("castai-provider", api_token=api_token)

# Get GCP values from environment variables or use defaults
project_id = os.environ.get("GCP_PROJECT_ID", "my-gcp-project-id")
cluster_name = os.environ.get("GKE_CLUSTER_NAME", "cast_ai_test_cluster")

# Create a connection to a GKE cluster
gke_cluster = GkeCluster("gke-cluster-connection",
    project_id=project_id,           # GCP project ID
    location="us-central1",          # GCP location
    name=cluster_name,               # GKE cluster name
    delete_nodes_on_disconnect=True, # Remove nodes on disconnect
    opts=pulumi.ResourceOptions(provider=provider)
)

# Export the cluster ID
pulumi.export("cluster_id", gke_cluster.id)
```

### TypeScript Example

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";

// Get GCP project ID from environment variable or use a default value
const projectId = process.env.GCP_PROJECT_ID || "my-gcp-project-id";

// Get GKE cluster name from environment variable or use a default value
const clusterName = process.env.GKE_CLUSTER_NAME || "cast_ai_test_cluster";

// Initialize the CAST AI provider
const provider = new castai.Provider("castai-provider", {
    apiToken: process.env.CASTAI_API_TOKEN,
    apiUrl: process.env.CASTAI_API_URL || "https://api.cast.ai",
});

// Create a connection to a GKE cluster
const gkeCluster = new castai.GkeCluster("gke-cluster-connection", {
    projectId: projectId,              // GCP project ID
    location: "us-central1",           // GCP location
    name: clusterName,                 // GKE cluster name
    deleteNodesOnDisconnect: true,     // Remove nodes on disconnect
}, { provider });

// Export the cluster ID
export const clusterId = gkeCluster.id;
```

### Go Example

```go
package main

import (
	"os"

	"github.com/castai/pulumi-castai"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Initialize the provider
		provider, err := castai.NewProvider(ctx, "castai-provider", &castai.ProviderArgs{
			ApiToken: pulumi.String(os.Getenv("CASTAI_API_TOKEN")),
		})
		if err != nil {
			return err
		}

		// Get GCP project ID from environment variable or use a default value
		projectID := os.Getenv("GCP_PROJECT_ID")
		if projectID == "" {
			projectID = "my-gcp-project-id"
		}

		// Get GKE cluster name from environment variable or use a default value
		clusterName := os.Getenv("GKE_CLUSTER_NAME")
		if clusterName == "" {
			clusterName = "cast_ai_test_cluster"
		}

		// Create a connection to a GKE cluster
		gkeArgs := &castai.GkeClusterArgs{
			ProjectId:              pulumi.String(projectID),
			Location:               pulumi.String("us-central1"),
			Name:                   pulumi.String(clusterName),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
		}

		gkeCluster, err := castai.NewGkeCluster(ctx, "gke-cluster-connection", gkeArgs, pulumi.Provider(provider))
		if err != nil {
			return err
		}

		// Export the cluster ID
		ctx.Export("clusterId", gkeCluster.ID())

		return nil
	})
}
```

## Available Resources

The CAST AI provider supports the following resources:

### Cloud Provider Resources
- AWS EKS clusters: `castai:aws:EksCluster`
- GCP GKE clusters: `castai:gcp:GkeCluster`
- Azure AKS clusters: `castai:azure:AksCluster`

### Core Resources
- Cluster: `castai:index:Cluster`
- Credentials: `castai:index:Credentials`
- Cluster Token: `castai:index:ClusterToken`

### Autoscaling Resources
- Autoscaler: `castai:autoscaling:Autoscaler`

### Organization Resources
- Service Account: `castai:organization:ServiceAccount`
- Service Account Key: `castai:organization:ServiceAccountKey`

For a complete list of resources and data sources, see the [CAST AI Terraform Provider documentation](https://registry.terraform.io/providers/castai/castai/latest/docs).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Version Management

The provider version is centralized in a single `version.txt` file at the root of the repository. This is the source of truth for the version across the entire project.

### Updating the Version

To update the version:

```bash
# Update to version 0.2.0
./update-version.sh 0.2.0

# Rebuild the provider and SDKs with the new version
make clean && make dev
```

This will ensure the version is consistent across:
- Provider binary
- SDK packages
- Generated schemas
- Documentation
- Plugin metadata

### Releasing a New Version

To prepare and release a new version:

1. Update the version in `version.txt` to the desired version (e.g., `0.1.29`)
2. Run the prepare_release.sh script:

```bash
# For a real release:
./scripts/prepare_release.sh

# To test the script without making any changes (dry run):
./scripts/prepare_release.sh --dry-run

# To skip build steps (useful if you're having build issues):
./scripts/prepare_release.sh --skip-build

# You can combine options:
./scripts/prepare_release.sh --dry-run --skip-build
```

The script will:
1. Commit all changes
2. Push the changes to the repository
3. Create a tag
4. Ask if you want to push the tag now to trigger the release pipeline

**IMPORTANT**: The script ensures that code changes are pushed BEFORE the tag to ensure the pipeline has access to the latest code.

The GitHub workflow will then handle the publishing process, including:
- Building the provider for all supported architectures
- Publishing the SDKs to their respective package managers
- Creating a GitHub release with the provider binaries
- Triggering pkg.go.dev indexing for the Go SDK

For more details, see the [scripts/README.md](scripts/README.md) file.

## License

This project is licensed under the Apache 2.0 License.

## Troubleshooting

### Running End-to-End Tests

To test the provider with real cloud resources, you can use the provided examples. Make sure you have the necessary credentials for the cloud provider you want to test:

```bash
# Set up your environment
just clean && just dev

# Run the TypeScript GCP example
just run-typescript-gcp-example

# Run the Python AWS example
just run-python-aws-example

# Run the Go Azure example
just run-go-azure-example
```

Note that these examples require actual cloud resources to exist. If you see an error like `no cluster found for name "cast_ai_test_cluster"`, it means the provider is working correctly but the cluster doesn't exist in your cloud account.

### Missing PulumiPlugin.yaml

If you encounter an error like `failed to load plugin: loading PulumiPlugin.yaml: no such file or directory`, run the provided fix script:

```bash
./fix_plugin.sh
```

Or create the file manually:

```bash
# Get the version from version.txt
VERSION=$(cat version.txt)

# Create the file for the current version
mkdir -p ~/.pulumi/plugins/resource-castai-v${VERSION}
echo "resource: true" > ~/.pulumi/plugins/resource-castai-v${VERSION}/PulumiPlugin.yaml
echo "name: castai" >> ~/.pulumi/plugins/resource-castai-v${VERSION}/PulumiPlugin.yaml
echo "version: ${VERSION}" >> ~/.pulumi/plugins/resource-castai-v${VERSION}/PulumiPlugin.yaml
echo "server: pulumi-resource-castai" >> ~/.pulumi/plugins/resource-castai-v${VERSION}/PulumiPlugin.yaml

# Copy the provider binary
cp /path/to/pulumi-castai/bin/pulumi-resource-castai ~/.pulumi/plugins/resource-castai-v${VERSION}/
```

### Namespace or Module Not Found

If you encounter errors about missing namespaces (like `castai.gcp` not found), ensure you're using the version of the SDK that includes proper namespaces:

```bash
# For TypeScript:
npm update @pulumi/castai

# For Python:
pip install --upgrade pulumi_castai

# For Go:
go get -u github.com/castai/pulumi-castai@latest
```

### Stuck or Hanging Operations

If a Pulumi operation seems to be stuck or hanging, it might be because:

1. The provider is waiting for a response from the CAST AI API
2. There's a lock on the stack from a previous run
3. The cluster specified in your environment variables doesn't exist or isn't accessible

To fix this:

```bash
# Cancel the current operation
pulumi cancel

# Remove any locks
find ~/.pulumi/locks -name "*.json" | xargs rm -f

# Remove the stack and start fresh
pulumi stack rm <stack-name> --force --yes
```

### Agent Installation Modes

The CAST AI provider supports two modes for the agent installation:

1. **Read-only mode**: The CAST AI agent only collects information about the cluster but doesn't make any changes. This is useful for initial assessment and security scanning.

2. **Full-access mode**: The CAST AI agent can both collect information and make changes to the cluster (like scaling nodes). This is the default mode and enables all CAST AI features.

You can specify the mode when connecting your cluster:

```typescript
const gkeCluster = new castai.GkeCluster("gke-cluster-connection", {
    // ... other properties
    agentMode: "read-only",  // or "full-access"
    installAgent: true,      // set to false to skip agent installation
});
```

### Common Error Messages

#### "No cluster found for name"

If you see an error like `persistent error: no cluster found for name "cast_ai_test_cluster"`, it means that CAST AI cannot find the cluster specified in your environment variables. Make sure:

1. The cluster exists in your cloud provider account
2. The credentials provided have access to the cluster
3. The cluster name is correct

For example, if you're using GKE, make sure the cluster exists in the GCP project specified by `GCP_PROJECT_ID` and the cluster name matches `GKE_CLUSTER_NAME`.

#### "Failed to install CAST AI agent"

If you see a warning like `WARNING: Failed to install CAST AI agent`, it means the provider was able to register the cluster with CAST AI but couldn't install the agent. This could be due to:

1. Helm is not installed or not in the PATH
2. The Kubernetes cluster is not accessible from the machine running Pulumi
3. The Kubernetes credentials are not properly configured

You can still install the agent manually using the Helm chart:

```bash
helm repo add castai-helm https://castai.github.io/helm-charts
helm repo update
helm install castai-agent castai-helm/castai-agent \
  --namespace castai-agent \
  --create-namespace \
  --set apiKey=<your-castai-api-token> \
  --set clusterID=<your-cluster-id> \
  --set readOnlyMode=true  # for read-only mode
```

#### Missing CAST AI Agent Namespace

After connecting your cluster to CAST AI, you need to install the CAST AI agent Helm chart to create the namespace and deploy the agent. The Pulumi provider only registers the cluster with CAST AI, but doesn't install the agent.

To install the CAST AI agent, run the following commands:

```bash
# Add the CAST AI Helm repository
helm repo add castai-helm https://castai.github.io/helm-charts
helm repo update

# Install the CAST AI agent
helm install castai-agent castai-helm/castai-agent \
  --namespace castai-agent \
  --create-namespace \
  --set apiKey=<your-castai-api-token> \
  --set clusterID=<your-cluster-id>
```

Replace `<your-castai-api-token>` with your CAST AI API token and `<your-cluster-id>` with the cluster ID returned by the Pulumi provider.