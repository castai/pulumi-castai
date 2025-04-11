#!/bin/bash
set -ex

# This script checks if the Go package already exists and publishes it if needed

# Get the version from the first argument
VERSION=$1

# Check if this version already exists in Go package registry
echo "Checking if Go package version $VERSION already exists..."
if curl -s "https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION" | grep -q "404 page not found"; then
  echo "Version v$VERSION does not exist in Go package registry. Publishing..."
  
  # Go packages are published to GitHub, which happens automatically
  # when the tag is pushed. No additional steps are needed.
  echo "Go package is published to GitHub automatically."
  echo "Users can install it with: go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"
else
  echo "Version v$VERSION already exists in Go package registry. Skipping publish."
fi
