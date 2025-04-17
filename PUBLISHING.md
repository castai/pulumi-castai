# Publishing the CAST AI Pulumi Provider

This document provides instructions for publishing the CAST AI Pulumi Provider to make it available to the Pulumi community.

## Prerequisites

Before publishing, ensure you have:

1. A GitHub account with access to the repository
2. Access to the following package registries:
   - npm (for JavaScript/TypeScript SDK)
   - PyPI (for Python SDK)
   - NuGet Gallery (for .NET SDK)
3. The necessary secrets configured in your GitHub repository:
   - `NPM_TOKEN`: Token for publishing to npm
   - `PYPI_PASSWORD`: Token for publishing to PyPI
   - `NUGET_TOKEN`: Token for publishing to NuGet Gallery
   - `PULUMI_ACCESS_TOKEN`: Token for Pulumi API access

## Publishing Process

The publishing process is automated using GitHub Actions. When you're ready to publish a new version:

1. Update the version in `version.txt`
2. Run the version update script:
   ```bash
   ./update-version.sh <new-version>
   ```
3. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Prepare release v<new-version>"
   git push origin main
   ```
4. Create and push a tag:
   ```bash
   git tag v<new-version>
   git push origin v<new-version>
   ```

The GitHub Actions workflow will automatically:
- Build the provider
- Build all SDKs
- Create release assets
- Publish the GitHub release
- Publish packages to npm, PyPI, and NuGet
- The Go module is published via the Git tag

## Manual Publishing

If you need to publish manually:

### Building the Provider and SDKs

```bash
make provider
make build_sdks
```

### Creating Release Assets

```bash
VERSION=$(cat version.txt)
mkdir -p release/
for ARCH in amd64 arm64; do
  for OS in darwin linux windows; do
    FILENAME=pulumi-resource-castai-v${VERSION}-${OS}-${ARCH}.tar.gz
    if [ "$OS" = "windows" ]; then
      tar -czf release/${FILENAME} -C bin pulumi-resource-castai.exe
    else
      tar -czf release/${FILENAME} -C bin pulumi-resource-castai
    fi
  done
done
```

### Publishing to Package Managers

#### npm (JavaScript/TypeScript)

```bash
cd sdk/nodejs
npm publish --access public
```

#### PyPI (Python)

```bash
cd sdk/python
pip install build twine
python -m build
twine upload dist/*
```

#### NuGet (.NET)

```bash
cd sdk/dotnet
dotnet pack -c Release
dotnet nuget push bin/Release/*.nupkg --api-key <your-nuget-api-key> --source https://api.nuget.org/v3/index.json
```

#### Go

Go modules are published via Git tags, which we've already done by tagging the repository.

## Verifying the Publication

After publishing, verify that:

1. The GitHub release contains all the necessary assets
2. The packages are available on their respective package managers:
   - npm: https://www.npmjs.com/package/@pulumi/castai
   - PyPI: https://pypi.org/project/pulumi-castai/
   - NuGet: https://www.nuget.org/packages/Pulumi.CastAI
   - Go: `go get github.com/castai/pulumi-castai/sdk/go/castai@v<new-version>`
3. The Pulumi Registry shows the updated package: https://www.pulumi.com/registry/packages/castai/

## Troubleshooting

If you encounter issues during the publishing process:

1. Check the GitHub Actions logs for errors
2. Verify that all required secrets are configured
3. Ensure the version in `version.txt` matches the Git tag
4. Check that the package builds locally before attempting to publish
