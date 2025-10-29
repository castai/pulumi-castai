# E2E Tests - DEPRECATED

⚠️ **These tests are deprecated and should not be used.**

## Why Deprecated

The E2E tests in this directory have significant issues:

1. **Badly Implemented**: Tests are fragile, inconsistent, and hard to maintain
2. **Poor Coverage**: Don't adequately test real-world scenarios
3. **Resource Intensive**: Require actual cloud infrastructure and credentials
4. **Replaced By**: Examples in `examples/` directory serve as better functional tests

## Recommended Approach

Use the following testing approach instead:

### 1. Unit Tests
- **SDK Tests**: `sdk/*/tests/` - Mock-based tests (42 TypeScript + 33 Python + Go tests)
- **Provider Tests**: `provider/resources_test.go` - Provider mapping tests
- **Component Tests**: `components/*/tests/` - Component contract and unit tests

### 2. Examples as Functional Tests
- **Location**: `examples/typescript/`, `examples/python/`, `examples/go/`
- **Benefits**:
  - Real, working code that users can reference
  - Tests actual deployment scenarios
  - Self-documenting
  - Can be run manually or in CI

### 3. Running Examples
```bash
# TypeScript
cd examples/typescript/aws/full-onboarding && npm install && pulumi up

# Python
cd examples/python/aws/full-onboarding && pip install -r requirements.txt && pulumi up

# Go
cd examples/go/aws/full-onboarding && go mod tidy && pulumi up
```

## Migration Plan

These E2E tests should be:
1. Reviewed for any unique test scenarios
2. Converted to proper examples or unit tests as needed
3. Eventually removed from the repository

## Test Organization

See `docs/internal/TESTING.md` for current testing structure and best practices.

---

**Last Updated**: October 28, 2025
**Status**: Deprecated - Do Not Use
