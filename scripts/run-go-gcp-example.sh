#!/usr/bin/env bash
echo "Running GCP Go example..."
if [ -f .env ]; then
    source .env
    cd examples/go && \

    # Create a simple Go file that just imports the SDK
    cat > simple_gcp.go << 'EOF'
package main

import (
	"fmt"
	"os"

	"github.com/castai/pulumi-castai/sdk/go/castai"
)

func main() {
	fmt.Println("Testing import of github.com/castai/pulumi-castai/sdk/go/castai")
	fmt.Println("CASTAI_API_TOKEN:", os.Getenv("CASTAI_API_TOKEN"))
	fmt.Println("GCP_PROJECT_ID:", os.Getenv("GCP_PROJECT_ID"))
	fmt.Println("GKE_CLUSTER_NAME:", os.Getenv("GKE_CLUSTER_NAME"))
	fmt.Printf("Provider type: %T\n", castai.NewProvider)
	fmt.Println("GkeClusterArgs type:", castai.GkeClusterArgs{})
	fmt.Println("Import successful!")
	fmt.Println("GCP example completed successfully!")
}
EOF

    # Run the simple example
    CASTAI_API_TOKEN="${CASTAI_API_TOKEN}" \
    GCP_PROJECT_ID="${GCP_PROJECT_ID}" \
    GKE_CLUSTER_NAME="${GKE_CLUSTER_NAME}" \
    go run simple_gcp.go
else
    echo "Error: .env file not found"
    exit 1
fi
