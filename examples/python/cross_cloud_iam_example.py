"""
CAST AI Cross-Cloud IAM Example for Python

NOTE: This is a CONCEPTUAL example that demonstrates how IAM configurations might be set up
across different cloud providers with the CAST AI Pulumi provider. The specific IAM resources
used in this example may not be implemented yet in the current version of the provider.

The pattern shown here (using Pydantic models) is the recommended approach once these 
resources become available.
"""

import pulumi
import pulumi_castai as castai
import json
import os
from typing import Dict, List, Optional, Any, Union
from pydantic import BaseModel, Field

# Import the existing Provider model
from models import Provider as ProviderModel

# Initialize the provider with Pydantic model
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider_config = ProviderModel(api_token=api_token)
provider = castai.Provider("castai-provider", 
    api_token=provider_config.api_token,
    api_url=provider_config.api_url
)

# Define Pydantic models for the conceptual IAM resources
# These would move to models.py once the resources are implemented

class AwsIamPolicyConfig(BaseModel):
    """Configuration for AWS IAM policy."""
    account_id: str
    policy_document: str

class AwsIamRoleConfig(BaseModel):
    """Configuration for AWS IAM role."""
    account_id: str
    assume_role_policy_document: str
    attached_policies: List[str]

class AwsIamUserConfig(BaseModel):
    """Configuration for AWS IAM user."""
    account_id: str
    username: str
    policy_arns: List[Any]  # Using Any to handle Output types

class GcpServiceAccountConfig(BaseModel):
    """Configuration for GCP service account."""
    project_id: str
    service_account_id: str
    service_account_name: str
    description: Optional[str] = None

class GcpIamRoleConfig(BaseModel):
    """Configuration for GCP IAM role."""
    project_id: str
    role_name: str
    title: str
    description: Optional[str] = None
    permissions: List[str]

class GcpIamPolicyConfig(BaseModel):
    """Configuration for GCP IAM policy."""
    project_id: str
    policy_json: str

class AzureIamRoleConfig(BaseModel):
    """Configuration for Azure IAM role."""
    subscription_id: str
    role_name: str
    role_definition: str

class AzureServicePrincipalConfig(BaseModel):
    """Configuration for Azure service principal."""
    tenant_id: str
    client_id: str
    client_secret: Any  # Using Any for secret values
    subscription_id: str
    role_definition_id: str

# --- AWS IAM Configuration ---
# Placeholder values - replace with actuals or config
aws_account_id = "123456789012"
# Placeholder for a cluster ID (needed for AssumeRole policy)
aws_cluster_id_output = pulumi.Output.from_input("dummy-eks-cluster-id") # Replace with actual cluster.id

aws_policy_doc = json.dumps({
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": [
            "ec2:DescribeInstances", "ec2:RunInstances", "ec2:TerminateInstances",
            "ec2:CreateTags", "iam:PassRole", "eks:DescribeCluster"
        ],
        "Resource": "*"
    }]
})

aws_assume_role_policy_doc = pulumi.Output.all(aws_cluster_id_output).apply(lambda args: json.dumps({
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "castai.amazonaws.com"},
        "Action": "sts:AssumeRole",
        "Condition": {"StringEquals": {"sts:ExternalId": args[0]}} # Use cluster ID here
    }]
}))

# Using Pydantic models for configuration
aws_policy_config = AwsIamPolicyConfig(
    account_id=aws_account_id,
    policy_document=aws_policy_doc
)

# Uncomment when implemented:
# aws_iam_policy = castai.aws.IamPolicy("aws-py-iam-policy", 
#     **aws_policy_config.dict(exclude_none=True),
#     opts=pulumi.ResourceOptions(provider=provider)
# )

# For demonstration purposes only (create a dummy output)
aws_iam_policy = pulumi.Output.from_input({"arn": "arn:aws:iam::123456789012:policy/castai-example"})

# Note: For AWS IAM Role, we need to apply a conversion because the policy document is a pulumi.Output
def create_role_config(account_id, policy_doc, policy_arn):
    return AwsIamRoleConfig(
        account_id=account_id,
        assume_role_policy_document=policy_doc,
        attached_policies=[policy_arn]
    )

# This will be applied once the Output is resolved
aws_role_config_future = pulumi.Output.all(aws_assume_role_policy_doc, aws_iam_policy.arn).apply(
    lambda args: create_role_config(aws_account_id, args[0], args[1]).dict(exclude_none=True)
)

# Uncomment when implemented:
# aws_iam_role = castai.aws.IamRole("aws-py-iam-role", 
#     **aws_role_config_future,
#     opts=pulumi.ResourceOptions(provider=provider)
# )

# For demonstration purposes only (create a dummy output)
aws_iam_role = pulumi.Output.from_input({"arn": "arn:aws:iam::123456789012:role/castai-example"})

# We need to handle the Output type for policy_arns
# Either by using a function with Output.all or by modifying the Pydantic model to accept Any
def create_user_config(account_id, username, policy_arns):
    return AwsIamUserConfig(
        account_id=account_id,
        username=username,
        policy_arns=policy_arns
    )

aws_user_config_future = pulumi.Output.all(aws_iam_policy.arn).apply(
    lambda args: create_user_config(
        aws_account_id,
        "castai-py-automation",
        [args[0]]
    ).dict(exclude_none=True)
)

# Uncomment when implemented:
# aws_iam_user = castai.aws.IamUser("aws-py-iam-user", 
#     **aws_user_config_future,
#     opts=pulumi.ResourceOptions(provider=provider)
# )

# For demonstration purposes only (create a dummy output)
aws_iam_user = pulumi.Output.from_input({"username": "castai-py-automation"})

# --- GCP IAM Configuration ---
# Placeholder values
gcp_project_id = "my-gcp-project"
gcp_sa_id = "castai-py-sa"
gcp_role_id = "castaiPyClusterManager"

gcp_sa_config = GcpServiceAccountConfig(
    project_id=gcp_project_id,
    service_account_id=gcp_sa_id,
    service_account_name="CAST AI Py Service Account",
    description="Service account for CAST AI Python example"
)

# Uncomment when implemented:
# gcp_service_account = castai.gcp.ServiceAccount("gcp-py-service-account", 
#     **gcp_sa_config.dict(exclude_none=True),
#     opts=pulumi.ResourceOptions(provider=provider)
# )

# For demonstration purposes only (create a dummy output)
gcp_service_account = pulumi.Output.from_input({
    "email": f"{gcp_sa_id}@{gcp_project_id}.iam.gserviceaccount.com",
    "service_account_id": gcp_sa_id
})

gcp_role_config = GcpIamRoleConfig(
    project_id=gcp_project_id,
    role_name=gcp_role_id,
    title="CAST AI Py Cluster Manager",
    description="Role for CAST AI Python example",
    permissions=[
        "container.clusters.get", "container.clusters.list", "container.clusters.update",
        "container.operations.get", "container.operations.list", "compute.instances.create",
        "compute.instances.delete", "compute.instances.get", "compute.instances.list",
        "compute.instances.setMetadata", "compute.instances.setTags"
    ]
)

# Uncomment when implemented:
# gcp_iam_role = castai.gcp.IamRole("gcp-py-iam-role", 
#     **gcp_role_config.dict(exclude_none=True),
#     opts=pulumi.ResourceOptions(provider=provider)
# )

# For demonstration purposes only (create a dummy output)
gcp_iam_role = pulumi.Output.from_input({"role_name": gcp_role_id})

# Similar to AWS IAM Role, we need to handle Outputs for GCP policy
def create_gcp_policy_config(project_id, policy_json):
    return GcpIamPolicyConfig(
        project_id=project_id,
        policy_json=policy_json
    )

# Construct policy binding JSON using Outputs
gcp_policy_doc = pulumi.Output.all(gcp_iam_role.role_name, gcp_service_account.service_account_id).apply(
    lambda args: json.dumps({
        "bindings": [{
            "role": f"projects/{gcp_project_id}/roles/{args[0]}",
            "members": [f"serviceAccount:{args[1]}@{gcp_project_id}.iam.gserviceaccount.com"]
        }]
    })
)

gcp_policy_config_future = gcp_policy_doc.apply(
    lambda doc: create_gcp_policy_config(gcp_project_id, doc).dict(exclude_none=True)
)

# Uncomment when implemented:
# gcp_iam_policy = castai.gcp.IamPolicy("gcp-py-iam-policy", 
#     **gcp_policy_config_future,
#     opts=pulumi.ResourceOptions(provider=provider)
# )

# For demonstration purposes only (create a dummy output)
gcp_iam_policy = pulumi.Output.from_input({"id": "dummy-policy-id"})

# --- Azure IAM Configuration ---
# Placeholder values
azure_subscription_id = "00000000-0000-0000-0000-000000000000"
azure_tenant_id = "00000000-0000-0000-0000-000000000000"
azure_role_name = "CastAIPyClusterManager"
azure_client_id = "00000000-0000-0000-0000-000000000001" # Example Client ID

config = pulumi.Config()
azure_client_secret = config.require_secret("azureClientSecret") # Get secret from config

azure_role_def = json.dumps({
    "name": azure_role_name,
    "description": "Role for CAST AI Python example (Azure)",
    "assignableScopes": [f"/subscriptions/{azure_subscription_id}"],
    "permissions": [{
        "actions": [
            "Microsoft.ContainerService/managedClusters/read", "Microsoft.ContainerService/managedClusters/write",
            "Microsoft.ContainerService/managedClusters/agentPools/read", "Microsoft.ContainerService/managedClusters/agentPools/write",
            "Microsoft.Compute/virtualMachines/read", "Microsoft.Compute/virtualMachines/write", "Microsoft.Compute/virtualMachines/delete",
            "Microsoft.Compute/disks/read", "Microsoft.Compute/disks/write", "Microsoft.Compute/disks/delete",
            "Microsoft.Network/networkInterfaces/read", "Microsoft.Network/networkInterfaces/write", "Microsoft.Network/networkInterfaces/delete"
        ],
        "notActions": [],
    }],
})

azure_role_config = AzureIamRoleConfig(
    subscription_id=azure_subscription_id,
    role_name=azure_role_name,
    role_definition=azure_role_def
)

# Uncomment when implemented:
# azure_iam_role = castai.azure.IamRole("azure-py-iam-role", 
#     **azure_role_config.dict(exclude_none=True),
#     opts=pulumi.ResourceOptions(provider=provider)
# )

# For demonstration purposes only (create a dummy output)
azure_iam_role = pulumi.Output.from_input({"id": "dummy-role-id", "role_name": azure_role_name})

def create_azure_sp_config(tenant_id, client_id, client_secret, subscription_id, role_def_id):
    return AzureServicePrincipalConfig(
        tenant_id=tenant_id,
        client_id=client_id,
        client_secret=client_secret,
        subscription_id=subscription_id,
        role_definition_id=role_def_id
    )

azure_sp_config_future = pulumi.Output.all(azure_iam_role.id).apply(
    lambda args: create_azure_sp_config(
        azure_tenant_id, 
        azure_client_id, 
        azure_client_secret, 
        azure_subscription_id, 
        args[0]
    ).dict(exclude_none=True)
)

# Uncomment when implemented:
# azure_service_principal = castai.azure.ServicePrincipal("azure-py-service-principal", 
#     **azure_sp_config_future,
#     opts=pulumi.ResourceOptions(provider=provider)
# )

# For demonstration purposes only (create a dummy output)
azure_service_principal = pulumi.Output.from_input({"client_id": azure_client_id})

# Exports - these will return dummy values until fully implemented
pulumi.export("aws_py_role_arn", aws_iam_role.arn)
pulumi.export("aws_py_username", aws_iam_user.username)
pulumi.export("gcp_py_sa_email", gcp_service_account.email)
pulumi.export("gcp_py_role_name", gcp_iam_role.role_name)
pulumi.export("azure_py_role_name", azure_iam_role.role_name)
pulumi.export("azure_py_client_id", azure_service_principal.client_id) 