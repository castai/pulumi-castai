# Multi-Cloud Example

This example demonstrates how to use the CAST AI Pulumi provider across multiple cloud providers. 

## Setup


This will handle module initialization and dependency resolution for all examples, including the multi-cloud directory.

## Fixing Module Issues Manually

If the import errors persist, you can run these commands manually:

```bash
# Navigate to the multi-cloud directory
cd examples/go/multi-cloud

# Update the go.mod file
go mod tidy

# If needed, explicitly add required modules
go get github.com/cast-ai/pulumi-castai/sdk/go/castai/autoscaling
go get github.com/cast-ai/pulumi-castai/sdk/go/castai/aws
go get github.com/cast-ai/pulumi-castai/sdk/go/castai/gcp
go get github.com/cast-ai/pulumi-castai/sdk/go/castai/iam
go get github.com/cast-ai/pulumi-castai/sdk/go/castai/nodeconfig
go get github.com/pulumi/pulumi/sdk/v3/go/pulumi
```

## Running the Example

To run the example:

```bash
cd examples/go/multi-cloud
pulumi up
```

## Overview

This example showcases:

1. Creating cluster connections for both AWS EKS and GCP GKE clusters
2. Setting up cross-cloud cluster connections using the generic `clusters` package
3. Configuring node templates for both cloud providers
4. Setting up autoscaling for both clusters with identical configurations
5. Configuring IAM resources required for CAST AI to manage clusters (AWS IAM policies/roles and GCP service accounts)

## Prerequisites

- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Go 1.20 or later](https://golang.org/doc/install)
- Access to AWS and GCP accounts
- Existing EKS and GKE clusters

## Getting Started

1. Update the cloud provider details in `main.go` with your actual account IDs, project IDs, and cluster names.

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Run the Pulumi program:
   ```bash
   pulumi up
   ```

## Resources Created

- **Cluster Connections**: Connects your EKS and GKE clusters to CAST AI
- **Node Configurations**: Sets up node templates for both clouds with spot and on-demand instances enabled
- **Autoscalers**: Configures identical autoscaling policies for both clouds
- **IAM Resources**: Creates the necessary IAM resources for CAST AI to access and manage your clusters

## Outputs

The program exports several resource IDs that you can use for reference:
- EKS and GKE cluster IDs
- Node configuration IDs for both clouds
- Autoscaler IDs for both clouds

## Clean Up

To clean up resources created by this example:

```bash
pulumi destroy
``` 