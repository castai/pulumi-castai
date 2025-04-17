#!/bin/bash
set -e

# This script builds the provider and tfgen binaries directly
# It's a simplified version of the Makefile targets

# Get the version from version.txt
VERSION=$(cat version.txt | tr -d '\n')
echo "Using version from version.txt: $VERSION"

# Create bin directory if it doesn't exist
mkdir -p bin

# Update version.go with the correct version
echo "Updating version.go with version $VERSION..."
sed -i.bak "s/__VERSION__/$VERSION/g" provider/pkg/version/version.go && rm -f provider/pkg/version/version.go.bak
echo "✅ Updated version.go"

# Build the provider binary
echo "Building provider binary..."
cd provider/cmd/pulumi-resource-castai
go build -o ../../../bin/pulumi-resource-castai -ldflags "-X github.com/castai/pulumi-castai/provider/pkg/version.Version=$VERSION"
cd ../../..
echo "✅ Provider binary built"

# Build the tfgen binary
echo "Building tfgen binary..."
cd provider/cmd/pulumi-tfgen-castai
go build -o ../../../bin/pulumi-tfgen-castai -ldflags "-X github.com/castai/pulumi-castai/provider/pkg/version.Version=$VERSION"
cd ../../..
echo "✅ tfgen binary built"

echo "Build completed successfully!"
