#!/bin/bash
set -ex

# This script adds the .NET SDK build step to the Makefile
# and builds the .NET SDK

# Get the version from the first argument
VERSION=$1

# Add .NET SDK build step to Makefile
cat >> Makefile << 'EOF'

build_dotnet:: install_dependencies
	rm -rf sdk/dotnet
	$(WORKING_DIR)/bin/${TFGEN} dotnet --out sdk/dotnet/ --overlays provider/overlays/dotnet
	cd sdk/dotnet && \
		dotnet build /p:Version=${VERSION} -v detailed
EOF

# Build .NET SDK
echo "Building .NET SDK with version $VERSION"

# First, generate the .NET SDK
rm -rf sdk/dotnet
${WORKING_DIR:-$(pwd)}/bin/pulumi-tfgen-castai dotnet --out sdk/dotnet/ --overlays provider/overlays/dotnet

# Apply post-processing fixes to the generated code
echo "Applying post-processing fixes to .NET SDK"
./scripts/fix_dotnet_naming.sh

# Build the fixed .NET SDK
cd sdk/dotnet && dotnet build /p:Version=${VERSION} -v detailed
BUILD_RESULT=$?
cd ../..

# Verify the build succeeded
if [ $BUILD_RESULT -ne 0 ]; then
    echo "ERROR: .NET SDK build failed"
    exit 1
fi

# List the built files to verify
echo "Listing built .NET SDK files:"
ls -la sdk/dotnet/bin/Debug/
