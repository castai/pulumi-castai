import * as pulumi from "@pulumi/pulumi";
import * as outputs from "./types/output";
export declare function getCacheGroup(args: GetCacheGroupArgs, opts?: pulumi.InvokeOptions): Promise<GetCacheGroupResult>;
/**
 * A collection of arguments for invoking getCacheGroup.
 */
export interface GetCacheGroupArgs {
    id: string;
}
/**
 * A collection of values returned by getCacheGroup.
 */
export interface GetCacheGroupResult {
    readonly directMode: boolean;
    readonly endpoints: outputs.cache.GetCacheGroupEndpoint[];
    readonly id: string;
    readonly name: string;
    readonly protocolType: string;
}
export declare function getCacheGroupOutput(args: GetCacheGroupOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetCacheGroupResult>;
/**
 * A collection of arguments for invoking getCacheGroup.
 */
export interface GetCacheGroupOutputArgs {
    id: pulumi.Input<string>;
}
//# sourceMappingURL=getCacheGroup.d.ts.map