import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class PodMutation extends pulumi.CustomResource {
    /**
     * Get an existing PodMutation resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: PodMutationState, opts?: pulumi.CustomResourceOptions): PodMutation;
    /**
     * Returns true if the given object is an instance of PodMutation.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is PodMutation;
    /**
     * Affinity to apply to the pods.
     */
    readonly affinity: pulumi.Output<outputs.PodMutationAffinity | undefined>;
    /**
     * Annotations to add to the pods.
     */
    readonly annotations: pulumi.Output<{
        [key: string]: string;
    } | undefined>;
    /**
     * ID of the cluster.
     */
    readonly clusterId: pulumi.Output<string>;
    /**
     * Distribution groups for percentage-based pod distribution.
     */
    readonly distributionGroups: pulumi.Output<outputs.PodMutationDistributionGroup[] | undefined>;
    /**
     * Whether the pod mutation is enabled.
     */
    readonly enabled: pulumi.Output<boolean>;
    /**
     * Advanced object filter with support for exact and regex matching.
     */
    readonly filterV2: pulumi.Output<outputs.PodMutationFilterV2>;
    /**
     * Labels to add to the pods.
     */
    readonly labels: pulumi.Output<{
        [key: string]: string;
    } | undefined>;
    /**
     * Name of the pod mutation.
     */
    readonly name: pulumi.Output<string>;
    /**
     * Node selector to apply to the pods (add/remove key-value pairs).
     */
    readonly nodeSelector: pulumi.Output<outputs.PodMutationNodeSelector | undefined>;
    /**
     * Node template names to consolidate.
     */
    readonly nodeTemplatesToConsolidates: pulumi.Output<string[] | undefined>;
    /**
     * ID of the organization. If not provided, will be inferred from the API client.
     */
    readonly organizationId: pulumi.Output<string>;
    /**
     * JSON patch to apply to pods. Must be a JSON array of patch operations.
     */
    readonly patch: pulumi.Output<string | undefined>;
    /**
     * Eviction settings for enforcement of pod mutations.
     */
    readonly podEviction: pulumi.Output<outputs.PodMutationPodEviction | undefined>;
    /**
     * Source of the pod mutation (API or CUSTOM_RESOURCE).
     */
    readonly source: pulumi.Output<string>;
    /**
     * Spot configuration for the mutation.
     */
    readonly spotConfig: pulumi.Output<outputs.PodMutationSpotConfig | undefined>;
    /**
     * Tolerations to apply to the pods.
     */
    readonly tolerations: pulumi.Output<outputs.PodMutationToleration[] | undefined>;
    /**
     * Create a PodMutation resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: PodMutationArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering PodMutation resources.
 */
export interface PodMutationState {
    /**
     * Affinity to apply to the pods.
     */
    affinity?: pulumi.Input<inputs.PodMutationAffinity | undefined>;
    /**
     * Annotations to add to the pods.
     */
    annotations?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    } | undefined>;
    /**
     * ID of the cluster.
     */
    clusterId?: pulumi.Input<string | undefined>;
    /**
     * Distribution groups for percentage-based pod distribution.
     */
    distributionGroups?: pulumi.Input<pulumi.Input<inputs.PodMutationDistributionGroup>[] | undefined>;
    /**
     * Whether the pod mutation is enabled.
     */
    enabled?: pulumi.Input<boolean | undefined>;
    /**
     * Advanced object filter with support for exact and regex matching.
     */
    filterV2?: pulumi.Input<inputs.PodMutationFilterV2 | undefined>;
    /**
     * Labels to add to the pods.
     */
    labels?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    } | undefined>;
    /**
     * Name of the pod mutation.
     */
    name?: pulumi.Input<string | undefined>;
    /**
     * Node selector to apply to the pods (add/remove key-value pairs).
     */
    nodeSelector?: pulumi.Input<inputs.PodMutationNodeSelector | undefined>;
    /**
     * Node template names to consolidate.
     */
    nodeTemplatesToConsolidates?: pulumi.Input<pulumi.Input<string>[] | undefined>;
    /**
     * ID of the organization. If not provided, will be inferred from the API client.
     */
    organizationId?: pulumi.Input<string | undefined>;
    /**
     * JSON patch to apply to pods. Must be a JSON array of patch operations.
     */
    patch?: pulumi.Input<string | undefined>;
    /**
     * Eviction settings for enforcement of pod mutations.
     */
    podEviction?: pulumi.Input<inputs.PodMutationPodEviction | undefined>;
    /**
     * Source of the pod mutation (API or CUSTOM_RESOURCE).
     */
    source?: pulumi.Input<string | undefined>;
    /**
     * Spot configuration for the mutation.
     */
    spotConfig?: pulumi.Input<inputs.PodMutationSpotConfig | undefined>;
    /**
     * Tolerations to apply to the pods.
     */
    tolerations?: pulumi.Input<pulumi.Input<inputs.PodMutationToleration>[] | undefined>;
}
/**
 * The set of arguments for constructing a PodMutation resource.
 */
export interface PodMutationArgs {
    /**
     * Affinity to apply to the pods.
     */
    affinity?: pulumi.Input<inputs.PodMutationAffinity | undefined>;
    /**
     * Annotations to add to the pods.
     */
    annotations?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    } | undefined>;
    /**
     * ID of the cluster.
     */
    clusterId: pulumi.Input<string>;
    /**
     * Distribution groups for percentage-based pod distribution.
     */
    distributionGroups?: pulumi.Input<pulumi.Input<inputs.PodMutationDistributionGroup>[] | undefined>;
    /**
     * Whether the pod mutation is enabled.
     */
    enabled: pulumi.Input<boolean>;
    /**
     * Advanced object filter with support for exact and regex matching.
     */
    filterV2: pulumi.Input<inputs.PodMutationFilterV2>;
    /**
     * Labels to add to the pods.
     */
    labels?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    } | undefined>;
    /**
     * Name of the pod mutation.
     */
    name?: pulumi.Input<string | undefined>;
    /**
     * Node selector to apply to the pods (add/remove key-value pairs).
     */
    nodeSelector?: pulumi.Input<inputs.PodMutationNodeSelector | undefined>;
    /**
     * Node template names to consolidate.
     */
    nodeTemplatesToConsolidates?: pulumi.Input<pulumi.Input<string>[] | undefined>;
    /**
     * ID of the organization. If not provided, will be inferred from the API client.
     */
    organizationId?: pulumi.Input<string | undefined>;
    /**
     * JSON patch to apply to pods. Must be a JSON array of patch operations.
     */
    patch?: pulumi.Input<string | undefined>;
    /**
     * Eviction settings for enforcement of pod mutations.
     */
    podEviction?: pulumi.Input<inputs.PodMutationPodEviction | undefined>;
    /**
     * Spot configuration for the mutation.
     */
    spotConfig?: pulumi.Input<inputs.PodMutationSpotConfig | undefined>;
    /**
     * Tolerations to apply to the pods.
     */
    tolerations?: pulumi.Input<pulumi.Input<inputs.PodMutationToleration>[] | undefined>;
}
//# sourceMappingURL=podMutation.d.ts.map