import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class RebalancingSchedule extends pulumi.CustomResource {
    /**
     * Get an existing RebalancingSchedule resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: RebalancingScheduleState, opts?: pulumi.CustomResourceOptions): RebalancingSchedule;
    /**
     * Returns true if the given object is an instance of RebalancingSchedule.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is RebalancingSchedule;
    readonly launchConfiguration: pulumi.Output<outputs.rebalancing.RebalancingScheduleLaunchConfiguration>;
    /**
     * Name of the schedule.
     */
    readonly name: pulumi.Output<string>;
    readonly schedule: pulumi.Output<outputs.rebalancing.RebalancingScheduleSchedule>;
    readonly triggerConditions: pulumi.Output<outputs.rebalancing.RebalancingScheduleTriggerConditions>;
    /**
     * Create a RebalancingSchedule resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: RebalancingScheduleArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering RebalancingSchedule resources.
 */
export interface RebalancingScheduleState {
    launchConfiguration?: pulumi.Input<inputs.rebalancing.RebalancingScheduleLaunchConfiguration>;
    /**
     * Name of the schedule.
     */
    name?: pulumi.Input<string>;
    schedule?: pulumi.Input<inputs.rebalancing.RebalancingScheduleSchedule>;
    triggerConditions?: pulumi.Input<inputs.rebalancing.RebalancingScheduleTriggerConditions>;
}
/**
 * The set of arguments for constructing a RebalancingSchedule resource.
 */
export interface RebalancingScheduleArgs {
    launchConfiguration: pulumi.Input<inputs.rebalancing.RebalancingScheduleLaunchConfiguration>;
    /**
     * Name of the schedule.
     */
    name?: pulumi.Input<string>;
    schedule: pulumi.Input<inputs.rebalancing.RebalancingScheduleSchedule>;
    triggerConditions: pulumi.Input<inputs.rebalancing.RebalancingScheduleTriggerConditions>;
}
