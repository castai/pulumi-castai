import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare function getHibernationScheduleDataSource(args: GetHibernationScheduleDataSourceArgs, opts?: pulumi.InvokeOptions): Promise<GetHibernationScheduleDataSourceResult>;
/**
 * A collection of arguments for invoking GetHibernationScheduleDataSource.
 */
export interface GetHibernationScheduleDataSourceArgs {
    clusterAssignments?: inputs.rebalancing.GetHibernationScheduleDataSourceClusterAssignment[];
    name: string;
    organizationId?: string;
}
/**
 * A collection of values returned by GetHibernationScheduleDataSource.
 */
export interface GetHibernationScheduleDataSourceResult {
    readonly clusterAssignments: outputs.rebalancing.GetHibernationScheduleDataSourceClusterAssignment[];
    readonly enabled: boolean;
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly name: string;
    readonly organizationId?: string;
    readonly pauseConfigs: outputs.rebalancing.GetHibernationScheduleDataSourcePauseConfig[];
    readonly resumeConfigs: outputs.rebalancing.GetHibernationScheduleDataSourceResumeConfig[];
}
export declare function getHibernationScheduleDataSourceOutput(args: GetHibernationScheduleDataSourceOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetHibernationScheduleDataSourceResult>;
/**
 * A collection of arguments for invoking GetHibernationScheduleDataSource.
 */
export interface GetHibernationScheduleDataSourceOutputArgs {
    clusterAssignments?: pulumi.Input<pulumi.Input<inputs.rebalancing.GetHibernationScheduleDataSourceClusterAssignment>[]>;
    name: pulumi.Input<string>;
    organizationId?: pulumi.Input<string>;
}
