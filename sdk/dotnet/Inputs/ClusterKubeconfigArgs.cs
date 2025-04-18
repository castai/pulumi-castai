// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading.Tasks;
using Pulumi.Serialization;

namespace Pulumi.CastAI.Inputs
{

    public sealed class ClusterKubeconfigArgs : global::Pulumi.ResourceArgs
    {
        [Input("clientCertificate")]
        public Input<string>? ClientCertificate { get; set; }

        [Input("clientKey")]
        private Input<string>? _clientKey;
        public Input<string>? ClientKey
        {
            get => _clientKey;
            set
            {
                var emptySecret = Output.CreateSecret(0);
                _clientKey = Output.Tuple<Input<string>?, int>(value, emptySecret).Apply(t => t.Item1);
            }
        }

        [Input("clusterCaCertificate")]
        public Input<string>? ClusterCaCertificate { get; set; }

        [Input("host")]
        public Input<string>? Host { get; set; }

        [Input("rawConfig")]
        private Input<string>? _rawConfig;
        public Input<string>? RawConfig
        {
            get => _rawConfig;
            set
            {
                var emptySecret = Output.CreateSecret(0);
                _rawConfig = Output.Tuple<Input<string>?, int>(value, emptySecret).Apply(t => t.Item1);
            }
        }

        public ClusterKubeconfigArgs()
        {
        }
        public static new ClusterKubeconfigArgs Empty => new ClusterKubeconfigArgs();
    }
}
