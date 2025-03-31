#!/usr/bin/env bash
# Usage: ./scripts/build-sdk-typescript.sh <VERSION>

VERSION="$1"

if [ -z "$VERSION" ]; then
  echo "Error: VERSION argument is required."
  exit 1
fi

echo "Using manually created schema..."
echo "Building TypeScript SDK only for version ${VERSION}..."
rm -rf sdk/nodejs
# Assuming pulumi-tfgen-castai is in the PATH or ./bin
./bin/pulumi-tfgen-castai nodejs --out sdk/nodejs/
cd sdk/nodejs && sed -i.bak "s/\${VERSION}/${VERSION}/g" package.json && rm -f package.json.bak
echo "TypeScript SDK built successfully in sdk/nodejs/"
echo "To install: npm install ./sdk/nodejs" 