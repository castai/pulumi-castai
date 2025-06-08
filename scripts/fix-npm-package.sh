#!/bin/bash
set -e

# This script fixes the package.json file in the sdk/nodejs directory
# and ensures it uses the version from version.txt
# It's designed to be run in a CI/CD pipeline

# Get the version from version.txt
VERSION_FROM_FILE=$(cat version.txt | tr -d '\n')

# Check if a version is provided as an argument
if [ $# -eq 1 ]; then
  NEW_VERSION="$1"
  echo "Using provided version: $NEW_VERSION"

  # Update version.txt with the new version
  echo "Updating version.txt to $NEW_VERSION..."
  echo -n "$NEW_VERSION" > version.txt
else
  # Use the version from version.txt
  NEW_VERSION="$VERSION_FROM_FILE"
  echo "Using version from version.txt: $NEW_VERSION"

  # Get the current version from package.json
  CURRENT_VERSION=$(cd sdk/nodejs && node -p "require('./package.json').version")
  echo "Current npm package version: $CURRENT_VERSION"

  if [ "$CURRENT_VERSION" = "$NEW_VERSION" ]; then
    echo "Warning: The current npm package version ($CURRENT_VERSION) is the same as the version in version.txt."
    echo "This may cause publishing errors if this version has already been published."

    # In a CI/CD environment, we should increment the patch version automatically
    # Split the version into major, minor, and patch
    IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT_VERSION"

    # Increment the patch version
    PATCH=$((PATCH + 1))

    # Create the new version
    NEW_VERSION="$MAJOR.$MINOR.$PATCH"

    echo "Automatically incrementing version to $NEW_VERSION for CI/CD pipeline"

    # Update version.txt with the new version
    echo "Updating version.txt to $NEW_VERSION..."
    echo -n "$NEW_VERSION" > version.txt
  fi
fi

# Fix the repository field in package.json
echo "Fixing repository field in package.json..."
cd sdk/nodejs
node -e "
  const fs = require('fs');
  const pkg = require('./package.json');

  // Fix repository field
  pkg.repository = {
    type: 'git',
    url: 'https://github.com/castai/pulumi-castai.git'
  };

  // Update version
  pkg.version = '$NEW_VERSION';

  // Add main field pointing to compiled JavaScript
  pkg.main = 'bin/index.js';

  // Write the updated package.json
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2) + '\n');
"

echo "package.json has been updated:"
cat package.json | grep -A 10 "\"version\""
cat package.json | grep -A 5 "\"repository\""

echo "To publish the package, run:"
echo "cd sdk/nodejs && npm publish"
