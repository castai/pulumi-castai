#!/usr/bin/env bash

install_python_deps() {
    echo "Installing Python example dependencies..."
    if [ -d "examples/python" ] && [ -d "sdk/python" ]; then \
        cd examples/python && python -m venv .venv && \
        . .venv/bin/activate && \
        pip install -r requirements.txt && \
        pip install -e ../../sdk/python; \
    else \
        echo "Skipping Python example dependencies as directories don't exist."; \
    fi
}

install_typescript_deps() {
    echo "Installing TypeScript example dependencies..."
    if [ -d "examples/typescript" ] && [ -d "sdk/nodejs" ]; then \
        # Install dependencies in the main TypeScript directory
        cd examples/typescript && npm install && \
        npm install --save "$(pwd)/../../sdk/nodejs"; \

        # Ensure each cloud provider example has its node_modules
        for provider in aws azure gcp; do \
            if [ -d "$provider" ]; then \
                echo "Setting up node_modules for $provider example..."; \
                mkdir -p "$provider/node_modules"; \
                mkdir -p "$provider/node_modules/@pulumi"; \
                # Create symlink to the SDK
                rm -rf "$provider/node_modules/@pulumi/castai"; \
                ln -sf "$(pwd)/../../sdk/nodejs" "$provider/node_modules/@pulumi/castai"; \
                # Install dependencies for the example
                cd "$provider" && npm install --no-fund --no-audit && cd ..; \
            fi; \
        done; \
    else \
        echo "Skipping TypeScript example dependencies as directories don't exist."; \
    fi
}

install_go_deps() {
    echo "Installing Go example dependencies..."
    if [ -d "examples/go" ] && [ -d "sdk/go" ]; then \
        echo "Setting up Go SDK module..."; \
        if [ ! -f "sdk/go/go.mod" ]; then \
            cd sdk/go && /usr/local/go/bin/go mod init github.com/cast-ai/pulumi-castai/sdk/go && /usr/local/go/bin/go mod tidy; \
        fi; \
        echo "Setting up Go example..."; \
        cd examples/go && \
        # Update imports in all Go files
        for file in *.go; do \
            if [ -f "$file" ]; then \
                if grep -q "github.com/cast-ai/pulumi-castai/sdk/go/castai" "$file"; then \
                    echo "Updating imports in $file"; \
                    # No change needed as the import path is already correct \
                fi; \
            fi; \
        done; \
        if [ ! -f "go.mod" ]; then \
            /usr/local/go/bin/go mod init github.com/cast-ai/pulumi-castai/examples/go; \
        fi; \
        /usr/local/go/bin/go mod edit -replace github.com/cast-ai/pulumi-castai/sdk/go=../../sdk/go && \
        /usr/local/go/bin/go mod tidy; \
    else \
        echo "Skipping Go example dependencies as directories don't exist."; \
    fi
}

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

# Check for language-specific installation flag
if [ "$1" == "python" ]; then
    install_python_deps
elif [ "$1" == "typescript" ]; then
    install_typescript_deps
elif [ "$1" == "go" ]; then
    install_go_deps
else
    # Install all dependencies if no specific language is specified
    install_python_deps
    install_typescript_deps
    install_go_deps
fi