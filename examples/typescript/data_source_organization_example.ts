import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai"; // Use your actual package name if different

// Placeholder: Replace with the actual name of the organization you want to fetch.
// This might come from config or be hardcoded for the example.
const organizationName = "my-castai-organization-name";

// Use the correct data source function based on the SDK
const orgInfo = castai.getOrganizationDataSource({
    name: organizationName,
});

// Export the Organization ID retrieved from the data source.
// Accessing properties like 'id' is done via .then() as invokes return Promises.
export const retrievedOrganizationId = orgInfo.then(info => info.id);
// You can export other retrieved attributes as needed
export const retrievedOrganizationName = orgInfo.then(info => info.name); 