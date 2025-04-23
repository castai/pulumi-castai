#!/usr/bin/env bash
set -e
echo "Running Azure TypeScript example..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    exit 1
fi

# Load environment variables from .env file
set -a
source .env
set +a

# Get the version from version.txt
VERSION=$(cat version.txt | tr -d '\n')
echo "Using version from version.txt: $VERSION"

# Ensure the provider is built and installed
echo "Checking if provider binary exists..."
if [ ! -f "bin/pulumi-resource-castai" ]; then
    echo "Provider binary not found. Building provider..."
    make provider
    echo "✅ Provider built successfully"
else
    echo "Provider binary found"
fi

# Install the provider plugin
echo "Installing provider plugin..."
pulumi plugin install resource castai $VERSION --file ./bin/pulumi-resource-castai --reinstall
echo "✅ Provider plugin installed successfully"

# Define example directory
EXAMPLE_DIR="examples/typescript/azure"

# Install TypeScript example dependencies
echo "Installing TypeScript example dependencies..."
cd "$EXAMPLE_DIR" && npm install && cd ../../..
echo "✅ TypeScript example dependencies installed"

# Install the local SDK in the example project
echo "Installing local SDK in the example project..."
cd "$EXAMPLE_DIR" && npm install ../../../sdk/nodejs && cd ../../..
echo "✅ Local SDK installed in the example project"

# Authenticate with Azure credentials if available
if [ -n "$ARM_CLIENT_ID" ] && [ -n "$ARM_CLIENT_SECRET" ] && [ -n "$ARM_TENANT_ID" ]; then
    echo "Azure credentials are set"
fi

# Connect to the AKS cluster to ensure the kubeconfig is set up correctly
if [ -n "$AKS_CLUSTER_NAME" ] && [ -n "$AZURE_RESOURCE_GROUP" ]; then
    echo "Connecting to AKS cluster $AKS_CLUSTER_NAME in $AZURE_RESOURCE_GROUP..."
    az aks get-credentials --resource-group "$AZURE_RESOURCE_GROUP" --name "$AKS_CLUSTER_NAME" --overwrite-existing
fi

# Change to the example directory and run the Pulumi deployment
cd "$EXAMPLE_DIR" && {
    # Create a new stack
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack init azure-example && \
    # Set Azure configuration
    pulumi config set azure-native:location "${AZURE_LOCATION}" && \
    # Run the deployment with more debugging
    echo "Running with Azure Resource Group: ${AZURE_RESOURCE_GROUP}"
    echo "Running with AKS Cluster Name: ${AKS_CLUSTER_NAME}"
    echo "Running with Azure Location: ${AZURE_LOCATION}"
    echo "Running with CAST AI API URL: ${CASTAI_API_URL}"
    echo "CAST AI API Token is set: $([ ! -z "${CASTAI_API_TOKEN}" ] && echo "Yes" || echo "No")"
    echo "Azure credentials are set: $([ ! -z "${ARM_CLIENT_ID}" ] && echo "Yes" || echo "No")"
    echo "CAST AI Read-only Mode: ${CASTAI_READONLY_MODE:-true}"

    # Set environment variables for the Pulumi deployment
    export PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}"
    export CASTAI_API_TOKEN="${CASTAI_API_TOKEN}"
    export ARM_CLIENT_ID="${ARM_CLIENT_ID}"
    export ARM_CLIENT_SECRET="${ARM_CLIENT_SECRET}"
    export ARM_TENANT_ID="${ARM_TENANT_ID}"
    export ARM_SUBSCRIPTION_ID="${ARM_SUBSCRIPTION_ID}"
    export AZURE_RESOURCE_GROUP="${AZURE_RESOURCE_GROUP}"
    export AKS_CLUSTER_NAME="${AKS_CLUSTER_NAME}"
    export AZURE_LOCATION="${AZURE_LOCATION}"
    export CASTAI_API_URL="${CASTAI_API_URL}"
    export CASTAI_READONLY_MODE="${CASTAI_READONLY_MODE:-true}"
    export PULUMI_SKIP_UPDATE_CHECK=true

    # Clean up any existing CAST AI agent namespace to avoid Helm chart conflicts
    echo "Checking for existing CAST AI agent namespace..."
    if kubectl get namespace castai-agent &>/dev/null; then
        echo "Found existing CAST AI agent namespace, cleaning up..."
        kubectl delete namespace castai-agent --wait=false
        echo "Waiting for namespace deletion to complete..."
        # Wait for the namespace to be deleted (with timeout)
        timeout 60 bash -c 'until ! kubectl get namespace castai-agent &>/dev/null; do sleep 2; done' || echo "Namespace deletion timed out, continuing anyway"
    fi

    echo "Running Pulumi deployment..."
    echo "This will connect to the AKS cluster and install CAST AI Helm charts."
    echo "The process may take several minutes to complete."

    # Run the Pulumi deployment with a timeout to prevent hanging
    # The timeout is set to 10 minutes (600 seconds) to allow for Helm chart installation
    timeout 600 pulumi up -s azure-example --yes --non-interactive --skip-preview
}
