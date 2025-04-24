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
	github.com/pulumi/pulumi/sdk/v3 v3.96.1
)
EOF

# Create a README.md file for the main module
echo "Creating README.md file for the main module..."
cat > sdk/go/README.md << EOF
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
cat > sdk/go/castai/README.md << EOF
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
if [ ! -f "sdk/go/castai/doc.go" ]; then
  cat > sdk/go/castai/doc.go << EOF
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

echo "✅ Go SDK go.mod files and documentation created"
