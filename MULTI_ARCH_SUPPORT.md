# Multi-Architecture Support for CAST AI Pulumi Provider

This document describes how to build, install, and use the CAST AI Pulumi Provider for different architectures.

## Supported Architectures

The CAST AI Pulumi Provider now supports the following architectures:

- darwin-amd64 (macOS on Intel)
- darwin-arm64 (macOS on Apple Silicon)
- linux-amd64 (Linux on x86_64)
- linux-arm64 (Linux on ARM64)
- windows-amd64 (Windows on x86_64)

## Building for Different Architectures

### Using the justfile

The easiest way to build the provider for all supported architectures is to use the `just` command:

```bash
# Build for all supported architectures
just build-provider-all-archs
```

This will create binaries for all supported architectures in the `bin` directory and package them as release assets in the `release` directory.

### Building for a Specific Architecture

You can also build for a specific architecture using the provided script:

```bash
# Usage: ./scripts/build-provider-binary.sh <VERSION> <GOOS> <GOARCH>
./scripts/build-provider-binary.sh 0.1.13 darwin arm64
```

## Installing the Provider

### Using the justfile

To install the provider for a specific architecture:

```bash
# Install for a specific architecture
just install-provider-arch darwin arm64
```

To install the provider for your current system architecture:

```bash
# Install for the current system architecture
just install-provider-current-arch
```

### Using Pulumi CLI

You can also install the provider using the Pulumi CLI:

```bash
# Install from a local file
pulumi plugin install resource castai 0.1.13 --file ./bin/pulumi-resource-castai

# Install from GitHub releases
pulumi plugin install resource castai 0.1.13 --server github://api.github.com/castai/pulumi-castai
```

## Releasing

The GitHub Actions workflow has been updated to automatically build and release the provider for all supported architectures when a new version is tagged.

## Troubleshooting

If you encounter any issues with the provider on a specific architecture, please try the following:

1. Make sure you have the correct version of the provider installed for your architecture
2. Check the logs for any errors
3. Try rebuilding and reinstalling the provider for your specific architecture

If the issue persists, please open an issue on the GitHub repository with details about your environment and the error you're encountering.
