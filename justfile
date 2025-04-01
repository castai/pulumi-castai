# CAST AI Pulumi Provider Justfile
# Run 'just -l' to list available recipes

# Default task when running just without arguments
default: dev

# Set environment variables
export PULUMI_SKIP_UPDATE_CHECK := "true"
export WORKING_DIR := justfile_directory()
# Read version directly from version.txt - central source of truth
export VERSION := `cat version.txt | tr -d '\n'`

# Complete development workflow - cleans and rebuilds everything
dev: clean setup-env install-all-deps build-sdk-python build-sdk-typescript build-sdk-go install-provider install-examples-deps
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
    @echo "                require github.com/cast-ai/pulumi-castai/sdk/go v{{VERSION}}"
    @echo "                replace github.com/cast-ai/pulumi-castai/sdk/go => /path/to/pulumi-castai/sdk/go"

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

# Run GCP example
run-gcp-example:
    @echo "Running run-gcp-example script..."
    @./scripts/run-gcp-example.sh

# Run AWS example
run-aws-example:
    @echo "Running run-aws-example script..."
    @./scripts/run-aws-example.sh

# Run Azure example
run-azure-example:
    @echo "Running run-azure-example script..."
    @./scripts/run-azure-example.sh

# Run all cloud examples
run-all-examples: run-gcp-example run-aws-example run-azure-example
    @echo "All cloud examples have been run."

# Install all system dependencies
install-all-deps: setup-deps
    @echo "Running install-all-deps script..."
    @./scripts/install-all-deps.sh

# Install dependencies for examples
install-examples-deps:
    @echo "Running install-examples-deps script..."
    @./scripts/install-examples-deps.sh

# Run end-to-end tests
run-e2e-tests test_pattern="*": setup-e2e-tests
    @echo "Running end-to-end tests (pattern: {{test_pattern}})..."
    @./scripts/run-e2e-tests.sh "{{test_pattern}}"

# Run specific e2e test
run-e2e-test test_name:
    @echo "Running specific e2e test: {{test_name}}..."
    @./scripts/run-e2e-tests.sh "{{test_name}}"

# Create e2e test environment
setup-e2e-tests:
    @echo "Setting up e2e test environment..."
    @./scripts/setup-e2e-tests.sh

# Clean e2e test resources
clean-e2e-tests:
    @echo "Cleaning e2e test resources..."
    @./scripts/clean-e2e-tests.sh 