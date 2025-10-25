# Test Coverage Analysis

Last Updated: 2025-01-24

## Current Test Statistics

- **Total Tests**: 120 passing
  - Python: 32 tests ✅
  - TypeScript: 41 tests ✅
  - Go: 47 tests ✅

## Resources Coverage

### ✅ FULLY TESTED (3/15 = 20%)

**Note**: All cluster resources are for **connecting existing clusters** to CAST AI. The provider does NOT create new clusters.

| Resource | Python | TypeScript | Go | Total Tests | Notes |
|----------|--------|------------|-----|-------------|-------|
| `castai_eks_cluster` | ✅ 13 tests | ✅ 17 tests | ✅ 17 tests | 47 tests | Comprehensive coverage |
| `castai_gke_cluster` | ✅ 12 tests | ✅ 16 tests | ✅ 16 tests | 44 tests | Comprehensive coverage |
| `castai_aks_cluster` | ✅ 7 tests | ✅ 8 tests | ✅ 8 tests | 23 tests | Good baseline coverage |

### ❌ NOT TESTED (11/15 = 73%)

#### HIGH PRIORITY (Should test before E2E)

| Resource | Reason | Use Case |
|----------|--------|----------|
| `castai_autoscaler` | **Core feature** - manages cluster autoscaling | Essential for cost optimization |
| `castai_node_configuration` | **Core feature** - configures node templates | Required for custom node setups |
| `castai_node_configuration_default` | Companion to node_configuration | Sets default node config |

#### MEDIUM PRIORITY (Can test alongside E2E)

| Resource | Reason | Use Case |
|----------|--------|----------|
| `castai_workload_scaling_policy` | Recently added feature | Workload-specific scaling |
| `castai_credentials` | Manages cloud credentials | Alternative to inline credentials |
| `castai_evictor_advanced_config` | Advanced autoscaling | Fine-tuning evictor behavior |
| `castai_node_template` | Node templating | Advanced node management |

#### LOW PRIORITY (Can wait)

| Resource | Reason |
|----------|--------|
| `castai_cluster` | Generic cluster resource (less common) |
| `castai_cluster_token` | Token management (administrative) |
| `castai_eks_clusterid` | Cluster ID registration (edge case) |
| `castai_gke_cluster_id` | Cluster ID registration (edge case) |
| `castai_workload_scaling_policy_order` | Policy ordering (advanced) |

## Data Sources Coverage

### ❌ NOT TESTED (8/8 = 100%)

All data sources are currently untested. These are lower priority as they're read-only operations.

| Data Source | Priority | Notes |
|-------------|----------|-------|
| `castai_eks_settings` | Medium | Used in EKS onboarding |
| `castai_gke_user_policies` | Medium | Used in GKE onboarding |
| `castai_eks_user_arn` | Low | Deprecated |
| `castai_organization` | Low | Administrative |
| `castai_rebalancing_schedule` | Low | Advanced feature |
| `castai_hibernation_schedule` | Low | Advanced feature |
| `castai_workload_scaling_policy_order` | Low | Policy management |

## Recommendations Before E2E Tests

### Phase 1: Core Feature Tests (Est. 4-6 hours)
**Priority: HIGH** - Test the most commonly used resources

1. **Autoscaler Resource** (~2 hours)
   - Python, TypeScript, Go tests
   - Test scenarios:
     - Basic autoscaler setup
     - Spot instances configuration
     - Node constraints
     - Scaling policies
     - Enable/disable behavior
   - **This is critical** - autoscaling is CAST AI's core value proposition

2. **Node Configuration Resource** (~2 hours)
   - Python, TypeScript, Go tests
   - Test scenarios:
     - Default node configuration
     - Custom node configuration
     - Multiple configurations per cluster
     - Node template references
     - Cloud-specific settings (EKS, GKE, AKS)

3. **Workload Scaling Policy** (~1-2 hours)
   - Python, TypeScript, Go tests
   - Test scenarios:
     - CPU-based scaling
     - Memory-based scaling
     - Custom metrics
     - Policy application to workloads

### Phase 2: Supporting Resources (Est. 2-3 hours)
**Priority: MEDIUM** - Can be done alongside E2E tests

1. **Credentials Resource**
   - Managing AWS, GCP, Azure credentials separately
   - Credential reuse across clusters

2. **Evictor Advanced Config**
   - Advanced evictor settings
   - Pod disruption budgets
   - Node affinity rules

### Phase 3: Data Sources (Est. 2-3 hours)
**Priority: LOW** - Can wait until after E2E

1. Start with most commonly used:
   - `castai_eks_settings`
   - `castai_gke_user_policies`
2. Then add others as needed

## Test Quality Metrics

### Current Coverage by Category

| Category | Tested | Total | % |
|----------|--------|-------|---|
| **Cluster Resources** | 3 | 5 | 60% |
| **Autoscaling Resources** | 0 | 2 | 0% |
| **Node Configuration** | 0 | 3 | 0% |
| **Workload Resources** | 0 | 2 | 0% |
| **Supporting Resources** | 0 | 3 | 0% |
| **Data Sources** | 0 | 8 | 0% |
| **TOTAL** | 3 | 23 | **13%** |

### Test Scenarios Covered

| Scenario Type | Count | Examples |
|---------------|-------|----------|
| Basic resource creation | 120+ | Creating clusters with required fields |
| Multi-region/location | 15+ | Testing across AWS/GCP/Azure regions |
| Authentication methods | 10+ | Service principals, IAM roles, credentials |
| Safety settings | 10+ | delete_nodes_on_disconnect |
| Existing infrastructure | 47+ | Connecting existing clusters |
| Edge cases | 10+ | Minimal configs, validation |

## Suggested Execution Plan

### Option A: Minimum Viable Coverage ⭐ RECOMMENDED
**Timeline: 1-2 days**

1. ✅ Morning: Autoscaler tests (~2 hours)
2. ✅ Afternoon: Node Configuration tests (~2 hours)
3. ✅ Next Day: Start E2E test development
4. ✅ Ongoing: Add remaining unit tests in parallel with E2E

**Coverage after this**: ~27% of resources, but 100% of critical resources

### Option B: Comprehensive Coverage
**Timeline: 4-6 days**

Complete all unit tests before starting E2E tests.

**Coverage after this**: 100% of resources

### Option C: Parallel Approach (Best for time-to-value)
**Timeline: 1-2 days**

1. ✅ Complete Autoscaler + Node Configuration tests (~4 hours)
2. ⚙️ **Start E2E tests immediately** alongside remaining unit tests
3. ⚙️ Add Workload/Credentials/Data Source tests as E2E tests progress

## Missing Test Types

Beyond resource coverage, we're also missing:

1. **Integration Tests** - Testing resource interactions
   - Example: Autoscaler + Node Configuration working together
   - Example: Cluster + Credentials + Autoscaler full flow

2. **Error Handling Tests** - Testing failure scenarios
   - Invalid credentials
   - API timeouts
   - Resource conflicts
   - Validation errors

3. **Performance Tests** - Testing at scale
   - Multiple clusters
   - Large node configurations
   - Concurrent operations

4. **Contract Tests** - Ensuring SDK matches Terraform provider
   - Schema validation
   - Field compatibility
   - Breaking change detection

## Conclusion

**Current State:**
- ✅ Cloud provider coverage: **100% COMPLETE** (EKS, GKE, AKS all tested)
- ✅ 120 tests passing across all languages
- ❌ Core features: Autoscaler and Node Configuration still untested

**Recommended Next Steps:**

1. ✅ **Add Autoscaler tests** (~2 hours) - Test core value proposition
2. ✅ **Add Node Configuration tests** (~2 hours) - Test essential customization
3. 🚀 **Start E2E test development** - While continuing to add remaining unit tests in parallel

This gives us:
- Complete cloud provider coverage (AWS/GCP/Azure) ✅ **ALREADY DONE**
- Core autoscaling feature coverage ✅ **NEXT**
- Essential node configuration coverage ✅ **NEXT**
- ~27% overall resource coverage (currently 20%)
- Foundation for comprehensive E2E testing

The remaining 73% of resources (Workload policies, Credentials, Data Sources, etc.) can be added:
- In parallel with E2E test development
- As E2E tests reveal gaps
- Based on customer usage patterns and priorities

**Timeline to E2E-ready: ~4 hours of focused work** (just 2 resources to test)
