import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class WorkloadScalingPolicy extends pulumi.CustomResource {
    /**
     * Get an existing WorkloadScalingPolicy resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: WorkloadScalingPolicyState, opts?: pulumi.CustomResourceOptions): WorkloadScalingPolicy;
    /**
     * Returns true if the given object is an instance of WorkloadScalingPolicy.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is WorkloadScalingPolicy;
    readonly antiAffinity: pulumi.Output<outputs.workload.WorkloadScalingPolicyAntiAffinity | undefined>;
    /**
     * Recommendation apply type.
     * 	- IMMEDIATE - pods are restarted immediately when new recommendation is generated.
     * 	- DEFERRED - pods are not restarted and recommendation values are applied during natural restarts only (new deployment, etc.)
     */
    readonly applyType: pulumi.Output<string>;
    /**
     * Allows defining conditions for automatically assigning workloads to this scaling policy.
     */
    readonly assignmentRules: pulumi.Output<outputs.workload.WorkloadScalingPolicyAssignmentRule[] | undefined>;
    /**
     * CAST AI cluster id
     */
    readonly clusterId: pulumi.Output<string>;
    /**
     * Defines the confidence settings for applying recommendations.
     */
    readonly confidence: pulumi.Output<outputs.workload.WorkloadScalingPolicyConfidence | undefined>;
    readonly cpu: pulumi.Output<outputs.workload.WorkloadScalingPolicyCpu>;
    readonly downscaling: pulumi.Output<outputs.workload.WorkloadScalingPolicyDownscaling | undefined>;
    /**
     * Defines possible options for workload management.
     * 	- READ_ONLY - workload watched (metrics collected), but no actions performed by CAST AI.
     * 	- MANAGED - workload watched (metrics collected), CAST AI may perform actions on the workload.
     */
    readonly managementOption: pulumi.Output<string>;
    readonly memory: pulumi.Output<outputs.workload.WorkloadScalingPolicyMemory>;
    readonly memoryEvent: pulumi.Output<outputs.workload.WorkloadScalingPolicyMemoryEvent | undefined>;
    /**
     * Scaling policy name
     */
    readonly name: pulumi.Output<string>;
    readonly predictiveScaling: pulumi.Output<outputs.workload.WorkloadScalingPolicyPredictiveScaling | undefined>;
    /**
     * Defines the rollout behavior used when applying recommendations. Prerequisites:
     * 	- Applicable to Deployment resources that support running as multi-replica.
     * 	- Deployment is running with single replica (replica count = 1).
     * 	- Deployment's rollout strategy allows for downtime.
     * 	- Recommendation apply type is "immediate".
     * 	- Cluster has workload-autoscaler component version v0.35.3 or higher.
     */
    readonly rolloutBehavior: pulumi.Output<outputs.workload.WorkloadScalingPolicyRolloutBehavior | undefined>;
    readonly startup: pulumi.Output<outputs.workload.WorkloadScalingPolicyStartup | undefined>;
    /**
     * Create a WorkloadScalingPolicy resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: WorkloadScalingPolicyArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering WorkloadScalingPolicy resources.
 */
export interface WorkloadScalingPolicyState {
    antiAffinity?: pulumi.Input<inputs.workload.WorkloadScalingPolicyAntiAffinity>;
    /**
     * Recommendation apply type.
     * 	- IMMEDIATE - pods are restarted immediately when new recommendation is generated.
     * 	- DEFERRED - pods are not restarted and recommendation values are applied during natural restarts only (new deployment, etc.)
     */
    applyType?: pulumi.Input<string>;
    /**
     * Allows defining conditions for automatically assigning workloads to this scaling policy.
     */
    assignmentRules?: pulumi.Input<pulumi.Input<inputs.workload.WorkloadScalingPolicyAssignmentRule>[]>;
    /**
     * CAST AI cluster id
     */
    clusterId?: pulumi.Input<string>;
    /**
     * Defines the confidence settings for applying recommendations.
     */
    confidence?: pulumi.Input<inputs.workload.WorkloadScalingPolicyConfidence>;
    cpu?: pulumi.Input<inputs.workload.WorkloadScalingPolicyCpu>;
    downscaling?: pulumi.Input<inputs.workload.WorkloadScalingPolicyDownscaling>;
    /**
     * Defines possible options for workload management.
     * 	- READ_ONLY - workload watched (metrics collected), but no actions performed by CAST AI.
     * 	- MANAGED - workload watched (metrics collected), CAST AI may perform actions on the workload.
     */
    managementOption?: pulumi.Input<string>;
    memory?: pulumi.Input<inputs.workload.WorkloadScalingPolicyMemory>;
    memoryEvent?: pulumi.Input<inputs.workload.WorkloadScalingPolicyMemoryEvent>;
    /**
     * Scaling policy name
     */
    name?: pulumi.Input<string>;
    predictiveScaling?: pulumi.Input<inputs.workload.WorkloadScalingPolicyPredictiveScaling>;
    /**
     * Defines the rollout behavior used when applying recommendations. Prerequisites:
     * 	- Applicable to Deployment resources that support running as multi-replica.
     * 	- Deployment is running with single replica (replica count = 1).
     * 	- Deployment's rollout strategy allows for downtime.
     * 	- Recommendation apply type is "immediate".
     * 	- Cluster has workload-autoscaler component version v0.35.3 or higher.
     */
    rolloutBehavior?: pulumi.Input<inputs.workload.WorkloadScalingPolicyRolloutBehavior>;
    startup?: pulumi.Input<inputs.workload.WorkloadScalingPolicyStartup>;
}
/**
 * The set of arguments for constructing a WorkloadScalingPolicy resource.
 */
export interface WorkloadScalingPolicyArgs {
    antiAffinity?: pulumi.Input<inputs.workload.WorkloadScalingPolicyAntiAffinity>;
    /**
     * Recommendation apply type.
     * 	- IMMEDIATE - pods are restarted immediately when new recommendation is generated.
     * 	- DEFERRED - pods are not restarted and recommendation values are applied during natural restarts only (new deployment, etc.)
     */
    applyType: pulumi.Input<string>;
    /**
     * Allows defining conditions for automatically assigning workloads to this scaling policy.
     */
    assignmentRules?: pulumi.Input<pulumi.Input<inputs.workload.WorkloadScalingPolicyAssignmentRule>[]>;
    /**
     * CAST AI cluster id
     */
    clusterId: pulumi.Input<string>;
    /**
     * Defines the confidence settings for applying recommendations.
     */
    confidence?: pulumi.Input<inputs.workload.WorkloadScalingPolicyConfidence>;
    cpu: pulumi.Input<inputs.workload.WorkloadScalingPolicyCpu>;
    downscaling?: pulumi.Input<inputs.workload.WorkloadScalingPolicyDownscaling>;
    /**
     * Defines possible options for workload management.
     * 	- READ_ONLY - workload watched (metrics collected), but no actions performed by CAST AI.
     * 	- MANAGED - workload watched (metrics collected), CAST AI may perform actions on the workload.
     */
    managementOption: pulumi.Input<string>;
    memory: pulumi.Input<inputs.workload.WorkloadScalingPolicyMemory>;
    memoryEvent?: pulumi.Input<inputs.workload.WorkloadScalingPolicyMemoryEvent>;
    /**
     * Scaling policy name
     */
    name?: pulumi.Input<string>;
    predictiveScaling?: pulumi.Input<inputs.workload.WorkloadScalingPolicyPredictiveScaling>;
    /**
     * Defines the rollout behavior used when applying recommendations. Prerequisites:
     * 	- Applicable to Deployment resources that support running as multi-replica.
     * 	- Deployment is running with single replica (replica count = 1).
     * 	- Deployment's rollout strategy allows for downtime.
     * 	- Recommendation apply type is "immediate".
     * 	- Cluster has workload-autoscaler component version v0.35.3 or higher.
     */
    rolloutBehavior?: pulumi.Input<inputs.workload.WorkloadScalingPolicyRolloutBehavior>;
    startup?: pulumi.Input<inputs.workload.WorkloadScalingPolicyStartup>;
}
