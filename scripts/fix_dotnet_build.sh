#!/bin/bash
set -e

# This script fixes the .NET build by ensuring the .csproj file exists

# Get the version from version.txt
VERSION=$(cat version.txt)
echo "Using version: $VERSION"

# Create the directory structure
mkdir -p sdk/dotnet
echo "Created directory structure"

# Create the .csproj file
cat > sdk/dotnet/Pulumi.CastAI.csproj << EOF
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <GeneratePackageOnBuild>true</GeneratePackageOnBuild>
    <Authors>CAST AI</Authors>
    <Company>CAST AI</Company>
    <Description>A Pulumi package for creating and managing CAST AI resources.</Description>
    <PackageLicenseExpression>Apache-2.0</PackageLicenseExpression>
    <PackageProjectUrl>https://www.pulumi.com/registry/packages/castai/</PackageProjectUrl>
    <RepositoryUrl>https://github.com/castai/pulumi-castai</RepositoryUrl>
    <PackageIcon>castai-logo.png</PackageIcon>
    <TargetFramework>net6.0</TargetFramework>
    <Nullable>enable</Nullable>
    <UseSharedCompilation>false</UseSharedCompilation>
    <Version>$VERSION</Version>
  </PropertyGroup>

  <PropertyGroup Condition="'$(Configuration)|$(Platform)'=='Debug|AnyCPU'">
    <GenerateDocumentationFile>true</GenerateDocumentationFile>
    <NoWarn>1701;1702;1591</NoWarn>
  </PropertyGroup>

  <PropertyGroup>
    <AllowedOutputExtensionsInPackageBuildOutputFolder>$(AllowedOutputExtensionsInPackageBuildOutputFolder);.pdb</AllowedOutputExtensionsInPackageBuildOutputFolder>
    <EmbedUntrackedSources>true</EmbedUntrackedSources>
    <PublishRepositoryUrl>true</PublishRepositoryUrl>
  </PropertyGroup>

  <PropertyGroup Condition="'$(GITHUB_ACTIONS)' == 'true'">
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
    <None Include="../../docs/images/castai-logo.png" Pack="True" PackagePath="castai-logo.png" />
  </ItemGroup>

</Project>
EOF
echo "Created .csproj file"

# Create the version.txt file
echo "$VERSION" > sdk/dotnet/version.txt
echo "Created version.txt file"

# Create an empty pulumi-plugin.json file if it doesn't exist
if [ ! -f "sdk/dotnet/pulumi-plugin.json" ]; then
  echo "{}" > sdk/dotnet/pulumi-plugin.json
  echo "Created empty pulumi-plugin.json file"
fi

echo "Done! The .NET build should now work correctly."
