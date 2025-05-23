// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Pulumi.Serialization;

namespace Pulumi.CastAI
{
    public static class GetEksUserArnDataSource
    {
        public static Task<GetEksUserArnDataSourceResult> InvokeAsync(GetEksUserArnDataSourceArgs args, InvokeOptions? options = null)
            => global::Pulumi.Deployment.Instance.InvokeAsync<GetEksUserArnDataSourceResult>("castai:aws:GetEksUserArnDataSource", args ?? new GetEksUserArnDataSourceArgs(), options.WithDefaults());

        public static Output<GetEksUserArnDataSourceResult> Invoke(GetEksUserArnDataSourceInvokeArgs args, InvokeOptions? options = null)
            => global::Pulumi.Deployment.Instance.Invoke<GetEksUserArnDataSourceResult>("castai:aws:GetEksUserArnDataSource", args ?? new GetEksUserArnDataSourceInvokeArgs(), options.WithDefaults());

        public static Output<GetEksUserArnDataSourceResult> Invoke(GetEksUserArnDataSourceInvokeArgs args, InvokeOutputOptions options)
            => global::Pulumi.Deployment.Instance.Invoke<GetEksUserArnDataSourceResult>("castai:aws:GetEksUserArnDataSource", args ?? new GetEksUserArnDataSourceInvokeArgs(), options.WithDefaults());
    }


    public sealed class GetEksUserArnDataSourceArgs : global::Pulumi.InvokeArgs
    {
        [Input("clusterId", required: true)]
        public string ClusterId { get; set; } = null!;

        public GetEksUserArnDataSourceArgs()
        {
        }
        public static new GetEksUserArnDataSourceArgs Empty => new GetEksUserArnDataSourceArgs();
    }

    public sealed class GetEksUserArnDataSourceInvokeArgs : global::Pulumi.InvokeArgs
    {
        [Input("clusterId", required: true)]
        public Input<string> ClusterId { get; set; } = null!;

        public GetEksUserArnDataSourceInvokeArgs()
        {
        }
        public static new GetEksUserArnDataSourceInvokeArgs Empty => new GetEksUserArnDataSourceInvokeArgs();
    }


    [OutputType]
    public sealed class GetEksUserArnDataSourceResult
    {
        public readonly string Arn;
        public readonly string ClusterId;
        /// <summary>
        /// The provider-assigned unique ID for this managed resource.
        /// </summary>
        public readonly string Id;

        [OutputConstructor]
        private GetEksUserArnDataSourceResult(
            string arn,

            string clusterId,

            string id)
        {
            Arn = arn;
            ClusterId = clusterId;
            Id = id;
        }
    }
}
