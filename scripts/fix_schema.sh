#!/bin/bash

# This script fixes the schema.json file to include the version field
# It's used by the prepare_release.sh script to ensure the schema.json file is properly versioned

set -e

# Check if version is provided
if [ -z "$1" ]; then
  echo "Error: Version not provided"
  echo "Usage: $0 <version> <schema_file>"
  echo "Example: $0 0.1.40 schema.json"
  exit 1
fi

# Check if schema file is provided
if [ -z "$2" ]; then
  echo "Error: Schema file not provided"
  echo "Usage: $0 <version> <schema_file>"
  echo "Example: $0 0.1.40 schema.json"
  exit 1
fi

VERSION=$1
SCHEMA_FILE=$2

# Check if the schema file exists
if [ ! -f "$SCHEMA_FILE" ]; then
  echo "Error: Schema file not found: $SCHEMA_FILE"
  exit 1
fi

# Check if the version field already exists
if grep -q '"version":' "$SCHEMA_FILE"; then
  echo "Version field already exists in schema file, updating it..."
  # Update the version field
  sed -i.bak "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" "$SCHEMA_FILE" && rm -f "$SCHEMA_FILE.bak"
else
  echo "Version field does not exist in schema file, adding it..."
  # Add the version field after the publisher field
  sed -i.bak "s/\"publisher\": \"[^\"]*\"/\"publisher\": \"CAST AI\",\n    \"version\": \"$VERSION\"/" "$SCHEMA_FILE" && rm -f "$SCHEMA_FILE.bak"
fi

# Verify the version field exists
if grep -q "\"version\": \"$VERSION\"" "$SCHEMA_FILE"; then
  echo "✅ Version field successfully added/updated in schema file"
else
  echo "❌ Failed to add/update version field in schema file"
  exit 1
fi
