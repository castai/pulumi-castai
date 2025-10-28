# CAST AI GKE Full Onboarding Example (Phase 1 + Phase 2)

This example demonstrates how to connect an **existing** GKE cluster to CAST AI with **full management** capabilities. CAST AI will optimize your cluster by automatically managing nodes, right-sizing workloads, and reducing costs.

## What This Example Does

1. **Phase 1: Monitoring**
   - Registers your GKE cluster with CAST AI
   - Installs the CAST AI agent for monitoring

2. **Phase 2: Full Management**
   - Creates GCP service account with required IAM permissions
   - Installs CAST AI controllers (cluster-controller, spot-handler, evictor, pod-pinner)
   - Creates default node configuration with your subnets and network tags
   - Sets up custom node configuration (GPU-optimized nodes example)
   - Creates node template for spot instances
   - Configures autoscaler policies

## Prerequisites

- **GCP CLI** (gcloud) configured with credentials
- **kubectl** installed
- **Pulumi CLI** installed
- **CAST AI account** and API token ([sign up here](https://console.cast.ai))
- **Existing GKE cluster** OR use the provided script to create a test cluster (see below)

## Architecture

```
┌─────────────────────────────────┐
│      Your GKE Cluster           │
│                                 │
│  ┌────────────────────────┐    │
│  │   CAST AI Components   │    │
│  │  • Agent               │    │
│  │  • Controller          │◄───┼── Service Account
│  │  • Spot Handler        │    │   (IAM Roles)
│  │  • Evictor             │    │
│  │  • Pod Pinner          │    │
│  └────────────────────────┘    │
│                                 │
│  ┌────────────────────────┐    │
│  │  CAST AI Managed Nodes │    │
│  │  • Spot instances      │    │
│  │  • Right-sized         │    │
│  │  • Auto-scaled         │    │
│  └────────────────────────┘    │
└─────────────┬───────────────────┘
              │
              │ Optimization & Control
              ▼
        ┌──────────────┐
        │  CAST AI     │
        │  Console     │
        └──────────────┘
```

## Option 1: Create a Test GKE Cluster

If you don't have an existing GKE cluster, use the provided script to create a minimal test cluster:

```bash
# From the gcp directory
cd ..
./create-test-cluster.sh

# The script will:
# - Create a 2-node e2-medium cluster in us-central1-a
# - Configure kubectl access automatically
# - Display environment variables to set
```

**Cluster specifications:**
- Machine type: `e2-medium` (2 vCPUs, 4 GB RAM)
- Nodes: 2 (with autoscaling 2-4)
- Disk: 20 GB standard persistent disk
- Cost: ~$50/month (delete after testing!)

**Customize the cluster:**
```bash
export GKE_CLUSTER_NAME="my-test-cluster"
export GKE_LOCATION="us-west1-a"
export GCP_PROJECT_ID="my-project"
../create-test-cluster.sh
```

**Delete the test cluster when done:**
```bash
../delete-test-cluster.sh
```

## Option 2: Use an Existing GKE Cluster

If you already have a GKE cluster, skip to the Usage section below.

## Environment Variables

Set these environment variables before running the example:

```bash
export CASTAI_API_TOKEN="your-castai-api-token"
export GKE_CLUSTER_NAME="my-gke-cluster"
export GCP_PROJECT_ID="my-project-id"
export GKE_LOCATION="us-central1-a"  # or us-central1 for regional clusters
```

Optional:
```bash
export CASTAI_API_URL="https://api.cast.ai"  # Custom API URL
export DELETE_NODES_ON_DISCONNECT="false"    # Remove nodes on disconnect
```

Or copy and customize the `.env.example` file:

```bash
cp .env.example .env
# Edit .env with your values
source .env
```

## Usage

### 1. Authenticate with GCP

```bash
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

### 2. Configure kubectl

```bash
gcloud container clusters get-credentials YOUR_CLUSTER_NAME --location YOUR_LOCATION
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize Pulumi Stack

```bash
pulumi stack init gke-full-onboarding-dev
```

### 5. Preview the Changes

```bash
pulumi preview
```

### 6. Deploy

```bash
pulumi up
```

The deployment will:
- Register your cluster with CAST AI
- Create GCP service account with IAM roles
- Install CAST AI agent and controllers
- Create default node configuration
- Create custom node configuration (gpu-nodes)
- Create spot instance template
- Configure autoscaler policies

### 7. Verify Installation

Check that all CAST AI components are running:

```bash
kubectl get pods -n castai-agent
```

You should see:
- `castai-agent-xxxxx`
- `castai-cluster-controller-xxxxx`
- `castai-spot-handler-xxxxx`
- `castai-evictor-xxxxx` (if enabled)
- `castai-pod-pinner-xxxxx` (if enabled)

### 8. View in CAST AI Console

1. Log in to [CAST AI Console](https://console.cast.ai)
2. Navigate to your cluster
3. View autoscaling activity and cost savings

## What You'll See in CAST AI

After full onboarding, CAST AI will:

- ✅ **Automatically scale** your cluster based on workload demands
- ✅ **Add/remove nodes** to optimize costs and performance
- ✅ **Use spot instances** where appropriate to reduce costs
- ✅ **Right-size workloads** with recommendations
- ✅ **Show real-time cost savings**
- ✅ **Provide optimization insights**

## Full Management Mode Features

In full management mode (Phase 2):

- ✅ CAST AI **WILL**:
  - Add nodes when workloads require them
  - Remove underutilized nodes
  - Use spot/preemptible instances for cost savings
  - Optimize node configurations
  - Scale based on autoscaler policies
  - Respect pod disruption budgets
  - Honor taints and node selectors

- ⚠️ CAST AI **MAY**:
  - Drain and replace nodes for optimization
  - Evict pods (respecting PDBs) for consolidation

## Autoscaler Policies

This example configures the following autoscaler policies:

**Unschedulable Pods:**
- Enabled: Add nodes when pods can't be scheduled
- Respects node templates and constraints

**Node Downscaler:**
- Empty nodes: Remove after 5 minutes
- Evictor: Enabled for pod consolidation
- Scoped mode: Only CAST AI managed nodes
- Grace period: 10 minutes

**Cluster Limits:**
- Min vCPUs: 4
- Max vCPUs: 100

## Custom Configurations

This example includes:

**Custom Node Configuration (gpu-nodes):**
- SSD persistent disks
- Network tags: castai-managed, gpu-nodes
- 100 GB minimum disk size
- Suitable for GPU workloads

**Spot Instance Template:**
- Uses spot (preemptible) instances
- Spot diversity enabled (20% price increase limit)
- Compute-optimized families: c2, c2d, n2, n2d, e2
- CPU: 2-16 vCPUs
- Memory: 4-64 GB
- Custom labels and taints for workload targeting

## Cleanup

To remove CAST AI from your cluster and delete resources:

```bash
# Remove CAST AI resources
pulumi destroy

# If you created a test cluster, delete it
cd ..
./delete-test-cluster.sh
```

**Note:** `pulumi destroy` will:
- Uninstall all CAST AI Helm charts
- Delete the service account and IAM resources
- Disconnect your cluster from CAST AI
- Remove node configurations and templates

Your GKE cluster will remain, but CAST AI will no longer manage it.

## Troubleshooting

### Components Not Starting

Check component logs:
```bash
kubectl logs -n castai-agent -l app.kubernetes.io/name=castai-agent
kubectl logs -n castai-agent -l app.kubernetes.io/name=castai-cluster-controller
```

### IAM Permission Issues

Verify service account permissions:
```bash
gcloud projects get-iam-policy YOUR_PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:castai*"
```

### Autoscaler Not Working

Check autoscaler status in CAST AI console:
1. Navigate to Autoscaler section
2. Verify policies are enabled
3. Check for any error messages

### Node Not Being Added

Common issues:
- Check node template constraints
- Verify subnet and network tag configuration
- Check GCP quotas for the instance types
- Review CAST AI logs for errors

## Resources Created

This example creates:

**GCP Resources:**
- Service account: `castai-gke-{cluster-name}`
- Custom IAM roles: cluster-role, compute-role
- IAM bindings: 3 role assignments

**CAST AI Resources:**
- Cluster registration
- Default node configuration
- Custom node configuration (gpu-nodes)
- Node template (spot-instances)
- Autoscaler policies

**Kubernetes Resources (via Helm):**
- Namespace: `castai-agent`
- 5 Helm releases (agent, controller, spot-handler, evictor, pod-pinner)
- ServiceAccounts, ClusterRoles, ClusterRoleBindings

## Cost Optimization Tips

1. **Start with policies disabled** in dry-run mode to understand behavior
2. **Monitor for a few days** before enabling aggressive policies
3. **Use spot instances** for non-critical workloads
4. **Set appropriate cluster limits** to prevent runaway scaling
5. **Review recommendations** in the CAST AI console regularly

## Learn More

- [CAST AI Documentation](https://docs.cast.ai/docs/getting-started)
- [CAST AI GKE Guide](https://docs.cast.ai/docs/gke)
- [Pulumi CAST AI Provider](https://www.pulumi.com/registry/packages/castai/)
- [Autoscaler Policies](https://docs.cast.ai/docs/autoscaler)
- [Node Configuration](https://docs.cast.ai/docs/node-configuration)

## Support

For issues with:
- **CAST AI service**: [CAST AI Support](https://docs.cast.ai)
- **Pulumi provider**: [GitHub Issues](https://github.com/castai/pulumi-castai/issues)
- **Example code**: [Report here](https://github.com/castai/pulumi-castai/issues)
