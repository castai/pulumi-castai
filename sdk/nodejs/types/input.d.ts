import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
export interface ClusterAutoscalerPolicies {
    clusterLimits?: pulumi.Input<inputs.ClusterAutoscalerPoliciesClusterLimits>;
    enabled?: pulumi.Input<boolean>;
    nodeDownscaler?: pulumi.Input<inputs.ClusterAutoscalerPoliciesNodeDownscaler>;
    spotInstances?: pulumi.Input<inputs.ClusterAutoscalerPoliciesSpotInstances>;
    unschedulablePods?: pulumi.Input<inputs.ClusterAutoscalerPoliciesUnschedulablePods>;
}
export interface ClusterAutoscalerPoliciesClusterLimits {
    cpu?: pulumi.Input<inputs.ClusterAutoscalerPoliciesClusterLimitsCpu>;
    enabled?: pulumi.Input<boolean>;
}
export interface ClusterAutoscalerPoliciesClusterLimitsCpu {
    maxCores?: pulumi.Input<number>;
    minCores?: pulumi.Input<number>;
}
export interface ClusterAutoscalerPoliciesNodeDownscaler {
    emptyNodes?: pulumi.Input<inputs.ClusterAutoscalerPoliciesNodeDownscalerEmptyNodes>;
}
export interface ClusterAutoscalerPoliciesNodeDownscalerEmptyNodes {
    delaySeconds?: pulumi.Input<number>;
    enabled?: pulumi.Input<boolean>;
}
export interface ClusterAutoscalerPoliciesSpotInstances {
    clouds?: pulumi.Input<pulumi.Input<string>[]>;
    enabled?: pulumi.Input<boolean>;
}
export interface ClusterAutoscalerPoliciesUnschedulablePods {
    enabled?: pulumi.Input<boolean>;
    headroom?: pulumi.Input<inputs.ClusterAutoscalerPoliciesUnschedulablePodsHeadroom>;
    nodeConstraints?: pulumi.Input<inputs.ClusterAutoscalerPoliciesUnschedulablePodsNodeConstraints>;
}
export interface ClusterAutoscalerPoliciesUnschedulablePodsHeadroom {
    cpuPercentage?: pulumi.Input<number>;
    enabled?: pulumi.Input<boolean>;
    memoryPercentage?: pulumi.Input<number>;
}
export interface ClusterAutoscalerPoliciesUnschedulablePodsNodeConstraints {
    enabled?: pulumi.Input<boolean>;
    maxNodeCpuCores?: pulumi.Input<number>;
    maxNodeRamGib?: pulumi.Input<number>;
    minNodeCpuCores?: pulumi.Input<number>;
    minNodeRamGib?: pulumi.Input<number>;
}
export interface ClusterInitializeParams {
    nodes: pulumi.Input<pulumi.Input<inputs.ClusterInitializeParamsNode>[]>;
}
export interface ClusterInitializeParamsNode {
    cloud: pulumi.Input<string>;
    role: pulumi.Input<string>;
    shape: pulumi.Input<string>;
}
export interface ClusterKubeconfig {
    clientCertificate?: pulumi.Input<string>;
    clientKey?: pulumi.Input<string>;
    clusterCaCertificate?: pulumi.Input<string>;
    host?: pulumi.Input<string>;
    rawConfig?: pulumi.Input<string>;
}
export interface CredentialsAws {
    accessKeyId: pulumi.Input<string>;
    secretAccessKey: pulumi.Input<string>;
}
export interface CredentialsAzure {
    servicePrincipalJson: pulumi.Input<string>;
}
export interface CredentialsDo {
    token: pulumi.Input<string>;
}
export interface CredentialsGcp {
    serviceAccountJson: pulumi.Input<string>;
}
