import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi-castai"; // Use your actual package name
import * as aws from "@pulumi/aws"; // To get caller identity

// Placeholder values
const clusterRegion = "us-west-2";
const clusterName = "my-production-eks";

// Get current AWS Account ID
const callerIdentity = aws.getCallerIdentity({});
const accountId = callerIdentity.then(id => id.accountId);

// Get the CAST AI Cluster ID for the EKS cluster
const castaiClusterId = new castai.EksClusterid("example-ts-eks-clusterid", {
    accountId: accountId,
    region: clusterRegion,
    clusterName: clusterName,
});

// Get the required User ARN using the CAST AI Cluster ID
const castaiUserArn = new castai.EksUserArn("example-ts-eks-userarn", {
    clusterId: castaiClusterId.id, // Use the output from the previous resource
});

// Export the Cluster ID and User ARN
export const eksCastaiClusterId = castaiClusterId.id;
export const eksCastaiUserArn = castaiUserArn.arn; // Assuming the output property is 'arn' 