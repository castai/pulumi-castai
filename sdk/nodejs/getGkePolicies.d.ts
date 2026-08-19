import * as pulumi from "@pulumi/pulumi";
export declare function getGkePolicies(args?: GetGkePoliciesArgs, opts?: pulumi.InvokeOptions): Promise<GetGkePoliciesResult>;
/**
 * A collection of arguments for invoking getGkePolicies.
 */
export interface GetGkePoliciesArgs {
    features?: {
        [key: string]: boolean;
    };
}
/**
 * A collection of values returned by getGkePolicies.
 */
export interface GetGkePoliciesResult {
    readonly features?: {
        [key: string]: boolean;
    };
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly policies: string[];
}
export declare function getGkePoliciesOutput(args?: GetGkePoliciesOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetGkePoliciesResult>;
/**
 * A collection of arguments for invoking getGkePolicies.
 */
export interface GetGkePoliciesOutputArgs {
    features?: pulumi.Input<{
        [key: string]: pulumi.Input<boolean>;
    } | undefined>;
}
//# sourceMappingURL=getGkePolicies.d.ts.map