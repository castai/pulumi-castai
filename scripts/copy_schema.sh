#!/bin/bash

# This script copies the schema.json file to the provider/sdk/schema directory
# It's used by the prepare_release.sh script to ensure the schema is in the correct location

set -e

# Check if schema.json exists in the root directory
if [ ! -f "schema.json" ]; then
  echo "Error: schema.json not found in the root directory. Run 'make build_schema' first."
  exit 1
fi

# Create the provider/sdk/schema directory if it doesn't exist
mkdir -p provider/sdk/schema

# Copy the schema.json file to the provider/sdk/schema directory
cp schema.json provider/sdk/schema/schema.json

echo "✅ Schema copied to provider/sdk/schema/schema.json"
