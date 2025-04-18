#!/bin/bash
set -e

# This script updates the version in the Python setup.py file
# and builds/publishes the Python package

# Get the version from the first argument
VERSION=$1
PYPI_PASSWORD=$2

cd sdk/python

# Create a new setup.py with the correct version
echo "Creating new setup.py with version $VERSION"
cat > setup.py << EOF
# coding=utf-8
# *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

import errno
from setuptools import setup, find_packages
from setuptools.command.install import install
from subprocess import check_call


VERSION = "$VERSION"
def readme():
    try:
        with open('README.md', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        return "castai Pulumi Package - Development Version"


setup(name='pulumi_castai',
      python_requires='>=3.9',
      version=VERSION,
      description="A Pulumi package for creating and managing CAST AI cloud resources.",
      long_description=readme(),
      long_description_content_type='text/markdown',
      keywords='pulumi castai kubernetes category/cloud',
      url='https://cast.ai',
      project_urls={
          'Repository': 'https://github.com/castai/pulumi-castai'
      },
      license='Apache-2.0',
      packages=find_packages(),
      package_data={
          'pulumi_castai': [
              'py.typed',
              'pulumi-plugin.json',
          ]
      },
      install_requires=[
          'parver>=0.2.1',
          'pulumi>=3.0.0,<4.0.0',
          'semver>=2.8.1',
          'typing-extensions>=4.11,<5; python_version < "3.11"'
      ],
      zip_safe=False)
EOF

cat setup.py

pip install build twine
python -m build

# List the built packages to verify versions
echo "Built packages:"
ls -la dist/

# Check if this version already exists in PyPI
echo "Checking if Python package version $VERSION already exists on PyPI..."
if pip install --index-url https://pypi.org/simple/ --only-binary=:all: pulumi_castai==$VERSION 2>/dev/null; then
  echo "Version $VERSION already exists in PyPI registry. Skipping publish."
  pip uninstall -y pulumi_castai
else
  echo "Version $VERSION does not exist in PyPI registry. Publishing..."
  # Only upload the correct version
  twine upload dist/pulumi_castai-${VERSION}* -u __token__ -p $PYPI_PASSWORD
fi
