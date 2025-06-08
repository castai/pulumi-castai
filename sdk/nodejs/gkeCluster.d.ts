import * as pulumi from "@pulumi/pulumi";
/**
 * GKE cluster resource allows connecting an existing GEK cluster to CAST AI.
 */
export declare class GkeCluster extends pulumi.CustomResource {
    /**
     * Get an existing GkeCluster resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: GkeClusterState, opts?: pulumi.CustomResourceOptions): GkeCluster;
    /**
     * Returns true if the given object is an instance of GkeCluster.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is GkeCluster;
    /**
     * CAST.AI agent cluster token
     */
    readonly clusterToken: pulumi.Output<string>;
    /**
     * CAST AI credentials id for cluster
     */
    readonly credentialsId: pulumi.Output<string>;
    /**
     * GCP credentials.json from ServiceAccount with credentials for CAST AI
     */
    readonly credentialsJson: pulumi.Output<string | undefined>;
    /**
     * Should CAST AI remove nodes managed by CAST.AI on disconnect
     */
    readonly deleteNodesOnDisconnect: pulumi.Output<boolean | undefined>;
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
     * SSHPublicKey for nodes
     */
    readonly sshPublicKey: pulumi.Output<string | undefined>;
    /**
     * Create a GkeCluster resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: GkeClusterArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering GkeCluster resources.
 */
export interface GkeClusterState {
    /**
     * CAST.AI agent cluster token
     */
    clusterToken?: pulumi.Input<string>;
    /**
     * CAST AI credentials id for cluster
     */
    credentialsId?: pulumi.Input<string>;
    /**
     * GCP credentials.json from ServiceAccount with credentials for CAST AI
     */
    credentialsJson?: pulumi.Input<string>;
    /**
     * Should CAST AI remove nodes managed by CAST.AI on disconnect
     */
    deleteNodesOnDisconnect?: pulumi.Input<boolean>;
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
    /**
     * SSHPublicKey for nodes
     */
    sshPublicKey?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a GkeCluster resource.
 */
export interface GkeClusterArgs {
    /**
     * GCP credentials.json from ServiceAccount with credentials for CAST AI
     */
    credentialsJson?: pulumi.Input<string>;
    /**
     * Should CAST AI remove nodes managed by CAST.AI on disconnect
     */
    deleteNodesOnDisconnect?: pulumi.Input<boolean>;
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
    /**
     * SSHPublicKey for nodes
     */
    sshPublicKey?: pulumi.Input<string>;
}
