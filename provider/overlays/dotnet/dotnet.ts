import * as pulumi from "@pulumi/pulumi";
import * as schema from "@pulumi/pulumi/schema";

// Apply .NET-specific overlays
export function applyOverlays(docs: schema.DoctorOptions): schema.DoctorOptions {
    // Fix the ClusterToken naming conflict
    docs.renames = docs.renames || [];
    docs.renames.push({
        from: "castai:index:ClusterToken/clusterToken",
        to: "TokenValue",
    });

    return docs;
}
