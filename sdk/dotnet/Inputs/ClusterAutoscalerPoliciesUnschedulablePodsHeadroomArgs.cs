// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Pulumi.Serialization;

namespace Pulumi.CastAI.Inputs
{

    public sealed class ClusterAutoscalerPoliciesUnschedulablePodsHeadroomArgs : global::Pulumi.ResourceArgs
    {
        [Input("cpuPercentage")]
        public Input<int>? CpuPercentage { get; set; }

        [Input("enabled")]
        public Input<bool>? Enabled { get; set; }

        [Input("memoryPercentage")]
        public Input<int>? MemoryPercentage { get; set; }

        public ClusterAutoscalerPoliciesUnschedulablePodsHeadroomArgs()
        {
        }
        public static new ClusterAutoscalerPoliciesUnschedulablePodsHeadroomArgs Empty => new ClusterAutoscalerPoliciesUnschedulablePodsHeadroomArgs();
    }
}
