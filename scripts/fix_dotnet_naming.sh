#!/bin/bash
set -e

# This script fixes the ClusterToken.cs file in the .NET SDK
# to avoid the naming conflict between the class and property
# and ensures the correct package ID is used

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
  # exit 0 # Continue to check package ID
fi

# Check the project file for the correct package ID
PROJECT_FILE="sdk/dotnet/Pulumi.CastAI.csproj"
if [ ! -f "$PROJECT_FILE" ]; then
  echo "WARNING: $PROJECT_FILE does not exist, creating it"
  cat > "$PROJECT_FILE" << EOF
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <PackageId>CASTAI.Pulumi</PackageId>
    <GeneratePackageOnBuild>true</GeneratePackageOnBuild>
    <Authors>CAST AI</Authors>
    <Company>CAST AI</Company>
    <Description>A Pulumi package for creating and managing CAST AI cloud resources.</Description>
    <PackageLicenseExpression>Apache-2.0</PackageLicenseExpression>
    <PackageProjectUrl>https://cast.ai</PackageProjectUrl>
    <RepositoryUrl>https://github.com/castai/pulumi-castai</RepositoryUrl>
    <PackageIcon>castai-logo.png</PackageIcon>

    <TargetFramework>net6.0</TargetFramework>
    <Nullable>enable</Nullable>
  </PropertyGroup>

  <PropertyGroup Condition="'\$(Configuration)|\$(Platform)'=='Debug|AnyCPU'">
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
    <NoWarn>1701;1702;1591</NoWarn>
  </PropertyGroup>

  <PropertyGroup>
    <AllowedOutputExtensionsInPackageBuildOutputFolder>\$(AllowedOutputExtensionsInPackageBuildOutputFolder);.pdb</AllowedOutputExtensionsInPackageBuildOutputFolder>
    <EmbedUntrackedSources>true</EmbedUntrackedSources>
    <PublishRepositoryUrl>true</PublishRepositoryUrl>
  </PropertyGroup>

  <PropertyGroup Condition="'\$(GITHUB_ACTIONS)' == 'true'">
    <ContinuousIntegrationBuild>true</ContinuousIntegrationBuild>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Microsoft.SourceLink.GitHub" Version="1.0.0" PrivateAssets="All" />
  </ItemGroup>

  <ItemGroup>
    <EmbeddedResource Include="version.txt" />
    <None Include="version.txt" Pack="True" PackagePath="content" />
  </ItemGroup>

  <ItemGroup>
    <EmbeddedResource Include="pulumi-plugin.json" />
    <None Include="pulumi-plugin.json" Pack="True" PackagePath="content" />
  </ItemGroup>

  <ItemGroup>
    <PackageReference Include="Pulumi" Version="3.*" />
  </ItemGroup>

  <ItemGroup>
    <None Include="castai-logo.png">
      <Pack>True</Pack>
      <PackagePath></PackagePath>
    </None>
  </ItemGroup>

</Project>
EOF
fi

# Check if the project file has the correct package ID
if ! grep -q "<PackageId>CASTAI.Pulumi</PackageId>" "$PROJECT_FILE"; then
  echo "Setting correct package ID in $PROJECT_FILE"
  sed -i 's/<PropertyGroup>/<PropertyGroup>\n    <PackageId>CASTAI.Pulumi<\/PackageId>/g' "$PROJECT_FILE"
fi

# Ensure the logo file is correctly referenced
if grep -q "<PackageIcon>logo.png</PackageIcon>" "$PROJECT_FILE"; then
  echo "Updating logo reference in $PROJECT_FILE"
  sed -i 's/<PackageIcon>logo.png<\/PackageIcon>/<PackageIcon>castai-logo.png<\/PackageIcon>/g' "$PROJECT_FILE"
fi

# Also update the None Include section for the logo
if grep -q "<None Include=\"logo.png\">" "$PROJECT_FILE"; then
  echo "Updating logo reference in None Include section"
  sed -i 's/<None Include="logo.png">/<None Include="castai-logo.png">/g' "$PROJECT_FILE"
fi

# Copy the correct logo file to the SDK directory
LOGO_SOURCE="docs/images/castai-logo-new.png"
LOGO_DEST="sdk/dotnet/castai-logo.png"
if [ -f "$LOGO_SOURCE" ]; then
  echo "Copying logo file from $LOGO_SOURCE to $LOGO_DEST"
  cp "$LOGO_SOURCE" "$LOGO_DEST"
else
  # Try the original logo file
  LOGO_SOURCE="docs/images/castai-logo.png"
  if [ -f "$LOGO_SOURCE" ]; then
    echo "Copying logo file from $LOGO_SOURCE to $LOGO_DEST"
    cp "$LOGO_SOURCE" "$LOGO_DEST"
  else
    echo "WARNING: Logo file not found at $LOGO_SOURCE"
    # Create a simple PNG logo
    echo "Creating a simple PNG logo"
    mkdir -p $(dirname "$LOGO_DEST")
    convert -size 128x128 xc:white -fill black -gravity center -pointsize 20 -annotate 0 "CAST AI" "$LOGO_DEST"
  fi
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
