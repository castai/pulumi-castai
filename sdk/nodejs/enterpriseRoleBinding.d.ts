import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class EnterpriseRoleBinding extends pulumi.CustomResource {
    /**
     * Get an existing EnterpriseRoleBinding resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: EnterpriseRoleBindingState, opts?: pulumi.CustomResourceOptions): EnterpriseRoleBinding;
    /**
     * Returns true if the given object is an instance of EnterpriseRoleBinding.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is EnterpriseRoleBinding;
    /**
     * Description of the role binding.
     */
    readonly description: pulumi.Output<string | undefined>;
    /**
     * Enterprise organization ID.
     */
    readonly enterpriseId: pulumi.Output<string>;
    /**
     * Name of the role binding.
     */
    readonly name: pulumi.Output<string>;
    /**
     * Organization ID (either enterprise or it's child) where the role binding is created.
     */
    readonly organizationId: pulumi.Output<string>;
    /**
     * Role UUID to bind.
     */
    readonly roleId: pulumi.Output<string>;
    /**
     * Scopes (organization or cluster) for this role binding.
     */
    readonly scopes: pulumi.Output<outputs.iam.EnterpriseRoleBindingScopes>;
    /**
     * Subjects (users, service accounts, groups) for this role binding.
     */
    readonly subjects: pulumi.Output<outputs.iam.EnterpriseRoleBindingSubjects>;
    /**
     * Create a EnterpriseRoleBinding resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: EnterpriseRoleBindingArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering EnterpriseRoleBinding resources.
 */
export interface EnterpriseRoleBindingState {
    /**
     * Description of the role binding.
     */
    description?: pulumi.Input<string>;
    /**
     * Enterprise organization ID.
     */
    enterpriseId?: pulumi.Input<string>;
    /**
     * Name of the role binding.
     */
    name?: pulumi.Input<string>;
    /**
     * Organization ID (either enterprise or it's child) where the role binding is created.
     */
    organizationId?: pulumi.Input<string>;
    /**
     * Role UUID to bind.
     */
    roleId?: pulumi.Input<string>;
    /**
     * Scopes (organization or cluster) for this role binding.
     */
    scopes?: pulumi.Input<inputs.iam.EnterpriseRoleBindingScopes>;
    /**
     * Subjects (users, service accounts, groups) for this role binding.
     */
    subjects?: pulumi.Input<inputs.iam.EnterpriseRoleBindingSubjects>;
}
/**
 * The set of arguments for constructing a EnterpriseRoleBinding resource.
 */
export interface EnterpriseRoleBindingArgs {
    /**
     * Description of the role binding.
     */
    description?: pulumi.Input<string>;
    /**
     * Enterprise organization ID.
     */
    enterpriseId: pulumi.Input<string>;
    /**
     * Name of the role binding.
     */
    name?: pulumi.Input<string>;
    /**
     * Organization ID (either enterprise or it's child) where the role binding is created.
     */
    organizationId: pulumi.Input<string>;
    /**
     * Role UUID to bind.
     */
    roleId: pulumi.Input<string>;
    /**
     * Scopes (organization or cluster) for this role binding.
     */
    scopes: pulumi.Input<inputs.iam.EnterpriseRoleBindingScopes>;
    /**
     * Subjects (users, service accounts, groups) for this role binding.
     */
    subjects: pulumi.Input<inputs.iam.EnterpriseRoleBindingSubjects>;
}
