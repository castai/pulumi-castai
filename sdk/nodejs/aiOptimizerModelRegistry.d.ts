import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class AiOptimizerModelRegistry extends pulumi.CustomResource {
    /**
     * Get an existing AiOptimizerModelRegistry resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: AiOptimizerModelRegistryState, opts?: pulumi.CustomResourceOptions): AiOptimizerModelRegistry;
    /**
     * Returns true if the given object is an instance of AiOptimizerModelRegistry.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is AiOptimizerModelRegistry;
    /**
     * JSON-encoded credentials for accessing the bucket.
     */
    readonly credentials: pulumi.Output<string>;
    /**
     * Google Cloud Storage provider configuration. Required when providerType is GCS.
     */
    readonly gcs: pulumi.Output<outputs.AiOptimizerModelRegistryGcs | undefined>;
    /**
     * Provider type: S3 or GCS.
     */
    readonly providerType: pulumi.Output<string | undefined>;
    /**
     * AWS S3 provider configuration. Required when providerType is S3.
     */
    readonly s3: pulumi.Output<outputs.AiOptimizerModelRegistryS3 | undefined>;
    /**
     * Registry status.
     */
    readonly status: pulumi.Output<string>;
    /**
     * Reason for the current status.
     */
    readonly statusReason: pulumi.Output<string>;
    /**
     * Create a AiOptimizerModelRegistry resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: AiOptimizerModelRegistryArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering AiOptimizerModelRegistry resources.
 */
export interface AiOptimizerModelRegistryState {
    /**
     * JSON-encoded credentials for accessing the bucket.
     */
    credentials?: pulumi.Input<string | undefined>;
    /**
     * Google Cloud Storage provider configuration. Required when providerType is GCS.
     */
    gcs?: pulumi.Input<inputs.AiOptimizerModelRegistryGcs | undefined>;
    /**
     * Provider type: S3 or GCS.
     */
    providerType?: pulumi.Input<string | undefined>;
    /**
     * AWS S3 provider configuration. Required when providerType is S3.
     */
    s3?: pulumi.Input<inputs.AiOptimizerModelRegistryS3 | undefined>;
    /**
     * Registry status.
     */
    status?: pulumi.Input<string | undefined>;
    /**
     * Reason for the current status.
     */
    statusReason?: pulumi.Input<string | undefined>;
}
/**
 * The set of arguments for constructing a AiOptimizerModelRegistry resource.
 */
export interface AiOptimizerModelRegistryArgs {
    /**
     * JSON-encoded credentials for accessing the bucket.
     */
    credentials: pulumi.Input<string>;
    /**
     * Google Cloud Storage provider configuration. Required when providerType is GCS.
     */
    gcs?: pulumi.Input<inputs.AiOptimizerModelRegistryGcs | undefined>;
    /**
     * Provider type: S3 or GCS.
     */
    providerType?: pulumi.Input<string | undefined>;
    /**
     * AWS S3 provider configuration. Required when providerType is S3.
     */
    s3?: pulumi.Input<inputs.AiOptimizerModelRegistryS3 | undefined>;
}
//# sourceMappingURL=aiOptimizerModelRegistry.d.ts.map