import * as pulumi from "@pulumi/pulumi";
export declare class GkeClusterId extends pulumi.CustomResource {
    /**
     * Get an existing GkeClusterId resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: GkeClusterIdState, opts?: pulumi.CustomResourceOptions): GkeClusterId;
    /**
     * Returns true if the given object is an instance of GkeClusterId.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is GkeClusterId;
    /**
     * Service account email in cast project
     */
    readonly castServiceAccount: pulumi.Output<string>;
    /**
     * Service account email in client project
     */
    readonly clientServiceAccount: pulumi.Output<string | undefined>;
    /**
     * CAST.AI agent cluster token
     */
    readonly clusterToken: pulumi.Output<string>;
    /**
     * GCP cluster zone in case of zonal or region in case of regional cluster
     */
    readonly location: pulumi.Output<string>;
    /**
     * GKE cluster name
     */
    readonly name: pulumi.Output<string>;
    /**
     * GCP project id
     */
    readonly projectId: pulumi.Output<string>;
    /**
     * Create a GkeClusterId resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: GkeClusterIdArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering GkeClusterId resources.
 */
export interface GkeClusterIdState {
    /**
     * Service account email in cast project
     */
    castServiceAccount?: pulumi.Input<string>;
    /**
     * Service account email in client project
     */
    clientServiceAccount?: pulumi.Input<string>;
    /**
     * CAST.AI agent cluster token
     */
    clusterToken?: pulumi.Input<string>;
    /**
     * GCP cluster zone in case of zonal or region in case of regional cluster
     */
    location?: pulumi.Input<string>;
    /**
     * GKE cluster name
     */
    name?: pulumi.Input<string>;
    /**
     * GCP project id
     */
    projectId?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a GkeClusterId resource.
 */
export interface GkeClusterIdArgs {
    /**
     * Service account email in cast project
     */
    castServiceAccount?: pulumi.Input<string>;
    /**
     * Service account email in client project
     */
    clientServiceAccount?: pulumi.Input<string>;
    /**
     * GCP cluster zone in case of zonal or region in case of regional cluster
     */
    location: pulumi.Input<string>;
    /**
     * GKE cluster name
     */
    name?: pulumi.Input<string>;
    /**
     * GCP project id
     */
    projectId: pulumi.Input<string>;
}
