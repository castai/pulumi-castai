// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "./utilities";

// Export members:
export { AksClusterArgs, AksClusterState } from "./aksCluster";
export type AksCluster = import("./aksCluster").AksCluster;
export const AksCluster: typeof import("./aksCluster").AksCluster = null as any;
utilities.lazyLoad(exports, ["AksCluster"], () => require("./aksCluster"));

export { AutoscalerArgs, AutoscalerState } from "./autoscaler";
export type Autoscaler = import("./autoscaler").Autoscaler;
export const Autoscaler: typeof import("./autoscaler").Autoscaler = null as any;
utilities.lazyLoad(exports, ["Autoscaler"], () => require("./autoscaler"));

export { ClusterArgs, ClusterState } from "./cluster";
export type Cluster = import("./cluster").Cluster;
export const Cluster: typeof import("./cluster").Cluster = null as any;
utilities.lazyLoad(exports, ["Cluster"], () => require("./cluster"));

export { ClusterTokenArgs, ClusterTokenState } from "./clusterToken";
export type ClusterToken = import("./clusterToken").ClusterToken;
export const ClusterToken: typeof import("./clusterToken").ClusterToken = null as any;
utilities.lazyLoad(exports, ["ClusterToken"], () => require("./clusterToken"));

export { CredentialsArgs, CredentialsState } from "./credentials";
export type Credentials = import("./credentials").Credentials;
export const Credentials: typeof import("./credentials").Credentials = null as any;
utilities.lazyLoad(exports, ["Credentials"], () => require("./credentials"));

export { EksClusterArgs, EksClusterState } from "./eksCluster";
export type EksCluster = import("./eksCluster").EksCluster;
export const EksCluster: typeof import("./eksCluster").EksCluster = null as any;
utilities.lazyLoad(exports, ["EksCluster"], () => require("./eksCluster"));

export { GetClusterDataSourceArgs, GetClusterDataSourceResult, GetClusterDataSourceOutputArgs } from "./getClusterDataSource";
export const getClusterDataSource: typeof import("./getClusterDataSource").getClusterDataSource = null as any;
export const getClusterDataSourceOutput: typeof import("./getClusterDataSource").getClusterDataSourceOutput = null as any;
utilities.lazyLoad(exports, ["getClusterDataSource","getClusterDataSourceOutput"], () => require("./getClusterDataSource"));

export { GetCredentialsDataSourceArgs, GetCredentialsDataSourceResult, GetCredentialsDataSourceOutputArgs } from "./getCredentialsDataSource";
export const getCredentialsDataSource: typeof import("./getCredentialsDataSource").getCredentialsDataSource = null as any;
export const getCredentialsDataSourceOutput: typeof import("./getCredentialsDataSource").getCredentialsDataSourceOutput = null as any;
utilities.lazyLoad(exports, ["getCredentialsDataSource","getCredentialsDataSourceOutput"], () => require("./getCredentialsDataSource"));

export { GetEksClusterIdDataSourceArgs, GetEksClusterIdDataSourceResult, GetEksClusterIdDataSourceOutputArgs } from "./getEksClusterIdDataSource";
export const getEksClusterIdDataSource: typeof import("./getEksClusterIdDataSource").getEksClusterIdDataSource = null as any;
export const getEksClusterIdDataSourceOutput: typeof import("./getEksClusterIdDataSource").getEksClusterIdDataSourceOutput = null as any;
utilities.lazyLoad(exports, ["getEksClusterIdDataSource","getEksClusterIdDataSourceOutput"], () => require("./getEksClusterIdDataSource"));

export { GetEksSettingsDataSourceArgs, GetEksSettingsDataSourceResult, GetEksSettingsDataSourceOutputArgs } from "./getEksSettingsDataSource";
export const getEksSettingsDataSource: typeof import("./getEksSettingsDataSource").getEksSettingsDataSource = null as any;
export const getEksSettingsDataSourceOutput: typeof import("./getEksSettingsDataSource").getEksSettingsDataSourceOutput = null as any;
utilities.lazyLoad(exports, ["getEksSettingsDataSource","getEksSettingsDataSourceOutput"], () => require("./getEksSettingsDataSource"));

export { GetEksUserArnDataSourceArgs, GetEksUserArnDataSourceResult, GetEksUserArnDataSourceOutputArgs } from "./getEksUserArnDataSource";
export const getEksUserArnDataSource: typeof import("./getEksUserArnDataSource").getEksUserArnDataSource = null as any;
export const getEksUserArnDataSourceOutput: typeof import("./getEksUserArnDataSource").getEksUserArnDataSourceOutput = null as any;
utilities.lazyLoad(exports, ["getEksUserArnDataSource","getEksUserArnDataSourceOutput"], () => require("./getEksUserArnDataSource"));

export { GetGkePoliciesDataSourceResult } from "./getGkePoliciesDataSource";
export const getGkePoliciesDataSource: typeof import("./getGkePoliciesDataSource").getGkePoliciesDataSource = null as any;
export const getGkePoliciesDataSourceOutput: typeof import("./getGkePoliciesDataSource").getGkePoliciesDataSourceOutput = null as any;
utilities.lazyLoad(exports, ["getGkePoliciesDataSource","getGkePoliciesDataSourceOutput"], () => require("./getGkePoliciesDataSource"));

export { GkeClusterArgs, GkeClusterState } from "./gkeCluster";
export type GkeCluster = import("./gkeCluster").GkeCluster;
export const GkeCluster: typeof import("./gkeCluster").GkeCluster = null as any;
utilities.lazyLoad(exports, ["GkeCluster"], () => require("./gkeCluster"));

export { ProviderArgs } from "./provider";
export type Provider = import("./provider").Provider;
export const Provider: typeof import("./provider").Provider = null as any;
utilities.lazyLoad(exports, ["Provider"], () => require("./provider"));


// Export sub-modules:
import * as config from "./config";
import * as types from "./types";

export {
    config,
    types,
};

const _module = {
    version: utilities.getVersion(),
    construct: (name: string, type: string, urn: string): pulumi.Resource => {
        switch (type) {
            case "castai:autoscaling:Autoscaler":
                return new Autoscaler(name, <any>undefined, { urn })
            case "castai:aws:EksCluster":
                return new EksCluster(name, <any>undefined, { urn })
            case "castai:azure:AksCluster":
                return new AksCluster(name, <any>undefined, { urn })
            case "castai:gcp:GkeCluster":
                return new GkeCluster(name, <any>undefined, { urn })
            case "castai:index:Cluster":
                return new Cluster(name, <any>undefined, { urn })
            case "castai:index:ClusterToken":
                return new ClusterToken(name, <any>undefined, { urn })
            case "castai:index:Credentials":
                return new Credentials(name, <any>undefined, { urn })
            default:
                throw new Error(`unknown resource type ${type}`);
        }
    },
};
pulumi.runtime.registerResourceModule("castai", "autoscaling", _module)
pulumi.runtime.registerResourceModule("castai", "aws", _module)
pulumi.runtime.registerResourceModule("castai", "azure", _module)
pulumi.runtime.registerResourceModule("castai", "gcp", _module)
pulumi.runtime.registerResourceModule("castai", "index", _module)
pulumi.runtime.registerResourcePackage("castai", {
    version: utilities.getVersion(),
    constructProvider: (name: string, type: string, urn: string): pulumi.ProviderResource => {
        if (type !== "pulumi:providers:castai") {
            throw new Error(`unknown provider type ${type}`);
        }
        return new Provider(name, <any>undefined, { urn });
    },
});
