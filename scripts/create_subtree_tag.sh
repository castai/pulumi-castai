#!/bin/bash
set -e

# This script creates a subtree tag for the Go SDK

# Get the version from version.txt
VERSION=$(cat version.txt)
echo "Using version: $VERSION"

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Clone the repository
git clone https://github.com/castai/pulumi-castai.git $TEMP_DIR
cd $TEMP_DIR

# Create a new orphan branch
git checkout --orphan go-sdk-$VERSION
echo "Created orphan branch: go-sdk-$VERSION"

# Remove all files
git rm -rf .
echo "Removed all files"

# Create the directory structure
mkdir -p sdk/go/castai
echo "Created directory structure"

# Create go.mod file for sdk/go
cat > sdk/go/go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go

go 1.18
EOF
echo "Created go.mod for sdk/go"

# Create go.mod file for sdk/go/castai
cat > sdk/go/castai/go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go/castai

go 1.18
EOF
echo "Created go.mod for sdk/go/castai"

# Create README.md for sdk/go
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
echo "Created README.md for sdk/go"

# Create README.md for sdk/go/castai
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
echo "Created README.md for sdk/go/castai"

# Copy the Go SDK files from the original repository
cp -r ../sdk/go/castai/* sdk/go/castai/
echo "Copied Go SDK files"

# Commit the changes
git add sdk
git commit -m "Publish Go SDK v$VERSION"
echo "Committed changes"

# Create a tag
git tag v$VERSION
echo "Created tag: v$VERSION"

# Push the branch and tag
git push origin go-sdk-$VERSION
git push origin v$VERSION
echo "Pushed branch and tag to origin"

# Clean up
cd ..
rm -rf $TEMP_DIR
echo "Cleaned up temporary directory"

echo "Done! The Go SDK should be available at https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION after indexing (which may take some time)."
