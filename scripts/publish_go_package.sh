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

# Create go.mod file for the sdk/go directory
echo "Creating go.mod file for sdk/go..."
cat > go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go

go 1.18
EOF

# Create go.mod file for the sdk/go/castai directory
echo "Creating go.mod file for sdk/go/castai..."
mkdir -p castai
cat > castai/go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go/castai

go 1.18
EOF

# Create a README.md file for the sdk/go directory
echo "Creating README.md file for sdk/go..."
cat > README.md << EOF
# CAST AI Pulumi Provider - Go SDK

This package provides Go bindings for the CAST AI Pulumi provider.

## Installation

\`\`\`bash
go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION
\`\`\`

## Usage

Import the SDK in your code:

\`\`\`go
import "github.com/castai/pulumi-castai/sdk/go/castai"
\`\`\`

See the [documentation](https://www.pulumi.com/registry/packages/castai/) for usage examples.
EOF

# Create a README.md file for the sdk/go/castai directory
echo "Creating README.md file for sdk/go/castai..."
cat > castai/README.md << EOF
# CAST AI Pulumi Provider - Go SDK

This package provides Go bindings for the CAST AI Pulumi provider.

## Installation

\`\`\`bash
go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION
\`\`\`

## Usage

Import the SDK in your code:

\`\`\`go
import "github.com/castai/pulumi-castai/sdk/go/castai"
\`\`\`

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

# Run go mod tidy for the main module
go mod tidy || echo "Warning: go mod tidy failed for the main module, but we'll continue"

# Run go mod tidy for the castai module
cd castai
go mod tidy || echo "Warning: go mod tidy failed for the castai module, but we'll continue"

# Return to the sdk/go directory
cd ..

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

  # Create a special tag for the Go SDK
  if git rev-parse "sdk/go/castai/v$VERSION" >/dev/null 2>&1; then
    echo "Tag sdk/go/castai/v$VERSION already exists. Using existing tag."
  else
    echo "Creating special tag sdk/go/castai/v$VERSION for Go SDK..."
    # Configure git user for the tag
    git config --local user.email "github-actions@github.com" || git config user.email "github-actions@github.com"
    git config --local user.name "GitHub Actions" || git config user.name "GitHub Actions"
    # Create and push the tag
    git tag -a "sdk/go/castai/v$VERSION" -m "Go SDK v$VERSION"
    git push origin "sdk/go/castai/v$VERSION"
    echo "Special tag created and pushed."
  fi

  # Also create a v0.1.73 tag in the sdk/go/castai directory as an alternative approach
  echo "Creating an alternative tag format..."
  # Save current directory
  CURRENT_DIR=$(pwd)
  # Change to the sdk/go/castai directory
  if [ -d "sdk/go/castai" ]; then
    cd sdk/go/castai
    # Create a tag in this directory
    if git rev-parse "v$VERSION" >/dev/null 2>&1; then
      echo "Tag v$VERSION already exists. Using existing tag."
    else
      echo "Creating tag v$VERSION in sdk/go/castai directory..."
      git tag -a "v$VERSION" -m "Go SDK v$VERSION"
      git push origin "v$VERSION"
      echo "Alternative tag created and pushed."
    fi
    # Return to original directory
    cd "$CURRENT_DIR"
  else
    echo "Warning: sdk/go/castai directory does not exist. Skipping alternative tag creation."
  fi

  # Trigger pkg.go.dev to index the new version
  echo "Triggering pkg.go.dev to index the new version..."
  echo "Note: This may fail if the repository is not yet public, which is expected."
  GOPROXY=https://proxy.golang.org GO111MODULE=on go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION || echo "Failed to trigger pkg.go.dev indexing, but this is expected if the repository is not yet public."

  echo "Go package has been published to GitHub."
  echo "Users can install it with: go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"
  echo "The package should be available at: https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"
  echo "Note: It may take a few minutes for pkg.go.dev to index the new version."
else
  echo "Version v$VERSION already exists in Go package registry. Skipping publish."
fi
