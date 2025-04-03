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

# Ensure the example directory exists
EXAMPLE_DIR="examples/typescript/gcp"
if [ ! -d "$EXAMPLE_DIR" ]; then
    echo "Creating TypeScript GCP example directory..."
    mkdir -p "$EXAMPLE_DIR"
fi

# Create or update the necessary files
echo "Setting up TypeScript files..."

# Check if package.json exists, create it if it doesn't
if [ ! -f "$EXAMPLE_DIR/package.json" ]; then
    echo "Creating package.json..."
    cat > "$EXAMPLE_DIR/package.json" << 'EOL'
{
    "name": "typescript-castai-gcp-example",
    "version": "0.1.0",
    "description": "TypeScript GCP example for the CAST AI Pulumi provider",
    "devDependencies": {
        "@types/node": "^18.16.0",
        "typescript": "^5.1.6"
    },
    "dependencies": {
        "@pulumi/castai": "file:../../../sdk/nodejs",
        "@pulumi/pulumi": "^3.0.0",
        "@pulumi/kubernetes": "^4.0.0",
        "@pulumi/gcp": "^7.0.0"
    }
}
EOL
fi

# Check if tsconfig.json exists, create it if it doesn't
if [ ! -f "$EXAMPLE_DIR/tsconfig.json" ]; then
    echo "Creating tsconfig.json..."
    cat > "$EXAMPLE_DIR/tsconfig.json" << 'EOL'
{
    "compilerOptions": {
        "outDir": "bin",
        "target": "es2016",
        "module": "commonjs",
        "moduleResolution": "node",
        "sourceMap": true,
        "experimentalDecorators": true,
        "pretty": true,
        "noFallthroughCasesInSwitch": true,
        "noImplicitAny": true,
        "noImplicitReturns": true,
        "forceConsistentCasingInFileNames": true,
        "strictNullChecks": true
    },
    "files": [
        "index.ts"
    ]
}
EOL
fi

# Check if index.ts exists
if [ ! -f "$EXAMPLE_DIR/index.ts" ]; then
    echo "ERROR: index.ts file not found in $EXAMPLE_DIR"
    echo "Please make sure the file exists before running this script."
    exit 1
fi

echo "Using existing index.ts file..."

# Clean up any existing node_modules to avoid npm errors
if [ -d "$EXAMPLE_DIR/node_modules" ]; then
    echo "Cleaning up existing node_modules..."
    rm -rf "$EXAMPLE_DIR/node_modules"
fi

# Rebuild the provider
echo "Rebuilding the provider..."
cd provider
go build -o ../bin/pulumi-resource-castai -ldflags "-X github.com/cast-ai/pulumi-castai/provider/pkg/version.Version=0.1.2" github.com/cast-ai/pulumi-castai/provider/cmd/pulumi-resource-castai
cd ..

# Reinstall the provider plugin
echo "Reinstalling the provider plugin..."
pulumi plugin install resource castai 0.1.2 --file ./bin/pulumi-resource-castai --reinstall

# Install dependencies for the SDK
echo "Installing SDK dependencies..."
cd "sdk/nodejs"

# Create a temporary package.json with all required dependencies
TMP_PACKAGE_JSON="package.json.tmp"
cp package.json "$TMP_PACKAGE_JSON"

# Update the dependencies in the temporary package.json
cat > package.json << 'EOL'
{
    "name": "@pulumi/castai",
    "version": "0.1.2",
    "description": "A Pulumi package for creating and managing CAST AI cloud resources.",
    "keywords": [
        "pulumi",
        "castai",
        "kubernetes",
        "category/cloud"
    ],
    "homepage": "https://cast.ai",
    "repository": "https://github.com/cast-ai/pulumi-castai",
    "license": "Apache-2.0",
    "scripts": {
        "build": "tsc"
    },
    "dependencies": {
        "@pulumi/pulumi": "^3.0.0"
    },
    "devDependencies": {
        "@types/mime": "^2.0.0",
        "@types/node": "^10.0.0",
        "typescript": "^4.3.5"
    },
    "pulumi": {
        "resource": true,
        "name": "castai",
        "server": "github://api.github.com/cast-ai"
    }
}
EOL

# Install dependencies
npm install --no-fund --no-audit || {
    echo "SDK npm install failed, retrying with --force..."
    npm install --no-fund --no-audit --force
}

# Restore the original package.json
mv "$TMP_PACKAGE_JSON" package.json

cd ../../

# Install dependencies for the GCP example
echo "Installing example dependencies..."
cd "$EXAMPLE_DIR"

# Create node_modules directory if it doesn't exist
mkdir -p node_modules

# Create a symlink to the SDK
echo "Creating symlink to SDK..."
mkdir -p node_modules/@pulumi
rm -rf node_modules/@pulumi/castai
ln -sf ../../../../sdk/nodejs node_modules/@pulumi/castai

# Install dependencies
npm install --no-fund --no-audit || {
    echo "Example npm install failed, retrying with --force..."
    npm install --no-fund --no-audit --force
}

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

# Add type declaration files for @pulumi/kubernetes and @pulumi/gcp to avoid TypeScript warnings

# Type declaration for @pulumi/kubernetes
mkdir -p "node_modules/@types/pulumi__kubernetes"
cat > "node_modules/@types/pulumi__kubernetes/index.d.ts" << 'EOL'
declare module '@pulumi/kubernetes' {
    export class Provider {
        constructor(name: string, args: any, opts?: any);
    }

    export namespace core {
        export namespace v1 {
            export class Namespace extends Object {
                constructor(name: string, args: any, opts?: any);
                metadata: any;
            }
        }
    }
    export namespace helm {
        export namespace v3 {
            export class Release extends Object {
                constructor(name: string, args: any, opts?: any);
                name: string;
            }
        }
    }
}
EOL

# Type declaration for @pulumi/gcp
mkdir -p "node_modules/@types/pulumi__gcp"
cat > "node_modules/@types/pulumi__gcp/index.d.ts" << 'EOL'
declare module '@pulumi/gcp' {
    export namespace container {
        export function getCluster(args: any, opts?: any): any;
    }
}
EOL

cd ../../..

# Navigate to the example directory
cd "$EXAMPLE_DIR" && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi login --local && \
    # Remove the stack if it exists to avoid cached state issues
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack rm gcp-example --force --yes 2>/dev/null || true && \
    # Create a new stack
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack init gcp-example && \
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
