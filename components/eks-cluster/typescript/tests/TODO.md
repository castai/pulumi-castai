# EKS Cluster Component - Missing Test Coverage

**Current Coverage**: 44 tests passing (98.68% code coverage)
**Status**: Tests cover original functionality but missing new features

## Missing Test Cases

### 1. Read-Only Mode (NEW FEATURE)
**Priority**: HIGH
**Tests Needed**: ~8 tests

- [ ] Should only create Phase 1 resources when `readOnlyMode=true`
- [ ] Should NOT create IAM resources in read-only mode
- [ ] Should NOT create node configuration in read-only mode
- [ ] Should NOT create Phase 2 Helm charts (controller, spot-handler, evictor, pod-pinner)
- [ ] Should have `undefined` IAM outputs (`castaiRoleArn`, `instanceProfileArn`, etc.)
- [ ] Should NOT require `subnets` parameter in read-only mode
- [ ] Should NOT require `securityGroups` parameter in read-only mode
- [ ] Should accept `subnets`/`securityGroups` but not use them in read-only mode

**Example Usage**:
```typescript
const cluster = new CastAiEksCluster("test", {
    clusterName: "test-cluster",
    region: "us-east-1",
    accountId: "123456789012",
    apiToken: "test-token",
    readOnlyMode: true,  // No subnets/securityGroups needed
});
```

---

### 2. Input Validation (BREAKING BEHAVIOR)
**Priority**: CRITICAL
**Tests Needed**: ~3 tests

- [ ] Should throw error when `readOnlyMode=false` and `subnets` is missing
- [ ] Should throw error when `readOnlyMode=false` and `securityGroups` is missing
- [ ] Should succeed when `readOnlyMode=true` without `subnets`/`securityGroups`

**Current Behavior**: Component throws validation errors at runtime
**Test Location**: `components/eks-cluster/typescript/castAiEksCluster.ts:131-138`

```typescript
if (!readOnlyMode) {
    if (!args.subnets) {
        throw new Error("subnets is required when readOnlyMode is false");
    }
    if (!args.securityGroups) {
        throw new Error("securityGroups is required when readOnlyMode is false");
    }
}
```

---

### 3. Automatic Default Node Configuration (NEW FEATURE)
**Priority**: HIGH
**Tests Needed**: ~10 tests

- [ ] Should automatically create NodeConfiguration named "default" in full mode
- [ ] Should automatically create NodeConfigurationDefault pointing to default config
- [ ] Should include `instanceProfileArn` from IAM resources in node config
- [ ] Should include CAST AI security group in node config
- [ ] Should include user-provided security groups in node config
- [ ] Should merge security groups as `[castaiSG, ...userSGs]`
- [ ] Should pass `subnets` to default node configuration
- [ ] Should pass `tags` to default node configuration (if provided)
- [ ] Should NOT create node configuration in read-only mode
- [ ] Default node config should depend on `eksClusterConnection` and `iamResources`

**Code Location**: `components/eks-cluster/typescript/castAiEksCluster.ts:273-300`

---

### 4. Integration with Custom Resources (EXAMPLE PATTERNS)
**Priority**: MEDIUM
**Tests Needed**: ~5 tests

- [ ] Component should expose `clusterId` for creating custom NodeConfiguration
- [ ] Component should expose `instanceProfileArn` for custom node configs
- [ ] Component should expose `securityGroupId` for custom node configs
- [ ] Custom NodeConfiguration should successfully use component outputs
- [ ] NodeTemplate should successfully reference component's node configs
- [ ] Autoscaler should successfully use component's `clusterId`

**Example Integration** (from full-onboarding example):
```typescript
const cluster = new CastAiEksCluster("castai-cluster", { ... });

// Custom node config using component outputs
const customNodeConfig = new castai.config.NodeConfiguration("custom-config", {
    clusterId: cluster.clusterId,
    eks: {
        instanceProfileArn: cluster.instanceProfileArn!,
        securityGroups: pulumi.all([cluster.securityGroupId!, otherSG])
            .apply(([castaiSG, userSG]) => [castaiSG, userSG]),
    },
});

// Node template using custom config
const spotTemplate = new castai.config.NodeTemplate("spot-template", {
    clusterId: cluster.clusterId,
    configurationId: customNodeConfig.id,
});

// Autoscaler using component's cluster ID
const autoscaler = new castai.Autoscaler("autoscaler", {
    clusterId: cluster.clusterId,
});
```

---

### 5. Tags Support (NEW PARAMETER)
**Priority**: LOW
**Tests Needed**: ~3 tests

- [ ] Should accept optional `tags` parameter
- [ ] Should pass tags to default node configuration
- [ ] Should NOT pass tags if not provided (undefined)

**Example Usage**:
```typescript
const cluster = new CastAiEksCluster("test", {
    // ... other args ...
    tags: {
        "environment": "production",
        "team": "platform",
    },
});
```

---

### 6. Conditional IAM Outputs (NEW BEHAVIOR)
**Priority**: MEDIUM
**Tests Needed**: ~4 tests

- [ ] IAM outputs should be defined when `readOnlyMode=false`
- [ ] IAM outputs should be `undefined` when `readOnlyMode=true`
- [ ] Should verify all optional outputs: `castaiRoleArn?`, `instanceProfileArn?`, `nodeRoleArn?`, `securityGroupId?`
- [ ] Required outputs (`clusterId`, `clusterToken`) should always be defined

**Code Location**: `components/eks-cluster/typescript/castAiEksCluster.ts:118-121`

```typescript
export class CastAiEksCluster extends pulumi.ComponentResource {
    public readonly clusterId: pulumi.Output<string>;  // Always defined
    public readonly clusterToken: pulumi.Output<string>;  // Always defined
    public readonly castaiRoleArn?: pulumi.Output<string>;  // Optional (undefined in read-only)
    public readonly instanceProfileArn?: pulumi.Output<string>;  // Optional
    public readonly nodeRoleArn?: pulumi.Output<string>;  // Optional
    public readonly securityGroupId?: pulumi.Output<string>;  // Optional
}
```

---

## Test File to Create

**Filename**: `components/eks-cluster/typescript/tests/component.test.ts`

**Estimated Size**: ~300-400 lines
**Test Count**: ~33 new tests
**Total After**: 77 tests (44 existing + 33 new)

---

## Existing Tests (Still Valid)

✅ **contract.test.ts** (25 tests)
- Component interface and exports
- Required arguments (compile-time checks)
- Output properties
- Component type
- Terraform module compatibility

✅ **eksIamResources.test.ts** (19 tests)
- IAM component creation
- Required inputs
- Output properties
- IAM role trust policy structure
- aws-auth ConfigMap integration

**Note**: These tests need minor updates:
- Update contract tests to reflect `subnets`/`securityGroups` are now optional (when `readOnlyMode=true`)
- Add `readOnlyMode` to optional arguments section

---

## Why These Tests Matter

1. **Read-Only Mode**: Core feature used in `examples/typescript/aws/readonly/`
2. **Validation**: Prevents runtime errors when users forget required params
3. **Node Configuration**: Critical for cluster to work - reconciliation errors without it
4. **Integration**: Proves examples work (custom configs, templates, autoscaler)
5. **Backwards Compatibility**: Ensures existing users aren't broken

---

## When to Add These Tests

**Option 1**: Before releasing EKS component
- Pro: Complete coverage, prevents bugs
- Con: Delays GKE work

**Option 2**: After completing GKE (RECOMMENDED)
- Pro: Unblocks GKE examples
- Con: Technical debt

**Option 3**: Incrementally as bugs are found
- Pro: Minimal effort
- Con: Low coverage, risk of regressions

---

## Related Files

- Component: `components/eks-cluster/typescript/castAiEksCluster.ts`
- IAM: `components/eks-cluster/typescript/eksIamResources.ts`
- Example (read-only): `examples/typescript/aws/readonly/index.ts`
- Example (full): `examples/typescript/aws/full-onboarding/index.ts`

---

**Created**: 2025-10-28
**Last Review**: Never
**Owner**: Platform Team
