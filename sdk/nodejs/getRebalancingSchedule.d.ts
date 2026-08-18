import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRebalancingSchedule(args: GetRebalancingScheduleArgs, opts?: pulumi.InvokeOptions): Promise<GetRebalancingScheduleResult>;
/**
 * A collection of arguments for invoking getRebalancingSchedule.
 */
export interface GetRebalancingScheduleArgs {
    name: string;
}
/**
 * A collection of values returned by getRebalancingSchedule.
 */
export interface GetRebalancingScheduleResult {
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly launchConfigurations: outputs.rebalancing.GetRebalancingScheduleLaunchConfiguration[];
    readonly name: string;
    readonly schedules: outputs.rebalancing.GetRebalancingScheduleSchedule[];
    readonly triggerConditions: outputs.rebalancing.GetRebalancingScheduleTriggerCondition[];
}
export declare function getRebalancingScheduleOutput(args: GetRebalancingScheduleOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRebalancingScheduleResult>;
/**
 * A collection of arguments for invoking getRebalancingSchedule.
 */
export interface GetRebalancingScheduleOutputArgs {
    name: pulumi.Input<string>;
}
//# sourceMappingURL=getRebalancingSchedule.d.ts.map