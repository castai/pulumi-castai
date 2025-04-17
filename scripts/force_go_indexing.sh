#!/bin/bash
set -e

# This script forces pkg.go.dev to index a specific version of the Go SDK

# Get the version from the first argument
VERSION=$1

if [ -z "$VERSION" ]; then
  echo "Error: VERSION argument is required."
  exit 1
fi

echo "Forcing pkg.go.dev to index version v$VERSION..."

# Create a temporary directory for testing the Go module
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Change to the temporary directory
cd $TEMP_DIR

# Create a simple Go module that imports our SDK
echo "Creating a simple Go module that imports our SDK..."
cat > go.mod << EOF
module test

go 1.18

require github.com/castai/pulumi-castai/sdk/go/castai v$VERSION-sdk.go.castai
EOF

# Create a simple Go file that uses our SDK
cat > main.go << EOF
package main

import (
	"fmt"
	"github.com/castai/pulumi-castai/sdk/go/castai"
)

func main() {
	fmt.Println("Testing import of github.com/castai/pulumi-castai/sdk/go/castai")
	_ = castai.NewProvider
}
EOF

# Try multiple approaches to force the Go proxy to index our module
echo "Trying multiple approaches to force the Go proxy to index our module..."

# Approach 1: Use go get with GOPROXY
echo "Approach 1: Using go get with GOPROXY..."
GOPROXY=https://proxy.golang.org GO111MODULE=on go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION-sdk.go.castai || echo "Note: It's normal to see an error above if the module isn't fully published yet."

# Approach 2: Use go mod download
echo "Approach 2: Using go mod download..."
GOPROXY=https://proxy.golang.org go mod download github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION-sdk.go.castai || echo "Note: It's normal to see an error above if the module isn't fully published yet."

# Approach 3: Use go mod tidy
echo "Approach 3: Using go mod tidy..."
GOPROXY=https://proxy.golang.org go mod tidy || echo "Note: It's normal to see an error above if the module isn't fully published yet."

# Approach 4: Use go build
echo "Approach 4: Using go build..."
GOPROXY=https://proxy.golang.org go build || echo "Note: It's normal to see an error above if the module isn't fully published yet."

# Approach 5: Directly request the package from pkg.go.dev
echo "Approach 5: Directly requesting the package from pkg.go.dev..."
curl -s "https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION-sdk.go.castai?tab=doc"

# Approach 6: Use go install
echo "Approach 6: Using go install..."
GOPROXY=https://proxy.golang.org go install github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION-sdk.go.castai || echo "Note: It's normal to see an error above if the module isn't fully published yet."

# Clean up
echo "Cleaning up temporary directory..."
cd -
rm -rf $TEMP_DIR

echo "Done. The Go module should be indexed by pkg.go.dev soon."
echo "You can check the status at: https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION-sdk.go.castai"
echo "Note: It may take a few minutes for pkg.go.dev to index the new version."
