#!/bin/bash

# This script creates and pushes Git tags for Go modules in a monorepo
# It creates tags in the format v0.1.39-sdk.go.castai which are compatible with Go's module system

set -e

# Check if version is provided
if [ -z "$1" ]; then
  echo "Error: Version not provided"
  echo "Usage: $0 <version>"
  echo "Example: $0 0.1.39"
  exit 1
fi

VERSION=$1

# Create the main version tag if it doesn't exist
if ! git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "Creating main version tag v$VERSION..."
  git tag "v$VERSION"
  echo "✅ Main version tag created"
else
  echo "Main version tag v$VERSION already exists, skipping"
fi

# Create the Go SDK tag
GO_TAG="v$VERSION-sdk.go.castai"
if ! git rev-parse "$GO_TAG" >/dev/null 2>&1; then
  echo "Creating Go SDK tag $GO_TAG..."
  git tag "$GO_TAG"
  echo "✅ Go SDK tag created"
else
  echo "Go SDK tag $GO_TAG already exists, skipping"
fi

# Ask if the user wants to push the tags
read -p "Do you want to push the tags now? (y/n): " PUSH_TAGS
if [[ "$PUSH_TAGS" == "y" || "$PUSH_TAGS" == "Y" ]]; then
  echo "Pushing tags..."
  git push origin "v$VERSION" "$GO_TAG"
  echo "✅ Tags pushed"
  
  echo "The Go SDK should now be available at:"
  echo "https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@$GO_TAG"
else
  echo "Tags not pushed. You can push them later with:"
  echo "git push origin v$VERSION $GO_TAG"
fi

echo "Note: It may take a few minutes for pkg.go.dev to index the new version."
