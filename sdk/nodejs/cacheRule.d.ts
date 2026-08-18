import * as pulumi from "@pulumi/pulumi";
export declare class CacheRule extends pulumi.CustomResource {
    /**
     * Get an existing CacheRule resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: CacheRuleState, opts?: pulumi.CustomResourceOptions): CacheRule;
    /**
     * Returns true if the given object is an instance of CacheRule.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is CacheRule;
    /**
     * ID of the cache configuration this rule belongs to.
     */
    readonly cacheConfigurationId: pulumi.Output<string>;
    /**
     * ID of the cache group this rule belongs to.
     */
    readonly cacheGroupId: pulumi.Output<string>;
    /**
     * TTL in seconds. Required when mode is Manual.
     */
    readonly manualTtl: pulumi.Output<number | undefined>;
    /**
     * TTL mode for queries matching this rule. Valid values: Auto, DontCache, Manual.
     */
    readonly mode: pulumi.Output<string>;
    /**
     * Database table name to apply this rule to. Either table or templateHash must be specified.
     */
    readonly table: pulumi.Output<string | undefined>;
    /**
     * Hash of the query template. Either table or templateHash must be specified.
     */
    readonly templateHash: pulumi.Output<string | undefined>;
    /**
     * Create a CacheRule resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: CacheRuleArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering CacheRule resources.
 */
export interface CacheRuleState {
    /**
     * ID of the cache configuration this rule belongs to.
     */
    cacheConfigurationId?: pulumi.Input<string | undefined>;
    /**
     * ID of the cache group this rule belongs to.
     */
    cacheGroupId?: pulumi.Input<string | undefined>;
    /**
     * TTL in seconds. Required when mode is Manual.
     */
    manualTtl?: pulumi.Input<number | undefined>;
    /**
     * TTL mode for queries matching this rule. Valid values: Auto, DontCache, Manual.
     */
    mode?: pulumi.Input<string | undefined>;
    /**
     * Database table name to apply this rule to. Either table or templateHash must be specified.
     */
    table?: pulumi.Input<string | undefined>;
    /**
     * Hash of the query template. Either table or templateHash must be specified.
     */
    templateHash?: pulumi.Input<string | undefined>;
}
/**
 * The set of arguments for constructing a CacheRule resource.
 */
export interface CacheRuleArgs {
    /**
     * ID of the cache configuration this rule belongs to.
     */
    cacheConfigurationId: pulumi.Input<string>;
    /**
     * ID of the cache group this rule belongs to.
     */
    cacheGroupId: pulumi.Input<string>;
    /**
     * TTL in seconds. Required when mode is Manual.
     */
    manualTtl?: pulumi.Input<number | undefined>;
    /**
     * TTL mode for queries matching this rule. Valid values: Auto, DontCache, Manual.
     */
    mode: pulumi.Input<string>;
    /**
     * Database table name to apply this rule to. Either table or templateHash must be specified.
     */
    table?: pulumi.Input<string | undefined>;
    /**
     * Hash of the query template. Either table or templateHash must be specified.
     */
    templateHash?: pulumi.Input<string | undefined>;
}
//# sourceMappingURL=cacheRule.d.ts.map