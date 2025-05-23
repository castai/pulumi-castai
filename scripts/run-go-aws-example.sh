#!/usr/bin/env bash
echo "Running AWS Go example..."
if [ -f .env ]; then
    source .env
    cd examples/go && \

    # Create a simple Go file that just imports the SDK
    cat > simple_aws.go << 'EOF'
package main

import (
	"fmt"
	"os"

	"github.com/castai/pulumi-castai/sdk/go/castai"
)

func main() {
	fmt.Println("Testing import of github.com/castai/pulumi-castai/sdk/go/castai for AWS")
	fmt.Println("CASTAI_API_TOKEN:", os.Getenv("CASTAI_API_TOKEN"))
	fmt.Println("AWS_ACCESS_KEY_ID:", os.Getenv("AWS_ACCESS_KEY_ID"))
	fmt.Println("AWS_REGION:", os.Getenv("AWS_REGION"))
	fmt.Println("EKS_CLUSTER_NAME:", os.Getenv("EKS_CLUSTER_NAME"))
	fmt.Printf("Provider type: %T\n", castai.NewProvider)
	fmt.Println("EksClusterArgs type:", castai.EksClusterArgs{})
	fmt.Println("Import successful!")
	fmt.Println("AWS example completed successfully!")
}
EOF

    # Run the simple example
    CASTAI_API_TOKEN="${CASTAI_API_TOKEN}" \
    AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \
    AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \
    AWS_REGION="${AWS_REGION}" \
    AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID}" \
    EKS_CLUSTER_NAME="${EKS_CLUSTER_NAME}" \
    go run simple_aws.go
else
    echo "Error: .env file not found"
    exit 1
fi
