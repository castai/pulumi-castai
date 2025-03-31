#!/usr/bin/env bash
# Usage: ./scripts/create-example.sh <project_type> <project_name>

project_type="$1"
project_name="$2"

mkdir -p examples/"${project_name}"
cd examples/"${project_name}"

if [ "${project_type}" = "python" ]; then \
    echo "Creating Python example..."; \
    echo "pulumi>=3.0.0,<4.0.0" > requirements.txt; \
    echo "-e ../../sdk/python" >> requirements.txt; \
    \
    # Write Python example with printf to avoid Just parser issues with heredoc; \
    printf '%s\n' \
    "import pulumi" \
    "from pulumi_castai import Provider" \
    "from pulumi_castai import gcp" \
    "" \
    "# Initialize provider" \
    "provider = Provider(\"castai-provider\")" \
    "" \
    "# Create a GKE cluster connection" \
    "gke_cluster = gcp.GkeCluster(\"example-gke-cluster\"," \
    "    project_id=\"your-gcp-project-id\"," \
    "    location=\"us-central1\"," \
    "    name=\"your-gke-cluster-name\"," \
    "    opts=pulumi.ResourceOptions(provider=provider)" \
    ")" \
    "" \
    "pulumi.export(\"cluster_id\", gke_cluster.id)" > __main__.py; \
    \
    echo "Python example created in examples/${project_name}/"; \
    \
elif [ "${project_type}" = "typescript" ]; then \
    echo "Creating TypeScript example..."; \
    \
    # Create package.json; \
    printf '%s\n' \
    "{" \
    "    \"name\": \"castai-example\"," \
    "    \"devDependencies\": {" \
    "        \"@types/node\": \"^14.0.0\"" \
    "    }," \
    "    \"dependencies\": {" \
    "        \"@pulumi/pulumi\": \"^3.0.0\"" \
    "    }" \
    "}" > package.json; \
    \
    echo "yarn add ../../sdk/nodejs" > setup.sh; \
    chmod +x setup.sh; \
    \
    # Create TypeScript example; \
    printf '%s\n' \
    "import * as pulumi from \"@pulumi/pulumi\";" \
    "import * as castai from \"@pulumi/castai\";" \
    "" \
    "// Initialize provider" \
    "const provider = new castai.Provider(\"castai-provider\");" \
    "" \
    "// Create a GKE cluster connection" \
    "const gkeCluster = new castai.gcp.GkeCluster(\"example-gke-cluster\", {" \
    "    projectId: \"your-gcp-project-id\"," \
    "    location: \"us-central1\"," \
    "    name: \"your-gke-cluster-name\"" \
    "}, { provider });" \
    "" \
    "export const clusterId = gkeCluster.id;" > index.ts; \
    \
    echo "TypeScript example created in examples/${project_name}/"; \
    \
elif [ "${project_type}" = "go" ]; then \
    echo "Creating Go example..."; \
    \
    # Create Go example; \
    printf '%s\n' \
    "package main" \
    "" \
    "import (" \
    "	\"github.com/pulumi/pulumi/sdk/v3/go/pulumi\"" \
    "	\"github.com/cast-ai/pulumi-castai/sdk/go/castai\"" \
    "	\"github.com/cast-ai/pulumi-castai/sdk/go/castai/gcp\"" \
    ")" \
    "" \
    "func main() {" \
    "	pulumi.Run(func(ctx *pulumi.Context) error {" \
    "		// Initialize provider" \
    "		provider, err := castai.NewProvider(ctx, \"castai-provider\", nil)" \
    "		if err != nil {" \
    "			return err" \
    "		}" \
    "		" \
    "		// Create a GKE cluster connection" \
    "		gkeCluster, err := gcp.NewGkeCluster(ctx, \"example-gke-cluster\", &gcp.GkeClusterArgs{" \
    "			ProjectId: pulumi.String(\"your-gcp-project-id\")," \
    "			Location:  pulumi.String(\"us-central1\")," \
    "			Name:      pulumi.String(\"your-gke-cluster-name\")," \
    "		}, pulumi.Provider(provider))" \
    "		" \
    "		if err != nil {" \
    "			return err" \
    "		}" \
    "		" \
    "		// Export the cluster ID" \
    "		ctx.Export(\"clusterId\", gkeCluster.ID())" \
    "		return nil" \
    "	})" \
    "}" > main.go; \
    \
    echo "Go example created in examples/${project_name}/"; \
fi

# Create Pulumi.yaml
printf '%s\n' \
"name: castai-${project_name}" \
"runtime: ${project_type}" \
"description: CAST AI Example" > Pulumi.yaml

echo "Example project setup complete!" 