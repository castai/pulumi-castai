// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as utilities from "./utilities";

export function getCredentialsDataSource(args?: GetCredentialsDataSourceArgs, opts?: pulumi.InvokeOptions): Promise<GetCredentialsDataSourceResult> {
    args = args || {};
    opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts || {});
    return pulumi.runtime.invoke("castai:index:GetCredentialsDataSource", {
        "id": args.id,
        "name": args.name,
    }, opts);
}

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
export function getCredentialsDataSourceOutput(args?: GetCredentialsDataSourceOutputArgs, opts?: pulumi.InvokeOutputOptions): pulumi.Output<GetCredentialsDataSourceResult> {
    args = args || {};
    opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts || {});
    return pulumi.runtime.invokeOutput("castai:index:GetCredentialsDataSource", {
        "id": args.id,
        "name": args.name,
    }, opts);
}

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
