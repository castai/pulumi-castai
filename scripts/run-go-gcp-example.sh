#!/usr/bin/env bash
echo "Running GCP Go example..."
if [ -f .env ]; then
    source .env
    cd examples/go && \
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
    EXAMPLE_TYPE="gcp" \
    go run .
else
    echo "Error: .env file not found"
    exit 1
fi
