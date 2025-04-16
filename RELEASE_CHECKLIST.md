# Release Checklist for CAST AI Pulumi Provider

Use this checklist when preparing a new release of the CAST AI Pulumi Provider.

## Pre-Release Checks

- [ ] All tests pass locally and in CI
- [ ] Documentation is up-to-date
- [ ] Examples are working correctly
- [ ] Schema metadata is complete and accurate
- [ ] Logo is available and accessible

## Version Update

- [ ] Update version in `version.txt`
- [ ] Run `./update-version.sh <new-version>` to update version across the codebase
- [ ] Verify version is updated in all necessary files:
  - [ ] `provider/pkg/version/version.go`
  - [ ] `package.json`
  - [ ] `sdk/*/version.txt` (for each language SDK)

## Documentation

- [ ] Update CHANGELOG.md with new version and changes
- [ ] Ensure `docs/_index.md` is up-to-date
- [ ] Ensure `docs/installation-configuration.md` is up-to-date
- [ ] Check for any API changes that need documentation updates

## Build and Test

- [ ] Build the provider locally: `make provider`
- [ ] Build all SDKs: `make build_sdks`
- [ ] Test the provider with examples:
  - [ ] TypeScript: `just run-typescript-examples`
  - [ ] Python: `just run-python-examples`
  - [ ] Go: `just run-go-examples`

## Release

- [ ] Commit all changes: `git add . && git commit -m "Prepare release v<new-version>"`
- [ ] Push to main: `git push origin main`
- [ ] Create and push tag: `git tag v<new-version> && git push origin v<new-version>`
- [ ] Verify GitHub Actions workflow starts and completes successfully
- [ ] Check GitHub release is created with all assets

## Post-Release Verification

- [ ] Verify packages are published to package managers:
  - [ ] npm: https://www.npmjs.com/package/@pulumi/castai
  - [ ] PyPI: https://pypi.org/project/pulumi-castai/
  - [ ] NuGet: https://www.nuget.org/packages/Pulumi.CastAI
  - [ ] Go: `go get github.com/castai/pulumi-castai/sdk/go/castai@v<new-version>`
- [ ] Verify Pulumi Registry shows the updated package
- [ ] Test installation from package managers:
  - [ ] `npm install @pulumi/castai`
  - [ ] `pip install pulumi-castai`
  - [ ] `dotnet add package Pulumi.CastAI`
  - [ ] `go get github.com/castai/pulumi-castai/sdk/go/castai@v<new-version>`
- [ ] Run examples with the published package

## Announcement

- [ ] Announce the release on appropriate channels
- [ ] Update any relevant documentation or websites
