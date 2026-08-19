import * as pulumi from "@pulumi/pulumi";
export declare function getOrganization(args: GetOrganizationArgs, opts?: pulumi.InvokeOptions): Promise<GetOrganizationResult>;
/**
 * A collection of arguments for invoking getOrganization.
 */
export interface GetOrganizationArgs {
    name: string;
}
/**
 * A collection of values returned by getOrganization.
 */
export interface GetOrganizationResult {
    /**
     * The provider-assigned unique ID for this managed resource.
     */
    readonly id: string;
    readonly name: string;
}
export declare function getOrganizationOutput(args: GetOrganizationOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetOrganizationResult>;
/**
 * A collection of arguments for invoking getOrganization.
 */
export interface GetOrganizationOutputArgs {
    name: pulumi.Input<string>;
}
//# sourceMappingURL=getOrganization.d.ts.map