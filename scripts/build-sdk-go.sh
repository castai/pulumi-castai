#!/usr/bin/env bash
# Usage: ./scripts/build-sdk-go.sh <VERSION>

VERSION="$1"

if [ -z "$VERSION" ]; then
  echo "Error: VERSION argument is required."
  exit 1
fi

echo "Using manually created schema..."
echo "Building Go SDK only for version ${VERSION}..."
rm -rf sdk/go
# Assuming pulumi-tfgen-castai is in the PATH or ./bin and GO is set correctly
# Explicitly setting GO path based on install-all-deps.sh logic
GO=/usr/local/go/bin/go ./bin/pulumi-tfgen-castai go --out sdk/go/
echo "Go SDK built successfully in sdk/go/"
echo "To use: Add this to your go.mod file:"
echo "    require github.com/cast-ai/pulumi-castai/sdk/go v${VERSION}"
echo "    replace github.com/cast-ai/pulumi-castai/sdk/go => /path/to/pulumi-castai/sdk/go" 