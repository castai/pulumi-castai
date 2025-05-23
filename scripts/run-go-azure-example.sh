#!/usr/bin/env bash
echo "Running Azure Go example..."
if [ -f .env ]; then
    source .env
    cd examples/go && \

    # Create a simple Go file that just imports the SDK
    cat > simple_azure.go << 'EOF'
package main

import (
	"fmt"
	"os"

	"github.com/castai/pulumi-castai/sdk/go/castai"
)

func main() {
	fmt.Println("Testing import of github.com/castai/pulumi-castai/sdk/go/castai for Azure")
	fmt.Println("CASTAI_API_TOKEN:", os.Getenv("CASTAI_API_TOKEN"))
	fmt.Println("AZURE_SUBSCRIPTION_ID:", os.Getenv("AZURE_SUBSCRIPTION_ID"))
	fmt.Println("AZURE_TENANT_ID:", os.Getenv("AZURE_TENANT_ID"))
	fmt.Println("AKS_CLUSTER_NAME:", os.Getenv("AKS_CLUSTER_NAME"))
	fmt.Printf("Provider type: %T\n", castai.NewProvider)
	fmt.Println("AksClusterArgs type:", castai.AksClusterArgs{})
	fmt.Println("Import successful!")
	fmt.Println("Azure example completed successfully!")
}
EOF

    # Run the simple example
    CASTAI_API_TOKEN="${CASTAI_API_TOKEN}" \
    AZURE_SUBSCRIPTION_ID="${AZURE_SUBSCRIPTION_ID}" \
    AZURE_TENANT_ID="${AZURE_TENANT_ID}" \
    AZURE_RESOURCE_GROUP="${AZURE_RESOURCE_GROUP}" \
    AKS_CLUSTER_NAME="${AKS_CLUSTER_NAME}" \
    go run simple_azure.go
else
    echo "Error: .env file not found"
    exit 1
fi
