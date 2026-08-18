import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class CacheGroup extends pulumi.CustomResource {
    /**
     * Get an existing CacheGroup resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: CacheGroupState, opts?: pulumi.CustomResourceOptions): CacheGroup;
    /**
     * Returns true if the given object is an instance of CacheGroup.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is CacheGroup;
    /**
     * Enable direct mode for the cache group.
     */
    readonly directMode: pulumi.Output<boolean | undefined>;
    /**
     * Connection endpoints for the cache group. At least one endpoint is required when specified.
     */
    readonly endpoints: pulumi.Output<outputs.cache.CacheGroupEndpoint[]>;
    /**
     * Display name for the cache group.
     */
    readonly name: pulumi.Output<string>;
    /**
     * Database protocol type. Valid values: MySQL or PostgreSQL
     */
    readonly protocolType: pulumi.Output<string>;
    /**
     * Create a CacheGroup resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: CacheGroupArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering CacheGroup resources.
 */
export interface CacheGroupState {
    /**
     * Enable direct mode for the cache group.
     */
    directMode?: pulumi.Input<boolean | undefined>;
    /**
     * Connection endpoints for the cache group. At least one endpoint is required when specified.
     */
    endpoints?: pulumi.Input<pulumi.Input<inputs.cache.CacheGroupEndpoint>[] | undefined>;
    /**
     * Display name for the cache group.
     */
    name?: pulumi.Input<string | undefined>;
    /**
     * Database protocol type. Valid values: MySQL or PostgreSQL
     */
    protocolType?: pulumi.Input<string | undefined>;
}
/**
 * The set of arguments for constructing a CacheGroup resource.
 */
export interface CacheGroupArgs {
    /**
     * Enable direct mode for the cache group.
     */
    directMode?: pulumi.Input<boolean | undefined>;
    /**
     * Connection endpoints for the cache group. At least one endpoint is required when specified.
     */
    endpoints?: pulumi.Input<pulumi.Input<inputs.cache.CacheGroupEndpoint>[] | undefined>;
    /**
     * Display name for the cache group.
     */
    name?: pulumi.Input<string | undefined>;
    /**
     * Database protocol type. Valid values: MySQL or PostgreSQL
     */
    protocolType: pulumi.Input<string>;
}
//# sourceMappingURL=cacheGroup.d.ts.map