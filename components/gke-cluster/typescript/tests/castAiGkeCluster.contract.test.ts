/**
 * Contract Tests for CastAiGkeCluster Component
 *
 * These tests document the public API of the CastAiGkeCluster component
 * and ensure backwards compatibility. They test the component's interface
 * without testing internal implementation details.
 *
 * Run with: npm test
 */

import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";
import * as castai from "@castai/pulumi";
import { CastAiGkeCluster, CastAiGkeClusterArgs } from "../castAiGkeCluster";
import { promisify, promisifyAll } from "./test-utils";

/**
 * Comprehensive mock implementation for all resources used in CastAiGkeCluster
 */
class GkeClusterMocks implements pulumi.runtime.Mocks {
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs = { ...args.inputs };

        // Mock ComponentResource (the CastAiGkeCluster itself)
        if (args.type === "castai:gke:CastAiGkeCluster") {
            return {
                id: `${args.name}`,
                state: outputs,
            };
        }

        // Mock ComponentResource (GkeIamResources sub-component)
        if (args.type === "castai:gke:GkeIamResources") {
            return {
                id: `${args.name}`,
                state: outputs,
            };
        }

        // Mock CAST AI GKE Cluster (Phase 1 and Phase 2)
        if (args.type === "castai:gcp:GkeCluster") {
            return {
                id: `cluster-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    id: `cluster-${this.hash(args.name)}`,
                    clusterToken: `token-${this.hash(args.name)}`,
                    credentialsId: `creds-${this.hash(args.name)}`,
                },
            };
        }

        // Mock CAST AI Provider
        if (args.type === "pulumi:providers:castai") {
            return {
                id: `${args.name}-provider`,
                state: outputs,
            };
        }

        // Mock GCP Service Account
        if (args.type === "gcp:serviceaccount/account:Account") {
            const project = args.inputs.project || "test-project";
            const accountId = args.inputs.accountId || "castai";
            return {
                id: `projects/${project}/serviceAccounts/${accountId}@${project}.iam.gserviceaccount.com`,
                state: {
                    ...outputs,
                    name: `projects/${project}/serviceAccounts/${accountId}@${project}.iam.gserviceaccount.com`,
                    email: `${accountId}@${project}.iam.gserviceaccount.com`,
                },
            };
        }

        // Mock GCP Service Account Key
        if (args.type === "gcp:serviceaccount/key:Key") {
            const mockCredentials = {
                type: "service_account",
                project_id: "test-project",
                private_key: "-----BEGIN PRIVATE KEY-----\\nMOCK\\n-----END PRIVATE KEY-----\\n",
            };
            return {
                id: `key-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    privateKey: Buffer.from(JSON.stringify(mockCredentials)).toString("base64"),
                },
            };
        }

        // Mock GCP IAM Custom Role
        if (args.type === "gcp:projects/iAMCustomRole:IAMCustomRole") {
            const roleId = args.inputs.roleId || "custom_role";
            return {
                id: `role-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    roleId: roleId,
                },
            };
        }

        // Mock GCP IAM Member
        if (args.type === "gcp:projects/iAMMember:IAMMember") {
            return {
                id: `binding-${this.hash(args.name)}`,
                state: outputs,
            };
        }

        // Mock CAST AI Node Configuration
        if (args.type === "castai:config:NodeConfiguration") {
            return {
                id: `node-config-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    id: `node-config-${this.hash(args.name)}`,
                },
            };
        }

        // Mock CAST AI Node Configuration Default
        if (args.type === "castai:config:NodeConfigurationDefault") {
            return {
                id: `node-config-default-${this.hash(args.name)}`,
                state: outputs,
            };
        }

        // Mock Kubernetes Provider
        if (args.type === "pulumi:providers:kubernetes") {
            return {
                id: `${args.name}-k8s-provider`,
                state: outputs,
            };
        }

        // Mock Helm Release
        if (args.type === "kubernetes:helm.sh/v3:Release") {
            return {
                id: `release-${args.name}`,
                state: {
                    ...outputs,
                    status: "deployed",
                },
            };
        }

        // Default
        return {
            id: `${args.name}-id`,
            state: outputs,
        };
    }

    call(args: pulumi.runtime.MockCallArgs): Record<string, any> {
        // Mock gcp.container.getCluster
        if (args.token === "gcp:container/getCluster:getCluster") {
            return {
                name: args.inputs.name,
                location: args.inputs.location,
                endpoint: "35.123.45.67",
                masterAuths: [
                    {
                        clusterCaCertificate: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t",
                    },
                ],
            };
        }
        return {};
    }

    private hash(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash;
        }
        return Math.abs(hash) % 10000;
    }
}

// Set up mocks
pulumi.runtime.setMocks(new GkeClusterMocks());

describe("CastAiGkeCluster - Public API Contract", () => {
    describe("Constructor and Required Arguments", () => {
        it("should accept required arguments", () => {
            expect(() => {
                new CastAiGkeCluster("test-cluster", {
                    clusterName: "my-gke-cluster",
                    location: "us-central1-a",
                    projectId: "test-project-123",
                    apiToken: "mock-api-token",
                    subnets: ["default"],
                    networkTags: ["castai-managed"],
                });
            }).not.toThrow();
        });

        it("should accept optional readOnlyMode argument", () => {
            expect(() => {
                new CastAiGkeCluster("test-readonly", {
                    clusterName: "readonly-cluster",
                    location: "us-west1-a",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    readOnlyMode: true,
                });
            }).not.toThrow();
        });

        it("should accept optional apiUrl argument", () => {
            expect(() => {
                new CastAiGkeCluster("test-api-url", {
                    clusterName: "custom-api-cluster",
                    location: "europe-west1-b",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    apiUrl: "https://custom-api.cast.ai",
                    subnets: ["default"],
                    networkTags: ["custom-tag"],
                });
            }).not.toThrow();
        });

        it("should accept optional deleteNodesOnDisconnect argument", () => {
            expect(() => {
                new CastAiGkeCluster("test-delete-nodes", {
                    clusterName: "delete-cluster",
                    location: "asia-east1-a",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    subnets: ["default"],
                    networkTags: ["tag"],
                    deleteNodesOnDisconnect: true,
                });
            }).not.toThrow();
        });

        it("should accept optional tags argument", () => {
            expect(() => {
                new CastAiGkeCluster("test-tags", {
                    clusterName: "tagged-cluster",
                    location: "us-east1-c",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    subnets: ["default"],
                    networkTags: ["net-tag"],
                    tags: {
                        environment: "production",
                        team: "platform",
                    },
                });
            }).not.toThrow();
        });
    });

    describe("Component Outputs", () => {
        it("should expose clusterId output", async () => {
            const cluster = new CastAiGkeCluster("test-outputs-cluster-id", {
                clusterName: "output-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            expect(cluster.clusterId).toBeDefined();

            const [clusterId] = await promisifyAll(cluster.clusterId);
            expect(clusterId).toBeDefined();
            expect(typeof clusterId).toBe("string");
            expect(clusterId).toContain("cluster-");
        });

        it("should expose clusterToken output", async () => {
            const cluster = new CastAiGkeCluster("test-outputs-token", {
                clusterName: "token-cluster",
                location: "us-west1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            expect(cluster.clusterToken).toBeDefined();

            const [token] = await promisifyAll(cluster.clusterToken);
            expect(token).toBeDefined();
            expect(typeof token).toBe("string");
            expect(token).toContain("token-");
        });

        it("should expose credentialsId output", async () => {
            const cluster = new CastAiGkeCluster("test-outputs-creds", {
                clusterName: "creds-cluster",
                location: "europe-west1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            expect(cluster.credentialsId).toBeDefined();

            const [credsId] = await promisifyAll(cluster.credentialsId);
            expect(credsId).toBeDefined();
            expect(typeof credsId).toBe("string");
            expect(credsId).toContain("creds-");
        });

        it("should expose serviceAccountEmail in full management mode", async () => {
            const cluster = new CastAiGkeCluster("test-outputs-sa-email", {
                clusterName: "sa-email-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                readOnlyMode: false,
            });

            expect(cluster.serviceAccountEmail).toBeDefined();

            const [email] = await promisifyAll(cluster.serviceAccountEmail!);
            expect(email).toBeDefined();
            expect(typeof email).toBe("string");
            expect(email).toContain("@test-project.iam.gserviceaccount.com");
        });

        it("should expose serviceAccountKey in full management mode", async () => {
            const cluster = new CastAiGkeCluster("test-outputs-sa-key", {
                clusterName: "sa-key-cluster",
                location: "us-east1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                readOnlyMode: false,
            });

            expect(cluster.serviceAccountKey).toBeDefined();

            const [key] = await promisifyAll(cluster.serviceAccountKey!);
            expect(key).toBeDefined();
            expect(typeof key).toBe("string");
        });

        it("should not expose serviceAccountEmail in read-only mode", () => {
            const cluster = new CastAiGkeCluster("test-readonly-no-sa-email", {
                clusterName: "readonly-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                readOnlyMode: true,
            });

            expect(cluster.serviceAccountEmail).toBeUndefined();
        });

        it("should not expose serviceAccountKey in read-only mode", () => {
            const cluster = new CastAiGkeCluster("test-readonly-no-sa-key", {
                clusterName: "readonly-cluster",
                location: "us-west1",
                projectId: "test-project",
                apiToken: "mock-token",
                readOnlyMode: true,
            });

            expect(cluster.serviceAccountKey).toBeUndefined();
        });
    });

    describe("Regional vs Zonal Clusters", () => {
        it("should support zonal cluster location", async () => {
            const cluster = new CastAiGkeCluster("test-zonal", {
                clusterName: "zonal-cluster",
                location: "us-central1-a",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            const [clusterId] = await promisifyAll(cluster.clusterId);
            expect(clusterId).toBeDefined();
        });

        it("should support regional cluster location", async () => {
            const cluster = new CastAiGkeCluster("test-regional", {
                clusterName: "regional-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            const [clusterId] = await promisifyAll(cluster.clusterId);
            expect(clusterId).toBeDefined();
        });
    });

    describe("Network Configuration", () => {
        it("should accept single subnet", async () => {
            const cluster = new CastAiGkeCluster("test-single-subnet", {
                clusterName: "single-subnet-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            const [clusterId] = await promisifyAll(cluster.clusterId);
            expect(clusterId).toBeDefined();
        });

        it("should accept multiple subnets", async () => {
            const cluster = new CastAiGkeCluster("test-multi-subnet", {
                clusterName: "multi-subnet-cluster",
                location: "us-west1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["subnet-1", "subnet-2", "subnet-3"],
                networkTags: ["tag"],
            });

            const [clusterId] = await promisifyAll(cluster.clusterId);
            expect(clusterId).toBeDefined();
        });

        it("should accept multiple network tags", async () => {
            const cluster = new CastAiGkeCluster("test-multi-tags", {
                clusterName: "multi-tag-cluster",
                location: "europe-west1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["castai-managed", "production", "web-tier"],
            });

            const [clusterId] = await promisifyAll(cluster.clusterId);
            expect(clusterId).toBeDefined();
        });
    });

    describe("Multiple Component Instances", () => {
        it("should create multiple clusters independently", async () => {
            const cluster1 = new CastAiGkeCluster("cluster-1", {
                clusterName: "gke-cluster-1",
                location: "us-central1",
                projectId: "project-1",
                apiToken: "token-1",
                subnets: ["subnet-1"],
                networkTags: ["tag-1"],
            });

            const cluster2 = new CastAiGkeCluster("cluster-2", {
                clusterName: "gke-cluster-2",
                location: "us-west1",
                projectId: "project-2",
                apiToken: "token-2",
                subnets: ["subnet-2"],
                networkTags: ["tag-2"],
            });

            const [id1, id2] = await promisifyAll(cluster1.clusterId, cluster2.clusterId);

            expect(id1).toBeDefined();
            expect(id2).toBeDefined();
            expect(id1).not.toBe(id2);
        });
    });
});
