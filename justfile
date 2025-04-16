# CAST AI Pulumi Provider Justfile
# Run 'just -l' to list available recipes

# Default task when running just without arguments
default: dev

# Set environment variables
export PULUMI_SKIP_UPDATE_CHECK := "true"
export WORKING_DIR := justfile_directory()
# Read version directly from version.txt - central source of truth
export VERSION := `cat version.txt | tr -d '\n'`

# Development workflow - builds and installs everything without cleaning first
dev: setup-env install-all-deps build-sdk-python build-sdk-typescript build-sdk-go install-provider install-examples-deps
    @echo "✅ Provider and SDKs successfully built and installed."
    @echo ""
    @echo "SDKs available at:"
    @echo "  - Python:     ./sdk/python"
    @echo "  - TypeScript: ./sdk/nodejs"
    @echo "  - Go:         ./sdk/go"
    @echo ""
    @echo "To use the SDKs in your projects:"
    @echo "  - Python:     pip install -e ./sdk/python"
    @echo "  - TypeScript: npm install ./sdk/nodejs"
    @echo "  - Go:         Add to go.mod:"
    @echo "                require github.com/castai/pulumi-castai/sdk/go v{{VERSION}}"
    @echo "                replace github.com/castai/pulumi-castai/sdk/go => /path/to/pulumi-castai/sdk/go"

# Full rebuild - cleans everything and then rebuilds
rebuild: clean dev

# Setup environment variables
setup-env:
    @echo "Running setup-env script..."
    @./scripts/setup-env.sh

# Install all dependencies
setup-deps:
    @echo "Installing dependencies..."
    @which pulumi >/dev/null || curl -fsSL https://get.pulumi.com | sh

# Build the provider
build-provider: setup-deps
    @echo "Building provider..."
    # Fix version placeholder in resources.go and version.go
    @echo "Fixing version placeholders..."
    find ./provider -type f -name "*.go" -exec sed -i 's/__VERSION__/{{VERSION}}/g' {} \;
    # Run go mod tidy in the provider directory first
    cd provider && /usr/local/go/bin/go mod tidy
    # Then build the provider
    GO=/usr/local/go/bin/go make provider

# Build the provider for all supported architectures
build-provider-all-archs: setup-deps
    @echo "Building provider for all supported architectures..."
    @mkdir -p bin release
    @./scripts/build-provider-binary.sh {{VERSION}} darwin amd64
    @./scripts/build-provider-binary.sh {{VERSION}} darwin arm64
    @./scripts/build-provider-binary.sh {{VERSION}} linux amd64
    @./scripts/build-provider-binary.sh {{VERSION}} linux arm64
    @./scripts/build-provider-binary.sh {{VERSION}} windows amd64
    @echo "✅ Provider built for all architectures. Release assets available in ./release/"

# Generate schema
generate-schema:
    @echo "Generating schema..."
    make build_schema

# Build all SDKs
build-sdks:
    @echo "Building SDKs..."
    make build_sdks

# Build Python SDK
build-python:
    @echo "Building Python SDK..."
    make build_python

# Build Node.js SDK
build-nodejs:
    @echo "Building Node.js SDK..."
    make build_nodejs

# Build Go SDK
build-go:
    @echo "Building Go SDK..."
    make build_go

# Install the provider with proper metadata
install-provider: build-provider
    @echo "Installing provider plugin..."
    # Use pulumi plugin install consistently
    pulumi plugin install resource castai {{VERSION}} --file ./bin/pulumi-resource-castai --reinstall
    @echo "Provider plugin installed successfully."

# Install the provider for a specific architecture
install-provider-arch GOOS="" GOARCH="":
    @if [ -z "{{GOOS}}" ] || [ -z "{{GOARCH}}" ]; then \
        echo "Error: GOOS and GOARCH must be specified."; \
        echo "Usage: just install-provider-arch <GOOS> <GOARCH>"; \
        echo "Example: just install-provider-arch darwin arm64"; \
        exit 1; \
    fi
    @echo "Installing provider for {{GOOS}}-{{GOARCH}}..."
    @./scripts/install-provider-for-arch.sh {{VERSION}} {{GOOS}} {{GOARCH}}

# Install the provider for the current system architecture
install-provider-current-arch:
    @echo "Installing provider for the current system architecture..."
    @GOOS=$(go env GOOS) GOARCH=$(go env GOARCH) ./scripts/install-provider-for-arch.sh {{VERSION}} $(go env GOOS) $(go env GOARCH)

# Install SDKs locally
install-sdks-local:
    @echo "Installing SDKs locally..."
    @echo "Python SDK: sdk/python"
    @echo "TypeScript SDK: sdk/nodejs"
    @echo "Go SDK: sdk/go"
    @echo ""
    @echo "To use Python SDK: pip install -e ./sdk/python"
    @echo "To use TypeScript SDK: npm install ./sdk/nodejs"
    @echo "To use Go SDK: add replace directive to go.mod"

# Clean build artifacts and all dependencies
clean:
    @echo "🧹 Performing thorough cleanup..."
    # Clean build artifacts
    make clean
    # Clean node modules and yarn cache
    @echo "Cleaning Node.js dependencies..."
    rm -rf node_modules
    rm -rf examples/*/node_modules
    rm -rf sdk/nodejs/node_modules
    yarn cache clean
    # Clean Python artifacts and virtual environments
    @echo "Cleaning Python artifacts..."
    find . -type d -name "__pycache__" -exec rm -rf {} +
    find . -type f -name "*.pyc" -delete
    find . -type f -name "*.pyo" -delete
    find . -type f -name "*.pyd" -delete
    find . -type f -name ".coverage" -delete
    find . -type d -name "*.egg-info" -exec rm -rf {} +
    find . -type d -name "*.egg" -exec rm -rf {} +
    find . -type d -name ".pytest_cache" -exec rm -rf {} +
    find . -type d -name ".mypy_cache" -exec rm -rf {} +
    find . -type d -name ".ruff_cache" -exec rm -rf {} +
    find . -type d -name "venv" -exec rm -rf {} +
    find . -type d -name ".venv" -exec rm -rf {} +
    find . -type d -name "env" -exec rm -rf {} +
    # Clean Go artifacts
    @echo "Cleaning Go artifacts..."
    find . -type d -name ".go" -exec rm -rf {} +
    find . -type f -name "*.out" -delete
    # Clean Pulumi artifacts
    @echo "Cleaning Pulumi artifacts..."
    rm -rf ~/.pulumi/plugins/resource-castai-*
    rm -rf ~/.pulumi/plugins/pulumi-resource-castai-*
    rm -rf ~/.pulumi/plugins/pulumi-tfgen-castai-*
    # Clean local bin directory
    @echo "Cleaning local bin directory..."
    rm -rf bin/
    # Clean generated SDKs
    @echo "Cleaning generated SDKs..."
    rm -rf sdk/
    # Clean schema files
    @echo "Cleaning schema files..."
    rm -f schema.json
    rm -f provider/cmd/pulumi-resource-castai/schema.json
    # Clean documentation
    @echo "Cleaning documentation..."
    rm -rf docs/
    rm -rf provider/docs/
    @echo "✅ Cleanup complete! All build artifacts, dependencies, and installations have been removed."

# Verify plugin installation
verify-plugin:
    @./scripts/verify-plugin.sh {{VERSION}}

# Create a new example project
create-example project_type="python" project_name="example":
    @echo "Running create-example script for {{project_type}} project '{{project_name}}'..."
    @./scripts/create-example.sh "{{project_type}}" "{{project_name}}"

# Show help
help:
    @just --list

# Build Python SDK only
build-sdk-python: build-provider
    @echo "Running build-sdk-python script..."
    @./scripts/build-sdk-python.sh

# Build TypeScript SDK only
build-sdk-typescript: build-provider
    @echo "Running build-sdk-typescript script..."
    @./scripts/build-sdk-typescript.sh {{VERSION}}

# Build Go SDK only
build-sdk-go: build-provider
    @echo "Running build-sdk-go script..."
    @./scripts/build-sdk-go.sh {{VERSION}}

# Run Python GCP example
run-python-gcp-example:
    @echo "Running Python GCP example..."
    @./scripts/run-python-gcp-example.sh

# Run Python AWS example
run-python-aws-example:
    @echo "Running Python AWS example..."
    @./scripts/run-python-aws-example.sh

# Run Python Azure example
run-python-azure-example:
    @echo "Running Python Azure example..."
    @./scripts/run-python-azure-example.sh

# Run Go GCP example
run-go-gcp-example:
    @echo "Running Go GCP example..."
    @./scripts/run-go-gcp-example.sh

# Run Go AWS example
run-go-aws-example:
    @echo "Running Go AWS example..."
    @./scripts/run-go-aws-example.sh

# Run Go Azure example
run-go-azure-example:
    @echo "Running Go Azure example..."
    @./scripts/run-go-azure-example.sh

# Run TypeScript GCP example without rebuilding the provider
run-typescript-gcp-example:
    @echo "Running TypeScript GCP example..."
    @./scripts/run-typescript-gcp-example.sh

# Run TypeScript AWS example without rebuilding the provider
run-typescript-aws-example:
    @echo "Running TypeScript AWS example..."
    @./scripts/run-typescript-aws-example.sh

# Run TypeScript Azure example without rebuilding the provider
run-typescript-azure-example:
    @echo "Running TypeScript Azure example..."
    @./scripts/run-typescript-azure-example.sh

# Run all Python examples
run-python-examples: run-python-gcp-example run-python-aws-example run-python-azure-example
    @echo "All Python examples have been run."

# Run all Go examples
run-go-examples: run-go-gcp-example run-go-aws-example run-go-azure-example
    @echo "All Go examples have been run."

# Run all TypeScript examples without rebuilding
run-typescript-examples: run-typescript-gcp-example run-typescript-aws-example run-typescript-azure-example
    @echo "All TypeScript examples have been run."

# This command has been removed as we're separating build and run operations

# Run examples for all languages
run-all-language-examples: run-python-examples run-go-examples run-typescript-examples
    @echo "Examples for all languages have been run."

# Run end-to-end tests
run-e2e-tests:
    @echo "Running end-to-end tests..."
    @./scripts/run-e2e-tests.sh

# Install all system dependencies
install-all-deps: setup-deps
    @echo "Running install-all-deps script..."
    @./scripts/install-all-deps.sh

# Install dependencies for examples
install-examples-deps:
    @echo "Running install-examples-deps script..."
    @./scripts/install-examples-deps.sh

# Install dependencies for TypeScript examples only
install-typescript-examples-deps:
    @echo "Installing TypeScript example dependencies..."
    @./scripts/install-examples-deps.sh typescript

# Run specific e2e test
run-e2e-test test_name:
    @echo "Running specific e2e test: {{test_name}}..."
    @./scripts/run-e2e-tests.sh "{{test_name}}"

# Run all e2e tests for all languages and cloud providers
run-all-e2e-tests:
    @echo "Running all e2e tests for all languages and cloud providers..."
    @./scripts/run-e2e-tests.sh

# Run e2e tests for a specific language
run-e2e-tests-language language:
    @echo "Running e2e tests for {{language}}..."
    @if [ "{{language}}" = "go" ]; then \
        just run-go-examples; \
    elif [ "{{language}}" = "python" ]; then \
        just run-python-examples; \
    elif [ "{{language}}" = "typescript" ]; then \
        just run-typescript-examples; \
    else \
        echo "Unknown language: {{language}}. Supported languages: go, python, typescript"; \
        exit 1; \
    fi

# Run e2e tests for a specific cloud provider
run-e2e-tests-provider provider:
    @echo "Running e2e tests for {{provider}}..."
    @if [ "{{provider}}" = "aws" ]; then \
        just run-typescript-aws-example; \
        just run-python-aws-example; \
        just run-go-aws-example; \
    elif [ "{{provider}}" = "gcp" ]; then \
        just run-typescript-gcp-example; \
        just run-python-gcp-example; \
        just run-go-gcp-example; \
    elif [ "{{provider}}" = "azure" ]; then \
        just run-typescript-azure-example; \
        just run-python-azure-example; \
        just run-go-azure-example; \
    else \
        echo "Unknown provider: {{provider}}. Supported providers: aws, gcp, azure"; \
        exit 1; \
    fi

# No setup or cleanup needed for e2e tests

# Update all dependencies
update-deps:
    @echo "Updating all dependencies..."
    @cd provider && go get -u ./...
    @cd provider && go mod tidy
    @cd examples/go && go get -u ./...
    @cd examples/go && go mod tidy
    @cd e2e && go get -u ./...
    @cd e2e && go mod tidy
    @echo "All dependencies updated."

# Update the golang.org/x/crypto dependency to the latest version
update-crypto-deps:
    @echo "Updating golang.org/x/crypto dependency to the latest version..."
    @./scripts/update-crypto-dependency.sh
    @echo "golang.org/x/crypto dependency updated."

# Fix npm package.json and sync with version.txt
fix-npm-package version="":
    @echo "Fixing npm package.json and syncing with version.txt..."
    @if [ -z "{{version}}" ]; then \
        ./scripts/fix-npm-package.sh; \
    else \
        ./scripts/fix-npm-package.sh "{{version}}"; \
    fi
    @echo "Note: If you're providing a new version, both version.txt and package.json will be updated."