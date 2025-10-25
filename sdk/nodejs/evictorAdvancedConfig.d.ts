import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class EvictorAdvancedConfig extends pulumi.CustomResource {
    /**
     * Get an existing EvictorAdvancedConfig resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: EvictorAdvancedConfigState, opts?: pulumi.CustomResourceOptions): EvictorAdvancedConfig;
    /**
     * Returns true if the given object is an instance of EvictorAdvancedConfig.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is EvictorAdvancedConfig;
    /**
     * CAST AI cluster id.
     */
    readonly clusterId: pulumi.Output<string>;
    /**
     * evictor advanced configuration to target specific node/pod
     */
    readonly evictorAdvancedConfigs: pulumi.Output<outputs.autoscaling.EvictorAdvancedConfigEvictorAdvancedConfig[]>;
    /**
     * Create a EvictorAdvancedConfig resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: EvictorAdvancedConfigArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering EvictorAdvancedConfig resources.
 */
export interface EvictorAdvancedConfigState {
    /**
     * CAST AI cluster id.
     */
    clusterId?: pulumi.Input<string>;
    /**
     * evictor advanced configuration to target specific node/pod
     */
    evictorAdvancedConfigs?: pulumi.Input<pulumi.Input<inputs.autoscaling.EvictorAdvancedConfigEvictorAdvancedConfig>[]>;
}
/**
 * The set of arguments for constructing a EvictorAdvancedConfig resource.
 */
export interface EvictorAdvancedConfigArgs {
    /**
     * CAST AI cluster id.
     */
    clusterId: pulumi.Input<string>;
    /**
     * evictor advanced configuration to target specific node/pod
     */
    evictorAdvancedConfigs: pulumi.Input<pulumi.Input<inputs.autoscaling.EvictorAdvancedConfigEvictorAdvancedConfig>[]>;
}
