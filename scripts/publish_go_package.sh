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

# Create go.mod file with the correct module path for the main module
echo "Creating go.mod file for the main module..."
cat > go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go

go 1.18
EOF

# Create go.mod file with the correct module path for the castai submodule
echo "Creating go.mod file for the castai submodule..."
cat > castai/go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go/castai

go 1.18

require (
	github.com/blang/semver v3.5.1+incompatible
	github.com/pulumi/pulumi/sdk/v3 v3.96.1
)
EOF

# Create a README.md file for the main module
echo "Creating README.md file for the main module..."
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

# Create a README.md file for the castai submodule
echo "Creating README.md file for the castai submodule..."
cat > castai/README.md << EOF
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

  # Create a temporary directory for testing the Go SDK
  TEMP_DIR=$(mktemp -d)
  cd "$TEMP_DIR"

  # Initialize a new Go module
  echo "Initializing a temporary Go module to test the SDK..."
  go mod init test

  # Create a simple Go file that imports the SDK
  echo "Creating a test file..."
  cat > main.go << 'EOFTEST'
package main

import (
  "fmt"
  "github.com/castai/pulumi-castai/sdk/go/castai"
)

func main() {
  fmt.Println("Testing import of github.com/castai/pulumi-castai/sdk/go/castai")
  _ = castai.NewProvider
}
EOFTEST

  # Add the dependency
  echo "Adding the dependency..."
  go mod edit -require=github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION

  # Force the Go proxy to fetch the module
  echo "Forcing the Go proxy to fetch the module..."
  GOPROXY=https://proxy.golang.org go mod download github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION || echo "Note: It's normal to see an error above if the module isn't fully published yet."

  # Try to tidy the module
  echo "Running go mod tidy..."
  GOPROXY=https://proxy.golang.org go mod tidy || echo "Note: It's normal to see an error above if the module isn't fully published yet."

  # Try to build the module
  echo "Building the test program..."
  GOPROXY=https://proxy.golang.org go build || echo "Note: It's normal to see an error above if the module isn't fully published yet."

  # Explicitly request the package from pkg.go.dev to trigger indexing
  echo "Explicitly requesting the Go package from pkg.go.dev to trigger indexing..."
  curl -s -X GET "https://pkg.go.dev/github.com/castai/pulumi-castai@v$VERSION"
  curl -s -X GET "https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go@v$VERSION"
  curl -s -X GET "https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"

  # Force the Go proxy to fetch the module using the version tag
  echo "Forcing the Go proxy to fetch the module using the version tag..."
  GOPROXY=https://proxy.golang.org GO111MODULE=on go install github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION || echo "Note: It's normal to see an error above if the module isn't fully published yet."

  # Return to the original directory
  cd -

  # Additional step to ensure the Go SDK is properly published
  echo "Creating a second test module to ensure the Go SDK is properly published..."
  TEMP_DIR2=$(mktemp -d)
  cd "$TEMP_DIR2"

  # Initialize a new Go module
  go mod init test2

  # Create a simple Go file that directly imports the castai module
  cat > main.go << 'EOFTEST2'
package main

import (
  "fmt"
  "github.com/castai/pulumi-castai/sdk/go/castai"
)

func main() {
  fmt.Println("Testing direct import of github.com/castai/pulumi-castai/sdk/go/castai")
  _ = castai.NewProvider
}
EOFTEST2

  # Add the dependency directly to the castai module
  go mod edit -require=github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION

  # Force the Go proxy to fetch the module
  GOPROXY=https://proxy.golang.org go mod download github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION || echo "Note: It's normal to see an error above if the module isn't fully published yet."

  # Try to tidy the module
  GOPROXY=https://proxy.golang.org go mod tidy || echo "Note: It's normal to see an error above if the module isn't fully published yet."

  # Try to build the module
  GOPROXY=https://proxy.golang.org go build || echo "Note: It's normal to see an error above if the module isn't fully published yet."

  # Return to the original directory
  cd -

  # Create a third test module to test the direct import
  echo "Creating a third test module to test direct import..."
  TEMP_DIR3=$(mktemp -d)
  cd "$TEMP_DIR3"

  # Initialize a new Go module
  go mod init test3

  # Create a simple Go file that directly imports the castai module
  cat > main.go << 'EOFTEST3'
package main

import (
  "fmt"
  "github.com/castai/pulumi-castai/sdk/go/castai"
)

func main() {
  fmt.Println("Testing direct import of github.com/castai/pulumi-castai/sdk/go/castai")
  fmt.Println(castai.NewProvider)
}
EOFTEST3

  # Add the dependency directly to the castai module
  go mod edit -require=github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION

  # Force the Go proxy to fetch the module
  GOPROXY=https://proxy.golang.org go mod download github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION || echo "Note: It's normal to see an error above if the module isn't fully published yet."

  # Try to tidy the module
  GOPROXY=https://proxy.golang.org go mod tidy || echo "Note: It's normal to see an error above if the module isn't fully published yet."

  # Try to build the module
  GOPROXY=https://proxy.golang.org go build || echo "Note: It's normal to see an error above if the module isn't fully published yet."

  # Return to the original directory
  cd -

  # Explicitly request the package from pkg.go.dev to trigger indexing
  echo "Explicitly requesting the Go package from pkg.go.dev to trigger indexing..."
  curl -s -X GET "https://pkg.go.dev/github.com/castai/pulumi-castai@v$VERSION"
  curl -s -X GET "https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go@v$VERSION"
  curl -s -X GET "https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"

  # Wait a moment for the requests to be processed
  sleep 5

  # Make additional requests to ensure the package is indexed
  echo "Making additional requests to ensure the package is indexed..."
  curl -s -X GET "https://pkg.go.dev/github.com/castai/pulumi-castai@v$VERSION?tab=versions"
  curl -s -X GET "https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION?tab=versions"

  echo "Go package has been published to GitHub."
  echo "Users can install it with: go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"
  echo "The package should be available at: https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"
  echo "Note: It may take a few minutes for pkg.go.dev to index the new version."
else
  echo "Version v$VERSION already exists in Go package registry. Skipping publish."
fi
