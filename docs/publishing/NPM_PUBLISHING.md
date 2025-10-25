# NPM Publishing Guide

## Overview

This document provides guidance on publishing the `@castai/pulumi` package to the npm registry.

## Common Issues

### Version Already Exists

If you encounter an error like this when trying to publish:

```
npm error code E403
npm error 403 403 Forbidden - PUT https://registry.npmjs.org/@castai%2fpulumi - You cannot publish over the previously published versions: 0.1.14.
```

This means that the version you're trying to publish already exists in the npm registry. npm does not allow overwriting existing versions.

### Package.json Format Issues

npm may also warn about format issues in your package.json file:

```
npm warn publish npm auto-corrected some errors in your package.json when publishing.
npm warn publish errors corrected:
npm warn publish "repository" was changed from a string to an object
npm warn publish "repository.url" was normalized to "git+https://github.com/castai/pulumi-castai.git"
```

## How to Fix

We've added a script and justfile command to help fix these issues:

### Using the justfile Command

To fix the package.json file and sync it with the version in version.txt, run:

```bash
just fix-npm-package
```

This will:
1. Fix the repository field in package.json
2. Use the version from version.txt for the npm package

If you want to specify a new version, you can pass it as an argument:

```bash
just fix-npm-package 0.2.0
```

This will update both version.txt and the npm package.json file with the new version.

### Manual Fix

If you prefer to fix the issues manually:

1. Update the repository field in package.json:
   ```json
   "repository": {
     "type": "git",
     "url": "https://github.com/castai/pulumi-castai.git"
   }
   ```

2. Ensure the version in package.json matches version.txt:
   ```json
   "version": "0.1.15"
   ```

3. Run npm pkg fix to fix any other issues:
   ```bash
   cd sdk/nodejs
   npm pkg fix
   ```

## Publishing

After fixing the issues, you can publish the package:

```bash
cd sdk/nodejs
npm publish
```

## Version Numbering

We follow semantic versioning (SemVer) for this package:

- **Major version** (x.0.0): Breaking changes
- **Minor version** (0.x.0): New features, no breaking changes
- **Patch version** (0.0.x): Bug fixes and minor updates

## Additional Information

For more information about npm publishing, see:
- [npm publish documentation](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [Semantic Versioning](https://semver.org/)
