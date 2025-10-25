import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class ServiceAccount extends pulumi.CustomResource {
    /**
     * Get an existing ServiceAccount resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: ServiceAccountState, opts?: pulumi.CustomResourceOptions): ServiceAccount;
    /**
     * Returns true if the given object is an instance of ServiceAccount.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is ServiceAccount;
    /**
     * Author of the service account.
     */
    readonly authors: pulumi.Output<outputs.organization.ServiceAccountAuthor[]>;
    /**
     * Description of the service account.
     */
    readonly description: pulumi.Output<string | undefined>;
    /**
     * Email of the service account.
     */
    readonly email: pulumi.Output<string>;
    /**
     * Name of the service account.
     */
    readonly name: pulumi.Output<string>;
    /**
     * ID of the organization.
     */
    readonly organizationId: pulumi.Output<string>;
    /**
     * Create a ServiceAccount resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ServiceAccountArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering ServiceAccount resources.
 */
export interface ServiceAccountState {
    /**
     * Author of the service account.
     */
    authors?: pulumi.Input<pulumi.Input<inputs.organization.ServiceAccountAuthor>[]>;
    /**
     * Description of the service account.
     */
    description?: pulumi.Input<string>;
    /**
     * Email of the service account.
     */
    email?: pulumi.Input<string>;
    /**
     * Name of the service account.
     */
    name?: pulumi.Input<string>;
    /**
     * ID of the organization.
     */
    organizationId?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a ServiceAccount resource.
 */
export interface ServiceAccountArgs {
    /**
     * Description of the service account.
     */
    description?: pulumi.Input<string>;
    /**
     * Name of the service account.
     */
    name?: pulumi.Input<string>;
    /**
     * ID of the organization.
     */
    organizationId: pulumi.Input<string>;
}
