import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi-castai";

// Initialize the CAST AI provider
const provider = new castai.Provider("castai", {
    // API token will be read from the environment variable CASTAI_API_TOKEN
});

// Create AWS resources
const eksCluster = new castai.aws.EksCluster("aws-cluster", {
    accountId: "123456789012",
    region: "us-west-2",
    eksClusterName: "eks-cluster",
    securityGroupId: "sg-12345678", 
    subnetIds: ["subnet-12345678", "subnet-87654321"],
});

// Create GCP resources
const gkeCluster = new castai.gcp.GkeCluster("gcp-cluster", {
    projectId: "my-gcp-project",
    location: "us-central1",
    clusterName: "gke-cluster",
});

// Create Azure resources
const aksCluster = new castai.azure.AksCluster("azure-cluster", {
    subscriptionId: "00000000-0000-0000-0000-000000000000",
    resourceGroupName: "my-resource-group",
    clusterName: "aks-cluster",
    location: "eastus",
    tenantId: "00000000-0000-0000-0000-000000000000",
});

// Configure AWS IAM
const awsIamPolicy = new castai.iam.AwsIamPolicy("aws-iam-policy", {
    accountId: "123456789012",
    policyDocument: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    "ec2:DescribeInstances",
                    "ec2:RunInstances",
                    "ec2:TerminateInstances",
                    "ec2:CreateTags",
                    "iam:PassRole",
                    "eks:DescribeCluster"
                ],
                Resource: "*"
            }
        ]
    })
});

const awsIamRole = new castai.iam.AwsIamRole("aws-iam-role", {
    accountId: "123456789012",
    assumeRolePolicyDocument: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: {
                    Service: "castai.amazonaws.com"
                },
                Action: "sts:AssumeRole",
                Condition: {
                    StringEquals: {
                        "sts:ExternalId": "${eksCluster.id}"
                    }
                }
            }
        ]
    }),
    attachedPolicies: [awsIamPolicy.arn]
});

// Configure AWS IAM User (alternative approach)
const awsIamUser = new castai.iam.AwsIamUser("aws-iam-user", {
    accountId: "123456789012",
    username: "castai-automation",
    policyArns: [awsIamPolicy.arn],
});

// Configure GCP IAM
const gcpServiceAccount = new castai.iam.GcpServiceAccount("gcp-service-account", {
    projectId: "my-gcp-project",
    serviceAccountId: "castai-service-account",
    serviceAccountName: "CAST AI Service Account",
    description: "Service account for CAST AI integration",
});

const gcpIamRole = new castai.iam.GcpIamRole("gcp-iam-role", {
    projectId: "my-gcp-project",
    roleName: "castai.clusterManager",
    title: "CAST AI Cluster Manager",
    description: "Role for CAST AI to manage GKE clusters",
    permissions: [
        "container.clusters.get",
        "container.clusters.list",
        "container.clusters.update",
        "container.operations.get",
        "container.operations.list",
        "compute.instances.create",
        "compute.instances.delete",
        "compute.instances.get",
        "compute.instances.list",
        "compute.instances.setMetadata",
        "compute.instances.setTags"
    ]
});

const gcpIamPolicy = new castai.iam.GcpIamPolicy("gcp-iam-policy", {
    projectId: "my-gcp-project",
    policyJson: JSON.stringify({
        bindings: [
            {
                role: gcpIamRole.roleName.apply(name => `projects/my-gcp-project/roles/${name}`),
                members: [
                    gcpServiceAccount.serviceAccountId.apply(id => `serviceAccount:${id}@my-gcp-project.iam.gserviceaccount.com`)
                ]
            }
        ]
    }),
});

// Configure Azure IAM
const azureIamRole = new castai.iam.AzureIamRole("azure-iam-role", {
    subscriptionId: "00000000-0000-0000-0000-000000000000",
    roleName: "CastAIClusterManager",
    roleDefinition: JSON.stringify({
        name: "CAST AI Cluster Manager",
        description: "Role for CAST AI to manage AKS clusters",
        assignableScopes: [
            "/subscriptions/00000000-0000-0000-0000-000000000000"
        ],
        permissions: [
            {
                actions: [
                    "Microsoft.ContainerService/managedClusters/read",
                    "Microsoft.ContainerService/managedClusters/write",
                    "Microsoft.ContainerService/managedClusters/agentPools/read",
                    "Microsoft.ContainerService/managedClusters/agentPools/write",
                    "Microsoft.Compute/virtualMachines/read",
                    "Microsoft.Compute/virtualMachines/write",
                    "Microsoft.Compute/virtualMachines/delete",
                    "Microsoft.Compute/disks/read",
                    "Microsoft.Compute/disks/write",
                    "Microsoft.Compute/disks/delete",
                    "Microsoft.Network/networkInterfaces/read",
                    "Microsoft.Network/networkInterfaces/write",
                    "Microsoft.Network/networkInterfaces/delete"
                ],
                notActions: [],
            }
        ],
    }),
});

const azureIamPolicy = new castai.iam.AzureIamPolicy("azure-iam-policy", {
    subscriptionId: "00000000-0000-0000-0000-000000000000",
    policyJson: JSON.stringify({
        // Azure policy configuration
    }),
});

const azureServicePrincipal = new castai.iam.AzureServicePrincipal("azure-service-principal", {
    tenantId: "00000000-0000-0000-0000-000000000000",
    clientId: "00000000-0000-0000-0000-000000000000",
    clientSecret: "client-secret", // In practice, use pulumi.secret() or environment variables
    subscriptionId: "00000000-0000-0000-0000-000000000000",
    roleDefinitionId: azureIamRole.id,
});

// Export IAM resources
export const outputs = {
    // AWS outputs
    awsRoleArn: awsIamRole.arn,
    awsUsername: awsIamUser.username,
    
    // GCP outputs
    gcpServiceAccountEmail: gcpServiceAccount.serviceAccountId.apply(id => 
        `${id}@my-gcp-project.iam.gserviceaccount.com`),
    gcpRoleName: gcpIamRole.roleName,
    
    // Azure outputs
    azureRoleName: azureIamRole.roleName,
    azureClientId: azureServicePrincipal.clientId,
}; 