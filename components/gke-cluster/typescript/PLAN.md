# GKE Cluster Component - Implementation Plan

**Status**: 🟡 Planning
**Based On**: EKS pattern + Terraform modules (terraform-castai-gke-cluster, terraform-castai-gke-iam)
**Target**: TypeScript component with read-only and full-onboarding examples

## Component Structure

```
components/gke-cluster/typescript/
├── castAiGkeCluster.ts       # Main component (similar to EKS)
├── gkeIamResources.ts         # IAM sub-component (service accounts, roles)
├── index.ts                   # Public exports
├── package.json
├── tsconfig.json
├── jest.config.js
├── README.md
└── tests/
    ├── contract.test.ts       # Public API tests
    ├── gkeIamResources.test.ts
    └── TODO.md                # Missing tests (defer after examples)
```

## Key Differences from EKS

| Aspect | EKS | GKE |
|--------|-----|-----|
| **Authentication** | IAM Role ARN | Service Account credentials.json |
| **Location** | `region` (e.g., us-east-1) | `location` (zone or region, e.g., us-central1-a) |
| **Networking** | Security groups | Network tags |
| **Node Identity** | Instance profile | Service account |
| **Access Method** | EKS AccessEntry | Workload Identity |
| **Cluster Resource** | `castai.EksCluster` | `castai.GkeCluster` |

## Component: CastAiGkeCluster

### Interface (CastAiGkeClusterArgs)

```typescript
export interface CastAiGkeClusterArgs {
    // Required
    clusterName: string;
    location: string;           // Zone or region
    projectId: pulumi.Input<string>;
    apiToken: pulumi.Input<string>;

    // Optional
    apiUrl?: pulumi.Input<string>;
    readOnlyMode?: pulumi.Input<boolean>;  // Default: false

    // Required for full management (readOnlyMode=false)
    subnets?: pulumi.Input<pulumi.Input<string>[]>;
    networkTags?: pulumi.Input<pulumi.Input<string>[]>;

    // Optional configuration
    deleteNodesOnDisconnect?: pulumi.Input<boolean>;
    installWorkloadAutoscaler?: pulumi.Input<boolean>;
    installSecurityAgent?: pulumi.Input<boolean>;
    tags?: pulumi.Input<{ [key: string]: pulumi.Input<string> }>;

    // Provider overrides
    k8sProvider?: k8s.Provider;
}
```

### Outputs

```typescript
export class CastAiGkeCluster extends pulumi.ComponentResource {
    public readonly clusterId: pulumi.Output<string>;
    public readonly clusterToken: pulumi.Output<string>;
    public readonly credentialsId: pulumi.Output<string>;

    // Optional (undefined in read-only mode)
    public readonly serviceAccountEmail?: pulumi.Output<string>;
    public readonly serviceAccountKey?: pulumi.Output<string>;
}
```

### Phases

**Phase 1: Read-Only (Registration)**
- Create CAST AI provider
- Register GKE cluster (`castai.GkeCluster` - Phase 1)
- Create Kubernetes provider
- Install castai-agent Helm chart
- Outputs: `clusterId`, `clusterToken`

**Phase 2: Full Management** (when `readOnlyMode=false`)
- Create IAM resources (service account, roles, bindings)
- Update cluster with credentials (`castai.GkeCluster` - Phase 2)
- Create default node configuration
- Install Helm charts: controller, spot-handler, evictor, pod-pinner
- Outputs: Add `serviceAccountEmail`, `serviceAccountKey`, `credentialsId`

## Component: GkeIamResources

### Interface (GkeIamArgs)

```typescript
export interface GkeIamArgs {
    clusterName: string;
    projectId: pulumi.Input<string>;
    location: string;
    clusterId: pulumi.Input<string>;
}
```

### Resources Created

1. **Service Account**
   - Name: `castai-gke-{clusterName}-sa`
   - Display name: "CAST AI GKE service account"

2. **Custom IAM Roles**
   - CAST AI compute role (VM management)
   - CAST AI cluster role (GKE/Kubernetes management)

3. **IAM Bindings**
   - Bind service account to custom roles at project level

4. **Service Account Key**
   - Generate JSON key for authentication
   - Used in `credentialsJson` parameter

### Outputs

```typescript
public readonly serviceAccountEmail: pulumi.Output<string>;
public readonly serviceAccountKey: pulumi.Output<string>;  // credentials.json
```

## Node Configuration (Default)

Automatically created in Phase 2:

```typescript
new castai.config.NodeConfiguration("default", {
    clusterId: cluster.clusterId,
    name: "default",
    subnets: args.subnets,
    tags: args.tags,
    gke: {
        diskType: "pd-standard",
        networkTags: args.networkTags,
        maxPodsPerNode: 110,
    },
});
```

## Examples

### 1. Read-Only Mode (`examples/typescript/gcp/readonly/`)

```typescript
const cluster = new CastAiGkeCluster("castai-cluster", {
    clusterName: "my-gke-cluster",
    location: "us-central1-a",
    projectId: projectId,
    apiToken: castaiApiToken,
    readOnlyMode: true,  // No IAM, no management
});
```

**Resources**: 6 (provider, cluster registration, k8s provider, agent)

### 2. Full Onboarding (`examples/typescript/gcp/full-onboarding/`)

```typescript
const cluster = new CastAiGkeCluster("castai-cluster", {
    clusterName: "my-gke-cluster",
    location: "us-central1-a",
    projectId: projectId,
    apiToken: castaiApiToken,

    // Networking for CAST AI nodes
    subnets: ["default"],
    networkTags: ["castai-managed"],

    deleteNodesOnDisconnect: false,
});

// Custom node configuration
const customNodeConfig = new castai.config.NodeConfiguration("gpu-nodes", {
    clusterId: cluster.clusterId,
    name: "gpu-nodes",
    subnets: ["default"],
    gke: {
        diskType: "pd-ssd",
        networkTags: ["gpu-workload"],
        maxPodsPerNode: 110,
    },
});

// Node template
const spotTemplate = new castai.config.NodeTemplate("spot-template", {
    clusterId: cluster.clusterId,
    configurationId: customNodeConfig.id,
    constraints: {
        spot: true,
        onDemand: false,
        // ... instance families, etc.
    },
});

// Autoscaler
const autoscaler = new castai.Autoscaler("autoscaler", {
    clusterId: cluster.clusterId,
    autoscalerSettings: {
        enabled: true,
        // ... policies
    },
});
```

**Resources**: ~34 (similar to EKS)

## Implementation Phases

### Phase 1: Core Component (THIS SESSION)
- [ ] Create `gkeIamResources.ts` (service account, roles, bindings)
- [ ] Create `castAiGkeCluster.ts` (main component with readOnlyMode)
- [ ] Create `index.ts`, `package.json`, `tsconfig.json`
- [ ] Build and verify TypeScript compilation

### Phase 2: Read-Only Example
- [ ] Create `examples/typescript/gcp/readonly/`
- [ ] Test with real GKE cluster
- [ ] Verify agent installation

### Phase 3: Full-Onboarding Example
- [ ] Create `examples/typescript/gcp/full-onboarding/`
- [ ] Add custom node configuration
- [ ] Add node template
- [ ] Add autoscaler configuration
- [ ] Test with real GKE cluster

### Phase 4: Tests (DEFER)
- [ ] Contract tests (public API)
- [ ] IAM resources tests
- [ ] Component behavior tests
- [ ] Create TODO.md for missing tests

## Key Terraform References

**Main Cluster Module**:
- https://github.com/castai/terraform-castai-gke-cluster

**IAM Module**:
- https://github.com/castai/terraform-castai-gke-iam

## Notes

- GKE uses Workload Identity for pod-to-GCP authentication (optional, advanced)
- Network tags are GCP's equivalent of AWS security groups
- Location can be zonal (us-central1-a) or regional (us-central1)
- Service account key is sensitive (credentials.json) - handle as secret

---

**Created**: 2025-10-28
**Target Completion**: Same session
**Pattern Source**: EKS component (proven working)
