#!/usr/bin/env bash
echo "Setting up environment..."
# Check if .env file exists, create if not
if [ ! -f .env ]; then \
    echo "Creating .env file"; \
    echo "# CAST AI API credentials" > .env; \
    echo "CASTAI_API_TOKEN=" >> .env; \
    echo "CASTAI_API_URL=https://api.cast.ai" >> .env; \
    echo "" >> .env; \
fi

# Load environment variables
set -a
[ -f .env ] && . ./.env
set +a

mkdir -p bin 