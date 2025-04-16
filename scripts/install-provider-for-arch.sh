#!/usr/bin/env bash
# Usage: ./scripts/install-provider-for-arch.sh <VERSION> <GOOS> <GOARCH>
# Example: ./scripts/install-provider-for-arch.sh 0.1.13 darwin arm64

set -e

VERSION="$1"
GOOS="$2"
GOARCH="$3"

if [ -z "$VERSION" ] || [ -z "$GOOS" ] || [ -z "$GOARCH" ]; then
  echo "Error: VERSION, GOOS, and GOARCH arguments are required."
  echo "Usage: $0 <VERSION> <GOOS> <GOARCH>"
  exit 1
fi

# Set binary extension for Windows
BINARY_EXT=""
if [ "$GOOS" = "windows" ]; then
  BINARY_EXT=".exe"
fi

# Check if we need to build the binary first
if [ ! -f "bin/pulumi-resource-castai${BINARY_EXT}" ]; then
  echo "Binary not found, building it first..."
  ./scripts/build-provider-binary.sh "$VERSION" "$GOOS" "$GOARCH"
fi

# Create the plugin directory
PLUGIN_DIR="$HOME/.pulumi/plugins/resource-castai-${VERSION}"
mkdir -p "$PLUGIN_DIR"

# Copy the binary to the plugin directory
cp "bin/pulumi-resource-castai${BINARY_EXT}" "$PLUGIN_DIR/"

# Create the PulumiPlugin.yaml file
cat > "$PLUGIN_DIR/PulumiPlugin.yaml" << EOF
resource: true
name: castai
version: ${VERSION}
server: pulumi-resource-castai${BINARY_EXT}
EOF

echo "Provider installed successfully for $GOOS-$GOARCH at $PLUGIN_DIR"
echo "PulumiPlugin.yaml has been created."
