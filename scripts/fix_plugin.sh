#!/bin/bash
set -e

# Get version from parameter or version.txt
if [ "$1" == "" ]; then
    VERSION=$(cat version.txt | tr -d '\n')
    echo "Using version $VERSION from version.txt"
else
    VERSION=$1
    echo "Using provided version $VERSION"
fi

echo "Creating Pulumi plugin metadata for CAST AI provider version $VERSION"

# Create the necessary PulumiPlugin.yaml file
mkdir -p ~/.pulumi/plugins/resource-castai-v${VERSION}/
cat > ~/.pulumi/plugins/resource-castai-v${VERSION}/PulumiPlugin.yaml << EOF
resource: true
name: castai
version: ${VERSION}
server: pulumi-resource-castai
EOF

echo "Plugin metadata created at ~/.pulumi/plugins/resource-castai-v${VERSION}/PulumiPlugin.yaml"

# Check if the binary exists
if [ -f "./bin/pulumi-resource-castai" ]; then
    echo "Copying provider binary to plugin directory"
    cp ./bin/pulumi-resource-castai ~/.pulumi/plugins/resource-castai-v${VERSION}/
    echo "Plugin setup complete!"
else
    echo "WARNING: Provider binary not found at ./bin/pulumi-resource-castai"
    echo "You need to build the provider first with 'make provider'"
    echo "Then copy it manually to ~/.pulumi/plugins/resource-castai-v${VERSION}/"
fi 