import * as pulumi from "@pulumi/pulumi";
export declare class ClusterToken extends pulumi.CustomResource {
    /**
     * Get an existing ClusterToken resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: ClusterTokenState, opts?: pulumi.CustomResourceOptions): ClusterToken;
    /**
     * Returns true if the given object is an instance of ClusterToken.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is ClusterToken;
    /**
     * CAST AI cluster id
     */
    readonly clusterId: pulumi.Output<string>;
    /**
     * computed value to store cluster token
     */
    readonly clusterToken: pulumi.Output<string>;
    /**
     * Create a ClusterToken resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ClusterTokenArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering ClusterToken resources.
 */
export interface ClusterTokenState {
    /**
     * CAST AI cluster id
     */
    clusterId?: pulumi.Input<string>;
    /**
     * computed value to store cluster token
     */
    clusterToken?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a ClusterToken resource.
 */
export interface ClusterTokenArgs {
    /**
     * CAST AI cluster id
     */
    clusterId: pulumi.Input<string>;
}
