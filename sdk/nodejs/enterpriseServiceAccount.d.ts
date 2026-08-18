import * as pulumi from "@pulumi/pulumi";
export declare class EnterpriseServiceAccount extends pulumi.CustomResource {
    /**
     * Get an existing EnterpriseServiceAccount resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: EnterpriseServiceAccountState, opts?: pulumi.CustomResourceOptions): EnterpriseServiceAccount;
    /**
     * Returns true if the given object is an instance of EnterpriseServiceAccount.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is EnterpriseServiceAccount;
    /**
     * Service account description.
     */
    readonly description: pulumi.Output<string | undefined>;
    /**
     * Auto-generated service account email (read-only).
     */
    readonly email: pulumi.Output<string>;
    /**
     * Enterprise organization ID.
     */
    readonly enterpriseId: pulumi.Output<string>;
    /**
     * Service account name.
     */
    readonly name: pulumi.Output<string>;
    /**
     * Target organization ID where the service account is created. Defaults to enterpriseId (enterprise scope) when omitted.
     */
    readonly organizationId: pulumi.Output<string>;
    /**
     * Create a EnterpriseServiceAccount resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: EnterpriseServiceAccountArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering EnterpriseServiceAccount resources.
 */
export interface EnterpriseServiceAccountState {
    /**
     * Service account description.
     */
    description?: pulumi.Input<string | undefined>;
    /**
     * Auto-generated service account email (read-only).
     */
    email?: pulumi.Input<string | undefined>;
    /**
     * Enterprise organization ID.
     */
    enterpriseId?: pulumi.Input<string | undefined>;
    /**
     * Service account name.
     */
    name?: pulumi.Input<string | undefined>;
    /**
     * Target organization ID where the service account is created. Defaults to enterpriseId (enterprise scope) when omitted.
     */
    organizationId?: pulumi.Input<string | undefined>;
}
/**
 * The set of arguments for constructing a EnterpriseServiceAccount resource.
 */
export interface EnterpriseServiceAccountArgs {
    /**
     * Service account description.
     */
    description?: pulumi.Input<string | undefined>;
    /**
     * Enterprise organization ID.
     */
    enterpriseId: pulumi.Input<string>;
    /**
     * Service account name.
     */
    name?: pulumi.Input<string | undefined>;
    /**
     * Target organization ID where the service account is created. Defaults to enterpriseId (enterprise scope) when omitted.
     */
    organizationId?: pulumi.Input<string | undefined>;
}
//# sourceMappingURL=enterpriseServiceAccount.d.ts.map