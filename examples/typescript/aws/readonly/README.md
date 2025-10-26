# CAST AI EKS Read-Only Example (Phase 1)

This example demonstrates how to connect an **existing** EKS cluster to CAST AI in **read-only mode**. In this mode, CAST AI will monitor your cluster and provide optimization recommendations without making any changes.

## What This Example Does

1. **Registers your EKS cluster** with CAST AI using the `castai.EksCluster` resource
2. **Installs the CAST AI agent** in your cluster using Helm
3. **Enables monitoring** so you can see cost optimization opportunities in the CAST AI console

## Prerequisites

- **Existing EKS cluster** (this example does not create one)
- **AWS CLI** configured with credentials
- **kubectl** configured to access your cluster
- **Pulumi CLI** installed
- **CAST AI account** and API token ([sign up here](https://console.cast.ai))

## Architecture

```
┌─────────────────┐
│   Your EKS      │
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
export EKS_CLUSTER_NAME="lk-pulumi-10-26"
export AWS_REGION="us-east-1"
export AWS_ACCOUNT_ID="148761655444"
```

Or use the provided `.env` file in the project root:

```bash
# Load from project root .env
source ../../.env
```

## Usage

### 1. Install Dependencies

```bash
npm install
```

### 2. Initialize Pulumi Stack

```bash
pulumi stack init eks-readonly-dev
```

### 3. Configure AWS Region (if not using env vars)

```bash
pulumi config set aws:region us-east-1
```

### 4. Preview the Changes

```bash
pulumi preview
```

### 5. Deploy

```bash
pulumi up
```

The deployment will:
- Register your cluster with CAST AI
- Install the CAST AI agent in the `castai-agent` namespace
- Display the cluster ID and confirmation message

### 6. Verify Installation

Check that the CAST AI agent is running:

```bash
kubectl get pods -n castai-agent
```

You should see pods like:
- `castai-agent-xxxxx`
- `castai-agent-cpvpa-xxxxx`

### 7. View in CAST AI Console

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

## Next Steps

After reviewing recommendations in read-only mode, you can:

1. **Stay in read-only mode** - Just monitor and get recommendations
2. **Enable Phase 2** - Allow CAST AI to optimize your cluster (requires additional configuration)

## Cleanup

To remove CAST AI from your cluster:

```bash
pulumi destroy
```

This will:
- Uninstall the CAST AI agent
- Disconnect your cluster from CAST AI
- Remove the Helm release

**Note:** Your EKS cluster will remain unchanged. This only removes CAST AI resources.

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

## Resources Created

This example creates the following resources:

1. **Pulumi Resources**:
   - `castai.EksCluster` - Registers cluster with CAST AI
   - `kubernetes.helm.v3.Release` - Installs CAST AI agent

2. **Kubernetes Resources** (via Helm):
   - Namespace: `castai-agent`
   - Deployment: `castai-agent`
   - ServiceAccount: `castai-agent`
   - ClusterRole & ClusterRoleBinding (read-only permissions)

## Learn More

- [CAST AI Documentation](https://docs.cast.ai/docs/getting-started)
- [CAST AI EKS Guide](https://docs.cast.ai/docs/eks)
- [Pulumi CAST AI Provider](https://www.pulumi.com/registry/packages/castai/)

## Support

For issues with:
- **CAST AI service**: [CAST AI Support](https://docs.cast.ai)
- **Pulumi provider**: [GitHub Issues](https://github.com/castai/pulumi-castai/issues)
- **Example code**: [Report here](https://github.com/castai/pulumi-castai/issues)
