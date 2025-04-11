#!/bin/bash
set -ex

# This script fixes naming conflicts in the .NET SDK
# Specifically, it fixes the ClusterToken class having a property with the same name

# Check if the .NET SDK directory exists
if [ ! -d "sdk/dotnet" ]; then
  echo "ERROR: sdk/dotnet directory does not exist"
  exit 1
fi

# Find the ClusterToken.cs file
CLUSTER_TOKEN_FILE="sdk/dotnet/ClusterToken.cs"
if [ ! -f "$CLUSTER_TOKEN_FILE" ]; then
  echo "ERROR: $CLUSTER_TOKEN_FILE does not exist"
  exit 1
fi

# Show the original file content
echo "Original ClusterToken.cs content:"
cat "$CLUSTER_TOKEN_FILE"

# Replace the property name "ClusterToken" with "TokenValue"
sed -i 's/public string ClusterToken/public string TokenValue/g' "$CLUSTER_TOKEN_FILE"

# Also fix any references to the property in the constructor
sed -i 's/ClusterToken = clusterToken/TokenValue = clusterToken/g' "$CLUSTER_TOKEN_FILE"

# Fix any references in the GetResourceProperties method
sed -i 's/"clusterToken", this.ClusterToken/"clusterToken", this.TokenValue/g' "$CLUSTER_TOKEN_FILE"

# Show the modified file content
echo "Modified ClusterToken.cs content:"
cat "$CLUSTER_TOKEN_FILE"

echo "Successfully fixed naming conflicts in .NET SDK"
