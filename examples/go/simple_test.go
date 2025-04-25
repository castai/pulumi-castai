package main

import (
	"fmt"
	"github.com/castai/pulumi-castai/sdk/go/castai"
)

func runSimpleTest() {
	fmt.Println("Testing import of github.com/castai/pulumi-castai/sdk/go/castai")
	fmt.Printf("Provider type: %T\n", castai.NewProvider)
	fmt.Println("Import successful!")
}
