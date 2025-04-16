package main

import (
	"fmt"

	// This is the import path that should work
	"github.com/castai/pulumi-castai/sdk/go/castai"
)

func main() {
	// This is just a test file to verify the import path
	fmt.Println("Testing import of github.com/castai/pulumi-castai/sdk/go/castai")
	
	// We don't actually use the package here, just verify it can be imported
	_ = castai.Provider
}
