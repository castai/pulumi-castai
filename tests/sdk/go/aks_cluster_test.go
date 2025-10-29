package tests

import (
	"fmt"
	"testing"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi/sdk/v3/go/common/resource"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/stretchr/testify/assert"
)

// AzureMocks implements pulumi.MockResourceMonitor for Azure/AKS resources
type AzureMocks struct {
	pulumi.MockResourceMonitor
}

// NewResource mocks resource creation for AKS and Azure resources
func (m *AzureMocks) NewResource(args pulumi.MockResourceArgs) (string, resource.PropertyMap, error) {
	outputs := args.Inputs.Copy()

	switch args.TypeToken {
	case "castai:azure:AksCluster":
		// Generate mock outputs for AKS cluster
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-cluster-id-%d", args.Name, hashString(args.Name)))
		outputs["clusterToken"] = resource.NewStringProperty(fmt.Sprintf("mock-aks-token-%d", hashString(args.Name)))
		outputs["credentialsId"] = resource.NewStringProperty(fmt.Sprintf("mock-credentials-%d", hashString(args.Name)))

	case "azure:authorization/assignment:Assignment":
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("/subscriptions/00000000-0000-0000-0000-000000000000/providers/Microsoft.Authorization/roleAssignments/%s", args.Name))

	default:
		// Default mock for other resources
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-id", args.Name))
	}

	return args.Name + "-id", outputs, nil
}

// Call mocks function/data source calls for Azure
func (m *AzureMocks) Call(args pulumi.MockCallArgs) (resource.PropertyMap, error) {
	outputs := resource.PropertyMap{}

	switch args.Token {
	case "azure:core/getSubscription:getSubscription":
		outputs["subscriptionId"] = resource.NewStringProperty("00000000-0000-0000-0000-000000000000")
		outputs["displayName"] = resource.NewStringProperty("Test Subscription")
	}

	return outputs, nil
}

// Tests for creating AKS clusters

func TestAksClusterCreation(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		cluster, err := castai.NewAksCluster(ctx, "test-aks-cluster", &castai.AksClusterArgs{
			SubscriptionId:          pulumi.String("12345678-1234-1234-1234-123456789012"),
			TenantId:                pulumi.String("87654321-4321-4321-4321-210987654321"),
			ClientId:                pulumi.String("abcdef12-3456-7890-abcd-ef1234567890"),
			ClientSecret:            pulumi.String("mock-client-secret-value"),
			Name:                    pulumi.String("my-aks-cluster"),
			Region:                  pulumi.String("eastus"),
			NodeResourceGroup:       pulumi.String("MC_my-rg_my-aks-cluster_eastus"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &AzureMocks{}))

	assert.NoError(t, err)
}

func TestAksClusterMultipleRegions(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		regions := []string{"eastus", "westus2", "northeurope", "southeastasia"}

		for _, region := range regions {
			cluster, err := castai.NewAksCluster(ctx, "test-aks-"+region, &castai.AksClusterArgs{
				SubscriptionId:          pulumi.String("12345678-1234-1234-1234-123456789012"),
				TenantId:                pulumi.String("87654321-4321-4321-4321-210987654321"),
				ClientId:                pulumi.String("abcdef12-3456-7890-abcd-ef1234567890"),
				ClientSecret:            pulumi.String("mock-secret"),
				Name:                    pulumi.String("cluster-" + region),
				Region:                  pulumi.String(region),
				NodeResourceGroup:       pulumi.String(fmt.Sprintf("MC_rg_cluster-%s_%s", region, region)),
				DeleteNodesOnDisconnect: pulumi.Bool(false),
			})
			assert.NoError(t, err)
			assert.NotNil(t, cluster)
		}

		return nil
	}, pulumi.WithMocks("project", "stack", &AzureMocks{}))

	assert.NoError(t, err)
}

func TestAksClusterDeletionBehavior(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Test delete_nodes_on_disconnect = true
		clusterDelete, err := castai.NewAksCluster(ctx, "test-aks-delete", &castai.AksClusterArgs{
			SubscriptionId:          pulumi.String("12345678-1234-1234-1234-123456789012"),
			TenantId:                pulumi.String("87654321-4321-4321-4321-210987654321"),
			ClientId:                pulumi.String("abcdef12-3456-7890-abcd-ef1234567890"),
			ClientSecret:            pulumi.String("mock-secret"),
			Name:                    pulumi.String("delete-cluster"),
			Region:                  pulumi.String("eastus"),
			NodeResourceGroup:       pulumi.String("MC_rg_delete-cluster_eastus"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
		})
		assert.NoError(t, err)
		assert.NotNil(t, clusterDelete)

		// Test delete_nodes_on_disconnect = false
		clusterKeep, err := castai.NewAksCluster(ctx, "test-aks-keep", &castai.AksClusterArgs{
			SubscriptionId:          pulumi.String("12345678-1234-1234-1234-123456789012"),
			TenantId:                pulumi.String("87654321-4321-4321-4321-210987654321"),
			ClientId:                pulumi.String("abcdef12-3456-7890-abcd-ef1234567890"),
			ClientSecret:            pulumi.String("mock-secret"),
			Name:                    pulumi.String("keep-cluster"),
			Region:                  pulumi.String("westus"),
			NodeResourceGroup:       pulumi.String("MC_rg_keep-cluster_westus"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
		})
		assert.NoError(t, err)
		assert.NotNil(t, clusterKeep)

		return nil
	}, pulumi.WithMocks("project", "stack", &AzureMocks{}))

	assert.NoError(t, err)
}

func TestAksClusterNodeResourceGroup(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Azure creates a separate resource group for cluster nodes
		nodeRg := "MC_custom-rg_production-aks_eastus2"

		cluster, err := castai.NewAksCluster(ctx, "test-aks-node-rg", &castai.AksClusterArgs{
			SubscriptionId:          pulumi.String("12345678-1234-1234-1234-123456789012"),
			TenantId:                pulumi.String("87654321-4321-4321-4321-210987654321"),
			ClientId:                pulumi.String("abcdef12-3456-7890-abcd-ef1234567890"),
			ClientSecret:            pulumi.String("mock-secret"),
			Name:                    pulumi.String("production-aks"),
			Region:                  pulumi.String("eastus2"),
			NodeResourceGroup:       pulumi.String(nodeRg),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &AzureMocks{}))

	assert.NoError(t, err)
}

func TestAksClusterServicePrincipal(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Service principal credentials
		spClientId := "11111111-2222-3333-4444-555555555555"
		spClientSecret := "mock-service-principal-secret-value"

		cluster, err := castai.NewAksCluster(ctx, "test-aks-sp", &castai.AksClusterArgs{
			SubscriptionId:          pulumi.String("12345678-1234-1234-1234-123456789012"),
			TenantId:                pulumi.String("87654321-4321-4321-4321-210987654321"),
			ClientId:                pulumi.String(spClientId),
			ClientSecret:            pulumi.String(spClientSecret),
			Name:                    pulumi.String("sp-cluster"),
			Region:                  pulumi.String("westeurope"),
			NodeResourceGroup:       pulumi.String("MC_rg_sp-cluster_westeurope"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &AzureMocks{}))

	assert.NoError(t, err)
}

func TestAksClusterMultipleSubscriptions(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		subscriptions := []string{
			"11111111-1111-1111-1111-111111111111",
			"22222222-2222-2222-2222-222222222222",
			"33333333-3333-3333-3333-333333333333",
		}

		for i, subId := range subscriptions {
			cluster, err := castai.NewAksCluster(ctx, fmt.Sprintf("test-aks-sub-%d", i), &castai.AksClusterArgs{
				SubscriptionId:          pulumi.String(subId),
				TenantId:                pulumi.String("87654321-4321-4321-4321-210987654321"),
				ClientId:                pulumi.String("abcdef12-3456-7890-abcd-ef1234567890"),
				ClientSecret:            pulumi.String("mock-secret"),
				Name:                    pulumi.String(fmt.Sprintf("cluster-sub-%d", i)),
				Region:                  pulumi.String("eastus"),
				NodeResourceGroup:       pulumi.String(fmt.Sprintf("MC_rg_cluster-sub-%d_eastus", i)),
				DeleteNodesOnDisconnect: pulumi.Bool(false),
			})
			assert.NoError(t, err)
			assert.NotNil(t, cluster, "Cluster %d should not be nil", i)
		}

		return nil
	}, pulumi.WithMocks("project", "stack", &AzureMocks{}))

	assert.NoError(t, err)
}

func TestAksClusterValidation(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Test that resource creation accepts all required fields
		cluster, err := castai.NewAksCluster(ctx, "test-validation", &castai.AksClusterArgs{
			SubscriptionId:          pulumi.String("12345678-1234-1234-1234-123456789012"),
			TenantId:                pulumi.String("87654321-4321-4321-4321-210987654321"),
			ClientId:                pulumi.String("abcdef12-3456-7890-abcd-ef1234567890"),
			ClientSecret:            pulumi.String("mock-secret"),
			Name:                    pulumi.String("validation-cluster"),
			Region:                  pulumi.String("eastus"),
			NodeResourceGroup:       pulumi.String("MC_rg_validation-cluster_eastus"),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &AzureMocks{}))

	assert.NoError(t, err)
}

func TestAksClusterMinimalConfig(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Minimal required configuration
		cluster, err := castai.NewAksCluster(ctx, "test-aks-minimal", &castai.AksClusterArgs{
			SubscriptionId:          pulumi.String("99999999-9999-9999-9999-999999999999"),
			TenantId:                pulumi.String("88888888-8888-8888-8888-888888888888"),
			ClientId:                pulumi.String("77777777-7777-7777-7777-777777777777"),
			ClientSecret:            pulumi.String("minimal-secret"),
			Name:                    pulumi.String("minimal-aks"),
			Region:                  pulumi.String("centralus"),
			NodeResourceGroup:       pulumi.String("MC_minimal_minimal-aks_centralus"),
			DeleteNodesOnDisconnect: pulumi.Bool(false),
		})
		assert.NoError(t, err)
		assert.NotNil(t, cluster)
		return nil
	}, pulumi.WithMocks("project", "stack", &AzureMocks{}))

	assert.NoError(t, err)
}
