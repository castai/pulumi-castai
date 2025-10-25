# Go Tests for CAST AI Pulumi Provider

This directory contains Go unit tests for the CAST AI Pulumi provider. Tests use Pulumi's built-in mocking framework to test resource creation without making actual API calls.

## Prerequisites

- Go 1.21 or higher
- The CAST AI Pulumi Go SDK (automatically linked via `replace` directive)

## Running Tests

### Run all tests
```bash
go test -v ./...
```

### Run specific test file
```bash
go test -v -run TestEksClusterCreation
go test -v -run TestGkeClusterCreation
```

### Run with coverage
```bash
go test -v -cover ./...
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## Test Structure

### EKS Cluster Tests (`eks_cluster_test.go`)
- `TestEksClusterCreation` - Basic EKS cluster creation
- `TestEksClusterMultipleSubnets` - Multiple subnet configuration
- `TestEksClusterMultipleSecurityGroups` - Multiple security group handling
- `TestEksClusterDeleteNodesOnDisconnect` - Delete behavior settings
- `TestEksClusterMultipleRegions` - Multi-region support
- `TestEksClusterAssumeRoleArn` - IAM assume role configuration
- `TestEksClusterCredentials` - Credentials handling
- `TestEksClusterValidation` - Required field validation
- `TestEksClusterDifferentAccountIds` - Multiple AWS accounts

### GKE Cluster Tests (`gke_cluster_test.go`)
- `TestGkeClusterCreation` - Basic GKE cluster creation
- `TestGkeClusterWithSSHKey` - SSH key configuration
- `TestGkeClusterDeleteNodesOnDisconnect` - Delete behavior settings
- `TestGkeClusterMultipleLocations` - Multi-location support
- `TestGkeClusterCredentials` - Credentials handling
- `TestGkeClusterValidation` - Required field validation
- `TestGkeClusterOptionalSSHKey` - Optional SSH key handling

## Mock Implementation

The tests use `CastAIMocks` and `GcpMocks` types that implement `pulumi.MockResourceMonitor`:

```go
type CastAIMocks struct {
    pulumi.MockResourceMonitor
}

func (m *CastAIMocks) NewResource(args pulumi.MockResourceArgs) (string, resource.PropertyMap, error) {
    // Mock resource creation
}

func (m *CastAIMocks) Call(args pulumi.MockCallArgs) (resource.PropertyMap, error) {
    // Mock data source calls
}
```

The mocks return deterministic IDs based on hash functions, ensuring consistent test behavior.

## Key Patterns

### Testing Pulumi Outputs

Pulumi Outputs in Go are async. Use `ApplyT` with `sync.WaitGroup` to test them:

```go
var wg sync.WaitGroup
wg.Add(1)

cluster.Name.ApplyT(func(name string) error {
    assert.Equal(t, "my-cluster", name)
    wg.Done()
    return nil
})

wg.Wait()
```

### Testing Multiple Outputs

Use `pulumi.All` to test multiple outputs together:

```go
pulumi.All(cluster.ID(), cluster.Name, cluster.Region).
    ApplyT(func(all []interface{}) error {
        clusterId := all[0].(pulumi.ID)
        clusterName := all[1].(string)
        region := all[2].(string)

        // Assertions...
        return nil
    })
```

### Subtests for Parameterized Tests

Use Go subtests for testing multiple values:

```go
regions := []string{"us-east-1", "us-west-2", "eu-west-1"}

for _, region := range regions {
    region := region // Capture range variable
    t.Run(region, func(t *testing.T) {
        // Test with this region...
    })
}
```

## Important Notes

### EKS vs GKE API Differences

- **EKS** uses `AgentToken` (deprecated but current API)
- **GKE** uses `ClusterToken`
- **EKS** supports `Tags`, **GKE** does not
- **GKE** supports `SshPublicKey`, **EKS** also supports it

### Optional vs Required Fields

Go uses pointers for optional fields:
- Required: `pulumi.StringOutput`
- Optional: `pulumi.StringPtrOutput`

When testing optional fields, check for nil:
```go
cluster.SshPublicKey.ApplyT(func(sshKey *string) error {
    if sshKey != nil {
        assert.NotEmpty(t, *sshKey)
    }
    return nil
})
```

## Dependencies

The tests depend on:
- `github.com/pulumi/pulumi/sdk/v3` - Pulumi Go SDK
- `github.com/stretchr/testify` - Assertion library
- Local CAST AI SDK via `replace` directive

## Performance

All tests run in-memory with mocking:
- No real API calls
- No credentials needed
- Fast execution (~1-2 seconds for all tests)
- Suitable for CI/CD pipelines

## Troubleshooting

### Import errors
If you see import errors, ensure the CAST AI SDK is built:
```bash
cd ../../sdk/go/castai
go build
```

### Module resolution issues
Run `go mod tidy` to resolve dependencies:
```bash
go mod tidy
```

### Test timeout
If tests hang, check for missing `wg.Done()` calls in `ApplyT` callbacks.
