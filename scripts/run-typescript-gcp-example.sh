#!/usr/bin/env bash
echo "Running GCP TypeScript example..."
if [ -f .env ]; then
    # Load environment variables from .env file
    set -a
    source .env
    set +a
    # Install dependencies if needed
    if [ ! -d "examples/typescript/node_modules" ]; then
        cd examples/typescript && npm install && cd ../..
    fi

    # Copy node_modules to the GCP example directory
    if [ ! -d "examples/typescript/gcp/node_modules" ]; then
        mkdir -p examples/typescript/gcp/node_modules
        cp -r examples/typescript/node_modules/* examples/typescript/gcp/node_modules/
    fi

    cd examples/typescript/gcp && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi login --local && \
    # Remove the stack if it exists to avoid cached state issues
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack rm gcp-example --force --yes 2>/dev/null || true && \
    # Create a new stack
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack init gcp-example && \
    # Run the preview with more debugging
    echo "Running with GCP Project ID: ${GCP_PROJECT_ID}"
    echo "Running with GKE Cluster Name: ${GKE_CLUSTER_NAME}"
    echo "Running with CAST AI API URL: ${CASTAI_API_URL}"
    echo "CAST AI API Token is set: $([ ! -z "${CASTAI_API_TOKEN}" ] && echo "Yes" || echo "No")"
    echo "Google Credentials are set: $([ ! -z "${GOOGLE_CREDENTIALS}" ] && echo "Yes" || echo "No")"

    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" \
    CASTAI_API_TOKEN="${CASTAI_API_TOKEN}" \
    GOOGLE_CREDENTIALS="${GOOGLE_CREDENTIALS}" \
    GCP_PROJECT_ID="${GCP_PROJECT_ID}" \
    GKE_CLUSTER_NAME="${GKE_CLUSTER_NAME}" \
    CASTAI_API_URL="${CASTAI_API_URL}" \
    PULUMI_DEBUG=1 \
    PULUMI_DEBUG_PROVIDERS=1 \
    TF_LOG=DEBUG \
    pulumi up --yes -s gcp-example
else
    echo "Error: .env file not found"
    exit 1
fi
