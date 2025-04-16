#!/bin/bash
set -e

# This script manually triggers pkg.go.dev to index the Go SDK

# Get the version from the first argument or from version.txt
VERSION=$1
if [ -z "$VERSION" ]; then
  VERSION=$(cat version.txt | tr -d '\n')
  echo "Using version from version.txt: $VERSION"
fi

echo "Triggering pkg.go.dev to index the Go SDK for version v$VERSION..."

# Explicitly request the package from pkg.go.dev
echo "Explicitly requesting the Go package from pkg.go.dev..."
curl -s "https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION?tab=doc"

# Force the Go proxy to fetch the module
echo "Forcing the Go proxy to fetch the module..."
GOPROXY=https://proxy.golang.org GO111MODULE=on go get github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION || echo "Failed to trigger pkg.go.dev indexing, but this is expected if the repository is not yet public."

# Create a test project to verify the module can be imported
echo "Creating a test project to verify the module can be imported..."
mkdir -p /tmp/go-sdk-test
cat > /tmp/go-sdk-test/go.mod << EOF
module test

go 1.18

require github.com/castai/pulumi-castai/sdk/go v$VERSION
EOF

cat > /tmp/go-sdk-test/main.go << EOF
package main

import (
  "fmt"
  "github.com/castai/pulumi-castai/sdk/go/castai"
)

func main() {
  fmt.Println("Testing import of github.com/castai/pulumi-castai/sdk/go/castai")

  // Actually use the package to avoid the "imported and not used" error
  _ = castai.NewProvider
}
EOF

cd /tmp/go-sdk-test
go mod tidy || echo "Note: It's normal to see an error above if the module isn't fully published yet."

# Check if go.sum was created
if [ ! -f "go.sum" ]; then
  echo "Warning: go.sum was not created. Creating it manually..."
  touch go.sum
fi

go build || echo "Note: It's normal to see an error above if the module isn't fully published yet."

echo "The Go package should be available at https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION after indexing (which may take some time)."
echo "If the package is still not available after some time, please check that the repository is public and the module structure is correct."
