# Terraform Example Analysis - Cluster Creation Patterns

## Key Discovery

The Terraform provider examples show **TWO distinct patterns** for cluster onboarding:

### Pattern 1: Create + Connect (Full Stack)
**Examples:** `eks_clusters/`, `aks_cluster/`, `gke_clusters_with_workspaces/`

**Files Structure:**
- `vpc.tf` - Creates VPC/network infrastructure
- `eks.tf` / `aks.tf` / `gke.tf` - Creates the actual K8s cluster using cloud provider modules
- `castai.tf` - Connects to CAST AI and configures autoscaling

**Flow:**
1. Create cloud infrastructure (VPC, subnets, security groups)
2. Create K8s cluster (using `terraform-aws-modules/eks/aws` or equivalent)
3. Connect cluster to CAST AI (using `castai_eks_cluster` resource)
4. Configure CAST AI features (autoscaler, node configurations, node templates)

### Pattern 2: Connect Existing (CAST AI Only)
**Examples:** `eks_cluster_existing/`, `aks_cluster_existing/`, `gke_cluster_existing/`

**Files Structure:**
- `castai.tf` - ONLY CAST AI configuration
- No VPC, no cluster creation files

**Flow:**
1. User provides existing cluster details (VPC ID, security groups, subnets, etc.)
2. Connect cluster to CAST AI
3. Configure CAST AI features

## Key Resources Used in Examples

### EKS Example (`eks_clusters/`)

**Cluster Creation (eks.tf):**
```hcl
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.4.2"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  # Node groups, addons, etc.
}
```

**CAST AI Connection (castai.tf):**
```hcl
# 1. Register cluster with CAST AI
resource "castai_eks_clusterid" "cluster_id" {
  account_id   = data.aws_caller_identity.current.account_id
  region       = var.cluster_region
  cluster_name = var.cluster_name
}

# 2. Configure CAST AI features using the eks-cluster module
module "castai-eks-cluster" {
  source  = "castai/eks-cluster/castai"
  version = "~> 13.0"

  # ... autoscaler settings
  # ... node configurations
  # ... node templates
}
```

## What This Means for Pulumi

### Current Pulumi Examples Status

**What we have:**
- ✅ Simple "connect existing" examples
- ✅ Assume cluster already exists
- ✅ Show CAST AI connection only

**What we're missing:**
- ❌ Full "create + connect" examples
- ❌ Shows complete flow from VPC → Cluster → CAST AI
- ❌ Demonstrates how everything works together

### Recommended Pulumi Example Structure

We should have BOTH patterns:

#### 1. Quick Start (Existing Cluster)
**Location:** `examples/typescript/aws/existing-cluster/`
```typescript
// Assumes EKS cluster already exists
const cluster = new castai.EksCluster("existing-cluster", {
    accountId: existingAccountId,
    region: existingRegion,
    name: existingClusterName,
    // ... existing cluster details
});
```

#### 2. Full Stack (Create + Connect)
**Location:** `examples/typescript/aws/full-stack/`
```typescript
// 1. Create VPC
const vpc = new aws.ec2.Vpc(...)

// 2. Create EKS cluster
const eksCluster = new aws.eks.Cluster(...)

// 3. Connect to CAST AI
const castaiCluster = new castai.EksCluster("cast-connection", {
    accountId: awsAccountId,
    region: eksCluster.region,
    name: eksCluster.name,
    overrideSecurityGroups: [eksCluster.securityGroupId],
    subnets: vpc.privateSubnetIds,
});

// 4. Configure autoscaling
const autoscaler = new castai.Autoscaler(...)

// 5. Configure node configuration
const nodeConfig = new castai.NodeConfiguration(...)
```

## Testing Implications

### What We've Already Tested ✅
- **Cluster connection resources** (EKS, GKE, AKS)
- Basic resource creation and configuration
- All three cloud providers

### What We Should Test Next

1. **Autoscaler Resource** - Shown in every Terraform example
   - Python, TypeScript, Go tests
   - Basic autoscaler configuration
   - Unschedulable pods settings
   - Node downscaler settings
   - Cluster limits

2. **Node Configuration Resource** - Also in every example
   - Python, TypeScript, Go tests
   - Default node configuration
   - Custom node configurations
   - Cloud-specific settings (kubelet_config, container_runtime, etc.)

3. **Node Template Resource** - Used for advanced scenarios
   - Custom labels and taints
   - Instance family constraints
   - Spot vs on-demand settings

### Coverage Priority

| Priority | Resource | Reason | In Terraform Examples? |
|----------|----------|--------|----------------------|
| **CRITICAL** | `castai_autoscaler` | Core value prop, in EVERY example | ✅ YES - All examples |
| **CRITICAL** | `castai_node_configuration` | Essential customization, in EVERY example | ✅ YES - All examples |
| **HIGH** | `castai_node_template` | Advanced scenarios | ✅ YES - Most examples |
| **MEDIUM** | `castai_workload_scaling_policy` | New feature | ❌ NO - Separate examples |
| **LOW** | `castai_credentials` | Alternative to inline creds | ❌ NO - Edge case |

## Example Comparison

### Terraform Examples Have:
- ✅ Create + Connect pattern
- ✅ Connect Existing pattern
- ✅ Autoscaler configuration
- ✅ Node configurations
- ✅ Node templates
- ✅ Full IAM setup
- ✅ Network setup
- ✅ Real-world scenarios (GitOps, security, read-only, etc.)

### Pulumi Examples Have:
- ✅ Connect Existing pattern
- ✅ Basic cluster connection
- ❌ Create + Connect pattern
- ❌ Autoscaler configuration
- ❌ Node configurations
- ❌ Node templates
- ⚠️ Partial IAM setup (only in GKE existing)
- ❌ Network setup
- ❌ Real-world scenarios

## Recommendations

### Phase 1: Critical Tests (~4 hours)
1. **Autoscaler Resource Tests**
   - Python, TypeScript, Go
   - ~2 hours

2. **Node Configuration Tests**
   - Python, TypeScript, Go
   - ~2 hours

### Phase 2: Example Improvements (~1-2 days)
1. **Create "Full Stack" examples for each cloud**
   - AWS: VPC → EKS → CAST AI → Autoscaler
   - GCP: VPC → GKE → CAST AI → Autoscaler
   - Azure: VNET → AKS → CAST AI → Autoscaler

2. **Add Autoscaler examples**
   - Separate small examples showing autoscaler configuration
   - Different scenarios (spot, on-demand, hybrid)

3. **Add Node Configuration examples**
   - Custom kubelet settings
   - Different container runtimes
   - Volume configurations

### Phase 3: E2E Tests
- Use "Create + Connect" pattern
- Actually create clusters and connect them
- Test autoscaler behavior
- Test node configuration

## Conclusion

**Key Insights:**
1. CAST AI provider NEVER creates clusters - it ONLY connects to existing ones
2. But examples show BOTH "assume existing" and "create then connect" patterns
3. Autoscaler and Node Configuration are in EVERY Terraform example
4. We need to test these critical resources before E2E
5. Our Pulumi examples should match Terraform example patterns

**Immediate Next Steps:**
1. ✅ Test Autoscaler resource (~2 hours)
2. ✅ Test Node Configuration resource (~2 hours)
3. 🚀 Start E2E tests
4. ⚙️ Improve examples to match Terraform patterns (in parallel)
