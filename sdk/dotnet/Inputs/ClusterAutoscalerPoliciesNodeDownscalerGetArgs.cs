// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Pulumi.Serialization;

namespace Pulumi.CastAI.Inputs
{

    public sealed class ClusterAutoscalerPoliciesNodeDownscalerGetArgs : global::Pulumi.ResourceArgs
    {
        [Input("emptyNodes")]
        public Input<Inputs.ClusterAutoscalerPoliciesNodeDownscalerEmptyNodesGetArgs>? EmptyNodes { get; set; }

        public ClusterAutoscalerPoliciesNodeDownscalerGetArgs()
        {
        }
        public static new ClusterAutoscalerPoliciesNodeDownscalerGetArgs Empty => new ClusterAutoscalerPoliciesNodeDownscalerGetArgs();
    }
}
