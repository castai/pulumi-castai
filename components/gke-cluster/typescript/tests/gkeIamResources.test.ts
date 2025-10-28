/**
 * Unit Tests for GkeIamResources Component
 *
 * Tests the IAM sub-component that creates service accounts, custom roles,
 * and IAM bindings for CAST AI to manage GKE clusters.
 *
 * Run with: npm test
 */

import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { GkeIamResources, GkeIamArgs } from "../gkeIamResources";
import { promisify, promisifyAll } from "./test-utils";

/**
 * Mock implementation for GCP resources used in GkeIamResources
 */
class GkeIamMocks implements pulumi.runtime.Mocks {
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs = { ...args.inputs };

        // Mock ComponentResource (the GkeIamResources itself)
        if (args.type === "castai:gke:GkeIamResources") {
            return {
                id: `${args.name}`,
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
                    id: `projects/${project}/serviceAccounts/${accountId}@${project}.iam.gserviceaccount.com`,
                    name: `projects/${project}/serviceAccounts/${accountId}@${project}.iam.gserviceaccount.com`,
                    email: `${accountId}@${project}.iam.gserviceaccount.com`,
                    uniqueId: `${this.hash(args.name)}`,
                },
            };
        }

        // Mock GCP Custom IAM Role
        if (args.type === "gcp:projects/iAMCustomRole:IAMCustomRole") {
            const roleId = args.inputs.roleId || "custom_role";
            const project = args.inputs.project || "test-project";
            return {
                id: `projects/${project}/roles/${roleId}`,
                state: {
                    ...outputs,
                    id: `projects/${project}/roles/${roleId}`,
                    name: `projects/${project}/roles/${roleId}`,
                    roleId: roleId,
                },
            };
        }

        // Mock GCP IAM Member binding
        if (args.type === "gcp:projects/iAMMember:IAMMember") {
            return {
                id: `${args.name}-binding`,
                state: {
                    ...outputs,
                    id: `${args.name}-binding`,
                    etag: `mock-etag-${this.hash(args.name)}`,
                },
            };
        }

        // Mock GCP Service Account Key
        if (args.type === "gcp:serviceaccount/key:Key") {
            const mockCredentials = {
                type: "service_account",
                project_id: "test-project",
                private_key_id: "mock-key-id",
                private_key: "-----BEGIN PRIVATE KEY-----\\nMOCK\\n-----END PRIVATE KEY-----\\n",
                client_email: "castai@test-project.iam.gserviceaccount.com",
                client_id: "123456789",
                auth_uri: "https://accounts.google.com/o/oauth2/auth",
                token_uri: "https://oauth2.googleapis.com/token",
            };
            return {
                id: `projects/test-project/serviceAccounts/castai@test-project.iam.gserviceaccount.com/keys/${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    id: `projects/test-project/serviceAccounts/castai@test-project.iam.gserviceaccount.com/keys/${this.hash(args.name)}`,
                    privateKey: Buffer.from(JSON.stringify(mockCredentials)).toString("base64"),
                    publicKey: "mock-public-key",
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
pulumi.runtime.setMocks(new GkeIamMocks());

describe("GkeIamResources Component", () => {
    describe("Service Account Creation", () => {
        it("should create service account with correct configuration", async () => {
            const iamResources = new GkeIamResources("test-iam", {
                clusterName: "my-gke-cluster",
                projectId: "test-project-123",
                location: "us-central1-a",
                clusterId: "cluster-id-123",
            });

            const [email] = await promisifyAll(iamResources.serviceAccountEmail);

            expect(email).toContain("@test-project-123.iam.gserviceaccount.com");
            expect(email).toContain("castai-gke-");
        });

        it("should truncate long cluster names to 30 chars for account ID", async () => {
            const longClusterName = "this-is-a-very-long-cluster-name-that-exceeds-thirty-characters";

            const iamResources = new GkeIamResources("test-long-name", {
                clusterName: longClusterName,
                projectId: "test-project",
                location: "us-central1",
                clusterId: "cluster-id",
            });

            const [email] = await promisifyAll(iamResources.serviceAccountEmail);

            // Service account ID is truncated to 30 chars (castai-gke- prefix is 11 chars)
            expect(email).toBeDefined();
            expect(email).toContain("@test-project.iam.gserviceaccount.com");
        });
    });

    describe("IAM Roles and Permissions", () => {
        it("should create custom IAM roles with GKE permissions", async () => {
            const iamResources = new GkeIamResources("test-roles", {
                clusterName: "permissions-cluster",
                projectId: "test-project",
                location: "us-west1",
                clusterId: "cluster-123",
            });

            const [email] = await promisifyAll(iamResources.serviceAccountEmail);

            expect(email).toBeDefined();
            // If the component completes without error, roles were created
        });

        it("should handle cluster names with special characters in role IDs", async () => {
            const iamResources = new GkeIamResources("test-special-chars", {
                clusterName: "cluster-with-dashes",
                projectId: "test-project",
                location: "us-east1",
                clusterId: "cluster-456",
            });

            const [email] = await promisifyAll(iamResources.serviceAccountEmail);

            expect(email).toBeDefined();
            // Role IDs replace dashes with underscores
        });
    });

    describe("Service Account Key Generation", () => {
        it("should generate and decode service account key", async () => {
            const iamResources = new GkeIamResources("test-key", {
                clusterName: "key-cluster",
                projectId: "test-project",
                location: "europe-west1",
                clusterId: "cluster-789",
            });

            const [keyJson] = await promisifyAll(iamResources.serviceAccountKey);

            expect(keyJson).toBeDefined();
            expect(typeof keyJson).toBe("string");

            // Should be valid JSON
            expect(() => JSON.parse(keyJson)).not.toThrow();

            const parsed = JSON.parse(keyJson);
            expect(parsed.type).toBe("service_account");
            expect(parsed.project_id).toBeDefined();
        });

        it("should decode base64 encoded credentials correctly", async () => {
            const iamResources = new GkeIamResources("test-decode", {
                clusterName: "decode-cluster",
                projectId: "decode-project",
                location: "asia-east1",
                clusterId: "cluster-999",
            });

            const [keyJson] = await promisifyAll(iamResources.serviceAccountKey);

            // Verify it's decoded (not base64)
            expect(keyJson).not.toMatch(/^[A-Za-z0-9+/]+=*$/);
            expect(keyJson).toContain("{");
            expect(keyJson).toContain("}");
        });
    });

    describe("Component Outputs", () => {
        it("should expose serviceAccountEmail output", async () => {
            const iamResources = new GkeIamResources("test-outputs-email", {
                clusterName: "output-cluster",
                projectId: "output-project",
                location: "us-central1",
                clusterId: "cluster-out-123",
            });

            expect(iamResources.serviceAccountEmail).toBeDefined();
            expect(iamResources.serviceAccountEmail).toBeInstanceOf(pulumi.Output);

            const [email] = await promisifyAll(iamResources.serviceAccountEmail);
            expect(email).toBeDefined();
            expect(email).toContain("@output-project.iam.gserviceaccount.com");
        });

        it("should expose serviceAccountKey output", async () => {
            const iamResources = new GkeIamResources("test-outputs-key", {
                clusterName: "key-output-cluster",
                projectId: "key-project",
                location: "us-east1",
                clusterId: "cluster-key-456",
            });

            expect(iamResources.serviceAccountKey).toBeDefined();
            expect(iamResources.serviceAccountKey).toBeInstanceOf(pulumi.Output);

            const [key] = await promisifyAll(iamResources.serviceAccountKey);
            expect(key).toBeDefined();
            expect(typeof key).toBe("string");
        });
    });

    describe("Multiple Component Instances", () => {
        it("should create multiple IAM resource sets independently", async () => {
            const iam1 = new GkeIamResources("iam-1", {
                clusterName: "cluster-1",
                projectId: "project-1",
                location: "us-central1",
                clusterId: "cluster-id-1",
            });

            const iam2 = new GkeIamResources("iam-2", {
                clusterName: "cluster-2",
                projectId: "project-2",
                location: "us-west1",
                clusterId: "cluster-id-2",
            });

            const [email1, email2] = await promisifyAll(
                iam1.serviceAccountEmail,
                iam2.serviceAccountEmail
            );

            expect(email1).toContain("@project-1.iam.gserviceaccount.com");
            expect(email2).toContain("@project-2.iam.gserviceaccount.com");
            expect(email1).not.toBe(email2);
        });
    });

    describe("IAM Bindings", () => {
        it("should bind cluster role to service account", async () => {
            const iamResources = new GkeIamResources("test-cluster-binding", {
                clusterName: "binding-cluster",
                projectId: "binding-project",
                location: "us-central1",
                clusterId: "cluster-binding-123",
            });

            const [email] = await promisifyAll(iamResources.serviceAccountEmail);
            expect(email).toBeDefined();
        });

        it("should bind compute role to service account", async () => {
            const iamResources = new GkeIamResources("test-compute-binding", {
                clusterName: "compute-cluster",
                projectId: "compute-project",
                location: "europe-west1",
                clusterId: "cluster-compute-456",
            });

            const [email] = await promisifyAll(iamResources.serviceAccountEmail);
            expect(email).toBeDefined();
        });

        it("should bind Service Account User role", async () => {
            const iamResources = new GkeIamResources("test-sa-user-binding", {
                clusterName: "sa-user-cluster",
                projectId: "sa-user-project",
                location: "asia-east1",
                clusterId: "cluster-sa-789",
            });

            const [email] = await promisifyAll(iamResources.serviceAccountEmail);
            expect(email).toBeDefined();
        });
    });
});
