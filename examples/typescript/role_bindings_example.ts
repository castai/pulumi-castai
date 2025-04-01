import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi-castai"; // Use your actual package name

// Placeholder: Replace with actual IDs
const orgId = "your-castai-org-id"; // Can be fetched using getOrganization data source
const clusterId = "your-cluster-id";
const ownerRoleId = "3e1050c7-6593-4298-94bb-154637911d78"; // From TF example
const viewerRoleId = "6fc95bd7-6049-4735-80b0-ce5ccde71cb1"; // From TF example
const userId1 = "user-id-1";
const userId2 = "user-id-2";
const groupId = "group-id-1";
const serviceAccountId = "service-account-id-1";

// Assuming the resource is castai.organization.RoleBindings
const orgOwnerBinding = new castai.organization.RoleBindings("org-owner-binding", {
    organizationId: orgId,
    name: "Organization Owner Binding",
    description: "Assigns Owner role at the organization scope",
    roleId: ownerRoleId,
    scope: {
        kind: "organization",
        resourceId: orgId,
    },
    subjects: [
        { kind: "user", userId: userId1 },
        { kind: "group", groupId: groupId },
        { kind: "service_account", serviceAccountId: serviceAccountId },
    ],
});

const clusterViewerBinding = new castai.organization.RoleBindings("cluster-viewer-binding", {
    organizationId: orgId, // Still need org ID context
    name: "Cluster Viewer Binding",
    description: `Assigns Viewer role scoped to cluster ${clusterId}`,
    roleId: viewerRoleId,
    scope: {
        kind: "cluster",
        resourceId: clusterId,
    },
    subjects: [
        { kind: "user", userId: userId2 },
    ],
});

// Export the IDs of the created bindings
export const orgOwnerBindingId = orgOwnerBinding.id;
export const clusterViewerBindingId = clusterViewerBinding.id; 