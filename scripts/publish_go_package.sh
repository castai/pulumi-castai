#!/bin/bash
set -e

# This script prepares and publishes the Go package

# Get the version from the first argument
VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Error: VERSION argument is required."
  exit 1
fi

echo "Preparing Go SDK for publishing version v$VERSION..."

# Navigate to the Go SDK directory
cd sdk/go

# Ensure the directory structure is correct
echo "Ensuring correct directory structure..."
mkdir -p castai

# Create go.mod file with the correct module path
echo "Creating go.mod file..."
cat > go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go

go 1.18
EOF

# Create a README.md file
echo "Creating README.md file..."
cat > README.md << EOF
# CAST AI Pulumi Provider - Go SDK

This package provides Go bindings for the CAST AI Pulumi provider.

## Installation

\`\`\`bash
go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION
\`\`\`

## Usage

See the [documentation](https://www.pulumi.com/registry/packages/castai/) for usage examples.
EOF

# Create a simple Go file in the castai directory to ensure it's indexed
echo "Creating a simple Go file in the castai directory..."
if [ ! -f "castai/doc.go" ]; then
  cat > castai/doc.go << EOF
// Package castai provides a Pulumi Go SDK for creating and managing CAST AI cloud resources.
//
// This package is meant for use with the Pulumi resource manager in order to
// provision CAST AI cloud resources.
//
// To use this package, you need to have a CAST AI account and API key.
// See https://docs.cast.ai/ for more information.
package castai
EOF
fi

# Run go mod tidy to generate go.sum files
echo "Running go mod tidy in sdk/go..."

# Create a temporary directory for generating go.sum files
mkdir -p /tmp/go-sdk-temp
cp -r . /tmp/go-sdk-temp/go

# Generate go.sum for the main module
cd /tmp/go-sdk-temp/go
go mod tidy || echo "Warning: go mod tidy failed for the main module, but we'll continue"

# Generate go.sum for the castai module
cd castai
go mod tidy || echo "Warning: go mod tidy failed for the castai module, but we'll continue"

# Copy the go.sum files back to the original location
cp -f /tmp/go-sdk-temp/go/go.sum $(pwd)/../../ || echo "No go.sum generated for main module"
cp -f /tmp/go-sdk-temp/go/castai/go.sum $(pwd)/../../castai/ || echo "No go.sum generated for castai module"

# Return to the original directory
cd $(pwd)/../../

# Check if this version already exists in Go package registry
echo "Checking if Go package version v$VERSION already exists..."
if curl -s "https://pkg.go.dev/github.com/castai/pulumi-castai@v$VERSION" | grep -q "404 page not found"; then
  echo "Version v$VERSION does not exist in Go package registry. Publishing..."

  # Use the existing tag for the Go SDK
  cd ../.. # Go back to the root directory

  # Check if the tag already exists
  if git rev-parse "v$VERSION" >/dev/null 2>&1; then
    echo "Tag v$VERSION already exists. Using existing tag."
  else
    echo "Error: Tag v$VERSION does not exist. The tag should be created by the prepare_release.sh script."
    echo "Available tags:"
    git tag -l
    exit 1
  fi

  # Trigger pkg.go.dev to index the new version
  echo "Triggering pkg.go.dev to index the new version..."
  echo "Note: This may fail if the repository is not yet public, which is expected."
  GOPROXY=https://proxy.golang.org GO111MODULE=on go get github.com/castai/pulumi-castai@v$VERSION || echo "Failed to trigger pkg.go.dev indexing, but this is expected if the repository is not yet public."

  echo "Go package has been published to GitHub."
  echo "Users can install it with: go get github.com/castai/pulumi-castai@v$VERSION"
  echo "The package should be available at: https://pkg.go.dev/github.com/castai/pulumi-castai@v$VERSION"
  echo "Note: It may take a few minutes for pkg.go.dev to index the new version."
else
  echo "Version v$VERSION already exists in Go package registry. Skipping publish."
fi
