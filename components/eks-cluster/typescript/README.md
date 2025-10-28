# CAST AI EKS Cluster Component for Pulumi

High-level Pulumi component for connecting an Amazon EKS cluster to CAST AI. This component provides a batteries-included approach similar to the Terraform `castai/eks-cluster` module.

## Features

- **Phase 1**: Cluster registration and monitoring agent installation
- **Phase 2**: Full cluster management with IAM setup
- **Automatic IAM Configuration**: Creates all necessary roles, policies, and instance profiles
- **EKS Access Management**: Handles both EKS access entries and aws-auth ConfigMap
- **Helm Charts**: Installs all CAST AI components (agent, controller, spot-handler, evictor, pod-pinner)
- **Batteries Included**: Works out of the box with sensible defaults

## Installation

```bash
npm install @castai/eks-cluster
```

## Quick Start

```typescript
import { CastAiEksCluster } from "@castai/eks-cluster";
import * as aws from "@pulumi/aws";

const cluster = new CastAiEksCluster("my-cluster", {
    clusterName: "my-eks-cluster",
    region: "us-east-1",
    accountId: "123456789012",
    apiToken: process.env.CASTAI_API_TOKEN!,
    subnets: ["subnet-xxx", "subnet-yyy"],
    securityGroups: ["sg-xxx"],
});

export const clusterId = cluster.clusterId;
```

## API Reference

### CastAiEksCluster

#### Required Inputs

- `clusterName` (string): Name of the EKS cluster
- `region` (string): AWS region where the cluster is located
- `accountId` (string): AWS account ID
- `apiToken` (string): CAST AI API token
- `subnets` (string[]): Subnet IDs for CAST AI provisioned nodes
- `securityGroups` (string[]): Security group IDs for CAST AI provisioned nodes

#### Optional Inputs

- `apiUrl` (string): CAST AI API URL (default: `https://api.cast.ai`)
- `vpcId` (string): VPC ID (auto-discovered if not provided)
- `deleteNodesOnDisconnect` (boolean): Remove CAST AI nodes on disconnect (default: `false`)
- `installWorkloadAutoscaler` (boolean): Install workload autoscaler (default: `true`)
- `installEgressd` (boolean): Install network cost monitor (default: `true`)
- `autoscalerEnabled` (boolean): Enable cluster autoscaler (default: `false`)
- `k8sProvider` (k8s.Provider): Custom Kubernetes provider (auto-created if not provided)
- `tags` (object): Additional tags for CAST AI provisioned nodes

#### Outputs

- `clusterId` (string): CAST AI cluster ID
- `clusterToken` (string): CAST AI cluster token
- `castaiRoleArn` (string): ARN of the CAST AI IAM role
- `instanceProfileArn` (string): ARN of the instance profile
- `nodeRoleArn` (string): ARN of the node IAM role
- `securityGroupId` (string): ID of the CAST AI security group

## Examples

### Basic Example

See [examples/typescript/aws/basic](../../../examples/typescript/aws/basic)

### Advanced Example

For fine-grained control over IAM resources and Helm charts, see [examples/typescript/aws/advanced](../../../examples/typescript/aws/advanced)

## Architecture

This component follows the two-phase onboarding approach:

**Phase 1: Registration**
1. Register cluster with CAST AI
2. Install castai-agent for read-only monitoring

**Phase 2: Full Management**
1. Create IAM roles and policies
2. Create instance profile for nodes
3. Create security group
4. Update EKS access entries and aws-auth ConfigMap
5. Install management components (controller, spot-handler, evictor, pod-pinner)

## Requirements

- Existing EKS cluster
- AWS credentials with appropriate permissions
- kubectl configured to access the cluster
- CAST AI API token

## Comparison with Terraform Module

This component is equivalent to the Terraform `castai/eks-cluster` module:

| Terraform | Pulumi Component |
|-----------|------------------|
| `castai/eks-cluster` module | `CastAiEksCluster` |
| `castai/eks-role-iam` module | `EksIamResources` (sub-component) |

## License

MIT
