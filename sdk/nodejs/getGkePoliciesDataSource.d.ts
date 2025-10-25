import * as pulumi from "@pulumi/pulumi";
export declare function getGkePoliciesDataSource(args?: GetGkePoliciesDataSourceArgs, opts?: pulumi.InvokeOptions): Promise<GetGkePoliciesDataSourceResult>;
/**
 * A collection of arguments for invoking GetGkePoliciesDataSource.
 */
export interface GetGkePoliciesDataSourceArgs {
    features?: {
        [key: string]: boolean;
    };
}
/**
 * A collection of values returned by GetGkePoliciesDataSource.
 */
export interface GetGkePoliciesDataSourceResult {
    readonly features?: {
        [key: string]: boolean;
    };
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly policies: string[];
}
export declare function getGkePoliciesDataSourceOutput(args?: GetGkePoliciesDataSourceOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetGkePoliciesDataSourceResult>;
/**
 * A collection of arguments for invoking GetGkePoliciesDataSource.
 */
export interface GetGkePoliciesDataSourceOutputArgs {
    features?: pulumi.Input<{
        [key: string]: pulumi.Input<boolean>;
    }>;
}
