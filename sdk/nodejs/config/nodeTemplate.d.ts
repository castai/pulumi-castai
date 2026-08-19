import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
export declare class NodeTemplate extends pulumi.CustomResource {
    /**
     * Get an existing NodeTemplate resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: NodeTemplateState, opts?: pulumi.CustomResourceOptions): NodeTemplate;
    /**
     * Returns true if the given object is an instance of NodeTemplate.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is NodeTemplate;
    /**
     * Marks whether Container Live Migration (CLM) should be enabled for nodes created from this template. Supported on EKS, GKE, and AKS clusters. CLM-enabled nodes participate in live workload migration during rebalancing, scale-down, and node lifecycle events.
     */
    readonly clmEnabled: pulumi.Output<boolean | undefined>;
    /**
     * CAST AI cluster id.
     */
    readonly clusterId: pulumi.Output<string | undefined>;
    /**
     * CAST AI node configuration id to be used for node template.
     */
    readonly configurationId: pulumi.Output<string | undefined>;
    readonly constraints: pulumi.Output<outputs.config.NodeTemplateConstraints | undefined>;
    /**
     * Marks whether custom instances should be used when deciding which parts of inventory are available. Custom instances are only supported in GCP.
     */
    readonly customInstancesEnabled: pulumi.Output<boolean | undefined>;
    /**
     * Marks whether custom instances with extended memory should be used when deciding which parts of inventory are available. Custom instances are only supported in GCP.
     */
    readonly customInstancesWithExtendedMemoryEnabled: pulumi.Output<boolean | undefined>;
    /**
     * Custom labels to be added to nodes created from this template.
     */
    readonly customLabels: pulumi.Output<{
        [key: string]: string;
    } | undefined>;
    /**
     * Custom taints to be added to the nodes created from this template. `shouldTaint` has to be `true` in order to create/update the node template with custom taints. If `shouldTaint` is `true`, but no custom taints are provided, the nodes will be tainted with the default node template taint.
     */
    readonly customTaints: pulumi.Output<outputs.config.NodeTemplateCustomTaint[] | undefined>;
    /**
     * List of edge location IDs to associate with this node template. Must be valid UUIDs referencing castaiEdgeLocation resources.
     */
    readonly edgeLocationIds: pulumi.Output<string[] | undefined>;
    /**
     * GPU configuration.
     */
    readonly gpu: pulumi.Output<outputs.config.NodeTemplateGpu | undefined>;
    /**
     * Flag whether the node template is default. It's is always set to 'true' on 'default-by-castai' node template and 'false' otherwise.
     */
    readonly isDefault: pulumi.Output<boolean>;
    /**
     * Flag whether the node template is enabled and considered for autoscaling.
     */
    readonly isEnabled: pulumi.Output<boolean>;
    /**
     * Name of the node template.
     */
    readonly name: pulumi.Output<string>;
    /**
     * Configuration for adjusting instance type prices during autoscaling. Adjustments only affect placement decisions, not cost reporting.
     */
    readonly priceAdjustmentConfiguration: pulumi.Output<outputs.config.NodeTemplatePriceAdjustmentConfiguration | undefined>;
    /**
     * Minimum nodes that will be kept when rebalancing nodes using this node template.
     */
    readonly rebalancingConfigMinNodes: pulumi.Output<number | undefined>;
    /**
     * Marks whether the templated nodes will have a taint.
     */
    readonly shouldTaint: pulumi.Output<boolean | undefined>;
    /**
     * Create a NodeTemplate resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: NodeTemplateArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering NodeTemplate resources.
 */
export interface NodeTemplateState {
    /**
     * Marks whether Container Live Migration (CLM) should be enabled for nodes created from this template. Supported on EKS, GKE, and AKS clusters. CLM-enabled nodes participate in live workload migration during rebalancing, scale-down, and node lifecycle events.
     */
    clmEnabled?: pulumi.Input<boolean | undefined>;
    /**
     * CAST AI cluster id.
     */
    clusterId?: pulumi.Input<string | undefined>;
    /**
     * CAST AI node configuration id to be used for node template.
     */
    configurationId?: pulumi.Input<string | undefined>;
    constraints?: pulumi.Input<inputs.config.NodeTemplateConstraints | undefined>;
    /**
     * Marks whether custom instances should be used when deciding which parts of inventory are available. Custom instances are only supported in GCP.
     */
    customInstancesEnabled?: pulumi.Input<boolean | undefined>;
    /**
     * Marks whether custom instances with extended memory should be used when deciding which parts of inventory are available. Custom instances are only supported in GCP.
     */
    customInstancesWithExtendedMemoryEnabled?: pulumi.Input<boolean | undefined>;
    /**
     * Custom labels to be added to nodes created from this template.
     */
    customLabels?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    } | undefined>;
    /**
     * Custom taints to be added to the nodes created from this template. `shouldTaint` has to be `true` in order to create/update the node template with custom taints. If `shouldTaint` is `true`, but no custom taints are provided, the nodes will be tainted with the default node template taint.
     */
    customTaints?: pulumi.Input<pulumi.Input<inputs.config.NodeTemplateCustomTaint>[] | undefined>;
    /**
     * List of edge location IDs to associate with this node template. Must be valid UUIDs referencing castaiEdgeLocation resources.
     */
    edgeLocationIds?: pulumi.Input<pulumi.Input<string>[] | undefined>;
    /**
     * GPU configuration.
     */
    gpu?: pulumi.Input<inputs.config.NodeTemplateGpu | undefined>;
    /**
     * Flag whether the node template is default. It's is always set to 'true' on 'default-by-castai' node template and 'false' otherwise.
     */
    isDefault?: pulumi.Input<boolean | undefined>;
    /**
     * Flag whether the node template is enabled and considered for autoscaling.
     */
    isEnabled?: pulumi.Input<boolean | undefined>;
    /**
     * Name of the node template.
     */
    name?: pulumi.Input<string | undefined>;
    /**
     * Configuration for adjusting instance type prices during autoscaling. Adjustments only affect placement decisions, not cost reporting.
     */
    priceAdjustmentConfiguration?: pulumi.Input<inputs.config.NodeTemplatePriceAdjustmentConfiguration | undefined>;
    /**
     * Minimum nodes that will be kept when rebalancing nodes using this node template.
     */
    rebalancingConfigMinNodes?: pulumi.Input<number | undefined>;
    /**
     * Marks whether the templated nodes will have a taint.
     */
    shouldTaint?: pulumi.Input<boolean | undefined>;
}
/**
 * The set of arguments for constructing a NodeTemplate resource.
 */
export interface NodeTemplateArgs {
    /**
     * Marks whether Container Live Migration (CLM) should be enabled for nodes created from this template. Supported on EKS, GKE, and AKS clusters. CLM-enabled nodes participate in live workload migration during rebalancing, scale-down, and node lifecycle events.
     */
    clmEnabled?: pulumi.Input<boolean | undefined>;
    /**
     * CAST AI cluster id.
     */
    clusterId?: pulumi.Input<string | undefined>;
    /**
     * CAST AI node configuration id to be used for node template.
     */
    configurationId?: pulumi.Input<string | undefined>;
    constraints?: pulumi.Input<inputs.config.NodeTemplateConstraints | undefined>;
    /**
     * Marks whether custom instances should be used when deciding which parts of inventory are available. Custom instances are only supported in GCP.
     */
    customInstancesEnabled?: pulumi.Input<boolean | undefined>;
    /**
     * Marks whether custom instances with extended memory should be used when deciding which parts of inventory are available. Custom instances are only supported in GCP.
     */
    customInstancesWithExtendedMemoryEnabled?: pulumi.Input<boolean | undefined>;
    /**
     * Custom labels to be added to nodes created from this template.
     */
    customLabels?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    } | undefined>;
    /**
     * Custom taints to be added to the nodes created from this template. `shouldTaint` has to be `true` in order to create/update the node template with custom taints. If `shouldTaint` is `true`, but no custom taints are provided, the nodes will be tainted with the default node template taint.
     */
    customTaints?: pulumi.Input<pulumi.Input<inputs.config.NodeTemplateCustomTaint>[] | undefined>;
    /**
     * List of edge location IDs to associate with this node template. Must be valid UUIDs referencing castaiEdgeLocation resources.
     */
    edgeLocationIds?: pulumi.Input<pulumi.Input<string>[] | undefined>;
    /**
     * GPU configuration.
     */
    gpu?: pulumi.Input<inputs.config.NodeTemplateGpu | undefined>;
    /**
     * Flag whether the node template is default. It's is always set to 'true' on 'default-by-castai' node template and 'false' otherwise.
     */
    isDefault?: pulumi.Input<boolean | undefined>;
    /**
     * Flag whether the node template is enabled and considered for autoscaling.
     */
    isEnabled?: pulumi.Input<boolean | undefined>;
    /**
     * Name of the node template.
     */
    name?: pulumi.Input<string | undefined>;
    /**
     * Configuration for adjusting instance type prices during autoscaling. Adjustments only affect placement decisions, not cost reporting.
     */
    priceAdjustmentConfiguration?: pulumi.Input<inputs.config.NodeTemplatePriceAdjustmentConfiguration | undefined>;
    /**
     * Minimum nodes that will be kept when rebalancing nodes using this node template.
     */
    rebalancingConfigMinNodes?: pulumi.Input<number | undefined>;
    /**
     * Marks whether the templated nodes will have a taint.
     */
    shouldTaint?: pulumi.Input<boolean | undefined>;
}
//# sourceMappingURL=nodeTemplate.d.ts.map