# Component Tests

This directory contains tests for the CAST AI EKS Cluster component.

## Test Structure

### Contract Tests (`contract.test.ts`)
Tests that document the public API contract of the component:
- **Interface Tests**: Verify exported classes and types
- **Required Arguments**: Document mandatory inputs
- **Optional Arguments**: Document defaults and optional inputs
- **Output Properties**: Verify all exposed outputs
- **Component Behavior**: Verify component type and inheritance
- **Terraform Compatibility**: Ensure API matches Terraform module

### Unit Tests (`eksIamResources.test.ts`)
Tests for the IAM sub-component:
- **Component Creation**: Basic instantiation tests
- **Input Validation**: Required and optional inputs
- **Output Properties**: Verify exposed outputs
- **IAM Resources**: Verify resources are created
- **EKS Access**: Test access entry and ConfigMap updates
- **Terraform Compatibility**: Match Terraform eks-role-iam module

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Patterns

### Mocking Pulumi Runtime

All tests use Pulumi's mock runtime to avoid creating real resources:

```typescript
pulumi.runtime.setMocks({
    newResource: function(args) {
        return {
            id: `${args.inputs.name}-id`,
            state: args.inputs,
        };
    },
    call: function(args) {
        // Mock AWS API calls
        return {};
    },
}, "test-project", "test-stack", false);
```

### Testing Component Outputs

```typescript
const component = new CastAiEksCluster("test", {...});
expect(component.clusterId).toBeDefined();
```

### Testing Type Safety

TypeScript type checking happens at compile time, so tests verify:
1. Required fields are enforced by TypeScript
2. Optional fields have correct defaults
3. Outputs match expected types

## Contract Documentation

The tests serve as **living documentation** of the component contract:

1. **API Stability**: Tests will fail if the public API changes unexpectedly
2. **Terraform Compatibility**: Tests document mapping between Pulumi and Terraform
3. **Behavior Guarantees**: Tests document expected component behavior
4. **Breaking Changes**: Any test failure indicates a potential breaking change

## Adding New Tests

When adding new features:

1. **Add contract tests** for any new inputs or outputs
2. **Add unit tests** for new sub-components
3. **Update compatibility tests** if Terraform module changes
4. **Document defaults** for any optional inputs

## Continuous Integration

Tests should be run:
- On every commit (pre-commit hook)
- On pull requests
- Before releases

## Coverage Goals

- **Contract Tests**: 100% of public API
- **Unit Tests**: 80%+ of component logic
- **Integration Tests**: (future) E2E testing with real clusters
