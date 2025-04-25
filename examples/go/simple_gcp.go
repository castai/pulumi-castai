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
