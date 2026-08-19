import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare function getHibernationSchedule(args: GetHibernationScheduleArgs, opts?: pulumi.InvokeOptions): Promise<GetHibernationScheduleResult>;
/**
 * A collection of arguments for invoking getHibernationSchedule.
 */
export interface GetHibernationScheduleArgs {
    clusterAssignments?: inputs.rebalancing.GetHibernationScheduleClusterAssignment[];
    name: string;
    organizationId?: string;
}
/**
 * A collection of values returned by getHibernationSchedule.
 */
export interface GetHibernationScheduleResult {
    readonly clusterAssignments: outputs.rebalancing.GetHibernationScheduleClusterAssignment[];
    readonly enabled: boolean;
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly name: string;
    readonly organizationId?: string;
    readonly pauseConfigs: outputs.rebalancing.GetHibernationSchedulePauseConfig[];
    readonly resumeConfigs: outputs.rebalancing.GetHibernationScheduleResumeConfig[];
}
export declare function getHibernationScheduleOutput(args: GetHibernationScheduleOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetHibernationScheduleResult>;
/**
 * A collection of arguments for invoking getHibernationSchedule.
 */
export interface GetHibernationScheduleOutputArgs {
    clusterAssignments?: pulumi.Input<pulumi.Input<inputs.rebalancing.GetHibernationScheduleClusterAssignment>[] | undefined>;
    name: pulumi.Input<string>;
    organizationId?: pulumi.Input<string | undefined>;
}
//# sourceMappingURL=getHibernationSchedule.d.ts.map