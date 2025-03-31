# CAST AI Pulumi TypeScript Examples

This directory contains examples demonstrating how to use the CAST AI Pulumi provider with TypeScript.

## Prerequisites

1. [Pulumi CLI](https://www.pulumi.com/docs/install/)
2. [Node.js 14+](https://nodejs.org/en/download/)
3. [CAST AI API Token](https://docs.cast.ai/docs/authentication)
4. Access to AWS, GCP, or Azure cloud

## Setup

1. Install dependencies:

```bash
npm install
```

2. Set up your CAST AI API token:

```bash
export CASTAI_API_TOKEN=your-api-token
```

## Examples

### Basic Example

The `index.ts` file contains a basic example that connects an AWS EKS cluster to CAST AI and sets up autoscaling.

```bash
pulumi up
```

### Cloud-specific Examples

There are also cloud-specific examples:

- `aws-example.ts` - AWS EKS example with IAM setup
- `gke-example.ts` - GCP GKE example
- `aks-example.ts` - Azure AKS example

To run a specific example, modify the Pulumi.yaml file to point to the specific example file:

```yaml
# In Pulumi.yaml
main: aws-example.ts
```

### Advanced Examples

We also provide advanced examples:

- `cross-cloud-iam-example.ts` - Configure IAM across multiple clouds
- `commitments-example.ts` - Manage committed use discounts
- `organization-example.ts` - Work with CAST AI organizations
- `workload-scaling-policy-example.ts` - Set up workload scaling policies

## Configuration

Before running the examples, make sure to update the configuration values in the example files:

### AWS Example
- `accountId` - Your AWS account ID
- `region` - AWS region where your cluster is located
- `eksClusterName` - Name of your EKS cluster
- `securityGroupId` - Security group ID
- `subnetIds` - List of subnet IDs

### GCP Example
- `projectId` - Your GCP project ID
- `location` - GCP location where your cluster is located
- `clusterName` - Name of your GKE cluster

### Azure Example
- `subscriptionId` - Your Azure subscription ID
- `tenantId` - Your Azure tenant ID
- `resourceGroup` - Resource group where your cluster is located
- `location` - Azure location where your cluster is located
- `clusterName` - Name of your AKS cluster 