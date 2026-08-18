import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getWorkloadScalingPolicies(args: GetWorkloadScalingPoliciesArgs, opts?: pulumi.InvokeOptions): Promise<GetWorkloadScalingPoliciesResult>;
/**
 * A collection of arguments for invoking getWorkloadScalingPolicies.
 */
export interface GetWorkloadScalingPoliciesArgs {
    clusterId: string;
}
/**
 * A collection of values returned by getWorkloadScalingPolicies.
 */
export interface GetWorkloadScalingPoliciesResult {
    readonly clusterId: string;
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly policies: outputs.workload.GetWorkloadScalingPoliciesPolicy[];
    readonly policiesByName: {
        [key: string]: string;
    };
}
export declare function getWorkloadScalingPoliciesOutput(args: GetWorkloadScalingPoliciesOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetWorkloadScalingPoliciesResult>;
/**
 * A collection of arguments for invoking getWorkloadScalingPolicies.
 */
export interface GetWorkloadScalingPoliciesOutputArgs {
    clusterId: pulumi.Input<string>;
}
//# sourceMappingURL=getWorkloadScalingPolicies.d.ts.map