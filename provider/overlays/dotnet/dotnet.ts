import * as pulumi from "@pulumi/pulumi";
import * as schema from "@pulumi/pulumi/schema";

// Apply .NET-specific overlays
export function applyOverlays(docs: schema.DoctorOptions): schema.DoctorOptions {
    // We're now fixing the ClusterToken naming conflict at the schema level
    // No need for additional overlays here
    return docs;
}
