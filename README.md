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
   git clone https://github.com/cast-ai/pulumi-castai.git
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
   require github.com/cast-ai/pulumi-castai/sdk/go v0.0.0
   replace github.com/cast-ai/pulumi-castai/sdk/go => /path/to/pulumi-castai/sdk/go
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

### Python Example

```python
import pulumi
from pulumi_castai import Provider, gcp

# Create a CAST AI provider instance
castai_provider = Provider("castai-provider",
    api_token="your-castai-api-token", # Or omit to use CASTAI_API_TOKEN env var
    api_url="https://api.cast.ai"      # Optional
)

# Register an existing GKE cluster with CAST AI
gke_cluster = gcp.GkeCluster("my-gke-cluster",
    project_id="my-gcp-project",
    location="us-central1-a",
    name="my-gke-cluster",
    credentials_json="...", # Optional: GCP credentials JSON
    opts=pulumi.ResourceOptions(provider=castai_provider)
)

# Export the cluster ID
pulumi.export("cluster_id", gke_cluster.id)
```

### TypeScript Example

```bash
cd examples/typescript
npm install
pulumi stack init dev
pulumi up
```

### Go Examples

```bash
cd examples/go
go mod tidy
pulumi stack init dev
pulumi up
```

## Available Resources

The CAST AI provider supports the following resources:

- AWS EKS clusters: `castai.aws.EksCluster`
- GCP GKE clusters: `castai.gcp.GkeCluster` 
- Azure AKS clusters: `castai.azure.AksCluster`
- Autoscaling: `castai.autoscaling.Autoscaler`
- Node Configuration: `castai.nodeconfig.NodeConfiguration`
- Rebalancing: `castai.rebalancing.RebalancingSchedule`, `castai.rebalancing.RebalancingJob`
- Organization Management: `castai.organization.*`

For a complete list of resources and data sources, see the [API documentation](https://www.pulumi.com/registry/packages/castai/).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Version Management

The provider version is centralized in a single `version.txt` file at the root of the repository. This is the source of truth for the version across the entire project.

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

## License

This project is licensed under the Apache 2.0 License.

## Troubleshooting

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
go get -u github.com/cast-ai/pulumi-castai/sdk/go
```