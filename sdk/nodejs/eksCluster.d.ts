import * as pulumi from "@pulumi/pulumi";
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
     * ID of AWS account
     */
    readonly accountId: pulumi.Output<string>;
    /**
     * AWS IAM role ARN that will be assumed by CAST AI user. This role should allow `sts:AssumeRole` action for CAST AI user.
     */
    readonly assumeRoleArn: pulumi.Output<string | undefined>;
    /**
     * computed value to store cluster token
     */
    readonly clusterToken: pulumi.Output<string>;
    /**
     * CAST AI internal credentials ID
     */
    readonly credentialsId: pulumi.Output<string>;
    /**
     * Should CAST AI remove nodes managed by CAST AI on disconnect
     */
    readonly deleteNodesOnDisconnect: pulumi.Output<boolean | undefined>;
    /**
     * name of your EKS cluster
     */
    readonly name: pulumi.Output<string>;
    /**
     * AWS region where the cluster is placed
     */
    readonly region: pulumi.Output<string>;
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
     * ID of AWS account
     */
    accountId?: pulumi.Input<string>;
    /**
     * AWS IAM role ARN that will be assumed by CAST AI user. This role should allow `sts:AssumeRole` action for CAST AI user.
     */
    assumeRoleArn?: pulumi.Input<string>;
    /**
     * computed value to store cluster token
     */
    clusterToken?: pulumi.Input<string>;
    /**
     * CAST AI internal credentials ID
     */
    credentialsId?: pulumi.Input<string>;
    /**
     * Should CAST AI remove nodes managed by CAST AI on disconnect
     */
    deleteNodesOnDisconnect?: pulumi.Input<boolean>;
    /**
     * name of your EKS cluster
     */
    name?: pulumi.Input<string>;
    /**
     * AWS region where the cluster is placed
     */
    region?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a EksCluster resource.
 */
export interface EksClusterArgs {
    /**
     * ID of AWS account
     */
    accountId: pulumi.Input<string>;
    /**
     * AWS IAM role ARN that will be assumed by CAST AI user. This role should allow `sts:AssumeRole` action for CAST AI user.
     */
    assumeRoleArn?: pulumi.Input<string>;
    /**
     * Should CAST AI remove nodes managed by CAST AI on disconnect
     */
    deleteNodesOnDisconnect?: pulumi.Input<boolean>;
    /**
     * name of your EKS cluster
     */
    name?: pulumi.Input<string>;
    /**
     * AWS region where the cluster is placed
     */
    region: pulumi.Input<string>;
}
