# CAST AI Pulumi Provider - Go SDK

This package provides Go bindings for the CAST AI Pulumi provider.

## Installation

To use this SDK in your Pulumi program, add the following to your go.mod file:

```go
module myproject

go 1.18

require github.com/castai/pulumi-castai/sdk/go/castai v0.1.28

// Use this replace directive to find the module
replace github.com/castai/pulumi-castai/sdk/go/castai => github.com/castai/pulumi-castai v0.1.28
```

## Usage Example

```go
package main

import (
    "github.com/pulumi/pulumi/sdk/v3/go/pulumi"
    "github.com/castai/pulumi-castai/sdk/go/castai"
)

func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        // Create a new CAST AI provider
        provider, err := castai.NewProvider(ctx, "castai", &castai.ProviderArgs{
            ApiToken: pulumi.String("your-api-token"),
        })
        if err != nil {
            return err
        }

        // Use the provider to create resources
        // ...

        return nil
    })
}
```

## Available Resources

The Go SDK provides access to all CAST AI resources available in the Pulumi provider.

For more information, see the [CAST AI Pulumi Provider documentation](https://www.pulumi.com/registry/packages/castai/).
