package main

import (
	"fmt"

	"github.com/castai/pulumi-castai/sdk/go/castai/organization" // Assuming organization module
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runRoleBindingsExample demonstrates creating role bindings.
// Renamed from main to avoid conflicts.
func runRoleBindingsExample(ctx *pulumi.Context) error {
	// Placeholder: Replace with actual IDs
	orgId := "your-castai-org-id" // Can be fetched using LookupOrganization data source
	clusterId := "your-cluster-id"
	ownerRoleId := "3e1050c7-6593-4298-94bb-154637911d78"  // From TF example
	viewerRoleId := "6fc95bd7-6049-4735-80b0-ce5ccde71cb1" // From TF example
	userId1 := "user-id-1"
	userId2 := "user-id-2"
	groupId := "group-id-1"
	serviceAccountId := "service-account-id-1"

	// Assuming the resource is organization.NewRoleBindings
	orgOwnerBinding, err := organization.NewRoleBindings(ctx, "org-owner-binding", &organization.RoleBindingsArgs{
		OrganizationId: pulumi.String(orgId),
		Name:           pulumi.String("Organization Owner Binding"),
		Description:    pulumi.String("Assigns Owner role at the organization scope"),
		RoleId:         pulumi.String(ownerRoleId),
		Scope: &organization.RoleBindingsScopeArgs{
			Kind:       pulumi.String("organization"),
			ResourceId: pulumi.String(orgId),
		},
		Subjects: organization.RoleBindingsSubjectArray{
			&organization.RoleBindingsSubjectArgs{Kind: pulumi.String("user"), UserId: pulumi.String(userId1)},
			&organization.RoleBindingsSubjectArgs{Kind: pulumi.String("group"), GroupId: pulumi.String(groupId)},
			&organization.RoleBindingsSubjectArgs{Kind: pulumi.String("service_account"), ServiceAccountId: pulumi.String(serviceAccountId)},
		},
	})
	if err != nil {
		return err
	}

	clusterViewerBinding, err := organization.NewRoleBindings(ctx, "cluster-viewer-binding", &organization.RoleBindingsArgs{
		OrganizationId: pulumi.String(orgId), // Still need org ID context
		Name:           pulumi.String("Cluster Viewer Binding"),
		Description:    pulumi.String(fmt.Sprintf("Assigns Viewer role scoped to cluster %s", clusterId)),
		RoleId:         pulumi.String(viewerRoleId),
		Scope: &organization.RoleBindingsScopeArgs{
			Kind:       pulumi.String("cluster"),
			ResourceId: pulumi.String(clusterId),
		},
		Subjects: organization.RoleBindingsSubjectArray{
			&organization.RoleBindingsSubjectArgs{Kind: pulumi.String("user"), UserId: pulumi.String(userId2)},
		},
	})
	if err != nil {
		return err
	}

	// Export the IDs of the created bindings
	ctx.Export("org_owner_binding_id", orgOwnerBinding.ID())
	ctx.Export("cluster_viewer_binding_id", clusterViewerBinding.ID())

	return nil
}

/*
// Example of how you might call this from your main function:
func main() {
    pulumi.Run(func(ctx *pulumi.Context) error {
        if err := runRoleBindingsExample(ctx); err != nil {
            return err
        }
        // ... potentially call other example functions ...
        return nil
    })
}
*/
