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
