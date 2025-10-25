import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class RoleBindings extends pulumi.CustomResource {
    /**
     * Get an existing RoleBindings resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: RoleBindingsState, opts?: pulumi.CustomResourceOptions): RoleBindings;
    /**
     * Returns true if the given object is an instance of RoleBindings.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is RoleBindings;
    /**
     * Description of the role binding.
     */
    readonly description: pulumi.Output<string>;
    /**
     * Name of role binding.
     */
    readonly name: pulumi.Output<string>;
    /**
     * CAST AI organization ID.
     */
    readonly organizationId: pulumi.Output<string>;
    /**
     * ID of role from role binding.
     */
    readonly roleId: pulumi.Output<string>;
    /**
     * Scopes of the role binding.
     */
    readonly scopes: pulumi.Output<outputs.iam.RoleBindingsScope[] | undefined>;
    readonly subjects: pulumi.Output<outputs.iam.RoleBindingsSubject[]>;
    /**
     * Create a RoleBindings resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: RoleBindingsArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering RoleBindings resources.
 */
export interface RoleBindingsState {
    /**
     * Description of the role binding.
     */
    description?: pulumi.Input<string>;
    /**
     * Name of role binding.
     */
    name?: pulumi.Input<string>;
    /**
     * CAST AI organization ID.
     */
    organizationId?: pulumi.Input<string>;
    /**
     * ID of role from role binding.
     */
    roleId?: pulumi.Input<string>;
    /**
     * Scopes of the role binding.
     */
    scopes?: pulumi.Input<pulumi.Input<inputs.iam.RoleBindingsScope>[]>;
    subjects?: pulumi.Input<pulumi.Input<inputs.iam.RoleBindingsSubject>[]>;
}
/**
 * The set of arguments for constructing a RoleBindings resource.
 */
export interface RoleBindingsArgs {
    /**
     * Description of the role binding.
     */
    description?: pulumi.Input<string>;
    /**
     * Name of role binding.
     */
    name?: pulumi.Input<string>;
    /**
     * CAST AI organization ID.
     */
    organizationId: pulumi.Input<string>;
    /**
     * ID of role from role binding.
     */
    roleId: pulumi.Input<string>;
    /**
     * Scopes of the role binding.
     */
    scopes?: pulumi.Input<pulumi.Input<inputs.iam.RoleBindingsScope>[]>;
    subjects: pulumi.Input<pulumi.Input<inputs.iam.RoleBindingsSubject>[]>;
}
