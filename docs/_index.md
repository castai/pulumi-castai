---
title: CAST AI
meta_desc: Provides an overview of the CAST AI Provider for Pulumi.
layout: overview
---

The CAST AI Provider for Pulumi enables you to manage CAST AI resources in your cloud infrastructure using Pulumi. CAST AI is a Kubernetes cost optimization platform that helps you reduce cloud costs by automatically optimizing your Kubernetes clusters.

## Important: Installation Order

For CAST AI to work properly, you must install the CAST AI agent **before** creating the cluster connection. The correct order is:

1. **Install CAST AI agent** (using Helm or Kubernetes manifests)
2. **Install CAST AI cluster controller** (using Helm or Kubernetes manifests)
3. **Create CAST AI cluster connection** (using Pulumi CAST AI provider)

This ensures the cluster controller is running and can respond when CAST AI attempts to connect to your cluster.

## Example

{{< chooser language "typescript,python,go,csharp" >}}

{{% choosable language typescript %}}

```typescript
import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";
import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";

const gcpProjectId = process.env.GCP_PROJECT_ID || "my-gcp-project-id";
const gkeClusterName = process.env.GKE_CLUSTER_NAME || "my-gke-cluster";

// Create a service account for CAST AI
const castaiServiceAccount = new gcp.serviceaccount.Account("castai-service-account", {
    accountId: "castai-gke-access",
    displayName: "CAST AI GKE Access Service Account",
    description: "Service account for CAST AI to manage GKE cluster",
    project: gcpProjectId,
});

// Define the required roles for CAST AI (using broader permissions)
const requiredRoles = [
    "roles/container.admin",
    "roles/compute.admin",
    "roles/iam.serviceAccountUser",
];

// Assign roles to the service account
requiredRoles.forEach((role, index) => {
    new gcp.projects.IAMMember(`castai-role-${index}`, {
        project: gcpProjectId,
        role: role,
        member: castaiServiceAccount.email.apply(email => `serviceAccount:${email}`),
    });
});

// Create a service account key
const serviceAccountKey = new gcp.serviceaccount.Key("castai-service-account-key", {
    serviceAccountId: castaiServiceAccount.name,
});

// Initialize the CAST AI provider
const provider = new castai.Provider("castai-provider", {
    apiToken: process.env.CASTAI_API_TOKEN,
});

// Create a Kubernetes provider
const k8sProvider = new k8s.Provider("gke-k8s", {
    // Uses default kubeconfig from ~/.kube/config
});

// STEP 1: Create namespace with proper Helm labels
const castaiNamespace = new k8s.core.v1.Namespace("castai-namespace", {
    metadata: {
        name: "castai-agent",
        labels: {
            "app.kubernetes.io/managed-by": "Helm",
        },
        annotations: {
            "meta.helm.sh/release-name": "castai-agent",
            "meta.helm.sh/release-namespace": "castai-agent",
        },
    },
}, { provider: k8sProvider });

// STEP 2: Install CAST AI agent FIRST (before cluster connection)
const castaiAgent = new k8s.helm.v3.Release("castai-agent", {
    name: "castai-agent",
    chart: "castai-agent",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    createNamespace: false,
    values: {
        apiKey: process.env.CASTAI_API_TOKEN,
        provider: "gke",
        apiURL: "https://api.cast.ai",
    },
}, { provider: k8sProvider, dependsOn: [castaiNamespace] });

// STEP 3: Install CAST AI cluster controller
const clusterController = new k8s.helm.v3.Release("cluster-controller", {
    name: "cluster-controller",
    chart: "castai-cluster-controller",
    repositoryOpts: {
        repo: "https://castai.github.io/helm-charts",
    },
    namespace: "castai-agent",
    values: {
        castai: {
            apiKey: process.env.CASTAI_API_TOKEN,
            apiURL: "https://api.cast.ai",
        },
    },
}, { provider: k8sProvider, dependsOn: [castaiAgent] });

// STEP 4: Connect GKE cluster to CAST AI AFTER agent installation
const gkeCluster = new castai.GkeCluster("gke-cluster-connection", {
    projectId: gcpProjectId,
    location: "us-central1",
    name: gkeClusterName,
    deleteNodesOnDisconnect: true,
    credentialsJson: serviceAccountKey.privateKey,
}, { provider, dependsOn: [castaiAgent, clusterController] });

// Export the cluster ID and service account information
export const clusterId = gkeCluster.id;
export const serviceAccountEmail = castaiServiceAccount.email;
```

{{% /choosable %}}
{{% choosable language python %}}

```python
import pulumi
import os
from pulumi_castai import Provider, GkeCluster
from pulumi_gcp import serviceaccount, projects
from pulumi_kubernetes import core, helm, Provider as K8sProvider

# Get GCP project ID from environment variable or use a default value
project_id = os.environ.get("GCP_PROJECT_ID", "my-gcp-project-id")
cluster_name = os.environ.get("GKE_CLUSTER_NAME", "my-gke-cluster")

# Create a service account for CAST AI
castai_service_account = serviceaccount.Account(
    "castai-service-account",
    account_id="castai-gke-access",
    display_name="CAST AI GKE Access Service Account",
    description="Service account for CAST AI to manage GKE cluster",
    project=project_id
)

# Define the required roles for CAST AI (using broader permissions)
required_roles = [
    "roles/container.admin",
    "roles/compute.admin",
    "roles/iam.serviceAccountUser",
]

# Assign roles to the service account
for i, role in enumerate(required_roles):
    projects.IAMMember(
        f"castai-role-{i}",
        project=project_id,
        role=role,
        member=castai_service_account.email.apply(lambda email: f"serviceAccount:{email}")
    )

# Create a service account key
service_account_key = serviceaccount.Key(
    "castai-service-account-key",
    service_account_id=castai_service_account.name
)

# Initialize providers
api_token = os.environ.get("CASTAI_API_TOKEN", "your-api-token-here")
castai_provider = Provider("castai-provider", api_token=api_token)
k8s_provider = K8sProvider("gke-k8s")

# STEP 1: Create namespace with proper Helm labels
castai_namespace = core.v1.Namespace(
    "castai-namespace",
    metadata={
        "name": "castai-agent",
        "labels": {
            "app.kubernetes.io/managed-by": "Helm",
        },
        "annotations": {
            "meta.helm.sh/release-name": "castai-agent",
            "meta.helm.sh/release-namespace": "castai-agent",
        },
    },
    opts=pulumi.ResourceOptions(provider=k8s_provider)
)

# STEP 2: Install CAST AI agent FIRST (before cluster connection)
castai_agent = helm.v3.Release(
    "castai-agent",
    name="castai-agent",
    chart="castai-agent",
    repository_opts={"repo": "https://castai.github.io/helm-charts"},
    namespace="castai-agent",
    create_namespace=False,
    values={
        "apiKey": api_token,
        "provider": "gke",
        "apiURL": "https://api.cast.ai",
    },
    opts=pulumi.ResourceOptions(provider=k8s_provider, depends_on=[castai_namespace])
)

# STEP 3: Install CAST AI cluster controller
cluster_controller = helm.v3.Release(
    "cluster-controller",
    name="cluster-controller",
    chart="castai-cluster-controller",
    repository_opts={"repo": "https://castai.github.io/helm-charts"},
    namespace="castai-agent",
    values={
        "castai": {
            "apiKey": api_token,
            "apiURL": "https://api.cast.ai",
        },
    },
    opts=pulumi.ResourceOptions(provider=k8s_provider, depends_on=[castai_agent])
)

# STEP 4: Connect GKE cluster to CAST AI AFTER agent installation
gke_cluster = GkeCluster("gke-cluster-connection",
    project_id=project_id,
    location="us-central1",
    name=cluster_name,
    delete_nodes_on_disconnect=True,
    credentials_json=service_account_key.private_key,
    opts=pulumi.ResourceOptions(provider=castai_provider, depends_on=[castai_agent, cluster_controller])
)

# Export the cluster ID and service account information
pulumi.export("cluster_id", gke_cluster.id)
pulumi.export("service_account_email", castai_service_account.email)
```

{{% /choosable %}}
{{% choosable language go %}}

```go
package main

import (
	"os"

	"github.com/castai/pulumi-castai/sdk/go/castai"
	"github.com/pulumi/pulumi-gcp/sdk/v7/go/gcp/projects"
	"github.com/pulumi/pulumi-gcp/sdk/v7/go/gcp/serviceaccount"
	"github.com/pulumi/pulumi-kubernetes/sdk/v4/go/kubernetes"
	corev1 "github.com/pulumi/pulumi-kubernetes/sdk/v4/go/kubernetes/core/v1"
	helmv3 "github.com/pulumi/pulumi-kubernetes/sdk/v4/go/kubernetes/helm/v3"
	metav1 "github.com/pulumi/pulumi-kubernetes/sdk/v4/go/kubernetes/meta/v1"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

func main() {
	pulumi.Run(func(ctx *pulumi.Context) error {
		// Get values from environment variables or use defaults
		projectID := os.Getenv("GCP_PROJECT_ID")
		if projectID == "" {
			projectID = "my-gcp-project-id"
		}
		clusterName := os.Getenv("GKE_CLUSTER_NAME")
		if clusterName == "" {
			clusterName = "my-gke-cluster"
		}
		apiToken := os.Getenv("CASTAI_API_TOKEN")

		// Create a service account for CAST AI
		castaiServiceAccount, err := serviceaccount.NewAccount(ctx, "castai-service-account", &serviceaccount.AccountArgs{
			AccountId:   pulumi.String("castai-gke-access"),
			DisplayName: pulumi.String("CAST AI GKE Access Service Account"),
			Description: pulumi.String("Service account for CAST AI to manage GKE cluster"),
			Project:     pulumi.String(projectID),
		})
		if err != nil {
			return err
		}

		// Define the required roles for CAST AI (using broader permissions)
		requiredRoles := []string{
			"roles/container.admin",
			"roles/compute.admin",
			"roles/iam.serviceAccountUser",
		}

		// Assign roles to the service account
		for i, role := range requiredRoles {
			_, err := projects.NewIAMMember(ctx, pulumi.Sprintf("castai-role-%d", i), &projects.IAMMemberArgs{
				Project: pulumi.String(projectID),
				Role:    pulumi.String(role),
				Member:  pulumi.Sprintf("serviceAccount:%s", castaiServiceAccount.Email),
			})
			if err != nil {
				return err
			}
		}

		// Create a service account key
		serviceAccountKey, err := serviceaccount.NewKey(ctx, "castai-service-account-key", &serviceaccount.KeyArgs{
			ServiceAccountId: castaiServiceAccount.Name,
		})
		if err != nil {
			return err
		}

		// Initialize providers
		castaiProvider, err := castai.NewProvider(ctx, "castai-provider", &castai.ProviderArgs{
			ApiToken: pulumi.String(apiToken),
		})
		if err != nil {
			return err
		}

		k8sProvider, err := kubernetes.NewProvider(ctx, "gke-k8s", &kubernetes.ProviderArgs{})
		if err != nil {
			return err
		}

		// STEP 1: Create namespace with proper Helm labels
		castaiNamespace, err := corev1.NewNamespace(ctx, "castai-namespace", &corev1.NamespaceArgs{
			Metadata: &metav1.ObjectMetaArgs{
				Name: pulumi.String("castai-agent"),
				Labels: pulumi.StringMap{
					"app.kubernetes.io/managed-by": pulumi.String("Helm"),
				},
				Annotations: pulumi.StringMap{
					"meta.helm.sh/release-name":      pulumi.String("castai-agent"),
					"meta.helm.sh/release-namespace": pulumi.String("castai-agent"),
				},
			},
		}, pulumi.Provider(k8sProvider))
		if err != nil {
			return err
		}

		// STEP 2: Install CAST AI agent FIRST (before cluster connection)
		castaiAgent, err := helmv3.NewRelease(ctx, "castai-agent", &helmv3.ReleaseArgs{
			Name:  pulumi.String("castai-agent"),
			Chart: pulumi.String("castai-agent"),
			RepositoryOpts: &helmv3.RepositoryOptsArgs{
				Repo: pulumi.String("https://castai.github.io/helm-charts"),
			},
			Namespace:       pulumi.String("castai-agent"),
			CreateNamespace: pulumi.Bool(false),
			Values: pulumi.Map{
				"apiKey":  pulumi.String(apiToken),
				"provider": pulumi.String("gke"),
				"apiURL":  pulumi.String("https://api.cast.ai"),
			},
		}, pulumi.Provider(k8sProvider), pulumi.DependsOn([]pulumi.Resource{castaiNamespace}))
		if err != nil {
			return err
		}

		// STEP 3: Install CAST AI cluster controller
		clusterController, err := helmv3.NewRelease(ctx, "cluster-controller", &helmv3.ReleaseArgs{
			Name:  pulumi.String("cluster-controller"),
			Chart: pulumi.String("castai-cluster-controller"),
			RepositoryOpts: &helmv3.RepositoryOptsArgs{
				Repo: pulumi.String("https://castai.github.io/helm-charts"),
			},
			Namespace: pulumi.String("castai-agent"),
			Values: pulumi.Map{
				"castai": pulumi.Map{
					"apiKey": pulumi.String(apiToken),
					"apiURL": pulumi.String("https://api.cast.ai"),
				},
			},
		}, pulumi.Provider(k8sProvider), pulumi.DependsOn([]pulumi.Resource{castaiAgent}))
		if err != nil {
			return err
		}

		// STEP 4: Connect GKE cluster to CAST AI AFTER agent installation
		gkeCluster, err := castai.NewGkeCluster(ctx, "gke-cluster-connection", &castai.GkeClusterArgs{
			ProjectId:               pulumi.String(projectID),
			Location:                pulumi.String("us-central1"),
			Name:                    pulumi.String(clusterName),
			DeleteNodesOnDisconnect: pulumi.Bool(true),
			CredentialsJson:         serviceAccountKey.PrivateKey,
		}, pulumi.Provider(castaiProvider), pulumi.DependsOn([]pulumi.Resource{castaiAgent, clusterController}))
		if err != nil {
			return err
		}

		// Export useful information
		ctx.Export("clusterId", gkeCluster.ID())
		ctx.Export("serviceAccountEmail", castaiServiceAccount.Email)

		return nil
	})
}
```

{{% /choosable %}}
{{% choosable language csharp %}}

```csharp
using System;
using System.Collections.Generic;
using Pulumi;
using Pulumi.CastAI;
using Pulumi.Kubernetes.Core.V1;
using Pulumi.Kubernetes.Helm.V3;
using Pulumi.Kubernetes.Types.Inputs.Core.V1;
using Pulumi.Kubernetes.Types.Inputs.Meta.V1;

return await Deployment.RunAsync(() =>
{
    var apiToken = Environment.GetEnvironmentVariable("CASTAI_API_TOKEN");
    var awsRegion = Environment.GetEnvironmentVariable("AWS_REGION") ?? "us-west-2";
    var awsAccountId = Environment.GetEnvironmentVariable("AWS_ACCOUNT_ID") ?? "123456789012";
    var eksClusterName = Environment.GetEnvironmentVariable("EKS_CLUSTER_NAME") ?? "my-eks-cluster";

    // Initialize providers
    var castaiProvider = new Provider("castai-provider", new ProviderArgs
    {
        ApiToken = apiToken
    });

    var k8sProvider = new Pulumi.Kubernetes.Provider("eks-k8s");

    // STEP 1: Create namespace with proper Helm labels
    var castaiNamespace = new Namespace("castai-namespace", new NamespaceArgs
    {
        Metadata = new ObjectMetaArgs
        {
            Name = "castai-agent",
            Labels = new Dictionary<string, string>
            {
                ["app.kubernetes.io/managed-by"] = "Helm"
            },
            Annotations = new Dictionary<string, string>
            {
                ["meta.helm.sh/release-name"] = "castai-agent",
                ["meta.helm.sh/release-namespace"] = "castai-agent"
            }
        }
    }, new CustomResourceOptions { Provider = k8sProvider });

    // STEP 2: Install CAST AI agent FIRST (before cluster connection)
    var castaiAgent = new Release("castai-agent", new ReleaseArgs
    {
        Name = "castai-agent",
        Chart = "castai-agent",
        RepositoryOpts = new RepositoryOptsArgs
        {
            Repo = "https://castai.github.io/helm-charts"
        },
        Namespace = "castai-agent",
        CreateNamespace = false,
        Values = new Dictionary<string, object>
        {
            ["apiKey"] = apiToken,
            ["provider"] = "eks",
            ["apiURL"] = "https://api.cast.ai"
        }
    }, new CustomResourceOptions { Provider = k8sProvider, DependsOn = { castaiNamespace } });

    // STEP 3: Install CAST AI cluster controller
    var clusterController = new Release("cluster-controller", new ReleaseArgs
    {
        Name = "cluster-controller",
        Chart = "castai-cluster-controller",
        RepositoryOpts = new RepositoryOptsArgs
        {
            Repo = "https://castai.github.io/helm-charts"
        },
        Namespace = "castai-agent",
        Values = new Dictionary<string, object>
        {
            ["castai"] = new Dictionary<string, object>
            {
                ["apiKey"] = apiToken,
                ["apiURL"] = "https://api.cast.ai"
            }
        }
    }, new CustomResourceOptions { Provider = k8sProvider, DependsOn = { castaiAgent } });

    // STEP 4: Connect EKS cluster to CAST AI AFTER agent installation
    var eksCluster = new EksCluster("eks-cluster-connection", new EksClusterArgs
    {
        AccountId = awsAccountId,
        Region = awsRegion,
        Name = eksClusterName,
        DeleteNodesOnDisconnect = true,
        OverrideSecurityGroups = new[] {"sg-12345678"},
        Subnets = new[] { "subnet-12345678", "subnet-87654321" }
    }, new CustomResourceOptions
    {
        Provider = castaiProvider,
        DependsOn = { castaiAgent, clusterController }
    });

    // Export the cluster ID
    return new Dictionary<string, object?>
    {
        ["ClusterId"] = eksCluster.Id
    };
});
```

{{% /choosable %}}
{{< /chooser >}}

## Alternative: Manual Agent Installation

If you prefer to install the CAST AI agent manually using Helm or kubectl, you can do so before running your Pulumi program:

```bash
# Add CAST AI Helm repository
helm repo add castai-helm https://castai.github.io/helm-charts
helm repo update

# Install CAST AI agent
helm install castai-agent castai-helm/castai-agent \
  --namespace castai-agent \
  --create-namespace \
  --set apiKey=$CASTAI_API_TOKEN \
  --set provider=gke \
  --set apiURL=https://api.cast.ai

# Install CAST AI cluster controller
helm install cluster-controller castai-helm/castai-cluster-controller \
  --namespace castai-agent \
  --set castai.apiKey=$CASTAI_API_TOKEN \
  --set castai.apiURL=https://api.cast.ai
```

After manual installation, you can use a simplified Pulumi program that only creates the cluster connection.

## Features

The CAST AI Provider for Pulumi offers resources to:

* Connect your Kubernetes clusters (EKS, GKE, AKS) to CAST AI
* Configure autoscaling policies
* Manage node configurations
* Set up cost optimization policies
* Create and manage service accounts for CAST AI

## Supported Cloud Providers

CAST AI supports the following cloud providers:

* Amazon Web Services (AWS) - EKS clusters
* Google Cloud Platform (GCP) - GKE clusters
* Microsoft Azure - AKS clusters

## Authentication

To use the CAST AI provider, you need to have a CAST AI account and an API token. You can sign up for a CAST AI account at [https://cast.ai](https://cast.ai) and generate an API token from the CAST AI console.
