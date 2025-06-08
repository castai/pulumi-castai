import * as pulumi from "@pulumi/pulumi";
/**
 * The provider type for the castai package. By default, resources use package-wide configuration
 * settings, however an explicit `Provider` instance may be created and passed during resource
 * construction to achieve fine-grained programmatic control over provider settings. See the
 * [documentation](https://www.pulumi.com/docs/reference/programming-model/#providers) for more information.
 */
export declare class Provider extends pulumi.ProviderResource {
    /**
     * Returns true if the given object is an instance of Provider.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Provider;
    /**
     * The token used to connect to CAST AI API.
     */
    readonly apiToken: pulumi.Output<string | undefined>;
    /**
     * CAST.AI API url.
     */
    readonly apiUrl: pulumi.Output<string | undefined>;
    /**
     * Create a Provider resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: ProviderArgs, opts?: pulumi.ResourceOptions);
}
/**
 * The set of arguments for constructing a Provider resource.
 */
export interface ProviderArgs {
    /**
     * The token used to connect to CAST AI API.
     */
    apiToken?: pulumi.Input<string>;
    /**
     * CAST.AI API url.
     */
    apiUrl?: pulumi.Input<string>;
}
