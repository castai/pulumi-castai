import * as pulumi from "@pulumi/pulumi";
export declare function getEksClusterIdDataSource(args: GetEksClusterIdDataSourceArgs, opts?: pulumi.InvokeOptions): Promise<GetEksClusterIdDataSourceResult>;
/**
 * A collection of arguments for invoking GetEksClusterIdDataSource.
 */
export interface GetEksClusterIdDataSourceArgs {
    accountId: string;
    clusterName: string;
    region: string;
}
/**
 * A collection of values returned by GetEksClusterIdDataSource.
 */
export interface GetEksClusterIdDataSourceResult {
    readonly accountId: string;
    readonly clusterName: string;
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly region: string;
}
export declare function getEksClusterIdDataSourceOutput(args: GetEksClusterIdDataSourceOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetEksClusterIdDataSourceResult>;
/**
 * A collection of arguments for invoking GetEksClusterIdDataSource.
 */
export interface GetEksClusterIdDataSourceOutputArgs {
    accountId: pulumi.Input<string>;
    clusterName: pulumi.Input<string>;
    region: pulumi.Input<string>;
}
