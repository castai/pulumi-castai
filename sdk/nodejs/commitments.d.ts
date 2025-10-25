import * as pulumi from "@pulumi/pulumi";
import * as inputs from "./types/input";
import * as outputs from "./types/output";
export declare class Commitments extends pulumi.CustomResource {
    /**
     * Get an existing Commitments resource's state with the given name, ID, and optional extra
     * properties used to qualify the lookup.
     *
     * @param name The _unique_ name of the resulting resource.
     * @param id The _unique_ provider ID of the resource to lookup.
     * @param state Any extra arguments used during the lookup.
     * @param opts Optional settings to control the behavior of the CustomResource.
     */
    static get(name: string, id: pulumi.Input<pulumi.ID>, state?: CommitmentsState, opts?: pulumi.CustomResourceOptions): Commitments;
    /**
     * Returns true if the given object is an instance of Commitments.  This is designed to work even
     * when multiple copies of the Pulumi SDK have been loaded into the same process.
     */
    static isInstance(obj: any): obj is Commitments;
    /**
     * List of Azure reservations.
     */
    readonly azureReservations: pulumi.Output<outputs.CommitmentsAzureReservation[]>;
    /**
     * CSV file containing reservations exported from Azure.
     */
    readonly azureReservationsCsv: pulumi.Output<string | undefined>;
    /**
     * List of commitment configurations.
     */
    readonly commitmentConfigs: pulumi.Output<outputs.CommitmentsCommitmentConfig[] | undefined>;
    /**
     * List of GCP CUDs.
     */
    readonly gcpCuds: pulumi.Output<outputs.CommitmentsGcpCud[]>;
    /**
     * JSON file containing CUDs exported from GCP.
     */
    readonly gcpCudsJson: pulumi.Output<string | undefined>;
    /**
     * Create a Commitments resource with the given unique name, arguments, and options.
     *
     * @param name The _unique_ name of the resource.
     * @param args The arguments to use to populate this resource's properties.
     * @param opts A bag of options that control this resource's behavior.
     */
    constructor(name: string, args?: CommitmentsArgs, opts?: pulumi.CustomResourceOptions);
}
/**
 * Input properties used for looking up and filtering Commitments resources.
 */
export interface CommitmentsState {
    /**
     * List of Azure reservations.
     */
    azureReservations?: pulumi.Input<pulumi.Input<inputs.CommitmentsAzureReservation>[]>;
    /**
     * CSV file containing reservations exported from Azure.
     */
    azureReservationsCsv?: pulumi.Input<string>;
    /**
     * List of commitment configurations.
     */
    commitmentConfigs?: pulumi.Input<pulumi.Input<inputs.CommitmentsCommitmentConfig>[]>;
    /**
     * List of GCP CUDs.
     */
    gcpCuds?: pulumi.Input<pulumi.Input<inputs.CommitmentsGcpCud>[]>;
    /**
     * JSON file containing CUDs exported from GCP.
     */
    gcpCudsJson?: pulumi.Input<string>;
}
/**
 * The set of arguments for constructing a Commitments resource.
 */
export interface CommitmentsArgs {
    /**
     * CSV file containing reservations exported from Azure.
     */
    azureReservationsCsv?: pulumi.Input<string>;
    /**
     * List of commitment configurations.
     */
    commitmentConfigs?: pulumi.Input<pulumi.Input<inputs.CommitmentsCommitmentConfig>[]>;
    /**
     * JSON file containing CUDs exported from GCP.
     */
    gcpCudsJson?: pulumi.Input<string>;
}
