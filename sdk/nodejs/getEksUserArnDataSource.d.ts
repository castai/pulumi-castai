import * as pulumi from "@pulumi/pulumi";
export declare function getEksUserArnDataSource(args: GetEksUserArnDataSourceArgs, opts?: pulumi.InvokeOptions): Promise<GetEksUserArnDataSourceResult>;
/**
 * A collection of arguments for invoking GetEksUserArnDataSource.
 */
export interface GetEksUserArnDataSourceArgs {
    clusterId: string;
}
/**
 * A collection of values returned by GetEksUserArnDataSource.
 */
export interface GetEksUserArnDataSourceResult {
    readonly arn: string;
    readonly clusterId: string;
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
}
export declare function getEksUserArnDataSourceOutput(args: GetEksUserArnDataSourceOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetEksUserArnDataSourceResult>;
/**
 * A collection of arguments for invoking GetEksUserArnDataSource.
 */
export interface GetEksUserArnDataSourceOutputArgs {
    clusterId: pulumi.Input<string>;
}
