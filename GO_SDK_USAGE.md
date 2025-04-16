# Using the CAST AI Pulumi Go SDK

## Overview

This document provides guidance on using the Go SDK for the CAST AI Pulumi provider.

**Important Note**: The SDK directory is now committed to the GitHub repository during the release process. This means that the SDK is directly browsable on GitHub after a release, which should help with pkg.go.dev indexing.

## Installation

To use the CAST AI Pulumi Go SDK in your Go project, add it as a dependency:

```bash
go get github.com/cast-ai/pulumi-castai/sdk/go/castai@v0.1.14
```

Replace `0.1.14` with the actual version you want to use.

## Importing the SDK

In your Go code, import the SDK:

```go
import (
    "github.com/cast-ai/pulumi-castai/sdk/go/castai"
)
```

**Important Note**: The module path in go.mod is `github.com/cast-ai/pulumi-castai/sdk/go`, but the import path for the SDK is `github.com/cast-ai/pulumi-castai/sdk/go/castai`. This is the standard pattern for Pulumi Go SDKs.

## Example Usage

Here's a simple example of using the SDK to create a CAST AI resource:

```go
package main

import (
    "github.com/cast-ai/pulumi-castai/sdk/go/castai"
    "github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        // Create a CAST AI resource
        // Replace this with actual resource creation code
        _, err := castai.NewResource(ctx, "example", &castai.ResourceArgs{
            // Set properties here
        })
        if err != nil {
            return err
        }

        return nil
    })
}
```

## Troubleshooting

If you encounter issues with the Go SDK:

1. **Check the version**:
   Make sure you're using the latest version of the SDK.

2. **Check pkg.go.dev**:
   Visit `https://pkg.go.dev/github.com/cast-ai/pulumi-castai/sdk/go/castai` to see if the package is properly indexed.

3. **Try a specific version**:
   If the latest version isn't working, try a specific version:
   ```bash
   go get github.com/cast-ai/pulumi-castai/sdk/go/castai@v0.1.14
   ```

4. **Update Go modules**:
   Run `go mod tidy` to ensure your Go modules are up to date.

## Additional Resources

- [Pulumi Go SDK Documentation](https://www.pulumi.com/docs/reference/pkg/go/)
- [CAST AI Documentation](https://docs.cast.ai/)
- [Go Modules Reference](https://golang.org/ref/mod)
