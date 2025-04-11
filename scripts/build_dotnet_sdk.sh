#!/bin/bash
set -e

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
		dotnet build /p:Version=${VERSION}
EOF

# Build .NET SDK
make build_dotnet
