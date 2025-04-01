package main

import (
	"github.com/castai/pulumi-castai/sdk/go/castai/organization"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// runOrganizationExample demonstrates creating organization members and groups.
// Note: This function is not 'main' to avoid conflicts if other .go files
// in this directory also have a 'main' function. You might need to call
// this from your actual main entry point or run this file standalone.
func runOrganizationExample(ctx *pulumi.Context) error {
	// Note: Provider configuration (API token) is typically handled via environment
	// variables (e.g., CASTAI_API_TOKEN) or Pulumi config.

	// Manage organization members directly
	// This resource manages the entire list of members for the specified roles.
	// Use with caution, as it will overwrite existing members not specified here.
	orgMembers, err := organization.NewMembers(ctx, "example-org-members", &organization.MembersArgs{
		Members: organization.MembersMemberArray{
			&organization.MembersMemberArgs{
				Email: pulumi.String("admin.user@example.com"),
				Role:  pulumi.String("admin"),
			},
			&organization.MembersMemberArgs{
				Email: pulumi.String("dev.user@example.com"),
				Role:  pulumi.String("editor"),
			},
			&organization.MembersMemberArgs{
				Email: pulumi.String("view.user@example.com"),
				Role:  pulumi.String("viewer"),
			},
		},
	})
	if err != nil {
		return err
	}

	// Create an organization group
	orgGroup, err := organization.NewGroup(ctx, "example-devops-group", &organization.GroupArgs{
		Name:        pulumi.String("DevOps Team"),
		Description: pulumi.String("Group for DevOps engineers managing infrastructure"),
		MemberEmails: pulumi.StringArray{
			pulumi.String("devops1@example.com"),
			pulumi.String("devops2@example.com"),
			// You can add users who might also be managed directly above,
			// group membership is additive.
			pulumi.String("dev.user@example.com"),
		},
	})
	if err != nil {
		return err
	}

	ctx.Export("org_group_id", orgGroup.ID())
	ctx.Export("org_group_name", orgGroup.Name)

	// Reference the members resource to ensure it's created, even if not exported
	ctx.Export("org_members_id_ref", orgMembers.ID())

	// Note: For managing members, castai.organization.Members provides a declarative
	// way to set the *entire* list of members per role.
	// For adding/removing individual members without affecting others,
	// other mechanisms or resources might be needed depending on the provider's capabilities.
	// Similarly, castai.organization.Group manages the member list declaratively.

	return nil
}

// Example of how you might call this from your main function:
/*
func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		if err := runOrganizationExample(ctx); err != nil {
			return err
		}
		// ... potentially call other example functions ...
		return nil
	})
}
*/
