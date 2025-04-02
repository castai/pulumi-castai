#!/usr/bin/env bash
echo "Running GCP Python example..."
if [ -f .env ]; then
    source .env
    cd examples/python && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi login --local && \
    # Remove the stack if it exists to avoid cached state issues
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack rm gcp-example --force --yes 2>/dev/null || true && \
    # Create a new stack
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack init gcp-example && \
    # Run the example
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" \
    CASTAI_API_TOKEN="${CASTAI_API_TOKEN}" \
    GOOGLE_CREDENTIALS="${GOOGLE_CREDENTIALS}" \
    GCP_PROJECT_ID="${GCP_PROJECT_ID}" \
    GKE_CLUSTER_NAME="${GKE_CLUSTER_NAME}" \
    python gcp_example.py
else
    echo "Error: .env file not found"
    exit 1
fi
