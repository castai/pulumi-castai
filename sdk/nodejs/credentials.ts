// *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
// *** Do not edit by hand unless you're certain you know what you are doing! ***

import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
import * as utilities from "./utilities";

export class Credentials extends pulumi.CustomResource {
    /**
     * Get an existing Credentials resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    public static get(name: string, id: pulumi.Input<pulumi.ID>, state?: CredentialsState, opts?: pulumi.CustomResourceOptions): Credentials {
        return new Credentials(name, <any>state, { ...opts, id: id });
    }

    /** @internal */
    public static readonly __pulumiType = 'castai:index:Credentials';

    /**
     * Returns true if the given object is an instance of Credentials.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    public static isInstance(obj: any): obj is Credentials {
        if (obj === undefined || obj === null) {
            return false;
        }
        return obj['__pulumiType'] === Credentials.__pulumiType;
    }

    public readonly aws!: pulumi.Output<outputs.CredentialsAws | undefined>;
    public readonly azure!: pulumi.Output<outputs.CredentialsAzure | undefined>;
    public /*out*/ readonly cloud!: pulumi.Output<string>;
    public readonly do!: pulumi.Output<outputs.CredentialsDo | undefined>;
    public readonly gcp!: pulumi.Output<outputs.CredentialsGcp | undefined>;
    public readonly name!: pulumi.Output<string>;

    /**
     * Create a Credentials resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: CredentialsArgs, opts?: pulumi.CustomResourceOptions)
    constructor(name: string, argsOrState?: CredentialsArgs | CredentialsState, opts?: pulumi.CustomResourceOptions) {
        let resourceInputs: pulumi.Inputs = {};
        opts = opts || {};
        if (opts.id) {
            const state = argsOrState as CredentialsState | undefined;
            resourceInputs["aws"] = state ? state.aws : undefined;
            resourceInputs["azure"] = state ? state.azure : undefined;
            resourceInputs["cloud"] = state ? state.cloud : undefined;
            resourceInputs["do"] = state ? state.do : undefined;
            resourceInputs["gcp"] = state ? state.gcp : undefined;
            resourceInputs["name"] = state ? state.name : undefined;
        } else {
            const args = argsOrState as CredentialsArgs | undefined;
            resourceInputs["aws"] = args?.aws ? pulumi.secret(args.aws) : undefined;
            resourceInputs["azure"] = args?.azure ? pulumi.secret(args.azure) : undefined;
            resourceInputs["do"] = args?.do ? pulumi.secret(args.do) : undefined;
            resourceInputs["gcp"] = args?.gcp ? pulumi.secret(args.gcp) : undefined;
            resourceInputs["name"] = args ? args.name : undefined;
            resourceInputs["cloud"] = undefined /*out*/;
        }
        opts = pulumi.mergeOptions(utilities.resourceOptsDefaults(), opts);
        const secretOpts = { additionalSecretOutputs: ["aws", "azure", "do", "gcp"] };
        opts = pulumi.mergeOptions(opts, secretOpts);
        super(Credentials.__pulumiType, name, resourceInputs, opts);
    }
}

/**
 * Input properties used for looking up and filtering Credentials resources.
 */
export interface CredentialsState {
    aws?: pulumi.Input<inputs.CredentialsAws>;
    azure?: pulumi.Input<inputs.CredentialsAzure>;
    cloud?: pulumi.Input<string>;
    do?: pulumi.Input<inputs.CredentialsDo>;
    gcp?: pulumi.Input<inputs.CredentialsGcp>;
    name?: pulumi.Input<string>;
}

/**
 * The set of arguments for constructing a Credentials resource.
 */
export interface CredentialsArgs {
    aws?: pulumi.Input<inputs.CredentialsAws>;
    azure?: pulumi.Input<inputs.CredentialsAzure>;
    do?: pulumi.Input<inputs.CredentialsDo>;
    gcp?: pulumi.Input<inputs.CredentialsGcp>;
    name?: pulumi.Input<string>;
}
