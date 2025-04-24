#!/bin/bash
set -e

# This script checks if the Go SDK is available at pkg.go.dev

# Get the version from version.txt
VERSION=$(cat version.txt)
echo "Using version: $VERSION"

# Check if the Go SDK is available at pkg.go.dev
echo "Checking if Go SDK is available at pkg.go.dev..."
if curl -s "https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION" | grep -q "404 page not found"; then
  echo "Go SDK is NOT available at pkg.go.dev"
  echo "Trying to trigger pkg.go.dev to index the new version..."
  GOPROXY=https://proxy.golang.org GO111MODULE=on go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION || echo "Failed to trigger pkg.go.dev indexing, but this is expected if the repository is not yet public."
  echo "Please wait a few minutes and try again."
else
  echo "Go SDK is available at pkg.go.dev"
  echo "You can install it with: go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"
  echo "You can view it at: https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"
fi
