import * as pulumi from "@pulumi/pulumi";
export declare function getEksSettingsDataSource(args: GetEksSettingsDataSourceArgs, opts?: pulumi.InvokeOptions): Promise<GetEksSettingsDataSourceResult>;
/**
 * A collection of arguments for invoking GetEksSettingsDataSource.
 */
export interface GetEksSettingsDataSourceArgs {
    accountId: string;
    cluster: string;
    region: string;
    vpc: string;
}
/**
 * A collection of values returned by GetEksSettingsDataSource.
 */
export interface GetEksSettingsDataSourceResult {
    readonly accountId: string;
    readonly cluster: string;
    readonly iamManagedPolicies: string[];
    readonly iamPolicyJson: string;
    readonly iamUserPolicyJson: string;
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly region: string;
    readonly vpc: string;
}
export declare function getEksSettingsDataSourceOutput(args: GetEksSettingsDataSourceOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetEksSettingsDataSourceResult>;
/**
 * A collection of arguments for invoking GetEksSettingsDataSource.
 */
export interface GetEksSettingsDataSourceOutputArgs {
    accountId: pulumi.Input<string>;
    cluster: pulumi.Input<string>;
    region: pulumi.Input<string>;
    vpc: pulumi.Input<string>;
}
