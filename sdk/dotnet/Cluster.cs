// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Pulumi.Serialization;

namespace Pulumi.CastAI
{
    [CastAIResourceType("castai:index:Cluster")]
    public partial class Cluster : global::Pulumi.CustomResource
    {
        [Output("autoscalerPolicies")]
        public Output<Outputs.ClusterAutoscalerPolicies?> AutoscalerPolicies { get; private set; } = null!;

        [Output("credentials")]
        public Output<ImmutableArray<string>> Credentials { get; private set; } = null!;

        [Output("initializeParams")]
        public Output<Outputs.ClusterInitializeParams> InitializeParams { get; private set; } = null!;

        [Output("kubeconfigs")]
        public Output<ImmutableArray<Outputs.ClusterKubeconfig>> Kubeconfigs { get; private set; } = null!;

        [Output("name")]
        public Output<string> Name { get; private set; } = null!;

        [Output("region")]
        public Output<string> Region { get; private set; } = null!;

        [Output("status")]
        public Output<string> Status { get; private set; } = null!;

        [Output("vpnType")]
        public Output<string?> VpnType { get; private set; } = null!;


        /// <summary>
        /// Create a Cluster resource with the given unique name, arguments, and options.
        /// </summary>
        ///
        /// <param name="name">The unique name of the resource</param>
        /// <param name="args">The arguments used to populate this resource's properties</param>
        /// <param name="options">A bag of options that control this resource's behavior</param>
        public Cluster(string name, ClusterArgs args, CustomResourceOptions? options = null)
            : base("castai:index:Cluster", name, args ?? new ClusterArgs(), MakeResourceOptions(options, ""))
        {
        }

        private Cluster(string name, Input<string> id, ClusterState? state = null, CustomResourceOptions? options = null)
            : base("castai:index:Cluster", name, state, MakeResourceOptions(options, id))
        {
        }

        private static CustomResourceOptions MakeResourceOptions(CustomResourceOptions? options, Input<string>? id)
        {
            var defaultOptions = new CustomResourceOptions
            {
                Version = Utilities.Version,
                PluginDownloadURL = "github://api.github.com/castai",
            };
            var merged = CustomResourceOptions.Merge(defaultOptions, options);
            // Override the ID if one was specified for consistency with other language SDKs.
            merged.Id = id ?? merged.Id;
            return merged;
        }
        /// <summary>
        /// Get an existing Cluster resource's state with the given name, ID, and optional extra
        /// properties used to qualify the lookup.
        /// </summary>
        ///
        /// <param name="name">The unique name of the resulting resource.</param>
        /// <param name="id">The unique provider ID of the resource to lookup.</param>
        /// <param name="state">Any extra arguments used during the lookup.</param>
        /// <param name="options">A bag of options that control this resource's behavior</param>
        public static Cluster Get(string name, Input<string> id, ClusterState? state = null, CustomResourceOptions? options = null)
        {
            return new Cluster(name, id, state, options);
        }
    }

    public sealed class ClusterArgs : global::Pulumi.ResourceArgs
    {
        [Input("autoscalerPolicies")]
        public Input<Inputs.ClusterAutoscalerPoliciesArgs>? AutoscalerPolicies { get; set; }

        [Input("credentials", required: true)]
        private InputList<string>? _credentials;
        public InputList<string> Credentials
        {
            get => _credentials ?? (_credentials = new InputList<string>());
            set => _credentials = value;
        }

        [Input("initializeParams", required: true)]
        public Input<Inputs.ClusterInitializeParamsArgs> InitializeParams { get; set; } = null!;

        [Input("name")]
        public Input<string>? Name { get; set; }

        [Input("region", required: true)]
        public Input<string> Region { get; set; } = null!;

        [Input("status")]
        public Input<string>? Status { get; set; }

        [Input("vpnType")]
        public Input<string>? VpnType { get; set; }

        public ClusterArgs()
        {
        }
        public static new ClusterArgs Empty => new ClusterArgs();
    }

    public sealed class ClusterState : global::Pulumi.ResourceArgs
    {
        [Input("autoscalerPolicies")]
        public Input<Inputs.ClusterAutoscalerPoliciesGetArgs>? AutoscalerPolicies { get; set; }

        [Input("credentials")]
        private InputList<string>? _credentials;
        public InputList<string> Credentials
        {
            get => _credentials ?? (_credentials = new InputList<string>());
            set => _credentials = value;
        }

        [Input("initializeParams")]
        public Input<Inputs.ClusterInitializeParamsGetArgs>? InitializeParams { get; set; }

        [Input("kubeconfigs")]
        private InputList<Inputs.ClusterKubeconfigGetArgs>? _kubeconfigs;
        public InputList<Inputs.ClusterKubeconfigGetArgs> Kubeconfigs
        {
            get => _kubeconfigs ?? (_kubeconfigs = new InputList<Inputs.ClusterKubeconfigGetArgs>());
            set => _kubeconfigs = value;
        }

        [Input("name")]
        public Input<string>? Name { get; set; }

        [Input("region")]
        public Input<string>? Region { get; set; }

        [Input("status")]
        public Input<string>? Status { get; set; }

        [Input("vpnType")]
        public Input<string>? VpnType { get; set; }

        public ClusterState()
        {
        }
        public static new ClusterState Empty => new ClusterState();
    }
}
