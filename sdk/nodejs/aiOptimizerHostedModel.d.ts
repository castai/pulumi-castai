import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class AiOptimizerHostedModel extends pulumi.CustomResource {
    /**
     * Get an existing AiOptimizerHostedModel resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: AiOptimizerHostedModelState, opts?: pulumi.CustomResourceOptions): AiOptimizerHostedModel;
    /**
     * Returns true if the given object is an instance of AiOptimizerHostedModel.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is AiOptimizerHostedModel;
    /**
     * Cloud provider.
     */
    readonly cloudProvider: pulumi.Output<string>;
    /**
     * CAST AI cluster ID where the model will be deployed.
     */
    readonly clusterId: pulumi.Output<string>;
    /**
     * Current number of replicas.
     */
    readonly currentReplicas: pulumi.Output<number>;
    /**
     * List of edge location IDs where the model can be deployed.
     */
    readonly edgeLocationIds: pulumi.Output<string[] | undefined>;
    /**
     * Fallback model settings.
     */
    readonly fallback: pulumi.Output<outputs.AiOptimizerHostedModelFallback | undefined>;
    /**
     * Automatic hibernation settings.
     */
    readonly hibernation: pulumi.Output<outputs.AiOptimizerHostedModelHibernation | undefined>;
    /**
     * Horizontal autoscaling settings.
     */
    readonly horizontalAutoscaling: pulumi.Output<outputs.AiOptimizerHostedModelHorizontalAutoscaling | undefined>;
    /**
     * ID of the model specs. Can reference a castai.AiOptimizerModelSpecs resource or a pre-existing model specs ID for predefined (CastAI-managed) models.
     */
    readonly modelSpecsId: pulumi.Output<string>;
    /**
     * Kubernetes namespace.
     */
    readonly namespace: pulumi.Output<string>;
    /**
     * Node template name for model deployment.
     */
    readonly nodeTemplateName: pulumi.Output<string | undefined>;
    /**
     * Port on which the model will be exposed.
     */
    readonly port: pulumi.Output<number>;
    /**
     * Region the model is deployed in.
     */
    readonly region: pulumi.Output<string>;
    /**
     * Kubernetes service name for the deployed model.
     */
    readonly service: pulumi.Output<string>;
    /**
     * Hosted model status.
     */
    readonly status: pulumi.Output<string>;
    /**
     * Reason for the current status.
     */
    readonly statusReason: pulumi.Output<string>;
    /**
     * vLLM configuration for HuggingFace models.
     */
    readonly vllmConfig: pulumi.Output<outputs.AiOptimizerHostedModelVllmConfig | undefined>;
    /**
     * Create a AiOptimizerHostedModel resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: AiOptimizerHostedModelArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering AiOptimizerHostedModel resources.
 */
export interface AiOptimizerHostedModelState {
    /**
     * Cloud provider.
     */
    cloudProvider?: pulumi.Input<string | undefined>;
    /**
     * CAST AI cluster ID where the model will be deployed.
     */
    clusterId?: pulumi.Input<string | undefined>;
    /**
     * Current number of replicas.
     */
    currentReplicas?: pulumi.Input<number | undefined>;
    /**
     * List of edge location IDs where the model can be deployed.
     */
    edgeLocationIds?: pulumi.Input<pulumi.Input<string>[] | undefined>;
    /**
     * Fallback model settings.
     */
    fallback?: pulumi.Input<inputs.AiOptimizerHostedModelFallback | undefined>;
    /**
     * Automatic hibernation settings.
     */
    hibernation?: pulumi.Input<inputs.AiOptimizerHostedModelHibernation | undefined>;
    /**
     * Horizontal autoscaling settings.
     */
    horizontalAutoscaling?: pulumi.Input<inputs.AiOptimizerHostedModelHorizontalAutoscaling | undefined>;
    /**
     * ID of the model specs. Can reference a castai.AiOptimizerModelSpecs resource or a pre-existing model specs ID for predefined (CastAI-managed) models.
     */
    modelSpecsId?: pulumi.Input<string | undefined>;
    /**
     * Kubernetes namespace.
     */
    namespace?: pulumi.Input<string | undefined>;
    /**
     * Node template name for model deployment.
     */
    nodeTemplateName?: pulumi.Input<string | undefined>;
    /**
     * Port on which the model will be exposed.
     */
    port?: pulumi.Input<number | undefined>;
    /**
     * Region the model is deployed in.
     */
    region?: pulumi.Input<string | undefined>;
    /**
     * Kubernetes service name for the deployed model.
     */
    service?: pulumi.Input<string | undefined>;
    /**
     * Hosted model status.
     */
    status?: pulumi.Input<string | undefined>;
    /**
     * Reason for the current status.
     */
    statusReason?: pulumi.Input<string | undefined>;
    /**
     * vLLM configuration for HuggingFace models.
     */
    vllmConfig?: pulumi.Input<inputs.AiOptimizerHostedModelVllmConfig | undefined>;
}
/**
 * The set of arguments for constructing a AiOptimizerHostedModel resource.
 */
export interface AiOptimizerHostedModelArgs {
    /**
     * CAST AI cluster ID where the model will be deployed.
     */
    clusterId: pulumi.Input<string>;
    /**
     * List of edge location IDs where the model can be deployed.
     */
    edgeLocationIds?: pulumi.Input<pulumi.Input<string>[] | undefined>;
    /**
     * Fallback model settings.
     */
    fallback?: pulumi.Input<inputs.AiOptimizerHostedModelFallback | undefined>;
    /**
     * Automatic hibernation settings.
     */
    hibernation?: pulumi.Input<inputs.AiOptimizerHostedModelHibernation | undefined>;
    /**
     * Horizontal autoscaling settings.
     */
    horizontalAutoscaling?: pulumi.Input<inputs.AiOptimizerHostedModelHorizontalAutoscaling | undefined>;
    /**
     * ID of the model specs. Can reference a castai.AiOptimizerModelSpecs resource or a pre-existing model specs ID for predefined (CastAI-managed) models.
     */
    modelSpecsId: pulumi.Input<string>;
    /**
     * Node template name for model deployment.
     */
    nodeTemplateName?: pulumi.Input<string | undefined>;
    /**
     * Port on which the model will be exposed.
     */
    port: pulumi.Input<number>;
    /**
     * Kubernetes service name for the deployed model.
     */
    service: pulumi.Input<string>;
    /**
     * vLLM configuration for HuggingFace models.
     */
    vllmConfig?: pulumi.Input<inputs.AiOptimizerHostedModelVllmConfig | undefined>;
}
//# sourceMappingURL=aiOptimizerHostedModel.d.ts.map