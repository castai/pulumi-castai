import * as pulumi from "@pulumi/pulumi";
export declare function getCredentialsDataSource(args?: GetCredentialsDataSourceArgs, opts?: pulumi.InvokeOptions): Promise<GetCredentialsDataSourceResult>;
/**
 * A collection of arguments for invoking GetCredentialsDataSource.
 */
export interface GetCredentialsDataSourceArgs {
    /**
     * The ID of this resource.
     */
    id?: string;
    name?: string;
}
/**
 * A collection of values returned by GetCredentialsDataSource.
 */
export interface GetCredentialsDataSourceResult {
    readonly cloud: string;
    /**
     * The ID of this resource.
     */
    readonly id?: string;
    readonly name?: string;
}
export declare function getCredentialsDataSourceOutput(args?: GetCredentialsDataSourceOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetCredentialsDataSourceResult>;
/**
 * A collection of arguments for invoking GetCredentialsDataSource.
 */
export interface GetCredentialsDataSourceOutputArgs {
    /**
     * The ID of this resource.
     */
    id?: pulumi.Input<string>;
    name?: pulumi.Input<string>;
}
