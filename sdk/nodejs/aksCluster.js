"use strict";
// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***
Object.defineProperty(exports, "__esModule", { value: true });
exports.AksCluster = void 0;
const pulumi = require("@pulumi/pulumi");
const utilities = require("./utilities");
/**
 * AKS cluster resource allows connecting an existing EKS cluster to CAST AI.
 */
class AksCluster extends pulumi.CustomResource {
    /**
     * Get an existing AksCluster resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name, id, state, opts) {
        return new AksCluster(name, state, Object.assign(Object.assign({}, opts), { id: id }));
    }
    /**
     * Returns true if the given object is an instance of AksCluster.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj) {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === AksCluster.__pulumiType;
    }
    constructor(name, argsOrState, opts) {
        let resourceInputs = {};
        opts = opts || {};
        if (opts.id) {
            const state = argsOrState;
            resourceInputs["clientId"] = state ? state.clientId : undefined;
            resourceInputs["clientSecret"] = state ? state.clientSecret : undefined;
            resourceInputs["clusterToken"] = state ? state.clusterToken : undefined;
            resourceInputs["deleteNodesOnDisconnect"] = state ? state.deleteNodesOnDisconnect : undefined;
            resourceInputs["name"] = state ? state.name : undefined;
            resourceInputs["nodeResourceGroup"] = state ? state.nodeResourceGroup : undefined;
            resourceInputs["region"] = state ? state.region : undefined;
            resourceInputs["subscriptionId"] = state ? state.subscriptionId : undefined;
            resourceInputs["tenantId"] = state ? state.tenantId : undefined;
        }
        else {
            const args = argsOrState;
            if ((!args || args.clientId === undefined) && !opts.urn) {
                throw new Error("Missing required property 'clientId'");
            }
            if ((!args || args.clientSecret === undefined) && !opts.urn) {
                throw new Error("Missing required property 'clientSecret'");
            }
            if ((!args || args.nodeResourceGroup === undefined) && !opts.urn) {
                throw new Error("Missing required property 'nodeResourceGroup'");
            }
            if ((!args || args.region === undefined) && !opts.urn) {
                throw new Error("Missing required property 'region'");
            }
            if ((!args || args.subscriptionId === undefined) && !opts.urn) {
                throw new Error("Missing required property 'subscriptionId'");
            }
            if ((!args || args.tenantId === undefined) && !opts.urn) {
                throw new Error("Missing required property 'tenantId'");
            }
            resourceInputs["clientId"] = args ? args.clientId : undefined;
            resourceInputs["clientSecret"] = (args === null || args === void 0 ? void 0 : args.clientSecret) ? pulumi.secret(args.clientSecret) : undefined;
            resourceInputs["deleteNodesOnDisconnect"] = args ? args.deleteNodesOnDisconnect : undefined;
            resourceInputs["name"] = args ? args.name : undefined;
            resourceInputs["nodeResourceGroup"] = args ? args.nodeResourceGroup : undefined;
            resourceInputs["region"] = args ? args.region : undefined;
            resourceInputs["subscriptionId"] = args ? args.subscriptionId : undefined;
            resourceInputs["tenantId"] = args ? args.tenantId : undefined;
            resourceInputs["clusterToken"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        const secretOpts = { additionalSecretOutputs: ["clientSecret", "clusterToken"] };
        opts = pulumi.mergeOptions(opts, secretOpts);
        super(AksCluster.__pulumiType, name, resourceInputs, opts);
    }
}
exports.AksCluster = AksCluster;
/** @internal */
AksCluster.__pulumiType = 'castai:azure:AksCluster';
//# sourceMappingURL=aksCluster.js.map