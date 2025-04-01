import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";

// Initialize the CAST AI provider
const provider = new castai.Provider("castai", {
    // API token will be read from the environment variable CASTAI_API_TOKEN
});

// Example EKS cluster configuration
const eksCluster = new castai.EksCluster("example-eks-cluster", {
    accountId: "123456789012", // Replace with your AWS account ID
    region: "us-west-2",       // Replace with your AWS region
    eksClusterName: "my-eks-cluster", // Replace with your EKS cluster name
    
    // The following values need to be replaced with actual values from your AWS account
    securityGroupId: "sg-12345678", 
    subnetIds: ["subnet-12345678", "subnet-87654321"],
});

// Configure autoscaling
const autoscaler = new castai.Autoscaler("example-autoscaler", {
    clusterId: eksCluster.id,
    enabled: true,
    unschedulablePods: [{
        enabled: true,
    }],
    nodeDownscaler: [{
        enabled: true,
        emptyNodes: [{
            delaySeconds: 300,
        }],
    }],
});

// Export the cluster ID
export const clusterId = eksCluster.id;
