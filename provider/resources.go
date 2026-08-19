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
	"github.com/pulumi/pulumi/sdk/v3/go/common/tokens"

	"github.com/castai/pulumi-castai/provider/pkg/version"
)

// all of the token components used below.
const (
	// This variable controls the default name of the package in the package
	// registries for nodejs and python:
	mainPkg = "castai"
	// modules:
	mainMod         = "index"             // the castai module
	awsMod          = "aws"               // AWS specific resources
	gcpMod          = "gcp"               // GCP specific resources
	azureMod        = "azure"             // Azure specific resources
	iamMod          = "iam"               // IAM related resources
	autoscalingMod  = "autoscaling"
	organizationMod = "organization"
	nodeConfigMod   = "config/node"
	rebalancingMod  = "rebalancing"
	workloadMod     = "workload"
	cacheMod        = "cache"
	aiOptimizerMod  = "index/aiOptimizer"
)

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
		Resources: map[string]*tfbridge.ResourceInfo{
			// Core Resources
			"castai_eks_cluster":    {Tok: awsResource(awsMod, "EksCluster")},
			"castai_gke_cluster":    {Tok: gcpResource(gcpMod, "GkeCluster")},
			"castai_aks_cluster":    {Tok: azureResource(azureMod, "AksCluster")},
			// NOTE: castai_cluster, castai_credentials, castai_cluster_token don't exist in TF provider v7.73.0

			// Cluster ID resources (register existing clusters with CAST AI)
			"castai_eks_clusterid":  {Tok: awsResource(awsMod, "EksClusterId")},
			"castai_gke_cluster_id": {Tok: gcpResource(gcpMod, "GkeClusterId")},
			"castai_eks_user_arn":   {Tok: awsResource(awsMod, "EksUserArn")}, // Deprecated but still exists in v7.73.0

			// Autoscaling resources
			"castai_autoscaler": {
				Tok: castaiResource(autoscalingMod, "Autoscaler"),
				Fields: map[string]*tfbridge.SchemaInfo{
					"cluster_id": {
						Name: "clusterId",
					},
				},
			},
			"castai_evictor_advanced_config": {Tok: castaiResource(autoscalingMod, "EvictorAdvancedConfig")},

			// Node Configuration resources
			"castai_node_configuration":         {Tok: castaiResource(nodeConfigMod, "NodeConfiguration")},
			"castai_node_configuration_default": {Tok: castaiResource(nodeConfigMod, "NodeConfigurationDefault")},
			"castai_node_template":              {Tok: castaiResource(nodeConfigMod, "NodeTemplate")},

			// Workload Management resources
			"castai_workload_scaling_policy":             {Tok: castaiResource(workloadMod, "WorkloadScalingPolicy")},
			"castai_workload_scaling_policy_order":       {Tok: castaiResource(workloadMod, "WorkloadScalingPolicyOrder")},
			"castai_workload_custom_metrics_data_source": {Tok: castaiResource(workloadMod, "WorkloadCustomMetricsDataSource")},
			"castai_pod_mutation":                        {Tok: castaiResource(mainMod, "PodMutation")},

			// Rebalancing resources
			"castai_rebalancing_schedule": {Tok: castaiResource(rebalancingMod, "RebalancingSchedule")},
			"castai_rebalancing_job":      {Tok: castaiResource(rebalancingMod, "RebalancingJob")},
			"castai_hibernation_schedule": {Tok: castaiResource(rebalancingMod, "HibernationSchedule")},

			// Organization resources
			"castai_organization_members":     {Tok: castaiResource(organizationMod, "OrganizationMembers")},
			"castai_organization_group":       {Tok: castaiResource(organizationMod, "OrganizationGroup")},
			"castai_service_account":          {Tok: castaiResource(organizationMod, "ServiceAccount")},
			"castai_service_account_key":      {Tok: castaiResource(organizationMod, "ServiceAccountKey")},
			"castai_sso_connection":           {Tok: castaiResource(organizationMod, "SSOConnection")},
			"castai_role_bindings":            {Tok: castaiResource(iamMod, "RoleBindings")},
			"castai_enterprise_group":         {Tok: castaiResource(organizationMod, "EnterpriseGroup")},
			"castai_enterprise_role_binding":  {Tok: castaiResource(iamMod, "EnterpriseRoleBinding")},
			"castai_enterprise_service_account": {Tok: castaiResource(organizationMod, "EnterpriseServiceAccount")},

			// Cost Management resources
			"castai_reservations":       {Tok: castaiResource(mainMod, "Reservations")},
			"castai_commitments":        {Tok: castaiResource(mainMod, "Commitments")},
			"castai_allocation_group":   {Tok: castaiResource(mainMod, "AllocationGroup")},

			// Security resources
			"castai_security_runtime_rule": {Tok: castaiResource(mainMod, "SecurityRuntimeRule")},

			// Cache resources
			"castai_cache_group":         {Tok: castaiResource(cacheMod, "CacheGroup")},
			"castai_cache_configuration": {Tok: castaiResource(cacheMod, "CacheConfiguration")},
			"castai_cache_rule":          {Tok: castaiResource(cacheMod, "CacheRule")},

			// AI Optimizer resources
			"castai_ai_optimizer_model_registry": {Tok: castaiResource(aiOptimizerMod, "AiOptimizerModelRegistry")},
			"castai_ai_optimizer_model_specs":    {Tok: castaiResource(aiOptimizerMod, "AiOptimizerModelSpecs")},
			"castai_ai_optimizer_hosted_model":   {Tok: castaiResource(aiOptimizerMod, "AiOptimizerHostedModel")},
		},
		DataSources: map[string]*tfbridge.DataSourceInfo{
			// AWS Data Sources
			"castai_eks_settings": {Tok: tokens.ModuleMember(awsDataSource(awsMod, "getEksSettings"))},

			// GCP Data Sources
			"castai_gke_user_policies": {Tok: tokens.ModuleMember(gcpDataSource(gcpMod, "getGkePolicies"))},

			// Organization Data Sources
			"castai_organization":                  {Tok: tokens.ModuleMember(castaiDataSource(organizationMod, "getOrganization"))},
			"castai_impersonation_service_account": {Tok: tokens.ModuleMember(castaiDataSource(organizationMod, "getImpersonationServiceAccount"))},

			// Rebalancing Data Sources
			"castai_rebalancing_schedule": {Tok: tokens.ModuleMember(castaiDataSource(rebalancingMod, "getRebalancingSchedule"))},
			"castai_hibernation_schedule": {Tok: tokens.ModuleMember(castaiDataSource(rebalancingMod, "getHibernationSchedule"))},

			// Workload Data Sources
			"castai_workload_scaling_policies":       {Tok: tokens.ModuleMember(castaiDataSource(workloadMod, "getWorkloadScalingPolicies"))},
			"castai_workload_scaling_policy_order":   {Tok: tokens.ModuleMember(castaiDataSource(workloadMod, "getWorkloadScalingPolicyOrder"))},

			// Cache Data Sources
			"castai_cache_group": {Tok: tokens.ModuleMember(castaiDataSource(cacheMod, "getCacheGroup"))},
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
	return tokens.Type(makeMemberToken(mod, name))
}

// awsResource creates tokens for AWS-specific resources
func awsResource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(mod, name))
}

// gcpResource creates tokens for GCP-specific resources
func gcpResource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(mod, name))
}

// azureResource creates tokens for Azure-specific resources
func azureResource(mod string, name string) tokens.Type {
	return tokens.Type(makeMemberToken(mod, name))
}

// castaiDataSource creates a Pulumi token for a CAST AI data source from its module and name.
// Data-source tokens are lowercase and do NOT carry a "DataSource" suffix,
// matching Pulumi SDK conventions (e.g. `castai:organization:getOrganization`).
func castaiDataSource(mod string, name string) tokens.Type {
	return tokens.Type(fmt.Sprintf("castai:%s:%s", mod, name))
}

// awsDataSource creates tokens for AWS-specific data sources.
// Data-source tokens are lowercase and do NOT carry a "DataSource" suffix.
func awsDataSource(mod string, name string) tokens.Type {
	return tokens.Type(fmt.Sprintf("castai:%s:%s", mod, name))
}

// gcpDataSource creates tokens for GCP-specific data sources.
// Data-source tokens are lowercase and do NOT carry a "DataSource" suffix.
func gcpDataSource(mod string, name string) tokens.Type {
	return tokens.Type(fmt.Sprintf("castai:%s:%s", mod, name))
}

func makeMemberToken(mod string, name string) string {
	return fmt.Sprintf("castai:%s:%s", mod, title(name))
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
