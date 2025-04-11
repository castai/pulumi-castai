#!/bin/bash
set -e

# This script publishes the .NET package to NuGet

# Get the version and token from arguments
VERSION=$1
NUGET_AUTH_TOKEN=$2

# Check if the package exists (passed as environment variable)
if [[ "$PACKAGE_EXISTS" == "true" ]]; then
  echo "Version $VERSION may already exist in NuGet registry. Skipping publish."
else
  cd sdk/dotnet
  dotnet pack -o nupkg -p:Version=${VERSION} --no-build
  dotnet nuget push nupkg/*.nupkg --api-key ${NUGET_AUTH_TOKEN} --source https://api.nuget.org/v3/index.json
fi
