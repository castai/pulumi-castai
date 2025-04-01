import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai"; // Use your actual package name if different

// Placeholder: Replace with the actual cluster ID you want to fetch settings for.
// This might come from another resource, config, or be hardcoded for the example.
const clusterId = "your-cast-ai-cluster-id";

// Using the correct data source function to fetch EKS settings
const eksSettings = pulumi.output(castai.getEksSettingsDataSource());

// Export only properties that exist on the result
export const eksDetails = eksSettings.apply(settings => settings.id);

// Use simple exports to demonstrate the concept
export const eksOutput = eksSettings; 