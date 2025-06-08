import * as pulumi from "@pulumi/pulumi";
/**
 * EKS cluster resource allows connecting an existing EKS cluster to CAST AI.
 */
export declare class EksCluster extends pulumi.CustomResource {
    /**
     * Get an existing EksCluster resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: EksClusterState, opts?: pulumi.CustomResourceOptions): EksCluster;
    /**
     * Returns true if the given object is an instance of EksCluster.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is EksCluster;
    /**
     * AWS access key ID of the CAST AI IAM account
     */
    readonly accessKeyId: pulumi.Output<string | undefined>;
    /**
     * ID of AWS account
     */
    readonly accountId: pulumi.Output<string>;
    /**
     * @deprecated agent_token is deprecated, use clusterToken instead
     */
    readonly agentToken: pulumi.Output<string>;
    /**
     * AWS ARN for assume role that should be used instead of IAM account
     */
    readonly assumeRoleArn: pulumi.Output<string | undefined>;
    /**
     * CAST AI internal credentials ID
     */
    readonly credentialsId: pulumi.Output<string>;
    /**
     * Should CAST AI remove nodes managed by CAST AI on disconnect
     */
    readonly deleteNodesOnDisconnect: pulumi.Output<boolean | undefined>;
    /**
     * Overrides the IP address to use for DNS queries within the cluster. Defaults to 10.100.0.10 or 172.20.0.10 based on the IP address of the primary interface
     */
    readonly dnsClusterIp: pulumi.Output<string | undefined>;
    /**
     * AWS ARN of the instance profile to be used by CAST AI
     */
    readonly instanceProfileArn: pulumi.Output<string | undefined>;
    /**
     * name of your EKS cluster
     */
    readonly name: pulumi.Output<string>;
    /**
     * Optional custom security groups for the cluster. If not set security groups from the EKS cluster configuration are used.
     */
    readonly overrideSecurityGroups: pulumi.Output<string[] | undefined>;
    /**
     * AWS region where the cluster is placed
     */
    readonly region: pulumi.Output<string>;
    /**
     * AWS secret access key of the CAST AI IAM account
     */
    readonly secretAccessKey: pulumi.Output<string | undefined>;
    /**
     * IDs of security groups that are used by CAST AI
     */
    readonly securityGroups: pulumi.Output<string[]>;
    /**
     * Accepted values are base64 encoded SSH public key or AWS key pair ID.
     */
    readonly sshPublicKey: pulumi.Output<string | undefined>;
    /**
     * Custom subnets for the cluster. If not set subnets from the EKS cluster configuration are used.
     */
    readonly subnets: pulumi.Output<string[] | undefined>;
    /**
     * Tags which should be added to CAST AI nodes
     */
    readonly tags: pulumi.Output<{
        [key: string]: string;
    } | undefined>;
    /**
     * Create a EksCluster resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: EksClusterArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering EksCluster resources.
 */
export interface EksClusterState {
    /**
     * AWS access key ID of the CAST AI IAM account
     */
    accessKeyId?: pulumi.Input<string>;
    /**
     * ID of AWS account
     */
    accountId?: pulumi.Input<string>;
    /**
     * @deprecated agent_token is deprecated, use clusterToken instead
     */
    agentToken?: pulumi.Input<string>;
    /**
     * AWS ARN for assume role that should be used instead of IAM account
     */
    assumeRoleArn?: pulumi.Input<string>;
    /**
     * CAST AI internal credentials ID
     */
    credentialsId?: pulumi.Input<string>;
    /**
     * Should CAST AI remove nodes managed by CAST AI on disconnect
     */
    deleteNodesOnDisconnect?: pulumi.Input<boolean>;
    /**
     * Overrides the IP address to use for DNS queries within the cluster. Defaults to 10.100.0.10 or 172.20.0.10 based on the IP address of the primary interface
     */
    dnsClusterIp?: pulumi.Input<string>;
    /**
     * AWS ARN of the instance profile to be used by CAST AI
     */
    instanceProfileArn?: pulumi.Input<string>;
    /**
     * name of your EKS cluster
     */
    name?: pulumi.Input<string>;
    /**
     * Optional custom security groups for the cluster. If not set security groups from the EKS cluster configuration are used.
     */
    overrideSecurityGroups?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * AWS region where the cluster is placed
     */
    region?: pulumi.Input<string>;
    /**
     * AWS secret access key of the CAST AI IAM account
     */
    secretAccessKey?: pulumi.Input<string>;
    /**
     * IDs of security groups that are used by CAST AI
     */
    securityGroups?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Accepted values are base64 encoded SSH public key or AWS key pair ID.
     */
    sshPublicKey?: pulumi.Input<string>;
    /**
     * Custom subnets for the cluster. If not set subnets from the EKS cluster configuration are used.
     */
    subnets?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Tags which should be added to CAST AI nodes
     */
    tags?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    }>;
}
/**
 * The set of arguments for constructing a EksCluster resource.
 */
export interface EksClusterArgs {
    /**
     * AWS access key ID of the CAST AI IAM account
     */
    accessKeyId?: pulumi.Input<string>;
    /**
     * ID of AWS account
     */
    accountId: pulumi.Input<string>;
    /**
     * AWS ARN for assume role that should be used instead of IAM account
     */
    assumeRoleArn?: pulumi.Input<string>;
    /**
     * Should CAST AI remove nodes managed by CAST AI on disconnect
     */
    deleteNodesOnDisconnect?: pulumi.Input<boolean>;
    /**
     * Overrides the IP address to use for DNS queries within the cluster. Defaults to 10.100.0.10 or 172.20.0.10 based on the IP address of the primary interface
     */
    dnsClusterIp?: pulumi.Input<string>;
    /**
     * AWS ARN of the instance profile to be used by CAST AI
     */
    instanceProfileArn?: pulumi.Input<string>;
    /**
     * name of your EKS cluster
     */
    name?: pulumi.Input<string>;
    /**
     * Optional custom security groups for the cluster. If not set security groups from the EKS cluster configuration are used.
     */
    overrideSecurityGroups?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * AWS region where the cluster is placed
     */
    region: pulumi.Input<string>;
    /**
     * AWS secret access key of the CAST AI IAM account
     */
    secretAccessKey?: pulumi.Input<string>;
    /**
     * Accepted values are base64 encoded SSH public key or AWS key pair ID.
     */
    sshPublicKey?: pulumi.Input<string>;
    /**
     * Custom subnets for the cluster. If not set subnets from the EKS cluster configuration are used.
     */
    subnets?: pulumi.Input<pulumi.Input<string>[]>;
    /**
     * Tags which should be added to CAST AI nodes
     */
    tags?: pulumi.Input<{
        [key: string]: pulumi.Input<string>;
    }>;
}
