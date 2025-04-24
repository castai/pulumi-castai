module github.com/castai/pulumi-castai/sdk/go/castai

go 1.20

require (
	github.com/blang/semver v3.5.1+incompatible
	github.com/pulumi/pulumi/sdk/v3 v3.96.1
)

// Ensure we're using compatible versions
replace (
	github.com/hashicorp/go-getter => github.com/hashicorp/go-getter v1.7.0
	github.com/hashicorp/terraform-plugin-sdk/v2 => github.com/hashicorp/terraform-plugin-sdk/v2 v2.25.0
)
