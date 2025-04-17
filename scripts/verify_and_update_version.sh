#!/bin/bash
set -e

# This script verifies the version and updates version.txt
# It also creates a PR to bump the version for the next release

# Get parameters
VERSION=$1
TAG_VERSION=$2
CURRENT_VERSION=$3
NEXT_VERSION=$4
GITHUB_REF=$5
IS_TAG=$6
GITHUB_TOKEN=$7

# Verify versions match
if [[ "$IS_TAG" == "true" && "$VERSION" != "$TAG_VERSION" && -z "$MANUAL_VERSION" && $GITHUB_REF == refs/tags/* ]]; then
  echo "Error: Version in version.txt ($CURRENT_VERSION) does not match tag version ($TAG_VERSION)"
  exit 1
fi

echo "Using version: $VERSION"

# Check if this version already exists in npm
if npm view @castai/pulumi@$VERSION version &> /dev/null; then
  echo "Warning: Version $VERSION already exists in npm registry."
  echo "PACKAGE_EXISTS=true" >> $GITHUB_ENV
else
  echo "PACKAGE_EXISTS=false" >> $GITHUB_ENV
fi

# Update version.txt with the current version
echo "$VERSION" > version.txt

# If this is a tag push, create a new branch for the next version
if [[ $GITHUB_REF == refs/tags/* ]]; then
  echo "Creating branch and PR for next version..."
  
  # Configure Git
  git config --local user.email "action@github.com"
  git config --local user.name "GitHub Action"

  # Create a new branch for the next version
  git checkout -b bump-version-to-$NEXT_VERSION || {
    echo "Failed to create branch bump-version-to-$NEXT_VERSION"
    # If branch already exists, try to use it
    git fetch origin
    git checkout bump-version-to-$NEXT_VERSION || {
      echo "Could not checkout existing branch either. Continuing without creating PR."
      # Return success anyway to not fail the build
      exit 0
    }
  }

  # Update version.txt with the next version
  echo "$NEXT_VERSION" > version.txt

  # Commit and push the changes
  git add version.txt
  git commit -m "Bump version to $NEXT_VERSION" || echo "No changes to commit"
  
  # Push with error handling
  git push origin bump-version-to-$NEXT_VERSION || {
    echo "Failed to push branch. Continuing without creating PR."
    # Return success anyway to not fail the build
    exit 0
  }

  # Create a pull request with error handling
  gh pr create --title "Bump version to $NEXT_VERSION" \
              --body "Automatically bumped version after release $VERSION" \
              --base main \
              --head bump-version-to-$NEXT_VERSION || {
    echo "Failed to create PR. It might already exist or there might be permission issues."
    # Return success anyway to not fail the build
    exit 0
  }

  # Switch back to the original branch/tag for the rest of the workflow
  git checkout ${GITHUB_REF#refs/tags/} || git checkout main || {
    echo "Failed to switch back to original branch. Using detached HEAD."
    # Return success anyway to not fail the build
    exit 0
  }
  
  # Make sure version.txt has the current version
  echo "$VERSION" > version.txt
fi

# Always exit with success
exit 0
