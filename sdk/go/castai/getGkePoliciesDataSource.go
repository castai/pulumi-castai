// Code generated by the Pulumi Terraform Bridge (tfgen) Tool DO NOT EDIT.
// *** WARNING: Do not edit by hand unless you're certain you know what you are doing! ***

package castai

import (
	"context"
	"reflect"

	"github.com/cast-ai/pulumi-castai/sdk/go/castai/internal"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func GetGkePoliciesDataSource(ctx *pulumi.Context, opts ...pulumi.InvokeOption) (*GetGkePoliciesDataSourceResult, error) {
	opts = internal.PkgInvokeDefaultOpts(opts)
	var rv GetGkePoliciesDataSourceResult
	err := ctx.Invoke("castai:gcp:GetGkePoliciesDataSource", nil, &rv, opts...)
	if err != nil {
		return nil, err
	}
	return &rv, nil
}

// A collection of values returned by GetGkePoliciesDataSource.
type GetGkePoliciesDataSourceResult struct {
	// The provider-assigned unique ID for this managed resource.
	Id       string   `pulumi:"id"`
	Policies []string `pulumi:"policies"`
}

func GetGkePoliciesDataSourceOutput(ctx *pulumi.Context, opts ...pulumi.InvokeOption) GetGkePoliciesDataSourceResultOutput {
	return pulumi.ToOutput(0).ApplyT(func(int) (GetGkePoliciesDataSourceResultOutput, error) {
		options := pulumi.InvokeOutputOptions{InvokeOptions: internal.PkgInvokeDefaultOpts(opts)}
		return ctx.InvokeOutput("castai:gcp:GetGkePoliciesDataSource", nil, GetGkePoliciesDataSourceResultOutput{}, options).(GetGkePoliciesDataSourceResultOutput), nil
	}).(GetGkePoliciesDataSourceResultOutput)
}

// A collection of values returned by GetGkePoliciesDataSource.
type GetGkePoliciesDataSourceResultOutput struct{ *pulumi.OutputState }

func (GetGkePoliciesDataSourceResultOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*GetGkePoliciesDataSourceResult)(nil)).Elem()
}

func (o GetGkePoliciesDataSourceResultOutput) ToGetGkePoliciesDataSourceResultOutput() GetGkePoliciesDataSourceResultOutput {
	return o
}

func (o GetGkePoliciesDataSourceResultOutput) ToGetGkePoliciesDataSourceResultOutputWithContext(ctx context.Context) GetGkePoliciesDataSourceResultOutput {
	return o
}

// The provider-assigned unique ID for this managed resource.
func (o GetGkePoliciesDataSourceResultOutput) Id() pulumi.StringOutput {
	return o.ApplyT(func(v GetGkePoliciesDataSourceResult) string { return v.Id }).(pulumi.StringOutput)
}

func (o GetGkePoliciesDataSourceResultOutput) Policies() pulumi.StringArrayOutput {
	return o.ApplyT(func(v GetGkePoliciesDataSourceResult) []string { return v.Policies }).(pulumi.StringArrayOutput)
}

func init() {
	pulumi.RegisterOutputType(GetGkePoliciesDataSourceResultOutput{})
}
