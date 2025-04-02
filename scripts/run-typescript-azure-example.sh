#!/usr/bin/env bash
echo "Running Azure TypeScript example..."
if [ -f .env ]; then
    # Load environment variables from .env file
    set -a
    source .env
    set +a
    # Install dependencies if needed
    if [ ! -d "examples/typescript/node_modules" ]; then
        cd examples/typescript && npm install && cd ../..
    fi

    # Copy node_modules to the Azure example directory
    if [ ! -d "examples/typescript/azure/node_modules" ]; then
        mkdir -p examples/typescript/azure/node_modules
        cp -r examples/typescript/node_modules/* examples/typescript/azure/node_modules/
    fi

    cd examples/typescript/azure && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi login --local && \
    # Remove the stack if it exists to avoid cached state issues
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack rm azure-example --force --yes 2>/dev/null || true && \
    # Create a new stack
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack init azure-example && \
    # Run the example
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" \
    CASTAI_API_TOKEN="${CASTAI_API_TOKEN}" \
    AZURE_SUBSCRIPTION_ID="${AZURE_SUBSCRIPTION_ID}" \
    AZURE_TENANT_ID="${AZURE_TENANT_ID}" \
    AZURE_CLIENT_ID="${AZURE_CLIENT_ID}" \
    AZURE_CLIENT_SECRET="${AZURE_CLIENT_SECRET}" \
    PULUMI_DEBUG_PROVIDERS=1 \
    pulumi up --yes -s azure-example
else
    echo "Error: .env file not found"
    exit 1
fi
