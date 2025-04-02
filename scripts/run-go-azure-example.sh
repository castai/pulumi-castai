#!/usr/bin/env bash
echo "Running Azure Go example..."
if [ -f .env ]; then
    source .env
    cd examples/go && \
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
    AZURE_RESOURCE_GROUP="${AZURE_RESOURCE_GROUP}" \
    AKS_CLUSTER_NAME="${AKS_CLUSTER_NAME}" \
    EXAMPLE_TYPE="azure" \
    go run .
else
    echo "Error: .env file not found"
    exit 1
fi
