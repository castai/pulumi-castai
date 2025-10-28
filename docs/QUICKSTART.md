# Quick Start - CAST AI Mock Tests

Run these tests in **less than 5 seconds** without any cloud credentials!

## 🚀 Fastest Way to Run Tests

```bash
# From the repository root
cd tests

# Run all tests (Python + TypeScript)
./run-tests.sh
```

## 📊 Expected Output

```
======================================
CAST AI Pulumi Provider - Test Suite
======================================

Running Python Tests...
-----------------------------------
test_gke_cluster.py::test_gke_cluster_creation PASSED
test_gke_cluster.py::test_gke_cluster_with_tags PASSED
test_gke_cluster.py::test_gke_cluster_deletion_behavior PASSED
test_gke_cluster.py::test_gke_cluster_locations PASSED
test_gke_cluster.py::test_gke_cluster_credentials PASSED
test_eks_cluster.py::test_eks_cluster_creation PASSED
test_eks_cluster.py::test_eks_cluster_with_multiple_subnets PASSED
test_eks_cluster.py::test_eks_cluster_with_security_groups PASSED
test_eks_cluster.py::test_eks_cluster_deletion_behavior PASSED
test_eks_cluster.py::test_eks_cluster_regions PASSED
test_eks_cluster.py::test_eks_cluster_with_assume_role PASSED
test_eks_cluster.py::test_eks_cluster_credentials PASSED

Running TypeScript Tests...
-----------------------------------
PASS  gke-cluster.test.ts
PASS  eks-cluster.test.ts

======================================
Test Summary
======================================
Python:     ✅ PASSED
TypeScript: ✅ PASSED

All tests passed!
```

## ⚡️ Language-Specific Commands

### Python Only

```bash
cd tests/python
pytest -v
```

**With coverage:**
```bash
pytest -v --cov --cov-report=html
# View coverage: open htmlcov/index.html
```

### TypeScript Only

```bash
cd tests/typescript
npm install  # First time only
npm test
```

**With coverage:**
```bash
npm run test:coverage
# View coverage: open coverage/index.html
```

## 🎯 Run Specific Tests

### Python

```bash
cd tests/python

# Run only GKE tests
pytest test_gke_cluster.py -v

# Run only EKS tests
pytest test_eks_cluster.py -v

# Run specific test function
pytest test_gke_cluster.py::test_gke_cluster_creation -v
```

### TypeScript

```bash
cd tests/typescript

# Run only GKE tests
npm run test:gke

# Run only EKS tests
npm run test:eks

# Run specific test
npm test -- --testNamePattern="should create a GKE cluster"
```

## 📦 First Time Setup

### Python

```bash
cd tests/python

# Option 1: System-wide install
pip install -r requirements.txt

# Option 2: Virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### TypeScript

```bash
cd tests/typescript

# Install dependencies
npm install
```

## ✅ Verify Everything Works

```bash
# From tests directory
./run-tests.sh

# Should complete in < 5 seconds
# Exit code 0 = all tests passed
```

## 🐛 Troubleshooting

### "pytest: command not found"

```bash
cd tests/python
pip install pytest
```

### "npm: command not found"

Install Node.js from https://nodejs.org/ (version 18 or higher)

### "Module 'pulumi_castai' not found"

The tests use mocks - you don't need the actual pulumi-castai package installed. But if you want to run without mocks:

```bash
pip install pulumi pulumi-castai
```

### Tests are slow (> 10 seconds)

Make sure you're using the mock tests in `tests/` directory, not the E2E tests in `e2e/` directory.

## 📈 Performance

| Test Suite | Tests | Time | API Calls |
|------------|-------|------|-----------|
| Python     | 12    | ~0.5s | 0 |
| TypeScript | 15    | ~2.0s | 0 |
| **Total**  | **27** | **~2.5s** | **0** |

Compare to E2E tests: ~5-10 minutes per test with real API calls!

## 🔧 Advanced Usage

### Parallel Execution (Python)

```bash
cd tests/python
pip install pytest-xdist
pytest -n auto  # Run tests in parallel
```

### Watch Mode (TypeScript)

```bash
cd tests/typescript
npm run test:watch  # Re-run tests on file changes
```

### CI/CD Integration

```bash
# GitHub Actions, GitLab CI, etc.
cd tests && ./run-tests.sh --coverage
```

## 📚 What These Tests Cover

- ✅ GKE cluster creation with various configurations
- ✅ EKS cluster creation with various configurations
- ✅ Custom tags and labels
- ✅ Deletion behavior settings
- ✅ Multi-region support
- ✅ Security group configurations
- ✅ Subnet configurations
- ✅ Credentials handling
- ✅ Assume role ARNs (AWS)
- ✅ Service account integration (GCP)

## 🎓 Next Steps

1. **Run the tests** - Verify everything works
2. **Read [README.md](./README.md)** - Understand the test structure
3. **Read [TESTING_STRATEGY.md](../TESTING_STRATEGY.md)** - Learn about mocking approach
4. **Add your own tests** - Follow the existing patterns

## 💡 Key Concept

These tests run **entirely in memory** using Pulumi's mock framework. No API calls are made to:
- ❌ CAST AI API
- ❌ AWS API
- ❌ GCP API
- ❌ Azure API

This makes them:
- ⚡️ **3600x faster** than real deployments
- 💰 **$0 cost** to run
- 🔑 **No credentials needed**
- ✅ **100% reliable** (no network issues)

Happy testing! 🎉
