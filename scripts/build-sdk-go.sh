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

# Create go.mod file
echo "Creating go.mod file..."
cat > sdk/go/go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go

go 1.18
EOF

# Create a castai subdirectory if it doesn't exist
echo "Creating castai subdirectory..."
mkdir -p sdk/go/castai

# Create a doc.go file in the castai directory
echo "Creating doc.go file..."
cat > sdk/go/castai/doc.go << EOF
// Package castai provides a Pulumi Go SDK for creating and managing CAST AI cloud resources.
//
// This package is meant for use with the Pulumi resource manager in order to
// provision CAST AI cloud resources.
//
// To use this package, you need to have a CAST AI account and API key.
// See https://docs.cast.ai/ for more information.
package castai
EOF

# Run go mod tidy to generate go.sum files
echo "Running go mod tidy in sdk/go..."
cd sdk/go
go mod tidy

echo "Running go mod tidy in sdk/go/castai..."
cd castai
go mod tidy

# Return to the original directory
cd ../../..

# Create README.md file
echo "Creating README.md file..."
cat > sdk/go/README.md << EOF
# CAST AI Pulumi Provider - Go SDK

This package provides Go bindings for the CAST AI Pulumi provider.

## Installation

\`\`\`bash
go get github.com/castai/pulumi-castai/sdk/go/castai@v${VERSION}
\`\`\`

## Usage

See the [documentation](https://www.pulumi.com/registry/packages/castai/) for usage examples.
EOF

echo "Go SDK built successfully in sdk/go/"
echo "To use: Add this to your go.mod file:"
echo "    require github.com/castai/pulumi-castai/sdk/go v${VERSION}"
echo "    replace github.com/castai/pulumi-castai/sdk/go => /path/to/pulumi-castai/sdk/go"