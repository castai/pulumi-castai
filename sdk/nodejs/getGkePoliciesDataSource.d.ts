import * as pulumi from "@pulumi/pulumi";
export declare function getGkePoliciesDataSource(opts?: pulumi.InvokeOptions): Promise<GetGkePoliciesDataSourceResult>;
/**
 * A collection of values returned by GetGkePoliciesDataSource.
 */
export interface GetGkePoliciesDataSourceResult {
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly policies: string[];
}
export declare function getGkePoliciesDataSourceOutput(opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetGkePoliciesDataSourceResult>;
