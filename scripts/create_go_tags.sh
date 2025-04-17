#!/bin/bash

# This script creates and pushes Git tags for Go modules in a monorepo
# It creates tags in the format v0.1.39-sdk.go.castai which are compatible with Go's module system

set -e

# Parse command line arguments
DRY_RUN=false
VERSION=""

for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      echo "Running in dry-run mode. No changes will be made."
      ;;
    *)
      if [ -z "$VERSION" ]; then
        VERSION=$arg
      fi
      ;;
  esac
done

# Check if version is provided
if [ -z "$VERSION" ]; then
  echo "Error: Version not provided"
  echo "Usage: $0 <version> [--dry-run]"
  echo "Example: $0 0.1.39"
  exit 1
fi

# Create the main version tag if it doesn't exist
if ! git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "Creating main version tag v$VERSION..."
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[DRY RUN] Would run: git tag \"v$VERSION\""
  else
    git tag "v$VERSION"
  fi
  echo "✅ Main version tag created"
else
  echo "Main version tag v$VERSION already exists, skipping"
fi

# Create the Go SDK tag
GO_TAG="v$VERSION-sdk.go.castai"
if ! git rev-parse "$GO_TAG" >/dev/null 2>&1; then
  echo "Creating Go SDK tag $GO_TAG..."
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "[DRY RUN] Would run: git tag \"$GO_TAG\""
  else
    git tag "$GO_TAG"
  fi
  echo "✅ Go SDK tag created"
else
  echo "Go SDK tag $GO_TAG already exists, skipping"
fi

# Ask if the user wants to push the tags
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DRY RUN] Would ask: Do you want to push the tags now? (y/n)"
  echo "[DRY RUN] Would run: git push origin \"v$VERSION\" \"$GO_TAG\" (if user answers yes)"
else
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
fi

echo "Note: It may take a few minutes for pkg.go.dev to index the new version."
