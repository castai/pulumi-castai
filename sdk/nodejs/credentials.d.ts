import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class Credentials extends pulumi.CustomResource {
    /**
     * Get an existing Credentials resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: CredentialsState, opts?: pulumi.CustomResourceOptions): Credentials;
    /**
     * Returns true if the given object is an instance of Credentials.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Credentials;
    readonly aws: pulumi.Output<outputs.CredentialsAws | undefined>;
    readonly azure: pulumi.Output<outputs.CredentialsAzure | undefined>;
    readonly cloud: pulumi.Output<string>;
    readonly do: pulumi.Output<outputs.CredentialsDo | undefined>;
    readonly gcp: pulumi.Output<outputs.CredentialsGcp | undefined>;
    readonly name: pulumi.Output<string>;
    /**
     * Create a Credentials resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: CredentialsArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering Credentials resources.
 */
export interface CredentialsState {
    aws?: pulumi.Input<inputs.CredentialsAws>;
    azure?: pulumi.Input<inputs.CredentialsAzure>;
    cloud?: pulumi.Input<string>;
    do?: pulumi.Input<inputs.CredentialsDo>;
    gcp?: pulumi.Input<inputs.CredentialsGcp>;
    name?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a Credentials resource.
 */
export interface CredentialsArgs {
    aws?: pulumi.Input<inputs.CredentialsAws>;
    azure?: pulumi.Input<inputs.CredentialsAzure>;
    do?: pulumi.Input<inputs.CredentialsDo>;
    gcp?: pulumi.Input<inputs.CredentialsGcp>;
    name?: pulumi.Input<string>;
}
