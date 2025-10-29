# CAST AI Pulumi Provider - Testing Guide

This document explains the test organization and how to run tests for the CAST AI Pulumi provider.

## Test Organization

Tests are **co-located** with the code they test to keep them self-contained and easy to maintain.

**Important**: SDK tests and the SDK test runner are kept in `tests/` (not `sdk/`) to prevent them from being deleted during SDK regeneration (`make build_sdks` runs `rm -rf sdk/*`).

```
pulumi-castai/
├── tests/
│   ├── run-sdk-tests.sh      # SDK test runner (protected from SDK regeneration)
│   └── sdk/
│       ├── nodejs/           # TypeScript SDK tests (42 tests)
│       ├── python/           # Python SDK tests (33 tests)
│       └── go/               # Go SDK tests (48 tests)
│
├── sdk/
│   ├── nodejs/               # Generated TypeScript SDK
│   ├── python/               # Generated Python SDK
│   └── go/                   # Generated Go SDK
│
├── provider/
│   ├── run-tests.sh          # Provider test runner
│   └── resources_test.go     # Provider tests
│
└── components/
    ├── run-tests.sh          # Component test runner
    └── eks-cluster/typescript/tests/  # Component tests (44 tests)
```

## Running Tests

### All Tests

To run all tests across the project:

```bash
# From project root
make test-all      # (if Makefile target exists)

# Or run each test bucket separately:
cd tests && ./run-sdk-tests.sh
cd provider && ./run-tests.sh
cd components && ./run-tests.sh
```

### SDK Tests

Test all three SDK implementations (TypeScript, Python, Go):

```bash
cd tests

# Run all SDK tests
./run-sdk-tests.sh

# Run with coverage
./run-sdk-tests.sh --coverage

# Run specific SDK
./run-sdk-tests.sh --python-only
./run-sdk-tests.sh --typescript-only
./run-sdk-tests.sh --go-only
```

**Individual SDK tests:**

```bash
# TypeScript
cd tests/sdk/nodejs && npm test

# Python
cd tests/sdk/python && pytest -v

# Go
cd tests/sdk/go && go test -v ./...
```

### Provider Tests

Test the Pulumi provider implementation:

```bash
cd provider

# Run provider tests
./run-tests.sh

# Run with coverage
./run-tests.sh --coverage

# Run in verbose mode
./run-tests.sh --verbose
```

**Direct Go test:**

```bash
cd provider && go test -v ./...
```

### Component Tests

Test all Pulumi components:

```bash
cd components

# Run all component tests
./run-tests.sh

# Run with coverage
./run-tests.sh --coverage

# Run specific component
./run-tests.sh --component eks-cluster/typescript

# List available components
./run-tests.sh --help
```

**Individual component tests:**

```bash
cd components/eks-cluster/typescript && npm test
```

## Test Types

### 1. SDK Tests (Mock-based)

- **Location**: `tests/sdk/*/` (protected from SDK regeneration)
- **Type**: Unit tests with Pulumi mocking
- **Purpose**: Test SDK resource creation without real API calls
- **Speed**: < 2 seconds per SDK
- **Coverage**: 42 TypeScript + 33 Python + Go tests

**Characteristics:**
- Use Pulumi's mock runtime
- No cloud credentials required
- No actual resources created
- Fast and reliable
- **Protected**: Located outside `sdk/` to survive `make build_sdks`

### 2. Provider Tests

- **Location**: `provider/resources_test.go`
- **Type**: Go unit tests
- **Purpose**: Test provider bridge and resource mapping
- **Speed**: < 1 second

### 3. Component Tests (Contract + Unit)

- **Location**: `components/*/tests/`
- **Type**: Contract tests + unit tests
- **Purpose**: Document public API and test component logic
- **Coverage**: 44 tests for EKS cluster component (98.68% coverage)

**Test types:**
- **Contract tests**: Document the public API and prevent breaking changes
- **Unit tests**: Test internal component logic
- **Mocked**: Use Pulumi mocks, no real resources

## Test Scripts

Each test bucket has its own test runner script:

| Script | Purpose | Languages |
|--------|---------|-----------|
| `sdk/run-tests.sh` | Run all SDK tests | TypeScript, Python, Go |
| `provider/run-tests.sh` | Run provider tests | Go |
| `components/run-tests.sh` | Run all component tests | TypeScript (extensible) |

All scripts support:
- `--help`: Show usage information
- `--coverage`: Generate coverage reports
- Colored output with clear summaries

## Coverage Reports

### SDK Coverage

```bash
cd sdk
./run-tests.sh --coverage

# View reports:
# - TypeScript: tests/sdk/nodejs/coverage/index.html
# - Python: tests/sdk/python/htmlcov/index.html
# - Go: tests/sdk/go/coverage.html
```

### Provider Coverage

```bash
cd provider
./run-tests.sh --coverage

# View report: provider/coverage.html
```

### Component Coverage

```bash
cd components
./run-tests.sh --coverage

# View report: components/*/coverage/index.html
```

## Continuous Integration

Tests should be run:
- On every commit (pre-commit hook recommended)
- On pull requests
- Before releases

**Recommended CI workflow:**

```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3

    # SDK tests
    - name: Test SDKs
      run: cd sdk && ./run-tests.sh

    # Provider tests
    - name: Test Provider
      run: cd provider && ./run-tests.sh

    # Component tests
    - name: Test Components
      run: cd components && ./run-tests.sh
```

## Test Patterns

### Mocking Pulumi Runtime

All tests use Pulumi's built-in mocking to avoid creating real resources:

**TypeScript:**
```typescript
pulumi.runtime.setMocks({
    newResource: (args) => ({
        id: `${args.name}-id`,
        state: { ...args.inputs }
    }),
    call: (args) => ({})
});
```

**Python:**
```python
class MyMocks(pulumi.runtime.Mocks):
    def new_resource(self, args):
        return [f"{args.name}_id", dict(args.inputs)]
    def call(self, args):
        return {}

pulumi.runtime.set_mocks(MyMocks())
```

**Go:**
```go
mocks := &testMocks{}
err := pulumi.RunErr(func(ctx *pulumi.Context) error {
    // test code
}, pulumi.WithMocks("project", "stack", mocks))
```

## Adding New Tests

### Adding SDK Tests

1. Create test file in `tests/sdk/{language}/` directory
2. Follow existing test patterns
3. Use Pulumi mocks
4. Run `cd sdk && ./run-tests.sh` to verify
5. **Important**: Tests are in `tests/sdk/` to survive SDK regeneration

### Adding Provider Tests

1. Add tests to `provider/*_test.go`
2. Follow Go testing conventions
3. Run `./run-tests.sh` to verify

### Adding Component Tests

1. Create `tests/` directory in component
2. Add test files following conventions:
   - TypeScript: `*.test.ts`
   - Python: `test_*.py`
   - Go: `*_test.go`
3. Add contract tests for public API
4. Add unit tests for internal logic
5. Run `../run-tests.sh` to verify

## Troubleshooting

### Tests not discovering

```bash
# Check test file naming
# - TypeScript: *.test.ts
# - Python: test_*.py
# - Go: *_test.go

# List tests without running
jest --listTests              # TypeScript
pytest --collect-only         # Python
go test -list .               # Go
```

### Dependency issues

```bash
# SDK tests
cd tests/sdk/nodejs && rm -rf node_modules && npm install
cd tests/sdk/python && pip install -r requirements.txt
cd tests/sdk/go && go mod tidy

# Component tests
cd components/eks-cluster/typescript && rm -rf node_modules && npm install
```

### Mock failures

Ensure mocks return appropriate data structures matching the actual resource outputs.

## Performance

| Test Suite | Tests | Time | Cost |
|------------|-------|------|------|
| **SDK Tests** | 75+ | ~2s | $0 |
| **Provider Tests** | - | < 1s | $0 |
| **Component Tests** | 44 | ~5s | $0 |
| **Total** | 119+ | ~8s | $0 |

All tests run entirely in-memory without making any API calls.

## Best Practices

1. **Run tests before committing**
   ```bash
   # Quick check
   cd sdk && ./run-tests.sh
   cd provider && ./run-tests.sh
   cd components && ./run-tests.sh
   ```

2. **Use specific test runners** for faster iteration
   ```bash
   cd sdk && ./run-tests.sh --typescript-only
   ```

3. **Generate coverage** for new features
   ```bash
   ./run-tests.sh --coverage
   ```

4. **Test one thing per test** - makes failures easier to diagnose

5. **Keep tests fast** - each test should complete in milliseconds

## Additional Resources

- [Pulumi Testing Guide](https://www.pulumi.com/docs/iac/concepts/testing/)
- [Component Tests README](../../components/eks-cluster/typescript/tests/README.md)

---

**Last Updated:** October 28, 2025
**Change Log:**
- October 28, 2025: Moved SDK test runner from `sdk/run-tests.sh` to `tests/run-sdk-tests.sh` to protect from SDK regeneration
- October 28, 2025: Moved SDK tests to `tests/sdk/` to protect from SDK regeneration
