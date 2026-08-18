import * as pulumi from "@pulumi/pulumi";
export declare function getWorkloadScalingPolicyOrder(args: GetWorkloadScalingPolicyOrderArgs, opts?: pulumi.InvokeOptions): Promise<GetWorkloadScalingPolicyOrderResult>;
/**
 * A collection of arguments for invoking getWorkloadScalingPolicyOrder.
 */
export interface GetWorkloadScalingPolicyOrderArgs {
    clusterId: string;
}
/**
 * A collection of values returned by getWorkloadScalingPolicyOrder.
 */
export interface GetWorkloadScalingPolicyOrderResult {
    readonly clusterId: string;
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly policyIds: string[];
}
export declare function getWorkloadScalingPolicyOrderOutput(args: GetWorkloadScalingPolicyOrderOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetWorkloadScalingPolicyOrderResult>;
/**
 * A collection of arguments for invoking getWorkloadScalingPolicyOrder.
 */
export interface GetWorkloadScalingPolicyOrderOutputArgs {
    clusterId: pulumi.Input<string>;
}
//# sourceMappingURL=getWorkloadScalingPolicyOrder.d.ts.map