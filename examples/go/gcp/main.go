package main

import (
"os"

"github.com/castai/pulumi-castai/sdk/go/castai"
"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
pulumi.Run(func(ctx *pulumi.Context) error {
// Initialize the provider
provider, err := castai.NewProvider(ctx, "castai-provider", &castai.ProviderArgs{
ApiToken: pulumi.String(os.Getenv("CASTAI_API_TOKEN")),
})
if err != nil {
return err
}

// Get GCP project ID from environment variable or use a default value
projectID := os.Getenv("GCP_PROJECT_ID")
if projectID == "" {
projectID = "my-gcp-project-id"
}

// Get GKE cluster name from environment variable or use a default value
clusterName := os.Getenv("GKE_CLUSTER_NAME")
if clusterName == "" {
clusterName = "cast_ai_test_cluster"
}

// Create a connection to a GKE cluster
gkeArgs := &castai.GkeClusterArgs{
ProjectId:              pulumi.String(projectID),
Location:               pulumi.String("us-central1"),
Name:                   pulumi.String(clusterName),
DeleteNodesOnDisconnect: pulumi.Bool(true),
}

gkeCluster, err := castai.NewGkeCluster(ctx, "gke-cluster-connection", gkeArgs, pulumi.Provider(provider))
if err != nil {
return err
}

// Export the cluster ID
ctx.Export("clusterId", gkeCluster.ID())

return nil
})
}
