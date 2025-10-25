import * as pulumi from "@pulumi/pulumi";
export declare function getWorkloadScalingPolicyOrderDataSource(args: GetWorkloadScalingPolicyOrderDataSourceArgs, opts?: pulumi.InvokeOptions): Promise<GetWorkloadScalingPolicyOrderDataSourceResult>;
/**
 * A collection of arguments for invoking GetWorkloadScalingPolicyOrderDataSource.
 */
export interface GetWorkloadScalingPolicyOrderDataSourceArgs {
    clusterId: string;
}
/**
 * A collection of values returned by GetWorkloadScalingPolicyOrderDataSource.
 */
export interface GetWorkloadScalingPolicyOrderDataSourceResult {
    readonly clusterId: string;
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly policyIds: string[];
}
export declare function getWorkloadScalingPolicyOrderDataSourceOutput(args: GetWorkloadScalingPolicyOrderDataSourceOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetWorkloadScalingPolicyOrderDataSourceResult>;
/**
 * A collection of arguments for invoking GetWorkloadScalingPolicyOrderDataSource.
 */
export interface GetWorkloadScalingPolicyOrderDataSourceOutputArgs {
    clusterId: pulumi.Input<string>;
}
