# CAST AI Multi-Cloud TypeScript Example

This example demonstrates how to use CAST AI's Pulumi provider with TypeScript to manage resources across multiple cloud providers (AWS, GCP, and Azure) with a unified interface.

## Overview

This example showcases:

1. Creating cluster connections for AWS EKS, GCP GKE, and Azure AKS clusters
2. Utilizing TypeScript functions to create reusable configuration components
3. Configuring node templates for all three cloud providers
4. Setting up autoscaling for all clusters with identical configurations
5. Configuring IAM resources required for CAST AI to manage clusters

## Prerequisites

- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Node.js 14.x or later](https://nodejs.org/en/download/)
- [TypeScript 4.9 or later](https://www.typescriptlang.org/download)
- Access to AWS, GCP, and Azure accounts
- Existing EKS, GKE, and AKS clusters

## Getting Started

1. Update the cloud provider details in `index.ts` with your actual account IDs, project IDs, and cluster names.

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

4. Run the Pulumi program:
   ```bash
   pulumi up
   ```

## Code Structure

The example demonstrates how to:

- Define TypeScript functions for creating reusable components
- Work with Pulumi's Output types for resource attributes
- Create consistent configurations across different cloud providers
- Set up IAM resources specific to each cloud provider

## Resources Created

- **Cluster Connections**: Connects your EKS, GKE, and AKS clusters to CAST AI
- **Node Configurations**: Sets up node templates for all three clouds with spot and on-demand instances enabled
- **Autoscalers**: Configures identical autoscaling policies for all clouds
- **IAM Resources**:
  - AWS: IAM policies and roles
  - GCP: Service accounts
  - Azure: Service principals

## Outputs

The program exports several resource IDs that you can use for reference:
- Cluster IDs for all three cloud providers
- Node configuration IDs for all providers
- Autoscaler IDs for all providers

## Clean Up

To clean up resources created by this example:

```bash
pulumi destroy
``` 