"""
Pytest configuration and shared fixtures for CAST AI Pulumi tests.

This file is automatically loaded by pytest and provides shared
test configuration and fixtures.
"""

import pytest
import pulumi


class CastAIMocks(pulumi.runtime.Mocks):
    """
    Shared mock implementation for CAST AI resources across all tests.

    This provides consistent mocking behavior for all test files.
    """

    def new_resource(self, args: pulumi.runtime.MockResourceArgs):
        """
        Mock resource creation for all CAST AI and cloud provider resources.
        """
        outputs = dict(args.inputs)

        # CAST AI Resources
        if args.typ == "castai:aws:EksCluster":
            outputs.update({
                "id": f"{args.name}-cluster-id-{hash(args.name) % 1000}",
                "agent_token": f"mock-eks-token-{hash(args.name) % 1000}",  # EKS uses agent_token
                "credentials_id": f"mock-credentials-{hash(args.name) % 1000}",
            })

        elif args.typ == "castai:gcp:GkeCluster":
            outputs.update({
                "id": f"{args.name}-cluster-id-{hash(args.name) % 1000}",
                "cluster_token": f"mock-gke-token-{hash(args.name) % 1000}",
                "credentials_id": f"mock-credentials-{hash(args.name) % 1000}",
            })

        elif args.typ == "castai:azure:AksCluster":
            outputs.update({
                "id": f"{args.name}-cluster-id-{hash(args.name) % 1000}",
                "cluster_token": f"mock-aks-token-{hash(args.name) % 1000}",
                "credentials_id": f"mock-credentials-{hash(args.name) % 1000}",
            })

        elif args.typ == "castai:autoscaling:Autoscaler":
            outputs.update({
                "id": f"{args.name}-autoscaler-id-{hash(args.name) % 1000}",
            })

        elif args.typ == "castai:nodeconfig:NodeConfiguration":
            outputs.update({
                "id": f"{args.name}-nodeconfig-id-{hash(args.name) % 1000}",
            })

        # AWS Resources
        elif args.typ == "aws:iam/role:Role":
            outputs.update({
                "id": f"{args.name}-role-id",
                "arn": f"arn:aws:iam::123456789012:role/{args.name}",
                "unique_id": "AIDACKCEVSQ6C2EXAMPLE",
            })

        elif args.typ == "aws:ec2/securityGroup:SecurityGroup":
            outputs.update({
                "id": f"sg-{hash(args.name) % 100000000}",
                "arn": f"arn:aws:ec2:us-west-2:123456789012:security-group/sg-{args.name}",
            })

        elif args.typ == "aws:ec2/subnet:Subnet":
            outputs.update({
                "id": f"subnet-{hash(args.name) % 100000000}",
                "availability_zone": "us-west-2a",
            })

        # GCP Resources
        elif args.typ == "gcp:serviceaccount/account:Account":
            project = args.inputs.get("project", "project")
            account_id = args.inputs.get("account_id", "castai")
            outputs.update({
                "id": f"{args.name}-sa-id",
                "email": f"{account_id}@{project}.iam.gserviceaccount.com",
                "unique_id": f"{hash(args.name) % 1000000000000000000}",
            })

        elif args.typ == "gcp:serviceaccount/key:Key":
            outputs.update({
                "id": f"{args.name}-key-id",
                "private_key": "mock-private-key-base64-encoded-data",
                "public_key": "mock-public-key-data",
            })

        elif args.typ == "gcp:projects/iAMMember:IAMMember":
            outputs.update({
                "id": f"{args.name}-iam-id",
                "etag": f"mock-etag-{hash(args.name)}",
            })

        # Azure Resources
        elif args.typ == "azure:authorization/assignment:Assignment":
            outputs.update({
                "id": f"/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/roleAssignments/{args.name}",
            })

        # Providers
        elif args.typ.startswith("pulumi:providers:"):
            pass  # Providers don't need special outputs

        # Default
        return [f"{args.name}-id", outputs]

    def call(self, args: pulumi.runtime.MockCallArgs):
        """
        Mock data source and function calls.
        """
        if args.token == "aws:getCallerIdentity:getCallerIdentity":
            return {
                "account_id": "123456789012",
                "arn": "arn:aws:iam::123456789012:user/test-user",
                "user_id": "AIDACKCEVSQ6C2EXAMPLE",
            }

        if args.token == "aws:ec2/getSubnets:getSubnets":
            return {
                "ids": ["subnet-12345678", "subnet-87654321"],
            }

        if args.token == "gcp:compute/getZones:getZones":
            return {
                "names": ["us-central1-a", "us-central1-b", "us-central1-c"],
            }

        if args.token == "azure:core/getSubscription:getSubscription":
            return {
                "subscription_id": "00000000-0000-0000-0000-000000000000",
                "display_name": "Test Subscription",
            }

        return {}


@pytest.fixture(scope="session", autouse=True)
def setup_mocks():
    """
    Automatically set up mocks for all tests.

    This fixture runs once per test session and enables mocking
    for all Pulumi resource operations.
    """
    pulumi.runtime.set_mocks(CastAIMocks())
    yield


@pytest.fixture
def mock_gcp_project():
    """Fixture providing a mock GCP project ID."""
    return "test-project-123456"


@pytest.fixture
def mock_aws_account():
    """Fixture providing a mock AWS account ID."""
    return "123456789012"


@pytest.fixture
def mock_azure_subscription():
    """Fixture providing a mock Azure subscription ID."""
    return "00000000-0000-0000-0000-000000000000"
