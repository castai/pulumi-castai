import * as pulumi from "@pulumi/pulumi";
import * as inputs from "../types/input";
import * as outputs from "../types/output";
export declare class NodeConfiguration extends pulumi.CustomResource {
    /**
     * Get an existing NodeConfiguration resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: NodeConfigurationState, opts?: pulumi.CustomResourceOptions): NodeConfiguration;
    /**
     * Returns true if the given object is an instance of NodeConfiguration.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is NodeConfiguration;
    readonly aks: pulumi.Output<outputs.config.NodeConfigurationAks | undefined>;
    /**
     * CAST AI cluster id
     */
    readonly clusterId: pulumi.Output<string>;
    /**
     * Optional container runtime to be used by kubelet. Applicable for EKS only.  Supported values include: `dockerd`, `containerd`
     */
    readonly containerRuntime: pulumi.Output<string | undefined>;
    /**
     * Disk to CPU ratio. Sets the number of GiBs to be added for every CPU on the node. Defaults to 0
     */
    readonly diskCpuRatio: pulumi.Output<number | undefined>;
    /**
     * Optional docker daemon configuration properties in JSON format. Provide only properties that you want to override. Applicable for EKS only. [Available values](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-configuration-file)
     */
    readonly dockerConfig: pulumi.Output<string | undefined>;
    /**
     * Timeout in seconds for draining the node. Defaults to 0
     */
    readonly drainTimeoutSec: pulumi.Output<number | undefined>;
    readonly eks: pulumi.Output<outputs.config.NodeConfigurationEks | undefined>;
    readonly gke: pulumi.Output<outputs.config.NodeConfigurationGke>;
    /**
     * Image to be used while provisioning the node. If nothing is provided will be resolved to latest available image based on Image family, Kubernetes version and node architecture if possible. See Cast.ai documentation for details.
     */
    readonly image: pulumi.Output<string | undefined>;
    /**
     * Init script to be run on your instance at launch. Should not contain any sensitive data. Value should be base64 encoded
     */
    readonly initScript: pulumi.Output<string | undefined>;
    readonly kops: pulumi.Output<outputs.config.NodeConfigurationKops | undefined>;
    /**
     * Optional kubelet configuration properties in JSON format. Provide only properties that you want to override. Applicable for EKS only. [Available values](https://kubernetes.io/docs/reference/config-api/kubelet-config.v1beta1/)
     */
    readonly kubeletConfig: pulumi.Output<string | undefined>;
    /**
     * Minimal disk size in GiB. Defaults to 100, min 30, max 65536
     */
    readonly minDiskSize: pulumi.Output<number | undefined>;
    readonly name: pulumi.Output<string>;
    /**
     * SSH public key to be used for provisioned nodes
     */
    readonly sshPublicKey: pulumi.Output<string | undefined>;
    /**
     * Subnet ids to be used for provisioned nodes
     */
    readonly subnets: pulumi.Output<string[]>;
    /**
     * Tags to be added on cloud instances for provisioned nodes
     */
    readonly tags: pulumi.Output<{
        [key: string]: string;
    } | undefined>;
    /**
     * Create a NodeConfiguration resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: NodeConfigurationArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering NodeConfiguration resources.
 */
export interface NodeConfigurationState {
    aks?: pulumi.Input<inputs.config.NodeConfigurationAks>;
    /**
     * CAST AI cluster id
     */
    clusterId?: pulumi.Input<string>;
    /**
     * Optional container runtime to be used by kubelet. Applicable for EKS only.  Supported values include: `dockerd`, `containerd`
     */
    containerRuntime?: pulumi.Input<string>;
    /**
     * Disk to CPU ratio. Sets the number of GiBs to be added for every CPU on the node. Defaults to 0
     */
    diskCpuRatio?: pulumi.Input<number>;
    /**
     * Optional docker daemon configuration properties in JSON format. Provide only properties that you want to override. Applicable for EKS only. [Available values](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-configuration-file)
     */
    dockerConfig?: pulumi.Input<string>;
    /**
     * Timeout in seconds for draining the node. Defaults to 0
     */
    drainTimeoutSec?: pulumi.Input<number>;
    eks?: pulumi.Input<inputs.config.NodeConfigurationEks>;
    gke?: pulumi.Input<inputs.config.NodeConfigurationGke>;
    /**
     * Image to be used while provisioning the node. If nothing is provided will be resolved to latest available image based on Image family, Kubernetes version and node architecture if possible. See Cast.ai documentation for details.
     */
    image?: pulumi.Input<string>;
    /**
     * Init script to be run on your instance at launch. Should not contain any sensitive data. Value should be base64 encoded
     */
    initScript?: pulumi.Input<string>;
    kops?: pulumi.Input<inputs.config.NodeConfigurationKops>;
    /**
     * Optional kubelet configuration properties in JSON format. Provide only properties that you want to override. Applicable for EKS only. [Available values](https://kubernetes.io/docs/reference/config-api/kubelet-config.v1beta1/)
     */
    kubeletConfig?: pulumi.Input<string>;
    /**
     * Minimal disk size in GiB. Defaults to 100, min 30, max 65536
     */
    minDiskSize?: pulumi.Input<number>;
    name?: pulumi.Input<string>;
    /**
     * SSH public key to be used for provisioned nodes
     */
    sshPublicKey?: pulumi.Input<string>;
    /**
     * Subnet ids to be used for provisioned nodes
     */
    subnets?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Tags to be added on cloud instances for provisioned nodes
     */
    tags?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    }>;
}
/**
 * The set of arguments for constructing a NodeConfiguration resource.
 */
export interface NodeConfigurationArgs {
    aks?: pulumi.Input<inputs.config.NodeConfigurationAks>;
    /**
     * CAST AI cluster id
     */
    clusterId: pulumi.Input<string>;
    /**
     * Optional container runtime to be used by kubelet. Applicable for EKS only.  Supported values include: `dockerd`, `containerd`
     */
    containerRuntime?: pulumi.Input<string>;
    /**
     * Disk to CPU ratio. Sets the number of GiBs to be added for every CPU on the node. Defaults to 0
     */
    diskCpuRatio?: pulumi.Input<number>;
    /**
     * Optional docker daemon configuration properties in JSON format. Provide only properties that you want to override. Applicable for EKS only. [Available values](https://docs.docker.com/engine/reference/commandline/dockerd/#daemon-configuration-file)
     */
    dockerConfig?: pulumi.Input<string>;
    /**
     * Timeout in seconds for draining the node. Defaults to 0
     */
    drainTimeoutSec?: pulumi.Input<number>;
    eks?: pulumi.Input<inputs.config.NodeConfigurationEks>;
    gke?: pulumi.Input<inputs.config.NodeConfigurationGke>;
    /**
     * Image to be used while provisioning the node. If nothing is provided will be resolved to latest available image based on Image family, Kubernetes version and node architecture if possible. See Cast.ai documentation for details.
     */
    image?: pulumi.Input<string>;
    /**
     * Init script to be run on your instance at launch. Should not contain any sensitive data. Value should be base64 encoded
     */
    initScript?: pulumi.Input<string>;
    kops?: pulumi.Input<inputs.config.NodeConfigurationKops>;
    /**
     * Optional kubelet configuration properties in JSON format. Provide only properties that you want to override. Applicable for EKS only. [Available values](https://kubernetes.io/docs/reference/config-api/kubelet-config.v1beta1/)
     */
    kubeletConfig?: pulumi.Input<string>;
    /**
     * Minimal disk size in GiB. Defaults to 100, min 30, max 65536
     */
    minDiskSize?: pulumi.Input<number>;
    name?: pulumi.Input<string>;
    /**
     * SSH public key to be used for provisioned nodes
     */
    sshPublicKey?: pulumi.Input<string>;
    /**
     * Subnet ids to be used for provisioned nodes
     */
    subnets: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Tags to be added on cloud instances for provisioned nodes
     */
    tags?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    }>;
}
