// Code generated by the Pulumi Terraform Bridge (tfgen) Tool DO NOT EDIT.
// *** WARNING: Do not edit by hand unless you're certain you know what you are doing! ***

package castai

import (
	"context"
	"reflect"

	"github.com/cast-ai/pulumi-castai/sdk/go/castai/internal"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func GetEksUserArnDataSource(ctx *pulumi.Context, args *GetEksUserArnDataSourceArgs, opts ...pulumi.InvokeOption) (*GetEksUserArnDataSourceResult, error) {
	opts = internal.PkgInvokeDefaultOpts(opts)
	var rv GetEksUserArnDataSourceResult
	err := ctx.Invoke("castai:aws:GetEksUserArnDataSource", args, &rv, opts...)
	if err != nil {
		return nil, err
	}
	return &rv, nil
}

// A collection of arguments for invoking GetEksUserArnDataSource.
type GetEksUserArnDataSourceArgs struct {
	ClusterId string `pulumi:"clusterId"`
}

// A collection of values returned by GetEksUserArnDataSource.
type GetEksUserArnDataSourceResult struct {
	Arn       string `pulumi:"arn"`
	ClusterId string `pulumi:"clusterId"`
	// The provider-assigned unique ID for this managed resource.
	Id string `pulumi:"id"`
}

func GetEksUserArnDataSourceOutput(ctx *pulumi.Context, args GetEksUserArnDataSourceOutputArgs, opts ...pulumi.InvokeOption) GetEksUserArnDataSourceResultOutput {
	return pulumi.ToOutputWithContext(ctx.Context(), args).
		ApplyT(func(v interface{}) (GetEksUserArnDataSourceResultOutput, error) {
			args := v.(GetEksUserArnDataSourceArgs)
			options := pulumi.InvokeOutputOptions{InvokeOptions: internal.PkgInvokeDefaultOpts(opts)}
			return ctx.InvokeOutput("castai:aws:GetEksUserArnDataSource", args, GetEksUserArnDataSourceResultOutput{}, options).(GetEksUserArnDataSourceResultOutput), nil
		}).(GetEksUserArnDataSourceResultOutput)
}

// A collection of arguments for invoking GetEksUserArnDataSource.
type GetEksUserArnDataSourceOutputArgs struct {
	ClusterId pulumi.StringInput `pulumi:"clusterId"`
}

func (GetEksUserArnDataSourceOutputArgs) ElementType() reflect.Type {
	return reflect.TypeOf((*GetEksUserArnDataSourceArgs)(nil)).Elem()
}

// A collection of values returned by GetEksUserArnDataSource.
type GetEksUserArnDataSourceResultOutput struct{ *pulumi.OutputState }

func (GetEksUserArnDataSourceResultOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*GetEksUserArnDataSourceResult)(nil)).Elem()
}

func (o GetEksUserArnDataSourceResultOutput) ToGetEksUserArnDataSourceResultOutput() GetEksUserArnDataSourceResultOutput {
	return o
}

func (o GetEksUserArnDataSourceResultOutput) ToGetEksUserArnDataSourceResultOutputWithContext(ctx context.Context) GetEksUserArnDataSourceResultOutput {
	return o
}

func (o GetEksUserArnDataSourceResultOutput) Arn() pulumi.StringOutput {
	return o.ApplyT(func(v GetEksUserArnDataSourceResult) string { return v.Arn }).(pulumi.StringOutput)
}

func (o GetEksUserArnDataSourceResultOutput) ClusterId() pulumi.StringOutput {
	return o.ApplyT(func(v GetEksUserArnDataSourceResult) string { return v.ClusterId }).(pulumi.StringOutput)
}

// The provider-assigned unique ID for this managed resource.
func (o GetEksUserArnDataSourceResultOutput) Id() pulumi.StringOutput {
	return o.ApplyT(func(v GetEksUserArnDataSourceResult) string { return v.Id }).(pulumi.StringOutput)
}

func init() {
	pulumi.RegisterOutputType(GetEksUserArnDataSourceResultOutput{})
}
