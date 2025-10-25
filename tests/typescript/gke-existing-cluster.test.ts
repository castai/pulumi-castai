/**
 * Mock Tests for Connecting Existing GKE Clusters to CAST AI (TypeScript)
 *
 * These tests simulate connecting an existing GKE cluster to CAST AI for optimization.
 * The cluster already exists - we're just onboarding it to CAST AI.
 *
 * Run with: npm test
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";
import { promisify, promisifyAll } from "./test-utils";

/**
 * Mock implementation for CAST AI and GCP resources.
 */
class CastAIMocks implements pulumi.runtime.Mocks {
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs = { ...args.inputs };

        if (args.type === "castai:gcp:GkeCluster") {
            return {
                id: `${args.name}-cluster-id-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    id: `${args.name}-cluster-id-${this.hash(args.name)}`,
                    clusterToken: `mock-gke-token-${this.hash(args.name)}`,
                    credentialsId: `mock-credentials-${this.hash(args.name)}`,
                },
            };
        }

        return {
            id: `${args.name}-id`,
            state: outputs,
        };
    }

    call(args: pulumi.runtime.MockCallArgs): Record<string, any> {
        return {};
    }

    private hash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash) % 1000;
    }
}

// Set up mocks
pulumi.runtime.setMocks(new CastAIMocks());

describe("GKE Existing Cluster Connection", () => {
    it("should connect an existing GKE cluster to CAST AI", async () => {
        const mockCredentials = '{"type": "service_account", "project_id": "my-gcp-project"}';

        const cluster = new castai.GkeCluster("existing-gke-cluster", {
            projectId: "my-gcp-project-123",
            location: "us-central1",
            name: "production-gke-cluster", // Existing cluster name
            deleteNodesOnDisconnect: false, // Don't delete nodes when disconnecting
            credentialsJson: mockCredentials,
        });

        const [clusterId, clusterName, clusterToken, projectId] = await promisifyAll(
            cluster.id,
            cluster.name,
            cluster.clusterToken,
            cluster.projectId
        );

        expect(clusterId).toBeDefined();
        expect(clusterName).toBe("production-gke-cluster");
        expect(clusterToken).toBeDefined();
        expect(projectId).toBe("my-gcp-project-123");
    });

    it("should connect existing regional GKE cluster (high availability)", async () => {
        const mockCredentials = '{"type": "service_account", "project_id": "prod-project"}';

        // Regional cluster for HA (vs zonal cluster)
        const cluster = new castai.GkeCluster("existing-gke-regional", {
            projectId: "prod-project-789",
            location: "us-central1", // Region (not a zone like us-central1-a)
            name: "ha-gke-cluster",
            deleteNodesOnDisconnect: false,
            credentialsJson: mockCredentials,
        });

        const [location, clusterName] = await promisifyAll(
            cluster.location,
            cluster.name
        );

        expect(location).toBe("us-central1");
        expect(clusterName).toBe("ha-gke-cluster");
    });

    it("should connect existing zonal GKE cluster", async () => {
        const mockCredentials = '{"type": "service_account", "project_id": "dev-project"}';

        // Zonal cluster (single zone)
        const cluster = new castai.GkeCluster("existing-gke-zonal", {
            projectId: "dev-project-321",
            location: "us-east1-b", // Specific zone
            name: "dev-gke-cluster",
            deleteNodesOnDisconnect: true,
            credentialsJson: mockCredentials,
        });

        const [location, clusterName] = await promisifyAll(
            cluster.location,
            cluster.name
        );

        expect(location).toBe("us-east1-b");
        expect(clusterName).toBe("dev-gke-cluster");
    });

    it("should connect existing GKE cluster with minimal configuration", async () => {
        const mockCredentials = '{"type": "service_account", "project_id": "minimal-proj"}';

        const cluster = new castai.GkeCluster("existing-gke-minimal", {
            projectId: "minimal-proj-999",
            location: "asia-southeast1",
            name: "minimal-gke",
            deleteNodesOnDisconnect: true,
            credentialsJson: mockCredentials,
        });

        const [clusterId, clusterName, projectId] = await promisifyAll(
            cluster.id,
            cluster.name,
            cluster.projectId
        );

        expect(clusterId).toBeDefined();
        expect(clusterName).toBe("minimal-gke");
        expect(projectId).toBe("minimal-proj-999");
    });

    it("should handle service account credentials properly", async () => {
        // Realistic service account JSON structure
        const realisticCredentials = JSON.stringify({
            type: "service_account",
            project_id: "my-production-project",
            private_key_id: "abc123def456",
            private_key: "-----BEGIN PRIVATE KEY-----\nMOCK_KEY\n-----END PRIVATE KEY-----\n",
            client_email: "castai-sa@my-production-project.iam.gserviceaccount.com",
            client_id: "123456789012345678901",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
        });

        const cluster = new castai.GkeCluster("existing-gke-creds", {
            projectId: "my-production-project",
            location: "us-west1",
            name: "prod-main-cluster",
            deleteNodesOnDisconnect: false,
            credentialsJson: realisticCredentials,
        });

        const [credsJson, credentialsId, clusterName] = await promisifyAll(
            cluster.credentialsJson,
            cluster.credentialsId,
            cluster.name
        );

        expect(credsJson).toBeDefined();
        expect(credentialsId).toBeDefined();
        expect(clusterName).toBe("prod-main-cluster");
    });

    it("should handle delete_nodes_on_disconnect for production clusters", async () => {
        const mockCreds = '{"type": "service_account", "project_id": "test-proj"}';

        // Production: keep nodes when disconnecting (safety)
        const prodCluster = new castai.GkeCluster("existing-gke-prod", {
            projectId: "prod-project-001",
            location: "us-central1",
            name: "prod-critical-cluster",
            deleteNodesOnDisconnect: false, // IMPORTANT: Don't delete in production
            credentialsJson: mockCreds,
        });

        // Dev: can delete nodes when disconnecting
        const devCluster = new castai.GkeCluster("existing-gke-dev", {
            projectId: "dev-project-001",
            location: "us-east1",
            name: "dev-test-cluster",
            deleteNodesOnDisconnect: true, // Safe for dev environments
            credentialsJson: mockCreds,
        });

        const [prodDelete, devDelete] = await promisifyAll(
            prodCluster.deleteNodesOnDisconnect,
            devCluster.deleteNodesOnDisconnect
        );

        expect(prodDelete).toBe(false);
        expect(devDelete).toBe(true);
    });

    it("should connect multiple existing GKE clusters across regions", async () => {
        const mockCreds = '{"type": "service_account", "project_id": "global-project"}';
        const regions = ["us-central1", "europe-west1", "asia-east1"];

        const clusters = regions.map(
            (region) =>
                new castai.GkeCluster(`existing-gke-${region}`, {
                    projectId: "global-project-001",
                    location: region,
                    name: `cluster-${region}`,
                    deleteNodesOnDisconnect: false,
                    credentialsJson: mockCreds,
                })
        );

        const clusterLocations = await Promise.all(
            clusters.map((c) => promisify(c.location))
        );

        clusterLocations.forEach((location: string, i: number) => {
            expect(location).toBe(regions[i]);
        });
    });

    it("should connect existing GKE autopilot cluster", async () => {
        const mockCreds = '{"type": "service_account", "project_id": "autopilot-proj"}';

        // GKE Autopilot clusters are fully managed
        const cluster = new castai.GkeCluster("existing-gke-autopilot", {
            projectId: "autopilot-proj-555",
            location: "us-central1",
            name: "autopilot-cluster",
            deleteNodesOnDisconnect: false, // Autopilot handles node lifecycle
            credentialsJson: mockCreds,
        });

        const [clusterId, clusterName] = await promisifyAll(cluster.id, cluster.name);

        expect(clusterId).toBeDefined();
        expect(clusterName).toBe("autopilot-cluster");
    });
});
