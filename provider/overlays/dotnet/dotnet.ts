import * as pulumi from "@pulumi/pulumi";
import * as schema from "@pulumi/pulumi/schema";

// Apply .NET-specific overlays
export function applyOverlays(docs: schema.DoctorOptions): schema.DoctorOptions {
    // Fix the ClusterToken naming conflict
    docs.renames = docs.renames || [];

    // Add a rename for the ClusterToken property in the ClusterToken resource
    docs.renames.push({
        from: "castai:index:ClusterToken/clusterToken",
        to: "TokenValue",
    });

    // Modify the schema directly
    if (docs.schema && docs.schema.resources) {
        // Find the ClusterToken resource
        const clusterTokenResource = docs.schema.resources["castai:index:ClusterToken"];

        if (clusterTokenResource && clusterTokenResource.properties && clusterTokenResource.properties.clusterToken) {
            console.log("Found ClusterToken resource, renaming property");

            // Rename the property
            clusterTokenResource.properties.tokenValue = clusterTokenResource.properties.clusterToken;
            delete clusterTokenResource.properties.clusterToken;

            // Update required properties
            if (clusterTokenResource.required) {
                const index = clusterTokenResource.required.indexOf("clusterToken");
                if (index !== -1) {
                    clusterTokenResource.required[index] = "tokenValue";
                }
            }

            // Update input properties
            if (clusterTokenResource.inputProperties && clusterTokenResource.inputProperties.clusterToken) {
                clusterTokenResource.inputProperties.tokenValue = clusterTokenResource.inputProperties.clusterToken;
                delete clusterTokenResource.inputProperties.clusterToken;
            }

            // Update state inputs
            if (clusterTokenResource.stateInputs &&
                clusterTokenResource.stateInputs.properties &&
                clusterTokenResource.stateInputs.properties.clusterToken) {
                clusterTokenResource.stateInputs.properties.tokenValue =
                    clusterTokenResource.stateInputs.properties.clusterToken;
                delete clusterTokenResource.stateInputs.properties.clusterToken;
            }

            console.log("Successfully renamed ClusterToken property in schema");
        }
    }

    return docs;
}
