#!/usr/bin/env bash
echo "Using manually created schema..."
echo "Building Python SDK only..."
rm -rf sdk/python
# Assuming pulumi-tfgen-castai is in the PATH or ./bin
./bin/pulumi-tfgen-castai python --out sdk/python/
cd sdk/python && python -m pip install build && python -m build .
echo "Python SDK built successfully in sdk/python/"
echo "To install: pip install -e ./sdk/python" 