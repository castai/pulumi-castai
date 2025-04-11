import * as pulumi from "@pulumi/pulumi";
import * as schema from "@pulumi/pulumi/schema";

// Apply .NET-specific overlays
export function applyOverlays(docs: schema.DoctorOptions): schema.DoctorOptions {
    // Fix the ClusterToken naming conflict
    docs.csharpSpecific = docs.csharpSpecific || {};
    docs.csharpSpecific.propertyNames = docs.csharpSpecific.propertyNames || {};

    // Add a property name override for the ClusterToken property in the ClusterToken class
    docs.csharpSpecific.propertyNames["castai:index:ClusterToken.clusterToken"] = "TokenValue";

    console.log("Added C# property name override for ClusterToken.clusterToken");

    return docs;
}
