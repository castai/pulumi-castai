import * as pulumi from "@pulumi/pulumi";
export declare class CacheConfiguration extends pulumi.CustomResource {
    /**
     * Get an existing CacheConfiguration resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: CacheConfigurationState, opts?: pulumi.CustomResourceOptions): CacheConfiguration;
    /**
     * Returns true if the given object is an instance of CacheConfiguration.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is CacheConfiguration;
    /**
     * ID of the cache group this configuration belongs to.
     */
    readonly cacheGroupId: pulumi.Output<string>;
    /**
     * Logical database name to cache.
     */
    readonly databaseName: pulumi.Output<string>;
    /**
     * Caching mode for this database. Valid values: Auto, DontCache, Manual.
     */
    readonly mode: pulumi.Output<string>;
    /**
     * Create a CacheConfiguration resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: CacheConfigurationArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering CacheConfiguration resources.
 */
export interface CacheConfigurationState {
    /**
     * ID of the cache group this configuration belongs to.
     */
    cacheGroupId?: pulumi.Input<string | undefined>;
    /**
     * Logical database name to cache.
     */
    databaseName?: pulumi.Input<string | undefined>;
    /**
     * Caching mode for this database. Valid values: Auto, DontCache, Manual.
     */
    mode?: pulumi.Input<string | undefined>;
}
/**
 * The set of arguments for constructing a CacheConfiguration resource.
 */
export interface CacheConfigurationArgs {
    /**
     * ID of the cache group this configuration belongs to.
     */
    cacheGroupId: pulumi.Input<string>;
    /**
     * Logical database name to cache.
     */
    databaseName: pulumi.Input<string>;
    /**
     * Caching mode for this database. Valid values: Auto, DontCache, Manual.
     */
    mode: pulumi.Input<string>;
}
//# sourceMappingURL=cacheConfiguration.d.ts.map