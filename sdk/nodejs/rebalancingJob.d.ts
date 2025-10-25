import * as pulumi from "@pulumi/pulumi";
export declare class RebalancingJob extends pulumi.CustomResource {
    /**
     * Get an existing RebalancingJob resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: RebalancingJobState, opts?: pulumi.CustomResourceOptions): RebalancingJob;
    /**
     * Returns true if the given object is an instance of RebalancingJob.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is RebalancingJob;
    /**
     * CAST AI cluster id.
     */
    readonly clusterId: pulumi.Output<string>;
    /**
     * The job will only be executed if it's enabled.
     */
    readonly enabled: pulumi.Output<boolean | undefined>;
    /**
     * Rebalancing schedule of this job.
     */
    readonly rebalancingScheduleId: pulumi.Output<string>;
    /**
     * Create a RebalancingJob resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: RebalancingJobArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering RebalancingJob resources.
 */
export interface RebalancingJobState {
    /**
     * CAST AI cluster id.
     */
    clusterId?: pulumi.Input<string>;
    /**
     * The job will only be executed if it's enabled.
     */
    enabled?: pulumi.Input<boolean>;
    /**
     * Rebalancing schedule of this job.
     */
    rebalancingScheduleId?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a RebalancingJob resource.
 */
export interface RebalancingJobArgs {
    /**
     * CAST AI cluster id.
     */
    clusterId: pulumi.Input<string>;
    /**
     * The job will only be executed if it's enabled.
     */
    enabled?: pulumi.Input<boolean>;
    /**
     * Rebalancing schedule of this job.
     */
    rebalancingScheduleId: pulumi.Input<string>;
}
