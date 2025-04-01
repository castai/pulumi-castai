#!/usr/bin/env bash
echo "Running GCP example..."
if [ -f .env ]; then
    source .env
    cd examples/python && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi login --local && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" \
    CASTAI_API_TOKEN="${CASTAI_API_TOKEN}" \
    GOOGLE_CREDENTIALS="${GOOGLE_CREDENTIALS}" \
    GCP_PROJECT_ID="${GCP_PROJECT_ID}" \
    PULUMI_DEBUG_PROVIDERS=1 \
    pulumi up --yes -s gcp
else
    echo "Error: .env file not found"
    exit 1
fi