#!/usr/bin/env bash
echo "Running AWS TypeScript example..."
if [ -f .env ]; then
    # Load environment variables from .env file
    set -a
    source .env
    set +a
    # Install dependencies if needed
    if [ ! -d "examples/typescript/node_modules" ]; then
        cd examples/typescript && npm install && cd ../..
    fi

    # Copy node_modules to the AWS example directory
    if [ ! -d "examples/typescript/aws/node_modules" ]; then
        mkdir -p examples/typescript/aws/node_modules
        cp -r examples/typescript/node_modules/* examples/typescript/aws/node_modules/
    fi

    cd examples/typescript/aws && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi login --local && \
    # Remove the stack if it exists to avoid cached state issues
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack rm aws-example --force --yes 2>/dev/null || true && \
    # Create a new stack
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi stack init aws-example && \
    # Run the example
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" \
    CASTAI_API_TOKEN="${CASTAI_API_TOKEN}" \
    AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \
    AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \
    AWS_REGION="${AWS_REGION}" \
    PULUMI_DEBUG_PROVIDERS=1 \
    pulumi up --yes -s aws-example --config aws:region=${AWS_REGION}
else
    echo "Error: .env file not found"
    exit 1
fi
