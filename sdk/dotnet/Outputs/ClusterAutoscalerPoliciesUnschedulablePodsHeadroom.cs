// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Pulumi.Serialization;

namespace Pulumi.CastAI.Outputs
{

    [OutputType]
    public sealed class ClusterAutoscalerPoliciesUnschedulablePodsHeadroom
    {
        public readonly int? CpuPercentage;
        public readonly bool? Enabled;
        public readonly int? MemoryPercentage;

        [OutputConstructor]
        private ClusterAutoscalerPoliciesUnschedulablePodsHeadroom(
            int? cpuPercentage,

            bool? enabled,

            int? memoryPercentage)
        {
            CpuPercentage = cpuPercentage;
            Enabled = enabled;
            MemoryPercentage = memoryPercentage;
        }
    }
}
