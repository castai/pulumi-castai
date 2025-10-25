import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class SSOConnection extends pulumi.CustomResource {
    /**
     * Get an existing SSOConnection resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: SSOConnectionState, opts?: pulumi.CustomResourceOptions): SSOConnection;
    /**
     * Returns true if the given object is an instance of SSOConnection.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is SSOConnection;
    /**
     * Azure AD connector
     */
    readonly aad: pulumi.Output<outputs.organization.SSOConnectionAad | undefined>;
    /**
     * Additional email domains that will be allowed to sign in via the connection
     */
    readonly additionalEmailDomains: pulumi.Output<string[] | undefined>;
    /**
     * Email domain of the connection
     */
    readonly emailDomain: pulumi.Output<string>;
    /**
     * Connection name
     */
    readonly name: pulumi.Output<string>;
    /**
     * Okta connector
     */
    readonly okta: pulumi.Output<outputs.organization.SSOConnectionOkta | undefined>;
    /**
     * Create a SSOConnection resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: SSOConnectionArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering SSOConnection resources.
 */
export interface SSOConnectionState {
    /**
     * Azure AD connector
     */
    aad?: pulumi.Input<inputs.organization.SSOConnectionAad>;
    /**
     * Additional email domains that will be allowed to sign in via the connection
     */
    additionalEmailDomains?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Email domain of the connection
     */
    emailDomain?: pulumi.Input<string>;
    /**
     * Connection name
     */
    name?: pulumi.Input<string>;
    /**
     * Okta connector
     */
    okta?: pulumi.Input<inputs.organization.SSOConnectionOkta>;
}
/**
 * The set of arguments for constructing a SSOConnection resource.
 */
export interface SSOConnectionArgs {
    /**
     * Azure AD connector
     */
    aad?: pulumi.Input<inputs.organization.SSOConnectionAad>;
    /**
     * Additional email domains that will be allowed to sign in via the connection
     */
    additionalEmailDomains?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Email domain of the connection
     */
    emailDomain: pulumi.Input<string>;
    /**
     * Connection name
     */
    name?: pulumi.Input<string>;
    /**
     * Okta connector
     */
    okta?: pulumi.Input<inputs.organization.SSOConnectionOkta>;
}
