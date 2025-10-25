# SDK Generation Gaps Analysis

**Date**: 2025-01-24
**Context**: After completing autoscaler tests, we attempted to test NodeConfiguration and NodeTemplate resources based on Terraform examples.

## Issue Summary

While the Terraform provider includes `castai_node_configuration` and `castai_node_template` resources, these are **NOT present in the generated Pulumi SDKs** despite being mapped in the provider code.

## Evidence

### 1. Provider Mappings Exist

In `/Users/leonkuperman/LKDev/CAST/terraform-provider-castai/provider/resources.go` (lines 104-117):

```go
// Resource mappings
"castai_autoscaler":         {Tok: castaiResource(castaiMod, "Autoscaler")},
"castai_node_configuration": {Tok: castaiResource(nodeconfigMod, "NodeConfiguration")},
"castai_node_template":      {Tok: castaiResource(nodeconfigMod, "NodeTemplate")},
```

**Expected Pulumi Resources:**
- `castai:autoscaling:Autoscaler` ✅ EXISTS
- `castai:nodeconfig:NodeConfiguration` ❌ MISSING
- `castai:nodeconfig:NodeTemplate` ❌ MISSING

### 2. SDK Files Don't Exist

**Python SDK** (`/Users/leonkuperman/LKDev/CAST/pulumi-castai/sdk/python/pulumi_castai/`):
- ✅ `autoscaler.py` exists
- ❌ `node_configuration.py` missing
- ❌ `node_template.py` missing

**TypeScript SDK** (`/Users/leonkuperman/LKDev/CAST/pulumi-castai/sdk/nodejs/`):
- ✅ `autoscaler.ts` exists
- ❌ `nodeConfiguration.ts` missing
- ❌ `nodeTemplate.ts` missing

**Go SDK** (`/Users/leonkuperman/LKDev/CAST/pulumi-castai/sdk/go/castai/`):
- ✅ `autoscaler.go` exists
- ❌ `nodeConfiguration.go` missing
- ❌ `nodeTemplate.go` missing

### 3. Module Structure Issues

The provider defines a separate module `nodeconfigMod` for these resources:

```go
const (
    castaiMod      = "index"        // Main module
    nodeconfigMod  = "nodeconfig"   // Node configuration module
)
```

This suggests these resources should be under a `nodeconfig` submodule, but no such module exists in any SDK.

### 4. SDK Generation Failure

When attempting to regenerate SDKs using `make build_sdks`, we encountered errors:

```
panic: fatal: An assertion has failed: QName "aws" has invalid namespace ""
```

**Analysis**:
- The error occurs during schema generation in the tfgen process
- Likely related to documentation parsing or resource schema validation
- The generation process fails before completing all resources
- This may explain why some mapped resources never made it into the SDKs

## Terraform Examples Usage

These missing resources are **CRITICAL** - they appear in **EVERY** Terraform example:

### NodeConfiguration Example (from `eks_cluster_existing/castai.tf`):

```hcl
# Default node configuration
resource "castai_node_configuration_default" "this" {
  cluster_id     = castai_eks_clusterid.cluster_id.id
  configuration  = resource.castai_node_configuration.default.id
}

resource "castai_node_configuration" "default" {
  cluster_id = castai_eks_clusterid.cluster_id.id
  name       = "default"

  subnets               = var.subnets
  image                 = data.castai_eks_settings.castai.image
  tags                  = var.tags
  security_groups       = [aws_security_group.castai_sg.id]

  instance_profile_arn  = aws_iam_instance_profile.castai_instance_profile.arn

  eks {
    cluster_name           = var.cluster_name
    instance_profile_arn   = aws_iam_instance_profile.castai_instance_profile.arn
    dns_cluster_ip         = var.dns_cluster_ip
    security_groups        = [aws_security_group.castai_sg.id]

    target_group {
      arn = module.eks.cluster_target_group_arns[0]
    }
  }
}
```

### NodeTemplate Example:

```hcl
resource "castai_node_template" "spot" {
  cluster_id = castai_eks_clusterid.cluster_id.id
  name       = "spot-nodes"

  configuration_id = castai_node_configuration.default.id

  should_taint = false

  custom_labels = {
    workload-type = "batch"
  }

  constraints {
    spot                          = true
    use_spot_fallbacks            = true
    fallback_restore_rate_seconds = 1800

    instance_families {
      include = ["c5", "c5a", "c6i"]
    }
  }
}
```

## Impact on Testing

### Currently Blocked Tests

We **CANNOT** test these critical resources until SDK generation is fixed:

1. **NodeConfiguration Tests** (High Priority)
   - Default node configuration
   - Custom node configurations
   - EKS-specific settings (target groups, security groups)
   - GKE-specific settings (node pools, service accounts)
   - AKS-specific settings (node resource groups)

2. **NodeTemplate Tests** (High Priority)
   - Spot instance templates
   - On-demand templates
   - Hybrid configurations
   - Custom labels and taints
   - Instance family constraints

### Current Workaround

For now, we've completed autoscaler tests only, which **ARE** available in the SDK:
- ✅ 7 Python autoscaler tests
- ✅ 7 TypeScript autoscaler tests
- ✅ 7 Go autoscaler tests
- **Total: 21 autoscaler tests passing**

## Root Cause Analysis

### Theory 1: Incomplete SDK Regeneration
The resources were added to `provider/resources.go` but SDKs were never regenerated after adding the mappings.

**Evidence:**
- Mappings exist in code
- No SDK files exist
- Git history shows resources added but no corresponding SDK commits

### Theory 2: Schema Generation Bug
The tfgen schema generation process fails before processing these resources.

**Evidence:**
- `make build_sdks` fails with assertion error
- Error mentions QName namespace issues
- Likely a bug in documentation parsing or schema validation

### Theory 3: Module Structure Issue
The resources use a different module (`nodeconfigMod`) which may not be properly configured in the schema generation.

**Evidence:**
- These are the only resources using `nodeconfigMod`
- All working resources use `castaiMod` (main index)
- Module definition may be incomplete

## Recommended Fix Approaches

### Option 1: Fix SDK Generation (RECOMMENDED)
1. Debug the tfgen schema generation error
2. Fix documentation or schema issues causing the panic
3. Regenerate all SDKs with `make build_sdks`
4. Verify NodeConfiguration and NodeTemplate appear in all SDKs
5. Create comprehensive tests for both resources

**Timeline**: 2-4 hours (depends on complexity of tfgen error)

### Option 2: Manual SDK Creation
1. Manually create SDK files for NodeConfiguration and NodeTemplate
2. Base them on the Terraform provider schema
3. Test and verify functionality

**Timeline**: 4-6 hours per SDK language (12-18 hours total)
**Risk**: High - error-prone, maintenance burden

### Option 3: Defer Testing
1. Continue with E2E tests using only autoscaler
2. Fix SDK generation later
3. Add NodeConfiguration/NodeTemplate tests after fix

**Timeline**: Deferred
**Risk**: Medium - E2E tests won't cover full functionality

## Next Steps

1. ⚠️ **Decide on fix approach** - Option 1 (fix generation) is recommended
2. 🔍 **Debug tfgen error** - Investigate "QName 'aws' has invalid namespace" panic
3. 🔧 **Fix schema generation** - Resolve documentation/schema issues
4. 🔄 **Regenerate SDKs** - Run `make build_sdks` after fix
5. ✅ **Verify** - Check that nodeconfig module appears in all SDKs
6. 🧪 **Create tests** - Add NodeConfiguration and NodeTemplate test coverage

## Alternative: Proceed Without These Resources

If fixing SDK generation is too time-consuming, we can:

1. ✅ **Proceed with current coverage**
   - 142 tests passing (39 Python, 48 TypeScript, 55 Go)
   - Full cluster connection coverage (EKS, GKE, AKS)
   - Full autoscaler coverage

2. ✅ **Start E2E tests** with available resources
   - Use autoscaler in E2E tests
   - Defer node configuration until SDK is fixed

3. ⏭️ **Defer node configuration testing**
   - Document as known gap
   - Fix SDK generation in parallel
   - Add tests once SDKs are regenerated

**Trade-off**: We lose ~40% of Terraform example parity, but can proceed with E2E tests.

## Coverage Impact

### With Current SDKs Only
- **Cluster Connection**: 100% (EKS, GKE, AKS all tested)
- **Autoscaling**: 100% (Autoscaler fully tested)
- **Node Management**: 0% (NodeConfiguration and NodeTemplate blocked)
- **Overall Resource Coverage**: ~20% (4/15 resources tested)

### After SDK Fix
- **Cluster Connection**: 100%
- **Autoscaling**: 100%
- **Node Management**: 100% (with new tests)
- **Overall Resource Coverage**: ~33% (7/15 resources tested)

## Conclusion

The missing NodeConfiguration and NodeTemplate resources are a **blocking issue** for comprehensive testing, as they appear in every Terraform example and are core to CAST AI's value proposition.

**Recommendation**: Investigate and fix the SDK generation issue before moving to example refactoring or full E2E testing. However, we can proceed with E2E tests using available resources (clusters + autoscaler) while fixing SDK generation in parallel.

**Immediate Priority**: Decide whether to:
1. Fix SDK generation now (2-4 hours) then continue
2. Proceed with E2E tests using available resources, fix SDK generation later

Both approaches are viable - it depends on user's priority for comprehensive coverage vs. speed to E2E testing.
