#!/bin/bash
set -e

# This script creates a tag specifically for the Go SDK with a versioned module path

# Get the version from version.txt
VERSION=$(cat version.txt)
echo "Using version: $VERSION"

# Extract the major version
MAJOR_VERSION=$(echo $VERSION | cut -d. -f1)
echo "Major version: $MAJOR_VERSION"

# Create a tag for the Go SDK
echo "Creating tag for Go SDK..."
TAG_NAME="sdk/v$MAJOR_VERSION/go/castai/v$VERSION"
git tag -a "$TAG_NAME" -m "Go SDK v$VERSION"
git push origin "$TAG_NAME"

echo "Tag $TAG_NAME created and pushed to origin"
echo "Now trying to trigger pkg.go.dev to index the new version..."
GOPROXY=https://proxy.golang.org GO111MODULE=on go get github.com/castai/pulumi-castai/sdk/v$MAJOR_VERSION/go/castai@v$VERSION || echo "Failed to trigger pkg.go.dev indexing, but this is expected if the repository is not yet public."

echo "Done! The Go SDK should be available at https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/v$MAJOR_VERSION/go/castai@v$VERSION after indexing (which may take some time)."
