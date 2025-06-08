import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getClusterDataSource(args: GetClusterDataSourceArgs, opts?: pulumi.InvokeOptions): Promise<GetClusterDataSourceResult>;
/**
 * A collection of arguments for invoking GetClusterDataSource.
 */
export interface GetClusterDataSourceArgs {
    /**
     * The ID of this resource.
     */
    id: string;
}
/**
 * A collection of values returned by GetClusterDataSource.
 */
export interface GetClusterDataSourceResult {
    readonly autoscalerPolicies: outputs.GetClusterDataSourceAutoscalerPolicy[];
    readonly credentials: string[];
    /**
     * The ID of this resource.
     */
    readonly id: string;
    readonly kubeconfigs: outputs.GetClusterDataSourceKubeconfig[];
    readonly name: string;
    readonly region: string;
    readonly status: string;
}
export declare function getClusterDataSourceOutput(args: GetClusterDataSourceOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetClusterDataSourceResult>;
/**
 * A collection of arguments for invoking GetClusterDataSource.
 */
export interface GetClusterDataSourceOutputArgs {
    /**
     * The ID of this resource.
     */
    id: pulumi.Input<string>;
}
