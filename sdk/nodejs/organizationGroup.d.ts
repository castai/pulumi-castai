import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class OrganizationGroup extends pulumi.CustomResource {
    /**
     * Get an existing OrganizationGroup resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: OrganizationGroupState, opts?: pulumi.CustomResourceOptions): OrganizationGroup;
    /**
     * Returns true if the given object is an instance of OrganizationGroup.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is OrganizationGroup;
    /**
     * Description of the group.
     */
    readonly description: pulumi.Output<string | undefined>;
    readonly members: pulumi.Output<outputs.organization.OrganizationGroupMember[] | undefined>;
    /**
     * Name of the group.
     */
    readonly name: pulumi.Output<string>;
    /**
     * CAST AI organization ID.
     */
    readonly organizationId: pulumi.Output<string>;
    /**
     * Create a OrganizationGroup resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: OrganizationGroupArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering OrganizationGroup resources.
 */
export interface OrganizationGroupState {
    /**
     * Description of the group.
     */
    description?: pulumi.Input<string>;
    members?: pulumi.Input<pulumi.Input<inputs.organization.OrganizationGroupMember>[]>;
    /**
     * Name of the group.
     */
    name?: pulumi.Input<string>;
    /**
     * CAST AI organization ID.
     */
    organizationId?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a OrganizationGroup resource.
 */
export interface OrganizationGroupArgs {
    /**
     * Description of the group.
     */
    description?: pulumi.Input<string>;
    members?: pulumi.Input<pulumi.Input<inputs.organization.OrganizationGroupMember>[]>;
    /**
     * Name of the group.
     */
    name?: pulumi.Input<string>;
    /**
     * CAST AI organization ID.
     */
    organizationId: pulumi.Input<string>;
}
