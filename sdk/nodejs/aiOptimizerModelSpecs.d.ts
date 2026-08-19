import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class AiOptimizerModelSpecs extends pulumi.CustomResource {
    /**
     * Get an existing AiOptimizerModelSpecs resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: AiOptimizerModelSpecsState, opts?: pulumi.CustomResourceOptions): AiOptimizerModelSpecs;
    /**
     * Returns true if the given object is an instance of AiOptimizerModelSpecs.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is AiOptimizerModelSpecs;
    /**
     * Model description.
     */
    readonly description: pulumi.Output<string | undefined>;
    /**
     * HuggingFace registry configuration. Required when registryType is HUGGING_FACE.
     */
    readonly huggingface: pulumi.Output<outputs.AiOptimizerModelSpecsHuggingface | undefined>;
    /**
     * Model name.
     */
    readonly model: pulumi.Output<string>;
    /**
     * Private registry configuration. Required when registryType is PRIVATE.
     */
    readonly privateRegistry: pulumi.Output<outputs.AiOptimizerModelSpecsPrivateRegistry | undefined>;
    /**
     * Registry type: HUGGING_FACE or PRIVATE.
     */
    readonly registryType: pulumi.Output<string>;
    /**
     * Whether the model is routable.
     */
    readonly routable: pulumi.Output<boolean | undefined>;
    /**
     * Model type (chat, embeddings, completion, etc.).
     */
    readonly type: pulumi.Output<string | undefined>;
    /**
     * Create a AiOptimizerModelSpecs resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: AiOptimizerModelSpecsArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering AiOptimizerModelSpecs resources.
 */
export interface AiOptimizerModelSpecsState {
    /**
     * Model description.
     */
    description?: pulumi.Input<string | undefined>;
    /**
     * HuggingFace registry configuration. Required when registryType is HUGGING_FACE.
     */
    huggingface?: pulumi.Input<inputs.AiOptimizerModelSpecsHuggingface | undefined>;
    /**
     * Model name.
     */
    model?: pulumi.Input<string | undefined>;
    /**
     * Private registry configuration. Required when registryType is PRIVATE.
     */
    privateRegistry?: pulumi.Input<inputs.AiOptimizerModelSpecsPrivateRegistry | undefined>;
    /**
     * Registry type: HUGGING_FACE or PRIVATE.
     */
    registryType?: pulumi.Input<string | undefined>;
    /**
     * Whether the model is routable.
     */
    routable?: pulumi.Input<boolean | undefined>;
    /**
     * Model type (chat, embeddings, completion, etc.).
     */
    type?: pulumi.Input<string | undefined>;
}
/**
 * The set of arguments for constructing a AiOptimizerModelSpecs resource.
 */
export interface AiOptimizerModelSpecsArgs {
    /**
     * Model description.
     */
    description?: pulumi.Input<string | undefined>;
    /**
     * HuggingFace registry configuration. Required when registryType is HUGGING_FACE.
     */
    huggingface?: pulumi.Input<inputs.AiOptimizerModelSpecsHuggingface | undefined>;
    /**
     * Model name.
     */
    model: pulumi.Input<string>;
    /**
     * Private registry configuration. Required when registryType is PRIVATE.
     */
    privateRegistry?: pulumi.Input<inputs.AiOptimizerModelSpecsPrivateRegistry | undefined>;
    /**
     * Registry type: HUGGING_FACE or PRIVATE.
     */
    registryType: pulumi.Input<string>;
    /**
     * Whether the model is routable.
     */
    routable?: pulumi.Input<boolean | undefined>;
    /**
     * Model type (chat, embeddings, completion, etc.).
     */
    type?: pulumi.Input<string | undefined>;
}
//# sourceMappingURL=aiOptimizerModelSpecs.d.ts.map