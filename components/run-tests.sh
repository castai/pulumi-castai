#!/bin/bash
# Component Test runner script for CAST AI Pulumi provider
# Runs tests for all Pulumi components

set -e

# Change to components directory (where this script is located)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}CAST AI Components - Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Parse arguments
COVERAGE=false
COMPONENT=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --coverage)
            COVERAGE=true
            shift
            ;;
        --component)
            COMPONENT="$2"
            shift 2
            ;;
        --help)
            echo "Usage: ./run-tests.sh [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --coverage          Generate coverage reports"
            echo "  --component NAME    Run tests for specific component only"
            echo "  --help              Show this help message"
            echo ""
            echo "Available components:"
            find . -type d -name "tests" | grep -v node_modules | grep -v bin | sed 's|./||' | sed 's|/tests||' | sed 's|^|  - |'
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Discover all components with tests
COMPONENTS=()
if [ -n "$COMPONENT" ]; then
    # Run specific component
    if [ -d "$COMPONENT" ]; then
        COMPONENTS=("$COMPONENT")
    else
        echo -e "${RED}Component not found: $COMPONENT${NC}"
        exit 1
    fi
else
    # Discover all components
    while IFS= read -r component_path; do
        component_dir=$(dirname "$component_path")
        COMPONENTS+=("$component_dir")
    done < <(find . -type d -name "tests" -not -path "*/node_modules/*" -not -path "*/bin/*" | sort)
fi

if [ ${#COMPONENTS[@]} -eq 0 ]; then
    echo -e "${YELLOW}No components with tests found.${NC}"
    exit 0
fi

TOTAL_EXIT=0
RESULTS=()

# Run tests for each component
for component in "${COMPONENTS[@]}"; do
    component_name=$(echo "$component" | sed 's|^\./||')
    echo -e "${BLUE}Testing Component: ${component_name}${NC}"
    echo "-----------------------------------"

    if [ ! -d "$component/tests" ]; then
        echo -e "${YELLOW}No tests directory found for $component_name${NC}"
        RESULTS+=("${component_name}:SKIPPED")
        continue
    fi

    cd "$component"

    # Detect component type and run appropriate tests
    if [ -f "package.json" ]; then
        # TypeScript/JavaScript component
        echo -e "${BLUE}Running TypeScript tests for ${component_name}...${NC}"

        # Check if node_modules exists
        if [ ! -d "node_modules" ]; then
            echo -e "${YELLOW}node_modules not found. Installing dependencies...${NC}"
            npm install
        fi

        # Run tests
        if [ "$COVERAGE" = true ]; then
            npm run test:coverage || EXIT_CODE=$?
        else
            npm test || EXIT_CODE=$?
        fi

    elif [ -f "go.mod" ]; then
        # Go component
        echo -e "${BLUE}Running Go tests for ${component_name}...${NC}"

        if [ ! -f "go.sum" ]; then
            echo -e "${YELLOW}go.sum not found. Running go mod tidy...${NC}"
            go mod tidy
        fi

        if [ "$COVERAGE" = true ]; then
            go test -v -cover -coverprofile=coverage.out ./... || EXIT_CODE=$?
        else
            go test -v ./... || EXIT_CODE=$?
        fi

    elif [ -f "requirements.txt" ]; then
        # Python component
        echo -e "${BLUE}Running Python tests for ${component_name}...${NC}"

        if [ "$COVERAGE" = true ]; then
            pytest -v --cov --cov-report=term --cov-report=html || EXIT_CODE=$?
        else
            pytest -v || EXIT_CODE=$?
        fi
    else
        echo -e "${YELLOW}Unknown component type for ${component_name}${NC}"
        RESULTS+=("${component_name}:UNKNOWN")
        cd "$SCRIPT_DIR"
        continue
    fi

    if [ ${EXIT_CODE:-0} -eq 0 ]; then
        RESULTS+=("${component_name}:PASSED")
    else
        RESULTS+=("${component_name}:FAILED")
        TOTAL_EXIT=1
    fi

    EXIT_CODE=0
    cd "$SCRIPT_DIR"
    echo ""
done

# Summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Component Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"

for result in "${RESULTS[@]}"; do
    component_name="${result%%:*}"
    status="${result##*:}"

    case $status in
        PASSED)
            echo -e "${component_name}: ${GREEN}✅ PASSED${NC}"
            ;;
        FAILED)
            echo -e "${component_name}: ${RED}❌ FAILED${NC}"
            ;;
        SKIPPED)
            echo -e "${component_name}: ${YELLOW}⊘ SKIPPED${NC}"
            ;;
        UNKNOWN)
            echo -e "${component_name}: ${YELLOW}? UNKNOWN${NC}"
            ;;
    esac
done

echo ""

if [ $TOTAL_EXIT -eq 0 ]; then
    echo -e "${GREEN}All component tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some component tests failed!${NC}"
    exit 1
fi
