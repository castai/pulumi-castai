import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class Cluster extends pulumi.CustomResource {
    /**
     * Get an existing Cluster resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: ClusterState, opts?: pulumi.CustomResourceOptions): Cluster;
    /**
     * Returns true if the given object is an instance of Cluster.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Cluster;
    readonly autoscalerPolicies: pulumi.Output<outputs.ClusterAutoscalerPolicies | undefined>;
    readonly credentials: pulumi.Output<string[]>;
    readonly initializeParams: pulumi.Output<outputs.ClusterInitializeParams>;
    readonly kubeconfigs: pulumi.Output<outputs.ClusterKubeconfig[]>;
    readonly name: pulumi.Output<string>;
    readonly region: pulumi.Output<string>;
    readonly status: pulumi.Output<string>;
    readonly vpnType: pulumi.Output<string | undefined>;
    /**
     * Create a Cluster resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ClusterArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering Cluster resources.
 */
export interface ClusterState {
    autoscalerPolicies?: pulumi.Input<inputs.ClusterAutoscalerPolicies>;
    credentials?: pulumi.Input<pulumi.Input<string>[]>;
    initializeParams?: pulumi.Input<inputs.ClusterInitializeParams>;
    kubeconfigs?: pulumi.Input<pulumi.Input<inputs.ClusterKubeconfig>[]>;
    name?: pulumi.Input<string>;
    region?: pulumi.Input<string>;
    status?: pulumi.Input<string>;
    vpnType?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a Cluster resource.
 */
export interface ClusterArgs {
    autoscalerPolicies?: pulumi.Input<inputs.ClusterAutoscalerPolicies>;
    credentials: pulumi.Input<pulumi.Input<string>[]>;
    initializeParams: pulumi.Input<inputs.ClusterInitializeParams>;
    name?: pulumi.Input<string>;
    region: pulumi.Input<string>;
    status?: pulumi.Input<string>;
    vpnType?: pulumi.Input<string>;
}
