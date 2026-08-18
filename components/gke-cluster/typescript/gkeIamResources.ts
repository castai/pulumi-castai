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
    clusterName: pulumi.Input<string>;

    /**
     * GCP project ID
     */
    projectId: pulumi.Input<string>;

    /**
     * GCP location (zone or region)
     */
    location: pulumi.Input<string>;

    /**
     * CAST AI cluster ID
     */
    clusterId: pulumi.Input<string>;

    /**
     * Opt in to CAST AI service-account impersonation. Not supported for GKE
     * because the upstream impersonation data source only supports AKS. When
     * set to `true`, the component emits a runtime `pulumi.log.warn` and
     * falls back to issuing a GCP JSON service-account key.
     */
    useImpersonation?: boolean;

    /**
     * Rotate the JSON service account key every N days by including a rotation
     * boundary in the key resource name, forcing Pulumi to replace it.
     *
     * The rotation suffix is derived from the current wall-clock boundary
     * (`floor(Date.now() / (keyRotationDays * 24h))`), so the key will be
     * replaced when the boundary advances even if no other input changes.
     */
    keyRotationDays?: number;
}

export class GkeIamResources extends pulumi.ComponentResource {
    public readonly serviceAccountEmail: pulumi.Output<string>;
    public readonly serviceAccountKey: pulumi.Output<string>;
    public readonly serviceAccountKeyName: pulumi.Output<string>;

    constructor(name: string, args: GkeIamArgs, opts?: pulumi.ComponentResourceOptions) {
        super("castai:index:GkeIamResources", name, {}, {
            aliases: [{ type: "castai:gke:GkeIamResources" }],
            additionalSecretOutputs: ["serviceAccountKey"],
            ...opts,
        } as pulumi.ComponentResourceOptions);

        const componentOpts = { parent: this };

        // =================================================================
        // Service Account for CAST AI
        // =================================================================

        // Derive name-based identifiers from the clusterName Output.
        const clusterNameOutput = pulumi.output(args.clusterName);

        // GCP service-account IDs must match ^[a-z](?:[-a-z0-9]{4,28}[a-z0-9])$
        // (6-30 chars, lowercase, must start with a letter, must end with
        // an alphanumeric character). Sanitize the cluster name before
        // interpolating it into the prefix `castai-gke-` so that
        // uppercase letters, underscores, dots and other characters are
        // replaced with `-`, consecutive dashes are collapsed, and any
        // leading/trailing non-letter characters are stripped.
        const accountId = clusterNameOutput.apply(clusterName => {
            const sanitizedClusterName = clusterName
                .toLowerCase()
                .replace(/[^a-z0-9]/g, "-")
                .replace(/-+/g, "-")
                .replace(/^[^a-z]+|[^a-z0-9]+$/g, "");

            let id = `castai-gke-${sanitizedClusterName}`.substring(0, 30);
            // Trim trailing hyphens so the result still matches the GCP regex
            // when truncation lands on a hyphen boundary.
            id = id.replace(/-+$/, "");

            // Final validation against GCP's regex.
            if (!/^[a-z](?:[-a-z0-9]{4,28}[a-z0-9])$/.test(id)) {
                throw new Error(
                    `Unable to derive a valid GCP service-account ID from cluster name "${clusterName}" ` +
                    `(sanitized to "${sanitizedClusterName}"). ` +
                    `Resulting accountId "${id}" does not match GCP's required pattern ` +
                    `^[a-z](?:[-a-z0-9]{4,28}[a-z0-9])$ (6-30 chars, lowercase, ` +
                    `must start with a letter and end with an alphanumeric character).`
                );
            }

            return id;
        });

        const displayName = pulumi.interpolate`CAST AI service account for ${args.clusterName}`;

        const serviceAccount = new gcp.serviceaccount.Account(`${name}-sa`, {
            accountId: accountId,
            displayName: displayName,
            project: args.projectId,
        }, componentOpts);

        this.serviceAccountEmail = serviceAccount.email;

        // =================================================================
        // Custom IAM Role: CAST AI Cluster Role
        // =================================================================

        const clusterRoleId = clusterNameOutput.apply(clusterName =>
            `castai_gke_${clusterName}_cluster`.replace(/-/g, "_").substring(0, 64)
        );
        const clusterRoleTitle = pulumi.interpolate`CAST AI GKE ${args.clusterName} Cluster Role`;

        const clusterRole = new gcp.projects.IAMCustomRole(`${name}-cluster-role`, {
            roleId: clusterRoleId,
            title: clusterRoleTitle,
            description: "Role for CAST AI to manage GKE cluster",
            project: args.projectId,
            permissions: [
                // GKE cluster management
                "container.clusters.get",
                "container.clusters.update",
                "container.operations.get",

                // Service usage for API discovery
                "serviceusage.services.list",

                // Resource manager
                "resourcemanager.projects.getIamPolicy",
            ],
        }, componentOpts);

        // =================================================================
        // Custom IAM Role: CAST AI Compute Role
        // =================================================================
        // Based on CAST AI documentation: https://docs.cast.ai/docs/cloud-permissions
        // CAST AI manages nodes via Instance Group Managers and Instance Templates,
        // not through container.nodePools.* permissions

        const computeRoleId = clusterNameOutput.apply(clusterName =>
            `castai_gke_${clusterName}_compute`.replace(/-/g, "_").substring(0, 64)
        );
        const computeRoleTitle = pulumi.interpolate`CAST AI GKE ${args.clusterName} Compute Role`;

        const computeRole = new gcp.projects.IAMCustomRole(`${name}-compute-role`, {
            roleId: computeRoleId,
            title: computeRoleTitle,
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
                "compute.instances.setServiceAccount",
                "compute.instances.setTags",
                "compute.instances.start",
                "compute.instances.stop",

                // Instance Group Manager (how GKE node pools are managed)
                "compute.instanceGroupManagers.get",
                "compute.instanceGroupManagers.update",
                "compute.instanceGroups.get",

                // Instance Templates (for node pool templates)
                "compute.instanceTemplates.create",
                "compute.instanceTemplates.delete",
                "compute.instanceTemplates.get",
                "compute.instanceTemplates.list",

                // Disk management
                "compute.disks.create",
                "compute.disks.get",
                "compute.disks.list",
                "compute.disks.setLabels",
                "compute.disks.use",

                // Network management
                "compute.addresses.use",
                "compute.subnetworks.get",
                "compute.subnetworks.use",
                "compute.subnetworks.useExternalIp",
                "compute.networks.get",
                "compute.networks.use",

                // Zone/region operations
                "compute.zones.get",
                "compute.zones.list",
                "compute.regions.get",
                "compute.regions.list",
                "compute.zoneOperations.get",
                "compute.regionOperations.get",

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

        // GKE impersonation fallback: the upstream CAST AI impersonation data
        // source only supports AKS, so impersonation is not supported for GKE.
        // Emit a runtime warning so users understand that a JSON service-account
        // key is still issued (and should be treated as a secret).
        if (args.useImpersonation) {
            pulumi.log.warn(
                "useImpersonation is not supported for GKE: the upstream CAST AI " +
                "impersonation data source only supports AKS. A GCP JSON " +
                "service-account key will still be issued for authentication.",
                this
            );
        }

        // Key rotation: when enabled, derive a rotation boundary from the current
        // wall-clock time and embed it in the resource name so Pulumi replaces
        // the key once the boundary advances (i.e. roughly every keyRotationDays
        // days). The rotation suffix is computed as
        // `floor(Date.now() / (keyRotationDays * 24h))`, so the key resource
        // will be replaced when the boundary advances even if no other input
        // changes (for example, every keyRotationDays days). This means a
        // `pulumi up` run after the boundary has passed will destroy and
        // recreate the key.
        const rotationSuffix = args.keyRotationDays && args.keyRotationDays > 0
            ? Math.floor(Date.now() / (args.keyRotationDays * 24 * 60 * 60 * 1000)).toString()
            : undefined;
        const keyResourceName = rotationSuffix !== undefined
            ? `${name}-key-${rotationSuffix}`
            : `${name}-key`;

        const serviceAccountKey = new gcp.serviceaccount.Key(keyResourceName, {
            serviceAccountId: serviceAccount.name,
        }, componentOpts);

        this.serviceAccountKeyName = pulumi.output(keyResourceName);

        // Decode the private key (base64 encoded credentials.json)
        this.serviceAccountKey = pulumi.secret(serviceAccountKey.privateKey.apply(key =>
            Buffer.from(key, "base64").toString("utf-8")
        ));

        this.registerOutputs({
            serviceAccountEmail: this.serviceAccountEmail,
            serviceAccountKey: this.serviceAccountKey,
            serviceAccountKeyName: this.serviceAccountKeyName,
        });
    }
}
