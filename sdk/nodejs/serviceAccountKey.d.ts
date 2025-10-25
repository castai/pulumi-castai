import * as pulumi from "@pulumi/pulumi";
export declare class ServiceAccountKey extends pulumi.CustomResource {
    /**
     * Get an existing ServiceAccountKey resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: ServiceAccountKeyState, opts?: pulumi.CustomResourceOptions): ServiceAccountKey;
    /**
     * Returns true if the given object is an instance of ServiceAccountKey.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is ServiceAccountKey;
    /**
     * Whether the service account key is active. Defaults to true.
     */
    readonly active: pulumi.Output<boolean | undefined>;
    /**
     * The expiration time of the service account key in RFC3339 format. Defaults to an empty string.
     */
    readonly expiresAt: pulumi.Output<string | undefined>;
    /**
     * Last time the service account key was used.
     */
    readonly lastUsedAt: pulumi.Output<string>;
    /**
     * Name of the service account key.
     */
    readonly name: pulumi.Output<string>;
    /**
     * ID of the organization.
     */
    readonly organizationId: pulumi.Output<string>;
    /**
     * Prefix of the service account key.
     */
    readonly prefix: pulumi.Output<string>;
    /**
     * ID of the service account.
     */
    readonly serviceAccountId: pulumi.Output<string>;
    /**
     * The token of the service account key used for authentication.
     */
    readonly token: pulumi.Output<string>;
    /**
     * Create a ServiceAccountKey resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: ServiceAccountKeyArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering ServiceAccountKey resources.
 */
export interface ServiceAccountKeyState {
    /**
     * Whether the service account key is active. Defaults to true.
     */
    active?: pulumi.Input<boolean>;
    /**
     * The expiration time of the service account key in RFC3339 format. Defaults to an empty string.
     */
    expiresAt?: pulumi.Input<string>;
    /**
     * Last time the service account key was used.
     */
    lastUsedAt?: pulumi.Input<string>;
    /**
     * Name of the service account key.
     */
    name?: pulumi.Input<string>;
    /**
     * ID of the organization.
     */
    organizationId?: pulumi.Input<string>;
    /**
     * Prefix of the service account key.
     */
    prefix?: pulumi.Input<string>;
    /**
     * ID of the service account.
     */
    serviceAccountId?: pulumi.Input<string>;
    /**
     * The token of the service account key used for authentication.
     */
    token?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a ServiceAccountKey resource.
 */
export interface ServiceAccountKeyArgs {
    /**
     * Whether the service account key is active. Defaults to true.
     */
    active?: pulumi.Input<boolean>;
    /**
     * The expiration time of the service account key in RFC3339 format. Defaults to an empty string.
     */
    expiresAt?: pulumi.Input<string>;
    /**
     * Name of the service account key.
     */
    name?: pulumi.Input<string>;
    /**
     * ID of the organization.
     */
    organizationId: pulumi.Input<string>;
    /**
     * ID of the service account.
     */
    serviceAccountId: pulumi.Input<string>;
}
