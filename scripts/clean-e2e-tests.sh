#!/bin/bash
set -e

# Script to clean up e2e test resources created by the CAST AI Pulumi provider tests
# This script will destroy any Pulumi stacks created by the e2e tests

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
E2E_DIR="${ROOT_DIR}/e2e"

echo "🧹 Cleaning up e2e test resources..."

# Check if e2e directory exists
if [ ! -d "${E2E_DIR}" ]; then
    echo "E2E directory not found at ${E2E_DIR}. Nothing to clean."
    exit 0
fi

# Export all environment variables from root .env file
if [ -f "${ROOT_DIR}/.env" ]; then
    echo "Loading environment variables from repository root .env file"
    export $(grep -v '^#' "${ROOT_DIR}/.env" | xargs)
elif [ -f "${E2E_DIR}/.env" ]; then
    echo "Loading environment variables from e2e/.env file"
    export $(grep -v '^#' "${E2E_DIR}/.env" | xargs)
else
    echo "Warning: No .env file found. Make sure all required environment variables are set manually."
fi

# Find all test directories that might contain Pulumi stacks
TEST_DIRS=$(find "${E2E_DIR}/tests" -type d -mindepth 1 -maxdepth 1 2>/dev/null)

if [ -z "${TEST_DIRS}" ]; then
    echo "No test directories found in ${E2E_DIR}/tests. Nothing to clean."
else
    # For each test directory, try to destroy any stacks
    for TEST_DIR in ${TEST_DIRS}; do
        TEST_NAME=$(basename "${TEST_DIR}")
        echo "Checking for Pulumi stacks in ${TEST_NAME}..."
        
        # Change to the test directory
        pushd "${TEST_DIR}" > /dev/null
        
        # Check if there are any Pulumi stacks in this directory
        if [ -d ".pulumi" ] || [ -f "Pulumi.yaml" ]; then
            echo "Found Pulumi project in ${TEST_NAME}, destroying stacks..."
            
            # List all stacks for this project
            STACKS=$(pulumi stack ls --json 2>/dev/null | jq -r '.[].name' 2>/dev/null || echo "")
            
            if [ -n "${STACKS}" ]; then
                for STACK in ${STACKS}; do
                    echo "Destroying stack ${STACK} in ${TEST_NAME}..."
                    # Force destroy without confirmation
                    pulumi destroy -s "${STACK}" --yes --skip-preview || echo "Failed to destroy ${STACK}, continuing..."
                    
                    # Remove the stack
                    echo "Removing stack ${STACK}..."
                    pulumi stack rm "${STACK}" --yes || echo "Failed to remove ${STACK}, continuing..."
                done
            else
                echo "No stacks found in ${TEST_NAME}."
            fi
        else
            echo "No Pulumi project found in ${TEST_NAME}."
        fi
        
        popd > /dev/null
    done
fi

# Optionally, clean up temporary files created during tests
echo "Cleaning temporary files..."
find "${E2E_DIR}" -name "*.log" -type f -delete
find "${E2E_DIR}" -name "*.tmp" -type f -delete

# Remove the symbolic link to .env if it exists
if [ -L "${E2E_DIR}/.env" ]; then
    echo "Removing symbolic link to .env file..."
    rm -f "${E2E_DIR}/.env"
fi

echo "✅ E2E test resources cleanup complete!" 