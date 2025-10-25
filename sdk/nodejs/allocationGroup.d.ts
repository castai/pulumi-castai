import * as pulumi from "@pulumi/pulumi";
export declare class AllocationGroup extends pulumi.CustomResource {
    /**
     * Get an existing AllocationGroup resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: AllocationGroupState, opts?: pulumi.CustomResourceOptions): AllocationGroup;
    /**
     * Returns true if the given object is an instance of AllocationGroup.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is AllocationGroup;
    /**
     * List of CAST AI cluster ids
     */
    readonly clusterIds: pulumi.Output<string[] | undefined>;
    /**
     * Labels used to select workloads to track
     */
    readonly labels: pulumi.Output<{
        [key: string]: string;
    } | undefined>;
    /**
     * Operator with which to connect the labels
     * 	OR (default) - workload needs to have at least one label to be included
     * 	AND - workload needs to have all the labels to be included
     */
    readonly labelsOperator: pulumi.Output<string | undefined>;
    /**
     * Allocation group name
     */
    readonly name: pulumi.Output<string>;
    /**
     * List of cluster namespaces to track
     */
    readonly namespaces: pulumi.Output<string[] | undefined>;
    /**
     * Create a AllocationGroup resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: AllocationGroupArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering AllocationGroup resources.
 */
export interface AllocationGroupState {
    /**
     * List of CAST AI cluster ids
     */
    clusterIds?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Labels used to select workloads to track
     */
    labels?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    }>;
    /**
     * Operator with which to connect the labels
     * 	OR (default) - workload needs to have at least one label to be included
     * 	AND - workload needs to have all the labels to be included
     */
    labelsOperator?: pulumi.Input<string>;
    /**
     * Allocation group name
     */
    name?: pulumi.Input<string>;
    /**
     * List of cluster namespaces to track
     */
    namespaces?: pulumi.Input<pulumi.Input<string>[]>;
}
/**
 * The set of arguments for constructing a AllocationGroup resource.
 */
export interface AllocationGroupArgs {
    /**
     * List of CAST AI cluster ids
     */
    clusterIds?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Labels used to select workloads to track
     */
    labels?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    }>;
    /**
     * Operator with which to connect the labels
     * 	OR (default) - workload needs to have at least one label to be included
     * 	AND - workload needs to have all the labels to be included
     */
    labelsOperator?: pulumi.Input<string>;
    /**
     * Allocation group name
     */
    name?: pulumi.Input<string>;
    /**
     * List of cluster namespaces to track
     */
    namespaces?: pulumi.Input<pulumi.Input<string>[]>;
}
