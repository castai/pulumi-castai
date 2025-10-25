import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getRebalancingScheduleDataSource(args: GetRebalancingScheduleDataSourceArgs, opts?: pulumi.InvokeOptions): Promise<GetRebalancingScheduleDataSourceResult>;
/**
 * A collection of arguments for invoking GetRebalancingScheduleDataSource.
 */
export interface GetRebalancingScheduleDataSourceArgs {
    name: string;
}
/**
 * A collection of values returned by GetRebalancingScheduleDataSource.
 */
export interface GetRebalancingScheduleDataSourceResult {
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly launchConfigurations: outputs.rebalancing.GetRebalancingScheduleDataSourceLaunchConfiguration[];
    readonly name: string;
    readonly schedules: outputs.rebalancing.GetRebalancingScheduleDataSourceSchedule[];
    readonly triggerConditions: outputs.rebalancing.GetRebalancingScheduleDataSourceTriggerCondition[];
}
export declare function getRebalancingScheduleDataSourceOutput(args: GetRebalancingScheduleDataSourceOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetRebalancingScheduleDataSourceResult>;
/**
 * A collection of arguments for invoking GetRebalancingScheduleDataSource.
 */
export interface GetRebalancingScheduleDataSourceOutputArgs {
    name: pulumi.Input<string>;
}
