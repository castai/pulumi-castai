// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "./utilities";

/**
 * GKE cluster resource allows connecting an existing GEK cluster to CAST AI.
 */
export class GkeCluster extends pulumi.CustomResource {
    /**
     * Get an existing GkeCluster resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    public static get(name: string, id: pulumi.Input<pulumi.ID>, state?: GkeClusterState, opts?: pulumi.CustomResourceOptions): GkeCluster {
        return new GkeCluster(name, <any>state, { ...opts, id: id });
    }

    /** @internal */
    public static readonly __pulumiType = 'castai:gcp:GkeCluster';

    /**
     * Returns true if the given object is an instance of GkeCluster.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is GkeCluster {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === GkeCluster.__pulumiType;
    }

    /**
     * CAST.AI agent cluster token
     */
    public /*out*/ readonly clusterToken!: pulumi.Output<string>;
    /**
     * CAST AI credentials id for cluster
     */
    public /*out*/ readonly credentialsId!: pulumi.Output<string>;
    /**
     * GCP credentials.json from ServiceAccount with credentials for CAST AI
     */
    public readonly credentialsJson!: pulumi.Output<string | undefined>;
    /**
     * Should CAST AI remove nodes managed by CAST.AI on disconnect
     */
    public readonly deleteNodesOnDisconnect!: pulumi.Output<boolean | undefined>;
    /**
     * GCP cluster zone in case of zonal or region in case of regional cluster
     */
    public readonly location!: pulumi.Output<string>;
    /**
     * GKE cluster name
     */
    public readonly name!: pulumi.Output<string>;
    /**
     * GCP project id
     */
    public readonly projectId!: pulumi.Output<string>;
    /**
     * SSHPublicKey for nodes
     */
    public readonly sshPublicKey!: pulumi.Output<string | undefined>;

    /**
     * Create a GkeCluster resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: GkeClusterArgs, opts?: pulumi.CustomResourceOptions)
    constructor(name: string, argsOrState?: GkeClusterArgs | GkeClusterState, opts?: pulumi.CustomResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (opts.id) {
            const state = argsOrState as GkeClusterState | undefined;
            resourceInputs["clusterToken"] = state ? state.clusterToken : undefined;
            resourceInputs["credentialsId"] = state ? state.credentialsId : undefined;
            resourceInputs["credentialsJson"] = state ? state.credentialsJson : undefined;
            resourceInputs["deleteNodesOnDisconnect"] = state ? state.deleteNodesOnDisconnect : undefined;
            resourceInputs["location"] = state ? state.location : undefined;
            resourceInputs["name"] = state ? state.name : undefined;
            resourceInputs["projectId"] = state ? state.projectId : undefined;
            resourceInputs["sshPublicKey"] = state ? state.sshPublicKey : undefined;
        } else {
            const args = argsOrState as GkeClusterArgs | undefined;
            if ((!args || args.location === undefined) && !opts.urn) {
                throw new Error("Missing required property 'location'");
            }
            if ((!args || args.projectId === undefined) && !opts.urn) {
                throw new Error("Missing required property 'projectId'");
            }
            resourceInputs["credentialsJson"] = args?.credentialsJson ? pulumi.secret(args.credentialsJson) : undefined;
            resourceInputs["deleteNodesOnDisconnect"] = args ? args.deleteNodesOnDisconnect : undefined;
            resourceInputs["location"] = args ? args.location : undefined;
            resourceInputs["name"] = args ? args.name : undefined;
            resourceInputs["projectId"] = args ? args.projectId : undefined;
            resourceInputs["sshPublicKey"] = args ? args.sshPublicKey : undefined;
            resourceInputs["clusterToken"] = undefined /*out*/;
            resourceInputs["credentialsId"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        const secretOpts = { additionalSecretOutputs: ["clusterToken", "credentialsJson"] };
        opts = pulumi.mergeOptions(opts, secretOpts);
        super(GkeCluster.__pulumiType, name, resourceInputs, opts);
    }
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
