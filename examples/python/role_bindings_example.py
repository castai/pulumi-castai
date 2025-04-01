"""
CAST AI Role Bindings Example for Python

This example demonstrates how to configure role bindings in CAST AI.
"""

import pulumi
import pulumi_castai as castai
import os
from typing import Dict, List, Optional, Any, Literal
from pydantic import BaseModel, Field

# Import the CAST AI provider and models
from models import Provider as ProviderModel

# Initialize the CAST AI provider
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
provider_config = ProviderModel(api_token=api_token)
provider = castai.Provider("castai-provider",
    api_token=provider_config.api_token,
    api_url=provider_config.api_url
)

# Pydantic models for Role Bindings
class RoleBindingScope(BaseModel):
    """Scope for a role binding."""
    kind: Literal["organization", "cluster"]
    resource_id: str

class RoleBindingSubject(BaseModel):
    """Subject for a role binding."""
    kind: Literal["user", "group", "service_account"]
    user_id: Optional[str] = None
    group_id: Optional[str] = None
    service_account_id: Optional[str] = None

class RoleBindingModel(BaseModel):
    """Configuration for a role binding."""
    organization_id: str
    name: str
    description: Optional[str] = None
    role_id: str
    scope: RoleBindingScope
    subjects: List[RoleBindingSubject]

# Placeholder: Replace with actual IDs
org_id = "your-castai-org-id" # Can be fetched using get_organization data source
cluster_id = "your-cluster-id"
owner_role_id = "3e1050c7-6593-4298-94bb-154637911d78" # From TF example
viewer_role_id = "6fc95bd7-6049-4735-80b0-ce5ccde71cb1" # From TF example
user_id_1 = "user-id-1"
user_id_2 = "user-id-2"
group_id = "group-id-1"
service_account_id = "service-account-id-1"

# Create organization owner binding model
org_owner_binding_model = RoleBindingModel(
    organization_id=org_id,
    name="Organization Owner Binding",
    description="Assigns Owner role at the organization scope",
    role_id=owner_role_id,
    scope=RoleBindingScope(
        kind="organization",
        resource_id=org_id,
    ),
    subjects=[
        RoleBindingSubject(kind="user", user_id=user_id_1),
        RoleBindingSubject(kind="group", group_id=group_id),
        RoleBindingSubject(kind="service_account", service_account_id=service_account_id),
    ]
)

# Create cluster viewer binding model
cluster_viewer_binding_model = RoleBindingModel(
    organization_id=org_id, # Still need org ID context
    name="Cluster Viewer Binding",
    description=f"Assigns Viewer role scoped to cluster {cluster_id}",
    role_id=viewer_role_id,
    scope=RoleBindingScope(
        kind="cluster",
        resource_id=cluster_id,
    ),
    subjects=[
        RoleBindingSubject(kind="user", user_id=user_id_2),
    ]
)

# Convert models to dictionaries
org_owner_args = org_owner_binding_model.dict(exclude_none=True)
cluster_viewer_args = cluster_viewer_binding_model.dict(exclude_none=True)

# Create resources with proper error handling
try:
    # Create organization owner binding using direct type
    org_owner_binding = castai.RoleBindings(
        "org-owner-binding",
        **org_owner_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )
    
    # Create cluster viewer binding using direct type
    cluster_viewer_binding = castai.RoleBindings(
        "cluster-viewer-binding",
        **cluster_viewer_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )
    
    # Export the IDs of the created bindings
    pulumi.export("org_owner_binding_id", org_owner_binding.id)
    pulumi.export("cluster_viewer_binding_id", cluster_viewer_binding.id)
except Exception as e:
    pulumi.log.warn(f"Failed to create role bindings: {str(e)}")
    # Export the configurations as demonstration
    pulumi.export("org_owner_binding_config", org_owner_args)
    pulumi.export("cluster_viewer_binding_config", cluster_viewer_args)
    pulumi.export("provider_configured", True) 