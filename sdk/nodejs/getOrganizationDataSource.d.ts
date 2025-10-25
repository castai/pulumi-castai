import * as pulumi from "@pulumi/pulumi";
export declare function getOrganizationDataSource(args: GetOrganizationDataSourceArgs, opts?: pulumi.InvokeOptions): Promise<GetOrganizationDataSourceResult>;
/**
 * A collection of arguments for invoking GetOrganizationDataSource.
 */
export interface GetOrganizationDataSourceArgs {
    name: string;
}
/**
 * A collection of values returned by GetOrganizationDataSource.
 */
export interface GetOrganizationDataSourceResult {
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly name: string;
}
export declare function getOrganizationDataSourceOutput(args: GetOrganizationDataSourceOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetOrganizationDataSourceResult>;
/**
 * A collection of arguments for invoking GetOrganizationDataSource.
 */
export interface GetOrganizationDataSourceOutputArgs {
    name: pulumi.Input<string>;
}
