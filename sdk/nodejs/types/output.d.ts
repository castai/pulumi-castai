import * as outputs from "../types/output";
export interface CommitmentsAzureReservation {
    /**
     * Allowed usage of the commitment. The value is between 0 (0%) and 1 (100%).
     */
    allowedUsage: number;
    /**
     * List of assigned clusters for the commitment. If prioritization is enabled, the order of the assignments indicates the priority. The first assignment has the highest priority.
     */
    assignments?: outputs.CommitmentsAzureReservationAssignment[];
    /**
     * Number of instances covered by the reservation.
     */
    count: number;
    /**
     * End timestamp of the CUD.
     */
    endTimestamp: string;
    /**
     * ID of the commitment in CAST AI.
     */
    id: string;
    /**
     * Type of the instance covered by the reservation.
     */
    instanceType: string;
    /**
     * Name of the CUD.
     */
    name: string;
    /**
     * Plan of the reservation.
     */
    plan: string;
    /**
     * If enabled, it's possible to assign priorities to the assigned clusters.
     */
    prioritization: boolean;
    /**
     * Region in which the CUD is available.
     */
    region: string;
    /**
     * ID of the reservation in Azure.
     */
    reservationId: string;
    /**
     * Status of the reservation in Azure.
     */
    reservationStatus: string;
    /**
     * Scaling strategy of the commitment in CAST AI. One of: Default, CPUBased, RamBased
     */
    scalingStrategy?: string;
    scope: string;
    scopeResourceGroup: string;
    scopeSubscription: string;
    /**
     * Start timestamp of the CUD.
     */
    startTimestamp: string;
    /**
     * Status of the commitment in CAST AI.
     */
    status: string;
}
export interface CommitmentsAzureReservationAssignment {
    /**
     * ID of the cluster to assign the commitment to.
     */
    clusterId: string;
    /**
     * Priority of the assignment. The lower the value, the higher the priority. 1 is the highest priority.
     */
    priority: number;
}
export interface CommitmentsCommitmentConfig {
    /**
     * Allowed usage of the commitment. The value is between 0 (0%) and 1 (100%).
     */
    allowedUsage?: number;
    /**
     * List of assigned clusters for the commitment. If prioritization is enabled, the order of the assignments indicates the priority. The first assignment has the highest priority.
     */
    assignments?: outputs.CommitmentsCommitmentConfigAssignment[];
    /**
     * Matcher used to map config to a commitment.
     */
    matcher: outputs.CommitmentsCommitmentConfigMatcher;
    /**
     * If enabled, it's possible to assign priorities to the assigned clusters.
     */
    prioritization?: boolean;
    /**
     * Scaling strategy of the commitment in CAST AI. One of: Default, CPUBased, RamBased
     */
    scalingStrategy?: string;
    /**
     * Status of the commitment in CAST AI.
     */
    status?: string;
}
export interface CommitmentsCommitmentConfigAssignment {
    /**
     * ID of the cluster to assign the commitment to.
     */
    clusterId: string;
    /**
     * Priority of the assignment. The lower the value, the higher the priority. 1 is the highest priority.
     */
    priority: number;
}
export interface CommitmentsCommitmentConfigMatcher {
    /**
     * Name of the commitment to match.
     */
    name: string;
    /**
     * Region of the commitment to match.
     */
    region: string;
    /**
     * Type of the commitment to match. For compute resources, it's the type of the machine.
     */
    type?: string;
}
export interface CommitmentsGcpCud {
    /**
     * Allowed usage of the commitment. The value is between 0 (0%) and 1 (100%).
     */
    allowedUsage: number;
    /**
     * List of assigned clusters for the commitment. If prioritization is enabled, the order of the assignments indicates the priority. The first assignment has the highest priority.
     */
    assignments?: outputs.CommitmentsGcpCudAssignment[];
    /**
     * Number of CPUs covered by the CUD.
     */
    cpu: number;
    /**
     * ID of the CUD in GCP.
     */
    cudId: string;
    /**
     * Status of the CUD in GCP.
     */
    cudStatus: string;
    /**
     * End timestamp of the CUD.
     */
    endTimestamp: string;
    /**
     * ID of the commitment in CAST AI.
     */
    id: string;
    /**
     * Amount of memory in MB covered by the CUD.
     */
    memoryMb: number;
    /**
     * Name of the CUD.
     */
    name: string;
    /**
     * CUD plan e.g. 'TWELVE_MONTH'.
     */
    plan: string;
    /**
     * If enabled, it's possible to assign priorities to the assigned clusters.
     */
    prioritization: boolean;
    /**
     * Region in which the CUD is available.
     */
    region: string;
    /**
     * Scaling strategy of the commitment in CAST AI. One of: Default, CPUBased, RamBased
     */
    scalingStrategy?: string;
    /**
     * Start timestamp of the CUD.
     */
    startTimestamp: string;
    /**
     * Status of the commitment in CAST AI.
     */
    status: string;
    /**
     * Type of the CUD, e.g. determines the covered resource type e.g. 'COMPUTE_OPTIMIZED_C2D'.
     */
    type: string;
}
export interface CommitmentsGcpCudAssignment {
    /**
     * ID of the cluster to assign the commitment to.
     */
    clusterId: string;
    /**
     * Priority of the assignment. The lower the value, the higher the priority. 1 is the highest priority.
     */
    priority: number;
}
export interface ReservationsReservation {
    /**
     * amount of reserved instances
     */
    count: string;
    /**
     * end date of reservation
     */
    endDate?: string;
    /**
     * reserved instance type
     */
    instanceType: string;
    /**
     * unique reservation name in region for specific instance type
     */
    name: string;
    /**
     * reservation price
     */
    price: string;
    /**
     * reservation cloud provider (gcp, aws, azure)
     */
    provider: string;
    /**
     * reservation region
     */
    region: string;
    /**
     * start date of reservation
     */
    startDate: string;
    /**
     * reservation zone id
     */
    zoneId?: string;
    /**
     * reservation zone name
     */
    zoneName?: string;
}
export declare namespace autoscaling {
    interface AutoscalerAutoscalerSettings {
        /**
         * defines minimum and maximum amount of CPU the cluster can have.
         */
        clusterLimits?: outputs.autoscaling.AutoscalerAutoscalerSettingsClusterLimits;
        /**
         * enable/disable autoscaler policies
         */
        enabled?: boolean;
        /**
         * run autoscaler in scoped mode. Only marked pods and nodes will be considered.
         */
        isScopedMode?: boolean;
        /**
         * node downscaler defines policies for removing nodes based on the configured conditions.
         */
        nodeDownscaler?: outputs.autoscaling.AutoscalerAutoscalerSettingsNodeDownscaler;
        /**
         * marks whether partial matching should be used when deciding which custom node template to select.
         */
        nodeTemplatesPartialMatchingEnabled?: boolean;
        /**
         * policy defining whether autoscaler can use spot instances for provisioning additional workloads.
         *
         * @deprecated `spotInstances` is deprecated. Configure spot instance settings using the `constraints` field in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        spotInstances?: outputs.autoscaling.AutoscalerAutoscalerSettingsSpotInstances;
        /**
         * policy defining autoscaler's behavior when unschedulable pods were detected.
         */
        unschedulablePods?: outputs.autoscaling.AutoscalerAutoscalerSettingsUnschedulablePods;
    }
    interface AutoscalerAutoscalerSettingsClusterLimits {
        /**
         * defines the minimum and maximum amount of CPUs for cluster's worker nodes.
         */
        cpu?: outputs.autoscaling.AutoscalerAutoscalerSettingsClusterLimitsCpu;
        /**
         * enable/disable cluster size limits policy.
         */
        enabled?: boolean;
    }
    interface AutoscalerAutoscalerSettingsClusterLimitsCpu {
        /**
         * defines the maximum allowed amount of vCPUs in the whole cluster.
         */
        maxCores?: number;
        /**
         * defines the minimum allowed amount of CPUs in the whole cluster.
         */
        minCores?: number;
    }
    interface AutoscalerAutoscalerSettingsNodeDownscaler {
        /**
         * defines whether Node Downscaler should opt in for removing empty worker nodes when possible.
         */
        emptyNodes?: outputs.autoscaling.AutoscalerAutoscalerSettingsNodeDownscalerEmptyNodes;
        /**
         * enable/disable node downscaler policy.
         */
        enabled?: boolean;
        /**
         * defines the CAST AI Evictor component settings. Evictor watches the pods running in your cluster and looks for ways to compact them into fewer nodes, making nodes empty, which will be removed by the empty worker nodes policy.
         */
        evictor?: outputs.autoscaling.AutoscalerAutoscalerSettingsNodeDownscalerEvictor;
    }
    interface AutoscalerAutoscalerSettingsNodeDownscalerEmptyNodes {
        /**
         * period (in seconds) to wait before removing the node. Might be useful to control the aggressiveness of the downscaler.
         */
        delaySeconds?: number;
        /**
         * enable/disable the empty worker nodes policy.
         */
        enabled?: boolean;
    }
    interface AutoscalerAutoscalerSettingsNodeDownscalerEvictor {
        /**
         * enable/disable aggressive mode. By default, Evictor does not target nodes that are running unreplicated pods. This mode will make the Evictor start considering application with just a single replica.
         */
        aggressiveMode?: boolean;
        /**
         * configure the interval duration between Evictor operations. This property can be used to lower or raise the frequency of the Evictor's find-and-drain operations.
         */
        cycleInterval?: string;
        /**
         * enable/disable dry-run. This property allows you to prevent the Evictor from carrying any operations out and preview the actions it would take.
         */
        dryRun?: boolean;
        /**
         * enable/disable the Evictor policy. This will either install or uninstall the Evictor component in your cluster.
         */
        enabled?: boolean;
        /**
         * if enabled then Evictor will attempt to evict pods that have pod disruption budgets configured.
         */
        ignorePodDisruptionBudgets?: boolean;
        /**
         * configure the node grace period which controls the duration which must pass after a node has been created before Evictor starts considering that node.
         */
        nodeGracePeriodMinutes?: number;
        /**
         * configure the pod eviction failure back off interval. If pod eviction fails then Evictor will attempt to evict it again after the amount of time specified here.
         */
        podEvictionFailureBackOffInterval?: string;
        /**
         * enable/disable scoped mode. By default, Evictor targets all nodes in the cluster. This mode will constrain it to just the nodes which were created by CAST AI.
         */
        scopedMode?: boolean;
    }
    interface AutoscalerAutoscalerSettingsSpotInstances {
        /**
         * enable/disable spot instances policy.
         *
         * @deprecated `enabled` under `spotInstances` is deprecated. To enable spot instances, set `constraints.spot = true` in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        enabled?: boolean;
        /**
         * max allowed reclaim rate when choosing spot instance type. E.g. if the value is 10%, instance types having 10% or higher reclaim rate will not be considered. Set to zero to use all instance types regardless of reclaim rate.
         *
         * @deprecated `maxReclaimRate` under `spotInstances` is deprecated. This field has no direct equivalent in the castai.config.NodeTemplate resource, and setting it will have no effect.
         */
        maxReclaimRate?: number;
        /**
         * policy defining whether autoscaler can use spot backups instead of spot instances when spot instances are not available.
         *
         * @deprecated `spotBackups` under `spotInstances` is deprecated. Configure spot backup behavior using `constraints.use_spot_fallbacks` and `constraints.fallback_restore_rate_seconds` in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        spotBackups?: outputs.autoscaling.AutoscalerAutoscalerSettingsSpotInstancesSpotBackups;
        /**
         * enable/disable spot diversity policy. When enabled, autoscaler will try to balance between diverse and cost optimal instance types.
         *
         * @deprecated `spotDiversityEnabled` is deprecated. Use the `enableSpotDiversity` field within `castai_node_template.constraints` in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        spotDiversityEnabled?: boolean;
        /**
         * allowed node configuration price increase when diversifying instance types. E.g. if the value is 10%, then the overall price of diversified instance types can be 10% higher than the price of the optimal configuration.
         *
         * @deprecated `spotDiversityPriceIncreaseLimit` is deprecated. Use `spotDiversityPriceIncreaseLimitPercent` within `castai_node_template.constraints` in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        spotDiversityPriceIncreaseLimit?: number;
        /**
         * configure the handling of SPOT interruption predictions.
         *
         * @deprecated `spotInterruptionPredictions` is deprecated. Use the `spotInterruptionPredictionsEnabled` and `spotInterruptionPredictionsType` fields in the default castai.config.NodeTemplate resource. The default node template has `isDefault = true`.
         */
        spotInterruptionPredictions?: outputs.autoscaling.AutoscalerAutoscalerSettingsSpotInstancesSpotInterruptionPredictions;
    }
    interface AutoscalerAutoscalerSettingsSpotInstancesSpotBackups {
        /**
         * enable/disable spot backups policy.
         */
        enabled?: boolean;
        /**
         * defines interval on how often spot backups restore to real spot should occur.
         */
        spotBackupRestoreRateSeconds?: number;
    }
    interface AutoscalerAutoscalerSettingsSpotInstancesSpotInterruptionPredictions {
        /**
         * enable/disable spot interruption predictions.
         */
        enabled?: boolean;
        /**
         * define the type of the spot interruption prediction to handle. Allowed values are AWSRebalanceRecommendations, CASTAIInterruptionPredictions.
         */
        spotInterruptionPredictionsType?: string;
    }
    interface AutoscalerAutoscalerSettingsUnschedulablePods {
        /**
         * enable/disable custom instances policy.
         *
         * @deprecated `customInstancesEnabled` under `unschedulable_pods.node_constraints` is deprecated. Use the `customInstancesEnabled` field in the default castai.config.NodeTemplate resource instead. The default node template has `isDefault = true`.
         */
        customInstancesEnabled?: boolean;
        /**
         * enable/disable unschedulable pods detection policy.
         */
        enabled?: boolean;
        /**
         * additional headroom based on cluster's total available capacity for on-demand nodes.
         *
         * @deprecated `headroom` is deprecated. Please refer to the FAQ for guidance on cluster headroom: https://docs.cast.ai/docs/autoscaler-1#can-you-please-share-some-guidance-on-cluster-headroom-i-would-like-to-add-some-buffer-room-so-that-pods-have-a-place-to-run-when-nodes-go-down
         */
        headroom?: outputs.autoscaling.AutoscalerAutoscalerSettingsUnschedulablePodsHeadroom;
        /**
         * additional headroom based on cluster's total available capacity for spot nodes.
         *
         * @deprecated `headroomSpot` is deprecated. Please refer to the FAQ for guidance on cluster headroom: https://docs.cast.ai/docs/autoscaler-1#can-you-please-share-some-guidance-on-cluster-headroom-i-would-like-to-add-some-buffer-room-so-that-pods-have-a-place-to-run-when-nodes-go-down
         */
        headroomSpot?: outputs.autoscaling.AutoscalerAutoscalerSettingsUnschedulablePodsHeadroomSpot;
        /**
         * defines the node constraints that will be applied when autoscaling with Unschedulable Pods policy.
         *
         * @deprecated `nodeConstraints` under `unschedulablePods` is deprecated. Use the `constraints` field in the default castai.config.NodeTemplate resource instead. The default node template has `isDefault = true`.
         */
        nodeConstraints?: outputs.autoscaling.AutoscalerAutoscalerSettingsUnschedulablePodsNodeConstraints;
        /**
         * defines the Cast AI Pod Pinner components settings.
         */
        podPinner?: outputs.autoscaling.AutoscalerAutoscalerSettingsUnschedulablePodsPodPinner;
    }
    interface AutoscalerAutoscalerSettingsUnschedulablePodsHeadroom {
        /**
         * defines percentage of additional CPU capacity to be added.
         */
        cpuPercentage?: number;
        /**
         * enable/disable headroom policy.
         */
        enabled?: boolean;
        /**
         * defines percentage of additional memory capacity to be added.
         */
        memoryPercentage?: number;
    }
    interface AutoscalerAutoscalerSettingsUnschedulablePodsHeadroomSpot {
        /**
         * defines percentage of additional CPU capacity to be added.
         */
        cpuPercentage?: number;
        /**
         * enable/disable headroomSpot policy.
         */
        enabled?: boolean;
        /**
         * defines percentage of additional memory capacity to be added.
         */
        memoryPercentage?: number;
    }
    interface AutoscalerAutoscalerSettingsUnschedulablePodsNodeConstraints {
        /**
         * enable/disable node constraints policy.
         */
        enabled?: boolean;
        /**
         * defines max CPU cores for the node to pick.
         */
        maxCpuCores?: number;
        /**
         * defines max RAM in MiB for the node to pick.
         */
        maxRamMib?: number;
        /**
         * defines min CPU cores for the node to pick.
         */
        minCpuCores?: number;
        /**
         * defines min RAM in MiB for the node to pick.
         */
        minRamMib?: number;
    }
    interface AutoscalerAutoscalerSettingsUnschedulablePodsPodPinner {
        /**
         * enable/disable the Pod Pinner component's automatic management in your cluster. Default: enabled.
         */
        enabled?: boolean;
    }
    interface EvictorAdvancedConfigEvictorAdvancedConfig {
        /**
         * Apply Aggressive mode to Evictor
         */
        aggressive?: boolean;
        /**
         * Mark node as disposable
         */
        disposable?: boolean;
        /**
         * node selector
         */
        nodeSelectors?: outputs.autoscaling.EvictorAdvancedConfigEvictorAdvancedConfigNodeSelector[];
        /**
         * pod selector
         */
        podSelectors?: outputs.autoscaling.EvictorAdvancedConfigEvictorAdvancedConfigPodSelector[];
        /**
         * Mark pods as removal disabled
         */
        removalDisabled?: boolean;
    }
    interface EvictorAdvancedConfigEvictorAdvancedConfigNodeSelector {
        matchExpressions?: outputs.autoscaling.EvictorAdvancedConfigEvictorAdvancedConfigNodeSelectorMatchExpression[];
        matchLabels?: {
            [key: string]: string;
        };
    }
    interface EvictorAdvancedConfigEvictorAdvancedConfigNodeSelectorMatchExpression {
        key: string;
        operator: string;
        values?: string[];
    }
    interface EvictorAdvancedConfigEvictorAdvancedConfigPodSelector {
        kind?: string;
        matchExpressions?: outputs.autoscaling.EvictorAdvancedConfigEvictorAdvancedConfigPodSelectorMatchExpression[];
        matchLabels?: {
            [key: string]: string;
        };
        namespace?: string;
    }
    interface EvictorAdvancedConfigEvictorAdvancedConfigPodSelectorMatchExpression {
        key: string;
        operator: string;
        values?: string[];
    }
}
export declare namespace azure {
    interface AksClusterHttpProxyConfig {
        /**
         * Address to use for proxying HTTP requests.
         */
        httpProxy?: string;
        /**
         * Address to use for proxying HTTPS/TLS requests.
         */
        httpsProxy?: string;
        /**
         * List of destinations that should not go through proxy.
         */
        noProxies?: string[];
    }
}
export declare namespace config {
    interface NodeConfigurationAks {
        /**
         * Image OS Family to use when provisioning node in AKS. If both image and family are provided, the system will use provided image and provisioning logic for given family. If only image family is provided, the system will attempt to resolve the latest image from that family based on kubernetes version and node architecture. If image family is omitted, a default family (based on cloud provider) will be used. See Cast.ai documentation for details. Possible values: (ubuntu,azure-linux,windows2019,windows2022)
         */
        aksImageFamily?: string;
        /**
         * Application security groups to be used for provisioned nodes
         */
        applicationSecurityGroups?: string[];
        /**
         * Ephemeral OS disk configuration for CAST provisioned nodes
         */
        ephemeralOsDisk?: outputs.config.NodeConfigurationAksEphemeralOsDisk;
        /**
         * Load balancer configuration for CAST provisioned nodes
         */
        loadbalancers?: outputs.config.NodeConfigurationAksLoadbalancer[];
        /**
         * Maximum number of pods that can be run on a node, which affects how many IP addresses you will need for each node. Defaults to 30
         */
        maxPodsPerNode?: number;
        /**
         * Network security group to be used for provisioned nodes, if not provided default security group from `castpool` will be used
         */
        networkSecurityGroup?: string;
        /**
         * Type of managed os disk attached to the node. (See [disk types](https://learn.microsoft.com/en-us/azure/virtual-machines/disks-types)). One of: standard, standard-ssd, premium-ssd (ultra and premium-ssd-v2 are not supported for os disk)
         */
        osDiskType?: string;
        /**
         * ID of pod subnet to be used for provisioned nodes.
         */
        podSubnetId?: string;
        /**
         * Public IP configuration for CAST AI provisioned nodes
         */
        publicIp?: outputs.config.NodeConfigurationAksPublicIp;
    }
    interface NodeConfigurationAksEphemeralOsDisk {
        /**
         * Cache type for the ephemeral OS disk. One of: ReadOnly, ReadWrite
         */
        cache?: string;
        /**
         * Placement of the ephemeral OS disk. One of: cacheDisk, resourceDisk
         */
        placement: string;
    }
    interface NodeConfigurationAksLoadbalancer {
        /**
         * The full ID of the load balancer in azure.
         */
        id?: string;
        /**
         * IP based backend pools configuration for CAST provisioned nodes
         */
        ipBasedBackendPools?: outputs.config.NodeConfigurationAksLoadbalancerIpBasedBackendPool[];
        /**
         * Name of load balancer
         *
         * @deprecated name field is deprecated, use ID instead. Will be removed in future versions.
         */
        name?: string;
        /**
         * NIC based backend pools configuration for CAST provisioned nodes.
         */
        nicBasedBackendPools?: outputs.config.NodeConfigurationAksLoadbalancerNicBasedBackendPool[];
    }
    interface NodeConfigurationAksLoadbalancerIpBasedBackendPool {
        /**
         * Name of the ip based backend pool
         */
        name: string;
    }
    interface NodeConfigurationAksLoadbalancerNicBasedBackendPool {
        /**
         * Name of the NIC based backend pool
         */
        name: string;
    }
    interface NodeConfigurationAksPublicIp {
        /**
         * Idle timeout in minutes for public IP
         */
        idleTimeoutInMinutes?: number;
        /**
         * Public IP prefix to be used for provisioned nodes
         */
        publicIpPrefix?: string;
        tags?: {
            [key: string]: string;
        };
    }
    interface NodeConfigurationEks {
        /**
         * IP address to use for DNS queries within the cluster
         */
        dnsClusterIp?: string;
        /**
         * Image OS Family to use when provisioning node in EKS. If both image and family are provided, the system will use provided image and provisioning logic for given family. If only image family is provided, the system will attempt to resolve the latest image from that family based on kubernetes version and node architecture. If image family is omitted, a default family (based on cloud provider) will be used. See Cast.ai documentation for details. Possible values: (al2,al2023,bottlerocket)
         */
        eksImageFamily?: string;
        /**
         * Allow configure the IMDSv2 hop limit, the default is 2
         */
        imdsHopLimit?: number;
        /**
         * When the value is true both IMDSv1 and IMDSv2 are enabled. Setting the value to false disables permanently IMDSv1 and might affect legacy workloads running on the node created with this configuration. The default is true if the flag isn't provided
         */
        imdsV1?: boolean;
        /**
         * Cluster's instance profile ARN used for CAST provisioned nodes
         */
        instanceProfileArn: string;
        /**
         * Number of IPs per prefix to be used for calculating max pods.
         */
        ipsPerPrefix?: number;
        /**
         * AWS key pair ID to be used for CAST provisioned nodes. Has priority over ssh_public_key
         */
        keyPairId?: string;
        /**
         * Formula to calculate the maximum number of pods that can be run on a node. The following list of variables will be bound to a number before evaluating and can be used in the formula: NUM_MAX_NET_INTERFACES, NUM_IP_PER_INTERFACE, NUM_IP_PER_PREFIX, NUM_CPU, NUM_RAM_GB .
         */
        maxPodsPerNodeFormula?: string;
        /**
         * Cluster's node group ARN used for CAST provisioned node pools. Required for hibernate/resume functionality
         */
        nodeGroupArn?: string;
        /**
         * Cluster's security groups configuration for CAST provisioned nodes
         */
        securityGroups: string[];
        /**
         * AWS target groups configuration for CAST provisioned nodes
         */
        targetGroups?: outputs.config.NodeConfigurationEksTargetGroup[];
        /**
         * Number of threads per core.
         */
        threadsPerCpu?: number;
        /**
         * AWS EBS volume IOPS to be used for CAST provisioned nodes
         */
        volumeIops?: number;
        /**
         * AWS KMS key ARN for encrypting EBS volume attached to the node
         */
        volumeKmsKeyArn?: string;
        /**
         * AWS EBS volume throughput in MiB/s to be used for CAST provisioned nodes
         */
        volumeThroughput?: number;
        /**
         * AWS EBS volume type to be used for CAST provisioned nodes. One of: gp3, gp2, io1, io2
         */
        volumeType?: string;
    }
    interface NodeConfigurationEksTargetGroup {
        /**
         * AWS target group ARN for CAST provisioned nodes
         */
        arn: string;
        /**
         * Port for AWS target group for CAST provisioned nodes
         */
        port?: number;
    }
    interface NodeConfigurationGke {
        /**
         * Type of boot disk attached to the node. (See [disk types](https://cloud.google.com/compute/docs/disks#pdspecs)). One of: pd-standard, pd-balanced, pd-ssd, pd-extreme
         */
        diskType?: string;
        /**
         * Loadboalancer configuration for CAST provisioned nodes
         */
        loadbalancers?: outputs.config.NodeConfigurationGkeLoadbalancer[];
        /**
         * Maximum number of pods that can be run on a node, which affects how many IP addresses you will need for each node. Defaults to 110
         */
        maxPodsPerNode?: number;
        /**
         * This is an advanced configuration field. In general, we recommend using maxPodsPerNode instead.
         * This field accepts a formula to calculate the maximum number of pods that can run on a node. This will affect the pod CIDR range that the node reserves. The following variables are available for use in the formula and will be bound to numeric values before evaluation:
         *
         *     * NUM_CPU - Number of CPUs available on the node
         *     * NUM_RAM_GB - Amount of RAM in gigabytes available on the node.
         *
         * If you want the smallest value between 5 times the CPUs, 5 times the RAM, or a cap of 110, your formula would be math.least(110, 5 \* NUM_CPU, 5 \* NUM_RAM_GB).
         * For a node with 8 CPUs and 16 GB RAM, this calculates to 40 (5×8), 80 (5×16), and 110, then picks the smallest value: 40 pods.
         */
        maxPodsPerNodeFormula?: string;
        /**
         * Network tags to be added on a VM. (See [network tags](https://cloud.google.com/vpc/docs/add-remove-network-tags))
         */
        networkTags?: string[];
        /**
         * Maintenance behavior of the instances. If not set, the default value for spot nodes is terminate, and for non-spot nodes, it is migrate.
         */
        onHostMaintenance?: string;
        /**
         * Secondary IP range configuration for pods in GKE nodes
         */
        secondaryIpRange?: outputs.config.NodeConfigurationGkeSecondaryIpRange;
        /**
         * Use ephemeral storage local SSD. Defaults to false
         */
        useEphemeralStorageLocalSsd?: boolean;
        /**
         * List of preferred availability zones to choose from when provisioning new nodes.
         *
         * @deprecated The argument will be moved into node template.
         */
        zones?: string[];
    }
    interface NodeConfigurationGkeLoadbalancer {
        /**
         * Target backend pools configuration for CAST provisioned nodes
         */
        targetBackendPools?: outputs.config.NodeConfigurationGkeLoadbalancerTargetBackendPool[];
        /**
         * Unmanaged instance groups configuration for CAST provisioned nodes
         */
        unmanagedInstanceGroups?: outputs.config.NodeConfigurationGkeLoadbalancerUnmanagedInstanceGroup[];
    }
    interface NodeConfigurationGkeLoadbalancerTargetBackendPool {
        /**
         * Name of the target group
         */
        name: string;
    }
    interface NodeConfigurationGkeLoadbalancerUnmanagedInstanceGroup {
        /**
         * Name of the instance group
         */
        name: string;
        /**
         * Zone of the instance group
         */
        zone: string;
    }
    interface NodeConfigurationGkeSecondaryIpRange {
        /**
         * Name of the secondary IP range
         */
        rangeName: string;
    }
    interface NodeConfigurationKops {
        /**
         * AWS key pair ID to be used for provisioned nodes. Has priority over sshPublicKey
         */
        keyPairId?: string;
    }
    interface NodeTemplateConstraints {
        /**
         * Priority ordering of architectures, specifying no priority will pick cheapest. Allowed values: amd64, arm64.
         */
        architecturePriorities: string[];
        /**
         * List of acceptable instance CPU architectures, the default is amd64. Allowed values: amd64, arm64.
         */
        architectures: string[];
        /**
         * The list of AZ names to consider for the node template, if empty or not set all AZs are considered.
         */
        azs?: string[];
        /**
         * Bare metal constraint, will only pick bare metal nodes if set to true. Will only pick non-bare metal nodes if false. Defaults to unspecified. Allowed values: true, false, unspecified.
         */
        bareMetal?: string;
        /**
         * Will include burstable instances when enabled otherwise they will be excluded. Supported values: `enabled`, `disabled` or ``.
         */
        burstableInstances?: string;
        /**
         * Compute optimized instance constraint (deprecated).
         */
        computeOptimized?: boolean;
        /**
         * Will only include compute optimized nodes when enabled and exclude compute optimized nodes when disabled. Empty value won't have effect on instances filter. Supported values: `enabled`, `disabled` or empty string.
         */
        computeOptimizedState?: string;
        /**
         * List of acceptable CPU manufacturers. Allowed values: AMD, AMPERE, APPLE, AWS, INTEL.
         */
        cpuManufacturers?: string[];
        customPriorities?: outputs.config.NodeTemplateConstraintsCustomPriority[];
        /**
         * Will include customer specific (preview) instances when enabled otherwise they will be excluded. Supported values: `enabled`, `disabled` or ``.
         */
        customerSpecific?: string;
        /**
         * Dedicated node affinity - creates preference for instances to be created on sole tenancy or dedicated nodes. This
         *  feature is only available for GCP clusters and sole tenancy nodes with local
         *  SSDs or GPUs are not supported. If the sole tenancy or dedicated nodes don't have capacity for selected instance
         *  type, the Autoscaler will fall back to multi-tenant instance types available for this Node Template.
         *  Other instance constraints are applied when the Autoscaler picks available instance types that can be created on
         *  the sole tenancy or dedicated node (example: setting min CPU to 16).
         */
        dedicatedNodeAffinities?: outputs.config.NodeTemplateConstraintsDedicatedNodeAffinity[];
        /**
         * Enable/disable spot diversity policy. When enabled, autoscaler will try to balance between diverse and cost optimal instance types.
         */
        enableSpotDiversity?: boolean;
        /**
         * Fallback restore rate in seconds: defines how much time should pass before spot fallback should be attempted to be restored to real spot.
         */
        fallbackRestoreRateSeconds?: number;
        gpu?: outputs.config.NodeTemplateConstraintsGpu;
        instanceFamilies?: outputs.config.NodeTemplateConstraintsInstanceFamilies;
        /**
         * GPU instance constraint - will only pick nodes with GPU if true
         */
        isGpuOnly?: boolean;
        /**
         * Max CPU cores per node.
         */
        maxCpu?: number;
        /**
         * Max Memory (Mib) per node.
         */
        maxMemory?: number;
        /**
         * Min CPU cores per node.
         */
        minCpu?: number;
        /**
         * Min Memory (Mib) per node.
         */
        minMemory?: number;
        /**
         * Should include on-demand instances in the considered pool.
         */
        onDemand: boolean;
        /**
         * List of acceptable instance Operating Systems, the default is linux. Allowed values: linux, windows.
         */
        os: string[];
        resourceLimits?: outputs.config.NodeTemplateConstraintsResourceLimits;
        /**
         * Should include spot instances in the considered pool.
         */
        spot?: boolean;
        /**
         * Allowed node configuration price increase when diversifying instance types. E.g. if the value is 10%, then the overall price of diversified instance types can be 10% higher than the price of the optimal configuration.
         */
        spotDiversityPriceIncreaseLimitPercent?: number;
        /**
         * Enable/disable spot interruption predictions.
         */
        spotInterruptionPredictionsEnabled?: boolean;
        /**
         * Spot interruption predictions type. Can be either "aws-rebalance-recommendations" or "interruption-predictions".
         */
        spotInterruptionPredictionsType?: string;
        /**
         * Enable/disable spot reliability. When enabled, autoscaler will create instances with highest reliability score within price increase threshold.
         */
        spotReliabilityEnabled?: boolean;
        /**
         * Allowed node price increase when using spot reliability on ordering the instance types . E.g. if the value is 10%, then the overall price of instance types can be 10% higher than the price of the optimal configuration.
         */
        spotReliabilityPriceIncreaseLimitPercent?: number;
        /**
         * Storage optimized instance constraint (deprecated).
         */
        storageOptimized?: boolean;
        /**
         * Storage optimized instance constraint - will only pick storage optimized nodes if enabled and won't pick if disabled. Empty value will have no effect. Supported values: `enabled`, `disabled` or empty string.
         */
        storageOptimizedState?: string;
        /**
         * Spot instance fallback constraint - when true, on-demand instances will be created, when spots are unavailable.
         */
        useSpotFallbacks?: boolean;
    }
    interface NodeTemplateConstraintsCustomPriority {
        /**
         * Instance families to prioritize in this tier.
         */
        instanceFamilies?: string[];
        /**
         * If true, this tier will apply to on-demand instances.
         */
        onDemand?: boolean;
        /**
         * If true, this tier will apply to spot instances.
         */
        spot?: boolean;
    }
    interface NodeTemplateConstraintsDedicatedNodeAffinity {
        affinities?: outputs.config.NodeTemplateConstraintsDedicatedNodeAffinityAffinity[];
        /**
         * Availability zone name.
         */
        azName: string;
        /**
         * Instance/node types in this node group.
         */
        instanceTypes: string[];
        /**
         * Name of node group.
         */
        name: string;
    }
    interface NodeTemplateConstraintsDedicatedNodeAffinityAffinity {
        /**
         * Key of the node affinity selector.
         */
        key: string;
        /**
         * Operator of the node affinity selector. Allowed values: In, NotIn, Exists, DoesNotExist, Gt, Lt.
         */
        operator: string;
        /**
         * Values of the node affinity selector.
         */
        values: string[];
    }
    interface NodeTemplateConstraintsGpu {
        /**
         * Names of the GPUs to exclude.
         */
        excludeNames?: string[];
        /**
         * Instance families to include when filtering (excludes all other families).
         */
        includeNames?: string[];
        /**
         * Manufacturers of the gpus to select - NVIDIA, AMD.
         */
        manufacturers?: string[];
        /**
         * Max GPU count for the instance type to have.
         */
        maxCount?: number;
        /**
         * Min GPU count for the instance type to have.
         */
        minCount?: number;
    }
    interface NodeTemplateConstraintsInstanceFamilies {
        /**
         * Instance families to exclude when filtering (includes all other families).
         */
        excludes?: string[];
        /**
         * Instance families to include when filtering (excludes all other families).
         */
        includes?: string[];
    }
    interface NodeTemplateConstraintsResourceLimits {
        /**
         * Controls CPU limit enforcement for the node template.
         */
        cpuLimitEnabled?: boolean;
        /**
         * Specifies the maximum number of CPU cores that the nodes provisioned from this template can collectively have.
         */
        cpuLimitMaxCores?: number;
    }
    interface NodeTemplateCustomTaint {
        /**
         * Effect of a taint to be added to nodes created from this template, the default is NoSchedule. Allowed values: NoSchedule, NoExecute.
         */
        effect?: string;
        /**
         * Key of a taint to be added to nodes created from this template.
         */
        key: string;
        /**
         * Value of a taint to be added to nodes created from this template.
         */
        value?: string;
    }
    interface NodeTemplateGpu {
        /**
         * Defines default number of shared clients per GPU.
         */
        defaultSharedClientsPerGpu?: number;
        /**
         * Enable/disable GPU time-sharing.
         */
        enableTimeSharing?: boolean;
        /**
         * Defines GPU sharing configurations for GPU devices.
         */
        sharingConfigurations?: outputs.config.NodeTemplateGpuSharingConfiguration[];
    }
    interface NodeTemplateGpuSharingConfiguration {
        /**
         * GPU name.
         */
        gpuName: string;
        /**
         * Defines number of shared clients for specific GPU device.
         */
        sharedClientsPerGpu: number;
    }
}
export declare namespace iam {
    interface EnterpriseRoleBindingScopes {
        /**
         * Cluster scopes.
         */
        clusters?: outputs.iam.EnterpriseRoleBindingScopesCluster[];
        /**
         * Organization scopes.
         */
        organizations?: outputs.iam.EnterpriseRoleBindingScopesOrganization[];
    }
    interface EnterpriseRoleBindingScopesCluster {
        /**
         * Cluster ID.
         */
        id: string;
    }
    interface EnterpriseRoleBindingScopesOrganization {
        /**
         * Organization ID.
         */
        id: string;
    }
    interface EnterpriseRoleBindingSubjects {
        /**
         * Group subjects.
         */
        groups?: outputs.iam.EnterpriseRoleBindingSubjectsGroup[];
        /**
         * Service account subjects.
         */
        serviceAccounts?: outputs.iam.EnterpriseRoleBindingSubjectsServiceAccount[];
        /**
         * User subjects.
         */
        users?: outputs.iam.EnterpriseRoleBindingSubjectsUser[];
    }
    interface EnterpriseRoleBindingSubjectsGroup {
        /**
         * Group ID.
         */
        id: string;
    }
    interface EnterpriseRoleBindingSubjectsServiceAccount {
        /**
         * Service account ID.
         */
        id: string;
    }
    interface EnterpriseRoleBindingSubjectsUser {
        /**
         * User ID.
         */
        id: string;
    }
    interface RoleBindingsScope {
        /**
         * Scope of the role binding Supported values include: organization, cluster.
         */
        kind: string;
        /**
         * ID of the scope resource.
         */
        resourceId: string;
    }
    interface RoleBindingsSubject {
        subjects?: outputs.iam.RoleBindingsSubjectSubject[];
    }
    interface RoleBindingsSubjectSubject {
        /**
         * Optional, required only if `kind` is `group`.
         */
        groupId: string;
        /**
         * Kind of the subject. Supported values include: user, service_account, group.
         */
        kind: string;
        /**
         * Optional, required only if `kind` is `serviceAccount`.
         */
        serviceAccountId: string;
        /**
         * Optional, required only if `kind` is `user`.
         */
        userId: string;
    }
}
export declare namespace organization {
    interface EnterpriseGroupMember {
        /**
         * Group member configuration.
         */
        members?: outputs.organization.EnterpriseGroupMemberMember[];
    }
    interface EnterpriseGroupMemberMember {
        /**
         * Member UUID.
         */
        id: string;
        /**
         * Kind of the member. Supported values: user, service_account.
         */
        kind: string;
    }
    interface EnterpriseGroupRoleBinding {
        /**
         * Role binding configuration.
         */
        roleBindings?: outputs.organization.EnterpriseGroupRoleBindingRoleBinding[];
    }
    interface EnterpriseGroupRoleBindingRoleBinding {
        /**
         * Role binding ID assigned by the API.
         */
        id: string;
        /**
         * Role binding name.
         */
        name: string;
        /**
         * Role UUID.
         */
        roleId: string;
        /**
         * List of scopes for the role binding.
         */
        scopes: outputs.organization.EnterpriseGroupRoleBindingRoleBindingScope[];
    }
    interface EnterpriseGroupRoleBindingRoleBindingScope {
        /**
         * Scope configuration.
         */
        scopes?: outputs.organization.EnterpriseGroupRoleBindingRoleBindingScopeScope[];
    }
    interface EnterpriseGroupRoleBindingRoleBindingScopeScope {
        /**
         * Cluster ID scope.
         */
        cluster?: string;
        /**
         * Organization ID scope.
         */
        organization?: string;
    }
    interface OrganizationGroupMember {
        members?: outputs.organization.OrganizationGroupMemberMember[];
    }
    interface OrganizationGroupMemberMember {
        email: string;
        id: string;
        /**
         * Kind of the member. Supported values include: user, service_account.
         */
        kind: string;
    }
    interface SSOConnectionAad {
        /**
         * Azure AD domain
         */
        adDomain: string;
        /**
         * Azure AD client ID
         */
        clientId: string;
        /**
         * Azure AD client secret
         */
        clientSecret: string;
    }
    interface SSOConnectionOkta {
        /**
         * Okta client ID
         */
        clientId: string;
        /**
         * Okta client secret
         */
        clientSecret: string;
        /**
         * Okta domain
         */
        oktaDomain: string;
    }
    interface ServiceAccountAuthor {
        email: string;
        id: string;
        kind: string;
    }
}
export declare namespace rebalancing {
    interface GetHibernationScheduleDataSourceClusterAssignment {
        assignments?: outputs.rebalancing.GetHibernationScheduleDataSourceClusterAssignmentAssignment[];
    }
    interface GetHibernationScheduleDataSourceClusterAssignmentAssignment {
        /**
         * ID of the cluster.
         */
        clusterId: string;
    }
    interface GetHibernationScheduleDataSourcePauseConfig {
        /**
         * Enables or disables the pause configuration.
         */
        enabled: boolean;
        schedule: outputs.rebalancing.GetHibernationScheduleDataSourcePauseConfigSchedule;
    }
    interface GetHibernationScheduleDataSourcePauseConfigSchedule {
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
        cronExpression: string;
    }
    interface GetHibernationScheduleDataSourceResumeConfig {
        /**
         * Enables or disables the pause configuration.
         */
        enabled: boolean;
        jobConfig: outputs.rebalancing.GetHibernationScheduleDataSourceResumeConfigJobConfig;
        schedule: outputs.rebalancing.GetHibernationScheduleDataSourceResumeConfigSchedule;
    }
    interface GetHibernationScheduleDataSourceResumeConfigJobConfig {
        nodeConfig: outputs.rebalancing.GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfig;
    }
    interface GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfig {
        /**
         * ID reference of Node Configuration to be used for node creation. Supersedes 'config_name' parameter.
         */
        configId?: string;
        /**
         * Name reference of Node Configuration to be used for node creation. Superseded if 'config_id' parameter is provided.
         */
        configName?: string;
        gpuConfig?: outputs.rebalancing.GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigGpuConfig;
        /**
         * Instance type.
         */
        instanceType: string;
        /**
         * Custom labels to be added to the node.
         */
        kubernetesLabels?: {
            [key: string]: string;
        };
        /**
         * Custom taints to be added to the node created from this configuration.
         */
        kubernetesTaints?: outputs.rebalancing.GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigKubernetesTaint[];
        /**
         * Custom taints to be added to the node created from this configuration.
         */
        nodeAffinities?: outputs.rebalancing.GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigNodeAffinity[];
        /**
         * Custom taints to be added to the node created from this configuration.
         */
        spotConfigs?: outputs.rebalancing.GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigSpotConfig[];
        /**
         * Node subnet ID.
         */
        subnetId?: string;
        volumes?: outputs.rebalancing.GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigVolume[];
        /**
         * Zone of the node.
         */
        zone?: string;
    }
    interface GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigGpuConfig {
        /**
         * Number of GPUs.
         */
        count: number;
        /**
         * GPU type.
         */
        type?: string;
    }
    interface GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigKubernetesTaint {
        /**
         * Effect of a taint to be added to nodes created from this template, the default is NoSchedule. Allowed values: NoSchedule, NoExecute.
         */
        effect?: string;
        /**
         * Key of a taint to be added to nodes created from this template.
         */
        key: string;
        /**
         * Value of a taint to be added to nodes created from this template.
         */
        value?: string;
    }
    interface GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigNodeAffinity {
        affinities?: outputs.rebalancing.GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigNodeAffinityAffinity[];
        /**
         * Key of a taint to be added to nodes created from this template.
         */
        dedicatedGroup: string;
    }
    interface GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigNodeAffinityAffinity {
        /**
         * Key of the node affinity selector.
         */
        key: string;
        /**
         * Operator of the node affinity selector. Allowed values: DOES_NOT_EXIST, EXISTS, GT, IN, LT, NOT_IN.
         */
        operator: string;
        /**
         * Values of the node affinity selector.
         */
        values: string[];
    }
    interface GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigSpotConfig {
        /**
         * Spot instance price. Applicable only for AWS nodes.
         */
        priceHourly?: string;
        /**
         * Whether node should be created as spot instance.
         */
        spot?: boolean;
    }
    interface GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigVolume {
        raidConfigs?: outputs.rebalancing.GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigVolumeRaidConfig[];
        /**
         * Volume size in GiB.
         */
        sizeGib?: number;
    }
    interface GetHibernationScheduleDataSourceResumeConfigJobConfigNodeConfigVolumeRaidConfig {
        /**
         * Specify the RAID0 chunk size in kilobytes, this parameter affects the read/write in the disk array and must be tailored for the type of data written by the workloads in the node. If not provided it will default to 64KB
         */
        chunkSizeKb?: number;
    }
    interface GetHibernationScheduleDataSourceResumeConfigSchedule {
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
        cronExpression: string;
    }
    interface GetRebalancingScheduleDataSourceLaunchConfiguration {
        /**
         * When enabled rebalancing will also consider problematic pods (pods without controller, job pods, pods with removal-disabled annotation) as not-problematic.
         */
        aggressiveMode?: boolean;
        /**
         * Advanced configuration for aggressive rebalancing mode.
         */
        aggressiveModeConfig?: outputs.rebalancing.GetRebalancingScheduleDataSourceLaunchConfigurationAggressiveModeConfig;
        executionConditions?: outputs.rebalancing.GetRebalancingScheduleDataSourceLaunchConfigurationExecutionConditions;
        /**
         * Defines whether the nodes that failed to get drained until a predefined timeout, will be kept with a rebalancing.cast.ai/status=drain-failed annotation instead of forcefully drained.
         */
        keepDrainTimeoutNodes?: boolean;
        /**
         * Specifies amount of time since node creation before the node is allowed to be considered for automated rebalancing.
         */
        nodeTtlSeconds?: number;
        /**
         * Maximum number of nodes that will be selected for rebalancing.
         */
        numTargetedNodes?: number;
        /**
         * Minimum number of nodes that should be kept in the cluster after rebalancing.
         */
        rebalancingMinNodes?: number;
        /**
         * Node selector in JSON format.
         */
        selector?: string;
        /**
         * Defines the algorithm used to select the target nodes for rebalancing.
         */
        targetNodeSelectionAlgorithm?: string;
    }
    interface GetRebalancingScheduleDataSourceLaunchConfigurationAggressiveModeConfig {
        /**
         * Rebalance workloads that use local-path Persistent Volumes. THIS WILL RESULT IN DATA LOSS.
         */
        ignoreLocalPersistentVolumes: boolean;
        /**
         * Pods spawned by Jobs or CronJobs will not prevent the Rebalancer from deleting a node on which they run. WARNING: When true, pods spawned by Jobs or CronJobs will be terminated if the Rebalancer picks a node that runs them. As such, they are likely to lose their progress.
         */
        ignoreProblemJobPods: boolean;
        /**
         * Pods that don't have a controller (bare pods) will not prevent the Rebalancer from deleting a node on which they run. WARNING: When true, such pods might not restart, since they have no controller to do it.
         */
        ignoreProblemPodsWithoutController: boolean;
        /**
         * Pods that are marked with "removal disabled" will not prevent the Rebalancer from deleting a node on which they run. WARNING: When true, such pods will be evicted and disrupted.
         */
        ignoreProblemRemovalDisabledPods: boolean;
    }
    interface GetRebalancingScheduleDataSourceLaunchConfigurationExecutionConditions {
        /**
         * The percentage of the predicted savings that must be achieved in order to fully execute the plan.If the savings are not achieved after creating the new nodes, the plan will fail and delete the created nodes.
         */
        achievedSavingsPercentage?: number;
        /**
         * Enables or disables the execution conditions.
         */
        enabled: boolean;
    }
    interface GetRebalancingScheduleDataSourceSchedule {
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
        cron: string;
    }
    interface GetRebalancingScheduleDataSourceTriggerCondition {
        /**
         * If true, the savings percentage will be ignored and the rebalancing will be triggered regardless of the savings percentage.
         */
        ignoreSavings?: boolean;
        /**
         * Defines the minimum percentage of savings expected.
         */
        savingsPercentage: number;
    }
    interface HibernationScheduleClusterAssignments {
        assignments?: outputs.rebalancing.HibernationScheduleClusterAssignmentsAssignment[];
    }
    interface HibernationScheduleClusterAssignmentsAssignment {
        /**
         * ID of the cluster.
         */
        clusterId: string;
    }
    interface HibernationSchedulePauseConfig {
        /**
         * Enables or disables the pause configuration.
         */
        enabled: boolean;
        schedule: outputs.rebalancing.HibernationSchedulePauseConfigSchedule;
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
        cronExpression: string;
    }
    interface HibernationScheduleResumeConfig {
        /**
         * Enables or disables the pause configuration.
         */
        enabled: boolean;
        jobConfig: outputs.rebalancing.HibernationScheduleResumeConfigJobConfig;
        schedule: outputs.rebalancing.HibernationScheduleResumeConfigSchedule;
    }
    interface HibernationScheduleResumeConfigJobConfig {
        nodeConfig: outputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfig;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfig {
        /**
         * ID reference of Node Configuration to be used for node creation. Supersedes 'config_name' parameter.
         */
        configId?: string;
        /**
         * Name reference of Node Configuration to be used for node creation. Superseded if 'config_id' parameter is provided.
         */
        configName?: string;
        gpuConfig?: outputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigGpuConfig;
        /**
         * Instance type.
         */
        instanceType: string;
        /**
         * Custom labels to be added to the node.
         */
        kubernetesLabels?: {
            [key: string]: string;
        };
        /**
         * Custom taints to be added to the node created from this configuration.
         */
        kubernetesTaints?: outputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigKubernetesTaint[];
        /**
         * Custom taints to be added to the node created from this configuration.
         */
        nodeAffinities?: outputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigNodeAffinity[];
        /**
         * Custom taints to be added to the node created from this configuration.
         */
        spotConfigs?: outputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigSpotConfig[];
        /**
         * Node subnet ID.
         */
        subnetId?: string;
        volumes?: outputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigVolume[];
        /**
         * Zone of the node.
         */
        zone?: string;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigGpuConfig {
        /**
         * Number of GPUs.
         */
        count: number;
        /**
         * GPU type.
         */
        type?: string;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigKubernetesTaint {
        /**
         * Effect of a taint to be added to nodes created from this template, the default is NoSchedule. Allowed values: NoSchedule, NoExecute.
         */
        effect?: string;
        /**
         * Key of a taint to be added to nodes created from this template.
         */
        key: string;
        /**
         * Value of a taint to be added to nodes created from this template.
         */
        value?: string;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigNodeAffinity {
        affinities?: outputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigNodeAffinityAffinity[];
        /**
         * Key of a taint to be added to nodes created from this template.
         */
        dedicatedGroup: string;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigNodeAffinityAffinity {
        /**
         * Key of the node affinity selector.
         */
        key: string;
        /**
         * Operator of the node affinity selector. Allowed values: DOES_NOT_EXIST, EXISTS, GT, IN, LT, NOT_IN.
         */
        operator: string;
        /**
         * Values of the node affinity selector.
         */
        values: string[];
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigSpotConfig {
        /**
         * Spot instance price. Applicable only for AWS nodes.
         */
        priceHourly?: string;
        /**
         * Whether node should be created as spot instance.
         */
        spot?: boolean;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigVolume {
        raidConfigs?: outputs.rebalancing.HibernationScheduleResumeConfigJobConfigNodeConfigVolumeRaidConfig[];
        /**
         * Volume size in GiB.
         */
        sizeGib?: number;
    }
    interface HibernationScheduleResumeConfigJobConfigNodeConfigVolumeRaidConfig {
        /**
         * Specify the RAID0 chunk size in kilobytes, this parameter affects the read/write in the disk array and must be tailored for the type of data written by the workloads in the node. If not provided it will default to 64KB
         */
        chunkSizeKb?: number;
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
        cronExpression: string;
    }
    interface RebalancingScheduleLaunchConfiguration {
        /**
         * When enabled rebalancing will also consider problematic pods (pods without controller, job pods, pods with removal-disabled annotation) as not-problematic.
         */
        aggressiveMode?: boolean;
        /**
         * Advanced configuration for aggressive rebalancing mode.
         */
        aggressiveModeConfig?: outputs.rebalancing.RebalancingScheduleLaunchConfigurationAggressiveModeConfig;
        executionConditions?: outputs.rebalancing.RebalancingScheduleLaunchConfigurationExecutionConditions;
        /**
         * Defines whether the nodes that failed to get drained until a predefined timeout, will be kept with a rebalancing.cast.ai/status=drain-failed annotation instead of forcefully drained.
         */
        keepDrainTimeoutNodes?: boolean;
        /**
         * Specifies amount of time since node creation before the node is allowed to be considered for automated rebalancing.
         */
        nodeTtlSeconds?: number;
        /**
         * Maximum number of nodes that will be selected for rebalancing.
         */
        numTargetedNodes?: number;
        /**
         * Minimum number of nodes that should be kept in the cluster after rebalancing.
         */
        rebalancingMinNodes?: number;
        /**
         * Node selector in JSON format.
         */
        selector?: string;
        /**
         * Defines the algorithm used to select the target nodes for rebalancing.
         */
        targetNodeSelectionAlgorithm?: string;
    }
    interface RebalancingScheduleLaunchConfigurationAggressiveModeConfig {
        /**
         * Rebalance workloads that use local-path Persistent Volumes. THIS WILL RESULT IN DATA LOSS.
         */
        ignoreLocalPersistentVolumes: boolean;
        /**
         * Pods spawned by Jobs or CronJobs will not prevent the Rebalancer from deleting a node on which they run. WARNING: When true, pods spawned by Jobs or CronJobs will be terminated if the Rebalancer picks a node that runs them. As such, they are likely to lose their progress.
         */
        ignoreProblemJobPods: boolean;
        /**
         * Pods that don't have a controller (bare pods) will not prevent the Rebalancer from deleting a node on which they run. WARNING: When true, such pods might not restart, since they have no controller to do it.
         */
        ignoreProblemPodsWithoutController: boolean;
        /**
         * Pods that are marked with "removal disabled" will not prevent the Rebalancer from deleting a node on which they run. WARNING: When true, such pods will be evicted and disrupted.
         */
        ignoreProblemRemovalDisabledPods: boolean;
    }
    interface RebalancingScheduleLaunchConfigurationExecutionConditions {
        /**
         * The percentage of the predicted savings that must be achieved in order to fully execute the plan.If the savings are not achieved after creating the new nodes, the plan will fail and delete the created nodes.
         */
        achievedSavingsPercentage?: number;
        /**
         * Enables or disables the execution conditions.
         */
        enabled: boolean;
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
        cron: string;
    }
    interface RebalancingScheduleTriggerConditions {
        /**
         * If true, the savings percentage will be ignored and the rebalancing will be triggered regardless of the savings percentage.
         */
        ignoreSavings?: boolean;
        /**
         * Defines the minimum percentage of savings expected.
         */
        savingsPercentage: number;
    }
}
export declare namespace workload {
    interface WorkloadScalingPolicyAntiAffinity {
        /**
         * Defines if anti-affinity should be considered when scaling the workload.
         * 	If enabled, requiring host ports, or having anti-affinity on hostname will force all recommendations to be deferred.
         */
        considerAntiAffinity?: boolean;
    }
    interface WorkloadScalingPolicyAssignmentRule {
        rules: outputs.workload.WorkloadScalingPolicyAssignmentRuleRule[];
    }
    interface WorkloadScalingPolicyAssignmentRuleRule {
        /**
         * Allows assigning a scaling policy based on the workload's namespace.
         */
        namespace?: outputs.workload.WorkloadScalingPolicyAssignmentRuleRuleNamespace;
        /**
         * Allows assigning a scaling policy based on the workload's metadata.
         */
        workload?: outputs.workload.WorkloadScalingPolicyAssignmentRuleRuleWorkload;
    }
    interface WorkloadScalingPolicyAssignmentRuleRuleNamespace {
        /**
         * Defines matching by namespace names.
         */
        names?: string[];
    }
    interface WorkloadScalingPolicyAssignmentRuleRuleWorkload {
        /**
         * Group, version, and kind for Kubernetes resources. Format: kind[.version][.group].
         * It can be either:
         *  - only kind, e.g. "Deployment"
         *  - group and kind: e.g."Deployment.apps"
         *  - group, version and kind: e.g."Deployment.v1.apps"
         */
        gvks?: string[];
        /**
         * Defines matching by label selector requirements.
         */
        labelsExpressions?: outputs.workload.WorkloadScalingPolicyAssignmentRuleRuleWorkloadLabelsExpression[];
    }
    interface WorkloadScalingPolicyAssignmentRuleRuleWorkloadLabelsExpression {
        /**
         * The label key to match. Required for all operators except `Regex` and `Contains`. If not specified, it will search through all labels.
         */
        key?: string;
        /**
         * The operator to use for matching the label.
         */
        operator: string;
        /**
         * A list of values to match against the label key. It is required for `In`, `NotIn`, `Regex`, and `Contains` operators.
         */
        values?: string[];
    }
    interface WorkloadScalingPolicyConfidence {
        /**
         * Defines the confidence threshold for applying recommendations. The smaller number indicates that we require fewer metrics data points to apply recommendations - changing this value can cause applying less precise recommendations. Do not change the default unless you want to optimize with fewer data points (e.g., short-lived workloads).
         */
        threshold?: number;
    }
    interface WorkloadScalingPolicyCpu {
        /**
         * The threshold of when to apply the recommendation. Recommendation will be applied when diff of current requests and new recommendation is greater than set value
         *
         * @deprecated Use applyThresholdStrategy instead
         */
        applyThreshold?: number;
        /**
         * Resource apply threshold strategy settings. The default strategy is `PERCENTAGE` with percentage value set to 0.1.
         */
        applyThresholdStrategy?: outputs.workload.WorkloadScalingPolicyCpuApplyThresholdStrategy;
        /**
         * The arguments for the function - i.e. for `QUANTILE` this should be a [0, 1] float. `MAX` doesn't accept any args
         */
        args?: string;
        /**
         * The function used to calculate the resource recommendation. Supported values: `QUANTILE`, `MAX`
         */
        function?: string;
        /**
         * Resource limit settings
         */
        limit?: outputs.workload.WorkloadScalingPolicyCpuLimit;
        /**
         * The look back period in seconds for the recommendation.
         */
        lookBackPeriodSeconds?: number;
        /**
         * Disables management for a single resource when set to `READ_ONLY`. The resource will use its original workload template requests and limits. Supported value: `READ_ONLY`. Minimum required workload-autoscaler version: `v0.23.1`.
         */
        managementOption?: string;
        /**
         * Max values for the recommendation, applies to every container. For memory - this is in MiB, for CPU - this is in cores.
         */
        max?: number;
        /**
         * Min values for the recommendation, applies to every container. For memory - this is in MiB, for CPU - this is in cores.
         */
        min?: number;
        /**
         * Overhead for the recommendation, e.g. `0.1` will result in 10% higher recommendation
         */
        overhead?: number;
    }
    interface WorkloadScalingPolicyCpuApplyThresholdStrategy {
        /**
         * If denominator is close or equal to 0, the threshold will be much bigger for small values.For example when numerator, exponent is 1 and denominator is 0 the threshold for 0.5 req. CPU will be 200%.It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        denominator?: string;
        /**
         * The exponent changes how fast the curve is going down. The smaller value will cause that we won’t pick extremely small number for big resources, for example:
         * 	- if numerator is 0, denominator is 1, and exponent is 1, for 50 CPU we will pick 2% threshold
         * 	- if numerator is 0, denominator is 1, and exponent is 0.8, for 50 CPU we will pick 4.3% threshold
         * 	It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        exponent?: number;
        /**
         * The numerator affects vertical stretch of function used in adaptive threshold - smaller number will create smaller threshold.It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        numerator?: number;
        /**
         * Percentage of a how much difference should there be between the current pod requests and the new recommendation. It must be defined for the PERCENTAGE strategy.
         */
        percentage?: number;
        /**
         * Defines apply theshold strategy type.
         * 	- PERCENTAGE - recommendation will be applied when diff of current requests and new recommendation is greater than set value
         *     - DEFAULT_ADAPTIVE - will pick larger threshold percentage for small workloads and smaller percentage for large workloads.
         *     - CUSTOM_ADAPTIVE - works in same way as DEFAULT_ADAPTIVE, but it allows to tweak parameters of adaptive threshold formula: percentage = numerator/(currentRequest + denominator)^exponent. This strategy is for advance use cases, we recommend to use DEFAULT_ADAPTIVE strategy.
         */
        type: string;
    }
    interface WorkloadScalingPolicyCpuLimit {
        /**
         * Multiplier used to calculate the resource limit. It must be defined for the MULTIPLIER strategy.
         */
        multiplier?: number;
        /**
         * Defines limit strategy type.
         * 	- NO_LIMIT - removes the resource limit even if it was specified in the workload spec.
         * 	- KEEP_LIMITS - keep existing resource limits. While limits provide stability predictability, they may restrict workloads that need to temporarily burst beyond their allocation.
         * 	- MULTIPLIER - used to calculate the resource limit. The final value is determined by multiplying the resource request by the specified factor.
         */
        type: string;
    }
    interface WorkloadScalingPolicyDownscaling {
        /**
         * Defines the apply type to be used when downscaling.
         * 	- IMMEDIATE - pods are restarted immediately when new recommendation is generated.
         * 	- DEFERRED - pods are not restarted and recommendation values are applied during natural restarts only (new deployment, etc.)
         */
        applyType?: string;
    }
    interface WorkloadScalingPolicyMemory {
        /**
         * The threshold of when to apply the recommendation. Recommendation will be applied when diff of current requests and new recommendation is greater than set value
         *
         * @deprecated Use applyThresholdStrategy instead
         */
        applyThreshold?: number;
        /**
         * Resource apply threshold strategy settings. The default strategy is `PERCENTAGE` with percentage value set to 0.1.
         */
        applyThresholdStrategy?: outputs.workload.WorkloadScalingPolicyMemoryApplyThresholdStrategy;
        /**
         * The arguments for the function - i.e. for `QUANTILE` this should be a [0, 1] float. `MAX` doesn't accept any args
         */
        args?: string;
        /**
         * The function used to calculate the resource recommendation. Supported values: `QUANTILE`, `MAX`
         */
        function?: string;
        /**
         * Resource limit settings
         */
        limit?: outputs.workload.WorkloadScalingPolicyMemoryLimit;
        /**
         * The look back period in seconds for the recommendation.
         */
        lookBackPeriodSeconds?: number;
        /**
         * Disables management for a single resource when set to `READ_ONLY`. The resource will use its original workload template requests and limits. Supported value: `READ_ONLY`. Minimum required workload-autoscaler version: `v0.23.1`.
         */
        managementOption?: string;
        /**
         * Max values for the recommendation, applies to every container. For memory - this is in MiB, for CPU - this is in cores.
         */
        max?: number;
        /**
         * Min values for the recommendation, applies to every container. For memory - this is in MiB, for CPU - this is in cores.
         */
        min?: number;
        /**
         * Overhead for the recommendation, e.g. `0.1` will result in 10% higher recommendation
         */
        overhead?: number;
    }
    interface WorkloadScalingPolicyMemoryApplyThresholdStrategy {
        /**
         * If denominator is close or equal to 0, the threshold will be much bigger for small values.For example when numerator, exponent is 1 and denominator is 0 the threshold for 0.5 req. CPU will be 200%.It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        denominator?: string;
        /**
         * The exponent changes how fast the curve is going down. The smaller value will cause that we won’t pick extremely small number for big resources, for example:
         * 	- if numerator is 0, denominator is 1, and exponent is 1, for 50 CPU we will pick 2% threshold
         * 	- if numerator is 0, denominator is 1, and exponent is 0.8, for 50 CPU we will pick 4.3% threshold
         * 	It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        exponent?: number;
        /**
         * The numerator affects vertical stretch of function used in adaptive threshold - smaller number will create smaller threshold.It must be defined for the CUSTOM_ADAPTIVE strategy.
         */
        numerator?: number;
        /**
         * Percentage of a how much difference should there be between the current pod requests and the new recommendation. It must be defined for the PERCENTAGE strategy.
         */
        percentage?: number;
        /**
         * Defines apply theshold strategy type.
         * 	- PERCENTAGE - recommendation will be applied when diff of current requests and new recommendation is greater than set value
         *     - DEFAULT_ADAPTIVE - will pick larger threshold percentage for small workloads and smaller percentage for large workloads.
         *     - CUSTOM_ADAPTIVE - works in same way as DEFAULT_ADAPTIVE, but it allows to tweak parameters of adaptive threshold formula: percentage = numerator/(currentRequest + denominator)^exponent. This strategy is for advance use cases, we recommend to use DEFAULT_ADAPTIVE strategy.
         */
        type: string;
    }
    interface WorkloadScalingPolicyMemoryEvent {
        /**
         * Defines the apply type to be used when applying recommendation for memory related event.
         * 	- IMMEDIATE - pods are restarted immediately when new recommendation is generated.
         * 	- DEFERRED - pods are not restarted and recommendation values are applied during natural restarts only (new deployment, etc.)
         */
        applyType?: string;
    }
    interface WorkloadScalingPolicyMemoryLimit {
        /**
         * Multiplier used to calculate the resource limit. It must be defined for the MULTIPLIER strategy.
         */
        multiplier?: number;
        /**
         * Defines limit strategy type.
         * 	- NO_LIMIT - removes the resource limit even if it was specified in the workload spec.
         * 	- KEEP_LIMITS - keep existing resource limits. While limits provide stability predictability, they may restrict workloads that need to temporarily burst beyond their allocation.
         * 	- MULTIPLIER - used to calculate the resource limit. The final value is determined by multiplying the resource request by the specified factor.
         */
        type: string;
    }
    interface WorkloadScalingPolicyPredictiveScaling {
        /**
         * Defines predictive scaling resource configuration.
         */
        cpu?: outputs.workload.WorkloadScalingPolicyPredictiveScalingCpu;
    }
    interface WorkloadScalingPolicyPredictiveScalingCpu {
        /**
         * Defines if predictive scaling is enabled for resource.
         */
        enabled: boolean;
    }
    interface WorkloadScalingPolicyRolloutBehavior {
        /**
         * Defines if pods should be restarted one by one to avoid service disruption.
         */
        preferOneByOne?: boolean;
        /**
         * Defines the rollout type to be used when applying recommendations.
         * 	- NO_DISRUPTION - pods are restarted without causing service disruption.
         */
        type?: string;
    }
    interface WorkloadScalingPolicyStartup {
        /**
         * Defines the duration (in seconds) during which elevated resource usage is expected at startup.
         * When set, recommendations will be adjusted to disregard resource spikes within this period.
         * If not specified, the workload will receive standard recommendations without startup considerations.
         */
        periodSeconds?: number;
    }
}
