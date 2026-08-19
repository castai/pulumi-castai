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

/**
 * Sanitize a cluster name into a token that is safe to embed in identifiers
 * that must obey GCP naming rules.
 *
 * Behavior:
 *   - lowercases the input,
 *   - replaces every character outside `[a-z0-9]` with `_`,
 *   - collapses runs of consecutive `_` into a single `_`,
 *   - strips any leading/trailing characters that are not lowercase letters
 *     or digits so the result can be safely prefixed/suffixed.
 *
 * This matches the sanitization used to derive the GCP service-account ID
 * (`castai-gke-<sanitized>`) and is reused for the custom IAM role IDs so
 * that the same cluster name produces deterministic, well-formed identifiers
 * across all three resources.
 */
function sanitizeClusterName(clusterName: string): string {
    return clusterName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^[^a-z]+|[^a-z0-9]+$/g, "");
}

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
     *
     * NOTE: `useImpersonation` must be known at component construction time
     * because it is inspected synchronously to decide whether to emit the
     * runtime warning. It is not a `pulumi.Input<boolean>`.
     */
    useImpersonation?: boolean;

    /**
     * Rotate the JSON service account key every N days by including a rotation
     * boundary in the key resource name, forcing Pulumi to replace it.
     *
     * The rotation suffix is derived from the current wall-clock boundary
     * (`floor(Date.now() / (keyRotationDays * 24h))`), so the key will be
     * replaced when the boundary advances even if no other input changes.
     *
     * NOTE: `keyRotationDays` must be known at component construction time
     * because the rotation suffix is computed synchronously at instantiation
     * to decide whether to embed it in the key resource name. It is not a
     * `pulumi.Input<number>`.
     */
    keyRotationDays?: number;

    /**
     * Explicit rotation boundary index used to derive the service-account key
     * resource name. When provided, the key resource name embeds this value
     * verbatim (e.g. `${name}-key-${rotationBoundary}`) so callers can pin the
     * rotation cycle to a deterministic schedule independent of the wall-clock
     * time at which the component is instantiated.
     *
     * When omitted, the component falls back to
     * `floor(Date.now() / (keyRotationDays * 24h))` (provided `keyRotationDays`
     * is set) so that rotation happens whenever the wall-clock boundary
     * advances.
     *
     * NOTE: `rotationBoundary` is a plain number, not a `pulumi.Input<number>`;
     * it must be known at component construction time.
     */
    rotationBoundary?: number;
}

export class GkeIamResources extends pulumi.ComponentResource {
    public readonly serviceAccountEmail: pulumi.Output<string>;
    public readonly serviceAccountKey: pulumi.Output<string>;
    public readonly serviceAccountKeyName: pulumi.Output<string>;

    constructor(name: string, args: GkeIamArgs, opts?: pulumi.ComponentResourceOptions) {
        super("castai:index:GkeIamResources", name, {}, {
            ...opts,
            aliases: [...(opts?.aliases ?? []), { type: "castai:gke:GkeIamResources" }],
            additionalSecretOutputs: [...((opts as pulumi.CustomResourceOptions | undefined)?.additionalSecretOutputs ?? []), "serviceAccountKey"],
        } as pulumi.CustomResourceOptions);

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

        const clusterRoleId = clusterNameOutput.apply(clusterName => {
            // GCP custom role IDs allow `[a-zA-Z0-9_.]` and must be <= 64 chars.
            // We reuse the same lowercase sanitization applied to `accountId`
            // so the role ID is derived consistently from the cluster name and
            // any uppercase letters, dashes or other invalid characters in the
            // cluster name are collapsed to `_` before trimming.
            const sanitized = sanitizeClusterName(clusterName);
            let id = `castai_gke_${sanitized}_cluster`;
            if (id.length > 64) {
                id = id.substring(0, 64);
            }
            // Strip trailing `_` so the result still ends on an alphanumeric
            // boundary if truncation lands between separators.
            id = id.replace(/_+$/, "");
            return id;
        });
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

        const computeRoleId = clusterNameOutput.apply(clusterName => {
            // Same GCP custom-role sanitization as `clusterRoleId`: lowercase,
            // collapse invalid characters to `_`, trim to 64 chars, strip any
            // trailing separators.
            const sanitized = sanitizeClusterName(clusterName);
            let id = `castai_gke_${sanitized}_compute`;
            if (id.length > 64) {
                id = id.substring(0, 64);
            }
            id = id.replace(/_+$/, "");
            return id;
        });
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

        // Key rotation: derive a rotation boundary and embed it in the resource
        // name so Pulumi replaces the key when the boundary advances. The
        // rotation suffix is resolved in this priority order:
        //
        //   1. `args.rotationBoundary` — explicit caller-provided boundary
        //      index. When set, this value is used verbatim and any
        //      `keyRotationDays` value is ignored for the purpose of computing
        //      the suffix. Callers use this to pin rotation to a deterministic
        //      schedule independent of the wall-clock time at instantiation.
        //
        //   2. `args.keyRotationDays` — derive the boundary index from the
        //      current wall-clock time using
        //      `floor(Date.now() / (keyRotationDays * 24h))`. The key is then
        //      replaced whenever that boundary advances, i.e. roughly every
        //      `keyRotationDays` days. This means a `pulumi up` run after the
        //      boundary has passed will destroy and recreate the key.
        //
        //   3. Neither — no rotation suffix is appended.
        let rotationSuffix: string | undefined;
        if (typeof args.rotationBoundary === "number" && Number.isFinite(args.rotationBoundary)) {
            rotationSuffix = args.rotationBoundary.toString();
        } else if (args.keyRotationDays && args.keyRotationDays > 0) {
            rotationSuffix = Math.floor(Date.now() / (args.keyRotationDays * 24 * 60 * 60 * 1000)).toString();
        }
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
