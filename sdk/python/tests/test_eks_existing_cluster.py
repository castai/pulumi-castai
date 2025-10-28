"""
Mock Tests for Connecting Existing EKS Clusters to CAST AI (Python)

These tests simulate connecting an existing EKS cluster to CAST AI for optimization.
The cluster already exists - we're just onboarding it to CAST AI.

Run with: pytest test_eks_existing_cluster.py -v
"""

import pulumi


@pulumi.runtime.test
def test_connect_existing_eks_cluster():
    """Test connecting an existing EKS cluster to CAST AI"""
    import pulumi_castai as castai

    # Connect existing cluster - in real scenario, cluster already exists in AWS
    cluster = castai.EksCluster(
        "existing-eks-cluster",
        account_id="123456789012",
        region="us-east-1",
        name="production-eks-cluster",  # Existing cluster name
        delete_nodes_on_disconnect=False,  # Don't delete nodes when disconnecting
    )

    def check_outputs(outputs):
        cluster_id, cluster_name, cluster_token, account_id = outputs
        assert cluster_id is not None
        assert cluster_name == "production-eks-cluster"
        assert cluster_token is not None
        assert "mock-eks-token" in str(cluster_token).lower() or len(str(cluster_token)) > 0
        assert account_id == "123456789012"

    return pulumi.Output.all(
        cluster.id, cluster.name, cluster.cluster_token, cluster.account_id
    ).apply(check_outputs)


@pulumi.runtime.test
def test_connect_existing_eks_with_assume_role():
    """Test connecting existing EKS cluster using IAM assume role"""
    import pulumi_castai as castai

    # Real-world scenario: Using cross-account assume role
    assume_role_arn = "arn:aws:iam::123456789012:role/CastAI-CrossAccountRole"

    cluster = castai.EksCluster(
        "existing-eks-assume-role",
        account_id="123456789012",
        region="us-west-2",
        name="staging-eks-cluster",
        delete_nodes_on_disconnect=False,
        assume_role_arn=assume_role_arn,  # Use IAM role instead of access keys
    )

    def check_assume_role(outputs):
        role_arn, cluster_name = outputs
        assert role_arn == assume_role_arn
        assert cluster_name == "staging-eks-cluster"

    return pulumi.Output.all(cluster.assume_role_arn, cluster.name).apply(
        check_assume_role
    )


@pulumi.runtime.test
def test_connect_existing_eks_minimal_config():
    """Test connecting existing EKS cluster with minimal configuration"""
    import pulumi_castai as castai

    # Minimal config - just the required fields
    cluster = castai.EksCluster(
        "existing-eks-minimal",
        account_id="111111111111",
        region="ap-southeast-1",
        name="minimal-eks",
        delete_nodes_on_disconnect=True,
    )

    def check_minimal(outputs):
        cluster_id, cluster_name, account_id = outputs
        assert cluster_id is not None
        assert cluster_name == "minimal-eks"
        assert account_id == "111111111111"

    return pulumi.Output.all(cluster.id, cluster.name, cluster.account_id).apply(
        check_minimal
    )
