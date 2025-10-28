# CAST AI GKE Read-Only Example (Phase 1)

This example demonstrates how to connect an **existing** GKE cluster to CAST AI in **read-only mode**. In this mode, CAST AI will monitor your cluster and provide optimization recommendations without making any changes.

## What This Example Does

1. **Registers your GKE cluster** with CAST AI using the `CastAiGkeCluster` component
2. **Installs the CAST AI agent** in your cluster using Helm
3. **Enables monitoring** so you can see cost optimization opportunities in the CAST AI console

## Prerequisites

- **Existing GKE cluster** (this example does not create one)
- **GCP CLI** (gcloud) configured with credentials
- **kubectl** configured to access your cluster
- **Pulumi CLI** installed
- **CAST AI account** and API token ([sign up here](https://console.cast.ai))

## Architecture

```
┌─────────────────┐
│   Your GKE      │
│   Cluster       │
│                 │
│  ┌───────────┐  │
│  │ CAST AI   │  │ ◄──── Helm Chart
│  │ Agent     │  │       (read-only)
│  └───────────┘  │
└────────┬────────┘
         │
         │ Metrics & Recommendations
         ▼
   ┌──────────────┐
   │  CAST AI     │
   │  Console     │
   └──────────────┘
```

## Environment Variables

Set these environment variables before running the example:

```bash
export CASTAI_API_TOKEN="your-castai-api-token"
export GKE_CLUSTER_NAME="my-gke-cluster"
export GCP_PROJECT_ID="my-project-id"
export GKE_LOCATION="us-central1-a"  # or us-central1 for regional clusters
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
pulumi stack init gke-readonly-dev
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
- Install the CAST AI agent in the `castai-agent` namespace
- Display the cluster ID and confirmation message

### 7. Verify Installation

Check that the CAST AI agent is running:

```bash
kubectl get pods -n castai-agent
```

You should see pods like:
- `castai-agent-xxxxx`
- `castai-agent-cpvpa-xxxxx`

### 8. View in CAST AI Console

1. Log in to [CAST AI Console](https://console.cast.ai)
2. Navigate to your cluster
3. View cost optimization recommendations

## What You'll See in CAST AI

After connecting your cluster, CAST AI will:

- ✅ **Analyze your workloads** and resource usage
- ✅ **Identify cost savings opportunities** (right-sizing, spot instances, etc.)
- ✅ **Show potential monthly savings**
- ✅ **Provide optimization recommendations**

## Read-Only Mode Guarantees

In read-only mode (Phase 1):

- ✅ CAST AI **WILL**:
  - Monitor your cluster
  - Analyze costs and usage
  - Provide recommendations
  - Show potential savings

- ❌ CAST AI **WILL NOT**:
  - Make any changes to your cluster
  - Modify workloads or deployments
  - Scale nodes or pods
  - Change any configurations
  - Create or delete nodes

## Next Steps

After reviewing recommendations in read-only mode, you can:

1. **Stay in read-only mode** - Just monitor and get recommendations
2. **Enable full management** - See the `full-onboarding` example for Phase 2 setup

## Cleanup

To remove CAST AI from your cluster:

```bash
pulumi destroy
```

This will:
- Uninstall the CAST AI agent
- Disconnect your cluster from CAST AI
- Remove the Helm release

**Note:** Your GKE cluster will remain unchanged. This only removes CAST AI resources.

## Troubleshooting

### Agent Not Starting

Check agent logs:
```bash
kubectl logs -n castai-agent -l app.kubernetes.io/name=castai-agent
```

### Connection Issues

Verify your API token:
```bash
echo $CASTAI_API_TOKEN | cut -c1-10
```

Verify cluster access:
```bash
kubectl cluster-info
```

### Helm Chart Issues

Check Helm releases:
```bash
helm list -n castai-agent
```

### GCP Authentication Issues

Verify GCP authentication:
```bash
gcloud auth list
gcloud config get-value project
```

## Resources Created

This example creates the following resources:

1. **Pulumi Resources**:
   - `CastAiGkeCluster` - High-level component that manages:
     - `castai.GkeCluster` - Registers cluster with CAST AI
     - `kubernetes.helm.v3.Release` - Installs CAST AI agent

2. **Kubernetes Resources** (via Helm):
   - Namespace: `castai-agent`
   - Deployment: `castai-agent`
   - ServiceAccount: `castai-agent`
   - ClusterRole & ClusterRoleBinding (read-only permissions)

## Learn More

- [CAST AI Documentation](https://docs.cast.ai/docs/getting-started)
- [CAST AI GKE Guide](https://docs.cast.ai/docs/gke)
- [Pulumi CAST AI Provider](https://www.pulumi.com/registry/packages/castai/)

## Support

For issues with:
- **CAST AI service**: [CAST AI Support](https://docs.cast.ai)
- **Pulumi provider**: [GitHub Issues](https://github.com/castai/pulumi-castai/issues)
- **Example code**: [Report here](https://github.com/castai/pulumi-castai/issues)
