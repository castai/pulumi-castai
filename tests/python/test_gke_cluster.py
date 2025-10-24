"""
Mock Tests for CAST AI GKE Cluster Creation

These tests use Pulumi's built-in mocking to test GKE cluster creation
without making actual API calls to CAST AI or GCP.

Run with: pytest test_gke_cluster.py -v
"""

import pytest
import pulumi
from typing import Optional, Any


class CastAIMocks(pulumi.runtime.Mocks):
    """
    Mock implementation for CAST AI and GCP resources.

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
        if args.typ == "castai:gcp:GkeCluster":
            # Mock GKE cluster outputs
            outputs.update({
                "id": f"{args.name}-cluster-id-123",
                "cluster_token": "mock-cluster-token-xyz789",
                "credentials_id": "mock-credentials-abc456",
            })
            return [f"{args.name}-id", outputs]

        elif args.typ == "gcp:serviceaccount/account:Account":
            # Mock GCP service account
            outputs.update({
                "id": f"{args.name}-sa-id",
                "email": f"{args.inputs.get('account_id', 'castai')}@{args.inputs.get('project', 'project')}.iam.gserviceaccount.com",
                "unique_id": "123456789012345678",
            })
            return [f"{args.name}-sa-id", outputs]

        elif args.typ == "gcp:projects/iAMMember:IAMMember":
            # Mock GCP IAM member
            outputs.update({
                "id": f"{args.name}-iam-id",
                "etag": "mock-etag-123",
            })
            return [f"{args.name}-iam-id", outputs]

        elif args.typ == "gcp:serviceaccount/key:Key":
            # Mock service account key
            outputs.update({
                "id": f"{args.name}-key-id",
                "private_key": "mock-private-key-base64-encoded-data",
                "public_key": "mock-public-key-data",
            })
            return [f"{args.name}-key-id", outputs]

        elif args.typ == "pulumi:providers:castai":
            # Mock CAST AI provider
            return [f"{args.name}-provider", outputs]

        elif args.typ == "pulumi:providers:gcp":
            # Mock GCP provider
            return [f"{args.name}-provider", outputs]

        else:
            # Default: return the inputs as outputs
            return [f"{args.name}-id", outputs]

    def call(self, args: pulumi.runtime.MockCallArgs):
        """
        Mock function/data source calls.

        Returns mock data for data sources and function calls.
        """
        if args.token == "gcp:compute/getZones:getZones":
            # Mock GCP zones
            return {
                "names": ["us-central1-a", "us-central1-b", "us-central1-c"],
            }

        # Default: return empty
        return {}


# Set up mocks before any tests run
pulumi.runtime.set_mocks(CastAIMocks())


@pulumi.runtime.test
def test_gke_cluster_creation():
    """
    Test creating a GKE cluster with CAST AI.

    Verifies that:
    - Cluster is created with correct configuration
    - Cluster ID is generated
    - Cluster token is returned
    """
    import pulumi_castai as castai

    # Create a mock GKE cluster
    cluster = castai.GkeCluster(
        "test-gke-cluster",
        project_id="test-project-123",
        location="us-central1",
        name="my-gke-cluster",
        delete_nodes_on_disconnect=True,
        credentials_json="mock-credentials-json",
    )

    # Verify the outputs
    def check_outputs(outputs):
        cluster_id, cluster_name, cluster_token, project_id = outputs

        # Assertions
        assert cluster_id is not None, "Cluster ID should not be None"
        assert "cluster-id" in cluster_id, "Cluster ID should contain 'cluster-id'"

        assert cluster_name == "my-gke-cluster", f"Expected cluster name 'my-gke-cluster', got '{cluster_name}'"

        assert cluster_token is not None, "Cluster token should not be None"
        assert "mock-cluster-token" in cluster_token, "Cluster token should be mocked"

        assert project_id == "test-project-123", f"Expected project_id 'test-project-123', got '{project_id}'"

    return pulumi.Output.all(
        cluster.id,
        cluster.name,
        cluster.cluster_token,
        cluster.project_id,
    ).apply(check_outputs)


@pulumi.runtime.test
def test_gke_cluster_with_tags():
    """
    Test creating a GKE cluster with custom tags.

    Verifies that tags are properly passed through.
    """
    import pulumi_castai as castai

    # Create cluster with tags
    cluster = castai.GkeCluster(
        "test-gke-cluster-tags",
        project_id="test-project-456",
        location="us-central1",
        name="tagged-cluster",
        delete_nodes_on_disconnect=False,
        credentials_json="mock-creds",
        tags={
            "environment": "production",
            "team": "platform",
            "cost-center": "engineering",
        },
    )

    # Verify tags
    def check_tags(outputs):
        tags = outputs[0]

        assert tags is not None, "Tags should not be None"
        assert tags.get("environment") == "production", "Environment tag should be 'production'"
        assert tags.get("team") == "platform", "Team tag should be 'platform'"
        assert tags.get("cost-center") == "engineering", "Cost center tag should be 'engineering'"

    return cluster.tags.apply(lambda tags: check_tags([tags]))


@pulumi.runtime.test
def test_gke_cluster_deletion_behavior():
    """
    Test GKE cluster with different deletion behaviors.

    Verifies that delete_nodes_on_disconnect setting works correctly.
    """
    import pulumi_castai as castai

    # Test with delete_nodes_on_disconnect=True
    cluster_delete = castai.GkeCluster(
        "test-gke-delete",
        project_id="test-project",
        location="us-west1",
        name="delete-cluster",
        delete_nodes_on_disconnect=True,
        credentials_json="mock-creds",
    )

    # Test with delete_nodes_on_disconnect=False
    cluster_keep = castai.GkeCluster(
        "test-gke-keep",
        project_id="test-project",
        location="us-west1",
        name="keep-cluster",
        delete_nodes_on_disconnect=False,
        credentials_json="mock-creds",
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
def test_gke_cluster_locations():
    """
    Test GKE cluster creation in different locations.

    Verifies that location parameter works correctly.
    """
    import pulumi_castai as castai

    locations_to_test = [
        "us-central1",
        "us-east1",
        "europe-west1",
        "asia-southeast1",
    ]

    clusters = []
    for i, location in enumerate(locations_to_test):
        cluster = castai.GkeCluster(
            f"test-gke-{location}",
            project_id="test-project",
            location=location,
            name=f"cluster-{location}",
            delete_nodes_on_disconnect=True,
            credentials_json="mock-creds",
        )
        clusters.append(cluster)

    def check_locations(outputs):
        for i, location in enumerate(locations_to_test):
            cluster_location = outputs[i]
            assert cluster_location == location, f"Expected location '{location}', got '{cluster_location}'"

    return pulumi.Output.all(*[c.location for c in clusters]).apply(check_locations)


@pulumi.runtime.test
def test_gke_cluster_credentials():
    """
    Test that GKE cluster properly handles credentials.

    Verifies that credentials_json is passed and credentials_id is returned.
    """
    import pulumi_castai as castai

    test_credentials = '{"type": "service_account", "project_id": "test"}'

    cluster = castai.GkeCluster(
        "test-gke-credentials",
        project_id="test-project",
        location="us-central1",
        name="creds-cluster",
        delete_nodes_on_disconnect=True,
        credentials_json=test_credentials,
    )

    def check_credentials(outputs):
        creds_json, creds_id = outputs

        assert creds_json == test_credentials, "Credentials JSON should match input"
        assert creds_id is not None, "Credentials ID should be returned"
        assert "mock-credentials" in creds_id, "Credentials ID should be mocked"

    return pulumi.Output.all(
        cluster.credentials_json,
        cluster.credentials_id,
    ).apply(check_credentials)


if __name__ == "__main__":
    """
    Run tests directly with Python (without pytest).

    Usage: python test_gke_cluster.py
    """
    print("Running GKE Cluster Mock Tests...")
    print("=" * 60)

    # Run tests
    tests = [
        ("Cluster Creation", test_gke_cluster_creation),
        ("Cluster with Tags", test_gke_cluster_with_tags),
        ("Deletion Behavior", test_gke_cluster_deletion_behavior),
        ("Multiple Locations", test_gke_cluster_locations),
        ("Credentials Handling", test_gke_cluster_credentials),
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
