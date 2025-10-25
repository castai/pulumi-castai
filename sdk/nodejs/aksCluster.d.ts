import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class AksCluster extends pulumi.CustomResource {
    /**
     * Get an existing AksCluster resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: AksClusterState, opts?: pulumi.CustomResourceOptions): AksCluster;
    /**
     * Returns true if the given object is an instance of AksCluster.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is AksCluster;
    /**
     * Azure AD application ID that is created and used by CAST AI.
     */
    readonly clientId: pulumi.Output<string>;
    /**
     * Azure AD application password that will be used by CAST AI.
     */
    readonly clientSecret: pulumi.Output<string>;
    /**
     * CAST AI cluster token.
     */
    readonly clusterToken: pulumi.Output<string>;
    /**
     * CAST AI internal credentials ID
     */
    readonly credentialsId: pulumi.Output<string>;
    /**
     * Should CAST AI remove nodes managed by CAST.AI on disconnect.
     */
    readonly deleteNodesOnDisconnect: pulumi.Output<boolean | undefined>;
    /**
     * HTTP proxy configuration for CAST AI nodes and node components.
     */
    readonly httpProxyConfig: pulumi.Output<outputs.azure.AksClusterHttpProxyConfig | undefined>;
    /**
     * AKS cluster name.
     */
    readonly name: pulumi.Output<string>;
    /**
     * Azure resource group in which nodes are and will be created.
     */
    readonly nodeResourceGroup: pulumi.Output<string>;
    /**
     * AKS cluster region.
     */
    readonly region: pulumi.Output<string>;
    /**
     * ID of the Azure subscription.
     */
    readonly subscriptionId: pulumi.Output<string>;
    /**
     * Azure AD tenant ID from the used subscription.
     */
    readonly tenantId: pulumi.Output<string>;
    /**
     * Create a AksCluster resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args: AksClusterArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering AksCluster resources.
 */
export interface AksClusterState {
    /**
     * Azure AD application ID that is created and used by CAST AI.
     */
    clientId?: pulumi.Input<string>;
    /**
     * Azure AD application password that will be used by CAST AI.
     */
    clientSecret?: pulumi.Input<string>;
    /**
     * CAST AI cluster token.
     */
    clusterToken?: pulumi.Input<string>;
    /**
     * CAST AI internal credentials ID
     */
    credentialsId?: pulumi.Input<string>;
    /**
     * Should CAST AI remove nodes managed by CAST.AI on disconnect.
     */
    deleteNodesOnDisconnect?: pulumi.Input<boolean>;
    /**
     * HTTP proxy configuration for CAST AI nodes and node components.
     */
    httpProxyConfig?: pulumi.Input<inputs.azure.AksClusterHttpProxyConfig>;
    /**
     * AKS cluster name.
     */
    name?: pulumi.Input<string>;
    /**
     * Azure resource group in which nodes are and will be created.
     */
    nodeResourceGroup?: pulumi.Input<string>;
    /**
     * AKS cluster region.
     */
    region?: pulumi.Input<string>;
    /**
     * ID of the Azure subscription.
     */
    subscriptionId?: pulumi.Input<string>;
    /**
     * Azure AD tenant ID from the used subscription.
     */
    tenantId?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a AksCluster resource.
 */
export interface AksClusterArgs {
    /**
     * Azure AD application ID that is created and used by CAST AI.
     */
    clientId: pulumi.Input<string>;
    /**
     * Azure AD application password that will be used by CAST AI.
     */
    clientSecret: pulumi.Input<string>;
    /**
     * Should CAST AI remove nodes managed by CAST.AI on disconnect.
     */
    deleteNodesOnDisconnect?: pulumi.Input<boolean>;
    /**
     * HTTP proxy configuration for CAST AI nodes and node components.
     */
    httpProxyConfig?: pulumi.Input<inputs.azure.AksClusterHttpProxyConfig>;
    /**
     * AKS cluster name.
     */
    name?: pulumi.Input<string>;
    /**
     * Azure resource group in which nodes are and will be created.
     */
    nodeResourceGroup: pulumi.Input<string>;
    /**
     * AKS cluster region.
     */
    region: pulumi.Input<string>;
    /**
     * ID of the Azure subscription.
     */
    subscriptionId: pulumi.Input<string>;
    /**
     * Azure AD tenant ID from the used subscription.
     */
    tenantId: pulumi.Input<string>;
}
