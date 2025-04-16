#!/bin/bash
set -e

# This script generates the schema file in the correct location

# Get the version from version.txt
VERSION=$(cat version.txt | tr -d '\n')

echo "Generating schema for version $VERSION..."

# Ensure the schema directory exists
mkdir -p provider/sdk/schema

# Create a temporary directory for the schema
rm -rf /tmp/schema.json
mkdir -p /tmp/schema.json

# Generate the schema
if [ -f "bin/pulumi-tfgen-castai" ]; then
    bin/pulumi-tfgen-castai schema --out=/tmp/schema.json
else
    echo "Error: bin/pulumi-tfgen-castai not found. Building it..."
    make tfgen
    bin/pulumi-tfgen-castai schema --out=/tmp/schema.json
fi

# Check if the schema file was generated
if [ ! -f "/tmp/schema.json/schema.json" ]; then
    echo "Error: Failed to generate schema file."
    exit 1
fi

# Copy the schema file to the correct location
cp /tmp/schema.json/schema.json provider/sdk/schema/schema.json

# Check if the version line already exists
if ! grep -q '"version":' provider/sdk/schema/schema.json; then
    # Inject the version line after the 'publisher' line using sed
    sed -i.bak '/"publisher":/a \
    "version": "'$VERSION'",' provider/sdk/schema/schema.json && rm -f provider/sdk/schema/schema.json.bak
fi

echo "Schema generated at provider/sdk/schema/schema.json"
echo "Verifying version in schema file:"
grep '"version":' provider/sdk/schema/schema.json || echo "Warning: Version not found in schema file."
