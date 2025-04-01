#!/bin/bash
set -e

# Script to run e2e tests for the CAST AI Pulumi provider
# Usage: ./scripts/run-e2e-tests.sh [test pattern]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
E2E_DIR="${ROOT_DIR}/e2e"
TEST_PATTERN=${1:-"*"}

echo "🧪 Running e2e tests with pattern: ${TEST_PATTERN}"

# Make sure the e2e directory exists
if [ ! -d "${E2E_DIR}" ]; then
    echo "Error: e2e directory not found at ${E2E_DIR}"
    echo "Run 'just setup-e2e-tests' first to set up the e2e test environment"
    exit 1
fi

# Ensure we're using the local provider
PROVIDER_VERSION=$(cat "${ROOT_DIR}/version.txt" | tr -d '\n')
INSTALLED_PROVIDER=$(pulumi plugin ls | grep "resource castai" | grep "${PROVIDER_VERSION}" || echo "")

if [ -z "${INSTALLED_PROVIDER}" ]; then
    echo "Local provider not found, installing..."
    pushd "${ROOT_DIR}" > /dev/null
    just build-provider
    just install-provider
    popd > /dev/null
else
    echo "Using local provider: castai v${PROVIDER_VERSION}"
fi

# Export all environment variables from root .env file
if [ -f "${ROOT_DIR}/.env" ]; then
    echo "Loading environment variables from repository root .env file"
    export $(grep -v '^#' "${ROOT_DIR}/.env" | xargs)
elif [ -f "${E2E_DIR}/.env" ]; then
    echo "Loading environment variables from e2e/.env file"
    export $(grep -v '^#' "${E2E_DIR}/.env" | xargs)
else
    echo "Warning: No .env file found in repository root or e2e directory. Make sure all required environment variables are set manually."
fi

# Move to the e2e directory
pushd "${E2E_DIR}" > /dev/null

FAILED_TESTS=()
SUCCESS_COUNT=0
TOTAL_COUNT=0

# Run tests using Go with the requested pattern
echo "Running Go tests in e2e directory..."

# Discover test functions matching the pattern
TEST_FUNCS=$(go test -list "Test.*${TEST_PATTERN}.*" ./... 2>/dev/null | grep "^Test" || echo "")

if [ -z "${TEST_FUNCS}" ]; then
    echo "No tests found matching pattern: ${TEST_PATTERN}"
    exit 1
fi

# Run each test individually so a failure doesn't stop other tests
for TEST_FUNC in ${TEST_FUNCS}; do
    echo -e "\n🧪 Running test: ${TEST_FUNC}"
    TOTAL_COUNT=$((TOTAL_COUNT + 1))
    
    # Run the test with a timeout and continue on error
    if go test -v -timeout 30m -run "^${TEST_FUNC}$" ./...; then
        echo "✅ Test passed: ${TEST_FUNC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo "❌ Test failed: ${TEST_FUNC}"
        FAILED_TESTS+=("${TEST_FUNC}")
    fi
done

popd > /dev/null

# Summarize results
echo -e "\n-----------------------------------------"
echo "📋 E2E Test Summary:"
echo "-----------------------------------------"
echo "Total tests:  ${TOTAL_COUNT}"
echo "Passed:       ${SUCCESS_COUNT}"
echo "Failed:       ${#FAILED_TESTS[@]}"

if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
    echo -e "\n❌ The following tests failed:"
    for TEST_NAME in "${FAILED_TESTS[@]}"; do
        echo "   - ${TEST_NAME}"
    done
    exit 1
else
    echo -e "\n✅ All tests passed successfully!"
    exit 0
fi 