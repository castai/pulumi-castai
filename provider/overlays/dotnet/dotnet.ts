import * as pulumi from "@pulumi/pulumi";
import * as schema from "@pulumi/pulumi/schema";
import * as fs from "fs";
import * as path from "path";

// Apply .NET-specific overlays
export function applyOverlays(docs: schema.DoctorOptions): schema.DoctorOptions {
    // Fix the ClusterToken naming conflict
    docs.csharpSpecific = docs.csharpSpecific || {};
    docs.csharpSpecific.propertyNames = docs.csharpSpecific.propertyNames || {};

    // Add a property name override for the ClusterToken property in the ClusterToken class
    docs.csharpSpecific.propertyNames["castai:index:ClusterToken.clusterToken"] = "TokenValue";

    // Add a post-generation hook to replace the ClusterToken.cs file with our custom template
    docs.postCodegenHook = async (outDir: string) => {
        console.log("Running post-codegen hook for .NET SDK");

        // Path to our custom template
        const templatePath = path.join(__dirname, "templates", "ClusterToken.cs");

        // Path to the generated file
        const generatedPath = path.join(outDir, "ClusterToken.cs");

        // Check if our template exists
        if (fs.existsSync(templatePath)) {
            console.log(`Custom template found at ${templatePath}`);

            // Check if the generated file exists
            if (fs.existsSync(generatedPath)) {
                console.log(`Generated file found at ${generatedPath}`);

                // Read our custom template
                const template = fs.readFileSync(templatePath, "utf8");

                // Write our custom template to the generated file
                fs.writeFileSync(generatedPath, template);

                console.log(`Successfully replaced ${generatedPath} with custom template`);
            } else {
                console.error(`Generated file not found at ${generatedPath}`);
            }
        } else {
            console.error(`Custom template not found at ${templatePath}`);
        }
    };

    console.log("Added C# property name override and post-codegen hook for ClusterToken.clusterToken");

    return docs;
}
