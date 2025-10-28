/**
 * GkeIamResources - IAM Component for GKE Cluster
 *
 * Creates GCP IAM resources required for CAST AI to manage a GKE cluster:
 * - Service account for CAST AI
 * - Custom IAM roles with required permissions
 * - IAM bindings to grant permissions
 * - Service account key for authentication
 */

import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

export interface GkeIamArgs {
    /**
     * GKE cluster name
     */
    clusterName: string;

    /**
     * GCP project ID
     */
    projectId: pulumi.Input<string>;

    /**
     * GCP location (zone or region)
     */
    location: string;

    /**
     * CAST AI cluster ID
     */
    clusterId: pulumi.Input<string>;
}

export class GkeIamResources extends pulumi.ComponentResource {
    public readonly serviceAccountEmail: pulumi.Output<string>;
    public readonly serviceAccountKey: pulumi.Output<string>;

    constructor(name: string, args: GkeIamArgs, opts?: pulumi.ComponentResourceOptions) {
        super("castai:gke:GkeIamResources", name, {}, opts);

        const componentOpts = { parent: this };

        // =================================================================
        // Service Account for CAST AI
        // =================================================================

        const serviceAccount = new gcp.serviceaccount.Account(`${name}-sa`, {
            accountId: `castai-gke-${args.clusterName}`.substring(0, 30), // Max 30 chars
            displayName: `CAST AI service account for ${args.clusterName}`,
            project: args.projectId,
        }, componentOpts);

        this.serviceAccountEmail = serviceAccount.email;

        // =================================================================
        // Custom IAM Role: CAST AI Cluster Role
        // =================================================================

        const clusterRole = new gcp.projects.IAMCustomRole(`${name}-cluster-role`, {
            roleId: `castai_gke_${args.clusterName}_cluster`.replace(/-/g, "_").substring(0, 64),
            title: `CAST AI GKE ${args.clusterName} Cluster Role`,
            description: "Role for CAST AI to manage GKE cluster",
            project: args.projectId,
            permissions: [
                // GKE cluster management
                "container.clusters.get",
                "container.clusters.update",
                "container.operations.get",
                "container.operations.list",

                // Node pool management
                "container.nodePools.create",
                "container.nodePools.delete",
                "container.nodePools.get",
                "container.nodePools.list",
                "container.nodePools.update",

                // Kubernetes Engine
                "container.pods.get",
                "container.pods.list",
                "container.nodes.get",
                "container.nodes.list",
            ],
        }, componentOpts);

        // =================================================================
        // Custom IAM Role: CAST AI Compute Role
        // =================================================================

        const computeRole = new gcp.projects.IAMCustomRole(`${name}-compute-role`, {
            roleId: `castai_gke_${args.clusterName}_compute`.replace(/-/g, "_").substring(0, 64),
            title: `CAST AI GKE ${args.clusterName} Compute Role`,
            description: "Role for CAST AI to manage compute resources",
            project: args.projectId,
            permissions: [
                // Compute instance management
                "compute.instances.create",
                "compute.instances.delete",
                "compute.instances.get",
                "compute.instances.list",
                "compute.instances.setLabels",
                "compute.instances.setMetadata",
                "compute.instances.setTags",
                "compute.instances.start",
                "compute.instances.stop",

                // Disk management
                "compute.disks.create",
                "compute.disks.get",
                "compute.disks.list",
                "compute.disks.setLabels",

                // Network management
                "compute.subnetworks.use",
                "compute.subnetworks.useExternalIp",
                "compute.networks.get",

                // Zone/region operations
                "compute.zones.get",
                "compute.zones.list",
                "compute.regions.get",
                "compute.regions.list",

                // Machine types
                "compute.machineTypes.get",
                "compute.machineTypes.list",

                // Images
                "compute.images.get",
                "compute.images.list",
                "compute.images.useReadOnly",
            ],
        }, componentOpts);

        // =================================================================
        // IAM Bindings: Grant Roles to Service Account
        // =================================================================

        // Bind cluster role
        new gcp.projects.IAMMember(`${name}-cluster-binding`, {
            project: args.projectId,
            role: pulumi.interpolate`projects/${args.projectId}/roles/${clusterRole.roleId}`,
            member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
        }, componentOpts);

        // Bind compute role
        new gcp.projects.IAMMember(`${name}-compute-binding`, {
            project: args.projectId,
            role: pulumi.interpolate`projects/${args.projectId}/roles/${computeRole.roleId}`,
            member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
        }, componentOpts);

        // Bind Service Account User role (to impersonate service accounts)
        new gcp.projects.IAMMember(`${name}-sa-user-binding`, {
            project: args.projectId,
            role: "roles/iam.serviceAccountUser",
            member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
        }, componentOpts);

        // =================================================================
        // Service Account Key for Authentication
        // =================================================================

        const serviceAccountKey = new gcp.serviceaccount.Key(`${name}-key`, {
            serviceAccountId: serviceAccount.name,
        }, componentOpts);

        // Decode the private key (base64 encoded credentials.json)
        this.serviceAccountKey = serviceAccountKey.privateKey.apply(key =>
            Buffer.from(key, "base64").toString("utf-8")
        );

        this.registerOutputs({
            serviceAccountEmail: this.serviceAccountEmail,
            serviceAccountKey: this.serviceAccountKey,
        });
    }
}
