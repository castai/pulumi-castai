#!/bin/bash

# This script copies the schema.json file to the provider/sdk/schema directory
# It's used by the prepare_release.sh script to ensure the schema is in the correct location

set -e

# Create the provider/sdk/schema directory if it doesn't exist
mkdir -p provider/sdk/schema

# Check if schema.json exists in the root directory
if [ -f "schema.json" ]; then
  # Copy the schema.json file from the root directory
  cp schema.json provider/sdk/schema/schema.json
  echo "Copied schema.json from root directory"
else
  # Check if schema.json exists in the provider/cmd/pulumi-resource-castai directory
  if [ -f "provider/cmd/pulumi-resource-castai/schema.json" ]; then
    # Copy the schema.json file from the provider/cmd/pulumi-resource-castai directory
    cp provider/cmd/pulumi-resource-castai/schema.json provider/sdk/schema/schema.json
    echo "Copied schema.json from provider/cmd/pulumi-resource-castai directory"
  else
    echo "Error: schema.json not found in either the root directory or provider/cmd/pulumi-resource-castai directory. Run 'make build_schema' first."
    exit 1
  fi
fi

echo "✅ Schema copied to provider/sdk/schema/schema.json"
