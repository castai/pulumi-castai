// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Pulumi.Serialization;

namespace Pulumi.CastAI
{
    public static class GetClusterDataSource
    {
        public static Task<GetClusterDataSourceResult> InvokeAsync(GetClusterDataSourceArgs args, InvokeOptions? options = null)
            => global::Pulumi.Deployment.Instance.InvokeAsync<GetClusterDataSourceResult>("castai:index:GetClusterDataSource", args ?? new GetClusterDataSourceArgs(), options.WithDefaults());

        public static Output<GetClusterDataSourceResult> Invoke(GetClusterDataSourceInvokeArgs args, InvokeOptions? options = null)
            => global::Pulumi.Deployment.Instance.Invoke<GetClusterDataSourceResult>("castai:index:GetClusterDataSource", args ?? new GetClusterDataSourceInvokeArgs(), options.WithDefaults());

        public static Output<GetClusterDataSourceResult> Invoke(GetClusterDataSourceInvokeArgs args, InvokeOutputOptions options)
            => global::Pulumi.Deployment.Instance.Invoke<GetClusterDataSourceResult>("castai:index:GetClusterDataSource", args ?? new GetClusterDataSourceInvokeArgs(), options.WithDefaults());
    }


    public sealed class GetClusterDataSourceArgs : global::Pulumi.InvokeArgs
    {
        /// <summary>
        /// The ID of this resource.
        /// </summary>
        [Input("id", required: true)]
        public string Id { get; set; } = null!;

        public GetClusterDataSourceArgs()
        {
        }
        public static new GetClusterDataSourceArgs Empty => new GetClusterDataSourceArgs();
    }

    public sealed class GetClusterDataSourceInvokeArgs : global::Pulumi.InvokeArgs
    {
        /// <summary>
        /// The ID of this resource.
        /// </summary>
        [Input("id", required: true)]
        public Input<string> Id { get; set; } = null!;

        public GetClusterDataSourceInvokeArgs()
        {
        }
        public static new GetClusterDataSourceInvokeArgs Empty => new GetClusterDataSourceInvokeArgs();
    }


    [OutputType]
    public sealed class GetClusterDataSourceResult
    {
        public readonly ImmutableArray<Outputs.GetClusterDataSourceAutoscalerPolicyResult> AutoscalerPolicies;
        public readonly ImmutableArray<string> Credentials;
        /// <summary>
        /// The ID of this resource.
        /// </summary>
        public readonly string Id;
        public readonly ImmutableArray<Outputs.GetClusterDataSourceKubeconfigResult> Kubeconfigs;
        public readonly string Name;
        public readonly string Region;
        public readonly string Status;

        [OutputConstructor]
        private GetClusterDataSourceResult(
            ImmutableArray<Outputs.GetClusterDataSourceAutoscalerPolicyResult> autoscalerPolicies,

            ImmutableArray<string> credentials,

            string id,

            ImmutableArray<Outputs.GetClusterDataSourceKubeconfigResult> kubeconfigs,

            string name,

            string region,

            string status)
        {
            AutoscalerPolicies = autoscalerPolicies;
            Credentials = credentials;
            Id = id;
            Kubeconfigs = kubeconfigs;
            Name = name;
            Region = region;
            Status = status;
        }
    }
}
