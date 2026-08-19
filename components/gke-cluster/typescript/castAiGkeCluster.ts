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
    clusterName: pulumi.Input<string>;

    /**
     * GCP location (zone for zonal clusters, region for regional clusters)
     * Examples: "us-central1-a" (zonal), "us-central1" (regional)
     */
    location: pulumi.Input<string>;

    /**
     * GCP project ID
     */
    projectId: pulumi.Input<string>;

    /**
     * CAST AI API URL. When omitted, the CAST AI provider falls back to its
     * built-in default of `https://api.cast.ai`.
     */
    apiUrl?: pulumi.Input<string>;

    /**
     * Helm chart version for all CAST AI charts. Defaults to the latest available version.
     */
    helmChartVersion?: pulumi.Input<string>;

    /**
     * Purge Helm releases on delete (default: true).
     */
    purgeOnDelete?: pulumi.Input<boolean>;

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
     * Kubernetes provider (optional, will be created if not provided)
     */
    k8sProvider?: k8s.Provider;

    /**
     * Additional labels to apply to CAST AI provisioned nodes
     */
    tags?: pulumi.Input<{ [key: string]: pulumi.Input<string> }>;

    /**
     * Disk type for CAST AI provisioned GKE nodes.
     * Defaults to "pd-standard" for backward compatibility.
     */
    nodeDiskType?: pulumi.Input<string>;

    /**
     * Maximum number of pods per node for CAST AI provisioned GKE nodes.
     * Defaults to 110 for backward compatibility.
     */
    nodeMaxPodsPerNode?: pulumi.Input<number>;

    /**
     * Opt in to CAST AI service-account impersonation. Currently a no-op for GKE
     * because the upstream impersonation data source only supports AKS; the
     * component keeps using a GCP JSON service-account key.
     */
    useImpersonation?: boolean;

    /**
     * Rotate the JSON service account key every N days by including a rotation
     * boundary in the key resource name, forcing Pulumi to replace it.
     */
    keyRotationDays?: number;

    /**
     * Optional explicit rotation boundary for the GCP service-account key.
     * When set, takes precedence over the wall-clock boundary computed from
     * keyRotationDays. Must be known at component construction time.
     */
    rotationBoundary?: number;
}

export class CastAiGkeCluster extends pulumi.ComponentResource {
    public readonly clusterId: pulumi.Output<string>;
    public readonly clusterToken: pulumi.Output<string>;
    public readonly credentialsId: pulumi.Output<string>;
    public readonly serviceAccountEmail?: pulumi.Output<string>;
    public readonly serviceAccountKey?: pulumi.Output<string>;
    public readonly serviceAccountKeyName?: pulumi.Output<string>;
    public readonly k8sProviderArgs?: {
        kubeconfig: pulumi.Output<string>;
        clusterIdentifier: pulumi.Input<string>;
        deleteUnreachable: pulumi.Input<boolean>;
    };
    public readonly defaultNodeConfigArgs?: castai.config.NodeConfigurationArgs;
    public readonly helmReleaseArgs?: Array<{
        name: string;
        chart: string;
        version?: pulumi.Input<string>;
        purgeOnDelete: pulumi.Input<boolean>;
        values: any;
    }>;

    constructor(name: string, args: CastAiGkeClusterArgs, opts?: pulumi.ComponentResourceOptions) {
        super("castai:index:CastAiGkeCluster", name, {}, {
            ...opts,
            aliases: [...(opts?.aliases ?? []), { type: "castai:gke:CastAiGkeCluster" }],
            additionalSecretOutputs: [...((opts as pulumi.CustomResourceOptions | undefined)?.additionalSecretOutputs ?? []), "serviceAccountKey", "clusterToken"],
        } as pulumi.CustomResourceOptions);

        const componentOpts = { parent: this };
        const apiUrl = args.apiUrl;
        const readOnlyMode = args.readOnlyMode || false;
        // Resolve `helmChartVersion` to a trimmed non-empty string or `undefined`.
        // Checking truthiness on the raw `pulumi.Input<string>` wrapper is wrong
        // because the wrapper is always truthy; we must look at the resolved value
        // before deciding whether to pin a Helm chart version. The Output's apply
        // callback collapses `undefined`, `""`, and whitespace-only strings into
        // `undefined` so the downstream conditional behaves predictably.
        const helmChartVersionOutput = pulumi.output(args.helmChartVersion).apply(v =>
            v && v.trim() ? v.trim() : undefined
        );
        const purgeOnDelete = args.purgeOnDelete ?? true;

        // `purgeOnDelete` is supported by the underlying helm provider but is
        // missing from @pulumi/kubernetes' v3 ReleaseArgs type. Cast through
        // an extended type so the extra field flows through typed.
        type ExtendedReleaseArgs = k8s.helm.v3.ReleaseArgs & {
            purgeOnDelete?: pulumi.Input<boolean>;
        };
        const asHelmArgs = (a: ExtendedReleaseArgs) => a as unknown as k8s.helm.v3.ReleaseArgs;

        // Capture each Helm release's effective args synchronously so callers
        // can inspect them without depending on Pulumi's mock monitor timing.
        // The runtime strips fields not declared on `k8s.helm.v3.ReleaseArgs`
        // (e.g. `purgeOnDelete`) from the inputs passed to mocks, so the
        // recorded mock state cannot be used as a source of truth for them.
        const helmReleaseArgs: Array<{
            name: string;
            chart: string;
            version?: pulumi.Input<string>;
            purgeOnDelete: pulumi.Input<boolean>;
            values: any;
        }> = [];

        // Build Helm release args, omitting the version field when no explicit
        // chart version is supplied so the Helm provider pulls the latest chart.
        // We assign the resolved `Output<string | undefined>` directly: when the
        // apply callback resolves to `undefined`, Pulumi treats the property as
        // unset (equivalent to omitting it). This avoids the previous bug where
        // the bare `pulumi.Input<string>` wrapper was always truthy and would
        // pin a Helm chart version even when the underlying value was empty.
        const buildHelmArgs = (args: Omit<ExtendedReleaseArgs, "version"> & { version?: pulumi.Input<string> }): ExtendedReleaseArgs => {
            const result: ExtendedReleaseArgs = { ...args };
            result.version = helmChartVersionOutput as pulumi.Input<string>;
            return result;
        };

        // Validate required arguments for full management mode.
        //
        // NOTE: This validation runs synchronously at constructor time only.
        // It inspects the raw `pulumi.Input` wrappers and cannot observe
        // values that resolve from `Output<T>` later in the lifecycle. If a
        // caller passes `pulumi.output(undefined)` or a lazy `Output` that
        // ultimately resolves to nothing, the `pulumi.Input<pulumi.Input<string>[]>`
        // wrapper may still be defined at this point and these checks will
        // pass even though no usable values will be available at apply-time.
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
        const gkeCluster = pulumi.all([args.clusterName, args.location, args.projectId]).apply(([clusterName, location, projectId]) =>
            gcp.container.getCluster({
                name: clusterName,
                location: location,
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

        this.clusterId = (castaiClusterPhase1 as unknown as pulumi.CustomResource).id;
        this.clusterToken = pulumi.secret(castaiClusterPhase1.clusterToken);
        this.credentialsId = castaiClusterPhase1.credentialsId;

        // =================================================================
        // Kubernetes Provider
        // =================================================================

        let k8sProviderArgs: {
            kubeconfig: pulumi.Output<string>;
            clusterIdentifier: pulumi.Input<string>;
            deleteUnreachable: pulumi.Input<boolean>;
        } | undefined;
        const k8sProvider = args.k8sProvider || (() => {
            // Inputs to k8s.Provider must only contain fields declared on
            // `k8s.ProviderArgs`. `clusterIdentifier` and `deleteUnreachable`
            // are surfaced in the public `k8sProviderArgs` for inspection but
            // are intentionally NOT passed to the Provider to avoid type
            // errors and unwanted side effects.
            const providerInputs: k8s.ProviderArgs = {
                kubeconfig: gkeCluster.apply(cluster => {
                    const context = pulumi.interpolate`gke_${args.projectId}_${args.location}_${args.clusterName}`;
                    const masterAuths = (cluster as any).masterAuths;
                    const caCert = Array.isArray(masterAuths) && masterAuths.length > 0
                        ? masterAuths[0].clusterCaCertificate
                        : (cluster as any).masterAuth?.clusterCaCertificate;

                    if (!caCert) {
                        throw new Error(
                            `Unable to obtain cluster CA certificate for GKE cluster ${args.clusterName}.`
                        );
                    }

                    return pulumi.interpolate`apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority-data: ${caCert}
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
      interactiveMode: Never
`;
                }),
            };
            // The public output retains the contextual fields (cluster identifier
            // and the deleteUnreachable flag) so users can inspect them, even
            // though they are no longer passed to the Provider itself.
            const providerArgs = {
                kubeconfig: providerInputs.kubeconfig as pulumi.Output<string>,
                clusterIdentifier: this.clusterId,
                deleteUnreachable: true,
            };
            k8sProviderArgs = providerArgs;
            return new k8s.Provider(`${name}-k8s`, providerInputs, componentOpts);
        })();
        this.k8sProviderArgs = k8sProviderArgs;

        // =================================================================
        // Install Agent (Phase 1)
        // =================================================================

        helmReleaseArgs.push({
            name: "castai-agent",
            chart: "castai-agent",
            version: helmChartVersionOutput as pulumi.Input<string>,
            purgeOnDelete,
            values: {
                provider: "gke",
                createNamespace: false,
                apiURL: apiUrl,
                apiKey: this.clusterToken,
            },
        });
        new k8s.helm.v3.Release(`${name}-agent`, asHelmArgs(buildHelmArgs({
            name: "castai-agent",
            chart: "castai-agent",
            purgeOnDelete,
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
        })), {
            provider: k8sProvider,
            dependsOn: [castaiClusterPhase1 as unknown as pulumi.Resource],
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
                useImpersonation: args.useImpersonation,
                keyRotationDays: args.keyRotationDays,
                rotationBoundary: args.rotationBoundary,
            }, componentOpts);

            this.serviceAccountEmail = iamResources.serviceAccountEmail;
            this.serviceAccountKey = pulumi.secret(iamResources.serviceAccountKey);
            this.serviceAccountKeyName = iamResources.serviceAccountKeyName;

            // Update cluster with IAM credentials (Phase 2)
            const gkeClusterConnection = new castai.GkeCluster(`${name}-connection`, {
                projectId: args.projectId,
                location: args.location,
                name: args.clusterName,
                credentialsJson: this.serviceAccountKey,
                deleteNodesOnDisconnect: args.deleteNodesOnDisconnect || false,
            }, {
                provider: castaiProvider,
                dependsOn: [castaiClusterPhase1 as unknown as pulumi.Resource, iamResources],
                ...componentOpts,
            });

            // Create default node configuration with network tags and subnets
            const defaultNodeConfigArgs: castai.config.NodeConfigurationArgs = {
                clusterId: this.clusterId,
                name: "default",
                subnets: args.subnets!,
                tags: args.tags,
                gke: {
                    diskType: args.nodeDiskType ?? "pd-standard",
                    networkTags: args.networkTags,
                    maxPodsPerNode: args.nodeMaxPodsPerNode ?? 110,
                },
            };
            const defaultNodeConfig = new castai.config.NodeConfiguration(`${name}-node-config-default`, defaultNodeConfigArgs, {
                provider: castaiProvider,
                dependsOn: [gkeClusterConnection as unknown as pulumi.Resource, iamResources],
                ...componentOpts,
            });
            this.defaultNodeConfigArgs = defaultNodeConfigArgs;

            // Set as default node configuration
            new castai.config.NodeConfigurationDefault(`${name}-node-config-default-ref`, {
                clusterId: this.clusterId,
                configurationId: (defaultNodeConfig as unknown as pulumi.CustomResource).id,
            }, {
                provider: castaiProvider,
                dependsOn: [defaultNodeConfig as unknown as pulumi.Resource],
                ...componentOpts,
            });

            // Install cluster controller (Phase 2)
            helmReleaseArgs.push({
                name: "cluster-controller",
                chart: "castai-cluster-controller",
                version: helmChartVersionOutput as pulumi.Input<string>,
                purgeOnDelete,
                values: {
                    castai: {
                        clusterID: this.clusterId,
                        apiURL: apiUrl,
                        apiKey: pulumi.secret(args.apiToken),
                    },
                },
            });
            new k8s.helm.v3.Release(`${name}-controller`, asHelmArgs(buildHelmArgs({
                name: "cluster-controller",
                chart: "castai-cluster-controller",
                purgeOnDelete,
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
                        apiKey: pulumi.secret(args.apiToken),
                    },
                },
            })), {
                provider: k8sProvider,
                dependsOn: [gkeClusterConnection as unknown as pulumi.Resource],
                ...componentOpts,
            });

            // Install spot handler
            helmReleaseArgs.push({
                name: "castai-spot-handler",
                chart: "castai-spot-handler",
                version: helmChartVersionOutput as pulumi.Input<string>,
                purgeOnDelete,
                values: {
                    castai: {
                        clusterID: this.clusterId,
                        provider: "gke",
                    },
                },
            });
            new k8s.helm.v3.Release(`${name}-spot-handler`, asHelmArgs(buildHelmArgs({
                name: "castai-spot-handler",
                chart: "castai-spot-handler",
                purgeOnDelete,
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
            })), {
                provider: k8sProvider,
                dependsOn: [gkeClusterConnection as unknown as pulumi.Resource],
                ...componentOpts,
            });

            // Install evictor
            helmReleaseArgs.push({
                name: "castai-evictor",
                chart: "castai-evictor",
                version: helmChartVersionOutput as pulumi.Input<string>,
                purgeOnDelete,
                values: {
                    replicaCount: 0,
                },
            });
            new k8s.helm.v3.Release(`${name}-evictor`, asHelmArgs(buildHelmArgs({
                name: "castai-evictor",
                chart: "castai-evictor",
                purgeOnDelete,
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
            })), {
                provider: k8sProvider,
                dependsOn: [gkeClusterConnection as unknown as pulumi.Resource],
                ...componentOpts,
            });

            // Install pod pinner
            helmReleaseArgs.push({
                name: "castai-pod-pinner",
                chart: "castai-pod-pinner",
                version: helmChartVersionOutput as pulumi.Input<string>,
                purgeOnDelete,
                values: {
                    castai: {
                        apiKey: pulumi.secret(args.apiToken),
                        clusterID: this.clusterId,
                    },
                    replicaCount: 0,
                },
            });
            new k8s.helm.v3.Release(`${name}-pod-pinner`, asHelmArgs(buildHelmArgs({
                name: "castai-pod-pinner",
                chart: "castai-pod-pinner",
                purgeOnDelete,
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
                        apiKey: pulumi.secret(args.apiToken),
                        clusterID: this.clusterId,
                    },
                    replicaCount: 0,
                },
            })), {
                provider: k8sProvider,
                dependsOn: [gkeClusterConnection as unknown as pulumi.Resource],
                ...componentOpts,
            });
        }

        this.helmReleaseArgs = helmReleaseArgs;
        this.registerOutputs({
            clusterId: this.clusterId,
            clusterToken: this.clusterToken,
            credentialsId: this.credentialsId,
            serviceAccountEmail: this.serviceAccountEmail,
            serviceAccountKey: this.serviceAccountKey,
            serviceAccountKeyName: this.serviceAccountKeyName,
        });
    }
}
