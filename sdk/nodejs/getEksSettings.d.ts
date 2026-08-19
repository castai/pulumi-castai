import * as pulumi from "@pulumi/pulumi";
export declare function getEksSettings(args: GetEksSettingsArgs, opts?: pulumi.InvokeOptions): Promise<GetEksSettingsResult>;
/**
 * A collection of arguments for invoking getEksSettings.
 */
export interface GetEksSettingsArgs {
    accountId: string;
    cluster: string;
    region: string;
    sharedVpcAccountId?: string;
    vpc: string;
}
/**
 * A collection of values returned by getEksSettings.
 */
export interface GetEksSettingsResult {
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
    readonly sharedVpcAccountId?: string;
    readonly vpc: string;
}
export declare function getEksSettingsOutput(args: GetEksSettingsOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetEksSettingsResult>;
/**
 * A collection of arguments for invoking getEksSettings.
 */
export interface GetEksSettingsOutputArgs {
    accountId: pulumi.Input<string>;
    cluster: pulumi.Input<string>;
    region: pulumi.Input<string>;
    sharedVpcAccountId?: pulumi.Input<string | undefined>;
    vpc: pulumi.Input<string>;
}
//# sourceMappingURL=getEksSettings.d.ts.map