# CAST AI GCP Examples

This directory contains examples demonstrating how to connect Google Cloud Platform (GCP) GKE clusters to CAST AI using Pulumi. These examples have been updated to create service accounts with the necessary permissions instead of relying on external credentials.

## What's New

The examples now:
- **Create GCP service accounts** automatically with the required permissions for CAST AI
- **Generate service account keys** programmatically 
- **Use the generated credentials** instead of requiring external `GOOGLE_CREDENTIALS`
- **Assign minimal required roles** for CAST AI to function properly

## Required Environment Variables

- `CASTAI_API_TOKEN`: Your CAST AI API token (required)
- `GCP_PROJECT_ID`: Your GCP project ID (required)

## Optional Environment Variables

- `GKE_CLUSTER_NAME`: Name of your GKE cluster (default: varies by example)
- `GKE_LOCATION`: GCP region where your cluster is located (default: us-central1)
- `CASTAI_API_URL`: Custom CAST AI API URL (default: https://api.cast.ai)

## Service Account Permissions

The examples create a service account with these roles:
- `roles/container.clusterAdmin` - Full access to GKE clusters
- `roles/compute.instanceAdmin.v1` - Manage compute instances
- `roles/iam.serviceAccountUser` - Use service accounts

## Examples

### Go Examples

1. **`examples/go/gcp/main.go`** - Basic GKE cluster connection with service account creation
2. **`examples/go/gcp_example.go`** - Comprehensive example with autoscaler configuration
3. **`examples/go/simple_gcp.go`** - Simple import test showing new service account approach

### Python Example

**`examples/python/gcp_example.py`** - Python implementation with service account creation

### TypeScript Example

**`examples/typescript/gcp/index.ts`** - Full-featured TypeScript example with:
- Service account creation
- GKE cluster connection
- Helm chart installations for CAST AI components

## Running the Examples

1. Set the required environment variables:
   ```bash
   export CASTAI_API_TOKEN="your-cast-ai-token"
   export GCP_PROJECT_ID="your-gcp-project-id"
   ```

2. Ensure you have the necessary Pulumi providers installed:
   - `@pulumi/gcp` (for TypeScript)
   - `pulumi-gcp` (for Python)
   - `github.com/pulumi/pulumi-gcp/sdk/v7/go/gcp` (for Go)

3. Run the example using Pulumi:
   ```bash
   pulumi up
   ```

## Security Considerations

- Service account keys are sensitive and should be handled securely
- The examples create keys programmatically for demonstration purposes
- In production, consider using Workload Identity or other keyless authentication methods
- The service account is granted broad permissions for simplicity; consider using more restrictive roles in production

## Benefits of This Approach

1. **Self-contained**: No need to manually create service accounts or manage credentials
2. **Reproducible**: Examples work consistently across different environments
3. **Secure**: Credentials are generated and managed within the Pulumi program
4. **Minimal setup**: Only requires CAST AI token and GCP project ID
5. **Clear permissions**: Explicitly shows what permissions CAST AI needs

## Migration from Previous Examples

If you were using the previous examples that required `GOOGLE_CREDENTIALS`:

1. Remove the `GOOGLE_CREDENTIALS` environment variable requirement
2. Ensure you have the GCP Pulumi provider installed
3. The examples will now create the necessary service account automatically

## Troubleshooting

- Ensure your GCP project has the necessary APIs enabled (Container API, Compute API, IAM API)
- Verify that your user account has permissions to create service accounts and assign IAM roles
- Check that the GKE cluster exists in the specified project and location
