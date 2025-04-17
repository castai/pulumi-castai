package main

import (
	"fmt"

	// This is the import path that should work
	"github.com/castai/pulumi-castai/sdk/go/castai"
)

func main() {
	// This is just a test file to verify the import path
	fmt.Println("Testing import of github.com/castai/pulumi-castai/sdk/go/castai")

	// Actually use the package to avoid the "imported and not used" error
	// Use a function from the package
	_ = castai.NewProvider
}
