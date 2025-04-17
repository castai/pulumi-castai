#!/bin/bash

# Parse command line arguments
DRY_RUN=false
SKIP_BUILD=false

for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      echo "Running in dry-run mode. No changes will be made."
      ;;
    --skip-build)
      SKIP_BUILD=true
      echo "Skipping build steps. Only version updates and git operations will be performed."
      ;;
  esac
done

set -e

# This script prepares a new release of the Pulumi CAST AI provider
# It ensures all necessary files are generated correctly, creates a tag based on version.txt, and pushes it
# The actual publishing is handled by the GitHub workflow

# Get the version from version.txt
VERSION=$(cat version.txt | tr -d '\n')
echo "Using version from version.txt: $VERSION"

# Check if the version is already tagged
if git rev-parse "v$VERSION" >/dev/null 2>&1; then
  echo "Tag v$VERSION already exists. Please update version.txt to a new version."
  exit 1
fi

# Step 1: Update version.go with the correct version
echo "Updating version.go with version $VERSION..."
# Check if version.go already has the correct version
if grep -q "$VERSION" provider/pkg/version/version.go; then
  echo "Version already set in version.go, skipping placeholder replacement"
else
  sed -i.bak "s/__VERSION__/$VERSION/g" provider/pkg/version/version.go && rm -f provider/pkg/version/version.go.bak
  echo "✅ Updated version.go"
fi

# Step 2: Run go mod tidy in the provider directory
echo "Running go mod tidy in provider directory..."
cd provider && go mod tidy
cd ..
echo "✅ Completed go mod tidy in provider"

# Step 3: Build the provider and generate schema
echo "Building provider and generating schema..."

if [[ "$DRY_RUN" == "true" ]]; then
  if [[ "$SKIP_BUILD" == "true" ]]; then
    echo "[DRY RUN] Would skip provider build steps as requested"
    echo "[DRY RUN] Would still ensure schema.json is copied to provider/sdk/schema"
    echo "✅ Provider build steps would be skipped (dry run)"
  else
    echo "[DRY RUN] Would check if provider binary exists and build if needed"
    echo "[DRY RUN] Would run: make clean, make provider, make build_schema (if needed)"
    echo "[DRY RUN] Would ensure schema.json is copied to provider/sdk/schema"
    echo "✅ Provider build steps would be executed (dry run)"
  fi
elif [[ "$SKIP_BUILD" == "true" ]]; then
  echo "Skipping provider build steps as requested"
  # Even when skipping build, always ensure schema.json is copied to provider/sdk/schema
  echo "Ensuring schema.json is copied to provider/sdk/schema..."
  ./scripts/copy_schema.sh
  echo "✅ Provider build steps skipped, but schema.json copied"
else
  # Check if the provider binary already exists
  if [ -f "bin/pulumi-resource-castai" ] && [ -f "schema.json" ]; then
    echo "Provider binary and schema already exist, checking if they match the current version"
    if grep -q "$VERSION" bin/pulumi-resource-castai; then
      echo "Provider binary matches current version, skipping build"
      # Even when skipping build, always ensure schema.json is copied to provider/sdk/schema
      echo "Ensuring schema.json is copied to provider/sdk/schema..."
      ./scripts/copy_schema.sh
    else
      echo "Provider binary does not match current version, rebuilding"
      make clean
      make provider
      make build_schema
      # Copy the schema to the provider/sdk/schema directory
      ./scripts/copy_schema.sh
      echo "✅ Provider built and schema generated"
    fi
  else
    echo "Provider binary or schema does not exist, building them"
    make clean
    make provider
    make build_schema
    # Copy the schema to the provider/sdk/schema directory
    ./scripts/copy_schema.sh
    echo "✅ Provider built and schema generated"
  fi
fi

# Step 4: Build the SDKs
echo "Building SDKs..."
if [[ "$DRY_RUN" == "true" ]]; then
  if [[ "$SKIP_BUILD" == "true" ]]; then
    echo "[DRY RUN] Would skip SDK build steps as requested"
    echo "✅ SDK build steps would be skipped (dry run)"
  else
    echo "[DRY RUN] Would check if SDKs exist and build if needed"
    echo "[DRY RUN] Would run: make build_sdks (if needed)"
    echo "✅ SDK build steps would be executed (dry run)"
  fi
elif [[ "$SKIP_BUILD" == "true" ]]; then
  echo "Skipping SDK build steps as requested"
  echo "✅ SDK build steps skipped"
else
  # Check if SDKs already exist and match the current version
  if [ -d "sdk/go/castai" ] && [ -d "sdk/nodejs" ] && [ -d "sdk/python" ]; then
    echo "SDKs already exist, checking if they match the current version"
    if grep -q "\"version\": \"$VERSION\"" sdk/nodejs/package.json; then
      echo "SDK version matches current version, skipping SDK build"
    else
      echo "SDK version does not match current version, rebuilding SDKs"
      make build_sdks
      echo "✅ SDKs built"
    fi
  else
    echo "SDKs do not exist, building them"
    make build_sdks
    echo "✅ SDKs built"
  fi
fi

# Step 5: Generate go.sum files for the Go SDK
echo "Generating go.sum files for Go SDK..."

if [[ "$DRY_RUN" == "true" ]]; then
  if [[ "$SKIP_BUILD" == "true" ]]; then
    echo "[DRY RUN] Would skip go.sum generation as requested"
    echo "✅ Go SDK go.sum generation would be skipped (dry run)"
  else
    echo "[DRY RUN] Would generate go.sum files for the Go SDK"
    echo "[DRY RUN] Would create temporary directory and copy SDK files"
    echo "[DRY RUN] Would run go mod tidy for main and castai modules"
    echo "[DRY RUN] Would copy go.sum files back to the original location"
    echo "✅ Go SDK go.sum files would be generated (dry run)"
  fi
elif [[ "$SKIP_BUILD" == "true" ]]; then
  echo "Skipping go.sum generation as requested"
  echo "✅ Go SDK go.sum generation skipped"
else
  # Create a temporary directory for generating go.sum files
  mkdir -p /tmp/go-sdk-temp
  cp -r sdk/go /tmp/go-sdk-temp/

  # Generate go.sum for the main module
  cd /tmp/go-sdk-temp/go
  go mod tidy || echo "Warning: go mod tidy failed for the main module, but we'll continue"

  # Generate go.sum for the castai module
  cd castai
  go mod tidy || echo "Warning: go mod tidy failed for the castai module, but we'll continue"

  # Copy the go.sum files back to the original location
  cp -f /tmp/go-sdk-temp/go/go.sum $(pwd)/../../../sdk/go/ || echo "No go.sum generated for main module"
  cp -f /tmp/go-sdk-temp/go/castai/go.sum $(pwd)/../../../sdk/go/castai/ || echo "No go.sum generated for castai module"

  # Return to the original directory
  cd $(pwd)/../../../

  # Verify go.sum files exist
  echo "Verifying go.sum files exist:"
  ls -la sdk/go/go.sum || echo "Warning: go.sum not found for main module"
  ls -la sdk/go/castai/go.sum || echo "Warning: go.sum not found for castai module"

  echo "✅ Go SDK go.sum files generated"
fi

# Step 6: Commit changes
echo "Committing changes..."
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DRY RUN] Would run: git add version.txt provider/pkg/version/version.go"
  echo "[DRY RUN] Would run: git add provider/sdk/schema/schema.json (if it exists)"
  echo "[DRY RUN] Would run: git add sdk/ (if it exists)"
  echo "[DRY RUN] Would run: git commit -m \"Prepare release v$VERSION\""
else
  git add version.txt provider/pkg/version/version.go
  # Add the schema.json file if it exists
  if [ -f "provider/sdk/schema/schema.json" ]; then
    git add provider/sdk/schema/schema.json
  fi
  # Only add sdk/ if it exists
  if [ -d "sdk" ]; then
    git add sdk/
  fi
  git commit -m "Prepare release v$VERSION"
fi
echo "✅ Changes committed"

# Step 7: Push changes to the repository FIRST
echo "Pushing changes to repository..."
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DRY RUN] Would run: git push origin HEAD"
else
  git push origin HEAD
fi
echo "✅ Changes pushed"

# Step 8: Create and push tag AFTER code changes
echo "Creating tag v$VERSION..."
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DRY RUN] Would run: git tag \"v$VERSION\""
else
  git tag "v$VERSION"
fi
echo "✅ Tag created"

# Ask user if they want to push the tag now
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DRY RUN] Would ask: Do you want to push the tag now to trigger the release pipeline? (y/n)"
  echo "[DRY RUN] Would run: git push origin \"v$VERSION\" (if user answers yes)"
else
  read -p "Do you want to push the tag now to trigger the release pipeline? (y/n): " PUSH_TAG
  if [[ "$PUSH_TAG" == "y" || "$PUSH_TAG" == "Y" ]]; then
    echo "Pushing tag v$VERSION..."
    git push origin "v$VERSION"
    echo "✅ Tag pushed. The GitHub workflow will now handle the rest of the publishing process."
  else
    echo "Tag not pushed. You can push it later with: git push origin v$VERSION"
  fi
fi

echo "IMPORTANT: Always push the code changes BEFORE pushing the tag to ensure the pipeline has access to the latest code."

echo "Once the workflow completes, the Go SDK should be available at: https://pkg.go.dev/github.com/castai/pulumi-castai/sdk/go/castai@v$VERSION"
echo "Note: It may take a few minutes for pkg.go.dev to index the new version after the workflow completes."
