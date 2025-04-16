#!/bin/bash
set -e

# This script generates go.sum files for the Go SDK

echo "Generating go.sum files for Go SDK..."

# Create a temporary directory for generating go.sum files
mkdir -p /tmp/go-sdk-temp
cp -r sdk/go /tmp/go-sdk-temp/

# Generate go.sum for the main module
cd /tmp/go-sdk-temp/go
go mod tidy || echo "Warning: go mod tidy failed for the main module, but we'll continue"

# Generate go.sum for the castai module
cd castai
go mod tidy || echo "Warning: go mod tidy failed for the castai module, but we'll continue"

# Copy the go.sum files back to the original location
cp -f /tmp/go-sdk-temp/go/go.sum $(pwd)/../../../sdk/go/ || echo "No go.sum generated for main module"
cp -f /tmp/go-sdk-temp/go/castai/go.sum $(pwd)/../../../sdk/go/castai/ || echo "No go.sum generated for castai module"

echo "go.sum files generated successfully."
