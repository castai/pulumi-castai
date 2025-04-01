"""
CAST AI Organization Example for Python

This example demonstrates how to manage organization members and groups with CAST AI.
"""

import pulumi
import pulumi_castai as castai
import os
from typing import Dict, List, Optional, Any
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

# Pydantic models for Organization resources
class OrganizationMember(BaseModel):
    """Organization member configuration."""
    email: str
    role: str

class OrganizationMembers(BaseModel):
    """Full organization members configuration."""
    members: List[OrganizationMember]

class OrganizationGroup(BaseModel):
    """Organization group configuration."""
    name: str
    description: Optional[str] = None
    member_emails: List[str]

# Create organization members configuration
org_members_model = OrganizationMembers(
    members=[
        OrganizationMember(
            email="admin.user@example.com",
            role="admin",
        ),
        OrganizationMember(
            email="dev.user@example.com",
            role="editor",
        ),
         OrganizationMember(
            email="view.user@example.com",
            role="viewer",
        ),
    ]
)

# Create organization group configuration
org_group_model = OrganizationGroup(
    name="DevOps Team",
    description="Group for DevOps engineers managing infrastructure",
    member_emails=[
        "devops1@example.com",
        "devops2@example.com",
        # You can add users who might also be managed directly above,
        # group membership is additive.
        "dev.user@example.com",
    ]
)

# Convert models to dictionaries
org_members_args = org_members_model.dict(exclude_none=True)
org_group_args = org_group_model.dict(exclude_none=True)

# Create resources with proper error handling
try:
    # Using direct Members resource
    org_members = castai.Members(
        "example-org-members",
        **org_members_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )
    
    # Using direct Group resource
    org_group = castai.Group(
        "example-devops-group",
        **org_group_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )
    
    # Export the group information
    pulumi.export("org_group_id", org_group.id)
    pulumi.export("org_group_name", org_group_model.name)
    
except Exception as e:
    pulumi.log.warn(f"Failed to create organization resources: {str(e)}")
    # Export the models as demonstration
    pulumi.export("org_members_model", org_members_args)
    pulumi.export("org_group_model", org_group_args)
    pulumi.export("provider_configured", True)

# Note: For managing members, this Members resource provides a declarative
# way to set the *entire* list of members per role.
# Use with caution, as it will overwrite existing members not specified here.

# Similarly, the Group resource manages the member list declaratively. 