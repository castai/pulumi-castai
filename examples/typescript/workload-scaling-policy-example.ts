import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi-castai";

// Initialize the CAST AI provider
const provider = new castai.Provider("castai", {
    // API token will be read from the environment variable CASTAI_API_TOKEN
});

// Reference an existing EKS cluster (you can use any cluster type)
const eksCluster = new castai.aws.EksCluster("example-eks-cluster", {
    accountId: "123456789012", // Replace with your AWS account ID
    region: "us-west-2",       // Replace with your AWS region
    eksClusterName: "my-eks-cluster", // Replace with your EKS cluster name
    securityGroupId: "sg-12345678", 
    subnetIds: ["subnet-12345678", "subnet-87654321"],
});

// Create a workload scaling policy
const scalingPolicy = new castai.workload.ScalingPolicy("example-scaling-policy", {
    clusterId: eksCluster.id,
    name: "web-services-scaling",
    enabled: true,
    
    // Define the scope of the policy
    namespaceSelector: {
        matchLabels: {
            "environment": "production"
        }
    },
    
    // Configure the metrics for scaling
    metrics: [
        {
            type: "cpu",
            weight: 70,
            stableWindow: "5m",
            threshold: {
                utilizationPercentage: 80
            }
        },
        {
            type: "memory",
            weight: 30,
            stableWindow: "5m",
            threshold: {
                utilizationPercentage: 75
            }
        }
    ],
    
    // Configure vertical scaling
    verticalScaling: {
        enabled: true,
        vpa: {
            updateMode: "Auto",
            minAllowed: {
                cpu: "100m",
                memory: "128Mi"
            },
            maxAllowed: {
                cpu: "4",
                memory: "8Gi"
            },
            controlledResources: ["cpu", "memory"]
        }
    },
    
    // Configure horizontal scaling
    horizontalScaling: {
        enabled: true,
        hpa: {
            minReplicas: 2,
            maxReplicas: 10,
            behavior: {
                scaleDown: {
                    stabilizationWindowSeconds: 300,
                    policies: [
                        {
                            type: "Percent",
                            value: 10,
                            periodSeconds: 60
                        }
                    ]
                },
                scaleUp: {
                    stabilizationWindowSeconds: 0,
                    policies: [
                        {
                            type: "Percent",
                            value: 100,
                            periodSeconds: 15
                        }
                    ]
                }
            }
        }
    }
});

// Export the policy ID
export const policyId = scalingPolicy.id; 