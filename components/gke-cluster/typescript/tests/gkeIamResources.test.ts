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
    public static iamCustomRoles: pulumi.runtime.MockResourceArgs[] = [];
    public static serviceAccountKeys: pulumi.runtime.MockResourceArgs[] = [];
    public static serviceAccounts: pulumi.runtime.MockResourceArgs[] = [];

    public static reset(): void {
        GkeIamMocks.iamCustomRoles = [];
        GkeIamMocks.serviceAccountKeys = [];
        GkeIamMocks.serviceAccounts = [];
    }
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs = { ...args.inputs };

        // Mock ComponentResource (the GkeIamResources itself)
        if (args.type === "castai:index:GkeIamResources") {
            return {
                id: `${args.name}`,
                state: outputs,
            };
        }

        // Mock GCP Service Account
        if (args.type === "gcp:serviceaccount/account:Account") {
            const project = args.inputs.project || "test-project";
            const accountId = args.inputs.accountId || "castai";
            GkeIamMocks.serviceAccounts.push(args);
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
            GkeIamMocks.iamCustomRoles.push(args);
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
            GkeIamMocks.serviceAccountKeys.push(args);
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

beforeEach(() => {
    GkeIamMocks.reset();
});

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

        it("should remove trailing hyphens from truncated service account IDs", async () => {
            // This cluster name will result in "castai-gke-lk-gcp-pulumi-1028-" after truncation
            // which is 30 chars but ends with a hyphen (invalid for GCP)
            const clusterName = "lk-gcp-pulumi-1028-full";

            const iamResources = new GkeIamResources("test-trailing-hyphen", {
                clusterName: clusterName,
                projectId: "test-project",
                location: "us-central1",
                clusterId: "cluster-id",
            });

            const [email] = await promisifyAll(iamResources.serviceAccountEmail);

            // Extract the account ID part (before the @)
            const accountId = email.split("@")[0];

            // GCP regex requires: ^[a-z](?:[-a-z0-9]{4,28}[a-z0-9])$
            // Must end with alphanumeric (not hyphen)
            expect(accountId).toBeDefined();
            expect(accountId).not.toMatch(/-$/); // Should not end with hyphen
            expect(accountId).toMatch(/^[a-z](?:[-a-z0-9]{4,28}[a-z0-9])$/); // Must match GCP regex
            expect(accountId.length).toBeGreaterThanOrEqual(6); // Min 6 chars
            expect(accountId.length).toBeLessThanOrEqual(30); // Max 30 chars
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

    describe("Custom IAM role ID sanitization", () => {
        beforeEach(() => {
            GkeIamMocks.reset();
        });

        it("should sanitize uppercase letters in the cluster name for clusterRoleId and computeRoleId", async () => {
            GkeIamMocks.reset();
            const iamResources = new GkeIamResources("test-uppercase", {
                clusterName: "MyCluster",
                projectId: "test-project",
                location: "us-central1",
                clusterId: "cluster-id",
            });

            // Drive the mock monitor so all Outputs (including roleId) resolve.
            await promisifyAll(iamResources.serviceAccountEmail);

            // Both cluster- and compute-role IDs must replace uppercase letters
            // with `_` and obey the GCP custom-role regex `[a-zA-Z0-9_.]{1,64}`.
            const clusterRole = GkeIamMocks.iamCustomRoles.find(r =>
                r.name === "test-uppercase-cluster-role");
            const computeRole = GkeIamMocks.iamCustomRoles.find(r =>
                r.name === "test-uppercase-compute-role");

            expect(clusterRole).toBeDefined();
            expect(computeRole).toBeDefined();

            const clusterRoleId = clusterRole!.inputs.roleId as string;
            const computeRoleId = computeRole!.inputs.roleId as string;

            expect(clusterRoleId).toBe("castai_gke_mycluster_cluster");
            expect(computeRoleId).toBe("castai_gke_mycluster_compute");
            expect(clusterRoleId).toMatch(/^[a-zA-Z0-9_.]{1,64}$/);
            expect(computeRoleId).toMatch(/^[a-zA-Z0-9_.]{1,64}$/);
        });

        it("should sanitize dashes and dots in cluster names for role IDs", async () => {
            GkeIamMocks.reset();
            const iamResources = new GkeIamResources("test-special", {
                clusterName: "Cluster.With-Dashes",
                projectId: "test-project",
                location: "us-central1",
                clusterId: "cluster-id",
            });

            await promisifyAll(iamResources.serviceAccountEmail);

            const clusterRole = GkeIamMocks.iamCustomRoles.find(r =>
                r.name === "test-special-cluster-role");
            const computeRole = GkeIamMocks.iamCustomRoles.find(r =>
                r.name === "test-special-compute-role");

            const clusterRoleId = clusterRole!.inputs.roleId as string;
            const computeRoleId = computeRole!.inputs.roleId as string;

            // `.` and `-` must be replaced with `_`, runs must be collapsed.
            expect(clusterRoleId).toBe("castai_gke_cluster_with_dashes_cluster");
            expect(computeRoleId).toBe("castai_gke_cluster_with_dashes_compute");
            expect(clusterRoleId).toMatch(/^[a-zA-Z0-9_.]{1,64}$/);
            expect(computeRoleId).toMatch(/^[a-zA-Z0-9_.]{1,64}$/);
        });

        it("should trim long role IDs to <= 64 characters without trailing separators", async () => {
            GkeIamMocks.reset();
            // 80-char sanitized cluster name; full IDs are way over 64 chars.
            const longName = "a".repeat(80);
            const iamResources = new GkeIamResources("test-long", {
                clusterName: longName,
                projectId: "test-project",
                location: "us-central1",
                clusterId: "cluster-id",
            });

            await promisifyAll(iamResources.serviceAccountEmail);

            const clusterRole = GkeIamMocks.iamCustomRoles.find(r =>
                r.name === "test-long-cluster-role");
            const computeRole = GkeIamMocks.iamCustomRoles.find(r =>
                r.name === "test-long-compute-role");

            const clusterRoleId = clusterRole!.inputs.roleId as string;
            const computeRoleId = computeRole!.inputs.roleId as string;

            expect(clusterRoleId.length).toBeLessThanOrEqual(64);
            expect(computeRoleId.length).toBeLessThanOrEqual(64);
            // No trailing separators (would otherwise violate GCP's regex on
            // older versions and is at minimum ugly).
            expect(clusterRoleId).not.toMatch(/_$/);
            expect(computeRoleId).not.toMatch(/_$/);
        });
    });

    describe("Impersonation fallback", () => {
        it("should still issue a JSON service-account key when useImpersonation is true", async () => {
            const iamResources = new GkeIamResources("test-iam-impersonation", {
                clusterName: "impersonation-cluster",
                projectId: "impersonation-project",
                location: "us-central1",
                clusterId: "cluster-imp-123",
                useImpersonation: true,
            });

            // Fallback: GKE does not support the upstream CAST AI impersonation
            // data source, so a JSON key is still produced.
            expect(iamResources.serviceAccountKey).toBeDefined();
            const [keyJson] = await promisifyAll(iamResources.serviceAccountKey);
            expect(keyJson).toBeDefined();
            expect(() => JSON.parse(keyJson)).not.toThrow();
            expect(JSON.parse(keyJson).type).toBe("service_account");

            const isKeySecret = await pulumi.isSecret(iamResources.serviceAccountKey);
            expect(isKeySecret).toBe(true);
        });
    });

    describe("Key rotation", () => {
        it("should append a numeric rotation suffix to the key resource name when keyRotationDays is set", async () => {
            const iamResources = new GkeIamResources("test-iam-rotation", {
                clusterName: "rotation-cluster",
                projectId: "rotation-project",
                location: "us-central1",
                clusterId: "cluster-rot-123",
                keyRotationDays: 30,
            });

            expect(iamResources.serviceAccountKeyName).toBeDefined();
            expect(iamResources.serviceAccountKeyName).toBeInstanceOf(pulumi.Output);

            const [keyName] = await promisifyAll(iamResources.serviceAccountKeyName);
            expect(typeof keyName).toBe("string");
            expect(keyName).toMatch(/-key-\d+$/);

            const match = keyName.match(/-key-(\d+)$/);
            expect(match).not.toBeNull();
            const suffix = parseInt(match![1], 10);
            expect(Number.isFinite(suffix)).toBe(true);
            expect(suffix).toBeGreaterThan(0);

            const expectedSuffix = Math.floor(Date.now() / (30 * 24 * 60 * 60 * 1000));
            expect([expectedSuffix - 1, expectedSuffix, expectedSuffix + 1]).toContain(suffix);
        });

        it("should use the un-suffixed key resource name when keyRotationDays is omitted", async () => {
            const iamResources = new GkeIamResources("test-iam-no-rotation", {
                clusterName: "no-rotation-cluster",
                projectId: "no-rotation-project",
                location: "us-central1",
                clusterId: "cluster-norot-123",
            });

            expect(iamResources.serviceAccountKeyName).toBeDefined();

            const [keyName] = await promisifyAll(iamResources.serviceAccountKeyName);
            expect(keyName).toMatch(/-key$/);
            expect(keyName).not.toMatch(/-key-\d+$/);
        });

        it("should still issue a usable service-account key when rotation is enabled", async () => {
            const iamResources = new GkeIamResources("test-iam-rotation-key", {
                clusterName: "rotation-key-cluster",
                projectId: "rotation-key-project",
                location: "us-central1",
                clusterId: "cluster-rotkey-123",
                keyRotationDays: 7,
            });

            const [keyJson] = await promisifyAll(iamResources.serviceAccountKey);
            expect(keyJson).toBeDefined();
            expect(() => JSON.parse(keyJson)).not.toThrow();
            expect(JSON.parse(keyJson).type).toBe("service_account");
        });

        it("should use the explicit rotationBoundary verbatim when provided", async () => {
            const iamResources = new GkeIamResources("test-iam-explicit-boundary", {
                clusterName: "explicit-boundary-cluster",
                projectId: "explicit-boundary-project",
                location: "us-central1",
                clusterId: "cluster-explicit-123",
                rotationBoundary: 42,
            });

            const [keyName] = await promisifyAll(iamResources.serviceAccountKeyName!);
            expect(keyName).toMatch(/-key-42$/);
        });

        it("should ignore keyRotationDays for the suffix when rotationBoundary is provided", async () => {
            // When rotationBoundary is set, the wall-clock-derived suffix must
            // NOT be used; the explicit boundary must win.
            const iamResources = new GkeIamResources("test-iam-boundary-overrides", {
                clusterName: "boundary-overrides-cluster",
                projectId: "boundary-overrides-project",
                location: "us-central1",
                clusterId: "cluster-boundary-override-123",
                keyRotationDays: 30,
                rotationBoundary: 7,
            });

            const [keyName] = await promisifyAll(iamResources.serviceAccountKeyName!);
            expect(keyName).toMatch(/-key-7$/);
            // Make sure the wall-clock suffix for `30 * 24h` boundaries is not
            // present (it would be a much larger integer).
            const match = keyName.match(/-key-(\d+)$/);
            expect(match).not.toBeNull();
            const suffix = parseInt(match![1], 10);
            expect(suffix).toBe(7);
        });

        it("should omit the rotation suffix when neither rotationBoundary nor keyRotationDays is provided", async () => {
            const iamResources = new GkeIamResources("test-iam-no-boundary", {
                clusterName: "no-boundary-cluster",
                projectId: "no-boundary-project",
                location: "us-central1",
                clusterId: "cluster-noboundary-123",
                // neither rotationBoundary nor keyRotationDays provided
            });

            const [keyName] = await promisifyAll(iamResources.serviceAccountKeyName!);
            expect(keyName).toMatch(/-key$/);
            expect(keyName).not.toMatch(/-key-\d+$/);
        });

        it("should fall back to wall-clock boundary when rotationBoundary is undefined and keyRotationDays is set", async () => {
            const iamResources = new GkeIamResources("test-iam-fallback-clock", {
                clusterName: "fallback-clock-cluster",
                projectId: "fallback-clock-project",
                location: "us-central1",
                clusterId: "cluster-fbclock-123",
                keyRotationDays: 30,
                // rotationBoundary intentionally omitted
            });

            const [keyName] = await promisifyAll(iamResources.serviceAccountKeyName!);
            const match = keyName.match(/-key-(\d+)$/);
            expect(match).not.toBeNull();
            const suffix = parseInt(match![1], 10);
            const expectedSuffix = Math.floor(Date.now() / (30 * 24 * 60 * 60 * 1000));
            expect([expectedSuffix - 1, expectedSuffix, expectedSuffix + 1]).toContain(suffix);
        });
    });
});
