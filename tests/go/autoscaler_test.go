package tests

import (
	"encoding/json"
	"fmt"
	"testing"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi/sdk/v3/go/common/resource"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/stretchr/testify/assert"
)

// AutoscalerMocks implements pulumi.MockResourceMonitor for Autoscaler resources
type AutoscalerMocks struct {
	pulumi.MockResourceMonitor
}

// NewResource mocks resource creation for autoscaler
func (m *AutoscalerMocks) NewResource(args pulumi.MockResourceArgs) (string, resource.PropertyMap, error) {
	outputs := args.Inputs.Copy()

	switch args.TypeToken {
	case "castai:autoscaling:Autoscaler":
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-autoscaler-id-%d", args.Name, hashString(args.Name)))
		if policiesJson, ok := outputs["autoscalerPoliciesJson"]; ok {
			outputs["autoscalerPolicies"] = policiesJson
		} else {
			outputs["autoscalerPolicies"] = resource.NewStringProperty("{}")
		}
	default:
		outputs["id"] = resource.NewStringProperty(fmt.Sprintf("%s-id", args.Name))
	}

	return args.Name + "-id", outputs, nil
}

// Call mocks function/data source calls
func (m *AutoscalerMocks) Call(args pulumi.MockCallArgs) (resource.PropertyMap, error) {
	return resource.PropertyMap{}, nil
}

func TestAutoscalerBasicConfiguration(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Based on Terraform example: disabled autoscaler
		autoscalerPolicies := map[string]interface{}{
			"enabled":                             false,
			"isScopedMode":                        false,
			"nodeTemplatesPartialMatchingEnabled": false,
			"unschedulablePods": map[string]interface{}{
				"enabled": false,
			},
			"nodeDownscaler": map[string]interface{}{
				"enabled": false,
				"emptyNodes": map[string]interface{}{
					"enabled": false,
				},
				"evictor": map[string]interface{}{
					"enabled":                 false,
					"aggressiveMode":          false,
					"cycleInterval":           "60s",
					"nodeGracePeriodMinutes":  10,
					"scopedMode":              false,
				},
			},
			"clusterLimits": map[string]interface{}{
				"enabled": false,
				"cpu": map[string]interface{}{
					"maxCores": 20,
					"minCores": 1,
				},
				"spotBackups": map[string]interface{}{
					"enabled":                        false,
					"spotBackupRestoreRateSeconds":   1800,
				},
			},
		}

		policiesJSON, err := json.Marshal(autoscalerPolicies)
		assert.NoError(t, err)

		autoscaler, err := castai.NewAutoscaler(ctx, "test-autoscaler", &castai.AutoscalerArgs{
			ClusterId:               pulumi.String("test-cluster-id-123"),
			AutoscalerPoliciesJson:  pulumi.String(string(policiesJSON)),
		})
		assert.NoError(t, err)
		assert.NotNil(t, autoscaler)

		return nil
	}, pulumi.WithMocks("project", "stack", &AutoscalerMocks{}))

	assert.NoError(t, err)
}

func TestAutoscalerEnabledConfiguration(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		autoscalerPolicies := map[string]interface{}{
			"enabled": true,
			"isScopedMode": false,
			"nodeTemplatesPartialMatchingEnabled": false,
			"unschedulablePods": map[string]interface{}{
				"enabled": true,
			},
			"nodeDownscaler": map[string]interface{}{
				"enabled": true,
				"emptyNodes": map[string]interface{}{
					"enabled": true,
				},
				"evictor": map[string]interface{}{
					"enabled":                true,
					"aggressiveMode":         false,
					"cycleInterval":          "5m10s",
					"nodeGracePeriodMinutes": 10,
					"scopedMode":             false,
				},
			},
			"clusterLimits": map[string]interface{}{
				"enabled": true,
				"cpu": map[string]interface{}{
					"maxCores": 100,
					"minCores": 2,
				},
				"spotBackups": map[string]interface{}{
					"enabled":                      true,
					"spotBackupRestoreRateSeconds": 1800,
				},
			},
		}

		policiesJSON, err := json.Marshal(autoscalerPolicies)
		assert.NoError(t, err)

		autoscaler, err := castai.NewAutoscaler(ctx, "test-autoscaler-enabled", &castai.AutoscalerArgs{
			ClusterId:              pulumi.String("enabled-cluster-123"),
			AutoscalerPoliciesJson: pulumi.String(string(policiesJSON)),
		})
		assert.NoError(t, err)
		assert.NotNil(t, autoscaler)

		return nil
	}, pulumi.WithMocks("project", "stack", &AutoscalerMocks{}))

	assert.NoError(t, err)
}

func TestAutoscalerAggressiveEvictor(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		autoscalerPolicies := map[string]interface{}{
			"enabled": true,
			"nodeDownscaler": map[string]interface{}{
				"enabled": true,
				"evictor": map[string]interface{}{
					"enabled":                true,
					"aggressiveMode":         true, // Aggressive mode enabled
					"cycleInterval":          "30s", // Faster cycle
					"nodeGracePeriodMinutes": 5, // Shorter grace period
					"scopedMode":             false,
				},
			},
		}

		policiesJSON, err := json.Marshal(autoscalerPolicies)
		assert.NoError(t, err)

		autoscaler, err := castai.NewAutoscaler(ctx, "test-aggressive-evictor", &castai.AutoscalerArgs{
			ClusterId:              pulumi.String("aggressive-cluster-456"),
			AutoscalerPoliciesJson: pulumi.String(string(policiesJSON)),
		})
		assert.NoError(t, err)
		assert.NotNil(t, autoscaler)

		return nil
	}, pulumi.WithMocks("project", "stack", &AutoscalerMocks{}))

	assert.NoError(t, err)
}

func TestAutoscalerClusterLimits(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		autoscalerPolicies := map[string]interface{}{
			"enabled": true,
			"clusterLimits": map[string]interface{}{
				"enabled": true,
				"cpu": map[string]interface{}{
					"maxCores": 50,
					"minCores": 5,
				},
				"spotBackups": map[string]interface{}{
					"enabled":                      true,
					"spotBackupRestoreRateSeconds": 3600, // 1 hour
				},
			},
		}

		policiesJSON, err := json.Marshal(autoscalerPolicies)
		assert.NoError(t, err)

		autoscaler, err := castai.NewAutoscaler(ctx, "test-cluster-limits", &castai.AutoscalerArgs{
			ClusterId:              pulumi.String("limited-cluster-789"),
			AutoscalerPoliciesJson: pulumi.String(string(policiesJSON)),
		})
		assert.NoError(t, err)
		assert.NotNil(t, autoscaler)

		return nil
	}, pulumi.WithMocks("project", "stack", &AutoscalerMocks{}))

	assert.NoError(t, err)
}

func TestAutoscalerScopedMode(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		autoscalerPolicies := map[string]interface{}{
			"enabled":     true,
			"isScopedMode": true, // Scoped mode - only manages specific namespaces
			"nodeTemplatesPartialMatchingEnabled": true,
			"unschedulablePods": map[string]interface{}{
				"enabled": true,
			},
			"nodeDownscaler": map[string]interface{}{
				"enabled": true,
				"evictor": map[string]interface{}{
					"enabled":    true,
					"scopedMode": true, // Evictor also in scoped mode
				},
			},
		}

		policiesJSON, err := json.Marshal(autoscalerPolicies)
		assert.NoError(t, err)

		autoscaler, err := castai.NewAutoscaler(ctx, "test-scoped-mode", &castai.AutoscalerArgs{
			ClusterId:              pulumi.String("scoped-cluster-321"),
			AutoscalerPoliciesJson: pulumi.String(string(policiesJSON)),
		})
		assert.NoError(t, err)
		assert.NotNil(t, autoscaler)

		return nil
	}, pulumi.WithMocks("project", "stack", &AutoscalerMocks{}))

	assert.NoError(t, err)
}

func TestAutoscalerMinimalConfiguration(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Minimal configuration - just enable basic autoscaling
		autoscalerPolicies := map[string]interface{}{
			"enabled": true,
		}

		policiesJSON, err := json.Marshal(autoscalerPolicies)
		assert.NoError(t, err)

		autoscaler, err := castai.NewAutoscaler(ctx, "test-minimal", &castai.AutoscalerArgs{
			ClusterId:              pulumi.String("minimal-cluster-999"),
			AutoscalerPoliciesJson: pulumi.String(string(policiesJSON)),
		})
		assert.NoError(t, err)
		assert.NotNil(t, autoscaler)

		return nil
	}, pulumi.WithMocks("project", "stack", &AutoscalerMocks{}))

	assert.NoError(t, err)
}

func TestAutoscalerProductionSettings(t *testing.T) {
	err := pulumi.RunErr(func(ctx *pulumi.Context) error {
		// Production settings: enabled but conservative
		autoscalerPolicies := map[string]interface{}{
			"enabled":                             true,
			"isScopedMode":                        false,
			"nodeTemplatesPartialMatchingEnabled": false,
			"unschedulablePods": map[string]interface{}{
				"enabled": true,
			},
			"nodeDownscaler": map[string]interface{}{
				"enabled": true,
				"emptyNodes": map[string]interface{}{
					"enabled": true,
				},
				"evictor": map[string]interface{}{
					"enabled":                true,
					"aggressiveMode":         false, // Conservative for production
					"cycleInterval":          "10m", // Longer cycle for stability
					"nodeGracePeriodMinutes": 15,   // Longer grace period
					"scopedMode":             false,
				},
			},
			"clusterLimits": map[string]interface{}{
				"enabled": true,
				"cpu": map[string]interface{}{
					"maxCores": 200, // Higher limit for production
					"minCores": 10,  // Ensure baseline capacity
				},
				"spotBackups": map[string]interface{}{
					"enabled":                      true,
					"spotBackupRestoreRateSeconds": 1800,
				},
			},
		}

		policiesJSON, err := json.Marshal(autoscalerPolicies)
		assert.NoError(t, err)

		autoscaler, err := castai.NewAutoscaler(ctx, "prod-autoscaler", &castai.AutoscalerArgs{
			ClusterId:              pulumi.String("prod-cluster-001"),
			AutoscalerPoliciesJson: pulumi.String(string(policiesJSON)),
		})
		assert.NoError(t, err)
		assert.NotNil(t, autoscaler)

		return nil
	}, pulumi.WithMocks("project", "stack", &AutoscalerMocks{}))

	assert.NoError(t, err)
}
