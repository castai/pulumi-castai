import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class EnterpriseGroup extends pulumi.CustomResource {
    /**
     * Get an existing EnterpriseGroup resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: EnterpriseGroupState, opts?: pulumi.CustomResourceOptions): EnterpriseGroup;
    /**
     * Returns true if the given object is an instance of EnterpriseGroup.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is EnterpriseGroup;
    /**
     * Description of the group.
     */
    readonly description: pulumi.Output<string | undefined>;
    /**
     * Enterprise organization ID.
     */
    readonly enterpriseId: pulumi.Output<string>;
    /**
     * List of group members.
     */
    readonly members: pulumi.Output<outputs.organization.EnterpriseGroupMember[] | undefined>;
    /**
     * Name of the group.
     */
    readonly name: pulumi.Output<string>;
    /**
     * Target organization ID for the group.
     */
    readonly organizationId: pulumi.Output<string>;
    /**
     * List of role bindings for the group.
     */
    readonly roleBindings: pulumi.Output<outputs.organization.EnterpriseGroupRoleBinding[] | undefined>;
    /**
     * Create a EnterpriseGroup resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: EnterpriseGroupArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering EnterpriseGroup resources.
 */
export interface EnterpriseGroupState {
    /**
     * Description of the group.
     */
    description?: pulumi.Input<string>;
    /**
     * Enterprise organization ID.
     */
    enterpriseId?: pulumi.Input<string>;
    /**
     * List of group members.
     */
    members?: pulumi.Input<pulumi.Input<inputs.organization.EnterpriseGroupMember>[]>;
    /**
     * Name of the group.
     */
    name?: pulumi.Input<string>;
    /**
     * Target organization ID for the group.
     */
    organizationId?: pulumi.Input<string>;
    /**
     * List of role bindings for the group.
     */
    roleBindings?: pulumi.Input<pulumi.Input<inputs.organization.EnterpriseGroupRoleBinding>[]>;
}
/**
 * The set of arguments for constructing a EnterpriseGroup resource.
 */
export interface EnterpriseGroupArgs {
    /**
     * Description of the group.
     */
    description?: pulumi.Input<string>;
    /**
     * Enterprise organization ID.
     */
    enterpriseId: pulumi.Input<string>;
    /**
     * List of group members.
     */
    members?: pulumi.Input<pulumi.Input<inputs.organization.EnterpriseGroupMember>[]>;
    /**
     * Name of the group.
     */
    name?: pulumi.Input<string>;
    /**
     * Target organization ID for the group.
     */
    organizationId: pulumi.Input<string>;
    /**
     * List of role bindings for the group.
     */
    roleBindings?: pulumi.Input<pulumi.Input<inputs.organization.EnterpriseGroupRoleBinding>[]>;
}
