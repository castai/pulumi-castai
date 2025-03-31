#!/usr/bin/env bash
echo "Installing example dependencies..."
# Create example directories if needed
if [ ! -d "examples/python" ] || [ ! -d "examples/typescript" ] || [ ! -d "examples/go" ]; then \
    echo "Creating example directories..."; \
    mkdir -p examples/python examples/typescript examples/go; \
    just create-example "python" "python"; \
    just create-example "typescript" "typescript"; \
    just create-example "go" "go"; \
fi
# Check if SDK directories exist
if [ ! -d "sdk/python" ] || [ ! -d "sdk/nodejs" ] || [ ! -d "sdk/go" ]; then \
    echo "SDK directories don't exist yet, skipping example dependency installation."; \
    echo "Please run build-sdk-python, build-sdk-typescript, and build-sdk-go first."; \
    exit 0; \
fi
# Python example setup
echo "Installing Python example dependencies..."
if [ -d "examples/python" ] && [ -d "sdk/python" ]; then \
    cd examples/python && python -m venv .venv && \
    . .venv/bin/activate && \
    pip install -r requirements.txt && \
    pip install -e ../../sdk/python; \
else \
    echo "Skipping Python example dependencies as directories don't exist."; \
fi
# TypeScript example setup
echo "Installing TypeScript example dependencies..."
if [ -d "examples/typescript" ] && [ -d "sdk/nodejs" ]; then \
    cd examples/typescript && yarn install && \
    yarn add "$(pwd)/../../sdk/nodejs"; \
else \
    echo "Skipping TypeScript example dependencies as directories don't exist."; \
fi
# Go example setup
echo "Installing Go example dependencies..."
if [ -d "examples/go" ] && [ -d "sdk/go" ]; then \
    echo "Setting up Go SDK module..."; \
    if [ ! -f "sdk/go/go.mod" ]; then \
        cd sdk/go && /usr/local/go/bin/go mod init github.com/cast-ai/pulumi-castai/sdk/go && /usr/local/go/bin/go mod tidy; \
    fi; \
    echo "Setting up Go example..."; \
    cd examples/go && \
    if grep -q "github.com/cast-ai/pulumi-castai/sdk/go/castai" main.go; then \
        sed -i 's|github.com/cast-ai/pulumi-castai/sdk/go/castai|github.com/cast-ai/pulumi-castai/sdk/go|g' main.go; \
    fi; \
    if [ ! -f "go.mod" ]; then \
        /usr/local/go/bin/go mod init github.com/cast-ai/pulumi-castai/examples/go; \
    fi; \
    /usr/local/go/bin/go mod edit -replace github.com/cast-ai/pulumi-castai/sdk/go=../../sdk/go && \
    /usr/local/go/bin/go mod tidy; \
else \
    echo "Skipping Go example dependencies as directories don't exist."; \
fi 