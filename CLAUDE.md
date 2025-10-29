# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the Pulumi provider for CAST AI, a Kubernetes cost optimization platform. The provider is built using the Pulumi Terraform Bridge (v3), which wraps the existing CAST AI Terraform provider into native Pulumi SDKs for TypeScript/JavaScript, Python, and Go.

**Current Status (Oct 2025):**
- **Provider Version**: v7.73.2 (aligned with Terraform provider v7.73.1)
- **Terraform Bridge**: v3.116.0
- **SDKs**: Published to npm, PyPI, and GitHub
- **Test Coverage**: 123 passing tests (Provider + Python 33 + TypeScript 42 + Go 48)

## Architecture

### Provider Structure

The provider follows the standard Pulumi bridged provider architecture:

- **`provider/`**: Core Go code for the provider
  - `resources.go`: Defines resource/datasource mappings and module organization (index, eks, gke, aks, autoscaling, config, organization, etc.)
  - `cmd/pulumi-tfgen-castai/`: Schema generator binary
  - `cmd/pulumi-resource-castai/`: Provider runtime binary
  - `pkg/version/`: Version management

- **`sdk/`**: Generated SDKs for each language
  - `nodejs/`: TypeScript/JavaScript SDK
  - `python/`: Python SDK
  - `go/castai/`: Go SDK (published as submodule)

- **`components/`**: High-level component abstractions
  - `eks-cluster/`: EKS cluster onboarding component
  - `gke-cluster/`: GKE cluster onboarding component
  - Each component available in TypeScript, Python, and Go

- **`examples/`**: Example programs demonstrating provider usage
  - Examples now use official published SDKs from npm/PyPI (not local builds)
  - Organized by language (typescript, python, go) and cloud provider (aws, gcp, azure)
  - Each example is standalone with its own package.json/requirements.txt/go.mod

- **`tests/`**: Test suite organization
  - `provider/`: Provider-level tests
  - `sdk/`: SDK tests for each language (protected from SDK regeneration)
  - `run-sdk-tests.sh`: Unified SDK test runner

### Module Organization

Resources are organized into logical modules defined in `provider/resources.go`:
- `index`: Core resources (Cluster, Credentials, ClusterToken, Autoscaler, etc.)
- `eks`: AWS-specific resources (EksCluster, EksClusterId, EksUserArn)
- `gke`: GCP-specific resources (GkeCluster, GkeClusterId)
- `aks`: Azure-specific resources (AksCluster)
- `autoscaling`: Autoscaling configuration
- `config/node`: Node configuration resources (NodeConfiguration, NodeTemplate, NodeConfigurationDefault)
- `organization`: Organization-level resources (ServiceAccount, ServiceAccountKey)
- `iam`: IAM-related outputs
- `azure`, `rebalancing`, `workload`: Additional resource modules

### Version Management

**Dual Versioning Scheme** (Important!):

1. **`version.txt`**: Release version (e.g., 7.73.2)
   - Used for GitHub releases, tags, and SDK versions
   - Aligns with upstream Terraform provider versions
   - Source of truth for public-facing version numbers

2. **`provider/pkg/version/version.go`**: Internal provider version (e.g., 0.1.88)
   - Used by the provider binary at runtime
   - Kept at 0.x.x to avoid Go module v7+ import path issues
   - Prevents `/v7/` from appearing in Go import paths

**Why Dual Versioning?**
- Pulumi Go SDK generation adds `/vN/` to import paths for major versions >= 2
- This breaks import compatibility when switching from 0.x to 7.x
- Solution: Public version (7.73.2) for releases, internal version (0.1.x) for binaries
- This is a standard pattern for Pulumi providers bridging existing tools

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

# Install provider locally
make install_provider

# Generate schema
make build_schema
```

### Testing

**Provider Tests:**
```bash
cd provider && ./run-tests.sh
```

**SDK Tests (All Languages):**
```bash
cd tests && ./run-sdk-tests.sh
```

**Individual SDK Tests:**
```bash
# Python (33 tests)
cd tests/sdk/python && pytest

# TypeScript (42 tests)
cd tests/sdk/nodejs && npm test

# Go (48 tests)
cd tests/sdk/go && go test
```

**Important:** Tests are in `tests/` (not `sdk/`) to protect them from SDK regeneration, which runs `rm -rf sdk/*`.

**⚠️ CRITICAL - Python Virtual Environment:**
**ALWAYS activate the Python venv before running ANY Python commands** (pip, pytest, python, build commands, etc.):
```bash
source venv/bin/activate  # or just 'source venv'
```
The venv is located at the repository root. Not activating it causes:
- Module import errors
- Wrong Python version
- Dependencies not found
- Test failures

**When to activate:**
- Before running SDK tests
- Before building Python SDK
- Before running release scripts that involve Python
- At the start of any Python-related task

This is easy to forget but **critical** - add it to your mental checklist for ANY Python operation!

### Version Updates and Releases

**Update Version:**
```bash
# Update version across all files
./scripts/update-version.sh 7.74.0
```

**Prepare Release:**
```bash
# Full release (builds, tests, commits, tags)
./scripts/prepare_release.sh

# Dry run (test without making changes)
./scripts/prepare_release.sh --dry-run

# Skip build steps
./scripts/prepare_release.sh --skip-build
```

**Release Process:**
1. Script reads version from `version.txt`
2. Updates `version.go` (keeps it at 0.1.x for Go module compatibility)
3. Builds provider binaries for all platforms
4. Generates SDK for all languages
5. Runs comprehensive test suite (provider + all SDKs)
6. Creates commits and tags: `vX.Y.Z` and `sdk/go/castai/vX.Y.Z`
7. Pushes tags to trigger GitHub Actions
8. GitHub Actions publishes to npm, PyPI, and GitHub releases

The GitHub workflow (`release.yml`) handles publishing:
- Builds provider binaries for all architectures (darwin/linux/windows, amd64/arm64)
- Publishes TypeScript SDK to npm as `@castai/pulumi`
- Publishes Python SDK to PyPI as `pulumi-castai`
- Publishes Go SDK to GitHub (consumed via `go get`)
- Creates GitHub release with binaries and checksums
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
- Pulumi CLI when downloading from GitHub releases

When users install via `npm install @castai/pulumi`, Pulumi automatically:
1. Reads the plugin version from SDK package.json
2. Downloads the matching provider binary from GitHub releases
3. Installs to `~/.pulumi/plugins/resource-castai-vX.Y.Z/`

### Build Process Flow

1. **Provider Binary**: Compile `provider/cmd/pulumi-resource-castai/` with version from `version.txt`
2. **Schema Generation**: Run `pulumi-tfgen-castai schema` to generate `schema.json`
3. **Schema Injection**: Inject version field into schema.json
4. **SDK Generation**: Run `pulumi-tfgen-castai <lang>` for each target language
5. **SDK Compilation**: Build TypeScript, Python wheel, and Go modules
6. **Installation**: Copy provider binary and create `PulumiPlugin.yaml` in `~/.pulumi/plugins/`

### Multi-Architecture Support

The provider builds for multiple platforms:
- darwin/amd64, darwin/arm64
- linux/amd64, linux/arm64
- windows/amd64

See `docs/internal/MULTI_ARCH_SUPPORT.md` for cross-compilation details.

### Component Architecture

Components are high-level abstractions that simplify common workflows:

**EKS Component** (`components/eks-cluster/`):
- Handles IAM role creation
- Configures CAST AI cluster connection
- Deploys Helm charts (agent, controller, etc.)
- Manages node configurations

**GKE Component** (`components/gke-cluster/`):
- Creates service accounts and IAM bindings
- Connects GKE cluster to CAST AI
- Deploys CAST AI control plane components
- Configures autoscaling policies

Components are **not** published separately; they live in this repo and examples reference them locally via relative paths (e.g., `file:../../../components/eks-cluster/typescript`).

## Common Development Tasks

**⚠️ FIRST STEP for ANY Python work:** `source venv/bin/activate`

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
2. Update example to use local SDK: `"@castai/pulumi": "file:../../../sdk/nodejs"`
3. Run example: `cd examples/typescript/gcp/readonly && pulumi preview`
4. Verify outputs and behavior

### Adding New Tests

**SDK Tests:**
1. Add test file to appropriate `tests/sdk/<language>/` directory
2. Tests automatically picked up by `run-sdk-tests.sh`
3. Use mock resources (no actual API calls)

**Provider Tests:**
1. Add test to `provider/` directory
2. Run with `cd provider && ./run-tests.sh`

### Working with Examples

Examples require environment variables:
- `CASTAI_API_TOKEN`: Your CAST AI API token
- Cloud-specific variables (e.g., `GCP_PROJECT_ID`, `GKE_CLUSTER_NAME` for GCP)

**Environment Files:**
- Root `.env`: AWS/EKS configuration
- `examples/typescript/gcp/.env`: GCP configuration
- Each example directory may have `.env.example` showing required variables

**Testing Examples:**
```bash
# GCP example
cd examples/typescript/gcp/full-onboarding
source ../.env  # Load GCP config
source ../../../../.env  # Load CAST AI token
pulumi preview
```

## Key Files to Know

- `version.txt`: Public-facing version (releases, SDKs, tags)
- `provider/pkg/version/version.go`: Internal provider version (binary runtime)
- `provider/resources.go`: Resource and data source mappings, module definitions
- `schema.json`: Generated Pulumi schema (committed to repo)
- `Makefile`: Build targets (provider, SDKs, testing, installation)
- `scripts/`: Build and release automation scripts
- `scripts/sync-package-version.js`: Syncs version from version.txt to package.json files
- `scripts/update-version.sh`: Updates version across all project files
- `scripts/prepare_release.sh`: Complete release automation (build, test, tag, publish)
- `.github/workflows/release.yml`: CI/CD pipeline for publishing releases
- `tests/run-sdk-tests.sh`: Unified SDK test runner (protected from regeneration)

## Project History & Key Decisions

**October 2025 - v7.73.x Release:**
- Upgraded from v0.1.x to v7.73.x to align with Terraform provider versioning
- Implemented dual versioning scheme to solve Go module import path issues
- Published first official release to npm, PyPI, and GitHub
- Reorganized examples to use official SDKs instead of local builds
- Moved SDK tests to protected location (`tests/`) to survive regeneration
- Successfully tested end-to-end with GKE full onboarding

**Version Mismatch Discovery:**
- v7.73.1 had incorrect internal version (0.1.87) due to missing placeholder in version.go
- Fixed in v7.73.2 with dual versioning approach
- Internal version (0.1.88) separate from public version (7.73.2)

## Notes

- The provider wraps `terraform-provider-castai`, so upstream Terraform provider updates require rebuilding
- SDK generation is deterministic - same schema always produces same SDK code
- Version mismatches between provider binary and schema cause runtime errors
- The bridge automatically handles most Terraform → Pulumi type conversions
- Components reference local paths and are not published separately
- Examples now use official published SDKs (not local file references)
- Test suite must pass 100% before releases (no exceptions)
