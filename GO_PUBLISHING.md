# Go Package Publishing Guide

## Overview

This document provides guidance on publishing the Go SDK for the CAST AI Pulumi provider to pkg.go.dev.

## Common Issues

### Package Not Indexed on pkg.go.dev

If the Go package is not showing up on pkg.go.dev (404 error when accessing `https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai`), there could be several reasons:

1. **The repository is not public**: pkg.go.dev only indexes public repositories.
2. **The Go module hasn't been properly tagged**: pkg.go.dev indexes modules based on Git tags.
3. **The Go module hasn't been requested through the proxy**: pkg.go.dev indexes packages when they're requested through the Go proxy.
4. **The Go module structure is incorrect**: The module path in go.mod must match the repository path.

## How to Fix

We've updated the CI/CD pipeline to address these issues:

1. **Improved Go Module Structure**:
   - Added a proper directory structure with a `castai` subdirectory
   - Added a `doc.go` file to ensure the package is properly indexed
   - Ensured the go.mod file has the correct module path

2. **Enhanced Publishing Process**:
   - Added explicit requests to pkg.go.dev to trigger indexing
   - Added commands to force the Go proxy to fetch the module

## Manual Troubleshooting

If the package is still not showing up on pkg.go.dev after a release, you can try the following:

1. **Check if the repository is public**:
   - Make sure the GitHub repository is public
   - Check that the Go module is in the correct location

2. **Manually trigger pkg.go.dev indexing**:
   ```bash
   # Replace VERSION with the actual version
   GOPROXY=https://proxy.golang.org go get github.com/castai/pulumi-castai/sdk/go/castai@vVERSION
   ```

3. **Directly request the package from pkg.go.dev**:
   - Visit `https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@vVERSION?tab=doc` in your browser

4. **Check the Go module structure**:
   - Ensure the module path in go.mod matches the repository path
   - Make sure there's at least one .go file in the package directory

## Additional Information

For more information about Go modules and pkg.go.dev, see:
- [Go Modules Reference](https://golang.org/ref/mod)
- [Publishing Go Modules](https://golang.org/doc/modules/publishing)
- [pkg.go.dev documentation](https://pkg.go.dev/about)
