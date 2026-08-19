package tests

import (
	"testing"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/castai/pulumi-castai/sdk/go/castai/workload"
	"github.com/pulumi/pulumi/sdk/v3/go/common/resource"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/stretchr/testify/assert"
)

// CastAINewResourceMocks is a permissive mock that returns a deterministic id
// for every resource type. Data source invocations return minimal values.
type CastAINewResourceMocks struct {
 pulumi.MockResourceMonitor
}

func (m *CastAINewResourceMocks) NewResource(args pulumi.MockResourceArgs) (string, resource.PropertyMap, error) {
 outputs := args.Inputs.Copy()
 id := args.Name + "-id"
 outputs["id"] = resource.NewStringProperty(id)
 return id, outputs, nil
}

func (m *CastAINewResourceMocks) Call(args pulumi.MockCallArgs) (resource.PropertyMap, error) {
 return resource.PropertyMap{}, nil
}

// RunNewResource is a helper that runs a Pulumi program with the new-resource
// mock monitor so that resource registration succeeds.
func runNewResource(t *testing.T, program func(ctx *pulumi.Context) error) {
 t.Helper()
 err := pulumi.RunErr(program, pulumi.WithMocks("project", "stack", &CastAINewResourceMocks{}))
 assert.NoError(t, err)
}

func TestCacheGroupConstructable(t *testing.T) {
 runNewResource(t, func(ctx *pulumi.Context) error {
 res, err := castai.NewCacheGroup(ctx, "test-cache-group", &castai.CacheGroupArgs{
 ProtocolType: pulumi.String("MySQL"),
 })
 assert.NoError(t, err)
 assert.NotNil(t, res)
 return nil
 })
}

func TestCacheConfigurationConstructable(t *testing.T) {
 runNewResource(t, func(ctx *pulumi.Context) error {
 res, err := castai.NewCacheConfiguration(ctx, "test-cache-config", &castai.CacheConfigurationArgs{
 CacheGroupId: pulumi.String("cg-123"),
 DatabaseName: pulumi.String("appdb"),
 Mode: pulumi.String("Auto"),
 })
 assert.NoError(t, err)
 assert.NotNil(t, res)
 return nil
 })
}

func TestCacheRuleConstructable(t *testing.T) {
 runNewResource(t, func(ctx *pulumi.Context) error {
 res, err := castai.NewCacheRule(ctx, "test-cache-rule", &castai.CacheRuleArgs{
 CacheConfigurationId: pulumi.String("cc-123"),
 CacheGroupId: pulumi.String("cg-123"),
 Mode: pulumi.String("Auto"),
 })
 assert.NoError(t, err)
 assert.NotNil(t, res)
 return nil
 })
}

func TestAiOptimizerModelRegistryConstructable(t *testing.T) {
 runNewResource(t, func(ctx *pulumi.Context) error {
 res, err := castai.NewAiOptimizerModelRegistry(ctx, "test-model-registry", &castai.AiOptimizerModelRegistryArgs{
 Credentials: pulumi.String("mock-credentials"),
 })
 assert.NoError(t, err)
 assert.NotNil(t, res)
 return nil
 })
}

func TestAiOptimizerModelSpecsConstructable(t *testing.T) {
 runNewResource(t, func(ctx *pulumi.Context) error {
 res, err := castai.NewAiOptimizerModelSpecs(ctx, "test-model-specs", &castai.AiOptimizerModelSpecsArgs{
 Model: pulumi.String("my-model"),
 RegistryType: pulumi.String("public"),
 })
 assert.NoError(t, err)
 assert.NotNil(t, res)
 return nil
 })
}

func TestAiOptimizerHostedModelConstructable(t *testing.T) {
 runNewResource(t, func(ctx *pulumi.Context) error {
 res, err := castai.NewAiOptimizerHostedModel(ctx, "test-hosted-model", &castai.AiOptimizerHostedModelArgs{
 ClusterId: pulumi.String("cluster-123"),
 ModelSpecsId: pulumi.String("ms-123"),
 Port: pulumi.Int(8080),
 Service: pulumi.String("svc-123"),
 })
 assert.NoError(t, err)
 assert.NotNil(t, res)
 return nil
 })
}

func TestEnterpriseServiceAccountConstructable(t *testing.T) {
 runNewResource(t, func(ctx *pulumi.Context) error {
 res, err := castai.NewEnterpriseServiceAccount(ctx, "test-enterprise-sa", &castai.EnterpriseServiceAccountArgs{
 EnterpriseId: pulumi.String("ent-123"),
 })
 assert.NoError(t, err)
 assert.NotNil(t, res)
 return nil
 })
}

func TestWorkloadCustomMetricsDataSourceConstructable(t *testing.T) {
 runNewResource(t, func(ctx *pulumi.Context) error {
 res, err := castai.NewWorkloadCustomMetricsDataSource(ctx, "test-workload-cmd", &castai.WorkloadCustomMetricsDataSourceArgs{
 ClusterId: pulumi.String("cluster-123"),
 Prometheus: &workload.WorkloadCustomMetricsDataSourcePrometheusArgs{
 Url: pulumi.String("http://prometheus:9090"),
 },
 })
 assert.NoError(t, err)
 assert.NotNil(t, res)
 return nil
 })
}

func TestPodMutationConstructable(t *testing.T) {
 runNewResource(t, func(ctx *pulumi.Context) error {
 res, err := castai.NewPodMutation(ctx, "test-pod-mutation", &castai.PodMutationArgs{
 ClusterId: pulumi.String("cluster-123"),
 Enabled: pulumi.Bool(true),
 FilterV2: &castai.PodMutationFilterV2Args{},
 })
 assert.NoError(t, err)
 assert.NotNil(t, res)
 return nil
 })
}
