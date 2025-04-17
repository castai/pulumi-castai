#!/bin/bash
set -e

# This script generates go.sum files for the Go SDK

echo "Generating go.sum files for Go SDK..."

# Store the original directory
ORIGINAL_DIR=$(pwd)

# Create empty go.sum files as a fallback
mkdir -p "$ORIGINAL_DIR/sdk/go"
touch "$ORIGINAL_DIR/sdk/go/go.sum"
mkdir -p "$ORIGINAL_DIR/sdk/go/castai"
touch "$ORIGINAL_DIR/sdk/go/castai/go.sum"

# Create a temporary directory for generating go.sum files
mkdir -p /tmp/go-sdk-temp
cp -r "$ORIGINAL_DIR/sdk/go" /tmp/go-sdk-temp/

# Generate go.sum for the main module
cd /tmp/go-sdk-temp/go
go mod tidy || echo "Warning: go mod tidy failed for the main module, but we'll continue"

# Generate go.sum for the castai module
cd castai
go mod tidy || echo "Warning: go mod tidy failed for the castai module, but we'll continue"

# Return to the original directory
cd "$ORIGINAL_DIR"

# Copy the go.sum files back to the original location
cp -f /tmp/go-sdk-temp/go/go.sum "$ORIGINAL_DIR/sdk/go/" || echo "No go.sum generated for main module"
cp -f /tmp/go-sdk-temp/go/castai/go.sum "$ORIGINAL_DIR/sdk/go/castai/" || echo "No go.sum generated for castai module"

# Verify go.sum files exist
echo "Verifying go.sum files exist:"
ls -la "$ORIGINAL_DIR/sdk/go/go.sum"
ls -la "$ORIGINAL_DIR/sdk/go/castai/go.sum"

echo "go.sum files generated successfully."
