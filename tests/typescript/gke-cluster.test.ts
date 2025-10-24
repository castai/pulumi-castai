/**
 * Mock Tests for CAST AI GKE Cluster Creation (TypeScript)
 *
 * These tests use Pulumi's built-in mocking to test GKE cluster creation
 * without making actual API calls to CAST AI or GCP.
 *
 * Run with: npm test
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";

/**
 * Mock implementation for CAST AI and GCP resources.
 */
class CastAIMocks implements pulumi.runtime.Mocks {
    /**
     * Mock resource creation.
     */
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs = { ...args.inputs };

        // Mock CAST AI GKE Cluster
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

        // Mock GCP Service Account
        if (args.type === "gcp:serviceaccount/account:Account") {
            const project = args.inputs.project || "project";
            const accountId = args.inputs.accountId || "castai";
            return {
                id: `${args.name}-sa-id`,
                state: {
                    ...outputs,
                    id: `${args.name}-sa-id`,
                    email: `${accountId}@${project}.iam.gserviceaccount.com`,
                    uniqueId: `${this.hash(args.name)}`,
                },
            };
        }

        // Mock GCP Service Account Key
        if (args.type === "gcp:serviceaccount/key:Key") {
            return {
                id: `${args.name}-key-id`,
                state: {
                    ...outputs,
                    id: `${args.name}-key-id`,
                    privateKey: "mock-private-key-base64",
                    publicKey: "mock-public-key",
                },
            };
        }

        // Mock GCP IAM Member
        if (args.type === "gcp:projects/iAMMember:IAMMember") {
            return {
                id: `${args.name}-iam-id`,
                state: {
                    ...outputs,
                    id: `${args.name}-iam-id`,
                    etag: `mock-etag-${this.hash(args.name)}`,
                },
            };
        }

        // Mock providers
        if (args.type.startsWith("pulumi:providers:")) {
            return {
                id: `${args.name}-provider`,
                state: outputs,
            };
        }

        // Default
        return {
            id: `${args.name}-id`,
            state: outputs,
        };
    }

    /**
     * Mock function/data source calls.
     */
    call(args: pulumi.runtime.MockCallArgs): Record<string, any> {
        if (args.token === "gcp:compute/getZones:getZones") {
            return {
                names: ["us-central1-a", "us-central1-b", "us-central1-c"],
            };
        }
        return {};
    }

    /**
     * Simple hash function for generating consistent mock IDs.
     */
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

describe("GKE Cluster Creation", () => {
    it("should create a GKE cluster with correct configuration", async () => {
        const cluster = new castai.GkeCluster("test-gke-cluster", {
            projectId: "test-project-123",
            location: "us-central1",
            name: "my-gke-cluster",
            deleteNodesOnDisconnect: true,
            credentialsJson: "mock-credentials-json",
        });

        const [clusterId, clusterName, clusterToken, projectId] = await Promise.all([
            cluster.id.promise(),
            cluster.name.promise(),
            cluster.clusterToken.promise(),
            cluster.projectId.promise(),
        ]);

        expect(clusterId).toBeDefined();
        expect(clusterId).toContain("cluster-id");

        expect(clusterName).toBe("my-gke-cluster");

        expect(clusterToken).toBeDefined();
        expect(clusterToken).toContain("mock-gke-token");

        expect(projectId).toBe("test-project-123");
    });

    it("should create a GKE cluster with custom tags", async () => {
        const cluster = new castai.GkeCluster("test-gke-cluster-tags", {
            projectId: "test-project-456",
            location: "us-central1",
            name: "tagged-cluster",
            deleteNodesOnDisconnect: false,
            credentialsJson: "mock-creds",
            tags: {
                environment: "production",
                team: "platform",
                costCenter: "engineering",
            },
        });

        const tags = await cluster.tags.promise();

        expect(tags).toBeDefined();
        expect(tags!.environment).toBe("production");
        expect(tags!.team).toBe("platform");
        expect(tags!.costCenter).toBe("engineering");
    });

    it("should handle delete_nodes_on_disconnect setting", async () => {
        const clusterDelete = new castai.GkeCluster("test-gke-delete", {
            projectId: "test-project",
            location: "us-west1",
            name: "delete-cluster",
            deleteNodesOnDisconnect: true,
            credentialsJson: "mock-creds",
        });

        const clusterKeep = new castai.GkeCluster("test-gke-keep", {
            projectId: "test-project",
            location: "us-west1",
            name: "keep-cluster",
            deleteNodesOnDisconnect: false,
            credentialsJson: "mock-creds",
        });

        const [deleteSetting, keepSetting] = await Promise.all([
            clusterDelete.deleteNodesOnDisconnect.promise(),
            clusterKeep.deleteNodesOnDisconnect.promise(),
        ]);

        expect(deleteSetting).toBe(true);
        expect(keepSetting).toBe(false);
    });

    it("should support multiple GCP locations", async () => {
        const locations = ["us-central1", "us-east1", "europe-west1", "asia-southeast1"];

        const clusters = locations.map(
            (location, i) =>
                new castai.GkeCluster(`test-gke-${location}`, {
                    projectId: "test-project",
                    location: location,
                    name: `cluster-${location}`,
                    deleteNodesOnDisconnect: true,
                    credentialsJson: "mock-creds",
                })
        );

        const clusterLocations = await Promise.all(clusters.map((c) => c.location.promise()));

        clusterLocations.forEach((location, i) => {
            expect(location).toBe(locations[i]);
        });
    });

    it("should properly handle credentials", async () => {
        const testCredentials = '{"type": "service_account", "project_id": "test"}';

        const cluster = new castai.GkeCluster("test-gke-credentials", {
            projectId: "test-project",
            location: "us-central1",
            name: "creds-cluster",
            deleteNodesOnDisconnect: true,
            credentialsJson: testCredentials,
        });

        const [credsJson, credsId] = await Promise.all([
            cluster.credentialsJson.promise(),
            cluster.credentialsId.promise(),
        ]);

        expect(credsJson).toBe(testCredentials);
        expect(credsId).toBeDefined();
        expect(credsId).toContain("mock-credentials");
    });
});

describe("GKE Cluster Validation", () => {
    it("should validate required fields", async () => {
        // This tests that the resource accepts required fields
        expect(() => {
            new castai.GkeCluster("test-validation", {
                projectId: "test-project",
                location: "us-central1",
                name: "validation-cluster",
                deleteNodesOnDisconnect: true,
                credentialsJson: "mock-creds",
            });
        }).not.toThrow();
    });

    it("should handle optional tags field", async () => {
        const clusterWithoutTags = new castai.GkeCluster("test-no-tags", {
            projectId: "test-project",
            location: "us-central1",
            name: "no-tags-cluster",
            deleteNodesOnDisconnect: true,
            credentialsJson: "mock-creds",
        });

        // Tags should be undefined or empty if not provided
        const tags = await clusterWithoutTags.tags.promise();
        expect(tags === undefined || Object.keys(tags || {}).length === 0).toBe(true);
    });
});
