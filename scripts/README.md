# Pulumi CAST AI Provider Scripts

This directory contains scripts for managing the Pulumi CAST AI provider.

## Release Process

### Preparing a Release

To prepare a new release:

1. Update the version in `version.txt` to the desired version (e.g., `0.1.29`)
2. Run the prepare_release.sh script:

```bash
# For a real release:
./scripts/prepare_release.sh

# To test the script without making any changes (dry run):
./scripts/prepare_release.sh --dry-run

# To skip build steps (useful if you're having build issues):
./scripts/prepare_release.sh --skip-build

# You can combine options:
./scripts/prepare_release.sh --dry-run --skip-build
```

This script will:
- Update version.go with the correct version from version.txt
- Run go mod tidy in the provider directory
- Build the provider and generate schema
- Build all SDKs (if they don't already exist or don't match the current version)
- Generate go.sum files for the Go SDK
- Commit all changes to the repository
- Create a tag based on the version

The script will:
1. Commit all changes
2. Push the changes to the repository
3. Create a tag
4. Ask if you want to push the tag now to trigger the release pipeline

**IMPORTANT**: The script ensures that code changes are pushed BEFORE the tag to ensure the pipeline has access to the latest code.

### Publishing a Release

The actual publishing is handled by the GitHub workflow, which is triggered when a tag is pushed.

The workflow will:
- Check if the provider and SDKs are already built
- Build the provider for all supported architectures (if needed)
- Build the SDKs (if needed)
- Generate go.sum files for the Go SDK
- Publish the SDKs to their respective package managers
- Create a GitHub release with the provider binaries
- Trigger pkg.go.dev indexing for the Go SDK

The workflow is designed to work seamlessly with the prepare_release.sh script, avoiding duplication of work if the script has already built the provider and SDKs.

## Other Scripts

### trigger_pkggodev_indexing.sh

This script manually triggers pkg.go.dev to index the Go SDK. It's used by the GitHub workflow, but can also be run manually if needed:

```bash
./scripts/trigger_pkggodev_indexing.sh [VERSION]
```

If VERSION is not provided, it will use the version from version.txt.

### publish_go_package.sh

This script prepares and publishes the Go package. It's used by the GitHub workflow, but can also be run manually if needed:

```bash
./scripts/publish_go_package.sh VERSION
```

VERSION is required and should be the version to publish (e.g., `0.1.29`).
