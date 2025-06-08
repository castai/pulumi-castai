import * as pulumi from "@pulumi/pulumi";
/**
 * CAST AI autoscaler resource to manage autoscaler settings
 */
export declare class Autoscaler extends pulumi.CustomResource {
    /**
     * Get an existing Autoscaler resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: AutoscalerState, opts?: pulumi.CustomResourceOptions): Autoscaler;
    /**
     * Returns true if the given object is an instance of Autoscaler.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Autoscaler;
    /**
     * computed value to store full policies configuration
     */
    readonly autoscalerPolicies: pulumi.Output<string>;
    /**
     * autoscaler policies JSON string to override current autoscaler settings
     */
    readonly autoscalerPoliciesJson: pulumi.Output<string | undefined>;
    /**
     * CAST AI cluster id
     */
    readonly clusterId: pulumi.Output<string | undefined>;
    /**
     * Create a Autoscaler resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: AutoscalerArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering Autoscaler resources.
 */
export interface AutoscalerState {
    /**
     * computed value to store full policies configuration
     */
    autoscalerPolicies?: pulumi.Input<string>;
    /**
     * autoscaler policies JSON string to override current autoscaler settings
     */
    autoscalerPoliciesJson?: pulumi.Input<string>;
    /**
     * CAST AI cluster id
     */
    clusterId?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a Autoscaler resource.
 */
export interface AutoscalerArgs {
    /**
     * autoscaler policies JSON string to override current autoscaler settings
     */
    autoscalerPoliciesJson?: pulumi.Input<string>;
    /**
     * CAST AI cluster id
     */
    clusterId?: pulumi.Input<string>;
}
