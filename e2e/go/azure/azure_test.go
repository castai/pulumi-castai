package azure

import (
	"context"
	"fmt"
	"os"
	"testing"

	"github.com/pulumi/pulumi/sdk/v3/go/auto"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optdestroy"
	"github.com/pulumi/pulumi/sdk/v3/go/auto/optup"
	"github.com/stretchr/testify/require"
)

func TestPulumiAzureOnboarding(t *testing.T) {
	// Skip this test for now until Azure test is fully implemented
	t.Skip("Azure test not yet implemented")

	r := require.New(t)
	ctx := context.Background()

	// Project and stack names for Pulumi
	projectName := "castai-e2e-azure-test"
	stackName := "dev"

	// Working directory for the Pulumi program
	workDir := "../../tests/azure_cluster"

	// Create workspace with local source
	w, err := auto.NewLocalWorkspace(ctx, auto.WorkDir(workDir))
	r.NoError(err, "failed to create workspace")

	// Try to select stack first
	stack, err := auto.SelectStack(ctx, stackName, w)

	// If stack doesn't exist, create it
	if err != nil {
		// Create the stack with project settings
		stack, err = auto.UpsertStack(ctx, stackName, w)
		r.NoError(err, "failed to create new stack")
	}

	// Ensure stack is destroyed when test is done (only if the test passes)
	defer func() {
		if !t.Failed() {
			fmt.Println("Destroying stack...")
			_, err := stack.Destroy(ctx, optdestroy.ProgressStreams(os.Stdout))
			if err != nil {
				t.Logf("Failed to destroy stack: %v", err)
			}
		} else {
			t.Logf("Test failed, skipping stack destroy. Clean up later with 'just clean-e2e-tests'")
		}
	}()

	// Set required configuration values from environment variables
	if err := setAzureStackConfigFromEnv(ctx, stack); err != nil {
		t.Fatalf("Failed to set stack config: %v", err)
	}

	// Deploy the Azure stack
	fmt.Println("Deploying Azure stack...")
	res, err := stack.Up(ctx, optup.ProgressStreams(os.Stdout))
	r.NoError(err, "failed to deploy stack")

	// Extract the CAST AI cluster ID from the stack outputs
	clusterID, ok := res.Outputs["castaiClusterId"].Value.(string)
	r.True(ok, "failed to get cluster ID from stack outputs")
	r.NotEmpty(clusterID, "cluster ID is empty")

	fmt.Printf("CAST AI cluster ID: %s\n", clusterID)

	// Additional Azure-specific test steps would go here

	fmt.Println("Test completed successfully!")
}

// setAzureStackConfigFromEnv sets the required configuration values for the Azure stack
func setAzureStackConfigFromEnv(ctx context.Context, stack auto.Stack) error {
	// Azure configuration
	if err := stack.SetConfig(ctx, "azure:location", auto.ConfigValue{Value: os.Getenv("AZURE_LOCATION")}); err != nil {
		return fmt.Errorf("setting azure:location: %w", err)
	}
	if err := stack.SetConfig(ctx, "azure:subscriptionId", auto.ConfigValue{Value: os.Getenv("AZURE_SUBSCRIPTION_ID"), Secret: true}); err != nil {
		return fmt.Errorf("setting azure:subscriptionId: %w", err)
	}
	if err := stack.SetConfig(ctx, "azure:clientId", auto.ConfigValue{Value: os.Getenv("AZURE_CLIENT_ID"), Secret: true}); err != nil {
		return fmt.Errorf("setting azure:clientId: %w", err)
	}
	if err := stack.SetConfig(ctx, "azure:clientSecret", auto.ConfigValue{Value: os.Getenv("AZURE_CLIENT_SECRET"), Secret: true}); err != nil {
		return fmt.Errorf("setting azure:clientSecret: %w", err)
	}
	if err := stack.SetConfig(ctx, "azure:tenantId", auto.ConfigValue{Value: os.Getenv("AZURE_TENANT_ID"), Secret: true}); err != nil {
		return fmt.Errorf("setting azure:tenantId: %w", err)
	}

	// CAST AI configuration
	if err := stack.SetConfig(ctx, "castai:apiToken", auto.ConfigValue{Value: os.Getenv("CASTAI_API_TOKEN"), Secret: true}); err != nil {
		return fmt.Errorf("setting castai:apiToken: %w", err)
	}
	if apiURL := os.Getenv("CASTAI_API_URL"); apiURL != "" {
		if err := stack.SetConfig(ctx, "castai:apiUrl", auto.ConfigValue{Value: apiURL}); err != nil {
			return fmt.Errorf("setting castai:apiUrl: %w", err)
		}
	}

	return nil
}
