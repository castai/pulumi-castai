"""
Mock Tests for CAST AI AKS Cluster Creation (Python)

These tests use Pulumi's built-in mocking to test AKS cluster creation
without making actual API calls to CAST AI or Azure.

Run with: pytest test_aks_cluster.py -v
"""

import pulumi


@pulumi.runtime.test
def test_aks_cluster_creation():
    """Test creating an AKS cluster with correct configuration"""
    import pulumi_castai as castai

    cluster = castai.AksCluster(
        "test-aks-cluster",
        subscription_id="12345678-1234-1234-1234-123456789012",
        tenant_id="87654321-4321-4321-4321-210987654321",
        client_id="abcdef12-3456-7890-abcd-ef1234567890",
        client_secret="mock-client-secret-value",
        name="my-aks-cluster",
        region="eastus",
        node_resource_group="MC_my-rg_my-aks-cluster_eastus",
        delete_nodes_on_disconnect=True,
    )

    def check_outputs(outputs):
        (
            cluster_id,
            cluster_name,
            cluster_token,
            subscription_id,
            region,
        ) = outputs
        assert cluster_id is not None
        assert cluster_name == "my-aks-cluster"
        assert cluster_token is not None
        assert "token" in str(cluster_token).lower() or len(str(cluster_token)) > 0
        assert subscription_id == "12345678-1234-1234-1234-123456789012"
        assert region == "eastus"

    return pulumi.Output.all(
        cluster.id,
        cluster.name,
        cluster.cluster_token,
        cluster.subscription_id,
        cluster.region,
    ).apply(check_outputs)


@pulumi.runtime.test
def test_aks_cluster_multiple_regions():
    """Test creating AKS clusters in different Azure regions"""
    import pulumi_castai as castai

    regions = ["eastus", "westus2", "northeurope", "southeastasia"]
    clusters = []

    for region in regions:
        cluster = castai.AksCluster(
            f"test-aks-{region}",
            subscription_id="12345678-1234-1234-1234-123456789012",
            tenant_id="87654321-4321-4321-4321-210987654321",
            client_id="abcdef12-3456-7890-abcd-ef1234567890",
            client_secret="mock-secret",
            name=f"cluster-{region}",
            region=region,
            node_resource_group=f"MC_rg_cluster-{region}_{region}",
            delete_nodes_on_disconnect=False,
        )
        clusters.append((cluster, region))

    def check_all_regions(outputs):
        for i, (cluster, expected_region) in enumerate(clusters):
            actual_region = outputs[i]
            assert actual_region == expected_region, f"Expected {expected_region}, got {actual_region}"

    return pulumi.Output.all(*[c.region for c, _ in clusters]).apply(check_all_regions)


@pulumi.runtime.test
def test_aks_cluster_deletion_behavior():
    """Test delete_nodes_on_disconnect setting"""
    import pulumi_castai as castai

    cluster_delete = castai.AksCluster(
        "test-aks-delete",
        subscription_id="12345678-1234-1234-1234-123456789012",
        tenant_id="87654321-4321-4321-4321-210987654321",
        client_id="abcdef12-3456-7890-abcd-ef1234567890",
        client_secret="mock-secret",
        name="delete-cluster",
        region="eastus",
        node_resource_group="MC_rg_delete-cluster_eastus",
        delete_nodes_on_disconnect=True,
    )

    cluster_keep = castai.AksCluster(
        "test-aks-keep",
        subscription_id="12345678-1234-1234-1234-123456789012",
        tenant_id="87654321-4321-4321-4321-210987654321",
        client_id="abcdef12-3456-7890-abcd-ef1234567890",
        client_secret="mock-secret",
        name="keep-cluster",
        region="westus",
        node_resource_group="MC_rg_keep-cluster_westus",
        delete_nodes_on_disconnect=False,
    )

    def check_deletion_behavior(outputs):
        delete_val, keep_val = outputs
        assert delete_val is True
        assert keep_val is False

    return pulumi.Output.all(
        cluster_delete.delete_nodes_on_disconnect,
        cluster_keep.delete_nodes_on_disconnect,
    ).apply(check_deletion_behavior)


@pulumi.runtime.test
def test_aks_cluster_node_resource_group():
    """Test AKS cluster with custom node resource group"""
    import pulumi_castai as castai

    # Azure creates a separate resource group for cluster nodes
    node_rg = "MC_custom-rg_production-aks_eastus2"

    cluster = castai.AksCluster(
        "test-aks-node-rg",
        subscription_id="12345678-1234-1234-1234-123456789012",
        tenant_id="87654321-4321-4321-4321-210987654321",
        client_id="abcdef12-3456-7890-abcd-ef1234567890",
        client_secret="mock-secret",
        name="production-aks",
        region="eastus2",
        node_resource_group=node_rg,
        delete_nodes_on_disconnect=False,
    )

    def check_node_rg(outputs):
        rg, cluster_name = outputs
        assert rg == node_rg
        assert cluster_name == "production-aks"

    return pulumi.Output.all(cluster.node_resource_group, cluster.name).apply(
        check_node_rg
    )


@pulumi.runtime.test
def test_aks_cluster_service_principal():
    """Test AKS cluster with service principal authentication"""
    import pulumi_castai as castai

    # Service principal credentials
    sp_client_id = "11111111-2222-3333-4444-555555555555"
    sp_client_secret = "mock-service-principal-secret-value"

    cluster = castai.AksCluster(
        "test-aks-sp",
        subscription_id="12345678-1234-1234-1234-123456789012",
        tenant_id="87654321-4321-4321-4321-210987654321",
        client_id=sp_client_id,
        client_secret=sp_client_secret,
        name="sp-cluster",
        region="westeurope",
        node_resource_group="MC_rg_sp-cluster_westeurope",
        delete_nodes_on_disconnect=True,
    )

    def check_service_principal(outputs):
        client_id, cluster_name = outputs
        assert client_id == sp_client_id
        assert cluster_name == "sp-cluster"

    return pulumi.Output.all(cluster.client_id, cluster.name).apply(
        check_service_principal
    )


@pulumi.runtime.test
def test_aks_cluster_multiple_subscriptions():
    """Test AKS clusters across different Azure subscriptions"""
    import pulumi_castai as castai

    subscriptions = [
        "11111111-1111-1111-1111-111111111111",
        "22222222-2222-2222-2222-222222222222",
        "33333333-3333-3333-3333-333333333333",
    ]
    clusters = []

    for i, sub_id in enumerate(subscriptions):
        cluster = castai.AksCluster(
            f"test-aks-sub-{i}",
            subscription_id=sub_id,
            tenant_id="87654321-4321-4321-4321-210987654321",
            client_id="abcdef12-3456-7890-abcd-ef1234567890",
            client_secret="mock-secret",
            name=f"cluster-sub-{i}",
            region="eastus",
            node_resource_group=f"MC_rg_cluster-sub-{i}_eastus",
            delete_nodes_on_disconnect=False,
        )
        clusters.append((cluster, sub_id))

    def check_all_subscriptions(outputs):
        for i, (cluster, expected_sub) in enumerate(clusters):
            actual_sub = outputs[i]
            assert actual_sub == expected_sub, f"Expected {expected_sub}, got {actual_sub}"

    return pulumi.Output.all(*[c.subscription_id for c, _ in clusters]).apply(check_all_subscriptions)


@pulumi.runtime.test
def test_aks_cluster_validation():
    """Test that AKS cluster validates required fields"""
    import pulumi_castai as castai

    # Test that resource creation accepts all required fields
    cluster = castai.AksCluster(
        "test-validation",
        subscription_id="12345678-1234-1234-1234-123456789012",
        tenant_id="87654321-4321-4321-4321-210987654321",
        client_id="abcdef12-3456-7890-abcd-ef1234567890",
        client_secret="mock-secret",
        name="validation-cluster",
        region="eastus",
        node_resource_group="MC_rg_validation-cluster_eastus",
        delete_nodes_on_disconnect=True,
    )

    def check_cluster_exists(outputs):
        cluster_id = outputs[0]
        assert cluster_id is not None

    return pulumi.Output.all(cluster.id).apply(check_cluster_exists)
