"""
CAST AI Service Account Example for Python

This example demonstrates how to create and manage service accounts in CAST AI.
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

# Pydantic models for Service Account resources
class ServiceAccountModel(BaseModel):
    """Configuration for a service account."""
    name: str
    description: Optional[str] = None
    roles: List[str]
    ttl: Optional[str] = None

class ServiceAccountKeyModel(BaseModel):
    """Configuration for a service account key."""
    service_account_id: Any  # Any to handle Output type
    description: Optional[str] = None

# Create a service account model
service_account_model = ServiceAccountModel(
    name="ci-cd-py-automation",
    description="Service account for Python CI/CD pipeline",
    # Roles might be predefined strings or specific IDs
    roles=["admin", "viewer"],
    # ttl="8760h",  # Optional TTL (e.g., 1 year)
)

# Convert service account model to dictionary
sa_args = service_account_model.dict(exclude_none=True)

# Create resources with proper error handling
try:
    # Create service account using the direct type
    service_account = castai.ServiceAccount(
        "example-py-sa",
        **sa_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )
    
    # Create a dictionary with the service account key configuration
    sa_key_args = {
        "service_account_id": service_account.id,
        "description": "API key for Python CI/CD integration"
    }
    
    # Create the service account key using the direct type
    service_account_key = castai.ServiceAccountKey(
        "example-py-sa-key",
        **sa_key_args,
        opts=pulumi.ResourceOptions(
            provider=provider,
            depends_on=[service_account]  # Explicitly set dependency
        )
    )
    
    # Export relevant details
    pulumi.export("service_account_py_id", service_account.id)
    pulumi.export("service_account_py_name", service_account_model.name)
    
    # The token might not be directly accessible with this approach
    # For safety, we'll provide a warning that it needs to be handled
    pulumi.export("service_account_key_py_notes", "Token available in the CAST AI console")
except Exception as e:
    pulumi.log.warn(f"Failed to create service account resources: {str(e)}")
    # Export the model as demonstration
    pulumi.export("service_account_model", sa_args)
    pulumi.export("provider_configured", True) 