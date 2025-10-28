/**
 * CastAiEksCluster - High-level Component Resource
 *
 * This component provides a batteries-included approach to connecting an EKS cluster
 * to CAST AI, similar to the Terraform castai/eks-cluster module.
 *
 * It handles:
 * - Phase 1: Cluster registration and agent installation
 * - Phase 2: IAM setup (roles, policies, instance profiles)
 * - Phase 2: Full management (controller, spot-handler, evictor, pod-pinner)
 * - Node configurations and templates
 * - Autoscaler policies (optional)
 *
 * Example usage:
 *
 * ```typescript
 * const cluster = new CastAiEksCluster("my-cluster", {
 *     clusterName: "my-eks-cluster",
 *     region: "us-east-1",
 *     accountId: awsAccountId,
 *     subnets: ["subnet-xxx", "subnet-yyy"],
 *     securityGroups: ["sg-xxx"],
 *     autoscalerEnabled: true,
 * });
 * ```
 */

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";
import * as command from "@pulumi/command";
import * as castai from "@castai/pulumi";
import { EksIamResources } from "./eksIamResources";

export interface CastAiEksClusterArgs {
    /**
     * Name of the EKS cluster to connect to CAST AI
     */
    clusterName: string;

    /**
     * AWS region where the cluster is located
     */
    region: string;

    /**
     * AWS account ID
     */
    accountId: pulumi.Input<string>;

    /**
     * CAST AI API URL (optional, defaults to https://api.cast.ai)
     */
    apiUrl?: pulumi.Input<string>;

    /**
     * CAST AI API token (required)
     */
    apiToken: pulumi.Input<string>;

    /**
     * Subnet IDs for CAST AI provisioned nodes
     */
    subnets: pulumi.Input<pulumi.Input<string>[]>;

    /**
     * Security group IDs for CAST AI provisioned nodes
     */
    securityGroups: pulumi.Input<pulumi.Input<string>[]>;

    /**
     * VPC ID (optional, will be auto-discovered from cluster if not provided)
     */
    vpcId?: pulumi.Input<string>;

    /**
     * Should CAST AI remove nodes on disconnect (default: false)
     */
    deleteNodesOnDisconnect?: pulumi.Input<boolean>;

    /**
     * Install workload autoscaler (default: true)
     */
    installWorkloadAutoscaler?: pulumi.Input<boolean>;

    /**
     * Install egressd network cost monitor (default: true)
     */
    installEgressd?: pulumi.Input<boolean>;

    /**
     * Enable autoscaler (default: false)
     */
    autoscalerEnabled?: pulumi.Input<boolean>;

    /**
     * Kubernetes provider (optional, will be created if not provided)
     */
    k8sProvider?: k8s.Provider;

    /**
     * Additional tags to apply to CAST AI provisioned nodes
     */
    tags?: pulumi.Input<{ [key: string]: pulumi.Input<string> }>;
}

export class CastAiEksCluster extends pulumi.ComponentResource {
    public readonly clusterId: pulumi.Output<string>;
    public readonly clusterToken: pulumi.Output<string>;
    public readonly castaiRoleArn: pulumi.Output<string>;
    public readonly instanceProfileArn: pulumi.Output<string>;
    public readonly nodeRoleArn: pulumi.Output<string>;
    public readonly securityGroupId: pulumi.Output<string>;

    constructor(name: string, args: CastAiEksClusterArgs, opts?: pulumi.ComponentResourceOptions) {
        super("castai:eks:CastAiEksCluster", name, {}, opts);

        const componentOpts = { parent: this };
        const apiUrl = args.apiUrl || "https://api.cast.ai";

        // Create CAST AI provider
        const castaiProvider = new castai.Provider(`${name}-provider`, {
            apiToken: args.apiToken,
            apiUrl: apiUrl,
        }, componentOpts);

        // Get EKS cluster information
        const eksCluster = pulumi.output(aws.eks.getCluster({
            name: args.clusterName,
        }));

        const vpcId = args.vpcId || eksCluster.vpcConfig.vpcId;
        const callerIdentity = aws.getCallerIdentity({});
        const accountId = args.accountId || callerIdentity.then(c => c.accountId);

        // =================================================================
        // Phase 1: Register Cluster
        // =================================================================

        const castaiClusterPhase1 = new castai.EksCluster(`${name}-phase1`, {
            accountId: accountId,
            region: args.region,
            name: args.clusterName,
        }, { provider: castaiProvider, ...componentOpts });

        this.clusterId = castaiClusterPhase1.id;
        this.clusterToken = castaiClusterPhase1.clusterToken;

        // Get CAST AI user ARN for IAM trust
        const castaiUserArn = new castai.EksUserArn(`${name}-user-arn`, {
            clusterId: this.clusterId,
        }, { provider: castaiProvider, ...componentOpts });

        // =================================================================
        // Kubernetes Provider
        // =================================================================

        const k8sProvider = args.k8sProvider || new k8s.Provider(`${name}-k8s`, {
            kubeconfig: eksCluster.apply(cluster => {
                const clusterCert = pulumi.output(aws.eks.getCluster({
                    name: args.clusterName,
                })).apply(c => c.certificateAuthorities[0].data);

                return pulumi.interpolate`apiVersion: v1
kind: Config
clusters:
- cluster:
    server: ${cluster.endpoint}
    certificate-authority-data: ${clusterCert}
  name: ${args.clusterName}
contexts:
- context:
    cluster: ${args.clusterName}
    user: ${args.clusterName}
  name: ${args.clusterName}
current-context: ${args.clusterName}
users:
- name: ${args.clusterName}
  user:
    exec:
      apiVersion: client.authentication.k8s.io/v1beta1
      command: aws
      args:
        - eks
        - get-token
        - --cluster-name
        - ${args.clusterName}
        - --region
        - ${args.region}
`;
            }),
        }, componentOpts);

        // =================================================================
        // Phase 2: IAM Resources
        // =================================================================

        const iamResources = new EksIamResources(`${name}-iam`, {
            clusterName: args.clusterName,
            region: args.region,
            accountId: accountId,
            vpcId: vpcId,
            castaiUserArn: castaiUserArn.arn,
            clusterId: this.clusterId,
            k8sProvider: k8sProvider,
        }, componentOpts);

        this.castaiRoleArn = iamResources.roleArn;
        this.instanceProfileArn = iamResources.instanceProfileArn;
        this.nodeRoleArn = iamResources.nodeRoleArn;
        this.securityGroupId = iamResources.securityGroupId;

        // Update cluster with IAM role (Phase 2)
        const eksClusterConnection = new castai.EksCluster(`${name}-connection`, {
            accountId: accountId,
            region: args.region,
            name: args.clusterName,
            assumeRoleArn: this.castaiRoleArn,
            deleteNodesOnDisconnect: args.deleteNodesOnDisconnect || false,
        }, {
            provider: castaiProvider,
            dependsOn: [castaiClusterPhase1, iamResources],
            ...componentOpts,
        });

        // Update cluster config via API (instance profile + security groups)
        new command.local.Command(`${name}-update-config`, {
            create: pulumi.all([
                this.clusterId,
                this.instanceProfileArn,
                this.securityGroupId,
                args.securityGroups,
            ]).apply(([clusterId, instanceProfile, castaiSG, userSGs]) => {
                const allSGs = [castaiSG, ...userSGs];
                const patchData = JSON.stringify({
                    eks: {
                        instanceProfileArn: instanceProfile,
                        securityGroups: allSGs,
                    }
                }).replace(/'/g, "'\\''");

                return `curl -sf -X PATCH \
                  -H "X-API-Key: ${pulumi.output(args.apiToken).apply(t => t)}" \
                  -H "Content-Type: application/json" \
                  -d '${patchData}' \
                  "${apiUrl}/v1/kubernetes/external-clusters/${clusterId}"`;
            }),
        }, {
            dependsOn: [eksClusterConnection, iamResources],
            ...componentOpts,
        });

        // =================================================================
        // Install Helm Charts
        // =================================================================

        // Install CAST AI agent (Phase 1)
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
                provider: "eks",
                createNamespace: false,
                apiURL: apiUrl,
                apiKey: this.clusterToken,
            },
        }, {
            provider: k8sProvider,
            dependsOn: [castaiClusterPhase1],
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
            dependsOn: [eksClusterConnection],
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
                    provider: "eks",
                },
            },
        }, {
            provider: k8sProvider,
            dependsOn: [eksClusterConnection],
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
            dependsOn: [eksClusterConnection],
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
            dependsOn: [eksClusterConnection],
            ...componentOpts,
        });

        this.registerOutputs({
            clusterId: this.clusterId,
            clusterToken: this.clusterToken,
            castaiRoleArn: this.castaiRoleArn,
            instanceProfileArn: this.instanceProfileArn,
            nodeRoleArn: this.nodeRoleArn,
            securityGroupId: this.securityGroupId,
        });
    }
}
