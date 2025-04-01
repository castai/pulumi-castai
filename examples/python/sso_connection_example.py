"""
CAST AI SSO Connection Example for Python

This example demonstrates how to configure Single Sign-On (SSO) connections with CAST AI.
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

# Pydantic models for SSO Connection
class AadConfig(BaseModel):
    """Azure AD configuration for SSO connection."""
    client_id: str
    client_secret: Any  # Any to handle secret values
    ad_domain: str

class SamlConfig(BaseModel):
    """SAML configuration for SSO connection."""
    idp_metadata_url: Optional[str] = None
    # Add other SAML fields as needed

class SSOConnectionModel(BaseModel):
    """Configuration for an SSO connection."""
    name: str
    email_domain: str
    additional_email_domains: Optional[List[str]] = None
    aad: Optional[AadConfig] = None
    saml: Optional[SamlConfig] = None

# Placeholder: Replace with actual Azure AD application details
# These would typically come from Pulumi config or other resources
azure_ad_client_id = "your-azure-ad-client-id"
# Use Pulumi config for secrets like the client secret
config = pulumi.Config()
azure_ad_client_secret = config.require_secret("azureAdClientSecret")
azure_ad_domain = "your-organization.onmicrosoft.com"
primary_email_domain = "your-organization.com" # Your org's email domain

# Create an SSO connection model for Azure AD
sso_connection_model = SSOConnectionModel(
    name="AzureAD-SSO", # A descriptive name for the connection in CAST AI
    email_domain=primary_email_domain,
    # Optional: Add other domains if needed
    # additional_email_domains=["secondary.com"],

    # Configuration specific to Azure AD
    aad=AadConfig(
        client_id=azure_ad_client_id,
        client_secret=azure_ad_client_secret,
        ad_domain=azure_ad_domain,
    )
    # You might also configure SAML/other providers instead of AAD
    # saml=SamlConfig(idp_metadata_url="...")
)

# Convert model to dictionary, handling possible secrets
# Need a special approach since we have a secret value
def get_sso_connection_args():
    # First get the regular model as a dict
    model_dict = sso_connection_model.dict(exclude_none=True)
    
    # Extract any secrets for proper handling
    if 'aad' in model_dict and model_dict['aad'].get('client_secret'):
        # Ensure client_secret is properly passed as a secret
        client_secret = model_dict['aad']['client_secret']
        # Handle different types (str, Output, etc.)
        model_dict['aad']['client_secret'] = client_secret
    
    return model_dict

# Create resources with proper error handling
try:
    # Get the args dictionary
    sso_args = get_sso_connection_args()
    
    # Create SSO connection using direct type
    sso_connection = castai.SSOConnection(
        "example-azure-sso",
        **sso_args,
        opts=pulumi.ResourceOptions(provider=provider)
    )
    
    # Export the ID of the created SSO Connection
    pulumi.export("sso_connection_id", sso_connection.id)
    # Export the SSO URL provided by CAST AI (if available)
    pulumi.export("sso_connection_name", sso_connection_model.name)
except Exception as e:
    pulumi.log.warn(f"Failed to create SSO connection: {str(e)}")
    # Export the model for demonstration
    pulumi.export("sso_connection_config", {"name": sso_connection_model.name, "domain": sso_connection_model.email_domain})
    pulumi.export("provider_configured", True) 