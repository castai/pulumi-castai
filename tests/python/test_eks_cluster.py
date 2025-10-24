"""
Mock Tests for CAST AI EKS Cluster Creation

These tests use Pulumi's built-in mocking to test EKS cluster creation
without making actual API calls to CAST AI or AWS.

Run with: pytest test_eks_cluster.py -v
"""

import pytest
import pulumi
from typing import Optional, Any


class CastAIMocks(pulumi.runtime.Mocks):
    """
    Mock implementation for CAST AI and AWS resources.

    This mock intercepts resource creation calls and returns
    predefined values, allowing us to test without real API calls.
    """

    def new_resource(self, args: pulumi.runtime.MockResourceArgs):
        """
        Mock resource creation.

        Returns a mock ID and state based on the resource type.
        """
        # Start with the inputs as outputs
        outputs = dict(args.inputs)

        # Add resource-specific outputs based on type
        if args.typ == "castai:aws:EksCluster":
            # Mock EKS cluster outputs
            outputs.update({
                "id": f"{args.name}-cluster-id-456",
                "cluster_token": "mock-eks-cluster-token-abc123",
                "credentials_id": "mock-eks-credentials-def789",
            })
            return [f"{args.name}-id", outputs]

        elif args.typ == "aws:iam/role:Role":
            # Mock AWS IAM role
            outputs.update({
                "id": f"{args.name}-role-id",
                "arn": f"arn:aws:iam::{args.inputs.get('account_id', '123456789012')}:role/{args.name}",
                "unique_id": "AIDACKCEVSQ6C2EXAMPLE",
            })
            return [f"{args.name}-role-id", outputs]

        elif args.typ == "aws:iam/rolePolicyAttachment:RolePolicyAttachment":
            # Mock AWS IAM role policy attachment
            outputs.update({
                "id": f"{args.name}-policy-attachment-id",
            })
            return [f"{args.name}-policy-attachment-id", outputs]

        elif args.typ == "aws:ec2/securityGroup:SecurityGroup":
            # Mock AWS security group
            outputs.update({
                "id": f"sg-{args.name}",
                "arn": f"arn:aws:ec2:us-west-2:123456789012:security-group/sg-{args.name}",
            })
            return [f"sg-{args.name}", outputs]

        elif args.typ == "aws:ec2/subnet:Subnet":
            # Mock AWS subnet
            outputs.update({
                "id": f"subnet-{args.name}",
                "arn": f"arn:aws:ec2:us-west-2:123456789012:subnet/subnet-{args.name}",
                "availability_zone": "us-west-2a",
            })
            return [f"subnet-{args.name}", outputs]

        elif args.typ == "pulumi:providers:castai":
            # Mock CAST AI provider
            return [f"{args.name}-provider", outputs]

        elif args.typ == "pulumi:providers:aws":
            # Mock AWS provider
            return [f"{args.name}-provider", outputs]

        else:
            # Default: return the inputs as outputs
            return [f"{args.name}-id", outputs]

    def call(self, args: pulumi.runtime.MockCallArgs):
        """
        Mock function/data source calls.

        Returns mock data for data sources and function calls.
        """
        if args.token == "aws:ec2/getSubnets:getSubnets":
            # Mock AWS subnets lookup
            return {
                "ids": ["subnet-12345678", "subnet-87654321"],
            }

        if args.token == "aws:getCallerIdentity:getCallerIdentity":
            # Mock AWS caller identity
            return {
                "account_id": "123456789012",
                "arn": "arn:aws:iam::123456789012:user/test-user",
                "user_id": "AIDACKCEVSQ6C2EXAMPLE",
            }

        # Default: return empty
        return {}


# Set up mocks before any tests run
pulumi.runtime.set_mocks(CastAIMocks())


@pulumi.runtime.test
def test_eks_cluster_creation():
    """
    Test creating an EKS cluster with CAST AI.

    Verifies that:
    - Cluster is created with correct configuration
    - Cluster ID is generated
    - Cluster token is returned
    """
    import pulumi_castai as castai

    # Create a mock EKS cluster
    cluster = castai.EksCluster(
        "test-eks-cluster",
        account_id="123456789012",
        region="us-west-2",
        name="my-eks-cluster",
        delete_nodes_on_disconnect=True,
        override_security_groups=["sg-12345678"],
        subnets=["subnet-12345678", "subnet-87654321"],
    )

    # Verify the outputs
    def check_outputs(outputs):
        cluster_id, cluster_name, cluster_token, account_id, region = outputs

        # Assertions
        assert cluster_id is not None, "Cluster ID should not be None"
        assert "cluster-id" in cluster_id, "Cluster ID should contain 'cluster-id'"

        assert cluster_name == "my-eks-cluster", f"Expected cluster name 'my-eks-cluster', got '{cluster_name}'"

        assert cluster_token is not None, "Cluster token should not be None"
        assert "mock-eks-cluster-token" in cluster_token, "Cluster token should be mocked"

        assert account_id == "123456789012", f"Expected account_id '123456789012', got '{account_id}'"
        assert region == "us-west-2", f"Expected region 'us-west-2', got '{region}'"

    return pulumi.Output.all(
        cluster.id,
        cluster.name,
        cluster.cluster_token,
        cluster.account_id,
        cluster.region,
    ).apply(check_outputs)


@pulumi.runtime.test
def test_eks_cluster_with_multiple_subnets():
    """
    Test creating an EKS cluster with multiple subnets.

    Verifies that subnet configuration is properly handled.
    """
    import pulumi_castai as castai

    test_subnets = [
        "subnet-11111111",
        "subnet-22222222",
        "subnet-33333333",
    ]

    cluster = castai.EksCluster(
        "test-eks-subnets",
        account_id="123456789012",
        region="us-east-1",
        name="multi-subnet-cluster",
        delete_nodes_on_disconnect=True,
        override_security_groups=["sg-test"],
        subnets=test_subnets,
    )

    # Verify subnets
    def check_subnets(outputs):
        subnets = outputs[0]

        assert subnets is not None, "Subnets should not be None"
        assert len(subnets) == 3, f"Expected 3 subnets, got {len(subnets)}"
        assert subnets == test_subnets, f"Expected subnets {test_subnets}, got {subnets}"

    return cluster.subnets.apply(lambda subnets: check_subnets([subnets]))


@pulumi.runtime.test
def test_eks_cluster_with_security_groups():
    """
    Test EKS cluster with security group configuration.

    Verifies that security groups are properly configured.
    """
    import pulumi_castai as castai

    test_security_groups = [
        "sg-aaaaaaaa",
        "sg-bbbbbbbb",
    ]

    cluster = castai.EksCluster(
        "test-eks-sg",
        account_id="123456789012",
        region="us-west-2",
        name="sg-cluster",
        delete_nodes_on_disconnect=False,
        override_security_groups=test_security_groups,
        subnets=["subnet-test"],
    )

    def check_security_groups(outputs):
        security_groups = outputs[0]

        assert security_groups is not None, "Security groups should not be None"
        assert len(security_groups) == 2, f"Expected 2 security groups, got {len(security_groups)}"
        assert security_groups == test_security_groups, f"Expected {test_security_groups}, got {security_groups}"

    return cluster.override_security_groups.apply(lambda sg: check_security_groups([sg]))


@pulumi.runtime.test
def test_eks_cluster_deletion_behavior():
    """
    Test EKS cluster with different deletion behaviors.

    Verifies that delete_nodes_on_disconnect setting works correctly.
    """
    import pulumi_castai as castai

    # Test with delete_nodes_on_disconnect=True
    cluster_delete = castai.EksCluster(
        "test-eks-delete",
        account_id="123456789012",
        region="us-west-2",
        name="delete-cluster",
        delete_nodes_on_disconnect=True,
        override_security_groups=["sg-test"],
        subnets=["subnet-test"],
    )

    # Test with delete_nodes_on_disconnect=False
    cluster_keep = castai.EksCluster(
        "test-eks-keep",
        account_id="123456789012",
        region="us-west-2",
        name="keep-cluster",
        delete_nodes_on_disconnect=False,
        override_security_groups=["sg-test"],
        subnets=["subnet-test"],
    )

    def check_deletion_settings(outputs):
        delete_setting, keep_setting = outputs

        assert delete_setting is True, "delete_nodes_on_disconnect should be True for cluster_delete"
        assert keep_setting is False, "delete_nodes_on_disconnect should be False for cluster_keep"

    return pulumi.Output.all(
        cluster_delete.delete_nodes_on_disconnect,
        cluster_keep.delete_nodes_on_disconnect,
    ).apply(check_deletion_settings)


@pulumi.runtime.test
def test_eks_cluster_regions():
    """
    Test EKS cluster creation in different AWS regions.

    Verifies that region parameter works correctly.
    """
    import pulumi_castai as castai

    regions_to_test = [
        "us-east-1",
        "us-west-2",
        "eu-west-1",
        "ap-southeast-1",
    ]

    clusters = []
    for i, region in enumerate(regions_to_test):
        cluster = castai.EksCluster(
            f"test-eks-{region}",
            account_id="123456789012",
            region=region,
            name=f"cluster-{region}",
            delete_nodes_on_disconnect=True,
            override_security_groups=["sg-test"],
            subnets=["subnet-test"],
        )
        clusters.append(cluster)

    def check_regions(outputs):
        for i, region in enumerate(regions_to_test):
            cluster_region = outputs[i]
            assert cluster_region == region, f"Expected region '{region}', got '{cluster_region}'"

    return pulumi.Output.all(*[c.region for c in clusters]).apply(check_regions)


@pulumi.runtime.test
def test_eks_cluster_with_assume_role():
    """
    Test EKS cluster with assume_role_arn configuration.

    Verifies that assume role ARN is properly handled.
    """
    import pulumi_castai as castai

    assume_role_arn = "arn:aws:iam::123456789012:role/CastAIRole"

    cluster = castai.EksCluster(
        "test-eks-assume-role",
        account_id="123456789012",
        region="us-west-2",
        name="assume-role-cluster",
        delete_nodes_on_disconnect=True,
        override_security_groups=["sg-test"],
        subnets=["subnet-test"],
        assume_role_arn=assume_role_arn,
    )

    def check_assume_role(outputs):
        role_arn = outputs[0]

        assert role_arn is not None, "Assume role ARN should not be None"
        assert role_arn == assume_role_arn, f"Expected assume role ARN '{assume_role_arn}', got '{role_arn}'"
        assert "arn:aws:iam::" in role_arn, "Assume role should be a valid ARN"

    return cluster.assume_role_arn.apply(lambda arn: check_assume_role([arn]))


@pulumi.runtime.test
def test_eks_cluster_credentials():
    """
    Test that EKS cluster properly handles credentials.

    Verifies that credentials_id is returned.
    """
    import pulumi_castai as castai

    cluster = castai.EksCluster(
        "test-eks-credentials",
        account_id="123456789012",
        region="us-west-2",
        name="creds-cluster",
        delete_nodes_on_disconnect=True,
        override_security_groups=["sg-test"],
        subnets=["subnet-test"],
    )

    def check_credentials(outputs):
        creds_id = outputs[0]

        assert creds_id is not None, "Credentials ID should be returned"
        assert "mock-eks-credentials" in creds_id, "Credentials ID should be mocked"

    return cluster.credentials_id.apply(lambda creds_id: check_credentials([creds_id]))


if __name__ == "__main__":
    """
    Run tests directly with Python (without pytest).

    Usage: python test_eks_cluster.py
    """
    print("Running EKS Cluster Mock Tests...")
    print("=" * 60)

    # Run tests
    tests = [
        ("Cluster Creation", test_eks_cluster_creation),
        ("Multiple Subnets", test_eks_cluster_with_multiple_subnets),
        ("Security Groups", test_eks_cluster_with_security_groups),
        ("Deletion Behavior", test_eks_cluster_deletion_behavior),
        ("Multiple Regions", test_eks_cluster_regions),
        ("Assume Role ARN", test_eks_cluster_with_assume_role),
        ("Credentials Handling", test_eks_cluster_credentials),
    ]

    passed = 0
    failed = 0

    for test_name, test_func in tests:
        try:
            print(f"\n▶ Running: {test_name}")
            test_func()
            print(f"  ✅ PASSED: {test_name}")
            passed += 1
        except Exception as e:
            print(f"  ❌ FAILED: {test_name}")
            print(f"     Error: {e}")
            failed += 1

    print("\n" + "=" * 60)
    print(f"Results: {passed} passed, {failed} failed")
    print("=" * 60)
