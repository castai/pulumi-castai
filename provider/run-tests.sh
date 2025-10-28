#!/bin/bash
# Provider Test runner script for CAST AI Pulumi provider
# Runs Go provider tests

set -e

# Change to provider directory (where this script is located)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}CAST AI Provider - Test Suite${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Parse arguments
COVERAGE=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --coverage)
            COVERAGE=true
            shift
            ;;
        --verbose|-v)
            VERBOSE=true
            shift
            ;;
        --help)
            echo "Usage: ./run-tests.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --coverage          Generate coverage reports"
            echo "  --verbose, -v       Run tests in verbose mode"
            echo "  --help              Show this help message"
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

echo -e "${BLUE}Running Provider Tests...${NC}"
echo "-----------------------------------"

# Check if go.sum exists, if not run go mod tidy
if [ ! -f "go.sum" ]; then
    echo -e "${YELLOW}go.sum not found. Running go mod tidy...${NC}"
    go mod tidy
fi

# Build test flags
TEST_FLAGS="-count=1"
if [ "$VERBOSE" = true ]; then
    TEST_FLAGS="$TEST_FLAGS -v"
fi

# Run tests
if [ "$COVERAGE" = true ]; then
    go test $TEST_FLAGS -cover -coverprofile=coverage.out ./... || EXIT_CODE=$?
    if [ ${EXIT_CODE:-0} -eq 0 ]; then
        go tool cover -html=coverage.out -o coverage.html
        echo -e "${GREEN}Coverage report: provider/coverage.html${NC}"
    fi
else
    go test $TEST_FLAGS ./... || EXIT_CODE=$?
fi

echo ""
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}Provider Test Summary${NC}"
echo -e "${BLUE}======================================${NC}"

if [ ${EXIT_CODE:-0} -eq 0 ]; then
    echo -e "Provider Tests: ${GREEN}✅ PASSED${NC}"
    echo ""
    echo -e "${GREEN}All provider tests passed!${NC}"
    exit 0
else
    echo -e "Provider Tests: ${RED}❌ FAILED${NC}"
    echo ""
    echo -e "${RED}Provider tests failed!${NC}"
    exit 1
fi
