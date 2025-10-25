import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class HibernationSchedule extends pulumi.CustomResource {
    /**
     * Get an existing HibernationSchedule resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: HibernationScheduleState, opts?: pulumi.CustomResourceOptions): HibernationSchedule;
    /**
     * Returns true if the given object is an instance of HibernationSchedule.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is HibernationSchedule;
    readonly clusterAssignments: pulumi.Output<outputs.rebalancing.HibernationScheduleClusterAssignments | undefined>;
    /**
     * Enables or disables the schedule.
     */
    readonly enabled: pulumi.Output<boolean>;
    /**
     * Name of the schedule.
     */
    readonly name: pulumi.Output<string>;
    /**
     * ID of the organization. If not provided, then will attempt to infer it using CAST AI API client.
     */
    readonly organizationId: pulumi.Output<string | undefined>;
    readonly pauseConfig: pulumi.Output<outputs.rebalancing.HibernationSchedulePauseConfig>;
    readonly resumeConfig: pulumi.Output<outputs.rebalancing.HibernationScheduleResumeConfig>;
    /**
     * Create a HibernationSchedule resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: HibernationScheduleArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering HibernationSchedule resources.
 */
export interface HibernationScheduleState {
    clusterAssignments?: pulumi.Input<inputs.rebalancing.HibernationScheduleClusterAssignments>;
    /**
     * Enables or disables the schedule.
     */
    enabled?: pulumi.Input<boolean>;
    /**
     * Name of the schedule.
     */
    name?: pulumi.Input<string>;
    /**
     * ID of the organization. If not provided, then will attempt to infer it using CAST AI API client.
     */
    organizationId?: pulumi.Input<string>;
    pauseConfig?: pulumi.Input<inputs.rebalancing.HibernationSchedulePauseConfig>;
    resumeConfig?: pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfig>;
}
/**
 * The set of arguments for constructing a HibernationSchedule resource.
 */
export interface HibernationScheduleArgs {
    clusterAssignments?: pulumi.Input<inputs.rebalancing.HibernationScheduleClusterAssignments>;
    /**
     * Enables or disables the schedule.
     */
    enabled: pulumi.Input<boolean>;
    /**
     * Name of the schedule.
     */
    name?: pulumi.Input<string>;
    /**
     * ID of the organization. If not provided, then will attempt to infer it using CAST AI API client.
     */
    organizationId?: pulumi.Input<string>;
    pauseConfig: pulumi.Input<inputs.rebalancing.HibernationSchedulePauseConfig>;
    resumeConfig: pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfig>;
}
