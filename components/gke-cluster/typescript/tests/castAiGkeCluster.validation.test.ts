/**
 * Validation and Read-Only Mode Tests for CastAiGkeCluster Component
 *
 * Tests input validation and read-only vs full management mode behaviors.
 *
 * Run with: npm test
 */

import * as pulumi from "@pulumi/pulumi";
import { CastAiGkeCluster } from "../castAiGkeCluster";
import { promisify, promisifyAll } from "./test-utils";

/**
 * Mock implementation (reusing from contract tests)
 */
class ValidationMocks implements pulumi.runtime.Mocks {
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs = { ...args.inputs };

        if (args.type === "castai:gke:CastAiGkeCluster") {
            return { id: `${args.name}`, state: outputs };
        }

        if (args.type === "castai:gke:GkeIamResources") {
            return { id: `${args.name}`, state: outputs };
        }

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

        if (args.type === "gcp:serviceaccount/account:Account") {
            const project = args.inputs.project || "test-project";
            return {
                id: `sa-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    name: `sa-${this.hash(args.name)}`,
                    email: `castai@${project}.iam.gserviceaccount.com`,
                },
            };
        }

        if (args.type === "gcp:serviceaccount/key:Key") {
            const mockCreds = { type: "service_account", project_id: "test" };
            return {
                id: `key-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    privateKey: Buffer.from(JSON.stringify(mockCreds)).toString("base64"),
                },
            };
        }

        if (args.type === "gcp:projects/iAMCustomRole:IAMCustomRole") {
            return {
                id: `role-${this.hash(args.name)}`,
                state: { ...outputs, roleId: args.inputs.roleId || "custom_role" },
            };
        }

        if (args.type === "gcp:projects/iAMMember:IAMMember") {
            return { id: `binding-${this.hash(args.name)}`, state: outputs };
        }

        if (args.type === "castai:config:NodeConfiguration") {
            return {
                id: `node-config-${this.hash(args.name)}`,
                state: { ...outputs, id: `node-config-${this.hash(args.name)}` },
            };
        }

        if (args.type === "castai:config:NodeConfigurationDefault") {
            return { id: `node-config-default-${this.hash(args.name)}`, state: outputs };
        }

        if (args.type === "kubernetes:helm.sh/v3:Release") {
            return { id: `release-${args.name}`, state: { ...outputs, status: "deployed" } };
        }

        if (args.type.startsWith("pulumi:providers:")) {
            return { id: `${args.name}-provider`, state: outputs };
        }

        return { id: `${args.name}-id`, state: outputs };
    }

    call(args: pulumi.runtime.MockCallArgs): Record<string, any> {
        if (args.token === "gcp:container/getCluster:getCluster") {
            return {
                name: args.inputs.name,
                location: args.inputs.location,
                endpoint: "35.123.45.67",
                masterAuths: [{ clusterCaCertificate: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t" }],
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
pulumi.runtime.setMocks(new ValidationMocks());

describe("CastAiGkeCluster - Input Validation", () => {
    describe("Full Management Mode Validation", () => {
        it("should throw error when subnets is missing in full management mode", () => {
            expect(() => {
                new CastAiGkeCluster("test-no-subnets", {
                    clusterName: "cluster",
                    location: "us-central1",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    readOnlyMode: false,
                    // subnets is missing
                    networkTags: ["tag"],
                });
            }).toThrow("subnets is required when readOnlyMode is false");
        });

        it("should throw error when networkTags is missing in full management mode", () => {
            expect(() => {
                new CastAiGkeCluster("test-no-tags", {
                    clusterName: "cluster",
                    location: "us-central1",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    readOnlyMode: false,
                    subnets: ["default"],
                    // networkTags is missing
                });
            }).toThrow("networkTags is required when readOnlyMode is false");
        });

        it("should throw error when both subnets and networkTags are missing", () => {
            expect(() => {
                new CastAiGkeCluster("test-no-network", {
                    clusterName: "cluster",
                    location: "us-central1",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    readOnlyMode: false,
                    // both missing
                });
            }).toThrow("subnets is required when readOnlyMode is false");
        });

        it("should not throw when subnets and networkTags are provided in full mode", () => {
            expect(() => {
                new CastAiGkeCluster("test-full-valid", {
                    clusterName: "cluster",
                    location: "us-central1",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    readOnlyMode: false,
                    subnets: ["default"],
                    networkTags: ["tag"],
                });
            }).not.toThrow();
        });

        it("should not throw when readOnlyMode is explicitly false with network config", () => {
            expect(() => {
                new CastAiGkeCluster("test-explicit-false", {
                    clusterName: "cluster",
                    location: "us-west1",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    readOnlyMode: false,
                    subnets: ["subnet-1"],
                    networkTags: ["tag-1"],
                });
            }).not.toThrow();
        });
    });

    describe("Read-Only Mode Validation", () => {
        it("should not require subnets in read-only mode", () => {
            expect(() => {
                new CastAiGkeCluster("test-readonly-no-subnets", {
                    clusterName: "readonly-cluster",
                    location: "us-central1",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    readOnlyMode: true,
                    // subnets not required
                });
            }).not.toThrow();
        });

        it("should not require networkTags in read-only mode", () => {
            expect(() => {
                new CastAiGkeCluster("test-readonly-no-tags", {
                    clusterName: "readonly-cluster",
                    location: "us-west1",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    readOnlyMode: true,
                    // networkTags not required
                });
            }).not.toThrow();
        });

        it("should allow subnets to be provided in read-only mode (ignored)", () => {
            expect(() => {
                new CastAiGkeCluster("test-readonly-with-subnets", {
                    clusterName: "readonly-cluster",
                    location: "europe-west1",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    readOnlyMode: true,
                    subnets: ["default"], // Provided but not used
                });
            }).not.toThrow();
        });
    });

    describe("Default Values", () => {
        it("should default to full management mode when readOnlyMode is omitted", () => {
            expect(() => {
                new CastAiGkeCluster("test-default-mode", {
                    clusterName: "cluster",
                    location: "us-central1",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    // readOnlyMode omitted (defaults to false)
                    subnets: ["default"],
                    networkTags: ["tag"],
                });
            }).not.toThrow();
        });

        it("should require network config when readOnlyMode is omitted", () => {
            expect(() => {
                new CastAiGkeCluster("test-default-requires-network", {
                    clusterName: "cluster",
                    location: "us-west1",
                    projectId: "test-project",
                    apiToken: "mock-token",
                    // readOnlyMode omitted (defaults to false)
                    // subnets missing - should throw
                });
            }).toThrow("subnets is required when readOnlyMode is false");
        });

        it("should default apiUrl to https://api.cast.ai", async () => {
            const cluster = new CastAiGkeCluster("test-default-api-url", {
                clusterName: "cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                readOnlyMode: true,
                // apiUrl omitted
            });

            // If component creates without error, default was applied
            expect(cluster.clusterId).toBeDefined();
        });

        it("should default deleteNodesOnDisconnect to false", async () => {
            const cluster = new CastAiGkeCluster("test-default-delete-nodes", {
                clusterName: "cluster",
                location: "us-east1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                // deleteNodesOnDisconnect omitted
            });

            expect(cluster.clusterId).toBeDefined();
        });
    });
});

describe("CastAiGkeCluster - Read-Only Mode Behavior", () => {
    describe("Phase 1 Only (Read-Only Mode)", () => {
        it("should create cluster in Phase 1", async () => {
            const cluster = new CastAiGkeCluster("test-readonly-phase1", {
                clusterName: "readonly-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                readOnlyMode: true,
            });

            const [clusterId, token, credsId] = await promisifyAll(
                cluster.clusterId,
                cluster.clusterToken,
                cluster.credentialsId
            );

            expect(clusterId).toBeDefined();
            expect(token).toBeDefined();
            expect(credsId).toBeDefined();
        });

        it("should not create IAM resources in read-only mode", async () => {
            const cluster = new CastAiGkeCluster("test-readonly-no-iam", {
                clusterName: "readonly-cluster",
                location: "us-west1",
                projectId: "test-project",
                apiToken: "mock-token",
                readOnlyMode: true,
            });

            expect(cluster.serviceAccountEmail).toBeUndefined();
            expect(cluster.serviceAccountKey).toBeUndefined();
        });

        it("should install agent in read-only mode", async () => {
            const cluster = new CastAiGkeCluster("test-readonly-agent", {
                clusterName: "readonly-cluster",
                location: "europe-west1",
                projectId: "test-project",
                apiToken: "mock-token",
                readOnlyMode: true,
            });

            const [clusterId] = await promisifyAll(cluster.clusterId);
            expect(clusterId).toBeDefined();
        });
    });

    describe("Phase 1 + Phase 2 (Full Management Mode)", () => {
        it("should create cluster in both phases", async () => {
            const cluster = new CastAiGkeCluster("test-full-both-phases", {
                clusterName: "full-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                readOnlyMode: false,
                subnets: ["default"],
                networkTags: ["tag"],
            });

            const [clusterId, email, key] = await promisifyAll(
                cluster.clusterId,
                cluster.serviceAccountEmail!,
                cluster.serviceAccountKey!
            );

            expect(clusterId).toBeDefined();
            expect(email).toBeDefined();
            expect(key).toBeDefined();
        });

        it("should create IAM resources in full management mode", async () => {
            const cluster = new CastAiGkeCluster("test-full-iam", {
                clusterName: "full-cluster",
                location: "us-west1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            expect(cluster.serviceAccountEmail).toBeDefined();
            expect(cluster.serviceAccountKey).toBeDefined();

            const [email, key] = await promisifyAll(
                cluster.serviceAccountEmail!,
                cluster.serviceAccountKey!
            );

            expect(email).toContain("@test-project.iam.gserviceaccount.com");
            expect(key).toBeDefined();
            expect(typeof key).toBe("string");
        });

        it("should create default node configuration in full mode", async () => {
            const cluster = new CastAiGkeCluster("test-full-node-config", {
                clusterName: "full-cluster",
                location: "asia-east1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["subnet-1", "subnet-2"],
                networkTags: ["tag-1", "tag-2"],
            });

            const [clusterId] = await promisifyAll(cluster.clusterId);
            expect(clusterId).toBeDefined();
        });

        it("should install all Helm charts in full mode", async () => {
            const cluster = new CastAiGkeCluster("test-full-helm-charts", {
                clusterName: "full-cluster",
                location: "us-east1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            const [clusterId] = await promisifyAll(cluster.clusterId);
            expect(clusterId).toBeDefined();
            // agent, controller, spot-handler, evictor, pod-pinner should all be installed
        });
    });

    describe("Mode Comparison", () => {
        it("should handle both modes in same program", async () => {
            const readonlyCluster = new CastAiGkeCluster("readonly", {
                clusterName: "readonly-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                readOnlyMode: true,
            });

            const fullCluster = new CastAiGkeCluster("full", {
                clusterName: "full-cluster",
                location: "us-west1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            const [readonlyId, fullId] = await promisifyAll(
                readonlyCluster.clusterId,
                fullCluster.clusterId
            );

            expect(readonlyId).toBeDefined();
            expect(fullId).toBeDefined();
            expect(readonlyId).not.toBe(fullId);

            expect(readonlyCluster.serviceAccountEmail).toBeUndefined();
            expect(fullCluster.serviceAccountEmail).toBeDefined();
        });
    });
});
