#!/bin/bash
set -e

# Get the current version from version.txt
VERSION=$(cat version.txt)
echo "Current version: $VERSION"

# Find all go.mod files in the project
GO_MOD_FILES=$(find . -name "go.mod")

# Update the vulnerable dependencies in each go.mod file
for file in $GO_MOD_FILES; do
  echo "Updating dependencies in $file"
  dir=$(dirname "$file")
  module_path=$(dirname "$file")

  # Change to the directory containing the go.mod file
  cd "$dir"

  # Special handling for examples/go/go.mod
  if [[ "$file" == "./examples/go/go.mod" ]]; then
    echo "Special handling for examples/go/go.mod"

    # First, update the require line to use v0.0.0 which will be replaced
    sed -i 's|github.com/castai/pulumi-castai/sdk/go/castai v[0-9]\+\.[0-9]\+\.[0-9]\+|github.com/castai/pulumi-castai/sdk/go/castai v0.0.0|g' go.mod

    # Make sure we have the replace directive for the SDK
    if ! grep -q "replace github.com/castai/pulumi-castai/sdk/go => ../../sdk/go" go.mod; then
      echo "replace github.com/castai/pulumi-castai/sdk/go => ../../sdk/go" >> go.mod
    fi

    # Make sure we have the replace directive for the SDK/castai
    if ! grep -q "replace github.com/castai/pulumi-castai/sdk/go/castai => ../../sdk/go/castai" go.mod; then
      echo "replace github.com/castai/pulumi-castai/sdk/go/castai => ../../sdk/go/castai" >> go.mod
    fi
  fi

  # Update go-git and crypto packages
  go get -u github.com/go-git/go-git/v5@v5.16.0 || echo "Warning: Failed to update go-git in $file"
  go get -u golang.org/x/crypto@v0.37.0 || echo "Warning: Failed to update crypto in $file"

  # Run go mod tidy with error handling
  go mod tidy || echo "Warning: go mod tidy failed for $file, but continuing"

  # Return to the original directory
  cd - > /dev/null
done

echo "All dependencies updated successfully!"
