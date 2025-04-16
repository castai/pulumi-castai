#!/bin/bash
set -e

# This script updates the golang.org/x/crypto dependency to the latest version in all Go modules

# Get the latest version of golang.org/x/crypto
LATEST_CRYPTO_VERSION=$(go list -m -json golang.org/x/crypto@latest | grep "Version" | cut -d'"' -f4)

echo "Latest version of golang.org/x/crypto: $LATEST_CRYPTO_VERSION"

# Find all go.mod files
GO_MOD_FILES=$(find . -name "go.mod")

for GO_MOD_FILE in $GO_MOD_FILES; do
  echo "Updating $GO_MOD_FILE..."
  
  # Change to the directory containing the go.mod file
  DIR=$(dirname "$GO_MOD_FILE")
  cd "$DIR"
  
  # Check if the module uses golang.org/x/crypto
  if grep -q "golang.org/x/crypto" go.mod; then
    echo "  Found golang.org/x/crypto dependency, updating..."
    
    # Update the dependency
    go get golang.org/x/crypto@$LATEST_CRYPTO_VERSION
    go mod tidy
    
    echo "  Updated successfully."
  else
    echo "  No golang.org/x/crypto dependency found, skipping."
  fi
  
  # Return to the original directory
  cd - > /dev/null
done

echo "All go.mod files have been updated."
