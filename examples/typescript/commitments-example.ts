import * as pulumi from "@pulumi/pulumi";
import * as castai from "@pulumi/castai";

// Initialize the CAST AI provider
const provider = new castai.Provider("castai", {
    // API token will be read from the environment variable CASTAI_API_TOKEN
});

// Reference an existing EKS cluster (you can use any cluster type)
const eksCluster = new castai.EksCluster("example-eks-cluster", {
    accountId: "123456789012", // Replace with your AWS account ID
    region: "us-west-2",       // Replace with your AWS region
    eksClusterName: "my-eks-cluster", // Replace with your EKS cluster name
    securityGroupId: "sg-12345678", 
    subnetIds: ["subnet-12345678", "subnet-87654321"],
});

// Create a commitment plan to save on compute costs
const commitments = new castai.Commitments("example-commitments", {
    // Define the commitment configuration
    name: "production-commitments",
    autoApply: true,
    autoApplyLabel: "environment=production",
    
    // Compute unit hourly rate in USD
    computeUnitHourlyRate: 0.0294, // Example rate, replace with actual value
    
    // Define commitment details
    instances: [
        {
            clusterId: eksCluster.id,
            // Number of compute units to commit to
            computeUnits: 100,
            // Commitment start and end dates
            startDate: "2023-04-01T00:00:00Z",
            endDate: "2024-03-31T23:59:59Z",
        }
    ],
});

// Create a reservation of compute instances for specific workloads
const reservations = new castai.Reservations("example-reservations", {
    clusterId: eksCluster.id,
    
    // Define the instance to be reserved
    instances: [
        {
            // Configuration for the reserved instance
            instanceType: "m5.2xlarge",
            provider: "aws",
            zone: "us-west-2a",
            spotInstance: false,
            
            // Number of instances to reserve
            count: 3,
            
            // When to activate these instances
            startDate: "2023-04-01T00:00:00Z",
            endDate: "2023-10-01T00:00:00Z",
            
            // Node labeling and tainting
            labels: {
                "reserved": "true",
                "workload": "database"
            },
            taints: [
                {
                    key: "reserved",
                    value: "database",
                    effect: "NoSchedule"
                }
            ]
        }
    ],
    
    // Node configuration reference (optional, if you have a specific configuration)
    nodeConfigurationId: null,
});

// Export commitment and reservation IDs
export const commitmentId = commitments.id;
export const reservationId = reservations.id; 