module github.com/castai/pulumi-castai/examples/go

go 1.20

require (
	github.com/castai/pulumi-castai v0.1.62
	github.com/pulumi/pulumi/sdk/v3 v3.100.0
)

// Use the local SDK for development
replace github.com/castai/pulumi-castai => ../../
