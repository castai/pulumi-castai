# CAST AI Pulumi Provider - Test Suite

This directory contains mock-based unit tests for the CAST AI Pulumi provider. These tests run **entirely in-memory** without making any API calls to CAST AI or cloud providers.

## Overview

We use Pulumi's built-in mocking framework to test infrastructure configurations without deploying actual resources. This approach provides:

- ⚡️ **Fast execution** - Tests complete in seconds, not minutes
- 💰 **Zero cost** - No cloud resources created
- 🔑 **No credentials required** - Runs locally without API tokens
- ✅ **100% reliability** - No network issues or rate limits

## Directory Structure

```
tests/
├── python/                     # Python tests
│   ├── conftest.py            # Shared pytest fixtures and mocks
│   ├── pytest.ini             # Pytest configuration
│   ├── requirements.txt       # Test dependencies
│   ├── test_gke_cluster.py   # GKE cluster tests (5 tests)
│   └── test_eks_cluster.py   # EKS cluster tests (7 tests)
│
├── typescript/                 # TypeScript tests
│   ├── package.json           # npm dependencies and scripts
│   ├── tsconfig.json          # TypeScript configuration
│   ├── test-utils.ts          # Pulumi Output helpers
│   ├── gke-cluster.test.ts   # GKE cluster tests (7 tests)
│   └── eks-cluster.test.ts   # EKS cluster tests (9 tests)
│
├── go/                         # Go tests
│   ├── go.mod                 # Go module dependencies
│   ├── go.sum                 # Dependency checksums
│   ├── eks_cluster_test.go   # EKS cluster tests (9 tests)
│   ├── gke_cluster_test.go   # GKE cluster tests (7 tests)
│   └── README.md              # Go-specific testing guide
│
├── run-tests.sh                # Unified test runner (all languages)
└── README.md                   # This file
```

## Quick Start

### Run All Tests (All Languages)

```bash
# From the tests directory
./run-tests.sh
```

### Python Tests

```bash
# Navigate to Python tests directory
cd tests/python

# Install dependencies
pip install -r requirements.txt

# Run all tests
pytest -v

# Run specific test file
pytest test_gke_cluster.py -v

# Run with coverage
pytest --cov --cov-report=html

# Run tests in parallel (faster)
pytest -n auto
```

### TypeScript Tests

```bash
# Navigate to TypeScript tests directory
cd tests/typescript

# Install dependencies
npm install

# Run all tests
npm test

# Run specific test file
npm run test:gke

# Run with coverage
npm run test:coverage

# Run in watch mode (for development)
npm run test:watch
```

### Go Tests

```bash
# Navigate to Go tests directory
cd tests/go

# Install dependencies (if needed)
go mod tidy

# Run all tests
go test -v ./...

# Run specific test
go test -v -run TestEksClusterCreation

# Run with coverage
go test -v -cover ./...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## Test Coverage

### Current Coverage

#### Python Tests
- ✅ **GKE Cluster** (`test_gke_cluster.py`)
  - Basic cluster creation
  - Custom tags
  - Deletion behavior
  - Multiple locations
  - Credentials handling

- ✅ **EKS Cluster** (`test_eks_cluster.py`)
  - Basic cluster creation
  - Multiple subnets
  - Security groups
  - Deletion behavior
  - Multiple regions
  - Assume role ARN
  - Credentials handling

#### TypeScript Tests
- ✅ **GKE Cluster** (`gke-cluster.test.ts`)
  - Basic cluster creation
  - SSH key support
  - Deletion behavior
  - Multiple locations
  - Credentials handling
  - Field validation

- ✅ **EKS Cluster** (`eks-cluster.test.ts`)
  - Basic cluster creation
  - Multiple subnets
  - Security groups
  - Deletion behavior
  - Multiple regions
  - Assume role ARN
  - Credentials handling
  - Field validation

#### Go Tests
- ✅ **GKE Cluster** (`gke_cluster_test.go`)
  - Basic cluster creation
  - SSH key support
  - Deletion behavior
  - Multiple locations
  - Credentials handling
  - Field validation
  - Optional fields

- ✅ **EKS Cluster** (`eks_cluster_test.go`)
  - Basic cluster creation
  - Multiple subnets
  - Security groups
  - Deletion behavior
  - Multiple regions
  - Assume role ARN
  - Credentials handling
  - Field validation
  - Different account IDs

### Test Statistics

- **Total Tests**: 44 (12 Python + 16 TypeScript + 16 Go)
- **Execution Time**: ~1.5 seconds
- **All tests passing**: ✅

### Planned Coverage

- [ ] AKS Cluster tests
- [ ] Autoscaler tests
- [ ] Node Configuration tests
- [ ] Node Template tests
- [ ] Workload Scaling Policy tests
- [ ] Data source tests

## How Mocking Works

### Python Example

```python
import pulumi

class MyMocks(pulumi.runtime.Mocks):
    def new_resource(self, args):
        """Mock resource creation"""
        outputs = dict(args.inputs)
        outputs["id"] = f"{args.name}_id"
        outputs["clusterId"] = "mock-cluster-123"
        return [args.name + "_id", outputs]

    def call(self, args):
        """Mock data source calls"""
        return {}

pulumi.runtime.set_mocks(MyMocks())
```

### TypeScript Example

```typescript
import * as pulumi from "@pulumi/pulumi";

class MyMocks implements pulumi.runtime.Mocks {
    newResource(args: pulumi.runtime.MockResourceArgs) {
        return {
            id: `${args.name}-id`,
            state: {
                ...args.inputs,
                clusterId: "mock-cluster-123",
            },
        };
    }

    call(args: pulumi.runtime.MockCallArgs) {
        return {};
    }
}

pulumi.runtime.setMocks(new MyMocks());
```

## Writing New Tests

### Python Test Template

```python
import pulumi

@pulumi.runtime.test
def test_my_resource():
    """Test description"""
    import pulumi_castai as castai

    # Create resource
    resource = castai.MyResource("test", ...)

    # Verify outputs
    def check_outputs(outputs):
        value = outputs[0]
        assert value is not None
        assert value == expected

    return resource.property.apply(lambda v: check_outputs([v]))
```

### TypeScript Test Template

```typescript
describe("My Resource", () => {
    it("should create resource with correct config", async () => {
        const resource = new castai.MyResource("test", {
            // properties
        });

        const value = await resource.property.promise();
        expect(value).toBeDefined();
        expect(value).toBe(expected);
    });
});
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Run Tests

on: [push, pull_request]

jobs:
  test-python:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd tests/python && pip install -r requirements.txt
      - run: cd tests/python && pytest -v --cov

  test-typescript:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd tests/typescript && npm install
      - run: cd tests/typescript && npm test
```

## Performance Comparison

| Test Type | Time | Cost | Requirements |
|-----------|------|------|--------------|
| **Mock Tests** | < 1 second | $0 | None |
| **E2E Tests** | 5-10 minutes | Cloud costs | API tokens, credentials |

### Example: Running 10 Tests

- **With Mocking:** ~1 second total
- **Without Mocking:** ~60 minutes total
- **Speedup:** 3600x faster

## Best Practices

1. **Test behavior, not implementation**
   - Focus on what outputs the resource produces
   - Don't test internal details of the Terraform provider

2. **Use consistent mock data**
   - Mock IDs should be deterministic
   - Use fixtures for common test data

3. **Test edge cases**
   - Empty values
   - Null/undefined handling
   - Multiple instances of the same resource

4. **Keep tests fast**
   - Each test should complete in milliseconds
   - Avoid unnecessary complexity

5. **Test one thing per test**
   - Each test should verify a specific behavior
   - Makes failures easier to diagnose

## Troubleshooting

### Python: Module not found

```bash
# Make sure you're in the tests/python directory
cd tests/python

# Install dependencies
pip install -r requirements.txt

# If using virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### TypeScript: Cannot find module

```bash
# Make sure you're in the tests/typescript directory
cd tests/typescript

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Tests not discovering

**Python:**
```bash
# pytest looks for test_*.py files by default
# Make sure your test files start with "test_"
ls test_*.py

# Run with discovery debugging
pytest --collect-only
```

**TypeScript:**
```bash
# jest looks for *.test.ts files
# Check your jest configuration in package.json
npm test -- --listTests
```

## Additional Resources

- [Pulumi Testing Guide](https://www.pulumi.com/docs/iac/concepts/testing/)
- [Pulumi Unit Testing Blog](https://www.pulumi.com/blog/unit-test-infrastructure/)
- [CAST AI Provider Documentation](../README.md)
- [Testing Strategy](../TESTING_STRATEGY.md)

## Contributing

When adding new tests:

1. Follow the existing test structure
2. Use the shared mock fixtures (Python: `conftest.py`)
3. Add test markers for categorization (Python: `@pytest.mark.gke`)
4. Update this README with new test coverage
5. Ensure tests pass before submitting PR

```bash
# Python: Run all tests
cd tests/python && pytest -v

# TypeScript: Run all tests
cd tests/typescript && npm test
```

---

**Last Updated:** October 24, 2025
**Test Framework Versions:**
- Python: pytest 7.4.0+
- TypeScript: jest 29.5.0+
