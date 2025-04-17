#!/usr/bin/env bash
# This script runs end-to-end tests for the CAST AI Pulumi provider
# It tests connecting clusters to CAST AI for all cloud providers in all languages

set -e

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Error: .env file not found"
    echo "Please create a .env file with the required environment variables"
    exit 1
fi

# Source environment variables
source .env

# Check for required environment variables
required_vars=(
    "PULUMI_CONFIG_PASSPHRASE"
    "CASTAI_API_TOKEN"
    "CASTAI_API_URL"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    echo "Error: Missing required environment variables: ${missing_vars[*]}"
    exit 1
fi

# Function to run a test
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo "========================================"
    echo "Running test: $test_name"
    echo "========================================"
    
    if $test_command; then
        echo "✅ Test passed: $test_name"
        return 0
    else
        echo "❌ Test failed: $test_name"
        return 1
    fi
}

# Run TypeScript tests
run_typescript_tests() {
    echo "========================================"
    echo "Running TypeScript tests"
    echo "========================================"
    
    # GCP
    if [ ! -z "$GCP_PROJECT_ID" ] && [ ! -z "$GOOGLE_CREDENTIALS" ]; then
        run_test "TypeScript GCP" "just run-typescript-gcp-example"
    else
        echo "⚠️ Skipping TypeScript GCP test: Missing GCP credentials"
    fi
    
    # AWS
    if [ ! -z "$AWS_ACCESS_KEY_ID" ] && [ ! -z "$AWS_SECRET_ACCESS_KEY" ] && [ ! -z "$AWS_REGION" ]; then
        run_test "TypeScript AWS" "just run-typescript-aws-example"
    else
        echo "⚠️ Skipping TypeScript AWS test: Missing AWS credentials"
    fi
    
    # Azure
    if [ ! -z "$AZURE_SUBSCRIPTION_ID" ] && [ ! -z "$AZURE_TENANT_ID" ] && [ ! -z "$AZURE_RESOURCE_GROUP" ]; then
        run_test "TypeScript Azure" "just run-typescript-azure-example"
    else
        echo "⚠️ Skipping TypeScript Azure test: Missing Azure credentials"
    fi
}

# Run Python tests
run_python_tests() {
    echo "========================================"
    echo "Running Python tests"
    echo "========================================"
    
    # GCP
    if [ ! -z "$GCP_PROJECT_ID" ] && [ ! -z "$GOOGLE_CREDENTIALS" ]; then
        run_test "Python GCP" "just run-python-gcp-example"
    else
        echo "⚠️ Skipping Python GCP test: Missing GCP credentials"
    fi
    
    # AWS
    if [ ! -z "$AWS_ACCESS_KEY_ID" ] && [ ! -z "$AWS_SECRET_ACCESS_KEY" ] && [ ! -z "$AWS_REGION" ]; then
        run_test "Python AWS" "just run-python-aws-example"
    else
        echo "⚠️ Skipping Python AWS test: Missing AWS credentials"
    fi
    
    # Azure
    if [ ! -z "$AZURE_SUBSCRIPTION_ID" ] && [ ! -z "$AZURE_TENANT_ID" ] && [ ! -z "$AZURE_RESOURCE_GROUP" ]; then
        run_test "Python Azure" "just run-python-azure-example"
    else
        echo "⚠️ Skipping Python Azure test: Missing Azure credentials"
    fi
}

# Run Go tests
run_go_tests() {
    echo "========================================"
    echo "Running Go tests"
    echo "========================================"
    
    # GCP
    if [ ! -z "$GCP_PROJECT_ID" ] && [ ! -z "$GOOGLE_CREDENTIALS" ]; then
        run_test "Go GCP" "just run-go-gcp-example"
    else
        echo "⚠️ Skipping Go GCP test: Missing GCP credentials"
    fi
    
    # AWS
    if [ ! -z "$AWS_ACCESS_KEY_ID" ] && [ ! -z "$AWS_SECRET_ACCESS_KEY" ] && [ ! -z "$AWS_REGION" ]; then
        run_test "Go AWS" "just run-go-aws-example"
    else
        echo "⚠️ Skipping Go AWS test: Missing AWS credentials"
    fi
    
    # Azure
    if [ ! -z "$AZURE_SUBSCRIPTION_ID" ] && [ ! -z "$AZURE_TENANT_ID" ] && [ ! -z "$AZURE_RESOURCE_GROUP" ]; then
        run_test "Go Azure" "just run-go-azure-example"
    else
        echo "⚠️ Skipping Go Azure test: Missing Azure credentials"
    fi
}

# Main function
main() {
    echo "========================================"
    echo "Running CAST AI Pulumi Provider E2E Tests"
    echo "========================================"
    
    # Build the provider
    echo "Building the provider..."
    just clean && just dev
    
    # Run tests for each language
    run_typescript_tests
    run_python_tests
    run_go_tests
    
    echo "========================================"
    echo "All tests completed"
    echo "========================================"
}

# Run the main function
main
