#!/bin/bash
set -ex

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

# Create go.mod file if it doesn't exist
if [ ! -f "go.mod" ]; then
  echo "Creating go.mod file..."
  cat > go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go

go 1.18

require (
	github.com/blang/semver v3.5.1+incompatible
	github.com/pulumi/pulumi/sdk/v3 v3.60.0
)
EOF

  # Initialize the Go module
  go mod tidy
fi

# Update the version in go.mod
sed -i "s/module github.com\/castai\/pulumi-castai\/sdk\/go.*/module github.com\/castai\/pulumi-castai\/sdk\/go\n\ngo 1.18/g" go.mod

# Create a temporary README.md file if it doesn't exist
if [ ! -f "README.md" ]; then
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
fi

# Check if this version already exists in Go package registry
echo "Checking if Go package version v$VERSION already exists..."
if curl -s "https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION" | grep -q "404 page not found"; then
  echo "Version v$VERSION does not exist in Go package registry. Publishing..."

  # Create a git tag for the Go SDK
  cd ../.. # Go back to the root directory

  # Check if the tag already exists
  if git rev-parse "v$VERSION" >/dev/null 2>&1; then
    echo "Tag v$VERSION already exists. Using existing tag."
  else
    echo "Creating tag v$VERSION..."
    git tag "v$VERSION"
    git push origin "v$VERSION"
  fi

  # Trigger pkg.go.dev to index the new version
  echo "Triggering pkg.go.dev to index the new version..."
  GOPROXY=https://proxy.golang.org GO111MODULE=on go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION

  echo "Go package has been published to GitHub."
  echo "Users can install it with: go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"
  echo "The package should be available at: https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"
  echo "Note: It may take a few minutes for pkg.go.dev to index the new version."
else
  echo "Version v$VERSION already exists in Go package registry. Skipping publish."
fi
