# CAST AI Pulumi Go Examples

This directory contains examples demonstrating how to use the CAST AI Pulumi provider with Go.

## Prerequisites

1. [Pulumi CLI](https://www.pulumi.com/docs/install/)
2. [Go 1.20+](https://golang.org/doc/install)
3. [CAST AI API Token](https://docs.cast.ai/docs/authentication)
4. Access to AWS, GCP, or Azure cloud

## Setup

1. Initialize Go modules:

```bash
go mod tidy
```

2. Set up your CAST AI API token:

```bash
export CASTAI_API_TOKEN=your-api-token
```

## Examples

### Combined Example

The `main.go` file contains examples for all three cloud providers (AWS EKS, GCP GKE, and Azure AKS) in a single program.

```bash
pulumi up
```

### Individual Cloud Examples

Individual examples for each cloud provider are available:

- `aws_example.go` - AWS EKS example
- `gcp_example.go` - GCP GKE example
- `azure_example.go` - Azure AKS example

To run a specific example, use the command-line argument:

```bash
# For AWS
go run . aws

# For GCP
go run . gcp

# For Azure
go run . azure
```

## Configuration

Before running the examples, make sure to update the configuration values in the example files:

### AWS Example
- `AccountID` - Your AWS account ID
- `Region` - AWS region where your cluster is located
- `EksClusterName` - Name of your EKS cluster
- `SecurityGroupID` - Security group ID
- `SubnetIDs` - List of subnet IDs

### GCP Example
- `ProjectID` - Your GCP project ID
- `Location` - GCP location where your cluster is located
- `ClusterName` - Name of your GKE cluster

### Azure Example
- `SubscriptionID` - Your Azure subscription ID
- `TenantID` - Your Azure tenant ID
- `ResourceGroup` - Resource group where your cluster is located
- `Location` - Azure location where your cluster is located
- `ClusterName` - Name of your AKS cluster 