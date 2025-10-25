import * as pulumi from "@pulumi/pulumi";
export declare class EksClusterId extends pulumi.CustomResource {
    /**
     * Get an existing EksClusterId resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: EksClusterIdState, opts?: pulumi.CustomResourceOptions): EksClusterId;
    /**
     * Returns true if the given object is an instance of EksClusterId.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is EksClusterId;
    readonly accountId: pulumi.Output<string>;
    readonly clusterName: pulumi.Output<string>;
    readonly region: pulumi.Output<string>;
    /**
     * Create a EksClusterId resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: EksClusterIdArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering EksClusterId resources.
 */
export interface EksClusterIdState {
    accountId?: pulumi.Input<string>;
    clusterName?: pulumi.Input<string>;
    region?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a EksClusterId resource.
 */
export interface EksClusterIdArgs {
    accountId: pulumi.Input<string>;
    clusterName: pulumi.Input<string>;
    region: pulumi.Input<string>;
}
