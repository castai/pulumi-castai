# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the Pulumi provider for CAST AI, a Kubernetes cost optimization platform. The provider is built using the Pulumi Terraform Bridge (v3), which wraps the existing CAST AI Terraform provider into native Pulumi SDKs for TypeScript/JavaScript, Python, and Go.

## Architecture

### Provider Structure

The provider follows the standard Pulumi bridged provider architecture:

- **`provider/`**: Core Go code for the provider
  - `resources.go`: Defines resource/datasource mappings and module organization (index, aws, gcp, azure, autoscaling, organization, etc.)
  - `cmd/pulumi-tfgen-castai/`: Schema generator binary
  - `cmd/pulumi-resource-castai/`: Provider runtime binary
  - `pkg/version/`: Version management

- **`sdk/`**: Generated SDKs for each language
  - `nodejs/`: TypeScript/JavaScript SDK
  - `python/`: Python SDK
  - `go/`: Go SDK

- **`examples/`**: Example programs demonstrating provider usage for AWS EKS, GCP GKE, and Azure AKS clusters

- **`e2e/`**: End-to-end tests organized by language (go, python, typescript) and cloud provider

### Module Organization

Resources are organized into logical modules defined in `provider/resources.go`:
- `index`: Core resources (Cluster, Credentials, ClusterToken)
- `aws`: AWS-specific resources (EksCluster)
- `gcp`: GCP-specific resources (GkeCluster)
- `azure`: Azure-specific resources (AksCluster)
- `autoscaling`: Autoscaling configuration (Autoscaler)
- `organization`: Organization-level resources (ServiceAccount, ServiceAccountKey)

### Version Management

The version is centralized in `version.txt` at the repository root. All build processes, SDKs, and provider binaries read from this single source of truth.

## Build Commands

### Development Workflow

Use the Makefile for building:

```bash
# Build everything for development
make development

# Full clean build
make clean && make development

# Build provider binary
make provider

# Build all SDKs
make build_sdks

# Build specific SDKs
make build_nodejs
make build_python
make build_go

# Install provider with PulumiPlugin.yaml
make install_provider

# Generate schema
make build_schema
```

### Running Examples

Use the scripts in the `scripts/` directory:

```bash
# Run examples by language and cloud provider
./scripts/run-typescript-gcp-example.sh
./scripts/run-python-aws-example.sh
./scripts/run-go-azure-example.sh

# Run all examples for a language (run all 3 scripts)
./scripts/run-typescript-gcp-example.sh
./scripts/run-typescript-aws-example.sh
./scripts/run-typescript-azure-example.sh
```

### Testing

End-to-end tests exist in the `e2e/` directory but require actual cloud resources and credentials. Examples serve as functional tests.

### Version Updates and Releases

```bash
# Update version (updates version.txt and syncs all files)
./update-version.sh 0.2.0

# Prepare a release (commits, tags, and optionally triggers pipeline)
./scripts/prepare_release.sh

# Dry run (test without making changes)
./scripts/prepare_release.sh --dry-run

# Skip build steps
./scripts/prepare_release.sh --skip-build
```

The GitHub workflow handles publishing when a tag is pushed:
- Builds provider binaries for all architectures (darwin/linux/windows, amd64/arm64)
- Publishes SDKs to npm, PyPI, and GitHub
- Creates GitHub release with binaries
- Triggers pkg.go.dev indexing

## Important Implementation Details

### Terraform Bridge Integration

The provider uses `pulumi-terraform-bridge/v3` to wrap the upstream `terraform-provider-castai`. Key integration points:

1. **Schema Generation**: `pulumi-tfgen-castai` generates the Pulumi schema from Terraform provider
2. **Resource Runtime**: `pulumi-resource-castai` serves as the plugin that Pulumi CLI communicates with
3. **SDK Generation**: tfgen generates language-specific SDKs from the schema

### Configuration

The provider accepts two configuration values:
- `api_token`: CAST AI API token (from `CASTAI_API_TOKEN` env var, marked as secret)
- `api_url`: API endpoint URL (defaults to `https://api.cast.ai`, from `CASTAI_API_URL` env var)

### Plugin Installation

The provider requires a `PulumiPlugin.yaml` file in the plugin directory. This is automatically created by:
- `make install_provider`
- `just install-provider`
- `./fix_plugin.sh` (repair script)

### Build Process Flow

1. **Provider Binary**: Compile `provider/cmd/pulumi-resource-castai/` with version from `version.txt`
2. **Schema Generation**: Run `pulumi-tfgen-castai schema` to generate `schema.json`
3. **SDK Generation**: Run `pulumi-tfgen-castai <lang>` for each target language
4. **SDK Compilation**: Build TypeScript, Python wheel, and Go modules
5. **Installation**: Copy provider binary and create `PulumiPlugin.yaml` in `~/.pulumi/plugins/`

### Multi-Architecture Support

The provider builds for multiple platforms:
- darwin/amd64, darwin/arm64
- linux/amd64, linux/arm64
- windows/amd64

Use `./scripts/build-provider-binary.sh` for cross-compilation (see MULTI_ARCH_SUPPORT.md for details).

## Common Development Tasks

### Making Schema Changes

After modifying `provider/resources.go`:

```bash
make provider
make build_schema
make build_sdks
make install_provider
```

### Testing Changes Locally

1. Build and install: `make clean && make development`
2. Run example: `./scripts/run-typescript-gcp-example.sh` (or python/go variant)
3. Verify outputs and behavior

### Troubleshooting Plugin Issues

If you see "failed to load plugin" or "no such file or directory" errors:

```bash
./fix_plugin.sh
```

Or manually verify:
```bash
VERSION=$(cat version.txt)
ls -la ~/.pulumi/plugins/resource-castai-v${VERSION}/
cat ~/.pulumi/plugins/resource-castai-v${VERSION}/PulumiPlugin.yaml
```

### Working with Examples

Examples require environment variables:
- `CASTAI_API_TOKEN`: Your CAST AI API token
- Cloud-specific variables (e.g., `GCP_PROJECT_ID`, `GKE_CLUSTER_NAME` for GCP)

Examples expect existing clusters to exist in your cloud provider account.

## Key Files to Know

- `version.txt`: Single source of truth for version number
- `provider/resources.go`: Resource and data source mappings, module definitions
- `schema.json`: Generated Pulumi schema (committed to repo)
- `Makefile`: Build targets (provider, SDKs, testing, installation)
- `scripts/`: Build and release automation scripts
- `.github/workflows/`: CI/CD pipelines for releases

## Notes

- The provider wraps `terraform-provider-castai`, so upstream Terraform provider updates require rebuilding
- SDK generation is deterministic - same schema always produces same SDK code
- Version mismatches between provider binary and schema cause runtime errors
- The bridge automatically handles most Terraform → Pulumi type conversions
