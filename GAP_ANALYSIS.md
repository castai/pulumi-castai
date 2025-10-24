# Gap Analysis: Pulumi CAST AI Provider vs Terraform Provider

**Date:** October 24, 2025
**Pulumi Provider Version:** 0.1.2 (wrapping Terraform Provider v0.24.3)
**Latest Terraform Provider Version:** v7.73.0
**Status:** 🔴 **CRITICAL GAP** - Missing 21 resources and 1 data source

## ⚠️ BLOCKING ISSUE: v7.x Compilation Failure

**UPDATE (October 24, 2025):** We attempted to upgrade to Terraform provider v7.x (tested v7.0.0, v7.21.0, and v7.73.0) but encountered a **critical compilation error** that blocks the upgrade:

```
resource_commitments_mapping.go:591:32: in call to slices.SortStableFunc,
type func(a R, b R) bool of func(a, b R) bool {…} does not match
inferred type func(a R, b R) int for func(a E, b E) int
```

### Root Cause

The CAST AI Terraform provider v7.x uses the **experimental** slices package (`golang.org/x/exp/slices`) instead of the standard library's `slices` package (available since Go 1.21). The experimental package has an older API where `SortStableFunc` comparison functions return `bool`, while the standard library version expects `int`.

**Affected File:** `castai/resource_commitments_mapping.go` (line 13, 591)
- **Current import:** `"golang.org/x/exp/slices"`
- **Should be:** `"slices"` (standard library)
- **Current function signature:** `func(a, b R) bool`
- **Should be:** `func(a, b R) int`

The provider builds successfully **standalone** because it directly uses the experimental package. However, when imported as a Go module dependency, module resolution conflicts occur with code expecting the standard library's slices package.

### Impact

- **Cannot upgrade to v7.x** until CAST AI fixes this compilation issue
- **Stuck on v0.24.3** which means we're missing 21 resources and 4 data sources
- The provider also violates Go module semantic versioning (v7+ should have `/v7` in module path)

### Workaround Attempted

Used `GOPRIVATE` and `GONOSUMDB` environment variables to bypass Go proxy checksum verification, but compilation still fails due to the source code issue.

### Next Steps

1. **Short-term:** Stay on v0.24.3 and implement unit tests for existing functionality
2. **Medium-term:** Report issue to CAST AI team at https://github.com/castai/terraform-provider-castai/issues
3. **Long-term:** Upgrade once CAST AI releases a version that compiles with modern Go

### Simple Fix Required

**File:** `castai/resource_commitments_mapping.go`

**Line 13 - Change import:**
```go
// OLD:
"golang.org/x/exp/slices"

// NEW:
"slices"
```

**Line 591-604 - Update comparison function:**
```go
// OLD:
slices.SortStableFunc(toSort, func(a, b R) bool {
    indexI, foundI := orderMap[a.getIDInCloud()]
    indexJ, foundJ := orderMap[b.getIDInCloud()]

    if !foundI && !foundJ {
        return a.getIDInCloud() < b.getIDInCloud()
    }
    if !foundI {
        return true
    }
    if !foundJ {
        return false
    }
    return indexI < indexJ
})

// NEW:
slices.SortStableFunc(toSort, func(a, b R) int {
    indexI, foundI := orderMap[a.getIDInCloud()]
    indexJ, foundJ := orderMap[b.getIDInCloud()]

    if !foundI && !foundJ {
        return strings.Compare(a.getIDInCloud(), b.getIDInCloud())
    }
    if !foundI {
        return -1
    }
    if !foundJ {
        return 1
    }
    return indexI - indexJ
})
```

**Note:** May also need to add `"strings"` to imports if not already present.

### Recommendation

File a GitHub issue with CAST AI at https://github.com/castai/terraform-provider-castai/issues including:
1. The compilation error when used as a Go module dependency
2. Link to this analysis showing the exact fix needed
3. Request to migrate from `golang.org/x/exp/slices` to standard library `slices`
4. Request to follow Go module semantic versioning (`/v7` in module path)

**Alternatively:** Create a pull request with the fix above - it's a simple 2-line change plus the comparison logic update.

---

## Executive Summary

The Pulumi CAST AI provider is significantly outdated, wrapping **Terraform provider v0.24.3** while the latest version is **v7.73.0**. This represents a gap of approximately **7 major versions** and includes:

- ✅ **7 resources mapped** (all from v0.24.3)
- ✅ **6 data sources mapped** (all from v0.24.3)
- ❌ **21 resources missing** (from newer Terraform provider versions)
- ❌ **1 data source missing** (from newer Terraform provider versions)
- ⚠️ **Unknown breaking changes** between v0.24.3 and v7.73.0

## Current Mapping (v0.24.3)

### ✅ Resources Currently Mapped (7/28)

| Terraform Resource | Pulumi Token | Module | Status |
|-------------------|--------------|--------|--------|
| `castai_eks_cluster` | `castai:aws:EksCluster` | aws | ✅ Mapped |
| `castai_gke_cluster` | `castai:gcp:GkeCluster` | gcp | ✅ Mapped |
| `castai_aks_cluster` | `castai:azure:AksCluster` | azure | ✅ Mapped |
| `castai_cluster` | `castai:index:Cluster` | index | ✅ Mapped |
| `castai_credentials` | `castai:index:Credentials` | index | ✅ Mapped |
| `castai_cluster_token` | `castai:index:ClusterToken` | index | ✅ Mapped |
| `castai_autoscaler` | `castai:autoscaling:Autoscaler` | autoscaling | ✅ Mapped |

### ✅ Data Sources Currently Mapped (6/7)

| Terraform Data Source | Pulumi Token | Module | Status |
|----------------------|--------------|--------|--------|
| `castai_eks_settings` | `castai:aws:getEksSettings` | aws | ✅ Mapped |
| `castai_eks_clusterid` | `castai:aws:getEksClusterId` | aws | ✅ Mapped |
| `castai_eks_user_arn` | `castai:aws:getEksUserArn` | aws | ✅ Mapped |
| `castai_gke_user_policies` | `castai:gcp:getGkePolicies` | gcp | ✅ Mapped |
| `castai_cluster` | `castai:index:getCluster` | index | ✅ Mapped |
| `castai_credentials` | `castai:index:getCredentials` | index | ✅ Mapped |

**Note:** All resources and data sources from v0.24.3 are correctly mapped.

## Missing Resources (21)

### ❌ Cluster Management (2 missing)

| Resource | Purpose | Suggested Module | Priority |
|----------|---------|-----------------|----------|
| `castai_eks_clusterid` | AWS EKS cluster ID resource | `aws` | 🔴 High |
| `castai_gke_cluster_id` | GCP GKE cluster ID resource | `gcp` | 🔴 High |

### ❌ Node Management (4 missing)

| Resource | Purpose | Suggested Module | Priority |
|----------|---------|-----------------|----------|
| `castai_node_template` | Node template configuration | `nodeconfig` | 🟡 Medium |
| `castai_node_configuration` | Node configuration settings | `nodeconfig` | 🔴 High |
| `castai_node_configuration_default` | Default node configuration | `nodeconfig` | 🟡 Medium |
| `castai_evictor_advanced_config` | Advanced evictor configuration | `autoscaling` | 🟡 Medium |

### ❌ Rebalancing & Scheduling (3 missing)

| Resource | Purpose | Suggested Module | Priority |
|----------|---------|-----------------|----------|
| `castai_rebalancing_schedule` | Schedule for rebalancing jobs | `rebalancing` | 🔴 High |
| `castai_rebalancing_job` | Rebalancing job execution | `rebalancing` | 🔴 High |
| `castai_hibernation_schedule` | Cluster hibernation schedule | `rebalancing` | 🟡 Medium |

### ❌ Workload Management (2 missing)

| Resource | Purpose | Suggested Module | Priority |
|----------|---------|-----------------|----------|
| `castai_workload_scaling_policy` | Workload scaling policies | `workload` | 🔴 High |
| `castai_workload_scaling_policy_order` | Policy execution order | `workload` | 🟡 Medium |

### ❌ Organization & IAM (6 missing)

| Resource | Purpose | Suggested Module | Priority |
|----------|---------|-----------------|----------|
| `castai_organization_members` | Organization member management | `organization` | 🟡 Medium |
| `castai_organization_group` | Organization groups | `organization` | 🟡 Medium |
| `castai_sso_connection` | SSO configuration | `organization` | 🟢 Low |
| `castai_service_account` | Service accounts | `organization` | 🔴 High |
| `castai_service_account_key` | Service account keys | `organization` | 🔴 High |
| `castai_role_bindings` | Role binding configuration | `organization` | 🟡 Medium |

### ❌ Cost Optimization (2 missing)

| Resource | Purpose | Suggested Module | Priority |
|----------|---------|-----------------|----------|
| `castai_reservations` | Reserved instance management | `index` | 🟡 Medium |
| `castai_commitments` | Commitment management | `index` | 🟡 Medium |

### ❌ Security (1 missing)

| Resource | Purpose | Suggested Module | Priority |
|----------|---------|-----------------|----------|
| `castai_security_runtime_rule` | Runtime security rules | `index` | 🟡 Medium |

### ❌ Enterprise Features (3 missing)

| Resource | Purpose | Suggested Module | Priority |
|----------|---------|-----------------|----------|
| `castai_allocation_group` | Resource allocation groups | `organization` | 🟢 Low |
| `castai_enterprise_group` | Enterprise group management | `organization` | 🟢 Low |
| `castai_enterprise_role_binding` | Enterprise role bindings | `organization` | 🟢 Low |

### ❌ AWS-Specific (1 missing)

| Resource | Purpose | Suggested Module | Priority |
|----------|---------|-----------------|----------|
| `castai_eks_user_arn` | EKS user ARN resource | `aws` | 🟡 Medium |

## Missing Data Sources (1)

| Data Source | Purpose | Suggested Module | Priority |
|-------------|---------|-----------------|----------|
| `castai_organization` | Organization information | `organization` | 🟡 Medium |
| `castai_rebalancing_schedule` | Query rebalancing schedules | `rebalancing` | 🟡 Medium |
| `castai_hibernation_schedule` | Query hibernation schedules | `rebalancing` | 🟢 Low |
| `castai_workload_scaling_policy_order` | Query policy order | `workload` | 🟢 Low |

**Note:** `castai_eks_user_arn` data source is marked for removal in next major Terraform provider release.

## Module Organization

The Pulumi provider defines these modules but several are unused:

| Module | Status | Resources Count |
|--------|--------|-----------------|
| `index` | ✅ Used | 3 mapped, 3 missing |
| `aws` | ✅ Used | 1 mapped, 2 missing |
| `gcp` | ✅ Used | 1 mapped, 1 missing |
| `azure` | ✅ Used | 1 mapped, 0 missing |
| `autoscaling` | ✅ Used | 1 mapped, 1 missing |
| `organization` | ❌ **Unused** | 0 mapped, 9 missing |
| `nodeconfig` | ❌ **Unused** | 0 mapped, 4 missing |
| `rebalancing` | ❌ **Unused** | 0 mapped, 3 missing |
| `workload` | ❌ **Unused** | 0 mapped, 2 missing |
| `iam` | ❌ **Unused** | 0 mapped, 0 identified |

## Impact Assessment

### High Priority Resources (8)

These resources are critical for core CAST AI functionality:

1. **Cluster IDs** - `castai_eks_clusterid`, `castai_gke_cluster_id`
2. **Node Configuration** - `castai_node_configuration`
3. **Rebalancing** - `castai_rebalancing_schedule`, `castai_rebalancing_job`
4. **Workload Scaling** - `castai_workload_scaling_policy`
5. **Service Accounts** - `castai_service_account`, `castai_service_account_key`

### Medium Priority Resources (9)

Important for advanced features and automation:

- Node templates and defaults
- Evictor advanced config
- Hibernation schedules
- Organization management
- Cost optimization (reservations, commitments)

### Low Priority Resources (4)

Nice-to-have for enterprise deployments:

- SSO configuration
- Enterprise features
- Advanced organization features

## Version Gap Analysis

### Critical Unknowns

1. **Breaking Changes:** We don't know what breaking changes occurred between v0.24.3 and v7.73.0
2. **API Changes:** CAST AI API may have changed significantly
3. **Schema Changes:** Existing resources may have new required fields or deprecated fields
4. **Behavior Changes:** Resource behavior may have changed in ways that affect users

### Upgrade Path Risks

Upgrading from v0.24.3 to v7.73.0 may:

- Break existing Pulumi programs
- Require state migration
- Change resource behavior
- Introduce new required fields
- Deprecate old patterns

## Recommendations

### Immediate Actions (Priority 1)

1. **Update Terraform Provider Dependency**
   ```bash
   # Update provider/go.mod
   github.com/castai/terraform-provider-castai v7.73.0
   ```

2. **Test Existing Resources**
   - Verify all 7 existing resources still work
   - Check for schema changes
   - Update examples if needed

3. **Add High-Priority Resources**
   - Start with cluster management resources
   - Add node configuration resources
   - Add rebalancing resources

### Medium-Term Actions (Priority 2)

4. **Systematic Gap Closure**
   - Add all 21 missing resources over 2-3 releases
   - Add missing data sources
   - Update documentation

5. **Version Alignment Policy**
   - Establish policy to keep Terraform provider version current
   - Set up automated checks for new Terraform provider releases
   - Document supported version in CLAUDE.md

### Long-Term Actions (Priority 3)

6. **Testing Infrastructure**
   - Add unit tests for new resources
   - Expand e2e test coverage
   - Add integration tests for new features

7. **Documentation**
   - Create migration guide from v0.24.3 to v7.x
   - Document all new resources
   - Update examples to showcase new features

## Implementation Approach

### Phase 1: Foundation (Week 1)

1. Update Terraform provider to v7.73.0
2. Test existing 7 resources for compatibility
3. Fix any breaking changes
4. Update schema generation

### Phase 2: Core Resources (Weeks 2-3)

1. Add 8 high-priority resources
2. Add corresponding data sources
3. Create examples for new resources
4. Update documentation

### Phase 3: Advanced Features (Weeks 4-6)

1. Add 9 medium-priority resources
2. Add organization management features
3. Add workload scaling features
4. Comprehensive testing

### Phase 4: Enterprise & Polish (Week 7+)

1. Add 4 low-priority resources
2. Complete documentation
3. Create migration guide
4. Release v1.0.0

## Resource Mapping Template

For each new resource, update `provider/resources.go`:

```go
// In Resources map:
"castai_node_configuration": {
    Tok: castaiResource(nodeConfigMod, "NodeConfiguration"),
    Fields: map[string]*tfbridge.SchemaInfo{
        "cluster_id": {
            Name: "clusterId",
        },
    },
},

// In DataSources map:
"castai_organization": {
    Tok: tokens.ModuleMember(castaiDataSource(organizationMod, "getOrganization")),
},
```

## Testing Requirements

Each new resource must have:

1. ✅ Unit tests for token generation
2. ✅ Schema validation tests
3. ✅ At least one example program
4. ✅ Documentation in README.md
5. ✅ E2E test (where feasible)

## Success Criteria

The gap will be considered closed when:

- [ ] All 28 resources from v7.73.0 are mapped
- [ ] All 7 data sources are mapped
- [ ] All existing resources tested with v7.73.0
- [ ] Breaking changes documented
- [ ] Migration guide published
- [ ] Examples updated for new resources
- [ ] Version alignment policy established

## Notes

- The module names (`organization`, `nodeconfig`, `rebalancing`, `workload`) are already defined but unused
- This suggests previous planning to add these resources
- The bridge automatically handles most Terraform → Pulumi conversions
- Focus should be on correct module assignment and token generation
- Breaking changes from Terraform provider upgrades will flow through to Pulumi users

## References

- Upstream Terraform Provider: https://github.com/castai/terraform-provider-castai
- Current Version (v0.24.3): https://github.com/castai/terraform-provider-castai/tree/v0.24.3
- Latest Version (v7.73.0): https://github.com/castai/terraform-provider-castai/tree/v7.73.0
- Terraform Registry Docs: https://registry.terraform.io/providers/castai/castai/latest/docs
