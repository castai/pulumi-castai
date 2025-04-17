#!/bin/bash

# This script generates go.mod files for the Go SDK
# It's used by the prepare_release.sh script to ensure the Go SDK is properly versioned

set -e

# Check if version is provided
if [ -z "$1" ]; then
  echo "Error: Version not provided"
  echo "Usage: $0 <version>"
  echo "Example: $0 0.1.39"
  exit 1
fi

VERSION=$1

# Create the sdk/go/go.mod file
echo "Creating sdk/go/go.mod file..."
cat > sdk/go/go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go

go 1.18
EOF

# Create the sdk/go/castai/go.mod file
echo "Creating sdk/go/castai/go.mod file..."
cat > sdk/go/castai/go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go/castai

go 1.18

require (
	github.com/blang/semver v3.5.1+incompatible
	github.com/pulumi/pulumi/sdk/v3 v3.0.0
)
EOF

echo "✅ Go SDK go.mod files created"
