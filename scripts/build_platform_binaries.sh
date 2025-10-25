#!/bin/bash
set -e

VERSION=$(cat version.txt)
echo "Building platform-specific binaries for version $VERSION..."

# Ensure the bin directory exists
mkdir -p bin

# Build all platform-specific binaries
cd provider

# Build for Linux amd64
echo "Building for Linux amd64..."
GOOS=linux GOARCH=amd64 go build -o ../bin/pulumi-resource-castai-v${VERSION}-linux-amd64 -ldflags "-X github.com/castai/pulumi-castai/provider/pkg/version.Version=${VERSION}" ./cmd/pulumi-resource-castai

# Build for Linux arm64
echo "Building for Linux arm64..."
GOOS=linux GOARCH=arm64 go build -o ../bin/pulumi-resource-castai-v${VERSION}-linux-arm64 -ldflags "-X github.com/castai/pulumi-castai/provider/pkg/version.Version=${VERSION}" ./cmd/pulumi-resource-castai

# Build for Windows amd64
echo "Building for Windows amd64..."
GOOS=windows GOARCH=amd64 go build -o ../bin/pulumi-resource-castai-v${VERSION}-windows-amd64.exe -ldflags "-X github.com/castai/pulumi-castai/provider/pkg/version.Version=${VERSION}" ./cmd/pulumi-resource-castai

# Build for macOS amd64
echo "Building for macOS amd64..."
GOOS=darwin GOARCH=amd64 go build -o ../bin/pulumi-resource-castai-v${VERSION}-darwin-amd64 -ldflags "-X github.com/castai/pulumi-castai/provider/pkg/version.Version=${VERSION}" ./cmd/pulumi-resource-castai

# Build for macOS arm64
echo "Building for macOS arm64..."
GOOS=darwin GOARCH=arm64 go build -o ../bin/pulumi-resource-castai-v${VERSION}-darwin-arm64 -ldflags "-X github.com/castai/pulumi-castai/provider/pkg/version.Version=${VERSION}" ./cmd/pulumi-resource-castai

cd ..

# Verify the binaries were created
echo "Verifying platform-specific binaries..."
ls -la ./bin/pulumi-resource-castai-v${VERSION}-*

echo "✅ Platform-specific binaries created"
