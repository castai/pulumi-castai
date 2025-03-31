#!/usr/bin/env bash
# Usage: ./scripts/verify-plugin.sh <VERSION>

VERSION="$1"

if [ -z "$VERSION" ]; then
  echo "Error: VERSION argument is required."
  exit 1
fi

echo "Verifying plugin installation for version ${VERSION}..."
plugin_dir="$HOME/.pulumi/plugins/resource-castai-v${VERSION}"
mkdir -p "${plugin_dir}/"

if [ -f "${plugin_dir}/pulumi-resource-castai" ] && [ -f "${plugin_dir}/PulumiPlugin.yaml" ]; then \
    echo "✅ Plugin is correctly installed"
    cat "${plugin_dir}/PulumiPlugin.yaml"
else \
    echo "❌ Plugin is not correctly installed"
    echo "Attempting to install provider again via 'just install-provider'..."
    # Assuming 'just' is available in the PATH and can be called from the script
    # Note: This might have context issues depending on how just is run.
    # Consider replacing with the direct command if 'just install-provider' doesn't work here.
    just install-provider
fi 