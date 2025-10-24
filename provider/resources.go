// Copyright 2016-2023, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package castai

import (
	"fmt"
	"path/filepath"
	"unicode"

	"github.com/castai/terraform-provider-castai/castai"
	"github.com/pulumi/pulumi-terraform-bridge/v3/pkg/tfbridge"
	shimv2 "github.com/pulumi/pulumi-terraform-bridge/v3/pkg/tfshim/sdk-v2"
	"github.com/pulumi/pulumi/sdk/v3/go/common/resource"
	"github.com/pulumi/pulumi/sdk/v3/go/common/tokens"

	"github.com/castai/pulumi-castai/provider/pkg/version"
)

// all of the token components used below.
const (
	// This variable controls the default name of the package in the package
	// registries for nodejs and python:
	mainPkg = "castai"
	// modules:
	mainMod         = "index" // the castai module
	awsMod          = "aws"   // AWS specific resources
	gcpMod          = "gcp"   // GCP specific resources
	azureMod        = "azure" // Azure specific resources
	iamMod          = "iam"   // IAM related resources
	autoscalingMod  = "autoscaling"
	organizationMod = "organization"
	nodeConfigMod   = "nodeconfig"
	rebalancingMod  = "rebalancing"
	workloadMod     = "workload"
)

// preConfigureCallback is called before the provider is configured with
// the configured provider resource.
func preConfigureCallback(vars resource.PropertyMap, c interface{}) error {
	return nil
}

// Provider returns additional overlaid schema and metadata associated with the provider.
func Provider() tfbridge.ProviderInfo {
	p := shimv2.NewProvider(castai.Provider(version.Version))

	// Create a Pulumi provider mapping
	prov := tfbridge.ProviderInfo{
		P:                 p,
		Name:              "castai",
		DisplayName:       "CAST AI",
		Publisher:         "CAST AI",
		LogoURL:           "https://raw.githubusercontent.com/castai/pulumi-castai/main/docs/images/castai-logo.png",
		PluginDownloadURL: "github://api.github.com/castai",
		Description:       "A Pulumi package for creating and managing CAST AI cloud resources.",
		Keywords:          []string{"pulumi", "castai", "kubernetes", "category/cloud"},
		License:           "Apache-2.0",
		Homepage:          "https://cast.ai",
		Repository:        "https://github.com/castai/pulumi-castai",
		GitHubOrg:         "castai",
		Version:           version.Version,
		Config: map[string]*tfbridge.SchemaInfo{
			// Add any required configuration here
			"api_token": {
				Default: &tfbridge.DefaultInfo{
					EnvVars: []string{"CASTAI_API_TOKEN"},
				},
				Secret: tfbridge.BoolRef(true),
			},
			"api_url": {
				Default: &tfbridge.DefaultInfo{
					Value:   "https://api.cast.ai",
					EnvVars: []string{"CASTAI_API_URL"},
				},
			},
		},
		PreConfigureCallback: nil,
		Resources: map[string]*tfbridge.ResourceInfo{
			// Core Resources
			"castai_eks_cluster":    {Tok: awsResource(awsMod, "EksCluster")},
			"castai_gke_cluster":    {Tok: gcpResource(gcpMod, "GkeCluster")},
			"castai_aks_cluster":    {Tok: azureResource(azureMod, "AksCluster")},
			"castai_cluster":        {Tok: castaiResource(mainMod, "Cluster")},
			"castai_credentials":    {Tok: castaiResource(mainMod, "Credentials")},
			"castai_cluster_token":  {Tok: castaiResource(mainMod, "ClusterToken")},

			// Autoscaling resources
			"castai_autoscaler": {
				Tok: castaiResource(autoscalingMod, "Autoscaler"),
				Fields: map[string]*tfbridge.SchemaInfo{
					"cluster_id": {
						Name: "clusterId",
					},
				},
			},

			// Node Configuration resources
			"castai_node_configuration":         {Tok: castaiResource(nodeConfigMod, "NodeConfiguration")},
			"castai_node_configuration_default": {Tok: castaiResource(nodeConfigMod, "NodeConfigurationDefault")},
		},
		DataSources: map[string]*tfbridge.DataSourceInfo{
			// AWS Data Sources
			"castai_eks_settings": {Tok: tokens.ModuleMember(awsDataSource(awsMod, "getEksSettings"))},
			"castai_eks_user_arn": {Tok: tokens.ModuleMember(awsDataSource(awsMod, "getEksUserArn"))}, // Deprecated in Terraform, will be removed in next major release

			// GCP Data Sources
			"castai_gke_user_policies": {Tok: tokens.ModuleMember(gcpDataSource(gcpMod, "getGkePolicies"))},

			// Organization Data Sources
			"castai_organization": {Tok: tokens.ModuleMember(castaiDataSource(organizationMod, "getOrganization"))},

			// Rebalancing Data Sources
			"castai_rebalancing_schedule": {Tok: tokens.ModuleMember(castaiDataSource(rebalancingMod, "getRebalancingSchedule"))},
			"castai_hibernation_schedule": {Tok: tokens.ModuleMember(castaiDataSource(rebalancingMod, "getHibernationSchedule"))},

			// Workload Data Sources
			"castai_workload_scaling_policy_order": {Tok: tokens.ModuleMember(castaiDataSource(workloadMod, "getWorkloadScalingPolicyOrder"))},
		},
		JavaScript: &tfbridge.JavaScriptInfo{
			PackageName: "@castai/pulumi",
			Dependencies: map[string]string{
				"@pulumi/pulumi": "^3.0.0",
			},
			DevDependencies: map[string]string{
				"@types/node": "^10.0.0", // so we can access strongly typed node definitions.
				"@types/mime": "^2.0.0",
			},
		},
		Python: &tfbridge.PythonInfo{
			Requires: map[string]string{
				"pulumi": ">=3.0.0,<4.0.0",
			},
		},
		Golang: &tfbridge.GolangInfo{
			ImportBasePath: filepath.Join(
				fmt.Sprintf("github.com/castai/pulumi-%[1]s/sdk/", mainPkg),
				tfbridge.GetModuleMajorVersion(version.Version),
				"go",
				mainPkg,
			),
			GenerateResourceContainerTypes: true,
		},
		CSharp: &tfbridge.CSharpInfo{
			PackageReferences: map[string]string{
				"Pulumi": "3.*",
			},
			Namespaces: map[string]string{
				mainPkg: "CastAI",
			},
		},
	}

	// These are new API endpoints in more recent versions of the provider
	// Add specific transformers here if needed for particular resources

	prov.SetAutonaming(255, "-")

	return prov
}

// castaiResource creates a Pulumi token for a CAST AI resource from its module and name
func castaiResource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(mod, name, ""))
}

// awsResource creates tokens for AWS-specific resources
func awsResource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(mod, name, ""))
}

// gcpResource creates tokens for GCP-specific resources
func gcpResource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(mod, name, ""))
}

// azureResource creates tokens for Azure-specific resources
func azureResource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(mod, name, ""))
}

// castaiDataSource creates a Pulumi token for a CAST AI data source from its module and name
func castaiDataSource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(mod, name, "DataSource"))
}

// awsDataSource creates tokens for AWS-specific data sources
func awsDataSource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(mod, name, "DataSource"))
}

// gcpDataSource creates tokens for GCP-specific data sources
func gcpDataSource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(mod, name, "DataSource"))
}

// iamResource creates tokens for IAM-specific resources
func iamResource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(iamMod, name, ""))
}

// azureDataSource creates tokens for Azure-specific data sources
func azureDataSource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(mod, name, "DataSource"))
}

func makeMemberToken(mod string, name string, suffix string) string {
	return fmt.Sprintf("castai:%s:%s%s", mod, title(name), suffix)
}

// title capitalizes the first letter of a string
func title(s string) string {
	if s == "" {
		return s
	}
	runes := []rune(s)
	runes[0] = unicode.ToUpper(runes[0])
	return string(runes)
}
