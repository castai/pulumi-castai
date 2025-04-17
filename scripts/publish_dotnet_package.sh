#!/bin/bash
set -ex

# This script publishes the .NET package to NuGet

# Get the version and token from arguments
VERSION=$1
NUGET_AUTH_TOKEN=$2

# Check if this version already exists in NuGet
echo "Checking if .NET package version $VERSION already exists on NuGet..."
if curl -s "https://api.nuget.org/v3-flatcontainer/pulumi.castai/$VERSION/pulumi.castai.$VERSION.nupkg" --head | grep -q "HTTP/2 200"; then
  echo "Version $VERSION already exists in NuGet registry. Skipping publish."
else
  echo "Version $VERSION does not exist in NuGet registry. Publishing..."
  echo "Publishing .NET package version $VERSION to NuGet"

  # Verify the directory exists
  if [ ! -d "sdk/dotnet" ]; then
    echo "ERROR: sdk/dotnet directory does not exist"
    ls -la sdk/
    exit 1
  fi

  cd sdk/dotnet

  # Pack the .NET SDK
  echo "Packing .NET SDK"
  dotnet pack -o nupkg -p:Version=${VERSION} -c Release --no-build -v detailed

  # Verify the package was created
  echo "Verifying package was created"
  ls -la nupkg/

  # Push the package to NuGet
  echo "Pushing package to NuGet"
  dotnet nuget push nupkg/*.nupkg --api-key ${NUGET_AUTH_TOKEN} --source https://api.nuget.org/v3/index.json
fi
