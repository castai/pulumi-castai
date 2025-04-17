package aws

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

func TestPulumiAWSOnboarding(t *testing.T) {
	// Skip this test for now until AWS test is fully implemented
	t.Skip("AWS test not yet implemented")

	r := require.New(t)
	ctx := context.Background()

	// Project and stack names for Pulumi
	projectName := "castai-e2e-aws-test"
	stackName := "dev"

	// Working directory for the Pulumi program
	workDir := "../../tests/aws_cluster"

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
	if err := setAWSStackConfigFromEnv(ctx, stack); err != nil {
		t.Fatalf("Failed to set stack config: %v", err)
	}

	// Deploy the AWS stack
	fmt.Println("Deploying AWS stack...")
	res, err := stack.Up(ctx, optup.ProgressStreams(os.Stdout))
	r.NoError(err, "failed to deploy stack")

	// Extract the CAST AI cluster ID from the stack outputs
	clusterID, ok := res.Outputs["castaiClusterId"].Value.(string)
	r.True(ok, "failed to get cluster ID from stack outputs")
	r.NotEmpty(clusterID, "cluster ID is empty")

	fmt.Printf("CAST AI cluster ID: %s\n", clusterID)

	// Additional AWS-specific test steps would go here

	fmt.Println("Test completed successfully!")
}

// setAWSStackConfigFromEnv sets the required configuration values for the AWS stack
func setAWSStackConfigFromEnv(ctx context.Context, stack auto.Stack) error {
	// AWS configuration
	if err := stack.SetConfig(ctx, "aws:region", auto.ConfigValue{Value: os.Getenv("AWS_REGION")}); err != nil {
		return fmt.Errorf("setting aws:region: %w", err)
	}
	if err := stack.SetConfig(ctx, "aws:accessKey", auto.ConfigValue{Value: os.Getenv("AWS_ACCESS_KEY_ID"), Secret: true}); err != nil {
		return fmt.Errorf("setting aws:accessKey: %w", err)
	}
	if err := stack.SetConfig(ctx, "aws:secretKey", auto.ConfigValue{Value: os.Getenv("AWS_SECRET_ACCESS_KEY"), Secret: true}); err != nil {
		return fmt.Errorf("setting aws:secretKey: %w", err)
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
