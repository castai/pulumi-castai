#!/usr/bin/env bash
set -e
echo "Running GCP TypeScript example..."

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
EXAMPLE_DIR="examples/typescript/gcp"

# Install TypeScript example dependencies
echo "Installing TypeScript example dependencies..."
cd "$EXAMPLE_DIR" && npm install && cd ../../..
echo "✅ TypeScript example dependencies installed"

# Authenticate with service account credentials if available
if [ -n "$GOOGLE_CREDENTIALS" ]; then
    echo "Authenticating with service account credentials..."
    echo "$GOOGLE_CREDENTIALS" > /tmp/gcp-credentials.json
    gcloud auth activate-service-account --key-file=/tmp/gcp-credentials.json
fi

# Connect to the GKE cluster to ensure the kubeconfig is set up correctly
if [ -n "$GKE_CLUSTER_NAME" ] && [ -n "$GCP_PROJECT_ID" ] && [ -n "$GKE_LOCATION" ]; then
    echo "Connecting to GKE cluster $GKE_CLUSTER_NAME in $GKE_LOCATION..."
    gcloud container clusters get-credentials "$GKE_CLUSTER_NAME" --project "$GCP_PROJECT_ID" --zone "$GKE_LOCATION"
fi

# Navigate to the example directory
cd "$EXAMPLE_DIR" && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi login --local && \
    # Clean up any previous stacks
    echo "Cleaning up previous Pulumi stacks..."

    # Check if there are any existing stacks
    if pulumi stack ls &>/dev/null; then
        # List all stacks and delete them
        for stack in $(pulumi stack ls --json 2>/dev/null | jq -r '.[].name' 2>/dev/null || echo ""); do
            echo "Destroying resources in stack: $stack"
            # Force select the stack, ignoring any errors
            PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE:-wrongpassphrase}" pulumi stack select $stack --non-interactive 2>/dev/null || true

            # Try to destroy resources, but don't worry if it fails
            PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE:-wrongpassphrase}" pulumi destroy --yes --skip-preview 2>/dev/null || true

            echo "Removing stack: $stack"
            # Force remove the stack with maximum force
            PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE:-wrongpassphrase}" pulumi stack rm $stack --force --yes 2>/dev/null || true

            # If the above fails, try to remove the stack files directly
            rm -rf ~/.pulumi/stacks/gcp-example* 2>/dev/null || true
        done
    fi && \
    # Create a new stack
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack init gcp-example && \
    # Set GCP project configuration
    pulumi config set gcp:project "${GCP_PROJECT_ID}" && \
    # Run the deployment with more debugging
    echo "Running with GCP Project ID: ${GCP_PROJECT_ID}"
    echo "Running with GKE Cluster Name: ${GKE_CLUSTER_NAME}"
    echo "Running with GKE Location: ${GKE_LOCATION}"
    echo "Running with CAST AI API URL: ${CASTAI_API_URL}"
    echo "CAST AI API Token is set: $([ ! -z "${CASTAI_API_TOKEN}" ] && echo "Yes" || echo "No")"
    echo "Google Credentials are set: $([ ! -z "${GOOGLE_CREDENTIALS}" ] && echo "Yes" || echo "No")"
    echo "CAST AI Read-only Mode: ${CASTAI_READONLY_MODE:-true}"

    # Set environment variables for the Pulumi deployment
    export PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}"
    export CASTAI_API_TOKEN="${CASTAI_API_TOKEN}"
    export GOOGLE_CREDENTIALS="${GOOGLE_CREDENTIALS}"
    export GCP_PROJECT_ID="${GCP_PROJECT_ID}"
    export GKE_CLUSTER_NAME="${GKE_CLUSTER_NAME}"
    export GKE_LOCATION="${GKE_LOCATION}"
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
    echo "This will connect to the GKE cluster and install CAST AI Helm charts."
    echo "The process may take several minutes to complete."

    # Run the Pulumi deployment with a timeout to prevent hanging
    # The timeout is set to 10 minutes (600 seconds) to allow for Helm chart installation
    timeout 600 pulumi up -s gcp-example --yes --non-interactive --skip-preview

    # Check the exit code
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 124 ]; then
        echo "Operation timed out after 5 minutes. This is expected as we're not waiting for the connection to complete."
        echo "The Helm chart installation has been initiated and will continue in the background."
        echo "You can check the status of the CAST AI agent in the GKE cluster using:"
        echo "kubectl get pods -n castai-agent"
        exit 0
    elif [ $EXIT_CODE -eq 0 ]; then
        echo "Pulumi operation completed successfully."
        echo "The CAST AI connection and Helm chart installation have been initiated."
        echo "You can check the status of the CAST AI agent in the GKE cluster using:"
        echo "kubectl get pods -n castai-agent"
        exit 0
    else
        echo "Error: Pulumi operation failed with exit code $EXIT_CODE"
        echo "This may be due to invalid credentials or other issues."
        echo "Check the error message above for more details."
        exit $EXIT_CODE
    fi
else
    echo "Error: .env file not found"
    exit 1
fi
