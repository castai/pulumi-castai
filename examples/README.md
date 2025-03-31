# CAST AI Pulumi Provider Examples

This directory contains examples of using the CAST AI Pulumi provider in different languages:

- [Python](./python/)
- [TypeScript](./typescript/)
- [Go](./go/)

## Prerequisites

Before running these examples, you need:

1. A CAST AI account with API access
2. Pulumi CLI installed
3. Access to Kubernetes clusters in your cloud provider(s)

## Environment Setup

Set up your environment variables:

```bash
# Required: CAST AI API token
export CASTAI_API_TOKEN=your_castai_api_token

# Optional: CAST AI API URL (defaults to https://api.cast.ai)
export CASTAI_API_URL=https://api.cast.ai

# Cloud provider credentials (depending on which cloud you're using)
# For GCP:
export GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json
export GCP_PROJECT_ID=your-gcp-project-id

# For AWS:
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_REGION=your-region

# For Azure:
export ARM_CLIENT_ID=your-client-id
export ARM_CLIENT_SECRET=your-client-secret
export ARM_TENANT_ID=your-tenant-id
export ARM_SUBSCRIPTION_ID=your-subscription-id
```

## Running the Examples

### Python Examples

```bash
cd python
pip install -r requirements.txt
pulumi stack init dev
pulumi up
```

### TypeScript Examples

```bash
cd typescript
npm install
pulumi stack init dev
pulumi up
```

### Go Examples

```bash
cd go
go mod tidy
pulumi stack init dev
pulumi up
```

## Example Scenarios

The examples demonstrate these common CAST AI scenarios:

1. **Cloud Provider Integration**
   - Connect existing GKE, EKS, or AKS clusters
   - Configure credentials and permissions

2. **Autoscaling**
   - Enable unschedulable pods-based scaling
   - Configure node downscaling
   - Set up node templates

3. **Cost Optimization**
   - Configure spot instance usage
   - Set up node constraints and policies

4. **Multi-Cloud Management**
   - Manage clusters across different cloud providers
   - Apply consistent policies

## Important Notes

- You need to update the example code with your actual cluster information (cluster names, project IDs, etc.)
- Some examples create actual cloud resources that may incur costs
- Run `pulumi destroy` when you're done to clean up resources

## Troubleshooting

If you encounter issues:

1. Make sure the Pulumi plugin is installed:
   ```bash
   pulumi plugin install resource castai v$(cat ../version.txt) -f /path/to/bin/pulumi-resource-castai
   ```

2. If you see "Missing PulumiPlugin.yaml" errors, run the fix script from the repo root:
   ```bash
   ../fix_plugin.sh $(cat ../version.txt)
   ```

3. Check that your environment variables are set correctly 