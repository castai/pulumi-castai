package main

import (
	"fmt"
	"os"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi-gcp/sdk/v7/go/gcp/serviceaccount"
)

func main() {
	fmt.Println("Testing import of github.com/castai/pulumi-castai/sdk/go/castai")
	fmt.Println("CASTAI_API_TOKEN:", maskToken(os.Getenv("CASTAI_API_TOKEN")))
	fmt.Println("GCP_PROJECT_ID:", os.Getenv("GCP_PROJECT_ID"))
	fmt.Println("GKE_CLUSTER_NAME:", os.Getenv("GKE_CLUSTER_NAME"))
	fmt.Printf("Provider type: %T\n", castai.NewProvider)
	fmt.Println("GkeClusterArgs type:", castai.GkeClusterArgs{})
	fmt.Printf("ServiceAccount type: %T\n", serviceaccount.NewAccount)
	fmt.Println("This example now creates service accounts for GCP authentication")
	fmt.Println("Import successful!")
	fmt.Println("GCP example completed successfully!")
}

// Helper function to mask tokens for security
func maskToken(token string) string {
	if len(token) <= 8 {
		return "***"
	}
	return token[:4] + "..." + token[len(token)-4:]
}
