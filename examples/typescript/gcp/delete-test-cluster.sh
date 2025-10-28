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

# Check for CAST AI managed nodes
CAST_NODES=$(gcloud compute instances list --project="$PROJECT_ID" \
    --filter="labels.cast-managed-by=cast-ai AND labels.goog-k8s-cluster-name=$CLUSTER_NAME" \
    --format="value(name)" 2>/dev/null | wc -l | tr -d ' ')

if [ "$CAST_NODES" -gt 0 ]; then
    echo "⚠️  WARNING: Found $CAST_NODES CAST AI-managed node(s) in this cluster!"
    echo ""
    echo "If you used full-onboarding with DELETE_NODES_ON_DISCONNECT=false (default),"
    echo "you must delete CAST AI nodes manually before deleting the cluster:"
    echo ""
    echo "  gcloud compute instances list --project=$PROJECT_ID \\"
    echo "    --filter=\"labels.cast-managed-by=cast-ai AND labels.goog-k8s-cluster-name=$CLUSTER_NAME\""
    echo ""
    echo "  gcloud compute instances delete NODE_NAME --zone=ZONE --project=$PROJECT_ID"
    echo ""
    echo "Or this cluster deletion will fail with: 'subnetwork resource is in use'"
    echo ""
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
