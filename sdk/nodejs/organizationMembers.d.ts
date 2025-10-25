import * as pulumi from "@pulumi/pulumi";
export declare class OrganizationMembers extends pulumi.CustomResource {
    /**
     * Get an existing OrganizationMembers resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: OrganizationMembersState, opts?: pulumi.CustomResourceOptions): OrganizationMembers;
    /**
     * Returns true if the given object is an instance of OrganizationMembers.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is OrganizationMembers;
    /**
     * A list of email addresses corresponding to users who should be given member access to the organization.
     *
     * @deprecated The 'members' field is deprecated. Use 'castai_role_bindings' resource instead for more granular role management. This field will be removed in a future version.
     */
    readonly members: pulumi.Output<string[] | undefined>;
    /**
     * CAST AI organization ID.
     */
    readonly organizationId: pulumi.Output<string>;
    /**
     * A list of email addresses corresponding to users who should be given owner access to the organization.
     *
     * @deprecated The 'owners' field is deprecated. Use 'castai_role_bindings' resource instead for more granular role management. This field will be removed in a future version.
     */
    readonly owners: pulumi.Output<string[] | undefined>;
    /**
     * A list of email addresses corresponding to users who should be given viewer access to the organization.
     *
     * @deprecated The 'viewers' field is deprecated. Use 'castai_role_bindings' resource instead for more granular role management. This field will be removed in a future version.
     */
    readonly viewers: pulumi.Output<string[] | undefined>;
    /**
     * Create a OrganizationMembers resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: OrganizationMembersArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering OrganizationMembers resources.
 */
export interface OrganizationMembersState {
    /**
     * A list of email addresses corresponding to users who should be given member access to the organization.
     *
     * @deprecated The 'members' field is deprecated. Use 'castai_role_bindings' resource instead for more granular role management. This field will be removed in a future version.
     */
    members?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * CAST AI organization ID.
     */
    organizationId?: pulumi.Input<string>;
    /**
     * A list of email addresses corresponding to users who should be given owner access to the organization.
     *
     * @deprecated The 'owners' field is deprecated. Use 'castai_role_bindings' resource instead for more granular role management. This field will be removed in a future version.
     */
    owners?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * A list of email addresses corresponding to users who should be given viewer access to the organization.
     *
     * @deprecated The 'viewers' field is deprecated. Use 'castai_role_bindings' resource instead for more granular role management. This field will be removed in a future version.
     */
    viewers?: pulumi.Input<pulumi.Input<string>[]>;
}
/**
 * The set of arguments for constructing a OrganizationMembers resource.
 */
export interface OrganizationMembersArgs {
    /**
     * A list of email addresses corresponding to users who should be given member access to the organization.
     *
     * @deprecated The 'members' field is deprecated. Use 'castai_role_bindings' resource instead for more granular role management. This field will be removed in a future version.
     */
    members?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * CAST AI organization ID.
     */
    organizationId: pulumi.Input<string>;
    /**
     * A list of email addresses corresponding to users who should be given owner access to the organization.
     *
     * @deprecated The 'owners' field is deprecated. Use 'castai_role_bindings' resource instead for more granular role management. This field will be removed in a future version.
     */
    owners?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * A list of email addresses corresponding to users who should be given viewer access to the organization.
     *
     * @deprecated The 'viewers' field is deprecated. Use 'castai_role_bindings' resource instead for more granular role management. This field will be removed in a future version.
     */
    viewers?: pulumi.Input<pulumi.Input<string>[]>;
}
