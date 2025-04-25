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
