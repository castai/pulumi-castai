# CAST AI Pulumi Provider - SDK Tests

This document explains the SDK test organization for the CAST AI Pulumi provider.

## Test Organization

SDK tests are **co-located** with each SDK to keep them self-contained and consistent with the provider and component test patterns.

```
pulumi-castai/
├── sdk/
│   ├── run-tests.sh          # Unified SDK test runner
│   │
│   ├── nodejs/
│   │   ├── castai/           # TypeScript SDK code
│   │   └── tests/            # TypeScript SDK tests (16 tests)
│   │       ├── *.test.ts
│   │       ├── test-utils.ts
│   │       ├── package.json
│   │       └── tsconfig.json
│   │
│   ├── python/
│   │   ├── castai/           # Python SDK code
│   │   └── tests/            # Python SDK tests (12 tests)
│   │       ├── test_*.py
│   │       ├── conftest.py
│   │       ├── pytest.ini
│   │       └── requirements.txt
│   │
│   └── go/
│       ├── castai/           # Go SDK code
│       └── tests/            # Go SDK tests (16 tests)
│           ├── *_test.go
│           ├── go.mod
│           ├── go.sum
│           └── README.md
│
├── provider/
│   └── resources_test.go     # Provider tests (co-located)
│
└── components/
    └── eks-cluster/typescript/
        └── tests/            # Component tests (co-located, 44 tests)
```

## Running SDK Tests

### All SDKs

From the project root:

```bash
# Run all SDK tests
cd sdk && ./run-tests.sh

# Run with coverage
cd sdk && ./run-tests.sh --coverage

# Run specific SDK
cd sdk && ./run-tests.sh --python-only
cd sdk && ./run-tests.sh --typescript-only
cd sdk && ./run-tests.sh --go-only
```

Or from the sdk directory:

```bash
cd sdk

# Run all SDK tests
./run-tests.sh

# Run with coverage
./run-tests.sh --coverage

# Run specific SDK
./run-tests.sh --python-only
./run-tests.sh --typescript-only
./run-tests.sh --go-only
```

### TypeScript SDK Tests

```bash
cd sdk/nodejs/tests

# Install dependencies
npm install

# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

### Python SDK Tests

```bash
cd sdk/python/tests

# Install dependencies
pip install -r requirements.txt

# Run tests
pytest -v

# Run with coverage
pytest --cov --cov-report=html

# Run in parallel
pytest -n auto
```

### Go SDK Tests

```bash
cd sdk/go/tests

# Install dependencies
go mod tidy

# Run tests
go test -v ./...

# Run with coverage
go test -v -cover -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## Test Types

All SDK tests use **Pulumi's mocking framework** to test infrastructure configurations without deploying actual resources:

- ⚡️ **Fast execution** - Tests complete in seconds
- 💰 **Zero cost** - No cloud resources created
- 🔑 **No credentials required** - Runs locally without API tokens
- ✅ **100% reliability** - No network issues or rate limits

## Test Coverage

### Current Coverage (44 SDK tests total)

#### TypeScript SDK (16 tests)
- ✅ EKS Cluster creation and management
- ✅ GKE Cluster creation and management
- ✅ AKS Cluster creation and management
- ✅ Autoscaler configuration
- ✅ Field validation and error handling

#### Python SDK (12 tests)
- ✅ EKS Cluster creation and management
- ✅ GKE Cluster creation and management
- ✅ AKS Cluster creation and management
- ✅ Autoscaler configuration

#### Go SDK (16 tests)
- ✅ EKS Cluster creation and management
- ✅ GKE Cluster creation and management
- ✅ AKS Cluster creation and management
- ✅ Autoscaler configuration
- ✅ Optional field handling

## Why Co-located Tests?

Co-locating tests with SDK code provides several benefits:

1. **Consistency**: Matches the pattern used by provider and component tests
2. **Self-contained SDKs**: Each SDK directory contains everything needed
3. **Easier maintenance**: Tests are close to the code they test
4. **Better encapsulation**: Clear boundaries between SDKs
5. **Simpler CI/CD**: Test each SDK independently

## Additional Test Directories

- `tests/` - Legacy documentation and analysis files (to be cleaned up)
- `e2e/` - End-to-end integration tests (future)
- `components/*/tests/` - Component-specific tests (co-located)

## Contributing

When adding new SDK tests:

1. Add tests in the appropriate SDK's `tests/` directory
2. Follow existing test patterns and naming conventions
3. Use Pulumi mocking to avoid real resource creation
4. Update this documentation if adding new test categories
5. Run `./run-sdk-tests.sh` to ensure all tests pass

## Documentation

- SDK-specific test documentation in each `sdk/*/tests/` directory
- Provider test documentation in `provider/` directory
- Component test documentation in `components/*/tests/` directories

---

**Last Updated:** October 27, 2025
