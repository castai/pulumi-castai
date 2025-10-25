#!/bin/bash
# Test runner script for CAST AI Pulumi provider
# Runs all mock tests without requiring cloud credentials

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}CAST AI Pulumi Provider - Test Suite${NC}"
echo -e "${BLUE}======================================${NC}"
echo ""

# Parse arguments
RUN_PYTHON=true
RUN_TYPESCRIPT=true
RUN_GO=true
COVERAGE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --python-only)
            RUN_TYPESCRIPT=false
            RUN_GO=false
            shift
            ;;
        --typescript-only)
            RUN_PYTHON=false
            RUN_GO=false
            shift
            ;;
        --go-only)
            RUN_PYTHON=false
            RUN_TYPESCRIPT=false
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --help)
            echo "Usage: ./run-tests.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --python-only       Run only Python tests"
            echo "  --typescript-only   Run only TypeScript tests"
            echo "  --go-only           Run only Go tests"
            echo "  --coverage          Generate coverage reports"
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

PYTHON_EXIT=0
TYPESCRIPT_EXIT=0
GO_EXIT=0

# Run Python tests
if [ "$RUN_PYTHON" = true ]; then
    echo -e "${BLUE}Running Python Tests...${NC}"
    echo "-----------------------------------"

    cd python

    # Check if pytest is installed
    if ! command -v pytest &> /dev/null; then
        echo -e "${YELLOW}pytest not found. Installing dependencies...${NC}"
        pip install -r requirements.txt
    fi

    # Run tests
    if [ "$COVERAGE" = true ]; then
        pytest -v --cov --cov-report=term --cov-report=html || PYTHON_EXIT=$?
        if [ $PYTHON_EXIT -eq 0 ]; then
            echo -e "${GREEN}Coverage report: python/htmlcov/index.html${NC}"
        fi
    else
        pytest -v || PYTHON_EXIT=$?
    fi

    cd ..
    echo ""
fi

# Run TypeScript tests
if [ "$RUN_TYPESCRIPT" = true ]; then
    echo -e "${BLUE}Running TypeScript Tests...${NC}"
    echo "-----------------------------------"

    cd typescript

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}node_modules not found. Installing dependencies...${NC}"
        npm install
    fi

    # Run tests
    if [ "$COVERAGE" = true ]; then
        npm run test:coverage || TYPESCRIPT_EXIT=$?
        if [ $TYPESCRIPT_EXIT -eq 0 ]; then
            echo -e "${GREEN}Coverage report: typescript/coverage/index.html${NC}"
        fi
    else
        npm test || TYPESCRIPT_EXIT=$?
    fi

    cd ..
    echo ""
fi

# Run Go tests
if [ "$RUN_GO" = true ]; then
    echo -e "${BLUE}Running Go Tests...${NC}"
    echo "-----------------------------------"

    cd go

    # Check if go.sum exists, if not run go mod tidy
    if [ ! -f "go.sum" ]; then
        echo -e "${YELLOW}go.sum not found. Running go mod tidy...${NC}"
        go mod tidy
    fi

    # Run tests
    if [ "$COVERAGE" = true ]; then
        go test -v -cover -coverprofile=coverage.out ./... || GO_EXIT=$?
        if [ $GO_EXIT -eq 0 ]; then
            go tool cover -html=coverage.out -o coverage.html
            echo -e "${GREEN}Coverage report: go/coverage.html${NC}"
        fi
    else
        go test -v ./... || GO_EXIT=$?
    fi

    cd ..
    echo ""
fi

# Summary
echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}======================================${NC}"

if [ "$RUN_PYTHON" = true ]; then
    if [ $PYTHON_EXIT -eq 0 ]; then
        echo -e "Python:     ${GREEN}✅ PASSED${NC}"
    else
        echo -e "Python:     ${RED}❌ FAILED${NC}"
    fi
fi

if [ "$RUN_TYPESCRIPT" = true ]; then
    if [ $TYPESCRIPT_EXIT -eq 0 ]; then
        echo -e "TypeScript: ${GREEN}✅ PASSED${NC}"
    else
        echo -e "TypeScript: ${RED}❌ FAILED${NC}"
    fi
fi

if [ "$RUN_GO" = true ]; then
    if [ $GO_EXIT -eq 0 ]; then
        echo -e "Go:         ${GREEN}✅ PASSED${NC}"
    else
        echo -e "Go:         ${RED}❌ FAILED${NC}"
    fi
fi

echo ""

# Exit with error if any tests failed
if [ $PYTHON_EXIT -ne 0 ] || [ $TYPESCRIPT_EXIT -ne 0 ] || [ $GO_EXIT -ne 0 ]; then
    echo -e "${RED}Some tests failed!${NC}"
    exit 1
else
    echo -e "${GREEN}All tests passed!${NC}"
    exit 0
fi
