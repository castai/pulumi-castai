import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class WorkloadCustomMetricsDataSource extends pulumi.CustomResource {
    /**
     * Get an existing WorkloadCustomMetricsDataSource resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: WorkloadCustomMetricsDataSourceState, opts?: pulumi.CustomResourceOptions): WorkloadCustomMetricsDataSource;
    /**
     * Returns true if the given object is an instance of WorkloadCustomMetricsDataSource.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is WorkloadCustomMetricsDataSource;
    /**
     * CAST AI cluster ID.
     */
    readonly clusterId: pulumi.Output<string>;
    /**
     * Name of the corresponding Kubernetes resource.
     */
    readonly kubeResourceName: pulumi.Output<string>;
    /**
     * Whether the data source is managed by CAST AI.
     */
    readonly managedByCast: pulumi.Output<boolean>;
    /**
     * Name of the custom metrics data source (1-63 characters).
     */
    readonly name: pulumi.Output<string>;
    /**
     * Prometheus data source configuration.
     */
    readonly prometheus: pulumi.Output<outputs.workload.WorkloadCustomMetricsDataSourcePrometheus>;
    /**
     * Synchronization status of the data source (CONNECTING, CONNECTED, SYNCING, FAILED).
     */
    readonly status: pulumi.Output<string>;
    /**
     * Create a WorkloadCustomMetricsDataSource resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: WorkloadCustomMetricsDataSourceArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering WorkloadCustomMetricsDataSource resources.
 */
export interface WorkloadCustomMetricsDataSourceState {
    /**
     * CAST AI cluster ID.
     */
    clusterId?: pulumi.Input<string | undefined>;
    /**
     * Name of the corresponding Kubernetes resource.
     */
    kubeResourceName?: pulumi.Input<string | undefined>;
    /**
     * Whether the data source is managed by CAST AI.
     */
    managedByCast?: pulumi.Input<boolean | undefined>;
    /**
     * Name of the custom metrics data source (1-63 characters).
     */
    name?: pulumi.Input<string | undefined>;
    /**
     * Prometheus data source configuration.
     */
    prometheus?: pulumi.Input<inputs.workload.WorkloadCustomMetricsDataSourcePrometheus | undefined>;
    /**
     * Synchronization status of the data source (CONNECTING, CONNECTED, SYNCING, FAILED).
     */
    status?: pulumi.Input<string | undefined>;
}
/**
 * The set of arguments for constructing a WorkloadCustomMetricsDataSource resource.
 */
export interface WorkloadCustomMetricsDataSourceArgs {
    /**
     * CAST AI cluster ID.
     */
    clusterId: pulumi.Input<string>;
    /**
     * Name of the custom metrics data source (1-63 characters).
     */
    name?: pulumi.Input<string | undefined>;
    /**
     * Prometheus data source configuration.
     */
    prometheus: pulumi.Input<inputs.workload.WorkloadCustomMetricsDataSourcePrometheus>;
}
//# sourceMappingURL=workloadCustomMetricsDataSource.d.ts.map