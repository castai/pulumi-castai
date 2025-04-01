import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi-castai"; // Use your actual package name

// Assuming the invoke is directly under castai and takes no arguments
const gkePolicies = castai.getGkeUserPolicies({}); // Empty args object might be needed

// Export details retrieved from the data source.
// Adjust exported properties based on the actual return value.
// It might return a JSON string or a structured object.
export const retrievedGkePolicies = gkePolicies.then(p => p.policyJson || p.policies); // Example property names 