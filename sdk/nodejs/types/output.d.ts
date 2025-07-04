import * as outputs from "../types/output";
export interface ClusterAutoscalerPolicies {
    clusterLimits?: outputs.ClusterAutoscalerPoliciesClusterLimits;
    enabled?: boolean;
    nodeDownscaler?: outputs.ClusterAutoscalerPoliciesNodeDownscaler;
    spotInstances?: outputs.ClusterAutoscalerPoliciesSpotInstances;
    unschedulablePods?: outputs.ClusterAutoscalerPoliciesUnschedulablePods;
}
export interface ClusterAutoscalerPoliciesClusterLimits {
    cpu?: outputs.ClusterAutoscalerPoliciesClusterLimitsCpu;
    enabled?: boolean;
}
export interface ClusterAutoscalerPoliciesClusterLimitsCpu {
    maxCores?: number;
    minCores?: number;
}
export interface ClusterAutoscalerPoliciesNodeDownscaler {
    emptyNodes?: outputs.ClusterAutoscalerPoliciesNodeDownscalerEmptyNodes;
}
export interface ClusterAutoscalerPoliciesNodeDownscalerEmptyNodes {
    delaySeconds?: number;
    enabled?: boolean;
}
export interface ClusterAutoscalerPoliciesSpotInstances {
    clouds?: string[];
    enabled?: boolean;
}
export interface ClusterAutoscalerPoliciesUnschedulablePods {
    enabled?: boolean;
    headroom?: outputs.ClusterAutoscalerPoliciesUnschedulablePodsHeadroom;
    nodeConstraints?: outputs.ClusterAutoscalerPoliciesUnschedulablePodsNodeConstraints;
}
export interface ClusterAutoscalerPoliciesUnschedulablePodsHeadroom {
    cpuPercentage?: number;
    enabled?: boolean;
    memoryPercentage?: number;
}
export interface ClusterAutoscalerPoliciesUnschedulablePodsNodeConstraints {
    enabled?: boolean;
    maxNodeCpuCores?: number;
    maxNodeRamGib?: number;
    minNodeCpuCores?: number;
    minNodeRamGib?: number;
}
export interface ClusterInitializeParams {
    nodes: outputs.ClusterInitializeParamsNode[];
}
export interface ClusterInitializeParamsNode {
    cloud: string;
    role: string;
    shape: string;
}
export interface ClusterKubeconfig {
    clientCertificate: string;
    clientKey: string;
    clusterCaCertificate: string;
    host: string;
    rawConfig: string;
}
export interface CredentialsAws {
    accessKeyId: string;
    secretAccessKey: string;
}
export interface CredentialsAzure {
    servicePrincipalJson: string;
}
export interface CredentialsDo {
    token: string;
}
export interface CredentialsGcp {
    serviceAccountJson: string;
}
export interface GetClusterDataSourceAutoscalerPolicy {
    clusterLimits: outputs.GetClusterDataSourceAutoscalerPolicyClusterLimit[];
    enabled: boolean;
    nodeDownscalers: outputs.GetClusterDataSourceAutoscalerPolicyNodeDownscaler[];
    spotInstances: outputs.GetClusterDataSourceAutoscalerPolicySpotInstance[];
    unschedulablePods: outputs.GetClusterDataSourceAutoscalerPolicyUnschedulablePod[];
}
export interface GetClusterDataSourceAutoscalerPolicyClusterLimit {
    cpus: outputs.GetClusterDataSourceAutoscalerPolicyClusterLimitCpus[];
    enabled: boolean;
}
export interface GetClusterDataSourceAutoscalerPolicyClusterLimitCpus {
    maxCores: number;
    minCores: number;
}
export interface GetClusterDataSourceAutoscalerPolicyNodeDownscaler {
    emptyNodes: outputs.GetClusterDataSourceAutoscalerPolicyNodeDownscalerEmptyNode[];
}
export interface GetClusterDataSourceAutoscalerPolicyNodeDownscalerEmptyNode {
    delaySeconds: number;
    enabled: boolean;
}
export interface GetClusterDataSourceAutoscalerPolicySpotInstance {
    clouds: string[];
    enabled: boolean;
}
export interface GetClusterDataSourceAutoscalerPolicyUnschedulablePod {
    enabled: boolean;
    headrooms: outputs.GetClusterDataSourceAutoscalerPolicyUnschedulablePodHeadroom[];
    nodeConstraints: outputs.GetClusterDataSourceAutoscalerPolicyUnschedulablePodNodeConstraint[];
}
export interface GetClusterDataSourceAutoscalerPolicyUnschedulablePodHeadroom {
    cpuPercentage: number;
    enabled: boolean;
    memoryPercentage: number;
}
export interface GetClusterDataSourceAutoscalerPolicyUnschedulablePodNodeConstraint {
    enabled: boolean;
    maxNodeCpuCores: number;
    maxNodeRamGib: number;
    minNodeCpuCores: number;
    minNodeRamGib: number;
}
export interface GetClusterDataSourceKubeconfig {
    clientCertificate: string;
    clientKey: string;
    clusterCaCertificate: string;
    host: string;
    rawConfig: string;
}
