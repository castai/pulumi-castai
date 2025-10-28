/**
 * CastAiGkeCluster - High-level Component Resource
 *
 * This component provides a batteries-included approach to connecting a GKE cluster
 * to CAST AI, similar to the Terraform castai/gke-cluster module.
 *
 * It handles:
 * - Phase 1: Cluster registration and agent installation
 * - Phase 2: IAM setup (service accounts, custom roles)
 * - Phase 2: Full management (controller, spot-handler, evictor, pod-pinner)
 * - Node configurations and templates
 * - Autoscaler policies (optional)
 *
 * Example usage:
 *
 * ```typescript
 * const cluster = new CastAiGkeCluster("my-cluster", {
 *     clusterName: "my-gke-cluster",
 *     location: "us-central1-a",
 *     projectId: "my-project-id",
 *     subnets: ["default"],
 *     networkTags: ["castai-managed"],
 * });
 * ```
 */

import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";
import * as castai from "@castai/pulumi";
import { GkeIamResources } from "./gkeIamResources";

export interface CastAiGkeClusterArgs {
    /**
     * Name of the GKE cluster to connect to CAST AI
     */
    clusterName: string;

    /**
     * GCP location (zone for zonal clusters, region for regional clusters)
     * Examples: "us-central1-a" (zonal), "us-central1" (regional)
     */
    location: string;

    /**
     * GCP project ID
     */
    projectId: pulumi.Input<string>;

    /**
     * CAST AI API URL (optional, defaults to https://api.cast.ai)
     */
    apiUrl?: pulumi.Input<string>;

    /**
     * CAST AI API token (required)
     */
    apiToken: pulumi.Input<string>;

    /**
     * Read-only mode: Only install agent for monitoring, skip full management (Phase 2)
     * Default: false (full management enabled)
     */
    readOnlyMode?: pulumi.Input<boolean>;

    /**
     * Subnet names for CAST AI provisioned nodes
     * Required when readOnlyMode is false
     */
    subnets?: pulumi.Input<pulumi.Input<string>[]>;

    /**
     * Network tags for CAST AI provisioned nodes
     * Required when readOnlyMode is false
     */
    networkTags?: pulumi.Input<pulumi.Input<string>[]>;

    /**
     * Should CAST AI remove nodes on disconnect (default: false)
     */
    deleteNodesOnDisconnect?: pulumi.Input<boolean>;

    /**
     * Install workload autoscaler (default: false)
     */
    installWorkloadAutoscaler?: pulumi.Input<boolean>;

    /**
     * Install security agent (default: false)
     */
    installSecurityAgent?: pulumi.Input<boolean>;

    /**
     * Kubernetes provider (optional, will be created if not provided)
     */
    k8sProvider?: k8s.Provider;

    /**
     * Additional labels to apply to CAST AI provisioned nodes
     */
    tags?: pulumi.Input<{ [key: string]: pulumi.Input<string> }>;
}

export class CastAiGkeCluster extends pulumi.ComponentResource {
    public readonly clusterId: pulumi.Output<string>;
    public readonly clusterToken: pulumi.Output<string>;
    public readonly credentialsId: pulumi.Output<string>;
    public readonly serviceAccountEmail?: pulumi.Output<string>;
    public readonly serviceAccountKey?: pulumi.Output<string>;

    constructor(name: string, args: CastAiGkeClusterArgs, opts?: pulumi.ComponentResourceOptions) {
        super("castai:gke:CastAiGkeCluster", name, {}, opts);

        const componentOpts = { parent: this };
        const apiUrl = args.apiUrl || "https://api.cast.ai";
        const readOnlyMode = args.readOnlyMode || false;

        // Validate required arguments for full management mode
        if (!readOnlyMode) {
            if (!args.subnets) {
                throw new Error("subnets is required when readOnlyMode is false");
            }
            if (!args.networkTags) {
                throw new Error("networkTags is required when readOnlyMode is false");
            }
        }

        // Create CAST AI provider
        const castaiProvider = new castai.Provider(`${name}-provider`, {
            apiToken: args.apiToken,
            apiUrl: apiUrl,
        }, componentOpts);

        // Get GKE cluster information
        const gkeCluster = pulumi.output(args.projectId).apply(projectId =>
            gcp.container.getCluster({
                name: args.clusterName,
                location: args.location,
                project: projectId,
            })
        );

        // =================================================================
        // Phase 1: Register Cluster
        // =================================================================

        const castaiClusterPhase1 = new castai.GkeCluster(`${name}-phase1`, {
            projectId: args.projectId,
            location: args.location,
            name: args.clusterName,
        }, { provider: castaiProvider, ...componentOpts });

        this.clusterId = castaiClusterPhase1.id;
        this.clusterToken = castaiClusterPhase1.clusterToken;
        this.credentialsId = castaiClusterPhase1.credentialsId;

        // =================================================================
        // Kubernetes Provider
        // =================================================================

        const k8sProvider = args.k8sProvider || new k8s.Provider(`${name}-k8s`, {
            kubeconfig: gkeCluster.apply(cluster => {
                const context = pulumi.interpolate`gke_${args.projectId}_${args.location}_${args.clusterName}`;

                return pulumi.interpolate`apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority-data: ${cluster.masterAuths[0].clusterCaCertificate}
    server: https://${cluster.endpoint}
  name: ${context}
contexts:
- context:
    cluster: ${context}
    user: ${context}
  name: ${context}
current-context: ${context}
users:
- name: ${context}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: gke-gcloud-auth-plugin
      installHint: Install gke-gcloud-auth-plugin for kubectl by following https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_plugin
      provideClusterInfo: true
`;
            }),
        }, componentOpts);

        // =================================================================
        // Install Agent (Phase 1)
        // =================================================================

        new k8s.helm.v3.Release(`${name}-agent`, {
            name: "castai-agent",
            chart: "castai-agent",
            repositoryOpts: {
                repo: "https://castai.github.io/helm-charts",
            },
            namespace: "castai-agent",
            createNamespace: true,
            cleanupOnFail: true,
            timeout: 300,
            skipAwait: false,
            values: {
                provider: "gke",
                createNamespace: false,
                apiURL: apiUrl,
                apiKey: this.clusterToken,
            },
        }, {
            provider: k8sProvider,
            dependsOn: [castaiClusterPhase1],
            ...componentOpts,
        });

        // =================================================================
        // Phase 2: Full Management (Skip in Read-Only Mode)
        // =================================================================

        if (!readOnlyMode) {
            // Create IAM resources
            const iamResources = new GkeIamResources(`${name}-iam`, {
                clusterName: args.clusterName,
                projectId: args.projectId,
                location: args.location,
                clusterId: this.clusterId,
            }, componentOpts);

            this.serviceAccountEmail = iamResources.serviceAccountEmail;
            this.serviceAccountKey = iamResources.serviceAccountKey;

            // Update cluster with IAM credentials (Phase 2)
            const gkeClusterConnection = new castai.GkeCluster(`${name}-connection`, {
                projectId: args.projectId,
                location: args.location,
                name: args.clusterName,
                credentialsJson: this.serviceAccountKey,
                deleteNodesOnDisconnect: args.deleteNodesOnDisconnect || false,
            }, {
                provider: castaiProvider,
                dependsOn: [castaiClusterPhase1, iamResources],
                ...componentOpts,
            });

            // Create default node configuration with network tags and subnets
            const defaultNodeConfig = new castai.config.NodeConfiguration(`${name}-node-config-default`, {
                clusterId: this.clusterId,
                name: "default",
                subnets: args.subnets!,
                tags: args.tags,
                gke: {
                    diskType: "pd-standard",
                    networkTags: args.networkTags,
                    maxPodsPerNode: 110,
                },
            }, {
                provider: castaiProvider,
                dependsOn: [gkeClusterConnection, iamResources],
                ...componentOpts,
            });

            // Set as default node configuration
            new castai.config.NodeConfigurationDefault(`${name}-node-config-default-ref`, {
                clusterId: this.clusterId,
                configurationId: defaultNodeConfig.id,
            }, {
                provider: castaiProvider,
                dependsOn: [defaultNodeConfig],
                ...componentOpts,
            });

            // Install cluster controller (Phase 2)
            new k8s.helm.v3.Release(`${name}-controller`, {
                name: "cluster-controller",
                chart: "castai-cluster-controller",
                repositoryOpts: {
                    repo: "https://castai.github.io/helm-charts",
                },
                namespace: "castai-agent",
                createNamespace: false,
                cleanupOnFail: true,
                timeout: 300,
                skipAwait: true,
                values: {
                    castai: {
                        clusterID: this.clusterId,
                        apiURL: apiUrl,
                        apiKey: args.apiToken,
                    },
                },
            }, {
                provider: k8sProvider,
                dependsOn: [gkeClusterConnection],
                ...componentOpts,
            });

            // Install spot handler
            new k8s.helm.v3.Release(`${name}-spot-handler`, {
                name: "castai-spot-handler",
                chart: "castai-spot-handler",
                repositoryOpts: {
                    repo: "https://castai.github.io/helm-charts",
                },
                namespace: "castai-agent",
                createNamespace: false,
                cleanupOnFail: true,
                timeout: 300,
                skipAwait: true,
                values: {
                    castai: {
                        clusterID: this.clusterId,
                        provider: "gke",
                    },
                },
            }, {
                provider: k8sProvider,
                dependsOn: [gkeClusterConnection],
                ...componentOpts,
            });

            // Install evictor
            new k8s.helm.v3.Release(`${name}-evictor`, {
                name: "castai-evictor",
                chart: "castai-evictor",
                repositoryOpts: {
                    repo: "https://castai.github.io/helm-charts",
                },
                namespace: "castai-agent",
                createNamespace: false,
                cleanupOnFail: true,
                timeout: 300,
                skipAwait: true,
                values: {
                    replicaCount: 0,
                },
            }, {
                provider: k8sProvider,
                dependsOn: [gkeClusterConnection],
                ...componentOpts,
            });

            // Install pod pinner
            new k8s.helm.v3.Release(`${name}-pod-pinner`, {
                name: "castai-pod-pinner",
                chart: "castai-pod-pinner",
                repositoryOpts: {
                    repo: "https://castai.github.io/helm-charts",
                },
                namespace: "castai-agent",
                createNamespace: false,
                cleanupOnFail: true,
                timeout: 300,
                skipAwait: true,
                values: {
                    castai: {
                        apiKey: args.apiToken,
                        clusterID: this.clusterId,
                    },
                    replicaCount: 0,
                },
            }, {
                provider: k8sProvider,
                dependsOn: [gkeClusterConnection],
                ...componentOpts,
            });
        }

        this.registerOutputs({
            clusterId: this.clusterId,
            clusterToken: this.clusterToken,
            credentialsId: this.credentialsId,
            serviceAccountEmail: this.serviceAccountEmail,
            serviceAccountKey: this.serviceAccountKey,
        });
    }
}
