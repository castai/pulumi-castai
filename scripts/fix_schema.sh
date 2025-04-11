#!/bin/bash
set -ex

# This script modifies the schema.json file to fix the naming conflict in the ClusterToken resource

SCHEMA_FILE="provider/cmd/pulumi-resource-castai/schema.json"

if [ ! -f "$SCHEMA_FILE" ]; then
  echo "ERROR: Schema file not found at $SCHEMA_FILE"
  exit 1
fi

# Create a backup of the original schema
cp "$SCHEMA_FILE" "$SCHEMA_FILE.bak"

# Add C# specific property name override for ClusterToken
# We need to add a "csharp" section to the "language" property of the ClusterToken resource
# and specify a propertyNames mapping for the clusterToken property

# First, let's check if the resource already has a language section
if grep -q '"language":' "$SCHEMA_FILE"; then
  echo "Schema already has a language section, modifying it"
  # Use jq to modify the schema
  jq '
    .resources."castai:index:ClusterToken".language.csharp.propertyNames = {
      "clusterToken": "TokenValue"
    }
  ' "$SCHEMA_FILE.bak" > "$SCHEMA_FILE"
else
  echo "Adding language section to the schema"
  # Use jq to add the language section
  jq '
    .resources."castai:index:ClusterToken".language = {
      "csharp": {
        "propertyNames": {
          "clusterToken": "TokenValue"
        }
      }
    }
  ' "$SCHEMA_FILE.bak" > "$SCHEMA_FILE"
fi

echo "Schema modification complete"
