#!/bin/bash
set -e

# This script manually publishes the Go SDK to GitHub

# Get the version from version.txt
VERSION=$(cat version.txt)
echo "Using version: $VERSION"

# Create a temporary directory
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Create the directory structure
mkdir -p $TEMP_DIR/sdk/go/castai
echo "Created directory structure"

# Copy the Go SDK files
cp -r sdk/go/castai/* $TEMP_DIR/sdk/go/castai/
echo "Copied Go SDK files"

# Create go.mod file for sdk/go
cat > $TEMP_DIR/sdk/go/go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go

go 1.18
EOF
echo "Created go.mod for sdk/go"

# Create go.mod file for sdk/go/castai
cat > $TEMP_DIR/sdk/go/castai/go.mod << EOF
module github.com/castai/pulumi-castai/sdk/go/castai

go 1.18
EOF
echo "Created go.mod for sdk/go/castai"

# Create README.md for sdk/go
cat > $TEMP_DIR/sdk/go/README.md << EOF
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
cat > $TEMP_DIR/sdk/go/castai/README.md << EOF
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

# Create a temporary branch
BRANCH_NAME="go-sdk-publish-$VERSION"
git checkout -b $BRANCH_NAME
echo "Created branch: $BRANCH_NAME"

# Copy the files from the temporary directory
mkdir -p sdk/go/castai
cp -r $TEMP_DIR/sdk/go/* sdk/go/
echo "Copied files to sdk/go"

# Commit the changes
git add sdk/go
git commit -m "Publish Go SDK v$VERSION"
echo "Committed changes"

# Push the branch
git push origin $BRANCH_NAME
echo "Pushed branch to origin"

# Create a tag
TAG_NAME="go-sdk-v$VERSION"
git tag $TAG_NAME
git push origin $TAG_NAME
echo "Created and pushed tag: $TAG_NAME"

# Trigger pkg.go.dev to index the new version
echo "Triggering pkg.go.dev to index the new version..."
GOPROXY=https://proxy.golang.org GO111MODULE=on go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION || echo "Failed to trigger pkg.go.dev indexing, but this is expected if the repository is not yet public."

# Clean up
rm -rf $TEMP_DIR
echo "Cleaned up temporary directory"

echo "Done! The Go SDK should be available at https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION after indexing (which may take some time)."
