import * as pulumi from "@pulumi/pulumi";
import * as schema from "@pulumi/pulumi/schema";

// Apply .NET-specific overlays
export function applyOverlays(docs: schema.DoctorOptions): schema.DoctorOptions {
    // Fix the ClusterToken naming conflict
    docs.renames = docs.renames || [];

    // Try multiple approaches to fix the naming conflict
    docs.renames.push({
        from: "castai:index:ClusterToken/clusterToken",
        to: "TokenValue",
    });

    // Alternative approach with property path
    docs.renames.push({
        from: "castai:index:ClusterToken.clusterToken",
        to: "TokenValue",
    });

    // Try with full resource path
    docs.renames.push({
        from: "castai:index/clusterToken:ClusterToken.clusterToken",
        to: "TokenValue",
    });

    // Try with just the property name
    docs.renames.push({
        from: "clusterToken",
        to: "TokenValue",
    });

    // Direct schema modification approach
    if (docs.schema && docs.schema.resources) {
        // Find the ClusterToken resource
        const resourceValues = Object.keys(docs.schema.resources).map(key => docs.schema.resources[key]);
        const clusterTokenResource = resourceValues.find(
            (resource: any) => resource.token === "castai:index:ClusterToken" ||
                       resource.token === "castai:index/clusterToken:ClusterToken"
        );

        // If found, rename the property in its properties
        if (clusterTokenResource && clusterTokenResource.properties) {
            // If there's a property named clusterToken, rename it to tokenValue
            if (clusterTokenResource.properties.clusterToken) {
                clusterTokenResource.properties.tokenValue = clusterTokenResource.properties.clusterToken;
                delete clusterTokenResource.properties.clusterToken;

                // Also update any required properties
                if (clusterTokenResource.required) {
                    const index = clusterTokenResource.required.indexOf("clusterToken");
                    if (index !== -1) {
                        clusterTokenResource.required[index] = "tokenValue";
                    }
                }

                console.log("Successfully renamed ClusterToken property in schema");
            }
        }
    }

    return docs;
}
