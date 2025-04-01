#!/bin/bash
set -e

# Script to set up the e2e test environment for the CAST AI Pulumi provider
# This creates the necessary directory structure and configuration files

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
E2E_DIR="${ROOT_DIR}/e2e"

echo "📂 Setting up e2e test environment in ${E2E_DIR}"

# Create necessary directories if they don't exist
mkdir -p "${E2E_DIR}/config" "${E2E_DIR}/tests"

# We'll use the .env file from the root directory
if [ -f "${ROOT_DIR}/.env" ]; then
    echo "Found .env file in repository root, will use it for tests"
    # Create a symlink to the root .env file
    ln -sf "${ROOT_DIR}/.env" "${E2E_DIR}/.env"
else
    echo "Warning: No .env file found in repository root. Please create one with your CAST AI credentials."
    echo "Example content:"
    echo "CASTAI_API_TOKEN=your_api_token_here"
    echo "CASTAI_API_URL=https://api.cast.ai"
fi

# Create main_test.go if it doesn't exist
if [ ! -f "${E2E_DIR}/main_test.go" ]; then
    cat > "${E2E_DIR}/main_test.go" << EOL
package e2e

import (
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"

	"github.com/cast-ai/pulumi-castai/e2e/config"
)

var (
	cfg *config.Config
)

func TestMain(m *testing.M) {
	// Load config from the repository root .env file
	var err error
	
	// First try the symlinked .env file in the e2e directory
	err = godotenv.Load()
	if err != nil {
		// Then try the root .env file
		err = godotenv.Load("../.env")
		if err != nil {
			log.Println("unable to load dotfile from e2e or root directory:", err)
		}
	}
	
	cfg, err = config.Load()
	if err != nil {
		log.Fatalf("loading config: %v", err)
	}

	// Run all tests.
	code := m.Run()

	os.Exit(code)
}
EOL
    echo "Created main_test.go file"
fi

# Create config/config.go if it doesn't exist
if [ ! -f "${E2E_DIR}/config/config.go" ]; then
    mkdir -p "${E2E_DIR}/config"
    cat > "${E2E_DIR}/config/config.go" << EOL
package config

import (
	"fmt"
	"os"
)

type Config struct {
	Token  string
	APIURL string
}

func Load() (*Config, error) {
	token := os.Getenv("CASTAI_API_TOKEN")
	if token == "" {
		return nil, fmt.Errorf("CASTAI_API_TOKEN environment variable is required")
	}

	apiURL := os.Getenv("CASTAI_API_URL")
	if apiURL == "" {
		apiURL = "https://api.cast.ai"
	}

	return &Config{
		Token:  token,
		APIURL: apiURL,
	}, nil
}
EOL
    echo "Created config/config.go file"
fi

# Create a sample test file if no tests exist
if [ ! "$(ls -A "${E2E_DIR}/tests" 2>/dev/null)" ]; then
    mkdir -p "${E2E_DIR}/tests/gcp_cluster"
    
    # Create a sample Pulumi TypeScript test
    cat > "${E2E_DIR}/tests/gcp_cluster/index.ts" << EOL
import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi-castai";

const cluster = new castai.CastaiFinal("test-cluster", {
    // Test configuration properties would go here
});

export const clusterId = cluster.id;
EOL
    
    # Create a sample Go test file
    cat > "${E2E_DIR}/gcp_test.go" << EOL
package e2e

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/pulumi/pulumi/sdk/v3/go/auto"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optdestroy"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optup"
	"github.com/stretchr/testify/require"
)

func TestGCPCluster(t *testing.T) {
	r := require.New(t)
	ctx := context.Background()

	projectName := "castai-gcp-test"
	stackName := "dev"
	
	// Create a new Pulumi program working directory
	workDir := "./tests/gcp_cluster"
	
	// Create a new stack
	s, err := auto.NewStackInlineSource(ctx, stackName, projectName, func(pCtx *pulumi.Context) error {
		// Your test Pulumi program would go here
		return nil
	})
	r.NoError(err)
	
	// Clean up stack when test completes
	defer func() {
		if !t.Failed() {
			// Only destroy stack if test passed
			_, err := s.Destroy(ctx, optdestroy.ProgressStreams(os.Stdout))
			if err != nil {
				t.Logf("Failed to destroy stack: %v", err)
			}
		}
	}()
	
	// Set required configuration
	// Example: s.SetConfig(ctx, "castai:apiToken", auto.ConfigValue{Value: cfg.Token})
	
	// Deploy the stack
	_, err = s.Up(ctx, optup.ProgressStreams(os.Stdout))
	r.NoError(err)
	
	// Add your assertions here to verify the deployment was successful
	
	fmt.Println("Test completed successfully")
}
EOL
    echo "Created sample test files"
fi

# Ensure the local provider will be used for tests
echo "Setting up local provider for tests..."

# Build and install the provider if necessary
if [ ! -f "${ROOT_DIR}/bin/pulumi-resource-castai" ]; then
    echo "Building and installing local provider..."
    pushd "${ROOT_DIR}" > /dev/null
    just build-provider
    just install-provider
    popd > /dev/null
fi

# Check if the local provider is installed
echo "Verifying local provider installation..."
PROVIDER_VERSION=$(cat "${ROOT_DIR}/version.txt" | tr -d '\n')
INSTALLED_PROVIDER=$(pulumi plugin ls | grep "resource castai" | grep "${PROVIDER_VERSION}" || echo "")

if [ -z "${INSTALLED_PROVIDER}" ]; then
    echo "Installing local provider..."
    pushd "${ROOT_DIR}" > /dev/null
    just install-provider
    popd > /dev/null
fi

# Install required Go dependencies
echo "Installing required Go dependencies..."
go get -u github.com/joho/godotenv
go get -u github.com/stretchr/testify/require
go get -u github.com/pulumi/pulumi/sdk/v3/go/auto
go get -u github.com/pulumi/pulumi/sdk/v3/go/pulumi

echo "✅ E2E test environment setup complete!"
echo "Provider version: ${PROVIDER_VERSION} (local)" 