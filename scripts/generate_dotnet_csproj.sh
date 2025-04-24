#!/bin/bash
set -e

# This script generates the Pulumi.CastAI.csproj file for the .NET SDK

# Check if the .NET SDK directory exists
if [ ! -d "sdk/dotnet" ]; then
  echo "ERROR: sdk/dotnet directory does not exist"
  exit 1
fi

# Create the project file
PROJECT_FILE="sdk/dotnet/Pulumi.CastAI.csproj"
echo "Generating $PROJECT_FILE"

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

echo "Successfully generated $PROJECT_FILE"

# Copy the logo file to the SDK directory
LOGO_SOURCE="docs/images/castai-logo.png"
LOGO_DEST="sdk/dotnet/castai-logo.png"
if [ -f "$LOGO_SOURCE" ]; then
  echo "Copying logo file from $LOGO_SOURCE to $LOGO_DEST"
  cp "$LOGO_SOURCE" "$LOGO_DEST"
else
  echo "WARNING: Logo file not found at $LOGO_SOURCE"
fi

# Make the file executable
chmod +x "$PROJECT_FILE"
