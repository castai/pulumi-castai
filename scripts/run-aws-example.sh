#!/usr/bin/env bash
@echo "Running AWS example..."
if [ -f .env ]; then
    source .env
    cd examples/python && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" pulumi login --local && \
    PULUMI_CONFIG_PASSPHRASE="${PULUMI_CONFIG_PASSPHRASE}" \
    CASTAI_API_TOKEN="${CASTAI_API_TOKEN}" \
    AWS_ACCESS_KEY_ID="${AWS_ACCESS_KEY_ID}" \
    AWS_SECRET_ACCESS_KEY="${AWS_SECRET_ACCESS_KEY}" \
    AWS_REGION="${AWS_REGION}" \
    PULUMI_DEBUG_PROVIDERS=1 \
    pulumi up --yes -s aws
else
    echo "Error: .env file not found"
    exit 1
fi 