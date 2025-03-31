#!/usr/bin/env bash
@echo "Running Azure example..."
if [ -f .env ]; then
    source .env
    cd examples/python && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi login --local && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" \
    CASTAI_API_TOKEN="${CASTAI_API_TOKEN}" \
    AZURE_SUBSCRIPTION_ID="${AZURE_SUBSCRIPTION_ID}" \
    AZURE_TENANT_ID="${AZURE_TENANT_ID}" \
    AZURE_CLIENT_ID="${AZURE_CLIENT_ID}" \
    AZURE_CLIENT_SECRET="${AZURE_CLIENT_SECRET}" \
    PULUMI_DEBUG_PROVIDERS=1 \
    pulumi up --yes -s azure
else
    echo "Error: .env file not found"
    exit 1
fi 