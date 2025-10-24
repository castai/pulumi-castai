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
	"testing"

	"github.com/pulumi/pulumi/sdk/v3/go/common/tokens"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// TestTitleFunction tests the title helper function
func TestTitleFunction(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
	}{
		{
			name:     "lowercase string",
			input:    "cluster",
			expected: "Cluster",
		},
		{
			name:     "already capitalized",
			input:    "Cluster",
			expected: "Cluster",
		},
		{
			name:     "empty string",
			input:    "",
			expected: "",
		},
		{
			name:     "single character",
			input:    "c",
			expected: "C",
		},
		{
			name:     "underscore separated",
			input:    "eks_cluster",
			expected: "Eks_cluster",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := title(tt.input)
			assert.Equal(t, tt.expected, result)
		})
	}
}

// TestMakeMemberToken tests the makeMemberToken function
func TestMakeMemberToken(t *testing.T) {
	tests := []struct {
		name     string
		mod      string
		resName  string
		suffix   string
		expected string
	}{
		{
			name:     "index module resource",
			mod:      "index",
			resName:  "Cluster",
			suffix:   "",
			expected: "castai:index:Cluster",
		},
		{
			name:     "aws module resource",
			mod:      "aws",
			resName:  "EksCluster",
			suffix:   "",
			expected: "castai:aws:EksCluster",
		},
		{
			name:     "data source with suffix",
			mod:      "gcp",
			resName:  "getGkePolicies",
			suffix:   "DataSource",
			expected: "castai:gcp:GetGkePoliciesDataSource",
		},
		{
			name:     "autoscaling module",
			mod:      "autoscaling",
			resName:  "Autoscaler",
			suffix:   "",
			expected: "castai:autoscaling:Autoscaler",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := makeMemberToken(tt.mod, tt.resName, tt.suffix)
			assert.Equal(t, tt.expected, result)
		})
	}
}

// TestCastaiResourceTokens tests castaiResource token generation
func TestCastaiResourceTokens(t *testing.T) {
	tests := []struct {
		name     string
		mod      string
		resName  string
		expected tokens.Type
	}{
		{
			name:     "cluster resource",
			mod:      mainMod,
			resName:  "Cluster",
			expected: tokens.Type("castai:index:Cluster"),
		},
		{
			name:     "credentials resource",
			mod:      mainMod,
			resName:  "Credentials",
			expected: tokens.Type("castai:index:Credentials"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := castaiResource(tt.mod, tt.resName)
			assert.Equal(t, tt.expected, result)
		})
	}
}

// TestAWSResourceTokens tests awsResource token generation
func TestAWSResourceTokens(t *testing.T) {
	result := awsResource(awsMod, "EksCluster")
	expected := tokens.Type("castai:aws:EksCluster")
	assert.Equal(t, expected, result)
}

// TestGCPResourceTokens tests gcpResource token generation
func TestGCPResourceTokens(t *testing.T) {
	result := gcpResource(gcpMod, "GkeCluster")
	expected := tokens.Type("castai:gcp:GkeCluster")
	assert.Equal(t, expected, result)
}

// TestAzureResourceTokens tests azureResource token generation
func TestAzureResourceTokens(t *testing.T) {
	result := azureResource(azureMod, "AksCluster")
	expected := tokens.Type("castai:azure:AksCluster")
	assert.Equal(t, expected, result)
}

// TestDataSourceTokens tests data source token generation
func TestDataSourceTokens(t *testing.T) {
	tests := []struct {
		name     string
		fn       func(string, string) tokens.Type
		mod      string
		dsName   string
		expected tokens.Type
	}{
		{
			name:     "castai data source",
			fn:       castaiDataSource,
			mod:      mainMod,
			dsName:   "getCluster",
			expected: tokens.Type("castai:index:GetClusterDataSource"),
		},
		{
			name:     "aws data source",
			fn:       awsDataSource,
			mod:      awsMod,
			dsName:   "getEksSettings",
			expected: tokens.Type("castai:aws:GetEksSettingsDataSource"),
		},
		{
			name:     "gcp data source",
			fn:       gcpDataSource,
			mod:      gcpMod,
			dsName:   "getGkePolicies",
			expected: tokens.Type("castai:gcp:GetGkePoliciesDataSource"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := tt.fn(tt.mod, tt.dsName)
			assert.Equal(t, tt.expected, result)
		})
	}
}

// TestProviderMetadata tests that Provider() returns valid metadata
func TestProviderMetadata(t *testing.T) {
	prov := Provider()

	assert.Equal(t, "castai", prov.Name)
	assert.Equal(t, "CAST AI", prov.DisplayName)
	assert.Equal(t, "CAST AI", prov.Publisher)
	assert.Equal(t, "Apache-2.0", prov.License)
	assert.Equal(t, "https://cast.ai", prov.Homepage)
	assert.Equal(t, "https://github.com/castai/pulumi-castai", prov.Repository)
	assert.Equal(t, "castai", prov.GitHubOrg)
	assert.Contains(t, prov.Keywords, "pulumi")
	assert.Contains(t, prov.Keywords, "castai")
	assert.Contains(t, prov.Keywords, "kubernetes")
}

// TestProviderConfig tests provider configuration schema
func TestProviderConfig(t *testing.T) {
	prov := Provider()

	// Test API token configuration
	apiToken, ok := prov.Config["api_token"]
	require.True(t, ok, "api_token configuration must exist")
	assert.NotNil(t, apiToken.Default)
	assert.Contains(t, apiToken.Default.EnvVars, "CASTAI_API_TOKEN")
	assert.NotNil(t, apiToken.Secret)
	assert.True(t, *apiToken.Secret, "api_token should be marked as secret")

	// Test API URL configuration
	apiURL, ok := prov.Config["api_url"]
	require.True(t, ok, "api_url configuration must exist")
	assert.NotNil(t, apiURL.Default)
	assert.Equal(t, "https://api.cast.ai", apiURL.Default.Value)
	assert.Contains(t, apiURL.Default.EnvVars, "CASTAI_API_URL")
}

// TestProviderResources tests that all expected resources are mapped
func TestProviderResources(t *testing.T) {
	prov := Provider()

	expectedResources := map[string]string{
		"castai_eks_cluster":                "castai:aws:EksCluster",
		"castai_gke_cluster":                "castai:gcp:GkeCluster",
		"castai_aks_cluster":                "castai:azure:AksCluster",
		"castai_cluster":                    "castai:index:Cluster",
		"castai_credentials":                "castai:index:Credentials",
		"castai_cluster_token":              "castai:index:ClusterToken",
		"castai_eks_clusterid":              "castai:aws:EksClusterId",
		"castai_gke_cluster_id":             "castai:gcp:GkeClusterId",
		"castai_autoscaler":                 "castai:autoscaling:Autoscaler",
		"castai_node_configuration":         "castai:nodeconfig:NodeConfiguration",
		"castai_node_configuration_default": "castai:nodeconfig:NodeConfigurationDefault",
	}

	// Verify all expected resources are present
	for tfName, expectedToken := range expectedResources {
		t.Run(tfName, func(t *testing.T) {
			res, ok := prov.Resources[tfName]
			require.True(t, ok, "Resource %s must be mapped", tfName)
			assert.Equal(t, expectedToken, string(res.Tok), "Resource %s token mismatch", tfName)
		})
	}

	// Verify count matches (now have 11 resources: 7 from v0.24.3 + 2 clusterID + 2 nodeConfig from v7.73.0)
	assert.Equal(t, len(expectedResources), len(prov.Resources),
		"Expected %d resources, got %d", len(expectedResources), len(prov.Resources))
}

// TestProviderDataSources tests that all expected data sources are mapped
func TestProviderDataSources(t *testing.T) {
	prov := Provider()

	expectedDataSources := map[string]string{
		// AWS data sources
		"castai_eks_settings": "castai:aws:GetEksSettingsDataSource",
		"castai_eks_user_arn": "castai:aws:GetEksUserArnDataSource",

		// GCP data sources
		"castai_gke_user_policies": "castai:gcp:GetGkePoliciesDataSource",

		// Organization data sources
		"castai_organization": "castai:organization:GetOrganizationDataSource",

		// Rebalancing data sources
		"castai_rebalancing_schedule": "castai:rebalancing:GetRebalancingScheduleDataSource",
		"castai_hibernation_schedule": "castai:rebalancing:GetHibernationScheduleDataSource",

		// Workload data sources
		"castai_workload_scaling_policy_order": "castai:workload:GetWorkloadScalingPolicyOrderDataSource",
	}

	// Verify all expected data sources are present
	for tfName, expectedToken := range expectedDataSources {
		t.Run(tfName, func(t *testing.T) {
			ds, ok := prov.DataSources[tfName]
			require.True(t, ok, "Data source %s must be mapped", tfName)
			assert.Equal(t, expectedToken, string(ds.Tok), "Data source %s token mismatch", tfName)
		})
	}

	// Verify count matches (should have exactly 7 data sources from v7.73.0)
	assert.Equal(t, len(expectedDataSources), len(prov.DataSources),
		"Expected %d data sources, got %d", len(expectedDataSources), len(prov.DataSources))
}

// TestModuleConstants tests that module constants are defined correctly
func TestModuleConstants(t *testing.T) {
	assert.Equal(t, "castai", mainPkg)
	assert.Equal(t, "index", mainMod)
	assert.Equal(t, "aws", awsMod)
	assert.Equal(t, "gcp", gcpMod)
	assert.Equal(t, "azure", azureMod)
	assert.Equal(t, "iam", iamMod)
	assert.Equal(t, "autoscaling", autoscalingMod)
	assert.Equal(t, "organization", organizationMod)
	assert.Equal(t, "nodeconfig", nodeConfigMod)
	assert.Equal(t, "rebalancing", rebalancingMod)
	assert.Equal(t, "workload", workloadMod)
}

// TestAutoscalerResourceFieldMapping tests the autoscaler resource field mapping
func TestAutoscalerResourceFieldMapping(t *testing.T) {
	prov := Provider()

	autoscaler, ok := prov.Resources["castai_autoscaler"]
	require.True(t, ok, "castai_autoscaler resource must exist")
	require.NotNil(t, autoscaler.Fields, "castai_autoscaler must have field mappings")

	// Test cluster_id field mapping
	clusterIDField, ok := autoscaler.Fields["cluster_id"]
	require.True(t, ok, "cluster_id field must be mapped")
	assert.Equal(t, "clusterId", clusterIDField.Name, "cluster_id should be mapped to clusterId")
}

// TestLanguageSDKConfiguration tests SDK configuration for each language
func TestLanguageSDKConfiguration(t *testing.T) {
	prov := Provider()

	// Test JavaScript/TypeScript configuration
	t.Run("JavaScript", func(t *testing.T) {
		require.NotNil(t, prov.JavaScript, "JavaScript configuration must be present")
		assert.Equal(t, "@castai/pulumi", prov.JavaScript.PackageName)
		assert.Contains(t, prov.JavaScript.Dependencies, "@pulumi/pulumi")
	})

	// Test Python configuration
	t.Run("Python", func(t *testing.T) {
		require.NotNil(t, prov.Python, "Python configuration must be present")
		assert.Contains(t, prov.Python.Requires, "pulumi")
	})

	// Test Go configuration
	t.Run("Go", func(t *testing.T) {
		require.NotNil(t, prov.Golang, "Go configuration must be present")
		assert.Contains(t, prov.Golang.ImportBasePath, "github.com/castai/pulumi-castai/sdk")
		assert.True(t, prov.Golang.GenerateResourceContainerTypes)
	})

	// Test C# configuration
	t.Run("CSharp", func(t *testing.T) {
		require.NotNil(t, prov.CSharp, "C# configuration must be present")
		assert.Contains(t, prov.CSharp.PackageReferences, "Pulumi")
		assert.Equal(t, "CastAI", prov.CSharp.Namespaces[mainPkg])
	})
}

// TestResourceModuleAssignment tests that resources are assigned to correct modules
func TestResourceModuleAssignment(t *testing.T) {
	prov := Provider()

	tests := []struct {
		resource       string
		expectedModule string
	}{
		{"castai_eks_cluster", "aws"},
		{"castai_gke_cluster", "gcp"},
		{"castai_aks_cluster", "azure"},
		{"castai_cluster", "index"},
		{"castai_eks_clusterid", "aws"},
		{"castai_gke_cluster_id", "gcp"},
		{"castai_autoscaler", "autoscaling"},
		{"castai_node_configuration", "nodeconfig"},
		{"castai_node_configuration_default", "nodeconfig"},
	}

	for _, tt := range tests {
		t.Run(tt.resource, func(t *testing.T) {
			res, ok := prov.Resources[tt.resource]
			require.True(t, ok, "Resource %s must exist", tt.resource)
			assert.Contains(t, string(res.Tok), ":"+tt.expectedModule+":",
				"Resource %s should be in module %s", tt.resource, tt.expectedModule)
		})
	}
}

// TestDataSourceModuleAssignment tests that data sources are assigned to correct modules
func TestDataSourceModuleAssignment(t *testing.T) {
	prov := Provider()

	tests := []struct {
		dataSource     string
		expectedModule string
	}{
		{"castai_eks_settings", "aws"},
		{"castai_eks_user_arn", "aws"},
		{"castai_gke_user_policies", "gcp"},
		{"castai_organization", "organization"},
		{"castai_rebalancing_schedule", "rebalancing"},
		{"castai_hibernation_schedule", "rebalancing"},
		{"castai_workload_scaling_policy_order", "workload"},
	}

	for _, tt := range tests {
		t.Run(tt.dataSource, func(t *testing.T) {
			ds, ok := prov.DataSources[tt.dataSource]
			require.True(t, ok, "Data source %s must exist", tt.dataSource)
			assert.Contains(t, string(ds.Tok), ":"+tt.expectedModule+":",
				"Data source %s should be in module %s", tt.dataSource, tt.expectedModule)
		})
	}
}
