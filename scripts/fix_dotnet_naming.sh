#!/bin/bash
set -e

# This script fixes the ClusterToken.cs file in the .NET SDK
# to avoid the naming conflict between the class and property

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

# Check if the file contains the naming conflict
if ! grep -q "public Output<string> ClusterToken" "$CLUSTER_TOKEN_FILE"; then
  echo "No naming conflict found in $CLUSTER_TOKEN_FILE"
  exit 0
fi

# Show the original file content
echo "Original ClusterToken.cs content:"
head -n 30 "$CLUSTER_TOKEN_FILE"

# Create a backup of the original file
cp "$CLUSTER_TOKEN_FILE" "${CLUSTER_TOKEN_FILE}.bak"

# Replace the property name "ClusterToken" with "TokenValue"
sed -i 's/public Output<string> ClusterToken/public Output<string> TokenValue/g' "$CLUSTER_TOKEN_FILE"

# Also fix any references to the property in the constructor
sed -i 's/ClusterToken = /TokenValue = /g' "$CLUSTER_TOKEN_FILE"

# Fix any references in the GetResourceProperties method
sed -i 's/"clusterToken", this.ClusterToken/"clusterToken", this.TokenValue/g' "$CLUSTER_TOKEN_FILE"

# Fix the property in the ClusterTokenState class
sed -i 's/public Input<string>? ClusterToken/public Input<string>? TokenValue/g' "$CLUSTER_TOKEN_FILE"

# Fix the private field
sed -i 's/_clusterToken = /_tokenValue = /g' "$CLUSTER_TOKEN_FILE"

# Fix the private field declaration
sed -i 's/private Input<string>? _clusterToken/private Input<string>? _tokenValue/g' "$CLUSTER_TOKEN_FILE"

# Fix the getter
sed -i 's/get => _clusterToken/get => _tokenValue/g' "$CLUSTER_TOKEN_FILE"

# Verify the changes were made
if grep -q "public Output<string> ClusterToken" "$CLUSTER_TOKEN_FILE"; then
  echo "ERROR: Failed to fix naming conflict in $CLUSTER_TOKEN_FILE"
  # Restore the backup
  mv "${CLUSTER_TOKEN_FILE}.bak" "$CLUSTER_TOKEN_FILE"
  exit 1
fi

# Show the modified file content
echo "Modified ClusterToken.cs content:"
head -n 30 "$CLUSTER_TOKEN_FILE"

# Remove the backup file
rm -f "${CLUSTER_TOKEN_FILE}.bak"

echo "Successfully fixed naming conflicts in .NET SDK"
