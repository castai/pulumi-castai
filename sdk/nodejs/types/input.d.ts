import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
export interface CommitmentsAzureReservation {
    /**
     * Allowed usage of the commitment. The value is between 0 (0%) and 1 (100%).
     */
    allowedUsage?: pulumi.Input<number>;
    /**
     * List of assigned clusters for the commitment. If prioritization is enabled, the order of the assignments indicates the priority. The first assignment has the highest priority.
     */
    assignments?: pulumi.Input<pulumi.Input<inputs.CommitmentsAzureReservationAssignment>[]>;
    /**
     * Number of instances covered by the reservation.
     */
    count: pulumi.Input<number>;
    /**
     * End timestamp of the CUD.
     */
    endTimestamp: pulumi.Input<string>;
    /**
     * ID of the commitment in CAST AI.
     */
    id?: pulumi.Input<string>;
    /**
     * Type of the instance covered by the reservation.
     */
    instanceType: pulumi.Input<string>;
    /**
     * Name of the CUD.
     */
    name: pulumi.Input<string>;
    /**
     * Plan of the reservation.
     */
    plan: pulumi.Input<string>;
    /**
     * If enabled, it's possible to assign priorities to the assigned clusters.
     */
    prioritization?: pulumi.Input<boolean>;
    /**
     * Region in which the CUD is available.
     */
    region: pulumi.Input<string>;
    /**
     * ID of the reservation in Azure.
     */
    reservationId: pulumi.Input<string>;
    /**
     * Status of the reservation in Azure.
     */
    reservationStatus: pulumi.Input<string>;
    /**
     * Scaling strategy of the commitment in CAST AI. One of: Default, CPUBased, RamBased
     */
    scalingStrategy?: pulumi.Input<string>;
    scope: pulumi.Input<string>;
    scopeResourceGroup: pulumi.Input<string>;
    scopeSubscription: pulumi.Input<string>;
    /**
     * Start timestamp of the CUD.
     */
    startTimestamp: pulumi.Input<string>;
    /**
     * Status of the commitment in CAST AI.
     */
    status?: pulumi.Input<string>;
}
export interface CommitmentsAzureReservationAssignment {
    /**
     * ID of the cluster to assign the commitment to.
     */
    clusterId?: pulumi.Input<string>;
    /**
     * Priority of the assignment. The lower the value, the higher the priority. 1 is the highest priority.
     */
    priority?: pulumi.Input<number>;
}
export interface CommitmentsCommitmentConfig {
    /**
     * Allowed usage of the commitment. The value is between 0 (0%) and 1 (100%).
     */
    allowedUsage?: pulumi.Input<number>;
    /**
     * List of assigned clusters for the commitment. If prioritization is enabled, the order of the assignments indicates the priority. The first assignment has the highest priority.
     */
    assignments?: pulumi.Input<pulumi.Input<inputs.CommitmentsCommitmentConfigAssignment>[]>;
    /**
     * Matcher used to map config to a commitment.
     */
    matcher: pulumi.Input<inputs.CommitmentsCommitmentConfigMatcher>;
    /**
     * If enabled, it's possible to assign priorities to the assigned clusters.
     */
    prioritization?: pulumi.Input<boolean>;
    /**
     * Scaling strategy of the commitment in CAST AI. One of: Default, CPUBased, RamBased
     */
    scalingStrategy?: pulumi.Input<string>;
    /**
     * Status of the commitment in CAST AI.
     */
    status?: pulumi.Input<string>;
}
export interface CommitmentsCommitmentConfigAssignment {
    /**
     * ID of the cluster to assign the commitment to.
     */
    clusterId: pulumi.Input<string>;
    /**
     * Priority of the assignment. The lower the value, the higher the priority. 1 is the highest priority.
     */
    priority?: pulumi.Input<number>;
}
export interface CommitmentsCommitmentConfigMatcher {
    /**
     * Name of the commitment to match.
     */
    name: pulumi.Input<string>;
    /**
     * Region of the commitment to match.
     */
    region: pulumi.Input<string>;
    /**
     * Type of the commitment to match. For compute resources, it's the type of the machine.
     */
    type?: pulumi.Input<string>;
}
export interface CommitmentsGcpCud {
    /**
     * Allowed usage of the commitment. The value is between 0 (0%) and 1 (100%).
     */
    allowedUsage?: pulumi.Input<number>;
    /**
     * List of assigned clusters for the commitment. If prioritization is enabled, the order of the assignments indicates the priority. The first assignment has the highest priority.
     */
    assignments?: pulumi.Input<pulumi.Input<inputs.CommitmentsGcpCudAssignment>[]>;
    /**
     * Number of CPUs covered by the CUD.
     */
    cpu: pulumi.Input<number>;
    /**
     * ID of the CUD in GCP.
     */
    cudId: pulumi.Input<string>;
    /**
     * Status of the CUD in GCP.
     */
    cudStatus: pulumi.Input<string>;
    /**
     * End timestamp of the CUD.
     */
    endTimestamp: pulumi.Input<string>;
    /**
     * ID of the commitment in CAST AI.
     */
    id?: pulumi.Input<string>;
    /**
     * Amount of memory in MB covered by the CUD.
     */
    memoryMb: pulumi.Input<number>;
    /**
     * Name of the CUD.
     */
    name: pulumi.Input<string>;
    /**
     * CUD plan e.g. 'TWELVE_MONTH'.
     */
    plan: pulumi.Input<string>;
    /**
     * If enabled, it's possible to assign priorities to the assigned clusters.
     */
    prioritization?: pulumi.Input<boolean>;
    /**
     * Region in which the CUD is available.
     */
    region: pulumi.Input<string>;
    /**
     * Scaling strategy of the commitment in CAST AI. One of: Default, CPUBased, RamBased
     */
    scalingStrategy?: pulumi.Input<string>;
    /**
     * Start timestamp of the CUD.
     */
    startTimestamp: pulumi.Input<string>;
    /**
     * Status of the commitment in CAST AI.
     */
    status?: pulumi.Input<string>;
    /**
     * Type of the CUD, e.g. determines the covered resource type e.g. 'COMPUTE_OPTIMIZED_C2D'.
     */
    type: pulumi.Input<string>;
}
export interface CommitmentsGcpCudAssignment {
    /**
     * ID of the cluster to assign the commitment to.
     */
    clusterId?: pulumi.Input<string>;
    /**
     * Priority of the assignment. The lower the value, the higher the priority. 1 is the highest priority.
     */
    priority?: pulumi.Input<number>;
}
export interface ReservationsReservation {
    /**
     * amount of reserved instances
     */
    count: pulumi.Input<string>;
    /**
     * end date of reservation
     */
    endDate?: pulumi.Input<string>;
    /**
     * reserved instance type
     */
    instanceType: pulumi.Input<string>;
    /**
     * unique reservation name in region for specific instance type
     */
    name: pulumi.Input<string>;
    /**
     * reservation price
     */
    price: pulumi.Input<string>;
    /**
     * reservation cloud provider (gcp, aws, azure)
     */
    provider: pulumi.Input<string>;
    /**
     * reservation region
     */
    region: pulumi.Input<string>;
    /**
     * start date of reservation
     */
    startDate: pulumi.Input<string>;
    /**
     * reservation zone id
     */
    zoneId?: pulumi.Input<string>;
    /**
     * reservation zone name
     */
    zoneName?: pulumi.Input<string>;
}
export declare namespace autoscaling {
    interface AutoscalerAutoscalerSettings {
        /**
         * defines minimum and maximum amount of CPU the cluster can have.
         */
        clusterLimits?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsClusterLimits>;
        /**
         * enable/disable autoscaler policies
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * run autoscaler in scoped mode. Only marked pods and nodes will be considered.
         */
        isScopedMode?: pulumi.Input<boolean>;
        /**
         * node downscaler defines policies for removing nodes based on the configured conditions.
         */
        nodeDownscaler?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsNodeDownscaler>;
        /**
         * marks whether partial matching should be used when deciding which custom node template to select.
         */
        nodeTemplatesPartialMatchingEnabled?: pulumi.Input<boolean>;
        /**
         * policy defining whether autoscaler can use spot instances for provisioning additional workloads.
         *
         * @deprecated `spotInstances` is deprecated. Configure spot instance settings using the `constraints` field in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        spotInstances?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsSpotInstances>;
        /**
         * policy defining autoscaler's behavior when unschedulable pods were detected.
         */
        unschedulablePods?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsUnschedulablePods>;
    }
    interface AutoscalerAutoscalerSettingsClusterLimits {
        /**
         * defines the minimum and maximum amount of CPUs for cluster's worker nodes.
         */
        cpu?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsClusterLimitsCpu>;
        /**
         * enable/disable cluster size limits policy.
         */
        enabled?: pulumi.Input<boolean>;
    }
    interface AutoscalerAutoscalerSettingsClusterLimitsCpu {
        /**
         * defines the maximum allowed amount of vCPUs in the whole cluster.
         */
        maxCores?: pulumi.Input<number>;
        /**
         * defines the minimum allowed amount of CPUs in the whole cluster.
         */
        minCores?: pulumi.Input<number>;
    }
    interface AutoscalerAutoscalerSettingsNodeDownscaler {
        /**
         * defines whether Node Downscaler should opt in for removing empty worker nodes when possible.
         */
        emptyNodes?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsNodeDownscalerEmptyNodes>;
        /**
         * enable/disable node downscaler policy.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * defines the CAST AI Evictor component settings. Evictor watches the pods running in your cluster and looks for ways to compact them into fewer nodes, making nodes empty, which will be removed by the empty worker nodes policy.
         */
        evictor?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsNodeDownscalerEvictor>;
    }
    interface AutoscalerAutoscalerSettingsNodeDownscalerEmptyNodes {
        /**
         * period (in seconds) to wait before removing the node. Might be useful to control the aggressiveness of the downscaler.
         */
        delaySeconds?: pulumi.Input<number>;
        /**
         * enable/disable the empty worker nodes policy.
         */
        enabled?: pulumi.Input<boolean>;
    }
    interface AutoscalerAutoscalerSettingsNodeDownscalerEvictor {
        /**
         * enable/disable aggressive mode. By default, Evictor does not target nodes that are running unreplicated pods. This mode will make the Evictor start considering application with just a single replica.
         */
        aggressiveMode?: pulumi.Input<boolean>;
        /**
         * configure the interval duration between Evictor operations. This property can be used to lower or raise the frequency of the Evictor's find-and-drain operations.
         */
        cycleInterval?: pulumi.Input<string>;
        /**
         * enable/disable dry-run. This property allows you to prevent the Evictor from carrying any operations out and preview the actions it would take.
         */
        dryRun?: pulumi.Input<boolean>;
        /**
         * enable/disable the Evictor policy. This will either install or uninstall the Evictor component in your cluster.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * if enabled then Evictor will attempt to evict pods that have pod disruption budgets configured.
         */
        ignorePodDisruptionBudgets?: pulumi.Input<boolean>;
        /**
         * configure the node grace period which controls the duration which must pass after a node has been created before Evictor starts considering that node.
         */
        nodeGracePeriodMinutes?: pulumi.Input<number>;
        /**
         * configure the pod eviction failure back off interval. If pod eviction fails then Evictor will attempt to evict it again after the amount of time specified here.
         */
        podEvictionFailureBackOffInterval?: pulumi.Input<string>;
        /**
         * enable/disable scoped mode. By default, Evictor targets all nodes in the cluster. This mode will constrain it to just the nodes which were created by CAST AI.
         */
        scopedMode?: pulumi.Input<boolean>;
    }
    interface AutoscalerAutoscalerSettingsSpotInstances {
        /**
         * enable/disable spot instances policy.
         *
         * @deprecated `enabled` under `spotInstances` is deprecated. To enable spot instances, set `constraints.spot = true` in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * max allowed reclaim rate when choosing spot instance type. E.g. if the value is 10%, instance types having 10% or higher reclaim rate will not be considered. Set to zero to use all instance types regardless of reclaim rate.
         *
         * @deprecated `maxReclaimRate` under `spotInstances` is deprecated. This field has no direct equivalent in the castai.config.NodeTemplate resource, and setting it will have no effect.
         */
        maxReclaimRate?: pulumi.Input<number>;
        /**
         * policy defining whether autoscaler can use spot backups instead of spot instances when spot instances are not available.
         *
         * @deprecated `spotBackups` under `spotInstances` is deprecated. Configure spot backup behavior using `constraints.use_spot_fallbacks` and `constraints.fallback_restore_rate_seconds` in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        spotBackups?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsSpotInstancesSpotBackups>;
        /**
         * enable/disable spot diversity policy. When enabled, autoscaler will try to balance between diverse and cost optimal instance types.
         *
         * @deprecated `spotDiversityEnabled` is deprecated. Use the `enableSpotDiversity` field within `castai_node_template.constraints` in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        spotDiversityEnabled?: pulumi.Input<boolean>;
        /**
         * allowed node configuration price increase when diversifying instance types. E.g. if the value is 10%, then the overall price of diversified instance types can be 10% higher than the price of the optimal configuration.
         *
         * @deprecated `spotDiversityPriceIncreaseLimit` is deprecated. Use `spotDiversityPriceIncreaseLimitPercent` within `castai_node_template.constraints` in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        spotDiversityPriceIncreaseLimit?: pulumi.Input<number>;
        /**
         * configure the handling of SPOT interruption predictions.
         *
         * @deprecated `spotInterruptionPredictions` is deprecated. Use the `spotInterruptionPredictionsEnabled` and `spotInterruptionPredictionsType` fields in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        spotInterruptionPredictions?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsSpotInstancesSpotInterruptionPredictions>;
    }
    interface AutoscalerAutoscalerSettingsSpotInstancesSpotBackups {
        /**
         * enable/disable spot backups policy.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * defines interval on how often spot backups restore to real spot should occur.
         */
        spotBackupRestoreRateSeconds?: pulumi.Input<number>;
    }
    interface AutoscalerAutoscalerSettingsSpotInstancesSpotInterruptionPredictions {
        /**
         * enable/disable spot interruption predictions.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * define the type of the spot interruption prediction to handle. Allowed values are AWSRebalanceRecommendations, CASTAIInterruptionPredictions.
         */
        spotInterruptionPredictionsType?: pulumi.Input<string>;
    }
    interface AutoscalerAutoscalerSettingsUnschedulablePods {
        /**
         * enable/disable custom instances policy.
         *
         * @deprecated `customInstancesEnabled` under `unschedulable_pods.node_constraints` is deprecated. Use the `customInstancesEnabled` field in the default castai.config.NodeTemplate resource instead. The default node template has `isDefault = true`.
         */
        customInstancesEnabled?: pulumi.Input<boolean>;
        /**
         * enable/disable unschedulable pods detection policy.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * additional headroom based on cluster's total available capacity for on-demand nodes.
         *
         * @deprecated `headroom` is deprecated. Please refer to the FAQ for guidance on cluster headroom: https://docs.cast.ai/docs/autoscaler-1#can-you-please-share-some-guidance-on-cluster-headroom-i-would-like-to-add-some-buffer-room-so-that-pods-have-a-place-to-run-when-nodes-go-down
         */
        headroom?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsUnschedulablePodsHeadroom>;
        /**
         * additional headroom based on cluster's total available capacity for spot nodes.
         *
         * @deprecated `headroomSpot` is deprecated. Please refer to the FAQ for guidance on cluster headroom: https://docs.cast.ai/docs/autoscaler-1#can-you-please-share-some-guidance-on-cluster-headroom-i-would-like-to-add-some-buffer-room-so-that-pods-have-a-place-to-run-when-nodes-go-down
         */
        headroomSpot?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsUnschedulablePodsHeadroomSpot>;
        /**
         * defines the node constraints that will be applied when autoscaling with Unschedulable Pods policy.
         *
         * @deprecated `nodeConstraints` under `unschedulablePods` is deprecated. Use the `constraints` field in the default castai.config.NodeTemplate resource instead. The default node template has `isDefault = true`.
         */
        nodeConstraints?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsUnschedulablePodsNodeConstraints>;
        /**
         * defines the Cast AI Pod Pinner components settings.
         */
        podPinner?: pulumi.Input<inputs.autoscaling.AutoscalerAutoscalerSettingsUnschedulablePodsPodPinner>;
    }
    interface AutoscalerAutoscalerSettingsUnschedulablePodsHeadroom {
        /**
         * defines percentage of additional CPU capacity to be added.
         */
        cpuPercentage?: pulumi.Input<number>;
        /**
         * enable/disable headroom policy.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * defines percentage of additional memory capacity to be added.
         */
        memoryPercentage?: pulumi.Input<number>;
    }
    interface AutoscalerAutoscalerSettingsUnschedulablePodsHeadroomSpot {
        /**
         * defines percentage of additional CPU capacity to be added.
         */
        cpuPercentage?: pulumi.Input<number>;
        /**
         * enable/disable headroomSpot policy.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * defines percentage of additional memory capacity to be added.
         */
        memoryPercentage?: pulumi.Input<number>;
    }
    interface AutoscalerAutoscalerSettingsUnschedulablePodsNodeConstraints {
        /**
         * enable/disable node constraints policy.
         */
        enabled?: pulumi.Input<boolean>;
        /**
         * defines max CPU cores for the node to pick.
         */
        maxCpuCores?: pulumi.Input<number>;
        /**
         * defines max RAM in MiB for the node to pick.
         */
        maxRamMib?: pulumi.Input<number>;
        /**
         * defines min CPU cores for the node to pick.
         */
        minCpuCores?: pulumi.Input<number>;
        /**
         * defines min RAM in MiB for the node to pick.
         */
        minRamMib?: pulumi.Input<number>;
    }
    interface AutoscalerAutoscalerSettingsUnschedulablePodsPodPinner {
        /**
         * enable/disable the Pod Pinner component's automatic management in your cluster. Default: enabled.
         */
        enabled?: pulumi.Input<boolean>;
    }
    interface EvictorAdvancedConfigEvictorAdvancedConfig {
        /**
         * Apply Aggressive mode to Evictor
         */
        aggressive?: pulumi.Input<boolean>;
        /**
         * Mark node as disposable
         */
        disposable?: pulumi.Input<boolean>;
        /**
         * node selector
         */
        nodeSelectors?: pulumi.Input<pulumi.Input<inputs.autoscaling.EvictorAdvancedConfigEvictorAdvancedConfigNodeSelector>[]>;
        /**
         * pod selector
         */
        podSelectors?: pulumi.Input<pulumi.Input<inputs.autoscaling.EvictorAdvancedConfigEvictorAdvancedConfigPodSelector>[]>;
        /**
         * Mark pods as removal disabled
         */
        removalDisabled?: pulumi.Input<boolean>;
    }
    interface EvictorAdvancedConfigEvictorAdvancedConfigNodeSelector {
        matchExpressions?: pulumi.Input<pulumi.Input<inputs.autoscaling.EvictorAdvancedConfigEvictorAdvancedConfigNodeSelectorMatchExpression>[]>;
        matchLabels?: pulumi.Input<{
            [key: string]: pulumi.Input<string>;
        }>;
    }
    interface EvictorAdvancedConfigEvictorAdvancedConfigNodeSelectorMatchExpression {
        key: pulumi.Input<string>;
        operator: pulumi.Input<string>;
        values?: pulumi.Input<pulumi.Input<string>[]>;
    }
    interface EvictorAdvancedConfigEvictorAdvancedConfigPodSelector {
        kind?: pulumi.Input<string>;
        matchExpressions?: pulumi.Input<pulumi.Input<inputs.autoscaling.EvictorAdvancedConfigEvictorAdvancedConfigPodSelectorMatchExpression>[]>;
        matchLabels?: pulumi.Input<{
            [key: string]: pulumi.Input<string>;
        }>;
        namespace?: pulumi.Input<string>;
    }
    interface EvictorAdvancedConfigEvictorAdvancedConfigPodSelectorMatchExpression {
        key: pulumi.Input<string>;
        operator: pulumi.Input<string>;
        values?: pulumi.Input<pulumi.Input<string>[]>;
    }
}
export declare namespace azure {
    interface AksClusterHttpProxyConfig {
        /**
         * Address to use for proxying HTTP requests.
         */
        httpProxy?: pulumi.Input<string>;
        /**
         * Address to use for proxying HTTPS/TLS requests.
         */
        httpsProxy?: pulumi.Input<string>;
        /**
         * List of destinations that should not go through proxy.
         */
        noProxies?: pulumi.Input<pulumi.Input<string>[]>;
    }
}
export declare namespace config {
    interface NodeConfigurationAks {
        /**
         * Image OS Family to use when provisioning node in AKS. If both image and family are provided, the system will use provided image and provisioning logic for given family. If only image family is provided, the system will attempt to resolve the latest image from that family based on kubernetes version and node architecture. If image family is omitted, a default family (based on cloud provider) will be used. See Cast.ai documentation for details. Possible values: (ubuntu,azure-linux,windows2019,windows2022)
         */
        aksImageFamily?: pulumi.Input<string>;
        /**
         * Application security groups to be used for provisioned nodes
         */
        applicationSecurityGroups?: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * Ephemeral OS disk configuration for CAST provisioned nodes
         */
        ephemeralOsDisk?: pulumi.Input<inputs.config.NodeConfigurationAksEphemeralOsDisk>;
        /**
         * Load balancer configuration for CAST provisioned nodes
         */
        loadbalancers?: pulumi.Input<pulumi.Input<inputs.config.NodeConfigurationAksLoadbalancer>[]>;
        /**
         * Maximum number of pods that can be run on a node, which affects how many IP addresses you will need for each node. Defaults to 30
         */
        maxPodsPerNode?: pulumi.Input<number>;
        /**
         * Network security group to be used for provisioned nodes, if not provided default security group from `castpool` will be used
         */
        networkSecurityGroup?: pulumi.Input<string>;
        /**
         * Type of managed os disk attached to the node. (See [disk types](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types)). One of: standard, standard-ssd, premium-ssd (ultra and premium-ssd-v2 are not supported for os disk)
         */
        osDiskType?: pulumi.Input<string>;
        /**
         * ID of pod subnet to be used for provisioned nodes.
         */
        podSubnetId?: pulumi.Input<string>;
        /**
         * Public IP configuration for CAST AI provisioned nodes
         */
        publicIp?: pulumi.Input<inputs.config.NodeConfigurationAksPublicIp>;
    }
    interface NodeConfigurationAksEphemeralOsDisk {
        /**
         * Cache type for the ephemeral OS disk. One of: ReadOnly, ReadWrite
         */
        cache?: pulumi.Input<string>;
        /**
         * Placement of the ephemeral OS disk. One of: cacheDisk, resourceDisk
         */
        placement: pulumi.Input<string>;
    }
    interface NodeConfigurationAksLoadbalancer {
        /**
         * The full ID of the load balancer in azure.
         */
        id?: pulumi.Input<string>;
        /**
         * IP based backend pools configuration for CAST provisioned nodes
         */
        ipBasedBackendPools?: pulumi.Input<pulumi.Input<inputs.config.NodeConfigurationAksLoadbalancerIpBasedBackendPool>[]>;
        /**
         * Name of load balancer
         *
         * @deprecated name field is deprecated, use ID instead. Will be removed in future versions.
         */
        name?: pulumi.Input<string>;
        /**
         * NIC based backend pools configuration for CAST provisioned nodes.
         */
        nicBasedBackendPools?: pulumi.Input<pulumi.Input<inputs.config.NodeConfigurationAksLoadbalancerNicBasedBackendPool>[]>;
    }
    interface NodeConfigurationAksLoadbalancerIpBasedBackendPool {
        /**
         * Name of the ip based backend pool
         */
        name: pulumi.Input<string>;
    }
    interface NodeConfigurationAksLoadbalancerNicBasedBackendPool {
        /**
         * Name of the NIC based backend pool
         */
        name: pulumi.Input<string>;
    }
    interface NodeConfigurationAksPublicIp {
        /**
         * Idle timeout in minutes for public IP
         */
        idleTimeoutInMinutes?: pulumi.Input<number>;
        /**
         * Public IP prefix to be used for provisioned nodes
         */
        publicIpPrefix?: pulumi.Input<string>;
        tags?: pulumi.Input<{
            [key: string]: pulumi.Input<string>;
        }>;
    }
    interface NodeConfigurationEks {
        /**
         * IP address to use for DNS queries within the cluster
         */
        dnsClusterIp?: pulumi.Input<string>;
        /**
         * Image OS Family to use when provisioning node in EKS. If both image and family are provided, the system will use provided image and provisioning logic for given family. If only image family is provided, the system will attempt to resolve the latest image from that family based on kubernetes version and node architecture. If image family is omitted, a default family (based on cloud provider) will be used. See Cast.ai documentation for details. Possible values: (al2,al2023,bottlerocket)
         */
        eksImageFamily?: pulumi.Input<string>;
        /**
         * Allow configure the IMDSv2 hop limit, the default is 2
         */
        imdsHopLimit?: pulumi.Input<number>;
        /**
         * When the value is true both IMDSv1 and IMDSv2 are enabled. Setting the value to false disables permanently IMDSv1 and might affect legacy workloads running on the node created with this configuration. The default is true if the flag isn't provided
         */
        imdsV1?: pulumi.Input<boolean>;
        /**
         * Cluster's instance profile ARN used for CAST provisioned nodes
         */
        instanceProfileArn: pulumi.Input<string>;
        /**
         * Number of IPs per prefix to be used for calculating max pods.
         */
        ipsPerPrefix?: pulumi.Input<number>;
        /**
         * AWS key pair ID to be used for CAST provisioned nodes. Has priority over ssh_public_key
         */
        keyPairId?: pulumi.Input<string>;
        /**
         * Formula to calculate the maximum number of pods that can be run on a node. The following list of variables will be bound to a number before evaluating and can be used in the formula: NUM_MAX_NET_INTERFACES, NUM_IP_PER_INTERFACE, NUM_IP_PER_PREFIX, NUM_CPU, NUM_RAM_GB .
         */
        maxPodsPerNodeFormula?: pulumi.Input<string>;
        /**
         * Cluster's node group ARN used for CAST provisioned node pools. Required for hibernate/resume functionality
         */
        nodeGroupArn?: pulumi.Input<string>;
        /**
         * Cluster's security groups configuration for CAST provisioned nodes
         */
        securityGroups: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * AWS target groups configuration for CAST provisioned nodes
         */
        targetGroups?: pulumi.Input<pulumi.Input<inputs.config.NodeConfigurationEksTargetGroup>[]>;
        /**
         * Number of threads per core.
         */
        threadsPerCpu?: pulumi.Input<number>;
        /**
         * AWS EBS volume IOPS to be used for CAST provisioned nodes
         */
        volumeIops?: pulumi.Input<number>;
        /**
         * AWS KMS key ARN for encrypting EBS volume attached to the node
         */
        volumeKmsKeyArn?: pulumi.Input<string>;
        /**
         * AWS EBS volume throughput in MiB/s to be used for CAST provisioned nodes
         */
        volumeThroughput?: pulumi.Input<number>;
        /**
         * AWS EBS volume type to be used for CAST provisioned nodes. One of: gp3, gp2, io1, io2
         */
        volumeType?: pulumi.Input<string>;
    }
    interface NodeConfigurationEksTargetGroup {
        /**
         * AWS target group ARN for CAST provisioned nodes
         */
        arn: pulumi.Input<string>;
        /**
         * Port for AWS target group for CAST provisioned nodes
         */
        port?: pulumi.Input<number>;
    }
    interface NodeConfigurationGke {
        /**
         * Type of boot disk attached to the node. (See [disk types](https://cloud.google.com/compute/docs/disks#pdspecs)). One of: pd-standard, pd-balanced, pd-ssd, pd-extreme
         */
        diskType?: pulumi.Input<string>;
        /**
         * Loadboalancer configuration for CAST provisioned nodes
         */
        loadbalancers?: pulumi.Input<pulumi.Input<inputs.config.NodeConfigurationGkeLoadbalancer>[]>;
        /**
         * Maximum number of pods that can be run on a node, which affects how many IP addresses you will need for each node. Defaults to 110
         */
        maxPodsPerNode?: pulumi.Input<number>;
        /**
         * This is an advanced configuration field. In general, we recommend using maxPodsPerNode instead.
         * This field accepts a formula to calculate the maximum number of pods that can run on a node. This will affect the pod CIDR range that the node reserves. The following variables are available for use in the formula and will be bound to numeric values before evaluation:
         *
         * * NUM_CPU - Number of CPUs available on the node
         * * NUM_RAM_GB - Amount of RAM in gigabytes available on the node.
         *
         * If you want the smallest value between 5 times the CPUs, 5 times the RAM, or a cap of 110, your formula would be math.least(110, 5*NUM_CPU, 5*NUM_RAM_GB).
         * For a node with 8 CPUs and 16 GB RAM, this calculates to 40 (5×8), 80 (5×16), and 110, then picks the smallest value: 40 pods.
         */
        maxPodsPerNodeFormula?: pulumi.Input<string>;
        /**
         * Network tags to be added on a VM. (See [network tags](https://cloud.google.com/vpc/docs/add-remove-network-tags))
         */
        networkTags?: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * Maintenance behavior of the instances. If not set, the default value for spot nodes is terminate, and for non-spot nodes, it is migrate.
         */
        onHostMaintenance?: pulumi.Input<string>;
        /**
         * Secondary IP range configuration for pods in GKE nodes
         */
        secondaryIpRange?: pulumi.Input<inputs.config.NodeConfigurationGkeSecondaryIpRange>;
        /**
         * Use ephemeral storage local SSD. Defaults to false
         */
        useEphemeralStorageLocalSsd?: pulumi.Input<boolean>;
        /**
         * List of preferred availability zones to choose from when provisioning new nodes.
         *
         * @deprecated The argument will be moved into node template.
         */
        zones?: pulumi.Input<pulumi.Input<string>[]>;
    }
    interface NodeConfigurationGkeLoadbalancer {
        /**
         * Target backend pools configuration for CAST provisioned nodes
         */
        targetBackendPools?: pulumi.Input<pulumi.Input<inputs.config.NodeConfigurationGkeLoadbalancerTargetBackendPool>[]>;
        /**
         * Unmanaged instance groups configuration for CAST provisioned nodes
         */
        unmanagedInstanceGroups?: pulumi.Input<pulumi.Input<inputs.config.NodeConfigurationGkeLoadbalancerUnmanagedInstanceGroup>[]>;
    }
    interface NodeConfigurationGkeLoadbalancerTargetBackendPool {
        /**
         * Name of the target group
         */
        name: pulumi.Input<string>;
    }
    interface NodeConfigurationGkeLoadbalancerUnmanagedInstanceGroup {
        /**
         * Name of the instance group
         */
        name: pulumi.Input<string>;
        /**
         * Zone of the instance group
         */
        zone: pulumi.Input<string>;
    }
    interface NodeConfigurationGkeSecondaryIpRange {
        /**
         * Name of the secondary IP range
         */
        rangeName: pulumi.Input<string>;
    }
    interface NodeConfigurationKops {
        /**
         * AWS key pair ID to be used for provisioned nodes. Has priority over sshPublicKey
         */
        keyPairId?: pulumi.Input<string>;
    }
    interface NodeTemplateConstraints {
        /**
         * Priority ordering of architectures, specifying no priority will pick cheapest. Allowed values: amd64, arm64.
         */
        architecturePriorities?: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * List of acceptable instance CPU architectures, the default is amd64. Allowed values: amd64, arm64.
         */
        architectures?: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * The list of AZ names to consider for the node template, if empty or not set all AZs are considered.
         */
        azs?: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * Bare metal constraint, will only pick bare metal nodes if set to true. Will only pick non-bare metal nodes if false. Defaults to unspecified. Allowed values: true, false, unspecified.
         */
        bareMetal?: pulumi.Input<string>;
        /**
         * Will include burstable instances when enabled otherwise they will be excluded. Supported values: `enabled`, `disabled` or ``.
         */
        burstableInstances?: pulumi.Input<string>;
        /**
         * Compute optimized instance constraint (deprecated).
         */
        computeOptimized?: pulumi.Input<boolean>;
        /**
         * Will only include compute optimized nodes when enabled and exclude compute optimized nodes when disabled. Empty value won't have effect on instances filter. Supported values: `enabled`, `disabled` or empty string.
         */
        computeOptimizedState?: pulumi.Input<string>;
        /**
         * List of acceptable CPU manufacturers. Allowed values: AMD, AMPERE, APPLE, AWS, INTEL.
         */
        cpuManufacturers?: pulumi.Input<pulumi.Input<string>[]>;
        customPriorities?: pulumi.Input<pulumi.Input<inputs.config.NodeTemplateConstraintsCustomPriority>[]>;
        /**
         * Will include customer specific (preview) instances when enabled otherwise they will be excluded. Supported values: `enabled`, `disabled` or ``.
         */
        customerSpecific?: pulumi.Input<string>;
        /**
         * Dedicated node affinity - creates preference for instances to be created on sole tenancy or dedicated nodes. This
         *  feature is only available for GCP clusters and sole tenancy nodes with local
         *  SSDs or GPUs are not supported. If the sole tenancy or dedicated nodes don't have capacity for selected instance
         *  type, the Autoscaler will fall back to multi-tenant instance types available for this Node Template.
         *  Other instance constraints are applied when the Autoscaler picks available instance types that can be created on
         *  the sole tenancy or dedicated node (example: setting min CPU to 16).
         */
        dedicatedNodeAffinities?: pulumi.Input<pulumi.Input<inputs.config.NodeTemplateConstraintsDedicatedNodeAffinity>[]>;
        /**
         * Enable/disable spot diversity policy. When enabled, autoscaler will try to balance between diverse and cost optimal instance types.
         */
        enableSpotDiversity?: pulumi.Input<boolean>;
        /**
         * Fallback restore rate in seconds: defines how much time should pass before spot fallback should be attempted to be restored to real spot.
         */
        fallbackRestoreRateSeconds?: pulumi.Input<number>;
        gpu?: pulumi.Input<inputs.config.NodeTemplateConstraintsGpu>;
        instanceFamilies?: pulumi.Input<inputs.config.NodeTemplateConstraintsInstanceFamilies>;
        /**
         * GPU instance constraint - will only pick nodes with GPU if true
         */
        isGpuOnly?: pulumi.Input<boolean>;
        /**
         * Max CPU cores per node.
         */
        maxCpu?: pulumi.Input<number>;
        /**
         * Max Memory (Mib) per node.
         */
        maxMemory?: pulumi.Input<number>;
        /**
         * Min CPU cores per node.
         */
        minCpu?: pulumi.Input<number>;
        /**
         * Min Memory (Mib) per node.
         */
        minMemory?: pulumi.Input<number>;
        /**
         * Should include on-demand instances in the considered pool.
         */
        onDemand?: pulumi.Input<boolean>;
        /**
         * List of acceptable instance Operating Systems, the default is linux. Allowed values: linux, windows.
         */
        os?: pulumi.Input<pulumi.Input<string>[]>;
        resourceLimits?: pulumi.Input<inputs.config.NodeTemplateConstraintsResourceLimits>;
        /**
         * Should include spot instances in the considered pool.
         */
        spot?: pulumi.Input<boolean>;
        /**
         * Allowed node configuration price increase when diversifying instance types. E.g. if the value is 10%, then the overall price of diversified instance types can be 10% higher than the price of the optimal configuration.
         */
        spotDiversityPriceIncreaseLimitPercent?: pulumi.Input<number>;
        /**
         * Enable/disable spot interruption predictions.
         */
        spotInterruptionPredictionsEnabled?: pulumi.Input<boolean>;
        /**
         * Spot interruption predictions type. Can be either "aws-rebalance-recommendations" or "interruption-predictions".
         */
        spotInterruptionPredictionsType?: pulumi.Input<string>;
        /**
         * Enable/disable spot reliability. When enabled, autoscaler will create instances with highest reliability score within price increase threshold.
         */
        spotReliabilityEnabled?: pulumi.Input<boolean>;
        /**
         * Allowed node price increase when using spot reliability on ordering the instance types . E.g. if the value is 10%, then the overall price of instance types can be 10% higher than the price of the optimal configuration.
         */
        spotReliabilityPriceIncreaseLimitPercent?: pulumi.Input<number>;
        /**
         * Storage optimized instance constraint (deprecated).
         */
        storageOptimized?: pulumi.Input<boolean>;
        /**
         * Storage optimized instance constraint - will only pick storage optimized nodes if enabled and won't pick if disabled. Empty value will have no effect. Supported values: `enabled`, `disabled` or empty string.
         */
        storageOptimizedState?: pulumi.Input<string>;
        /**
         * Spot instance fallback constraint - when true, on-demand instances will be created, when spots are unavailable.
         */
        useSpotFallbacks?: pulumi.Input<boolean>;
    }
    interface NodeTemplateConstraintsCustomPriority {
        /**
         * Instance families to prioritize in this tier.
         */
        instanceFamilies?: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * If true, this tier will apply to on-demand instances.
         */
        onDemand?: pulumi.Input<boolean>;
        /**
         * If true, this tier will apply to spot instances.
         */
        spot?: pulumi.Input<boolean>;
    }
    interface NodeTemplateConstraintsDedicatedNodeAffinity {
        affinities?: pulumi.Input<pulumi.Input<inputs.config.NodeTemplateConstraintsDedicatedNodeAffinityAffinity>[]>;
        /**
         * Availability zone name.
         */
        azName: pulumi.Input<string>;
        /**
         * Instance/node types in this node group.
         */
        instanceTypes: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * Name of node group.
         */
        name: pulumi.Input<string>;
    }
    interface NodeTemplateConstraintsDedicatedNodeAffinityAffinity {
        /**
         * Key of the node affinity selector.
         */
        key: pulumi.Input<string>;
        /**
         * Operator of the node affinity selector. Allowed values: In, NotIn, Exists, DoesNotExist, Gt, Lt.
         */
        operator: pulumi.Input<string>;
        /**
         * Values of the node affinity selector.
         */
        values: pulumi.Input<pulumi.Input<string>[]>;
    }
    interface NodeTemplateConstraintsGpu {
        /**
         * Names of the GPUs to exclude.
         */
        excludeNames?: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * Instance families to include when filtering (excludes all other families).
         */
        includeNames?: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * Manufacturers of the gpus to select - NVIDIA, AMD.
         */
        manufacturers?: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * Max GPU count for the instance type to have.
         */
        maxCount?: pulumi.Input<number>;
        /**
         * Min GPU count for the instance type to have.
         */
        minCount?: pulumi.Input<number>;
    }
    interface NodeTemplateConstraintsInstanceFamilies {
        /**
         * Instance families to exclude when filtering (includes all other families).
         */
        excludes?: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * Instance families to include when filtering (excludes all other families).
         */
        includes?: pulumi.Input<pulumi.Input<string>[]>;
    }
    interface NodeTemplateConstraintsResourceLimits {
        /**
         * Controls CPU limit enforcement for the node template.
         */
        cpuLimitEnabled?: pulumi.Input<boolean>;
        /**
         * Specifies the maximum number of CPU cores that the nodes provisioned from this template can collectively have.
         */
        cpuLimitMaxCores?: pulumi.Input<number>;
    }
    interface NodeTemplateCustomTaint {
        /**
         * Effect of a taint to be added to nodes created from this template, the default is NoSchedule. Allowed values: NoSchedule, NoExecute.
         */
        effect?: pulumi.Input<string>;
        /**
         * Key of a taint to be added to nodes created from this template.
         */
        key: pulumi.Input<string>;
        /**
         * Value of a taint to be added to nodes created from this template.
         */
        value?: pulumi.Input<string>;
    }
    interface NodeTemplateGpu {
        /**
         * Defines default number of shared clients per GPU.
         */
        defaultSharedClientsPerGpu?: pulumi.Input<number>;
        /**
         * Enable/disable GPU time-sharing.
         */
        enableTimeSharing?: pulumi.Input<boolean>;
        /**
         * Defines GPU sharing configurations for GPU devices.
         */
        sharingConfigurations?: pulumi.Input<pulumi.Input<inputs.config.NodeTemplateGpuSharingConfiguration>[]>;
    }
    interface NodeTemplateGpuSharingConfiguration {
        /**
         * GPU name.
         */
        gpuName: pulumi.Input<string>;
        /**
         * Defines number of shared clients for specific GPU device.
         */
        sharedClientsPerGpu: pulumi.Input<number>;
    }
}
export declare namespace iam {
    interface EnterpriseRoleBindingScopes {
        /**
         * Cluster scopes.
         */
        clusters?: pulumi.Input<pulumi.Input<inputs.iam.EnterpriseRoleBindingScopesCluster>[]>;
        /**
         * Organization scopes.
         */
        organizations?: pulumi.Input<pulumi.Input<inputs.iam.EnterpriseRoleBindingScopesOrganization>[]>;
    }
    interface EnterpriseRoleBindingScopesCluster {
        /**
         * Cluster ID.
         */
        id: pulumi.Input<string>;
    }
    interface EnterpriseRoleBindingScopesOrganization {
        /**
         * Organization ID.
         */
        id: pulumi.Input<string>;
    }
    interface EnterpriseRoleBindingSubjects {
        /**
         * Group subjects.
         */
        groups?: pulumi.Input<pulumi.Input<inputs.iam.EnterpriseRoleBindingSubjectsGroup>[]>;
        /**
         * Service account subjects.
         */
        serviceAccounts?: pulumi.Input<pulumi.Input<inputs.iam.EnterpriseRoleBindingSubjectsServiceAccount>[]>;
        /**
         * User subjects.
         */
        users?: pulumi.Input<pulumi.Input<inputs.iam.EnterpriseRoleBindingSubjectsUser>[]>;
    }
    interface EnterpriseRoleBindingSubjectsGroup {
        /**
         * Group ID.
         */
        id: pulumi.Input<string>;
    }
    interface EnterpriseRoleBindingSubjectsServiceAccount {
        /**
         * Service account ID.
         */
        id: pulumi.Input<string>;
    }
    interface EnterpriseRoleBindingSubjectsUser {
        /**
         * User ID.
         */
        id: pulumi.Input<string>;
    }
    interface RoleBindingsScope {
        /**
         * Scope of the role binding Supported values include: organization, cluster.
         */
        kind: pulumi.Input<string>;
        /**
         * ID of the scope resource.
         */
        resourceId: pulumi.Input<string>;
    }
    interface RoleBindingsSubject {
        subjects?: pulumi.Input<pulumi.Input<inputs.iam.RoleBindingsSubjectSubject>[]>;
    }
    interface RoleBindingsSubjectSubject {
        /**
         * Optional, required only if `kind` is `group`.
         */
        groupId?: pulumi.Input<string>;
        /**
         * Kind of the subject. Supported values include: user, service_account, group.
         */
        kind: pulumi.Input<string>;
        /**
         * Optional, required only if `kind` is `serviceAccount`.
         */
        serviceAccountId?: pulumi.Input<string>;
        /**
         * Optional, required only if `kind` is `user`.
         */
        userId?: pulumi.Input<string>;
    }
}
export declare namespace organization {
    interface EnterpriseGroupMember {
        /**
         * Group member configuration.
         */
        members?: pulumi.Input<pulumi.Input<inputs.organization.EnterpriseGroupMemberMember>[]>;
    }
    interface EnterpriseGroupMemberMember {
        /**
         * Member UUID.
         */
        id: pulumi.Input<string>;
        /**
         * Kind of the member. Supported values: user, service_account.
         */
        kind: pulumi.Input<string>;
    }
    interface EnterpriseGroupRoleBinding {
        /**
         * Role binding configuration.
         */
        roleBindings?: pulumi.Input<pulumi.Input<inputs.organization.EnterpriseGroupRoleBindingRoleBinding>[]>;
    }
    interface EnterpriseGroupRoleBindingRoleBinding {
        /**
         * Role binding ID assigned by the API.
         */
        id?: pulumi.Input<string>;
        /**
         * Role binding name.
         */
        name: pulumi.Input<string>;
        /**
         * Role UUID.
         */
        roleId: pulumi.Input<string>;
        /**
         * List of scopes for the role binding.
         */
        scopes: pulumi.Input<pulumi.Input<inputs.organization.EnterpriseGroupRoleBindingRoleBindingScope>[]>;
    }
    interface EnterpriseGroupRoleBindingRoleBindingScope {
        /**
         * Scope configuration.
         */
        scopes?: pulumi.Input<pulumi.Input<inputs.organization.EnterpriseGroupRoleBindingRoleBindingScopeScope>[]>;
    }
    interface EnterpriseGroupRoleBindingRoleBindingScopeScope {
        /**
         * Cluster ID scope.
         */
        cluster?: pulumi.Input<string>;
        /**
         * Organization ID scope.
         */
        organization?: pulumi.Input<string>;
    }
    interface OrganizationGroupMember {
        members?: pulumi.Input<pulumi.Input<inputs.organization.OrganizationGroupMemberMember>[]>;
    }
    interface OrganizationGroupMemberMember {
        email: pulumi.Input<string>;
        id: pulumi.Input<string>;
        /**
         * Kind of the member. Supported values include: user, service_account.
         */
        kind: pulumi.Input<string>;
    }
    interface SSOConnectionAad {
        /**
         * Azure AD domain
         */
        adDomain: pulumi.Input<string>;
        /**
         * Azure AD client ID
         */
        clientId: pulumi.Input<string>;
        /**
         * Azure AD client secret
         */
        clientSecret: pulumi.Input<string>;
    }
    interface SSOConnectionOkta {
        /**
         * Okta client ID
         */
        clientId: pulumi.Input<string>;
        /**
         * Okta client secret
         */
        clientSecret: pulumi.Input<string>;
        /**
         * Okta domain
         */
        oktaDomain: pulumi.Input<string>;
    }
    interface ServiceAccountAuthor {
        email?: pulumi.Input<string>;
        id?: pulumi.Input<string>;
        kind?: pulumi.Input<string>;
    }
}
export declare namespace rebalancing {
    interface GetHibernationScheduleDataSourceClusterAssignment {
        assignments?: inputs.rebalancing.GetHibernationScheduleDataSourceClusterAssignmentAssignment[];
    }
    interface GetHibernationScheduleDataSourceClusterAssignmentArgs {
        assignments?: pulumi.Input<pulumi.Input<inputs.rebalancing.GetHibernationScheduleDataSourceClusterAssignmentAssignmentArgs>[]>;
    }
    interface GetHibernationScheduleDataSourceClusterAssignmentAssignment {
        /**
         * ID of the cluster.
         */
        clusterId: string;
    }
    interface GetHibernationScheduleDataSourceClusterAssignmentAssignmentArgs {
        /**
         * ID of the cluster.
         */
        clusterId: pulumi.Input<string>;
    }
    interface HibernationScheduleClusterAssignments {
        assignments?: pulumi.Input<pulumi.Input<inputs.rebalancing.HibernationScheduleClusterAssignmentsAssignment>[]>;
    }
    interface HibernationScheduleClusterAssignmentsAssignment {
        /**
         * ID of the cluster.
         */
        clusterId: pulumi.Input<string>;
    }
    interface HibernationSchedulePauseConfig {
        /**
         * Enables or disables the pause configuration.
         */
        enabled: pulumi.Input<boolean>;
        schedule: pulumi.Input<inputs.rebalancing.HibernationSchedulePauseConfigSchedule>;
    }
    interface HibernationSchedulePauseConfigSchedule {
        /**
         * Cron expression defining when the schedule should trigger.
         *
         *   The `cron` expression can optionally include the `CRON_TZ` variable at the beginning to specify the timezone in which the schedule should be interpreted.
         *
         *   Example:
         *   ```plaintext
         *   CRON_TZ=America/New_York 0 12 * * ?
         * ```
         *   In the example above, the `CRON_TZ` variable is set to "America/New_York" indicating that the cron expression should be interpreted in the Eastern Time (ET) timezone.
         *
         *   To retrieve a list of available timezone values, you can use the following API endpoint:
         *
         *   GET https://api.cast.ai/v1/time-zones
         *
         *   When using the `CRON_TZ` variable, ensure that the specified timezone is valid and supported by checking the list of available timezones from the API endpoint.  If the `CRON_TZ` variable is not specified, the cron expression will be interpreted in the UTC timezone.
         */
        cronExpression: pulumi.Input<string>;
    }
    interface HibernationScheduleResumeConfig {
        /**
         * Enables or disables the pause configuration.
         */
        enabled: pulumi.Input<boolean>;
        jobConfig: pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfigJobConfig>;
        schedule: pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfigSchedule>;
    }
    interface HibernationScheduleResumeConfigJobConfig {
        nodeConfig: pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfig>;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfig {
        /**
         * ID reference of Node Configuration to be used for node creation. Supersedes 'config_name' parameter.
         */
        configId?: pulumi.Input<string>;
        /**
         * Name reference of Node Configuration to be used for node creation. Superseded if 'config_id' parameter is provided.
         */
        configName?: pulumi.Input<string>;
        gpuConfig?: pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigGpuConfig>;
        /**
         * Instance type.
         */
        instanceType: pulumi.Input<string>;
        /**
         * Custom labels to be added to the node.
         */
        kubernetesLabels?: pulumi.Input<{
            [key: string]: pulumi.Input<string>;
        }>;
        /**
         * Custom taints to be added to the node created from this configuration.
         */
        kubernetesTaints?: pulumi.Input<pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigKubernetesTaint>[]>;
        /**
         * Custom taints to be added to the node created from this configuration.
         */
        nodeAffinities?: pulumi.Input<pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigNodeAffinity>[]>;
        /**
         * Custom taints to be added to the node created from this configuration.
         */
        spotConfigs?: pulumi.Input<pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigSpotConfig>[]>;
        /**
         * Node subnet ID.
         */
        subnetId?: pulumi.Input<string>;
        volumes?: pulumi.Input<pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigVolume>[]>;
        /**
         * Zone of the node.
         */
        zone?: pulumi.Input<string>;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigGpuConfig {
        /**
         * Number of GPUs.
         */
        count: pulumi.Input<number>;
        /**
         * GPU type.
         */
        type?: pulumi.Input<string>;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigKubernetesTaint {
        /**
         * Effect of a taint to be added to nodes created from this template, the default is NoSchedule. Allowed values: NoSchedule, NoExecute.
         */
        effect?: pulumi.Input<string>;
        /**
         * Key of a taint to be added to nodes created from this template.
         */
        key: pulumi.Input<string>;
        /**
         * Value of a taint to be added to nodes created from this template.
         */
        value?: pulumi.Input<string>;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigNodeAffinity {
        affinities?: pulumi.Input<pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigNodeAffinityAffinity>[]>;
        /**
         * Key of a taint to be added to nodes created from this template.
         */
        dedicatedGroup: pulumi.Input<string>;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigNodeAffinityAffinity {
        /**
         * Key of the node affinity selector.
         */
        key: pulumi.Input<string>;
        /**
         * Operator of the node affinity selector. Allowed values: DOES_NOT_EXIST, EXISTS, GT, IN, LT, NOT_IN.
         */
        operator: pulumi.Input<string>;
        /**
         * Values of the node affinity selector.
         */
        values: pulumi.Input<pulumi.Input<string>[]>;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigSpotConfig {
        /**
         * Spot instance price. Applicable only for AWS nodes.
         */
        priceHourly?: pulumi.Input<string>;
        /**
         * Whether node should be created as spot instance.
         */
        spot?: pulumi.Input<boolean>;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigVolume {
        raidConfigs?: pulumi.Input<pulumi.Input<inputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigVolumeRaidConfig>[]>;
        /**
         * Volume size in GiB.
         */
        sizeGib?: pulumi.Input<number>;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigVolumeRaidConfig {
        /**
         * Specify the RAID0 chunk size in kilobytes, this parameter affects the read/write in the disk array and must be tailored for the type of data written by the workloads in the node. If not provided it will default to 64KB
         */
        chunkSizeKb?: pulumi.Input<number>;
    }
    interface HibernationScheduleResumeConfigSchedule {
        /**
         * Cron expression defining when the schedule should trigger.
         *
         *   The `cron` expression can optionally include the `CRON_TZ` variable at the beginning to specify the timezone in which the schedule should be interpreted.
         *
         *   Example:
         *   ```plaintext
         *   CRON_TZ=America/New_York 0 12 * * ?
         * ```
         *   In the example above, the `CRON_TZ` variable is set to "America/New_York" indicating that the cron expression should be interpreted in the Eastern Time (ET) timezone.
         *
         *   To retrieve a list of available timezone values, you can use the following API endpoint:
         *
         *   GET https://api.cast.ai/v1/time-zones
         *
         *   When using the `CRON_TZ` variable, ensure that the specified timezone is valid and supported by checking the list of available timezones from the API endpoint.  If the `CRON_TZ` variable is not specified, the cron expression will be interpreted in the UTC timezone.
         */
        cronExpression: pulumi.Input<string>;
    }
    interface RebalancingScheduleLaunchConfiguration {
        /**
         * When enabled rebalancing will also consider problematic pods (pods without controller, job pods, pods with removal-disabled annotation) as not-problematic.
         */
        aggressiveMode?: pulumi.Input<boolean>;
        /**
         * Advanced configuration for aggressive rebalancing mode.
         */
        aggressiveModeConfig?: pulumi.Input<inputs.rebalancing.RebalancingScheduleLaunchConfigurationAggressiveModeConfig>;
        executionConditions?: pulumi.Input<inputs.rebalancing.RebalancingScheduleLaunchConfigurationExecutionConditions>;
        /**
         * Defines whether the nodes that failed to get drained until a predefined timeout, will be kept with a rebalancing.cast.ai/status=drain-failed annotation instead of forcefully drained.
         */
        keepDrainTimeoutNodes?: pulumi.Input<boolean>;
        /**
         * Specifies amount of time since node creation before the node is allowed to be considered for automated rebalancing.
         */
        nodeTtlSeconds?: pulumi.Input<number>;
        /**
         * Maximum number of nodes that will be selected for rebalancing.
         */
        numTargetedNodes?: pulumi.Input<number>;
        /**
         * Minimum number of nodes that should be kept in the cluster after rebalancing.
         */
        rebalancingMinNodes?: pulumi.Input<number>;
        /**
         * Node selector in JSON format.
         */
        selector?: pulumi.Input<string>;
        /**
         * Defines the algorithm used to select the target nodes for rebalancing.
         */
        targetNodeSelectionAlgorithm?: pulumi.Input<string>;
    }
    interface RebalancingScheduleLaunchConfigurationAggressiveModeConfig {
        /**
         * Rebalance workloads that use local-path Persistent Volumes. THIS WILL RESULT IN DATA LOSS.
         */
        ignoreLocalPersistentVolumes: pulumi.Input<boolean>;
        /**
         * Pods spawned by Jobs or CronJobs will not prevent the Rebalancer from deleting a node on which they run. WARNING: When true, pods spawned by Jobs or CronJobs will be terminated if the Rebalancer picks a node that runs them. As such, they are likely to lose their progress.
         */
        ignoreProblemJobPods: pulumi.Input<boolean>;
        /**
         * Pods that don't have a controller (bare pods) will not prevent the Rebalancer from deleting a node on which they run. WARNING: When true, such pods might not restart, since they have no controller to do it.
         */
        ignoreProblemPodsWithoutController: pulumi.Input<boolean>;
        /**
         * Pods that are marked with "removal disabled" will not prevent the Rebalancer from deleting a node on which they run. WARNING: When true, such pods will be evicted and disrupted.
         */
        ignoreProblemRemovalDisabledPods: pulumi.Input<boolean>;
    }
    interface RebalancingScheduleLaunchConfigurationExecutionConditions {
        /**
         * The percentage of the predicted savings that must be achieved in order to fully execute the plan.If the savings are not achieved after creating the new nodes, the plan will fail and delete the created nodes.
         */
        achievedSavingsPercentage?: pulumi.Input<number>;
        /**
         * Enables or disables the execution conditions.
         */
        enabled: pulumi.Input<boolean>;
    }
    interface RebalancingScheduleSchedule {
        /**
         * Cron expression defining when the schedule should trigger.
         *
         *   The `cron` expression can optionally include the `CRON_TZ` variable at the beginning to specify the timezone in which the schedule should be interpreted.
         *
         *   Example:
         *   ```plaintext
         *   CRON_TZ=America/New_York 0 12 * * ?
         * ```
         *   In the example above, the `CRON_TZ` variable is set to "America/New_York" indicating that the cron expression should be interpreted in the Eastern Time (ET) timezone.
         *
         *   To retrieve a list of available timezone values, you can use the following API endpoint:
         *
         *   GET https://api.cast.ai/v1/time-zones
         *
         *   When using the `CRON_TZ` variable, ensure that the specified timezone is valid and supported by checking the list of available timezones from the API endpoint.  If the `CRON_TZ` variable is not specified, the cron expression will be interpreted in the UTC timezone.
         */
        cron: pulumi.Input<string>;
    }
    interface RebalancingScheduleTriggerConditions {
        /**
         * If true, the savings percentage will be ignored and the rebalancing will be triggered regardless of the savings percentage.
         */
        ignoreSavings?: pulumi.Input<boolean>;
        /**
         * Defines the minimum percentage of savings expected.
         */
        savingsPercentage: pulumi.Input<number>;
    }
}
export declare namespace workload {
    interface WorkloadScalingPolicyAntiAffinity {
        /**
         * Defines if anti-affinity should be considered when scaling the workload.
         * 	If enabled, requiring host ports, or having anti-affinity on hostname will force all recommendations to be deferred.
         */
        considerAntiAffinity?: pulumi.Input<boolean>;
    }
    interface WorkloadScalingPolicyAssignmentRule {
        rules: pulumi.Input<pulumi.Input<inputs.workload.WorkloadScalingPolicyAssignmentRuleRule>[]>;
    }
    interface WorkloadScalingPolicyAssignmentRuleRule {
        /**
         * Allows assigning a scaling policy based on the workload's namespace.
         */
        namespace?: pulumi.Input<inputs.workload.WorkloadScalingPolicyAssignmentRuleRuleNamespace>;
        /**
         * Allows assigning a scaling policy based on the workload's metadata.
         */
        workload?: pulumi.Input<inputs.workload.WorkloadScalingPolicyAssignmentRuleRuleWorkload>;
    }
    interface WorkloadScalingPolicyAssignmentRuleRuleNamespace {
        /**
         * Defines matching by namespace names.
         */
        names?: pulumi.Input<pulumi.Input<string>[]>;
    }
    interface WorkloadScalingPolicyAssignmentRuleRuleWorkload {
        /**
         * Group, version, and kind for Kubernetes resources. Format: kind[.version][.group].
         * It can be either:
         *  - only kind, e.g. "Deployment"
         *  - group and kind: e.g."Deployment.apps"
         *  - group, version and kind: e.g."Deployment.v1.apps"
         */
        gvks?: pulumi.Input<pulumi.Input<string>[]>;
        /**
         * Defines matching by label selector requirements.
         */
        labelsExpressions?: pulumi.Input<pulumi.Input<inputs.workload.WorkloadScalingPolicyAssignmentRuleRuleWorkloadLabelsExpression>[]>;
    }
    interface WorkloadScalingPolicyAssignmentRuleRuleWorkloadLabelsExpression {
        /**
         * The label key to match. Required for all operators except `Regex` and `Contains`. If not specified, it will search through all labels.
         */
        key?: pulumi.Input<string>;
        /**
         * The operator to use for matching the label.
         */
        operator: pulumi.Input<string>;
        /**
         * A list of values to match against the label key. It is required for `In`, `NotIn`, `Regex`, and `Contains` operators.
         */
        values?: pulumi.Input<pulumi.Input<string>[]>;
    }
    interface WorkloadScalingPolicyConfidence {
        /**
         * Defines the confidence threshold for applying recommendations. The smaller number indicates that we require fewer metrics data points to apply recommendations - changing this value can cause applying less precise recommendations. Do not change the default unless you want to optimize with fewer data points (e.g., short-lived workloads).
         */
        threshold?: pulumi.Input<number>;
    }
    interface WorkloadScalingPolicyCpu {
        /**
         * The threshold of when to apply the recommendation. Recommendation will be applied when diff of current requests and new recommendation is greater than set value
         *
         * @deprecated Use applyThresholdStrategy instead
         */
        applyThreshold?: pulumi.Input<number>;
        /**
         * Resource apply threshold strategy settings. The default strategy is `PERCENTAGE` with percentage value set to 0.1.
         */
        applyThresholdStrategy?: pulumi.Input<inputs.workload.WorkloadScalingPolicyCpuApplyThresholdStrategy>;
        /**
         * The arguments for the function - i.e. for `QUANTILE` this should be a [0, 1] float. `MAX` doesn't accept any args
         */
        args?: pulumi.Input<string>;
        /**
         * The function used to calculate the resource recommendation. Supported values: `QUANTILE`, `MAX`
         */
        function?: pulumi.Input<string>;
        /**
         * Resource limit settings
         */
        limit?: pulumi.Input<inputs.workload.WorkloadScalingPolicyCpuLimit>;
        /**
         * The look back period in seconds for the recommendation.
         */
        lookBackPeriodSeconds?: pulumi.Input<number>;
        /**
         * Disables management for a single resource when set to `READ_ONLY`. The resource will use its original workload template requests and limits. Supported value: `READ_ONLY`. Minimum required workload-autoscaler version: `v0.23.1`.
         */
        managementOption?: pulumi.Input<string>;
        /**
         * Max values for the recommendation, applies to every container. For memory - this is in MiB, for CPU - this is in cores.
         */
        max?: pulumi.Input<number>;
        /**
         * Min values for the recommendation, applies to every container. For memory - this is in MiB, for CPU - this is in cores.
         */
        min?: pulumi.Input<number>;
        /**
         * Overhead for the recommendation, e.g. `0.1` will result in 10% higher recommendation
         */
        overhead?: pulumi.Input<number>;
    }
    interface WorkloadScalingPolicyCpuApplyThresholdStrategy {
        /**
         * If denominator is close or equal to 0, the threshold will be much bigger for small values.For example when numerator, exponent is 1 and denominator is 0 the threshold for 0.5 req. CPU will be 200%.It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        denominator?: pulumi.Input<string>;
        /**
         * The exponent changes how fast the curve is going down. The smaller value will cause that we won’t pick extremely small number for big resources, for example:
         * 	- if numerator is 0, denominator is 1, and exponent is 1, for 50 CPU we will pick 2% threshold
         * 	- if numerator is 0, denominator is 1, and exponent is 0.8, for 50 CPU we will pick 4.3% threshold
         * 	It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        exponent?: pulumi.Input<number>;
        /**
         * The numerator affects vertical stretch of function used in adaptive threshold - smaller number will create smaller threshold.It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        numerator?: pulumi.Input<number>;
        /**
         * Percentage of a how much difference should there be between the current pod requests and the new recommendation. It must be defined for the PERCENTAGE strategy.
         */
        percentage?: pulumi.Input<number>;
        /**
         * Defines apply theshold strategy type.
         * 	- PERCENTAGE - recommendation will be applied when diff of current requests and new recommendation is greater than set value
         *     - DEFAULT_ADAPTIVE - will pick larger threshold percentage for small workloads and smaller percentage for large workloads.
         *     - CUSTOM_ADAPTIVE - works in same way as DEFAULT_ADAPTIVE, but it allows to tweak parameters of adaptive threshold formula: percentage = numerator/(currentRequest + denominator)^exponent. This strategy is for advance use cases, we recommend to use DEFAULT_ADAPTIVE strategy.
         */
        type: pulumi.Input<string>;
    }
    interface WorkloadScalingPolicyCpuLimit {
        /**
         * Multiplier used to calculate the resource limit. It must be defined for the MULTIPLIER strategy.
         */
        multiplier?: pulumi.Input<number>;
        /**
         * Defines limit strategy type.
         * 	- NO_LIMIT - removes the resource limit even if it was specified in the workload spec.
         * 	- KEEP_LIMITS - keep existing resource limits. While limits provide stability predictability, they may restrict workloads that need to temporarily burst beyond their allocation.
         * 	- MULTIPLIER - used to calculate the resource limit. The final value is determined by multiplying the resource request by the specified factor.
         */
        type: pulumi.Input<string>;
    }
    interface WorkloadScalingPolicyDownscaling {
        /**
         * Defines the apply type to be used when downscaling.
         * 	- IMMEDIATE - pods are restarted immediately when new recommendation is generated.
         * 	- DEFERRED - pods are not restarted and recommendation values are applied during natural restarts only (new deployment, etc.)
         */
        applyType?: pulumi.Input<string>;
    }
    interface WorkloadScalingPolicyMemory {
        /**
         * The threshold of when to apply the recommendation. Recommendation will be applied when diff of current requests and new recommendation is greater than set value
         *
         * @deprecated Use applyThresholdStrategy instead
         */
        applyThreshold?: pulumi.Input<number>;
        /**
         * Resource apply threshold strategy settings. The default strategy is `PERCENTAGE` with percentage value set to 0.1.
         */
        applyThresholdStrategy?: pulumi.Input<inputs.workload.WorkloadScalingPolicyMemoryApplyThresholdStrategy>;
        /**
         * The arguments for the function - i.e. for `QUANTILE` this should be a [0, 1] float. `MAX` doesn't accept any args
         */
        args?: pulumi.Input<string>;
        /**
         * The function used to calculate the resource recommendation. Supported values: `QUANTILE`, `MAX`
         */
        function?: pulumi.Input<string>;
        /**
         * Resource limit settings
         */
        limit?: pulumi.Input<inputs.workload.WorkloadScalingPolicyMemoryLimit>;
        /**
         * The look back period in seconds for the recommendation.
         */
        lookBackPeriodSeconds?: pulumi.Input<number>;
        /**
         * Disables management for a single resource when set to `READ_ONLY`. The resource will use its original workload template requests and limits. Supported value: `READ_ONLY`. Minimum required workload-autoscaler version: `v0.23.1`.
         */
        managementOption?: pulumi.Input<string>;
        /**
         * Max values for the recommendation, applies to every container. For memory - this is in MiB, for CPU - this is in cores.
         */
        max?: pulumi.Input<number>;
        /**
         * Min values for the recommendation, applies to every container. For memory - this is in MiB, for CPU - this is in cores.
         */
        min?: pulumi.Input<number>;
        /**
         * Overhead for the recommendation, e.g. `0.1` will result in 10% higher recommendation
         */
        overhead?: pulumi.Input<number>;
    }
    interface WorkloadScalingPolicyMemoryApplyThresholdStrategy {
        /**
         * If denominator is close or equal to 0, the threshold will be much bigger for small values.For example when numerator, exponent is 1 and denominator is 0 the threshold for 0.5 req. CPU will be 200%.It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        denominator?: pulumi.Input<string>;
        /**
         * The exponent changes how fast the curve is going down. The smaller value will cause that we won’t pick extremely small number for big resources, for example:
         * 	- if numerator is 0, denominator is 1, and exponent is 1, for 50 CPU we will pick 2% threshold
         * 	- if numerator is 0, denominator is 1, and exponent is 0.8, for 50 CPU we will pick 4.3% threshold
         * 	It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        exponent?: pulumi.Input<number>;
        /**
         * The numerator affects vertical stretch of function used in adaptive threshold - smaller number will create smaller threshold.It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        numerator?: pulumi.Input<number>;
        /**
         * Percentage of a how much difference should there be between the current pod requests and the new recommendation. It must be defined for the PERCENTAGE strategy.
         */
        percentage?: pulumi.Input<number>;
        /**
         * Defines apply theshold strategy type.
         * 	- PERCENTAGE - recommendation will be applied when diff of current requests and new recommendation is greater than set value
         *     - DEFAULT_ADAPTIVE - will pick larger threshold percentage for small workloads and smaller percentage for large workloads.
         *     - CUSTOM_ADAPTIVE - works in same way as DEFAULT_ADAPTIVE, but it allows to tweak parameters of adaptive threshold formula: percentage = numerator/(currentRequest + denominator)^exponent. This strategy is for advance use cases, we recommend to use DEFAULT_ADAPTIVE strategy.
         */
        type: pulumi.Input<string>;
    }
    interface WorkloadScalingPolicyMemoryEvent {
        /**
         * Defines the apply type to be used when applying recommendation for memory related event.
         * 	- IMMEDIATE - pods are restarted immediately when new recommendation is generated.
         * 	- DEFERRED - pods are not restarted and recommendation values are applied during natural restarts only (new deployment, etc.)
         */
        applyType?: pulumi.Input<string>;
    }
    interface WorkloadScalingPolicyMemoryLimit {
        /**
         * Multiplier used to calculate the resource limit. It must be defined for the MULTIPLIER strategy.
         */
        multiplier?: pulumi.Input<number>;
        /**
         * Defines limit strategy type.
         * 	- NO_LIMIT - removes the resource limit even if it was specified in the workload spec.
         * 	- KEEP_LIMITS - keep existing resource limits. While limits provide stability predictability, they may restrict workloads that need to temporarily burst beyond their allocation.
         * 	- MULTIPLIER - used to calculate the resource limit. The final value is determined by multiplying the resource request by the specified factor.
         */
        type: pulumi.Input<string>;
    }
    interface WorkloadScalingPolicyPredictiveScaling {
        /**
         * Defines predictive scaling resource configuration.
         */
        cpu?: pulumi.Input<inputs.workload.WorkloadScalingPolicyPredictiveScalingCpu>;
    }
    interface WorkloadScalingPolicyPredictiveScalingCpu {
        /**
         * Defines if predictive scaling is enabled for resource.
         */
        enabled: pulumi.Input<boolean>;
    }
    interface WorkloadScalingPolicyRolloutBehavior {
        /**
         * Defines if pods should be restarted one by one to avoid service disruption.
         */
        preferOneByOne?: pulumi.Input<boolean>;
        /**
         * Defines the rollout type to be used when applying recommendations.
         * 	- NO_DISRUPTION - pods are restarted without causing service disruption.
         */
        type?: pulumi.Input<string>;
    }
    interface WorkloadScalingPolicyStartup {
        /**
         * Defines the duration (in seconds) during which elevated resource usage is expected at startup.
         * When set, recommendations will be adjusted to disregard resource spikes within this period.
         * If not specified, the workload will receive standard recommendations without startup considerations.
         */
        periodSeconds?: pulumi.Input<number>;
    }
}
