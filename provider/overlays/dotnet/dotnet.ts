import * as pulumi from "@pulumi/pulumi";
import * as schema from "@pulumi/pulumi/schema";

// Apply .NET-specific overlays
export function applyOverlays(docs: schema.DoctorOptions): schema.DoctorOptions {
    // Set the correct package ID for the .NET SDK
    if (!docs.csharpSpecific) {
        docs.csharpSpecific = {};
    }
    docs.csharpSpecific.packageName = "CASTAI.Pulumi";

    // Fix the ClusterToken naming conflict
    docs.csharpSpecific.propertyNames = docs.csharpSpecific.propertyNames || {};
    docs.csharpSpecific.propertyNames["castai:index:ClusterToken.clusterToken"] = "TokenValue";

    console.log("Applied .NET overlays: Set package name to CASTAI.Pulumi and fixed ClusterToken naming conflict");

    return docs;
}
