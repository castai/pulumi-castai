module github.com/cast-ai/pulumi-castai/examples/go/multi-cloud

go 1.19

require (
	github.com/cast-ai/pulumi-castai/sdk/go/castai v0.0.0
	github.com/pulumi/pulumi/sdk/v3 v3.0.0
)

replace github.com/cast-ai/pulumi-castai/sdk/go/castai => ../../../sdk/go/castai 