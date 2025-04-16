#!/usr/bin/env bash
# Usage: ./scripts/build-provider-binary.sh <VERSION> <GOOS> <GOARCH>
# Example: ./scripts/build-provider-binary.sh 0.1.13 darwin arm64

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

echo "Building provider binary for $GOOS-$GOARCH (version $VERSION)..."

# Fix version placeholder in resources.go and version.go
echo "Fixing version placeholders..."
find ./provider -type f -name "*.go" -exec sed -i 's/__VERSION__/'$VERSION'/g' {} \;

# Run go mod tidy in the provider directory first
cd provider && go mod tidy

# Build the provider with cross-compilation
echo "Building provider for $GOOS-$GOARCH..."
cd cmd/pulumi-resource-castai && \
GOOS=$GOOS GOARCH=$GOARCH go build -o $(pwd)/../../../bin/pulumi-resource-castai${BINARY_EXT} \
-ldflags "-X github.com/cast-ai/pulumi-castai/provider/pkg/version.Version=${VERSION}"

cd ../../../

# Create release asset
mkdir -p release/
FILENAME="pulumi-resource-castai-v${VERSION}-${GOOS}-${GOARCH}"

# For Windows, use zip instead of tar
if [ "$GOOS" = "windows" ]; then
  zip -j "release/${FILENAME}.zip" "bin/pulumi-resource-castai${BINARY_EXT}"
  echo "Created release asset: ${FILENAME}.zip"
else
  tar -czf "release/${FILENAME}.tar.gz" -C bin "pulumi-resource-castai${BINARY_EXT}"
  echo "Created release asset: ${FILENAME}.tar.gz"
fi

echo "Build completed successfully!"
