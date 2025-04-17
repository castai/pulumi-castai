package main

import (
	"os"
)

func main() {
	// Determine which example to run based on environment variable
	exampleType := os.Getenv("EXAMPLE_TYPE")
	switch exampleType {
	case "aws":
		runAwsExample()
	case "azure":
		runAzureExample()
	default:
		// Default to GCP example
		runGcpExample()
	}
}
