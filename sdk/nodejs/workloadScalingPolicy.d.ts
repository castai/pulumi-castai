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
    /**
     * Defines anomaly detection settings for the scaling policy.
     */
    readonly anomalyDetection: pulumi.Output<outputs.workload.WorkloadScalingPolicyAnomalyDetection | undefined>;
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
     * Defines containers to be excluded from receiving recommendations. The containers are matched by exact name.
     */
    readonly excludedContainers: pulumi.Output<string[] | undefined>;
    /**
     * Configuration for converting existing HPAs when VPA is the sole optimization. If HPA management is enabled, it takes precedence over this setting.
     */
    readonly hpaConverters: pulumi.Output<outputs.workload.WorkloadScalingPolicyHpaConverter[] | undefined>;
    /**
     * JVM optimization settings.
     */
    readonly jvm: pulumi.Output<outputs.workload.WorkloadScalingPolicyJvm | undefined>;
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
    /**
     * Defines anomaly detection settings for the scaling policy.
     */
    anomalyDetection?: pulumi.Input<inputs.workload.WorkloadScalingPolicyAnomalyDetection | undefined>;
    antiAffinity?: pulumi.Input<inputs.workload.WorkloadScalingPolicyAntiAffinity | undefined>;
    /**
     * Recommendation apply type.
     * 	- IMMEDIATE - pods are restarted immediately when new recommendation is generated.
     * 	- DEFERRED - pods are not restarted and recommendation values are applied during natural restarts only (new deployment, etc.)
     */
    applyType?: pulumi.Input<string | undefined>;
    /**
     * Allows defining conditions for automatically assigning workloads to this scaling policy.
     */
    assignmentRules?: pulumi.Input<pulumi.Input<inputs.workload.WorkloadScalingPolicyAssignmentRule>[] | undefined>;
    /**
     * CAST AI cluster id
     */
    clusterId?: pulumi.Input<string | undefined>;
    /**
     * Defines the confidence settings for applying recommendations.
     */
    confidence?: pulumi.Input<inputs.workload.WorkloadScalingPolicyConfidence | undefined>;
    cpu?: pulumi.Input<inputs.workload.WorkloadScalingPolicyCpu | undefined>;
    downscaling?: pulumi.Input<inputs.workload.WorkloadScalingPolicyDownscaling | undefined>;
    /**
     * Defines containers to be excluded from receiving recommendations. The containers are matched by exact name.
     */
    excludedContainers?: pulumi.Input<pulumi.Input<string>[] | undefined>;
    /**
     * Configuration for converting existing HPAs when VPA is the sole optimization. If HPA management is enabled, it takes precedence over this setting.
     */
    hpaConverters?: pulumi.Input<pulumi.Input<inputs.workload.WorkloadScalingPolicyHpaConverter>[] | undefined>;
    /**
     * JVM optimization settings.
     */
    jvm?: pulumi.Input<inputs.workload.WorkloadScalingPolicyJvm | undefined>;
    /**
     * Defines possible options for workload management.
     * 	- READ_ONLY - workload watched (metrics collected), but no actions performed by CAST AI.
     * 	- MANAGED - workload watched (metrics collected), CAST AI may perform actions on the workload.
     */
    managementOption?: pulumi.Input<string | undefined>;
    memory?: pulumi.Input<inputs.workload.WorkloadScalingPolicyMemory | undefined>;
    memoryEvent?: pulumi.Input<inputs.workload.WorkloadScalingPolicyMemoryEvent | undefined>;
    /**
     * Scaling policy name
     */
    name?: pulumi.Input<string | undefined>;
    predictiveScaling?: pulumi.Input<inputs.workload.WorkloadScalingPolicyPredictiveScaling | undefined>;
    /**
     * Defines the rollout behavior used when applying recommendations. Prerequisites:
     * 	- Applicable to Deployment resources that support running as multi-replica.
     * 	- Deployment is running with single replica (replica count = 1).
     * 	- Deployment's rollout strategy allows for downtime.
     * 	- Recommendation apply type is "immediate".
     * 	- Cluster has workload-autoscaler component version v0.35.3 or higher.
     */
    rolloutBehavior?: pulumi.Input<inputs.workload.WorkloadScalingPolicyRolloutBehavior | undefined>;
    startup?: pulumi.Input<inputs.workload.WorkloadScalingPolicyStartup | undefined>;
}
/**
 * The set of arguments for constructing a WorkloadScalingPolicy resource.
 */
export interface WorkloadScalingPolicyArgs {
    /**
     * Defines anomaly detection settings for the scaling policy.
     */
    anomalyDetection?: pulumi.Input<inputs.workload.WorkloadScalingPolicyAnomalyDetection | undefined>;
    antiAffinity?: pulumi.Input<inputs.workload.WorkloadScalingPolicyAntiAffinity | undefined>;
    /**
     * Recommendation apply type.
     * 	- IMMEDIATE - pods are restarted immediately when new recommendation is generated.
     * 	- DEFERRED - pods are not restarted and recommendation values are applied during natural restarts only (new deployment, etc.)
     */
    applyType: pulumi.Input<string>;
    /**
     * Allows defining conditions for automatically assigning workloads to this scaling policy.
     */
    assignmentRules?: pulumi.Input<pulumi.Input<inputs.workload.WorkloadScalingPolicyAssignmentRule>[] | undefined>;
    /**
     * CAST AI cluster id
     */
    clusterId: pulumi.Input<string>;
    /**
     * Defines the confidence settings for applying recommendations.
     */
    confidence?: pulumi.Input<inputs.workload.WorkloadScalingPolicyConfidence | undefined>;
    cpu: pulumi.Input<inputs.workload.WorkloadScalingPolicyCpu>;
    downscaling?: pulumi.Input<inputs.workload.WorkloadScalingPolicyDownscaling | undefined>;
    /**
     * Defines containers to be excluded from receiving recommendations. The containers are matched by exact name.
     */
    excludedContainers?: pulumi.Input<pulumi.Input<string>[] | undefined>;
    /**
     * Configuration for converting existing HPAs when VPA is the sole optimization. If HPA management is enabled, it takes precedence over this setting.
     */
    hpaConverters?: pulumi.Input<pulumi.Input<inputs.workload.WorkloadScalingPolicyHpaConverter>[] | undefined>;
    /**
     * JVM optimization settings.
     */
    jvm?: pulumi.Input<inputs.workload.WorkloadScalingPolicyJvm | undefined>;
    /**
     * Defines possible options for workload management.
     * 	- READ_ONLY - workload watched (metrics collected), but no actions performed by CAST AI.
     * 	- MANAGED - workload watched (metrics collected), CAST AI may perform actions on the workload.
     */
    managementOption: pulumi.Input<string>;
    memory: pulumi.Input<inputs.workload.WorkloadScalingPolicyMemory>;
    memoryEvent?: pulumi.Input<inputs.workload.WorkloadScalingPolicyMemoryEvent | undefined>;
    /**
     * Scaling policy name
     */
    name?: pulumi.Input<string | undefined>;
    predictiveScaling?: pulumi.Input<inputs.workload.WorkloadScalingPolicyPredictiveScaling | undefined>;
    /**
     * Defines the rollout behavior used when applying recommendations. Prerequisites:
     * 	- Applicable to Deployment resources that support running as multi-replica.
     * 	- Deployment is running with single replica (replica count = 1).
     * 	- Deployment's rollout strategy allows for downtime.
     * 	- Recommendation apply type is "immediate".
     * 	- Cluster has workload-autoscaler component version v0.35.3 or higher.
     */
    rolloutBehavior?: pulumi.Input<inputs.workload.WorkloadScalingPolicyRolloutBehavior | undefined>;
    startup?: pulumi.Input<inputs.workload.WorkloadScalingPolicyStartup | undefined>;
}
//# sourceMappingURL=workloadScalingPolicy.d.ts.map