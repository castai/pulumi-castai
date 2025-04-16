// Code generated by the Pulumi Terraform Bridge (tfgen) Tool DO NOT EDIT.
// *** WARNING: Do not edit by hand unless you're certain you know what you are doing! ***

package castai

import (
	"context"
	"reflect"

	"github.com/cast-ai/pulumi-castai/sdk/go/castai/internal"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func GetEksClusterIdDataSource(ctx *pulumi.Context, args *GetEksClusterIdDataSourceArgs, opts ...pulumi.InvokeOption) (*GetEksClusterIdDataSourceResult, error) {
	opts = internal.PkgInvokeDefaultOpts(opts)
	var rv GetEksClusterIdDataSourceResult
	err := ctx.Invoke("castai:aws:GetEksClusterIdDataSource", args, &rv, opts...)
	if err != nil {
		return nil, err
	}
	return &rv, nil
}

// A collection of arguments for invoking GetEksClusterIdDataSource.
type GetEksClusterIdDataSourceArgs struct {
	AccountId   string `pulumi:"accountId"`
	ClusterName string `pulumi:"clusterName"`
	Region      string `pulumi:"region"`
}

// A collection of values returned by GetEksClusterIdDataSource.
type GetEksClusterIdDataSourceResult struct {
	AccountId   string `pulumi:"accountId"`
	ClusterName string `pulumi:"clusterName"`
	// The provider-assigned unique ID for this managed resource.
	Id     string `pulumi:"id"`
	Region string `pulumi:"region"`
}

func GetEksClusterIdDataSourceOutput(ctx *pulumi.Context, args GetEksClusterIdDataSourceOutputArgs, opts ...pulumi.InvokeOption) GetEksClusterIdDataSourceResultOutput {
	return pulumi.ToOutputWithContext(ctx.Context(), args).
		ApplyT(func(v interface{}) (GetEksClusterIdDataSourceResultOutput, error) {
			args := v.(GetEksClusterIdDataSourceArgs)
			options := pulumi.InvokeOutputOptions{InvokeOptions: internal.PkgInvokeDefaultOpts(opts)}
			return ctx.InvokeOutput("castai:aws:GetEksClusterIdDataSource", args, GetEksClusterIdDataSourceResultOutput{}, options).(GetEksClusterIdDataSourceResultOutput), nil
		}).(GetEksClusterIdDataSourceResultOutput)
}

// A collection of arguments for invoking GetEksClusterIdDataSource.
type GetEksClusterIdDataSourceOutputArgs struct {
	AccountId   pulumi.StringInput `pulumi:"accountId"`
	ClusterName pulumi.StringInput `pulumi:"clusterName"`
	Region      pulumi.StringInput `pulumi:"region"`
}

func (GetEksClusterIdDataSourceOutputArgs) ElementType() reflect.Type {
	return reflect.TypeOf((*GetEksClusterIdDataSourceArgs)(nil)).Elem()
}

// A collection of values returned by GetEksClusterIdDataSource.
type GetEksClusterIdDataSourceResultOutput struct{ *pulumi.OutputState }

func (GetEksClusterIdDataSourceResultOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*GetEksClusterIdDataSourceResult)(nil)).Elem()
}

func (o GetEksClusterIdDataSourceResultOutput) ToGetEksClusterIdDataSourceResultOutput() GetEksClusterIdDataSourceResultOutput {
	return o
}

func (o GetEksClusterIdDataSourceResultOutput) ToGetEksClusterIdDataSourceResultOutputWithContext(ctx context.Context) GetEksClusterIdDataSourceResultOutput {
	return o
}

func (o GetEksClusterIdDataSourceResultOutput) AccountId() pulumi.StringOutput {
	return o.ApplyT(func(v GetEksClusterIdDataSourceResult) string { return v.AccountId }).(pulumi.StringOutput)
}

func (o GetEksClusterIdDataSourceResultOutput) ClusterName() pulumi.StringOutput {
	return o.ApplyT(func(v GetEksClusterIdDataSourceResult) string { return v.ClusterName }).(pulumi.StringOutput)
}

// The provider-assigned unique ID for this managed resource.
func (o GetEksClusterIdDataSourceResultOutput) Id() pulumi.StringOutput {
	return o.ApplyT(func(v GetEksClusterIdDataSourceResult) string { return v.Id }).(pulumi.StringOutput)
}

func (o GetEksClusterIdDataSourceResultOutput) Region() pulumi.StringOutput {
	return o.ApplyT(func(v GetEksClusterIdDataSourceResult) string { return v.Region }).(pulumi.StringOutput)
}

func init() {
	pulumi.RegisterOutputType(GetEksClusterIdDataSourceResultOutput{})
}
