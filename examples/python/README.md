# CAST AI Pulumi Python Examples

This directory contains examples demonstrating how to use the CAST AI Pulumi provider with Python.

## Prerequisites

1. [Pulumi CLI](https://www.pulumi.com/docs/install/)
2. [Python 3.7+](https://www.python.org/downloads/)
3. [CAST AI API Token](https://docs.cast.ai/docs/authentication)
4. Access to AWS, GCP, or Azure cloud

## Setup

1. Install dependencies:

```bash
pip install -r requirements.txt
```

2. Set up your CAST AI API token:

```bash
export CASTAI_API_TOKEN=your-api-token
```

## Pydantic Models

These examples use Pydantic for strong typing and validation. The `models.py` file contains Pydantic models for all CAST AI resources supported by the provider. Using these models offers several benefits:

- Type checking and IDE completion
- Data validation before resource creation
- Cleaner code organization
- Better documentation through Python type hints

Example usage:

```python
from models import EksClusterConfig

# Create a typed configuration
config = EksClusterConfig(
    account_id="123456789012",
    region="us-west-2",
    eks_cluster_name="my-cluster",
    delete_nodes_on_disconnect=True
)

# Convert to keyword arguments for Pulumi resource
args = config.dict(exclude_none=True)
cluster = castai.EksCluster("my-cluster", **args)
```

## Examples

### Basic Example

The `__main__.py` file contains a basic example that connects an AWS EKS cluster to CAST AI and sets up autoscaling.

```bash
pulumi up
```

### Cloud-specific Examples

There are also cloud-specific examples:

- `aws_example.py` - AWS EKS example
- `gcp_example.py` - GCP GKE example
- `azure_example.py` - Azure AKS example

To run a specific example:

```bash
# For AWS
pulumi up -C aws_example.py

# For GCP
pulumi up -C gcp_example.py

# For Azure
pulumi up -C azure_example.py
```

## Configuration

Before running the examples, make sure to update the configuration values in the example files:

### AWS Example
- `account_id` - Your AWS account ID
- `region` - AWS region where your cluster is located
- `eks_cluster_name` - Name of your EKS cluster
- `security_group_id` - Security group ID
- `subnet_ids` - List of subnet IDs

### GCP Example
- `project_id` - Your GCP project ID
- `location` - GCP location where your cluster is located
- `cluster_name` - Name of your GKE cluster

### Azure Example
- `subscription_id` - Your Azure subscription ID
- `tenant_id` - Your Azure tenant ID
- `resource_group` - Resource group where your cluster is located
- `location` - Azure location where your cluster is located
- `cluster_name` - Name of your AKS cluster