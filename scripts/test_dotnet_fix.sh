#!/bin/bash
set -ex

# This script tests the schema modification to fix the ClusterToken naming conflict

# Step 1: Clean up any existing SDK
rm -rf sdk/dotnet

# Step 2: Generate the .NET SDK
echo "Generating .NET SDK without schema modification..."
bin/pulumi-tfgen-castai dotnet --out sdk/dotnet/

# Step 3: Check if the naming conflict exists
echo "Checking for naming conflict in the generated code..."
CLUSTER_TOKEN_FILE="sdk/dotnet/ClusterToken.cs"
if grep -q "public Output<string> ClusterToken" "$CLUSTER_TOKEN_FILE"; then
  echo "Naming conflict found in the generated code"
else
  echo "No naming conflict found in the generated code"
  exit 0
fi

# Step 4: Apply our schema modification
echo "Applying schema modification..."
SCHEMA_FILE="provider/cmd/pulumi-resource-castai/schema.json"
cp "$SCHEMA_FILE" "$SCHEMA_FILE.bak"

# Add language section to the ClusterToken resource
sed -i '/\"castai:index:ClusterToken\": {/a \
            \"language\": { \
                \"csharp\": { \
                    \"propertyNames\": { \
                        \"clusterToken\": \"TokenValue\" \
                    } \
                } \
            },' "$SCHEMA_FILE"

# Step 5: Regenerate the .NET SDK
echo "Regenerating .NET SDK with schema modification..."
rm -rf sdk/dotnet
bin/pulumi-tfgen-castai dotnet --out sdk/dotnet/

# Step 6: Check if the naming conflict is fixed
echo "Checking if the naming conflict is fixed..."
if grep -q "public Output<string> TokenValue" "$CLUSTER_TOKEN_FILE"; then
  echo "Schema modification worked! Naming conflict is fixed."
else
  echo "Schema modification did not work. Naming conflict still exists."
  # Restore the original schema
  mv "$SCHEMA_FILE.bak" "$SCHEMA_FILE"
  exit 1
fi

# Restore the original schema
mv "$SCHEMA_FILE.bak" "$SCHEMA_FILE"

echo "Test completed successfully"
