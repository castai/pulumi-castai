// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Pulumi.Serialization;

namespace Pulumi.CastAI.Inputs
{

    public sealed class ClusterAutoscalerPoliciesSpotInstancesArgs : global::Pulumi.ResourceArgs
    {
        [Input("clouds")]
        private InputList<string>? _clouds;
        public InputList<string> Clouds
        {
            get => _clouds ?? (_clouds = new InputList<string>());
            set => _clouds = value;
        }

        [Input("enabled")]
        public Input<bool>? Enabled { get; set; }

        public ClusterAutoscalerPoliciesSpotInstancesArgs()
        {
        }
        public static new ClusterAutoscalerPoliciesSpotInstancesArgs Empty => new ClusterAutoscalerPoliciesSpotInstancesArgs();
    }
}
