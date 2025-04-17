#!/bin/bash
set -e

# Check if a new version is provided as an argument
if [ $# -ne 1 ]; then
    echo "Usage: $0 <new_version>"
    echo "Example: $0 0.2.0"
    exit 1
fi

NEW_VERSION=$1
CURRENT_VERSION=$(cat version.txt | tr -d '\n')

echo "Updating version from $CURRENT_VERSION to $NEW_VERSION"

# Update version.txt (source of truth)
echo -n "$NEW_VERSION" > version.txt
echo "✅ Updated version.txt"

# Update package.json files
./sync-package-version.js
echo "✅ Updated package.json files"

# Update Python setup.py if it exists
if [ -f "sdk/python/setup.py" ]; then
    echo "Updating Python SDK version..."
    # This pattern matches various version strings in setup.py and replaces them
    sed -i.bak "s/version=.*,/version=\"${NEW_VERSION}\",/g" sdk/python/setup.py
    sed -i.bak "s/VERSION = \".*\"/VERSION = \"${NEW_VERSION}\"/g" sdk/python/setup.py
    rm -f sdk/python/setup.py.bak
    echo "✅ Updated Python SDK version"
fi

# Update versions in Python examples
echo "Updating versions in Python examples..."
find examples -name "*.py" -type f -exec sed -i.bak "s/version=\"[0-9]\+\.[0-9]\+\.[0-9]\+\"/version=\"${NEW_VERSION}\"/g" {} \;
find examples -name "*.py.bak" -type f -delete
echo "✅ Updated Python examples"

# The rest of the project should pull from version.txt during build
echo
echo "Version updated to $NEW_VERSION"
echo "To apply the changes throughout the project, run:"
echo "  make clean && make build"
echo
echo "NOTE: The version is now centralized in version.txt and is read by:"
echo "  - Makefile"
echo "  - justfile"
echo "  - package.json (via sync-package-version.js)"
echo "  - provider/pkg/version/version.go (during build)" 