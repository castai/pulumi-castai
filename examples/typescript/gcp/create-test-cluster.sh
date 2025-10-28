#!/bin/bash
set -e

# Script to create a minimal GKE cluster for testing CAST AI read-only example
#
# This creates a small, cost-effective GKE cluster suitable for testing.
# The cluster will be created in your current gcloud project.

# Configuration
CLUSTER_NAME="${GKE_CLUSTER_NAME:-castai-readonly-test}"
LOCATION="${GKE_LOCATION:-us-central1-a}"
PROJECT_ID="${GCP_PROJECT_ID:-$(gcloud config get-value project)}"
MACHINE_TYPE="e2-standard-4"
NUM_NODES=3

echo "=========================================="
echo "Creating GKE Test Cluster"
echo "=========================================="
echo "Cluster Name: $CLUSTER_NAME"
echo "Location: $LOCATION"
echo "Project: $PROJECT_ID"
echo "Machine Type: $MACHINE_TYPE"
echo "Num Nodes: $NUM_NODES"
echo "=========================================="
echo ""

# Check if cluster already exists
if gcloud container clusters describe "$CLUSTER_NAME" --location="$LOCATION" --project="$PROJECT_ID" &>/dev/null; then
    echo "✅ Cluster '$CLUSTER_NAME' already exists in $LOCATION"
    echo ""
    echo "To delete it first, run:"
    echo "  gcloud container clusters delete $CLUSTER_NAME --location=$LOCATION --project=$PROJECT_ID --quiet"
    echo ""
    exit 1
fi

echo "Creating GKE cluster..."
gcloud container clusters create "$CLUSTER_NAME" \
    --location="$LOCATION" \
    --project="$PROJECT_ID" \
    --machine-type="$MACHINE_TYPE" \
    --num-nodes="$NUM_NODES" \
    --disk-size=20 \
    --disk-type=pd-standard \
    --enable-ip-alias \
    --enable-autoscaling \
    --min-nodes=3 \
    --max-nodes=8 \
    --no-enable-master-authorized-networks \
    --enable-stackdriver-kubernetes \
    --scopes="https://www.googleapis.com/auth/cloud-platform" \
    --quiet

echo ""
echo "✅ Cluster created successfully!"
echo ""

# Get credentials for kubectl
echo "Configuring kubectl access..."
gcloud container clusters get-credentials "$CLUSTER_NAME" \
    --location="$LOCATION" \
    --project="$PROJECT_ID"

echo ""
echo "✅ kubectl configured!"
echo ""

# Verify cluster access
echo "Verifying cluster access..."
kubectl cluster-info
echo ""

# Show cluster details
echo "=========================================="
echo "Cluster Information"
echo "=========================================="
gcloud container clusters describe "$CLUSTER_NAME" \
    --location="$LOCATION" \
    --project="$PROJECT_ID" \
    --format="value(name,location,currentMasterVersion,currentNodeCount,status)"

echo ""
echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo ""
echo "1. Set environment variables for the examples:"
echo "   export CASTAI_API_TOKEN=\"your-castai-api-token\""
echo "   export GKE_CLUSTER_NAME=\"$CLUSTER_NAME\""
echo "   export GCP_PROJECT_ID=\"$PROJECT_ID\""
echo "   export GKE_LOCATION=\"$LOCATION\""
echo ""
echo "2. Choose an example to run:"
echo ""
echo "   Read-only mode (monitoring only):"
echo "   cd readonly"
echo "   npm install"
echo "   pulumi stack init gke-readonly-test"
echo "   pulumi up"
echo ""
echo "   Full management mode (with autoscaling):"
echo "   cd full-onboarding"
echo "   npm install"
echo "   pulumi stack init gke-full-onboarding-test"
echo "   pulumi up"
echo ""
echo "3. When done testing, delete the cluster:"
echo "   cd $(dirname $0)"
echo "   ./delete-test-cluster.sh"
echo "   # or manually:"
echo "   gcloud container clusters delete $CLUSTER_NAME --location=$LOCATION --project=$PROJECT_ID --quiet"
echo ""
