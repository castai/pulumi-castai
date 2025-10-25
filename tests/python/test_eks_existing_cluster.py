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
        override_security_groups=["sg-existing123"],
        subnets=["subnet-existing-a", "subnet-existing-b"],
    )

    def check_outputs(outputs):
        cluster_id, cluster_name, agent_token, account_id = outputs
        assert cluster_id is not None
        assert cluster_name == "production-eks-cluster"
        assert agent_token is not None
        assert "mock-eks-token" in str(agent_token).lower() or len(str(agent_token)) > 0
        assert account_id == "123456789012"

    return pulumi.Output.all(
        cluster.id, cluster.name, cluster.agent_token, cluster.account_id
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
        override_security_groups=["sg-existing456"],
        subnets=["subnet-existing-1", "subnet-existing-2"],
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
def test_connect_existing_eks_with_ssh_key():
    """Test connecting existing EKS cluster with SSH public key for node access"""
    import pulumi_castai as castai

    ssh_public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ... existing-key"

    cluster = castai.EksCluster(
        "existing-eks-ssh",
        account_id="123456789012",
        region="eu-west-1",
        name="dev-eks-cluster",
        delete_nodes_on_disconnect=True,
        override_security_groups=["sg-dev-123"],
        subnets=["subnet-dev-a", "subnet-dev-b", "subnet-dev-c"],
        ssh_public_key=ssh_public_key,
    )

    def check_ssh_key(outputs):
        ssh_key, cluster_name = outputs
        assert ssh_key == ssh_public_key
        assert cluster_name == "dev-eks-cluster"

    return pulumi.Output.all(cluster.ssh_public_key, cluster.name).apply(check_ssh_key)


@pulumi.runtime.test
def test_connect_existing_eks_with_tags():
    """Test connecting existing EKS cluster with resource tags"""
    import pulumi_castai as castai

    cluster_tags = {
        "Environment": "production",
        "ManagedBy": "castai",
        "Team": "platform",
        "CostCenter": "engineering",
    }

    cluster = castai.EksCluster(
        "existing-eks-tags",
        account_id="987654321098",
        region="us-east-2",
        name="prod-eks-main",
        delete_nodes_on_disconnect=False,
        override_security_groups=["sg-prod-main"],
        subnets=["subnet-prod-1a", "subnet-prod-1b"],
        tags=cluster_tags,
    )

    def check_tags(outputs):
        tags, cluster_name = outputs
        assert tags is not None
        assert len(tags) == 4
        assert tags.get("Environment") == "production"
        assert tags.get("Team") == "platform"
        assert cluster_name == "prod-eks-main"

    return pulumi.Output.all(cluster.tags, cluster.name).apply(check_tags)


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
        override_security_groups=["sg-minimal"],
        subnets=["subnet-min-a"],
    )

    def check_minimal(outputs):
        cluster_id, cluster_name, account_id = outputs
        assert cluster_id is not None
        assert cluster_name == "minimal-eks"
        assert account_id == "111111111111"

    return pulumi.Output.all(cluster.id, cluster.name, cluster.account_id).apply(
        check_minimal
    )


@pulumi.runtime.test
def test_connect_existing_eks_custom_dns():
    """Test connecting existing EKS cluster with custom DNS configuration"""
    import pulumi_castai as castai

    # Some clusters use custom DNS cluster IP
    custom_dns_ip = "172.20.0.10"

    cluster = castai.EksCluster(
        "existing-eks-dns",
        account_id="222222222222",
        region="us-west-2",
        name="custom-dns-cluster",
        delete_nodes_on_disconnect=False,
        override_security_groups=["sg-dns-123"],
        subnets=["subnet-dns-1", "subnet-dns-2"],
        dns_cluster_ip=custom_dns_ip,
    )

    def check_dns(outputs):
        dns_ip, cluster_name = outputs
        assert dns_ip == custom_dns_ip
        assert cluster_name == "custom-dns-cluster"

    return pulumi.Output.all(cluster.dns_cluster_ip, cluster.name).apply(check_dns)
