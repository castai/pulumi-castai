# CAST AI AWS Full Onboarding Example (TypeScript)

This example demonstrates complete EKS cluster onboarding to CAST AI with autoscaling, cost optimization, and rebalancing features.

## What This Example Includes

This comprehensive example sets up:

### Core Resources
- **EKS Cluster Registration**: Connects your existing EKS cluster to CAST AI
- **IAM Configuration**: Creates necessary IAM roles and policies for CAST AI
- **Instance Profile**: Sets up EC2 instance profiles for CAST AI managed nodes

### Node Management
- **Node Configuration**: Defines how nodes should be provisioned (subnets, security groups, etc.)
- **Node Templates**:
  - Default on-demand template
  - Spot instance template with custom labels and taints

### Autoscaling & Optimization
- **Autoscaler**: Configures pod scheduling and node scaling policies
- **Rebalancing Schedule**: Automated cost optimization runs every 30 minutes
- **Cluster Limits**: CPU core limits to prevent unexpected scaling

### Kubernetes Components (Helm Charts)
- **castai-agent**: Monitoring and metrics collection
- **castai-cluster-controller**: Cluster management
- **castai-evictor**: Pod eviction for node consolidation
- **castai-pod-pinner**: Pod placement optimization

## Prerequisites

1. **Existing EKS Cluster**: You must have an EKS cluster already running
2. **CAST AI Account**: Sign up at https://cast.ai
3. **AWS Credentials**: AWS access key and secret with appropriate permissions
4. **Pulumi CLI**: Install from https://www.pulumi.com/docs/get-started/install/
5. **Node.js**: Version 18 or higher

## Required Permissions

The AWS credentials you use must have permissions to:
- Read EKS cluster details (`eks:Describe*`, `eks:List*`)
- Create IAM roles and policies
- Create IAM instance profiles
- Read EC2 security groups and subnets

## Setup Instructions

### 1. Install Dependencies

```bash
cd examples/typescript/aws/full-onboarding
npm install
```

### 2. Configure Environment Variables

Create a `.env` file or export these variables:

```bash
# Required
export CASTAI_API_TOKEN="your-castai-api-token"
export AWS_ACCESS_KEY_ID="your-aws-access-key"
export AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
export AWS_REGION="us-east-1"  # Your cluster's region
export EKS_CLUSTER_NAME="your-cluster-name"

# Optional
export AWS_ACCOUNT_ID="123456789012"  # Auto-detected if not provided
export CASTAI_API_URL="https://api.cast.ai"  # Custom API URL if needed
```

### 3. Initialize Pulumi Stack

```bash
pulumi stack init dev
```

### 4. Preview the Changes

```bash
pulumi preview
```

This will show you all the resources that will be created, including:
- 1 EksClusterId resource
- 1 EksUserArn resource
- 1 IAM Role
- 1 IAM Policy
- 1 IAM Role Policy Attachment
- 1 IAM Instance Profile
- 1 Node Configuration
- 2 Node Templates
- 1 Autoscaler
- 1 Rebalancing Schedule
- 1 Rebalancing Job
- 4 Helm Releases

### 5. Deploy

```bash
pulumi up
```

Review the changes and confirm by typing "yes".

## What Gets Created

### AWS Resources

1. **IAM Role**: `castai-eks-{cluster-name}`
   - Allows CAST AI to assume role in your account
   - Trust relationship with CAST AI user ARN

2. **IAM Policy**: `castai-eks-{cluster-name}`
   - EC2 permissions for launching instances
   - Autoscaling group management
   - EKS cluster read access

3. **Instance Profile**: `castai-eks-{cluster-name}`
   - Attached to EC2 instances launched by CAST AI

### CAST AI Resources

1. **Cluster Registration**
   - Cluster ID for CAST AI tracking
   - User ARN for IAM trust relationship

2. **Node Configuration** (`default`)
   - Uses your EKS cluster's subnets
   - Configured with cluster security group
   - Tagged with cluster ID

3. **Node Templates**
   - **default-by-castai**: On-demand instances only
   - **spot-by-castai**: Spot instances with:
     - Custom labels: `workload-type=batch`, `cost-optimization=spot`
     - Custom taint: `scheduling.cast.ai/spot=true:NoSchedule`
     - Min 4 CPU, max 100 CPU
     - Max 256 GiB memory
     - Instance families: m5, m6i, c5, c6i

4. **Autoscaler Configuration**
   - Enabled by default
   - Unschedulable pods policy enabled
   - Node downscaler with evictor enabled
   - Cluster limits: 1-100 CPU cores

5. **Rebalancing Schedule**
   - Runs every 30 minutes (`*/30 * * * *`)
   - Triggers when savings > 20%
   - Targets spot nodes
   - Keeps minimum 2 nodes during rebalancing

### Kubernetes Resources

All components are installed in the `castai-agent` namespace:

- **castai-agent**: Main monitoring agent
- **cluster-controller**: Manages cluster operations
- **castai-evictor**: Handles pod eviction for optimization
- **castai-pod-pinner**: Optimizes pod placement

## Outputs

After deployment, you'll see these outputs:

```typescript
clusterName                : "your-cluster-name"
clusterId                  : "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
castaiRoleArn             : "arn:aws:iam::123456789012:role/castai-eks-your-cluster"
castaiInstanceProfileArn  : "arn:aws:iam::123456789012:instance-profile/castai-eks-your-cluster"
nodeConfigurationId       : "xxxx"
defaultNodeTemplateId     : "xxxx"
spotNodeTemplateId        : "xxxx"
autoscalerEnabled         : true
rebalancingScheduleId     : "xxxx"
agentHelmRelease          : "castai-agent"
controllerHelmRelease     : "cluster-controller"
evictorHelmRelease        : "castai-evictor"
podPinnerHelmRelease      : "castai-pod-pinner"
```

## Verification

### Check CAST AI Console

1. Log in to https://console.cast.ai
2. Navigate to your cluster
3. Verify:
   - Cluster is connected
   - Agent is reporting metrics
   - Node templates are visible
   - Autoscaler is enabled

### Check Kubernetes Resources

```bash
# Check CAST AI namespace
kubectl get pods -n castai-agent

# Expected output:
# NAME                                   READY   STATUS    RESTARTS   AGE
# castai-agent-xxxxx                     2/2     Running   0          5m
# cluster-controller-xxxxx               1/1     Running   0          5m
# castai-evictor-xxxxx                   1/1     Running   0          5m
# castai-pod-pinner-xxxxx                1/1     Running   0          5m
```

### Check IAM Resources

```bash
# Verify IAM role was created
aws iam get-role --role-name castai-eks-your-cluster-name

# Verify instance profile was created
aws iam get-instance-profile --instance-profile-name castai-eks-your-cluster-name
```

## Customization

### Adjusting Node Templates

Edit the `spotNodeTemplate` constraints to match your workload needs:

```typescript
constraints: {
    spot: true,
    minCpu: 8,           // Increase minimum CPU
    maxCpu: 200,         // Increase maximum CPU
    maxMemory: 512 * 1024, // 512 GiB
    instanceFamilies: {
        includes: ["m6i", "c6i", "r6i"], // Add memory-optimized
    },
},
```

### Changing Autoscaler Settings

Modify the `autoscaler` resource to adjust policies:

```typescript
autoscalerSettings: {
    enabled: true,
    clusterLimits: {
        enabled: true,
        cpu: {
            minCores: 4,    // Higher minimum
            maxCores: 200,  // Higher maximum
        },
    },
    nodeDownscaler: {
        enabled: true,
        evictor: {
            aggressiveMode: true,  // More aggressive optimization
            cycleInterval: "30s",  // Run more frequently
        },
    },
},
```

### Adjusting Rebalancing Schedule

Change the cron schedule or savings threshold:

```typescript
schedule: {
    cron: "0 */2 * * *",  // Every 2 hours instead of 30 minutes
},
triggerConditions: {
    savingsPercentage: 30,  // Higher threshold (more conservative)
},
```

## Cleanup

To remove all resources:

```bash
pulumi destroy
```

This will:
1. Remove all Helm releases from Kubernetes
2. Delete CAST AI resources (node templates, autoscaler, etc.)
3. Delete AWS IAM resources (role, policy, instance profile)
4. Disconnect the cluster from CAST AI

**Note**: This will NOT delete your EKS cluster itself.

## Troubleshooting

### Error: "Failed to create IAM role"

**Cause**: Insufficient AWS permissions
**Solution**: Ensure your AWS credentials have `iam:CreateRole`, `iam:CreatePolicy`, and `iam:CreateInstanceProfile` permissions

### Error: "Cluster not found"

**Cause**: EKS cluster name or region is incorrect
**Solution**: Verify `EKS_CLUSTER_NAME` and `AWS_REGION` match your actual cluster

### Pods stuck in Pending state

**Cause**: Autoscaler may not be fully configured
**Solution**:
1. Check CAST AI console for any configuration issues
2. Verify node templates are enabled
3. Check autoscaler logs: `kubectl logs -n castai-agent -l app.kubernetes.io/name=cluster-controller`

### Helm chart installation timeout

**Cause**: Slow cluster response or network issues
**Solution**: The example uses `skipAwait: true` to avoid timeouts. Helm releases will continue installing in the background.

## Differences from Terraform Provider

This Pulumi example provides the same functionality as the Terraform provider's full onboarding example with these key differences:

1. **Direct Resource Creation**: Instead of using Terraform modules, Pulumi creates IAM resources directly
2. **Type Safety**: TypeScript provides compile-time type checking
3. **Programmatic Configuration**: Use TypeScript logic to customize configurations
4. **Integrated AWS SDK**: Directly fetches EKS cluster information using AWS SDK

## Next Steps

After successful onboarding:

1. **Monitor Cost Savings**: Check CAST AI console for cost optimization insights
2. **Review Recommendations**: CAST AI will suggest additional optimizations
3. **Adjust Policies**: Fine-tune autoscaler and rebalancing settings based on your workloads
4. **Enable Additional Features**: Explore workload autoscaling, hibernation schedules, etc.

## Support

- CAST AI Documentation: https://docs.cast.ai
- CAST AI Community: https://community.cast.ai
- Pulumi Documentation: https://www.pulumi.com/docs/
- GitHub Issues: https://github.com/castai/pulumi-castai/issues
