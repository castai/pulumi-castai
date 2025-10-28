#!/bin/bash
set -e

# Script to delete the GKE test cluster created by create-test-cluster.sh

# Configuration
CLUSTER_NAME="${GKE_CLUSTER_NAME:-castai-readonly-test}"
LOCATION="${GKE_LOCATION:-us-central1-a}"
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project)}"

echo "=========================================="
echo "Deleting GKE Test Cluster"
echo "=========================================="
echo "Cluster Name: $CLUSTER_NAME"
echo "Location: $LOCATION"
echo "Project: $PROJECT_ID"
echo "=========================================="
echo ""

# Check if cluster exists
if ! gcloud container clusters describe "$CLUSTER_NAME" --location="$LOCATION" --project="$PROJECT_ID" &>/dev/null; then
    echo "❌ Cluster '$CLUSTER_NAME' does not exist in $LOCATION"
    exit 1
fi

echo "⚠️  WARNING: This will permanently delete the cluster and all its resources!"
echo ""
read -p "Are you sure you want to delete the cluster? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Deletion cancelled."
    exit 0
fi

echo "Deleting cluster..."
gcloud container clusters delete "$CLUSTER_NAME" \
    --location="$LOCATION" \
    --project="$PROJECT_ID" \
    --quiet

echo ""
echo "✅ Cluster deleted successfully!"
echo ""
