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

// Magic constants used by the Pulumi runtime to encode secret values when they
// reach the mock monitor. See pulumi.runtime.rpc.specialSigKey/specialSecretSig.
const SECRET_SIG_KEY = "4dabf18193072939515e22adb298388d";
const SECRET_SIG_VALUE = "1b47061264138c4ac30d75fd1eb44270";

/**
 * Returns true if `value` is the Pulumi runtime's wire-format secret wrapper
 * (i.e. `{ [specialSigKey]: specialSecretSig, value: <inner> }`).
 */
function isWrappedSecret(value: any): boolean {
    return (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value) &&
        value[SECRET_SIG_KEY] === SECRET_SIG_VALUE &&
        "value" in value
    );
}

/**
 * Comprehensive mock implementation for all resources used in CastAiGkeCluster
 */
class GkeClusterMocks implements pulumi.runtime.Mocks {
    public static helmReleases: pulumi.runtime.MockResourceArgs[] = [];
    public static k8sProviders: pulumi.runtime.MockResourceArgs[] = [];
    public static nodeConfigurations: pulumi.runtime.MockResourceArgs[] = [];

    public static reset(): void {
        GkeClusterMocks.helmReleases = [];
        GkeClusterMocks.k8sProviders = [];
        GkeClusterMocks.nodeConfigurations = [];
    }
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs = { ...args.inputs };

        // Mock ComponentResource (the CastAiGkeCluster itself)
        if (args.type === "castai:index:CastAiGkeCluster") {
            return {
                id: `${args.name}`,
                state: outputs,
            };
        }

        // Mock ComponentResource (GkeIamResources sub-component)
        if (args.type === "castai:index:GkeIamResources") {
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
        if (args.type === "castai:config/node:NodeConfiguration") {
            GkeClusterMocks.nodeConfigurations.push(args);
            return {
                id: `node-config-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    id: `node-config-${this.hash(args.name)}`,
                },
            };
        }

        // Mock CAST AI Node Configuration Default
        if (args.type === "castai:config/node:NodeConfigurationDefault") {
            return {
                id: `node-config-default-${this.hash(args.name)}`,
                state: outputs,
            };
        }

        // Mock Kubernetes Provider
        if (args.type === "pulumi:providers:kubernetes") {
            GkeClusterMocks.k8sProviders.push(args);
            return {
                id: `${args.name}-k8s-provider`,
                state: outputs,
            };
        }

        // Mock Helm Release
        if (args.type === "kubernetes:helm.sh/v3:Release") {
            GkeClusterMocks.helmReleases.push(args);
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
                masterAuth: {
                    clusterCaCertificate: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0t",
                },
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

beforeEach(() => {
    GkeClusterMocks.reset();
});

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

    describe("Secret Outputs", () => {
        it("should mark clusterToken as a secret", async () => {
            const cluster = new CastAiGkeCluster("test-secret-token", {
                clusterName: "secret-token-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            expect(cluster.clusterToken).toBeDefined();
            const isTokenSecret = await pulumi.isSecret(cluster.clusterToken);
            expect(isTokenSecret).toBe(true);
        });

        it("should mark serviceAccountKey as a secret", async () => {
            const cluster = new CastAiGkeCluster("test-secret-sa-key", {
                clusterName: "secret-sa-key-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                readOnlyMode: false,
            });

            expect(cluster.serviceAccountKey).toBeDefined();
            const isKeySecret = await pulumi.isSecret(cluster.serviceAccountKey!);
            expect(isKeySecret).toBe(true);
        });

        it("should not mark clusterId as a secret", async () => {
            const cluster = new CastAiGkeCluster("test-not-secret-cluster-id", {
                clusterName: "not-secret-cluster-id",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            expect(cluster.clusterId).toBeDefined();
            const isClusterIdSecret = await pulumi.isSecret(cluster.clusterId);
            expect(isClusterIdSecret).toBe(false);
        });
    });

    describe("Helm Release pinning and purge-on-delete", () => {
        it("should flow a custom helmChartVersion into every Helm release input", async () => {
            const cluster = new CastAiGkeCluster("test-custom-helm-version", {
                clusterName: "custom-version-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                helmChartVersion: "1.2.3",
            });

            await promisify(cluster.clusterId);
            expect(cluster.helmReleaseArgs).toBeDefined();
            expect(cluster.helmReleaseArgs!.length).toBe(5);
            for (const args of cluster.helmReleaseArgs!) {
                expect(args.version).toBe("1.2.3");
            }
        });

        it("should default helmChartVersion to undefined to use the latest chart version", async () => {
            const cluster = new CastAiGkeCluster("test-default-helm-version", {
                clusterName: "default-version-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            await promisify(cluster.clusterId);
            expect(cluster.helmReleaseArgs).toBeDefined();
            expect(cluster.helmReleaseArgs!.length).toBeGreaterThan(0);
            for (const args of cluster.helmReleaseArgs!) {
                expect(args.version).toBeUndefined();
            }
        });

        it("should set purgeOnDelete=true by default on every Helm release", async () => {
            const cluster = new CastAiGkeCluster("test-default-purge", {
                clusterName: "default-purge-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            await promisify(cluster.clusterId);
            expect(cluster.helmReleaseArgs).toBeDefined();
            expect(cluster.helmReleaseArgs!.length).toBeGreaterThan(0);
            for (const args of cluster.helmReleaseArgs!) {
                expect(args.purgeOnDelete).toBe(true);
            }
        });

        it("should flow a custom purgeOnDelete=false value into every Helm release input", async () => {
            const cluster = new CastAiGkeCluster("test-custom-purge", {
                clusterName: "custom-purge-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                purgeOnDelete: false,
            });

            await promisify(cluster.clusterId);
            expect(cluster.helmReleaseArgs).toBeDefined();
            expect(cluster.helmReleaseArgs!.length).toBeGreaterThan(0);
            for (const args of cluster.helmReleaseArgs!) {
                expect(args.purgeOnDelete).toBe(false);
            }
        });
    });

    describe("Helm Release apiKey secrets", () => {
        function findReleaseByChart(chart: string): pulumi.runtime.MockResourceArgs | undefined {
            return GkeClusterMocks.helmReleases.find(r => r.inputs && (r.inputs as any).chart === chart);
        }

        it("should wrap the agent release apiKey with pulumi.secret", async () => {
            const cluster = new CastAiGkeCluster("test-secret-agent-apikey", {
                clusterName: "agent-apikey-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            await promisify(cluster.clusterId);
            const release = findReleaseByChart("castai-agent");
            expect(release).toBeDefined();

            // Pulumi's secret propagation wraps any object that contains a secret
            // property using the wire-format sentinel. Unwrap before inspecting.
            const rawValues: any = release!.inputs.values;
            expect(isWrappedSecret(rawValues)).toBe(true);
            const values = rawValues.value;
            expect(values).toBeDefined();
            expect(values.provider).toBe("gke");
            expect(values.apiKey).toBeDefined();
        });

        it("should wrap the controller release castai.apiKey with pulumi.secret", async () => {
            const cluster = new CastAiGkeCluster("test-secret-controller-apikey", {
                clusterName: "controller-apikey-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            await promisify(cluster.clusterId);
            const release = findReleaseByChart("castai-cluster-controller");
            expect(release).toBeDefined();

            // The whole values object is wrapped because castai.apiKey is a secret.
            const rawValues: any = release!.inputs.values;
            expect(isWrappedSecret(rawValues)).toBe(true);
            const values = rawValues.value;
            expect(values).toBeDefined();
            expect(values.castai).toBeDefined();
            expect(values.castai.apiKey).toBeDefined();
        });

        it("should wrap the pod-pinner release castai.apiKey with pulumi.secret", async () => {
            const cluster = new CastAiGkeCluster("test-secret-podpinner-apikey", {
                clusterName: "podpinner-apikey-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            await promisify(cluster.clusterId);
            const release = findReleaseByChart("castai-pod-pinner");
            expect(release).toBeDefined();

            // The whole values object is wrapped because castai.apiKey is a secret.
            const rawValues: any = release!.inputs.values;
            expect(isWrappedSecret(rawValues)).toBe(true);
            const values = rawValues.value;
            expect(values).toBeDefined();
            expect(values.castai).toBeDefined();
            expect(values.castai.apiKey).toBeDefined();
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

    describe("Input<string> for clusterName and location", () => {
        it("should accept pulumi.output values for clusterName and location", async () => {
            expect(() => {
                new CastAiGkeCluster("test-output-inputs", {
                    clusterName: pulumi.output("my-cluster"),
                    location: pulumi.output("us-central1"),
                    projectId: "test-project",
                    apiToken: "mock-token",
                    readOnlyMode: true,
                });
            }).not.toThrow();

            const cluster = new CastAiGkeCluster("test-output-inputs-resolution", {
                clusterName: pulumi.output("my-cluster"),
                location: pulumi.output("us-central1"),
                projectId: "test-project",
                apiToken: "mock-token",
                readOnlyMode: true,
            });

            const [clusterId] = await promisifyAll(cluster.clusterId);
            expect(clusterId).toBeDefined();
            expect(typeof clusterId).toBe("string");
            expect(clusterId).toContain("cluster-");
        });
    });

    describe("Kubeconfig and Node Defaults", () => {
        it("should emit a kubeconfig that uses client.authentication.k8s.io/v1beta1", async () => {
            const cluster = new CastAiGkeCluster("kubeconfig-v1", {
                clusterName: "kubeconfig-v1-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            await promisify(cluster.clusterId);
            expect(cluster.k8sProviderArgs).toBeDefined();
            const kubeconfig = await promisify(cluster.k8sProviderArgs!.kubeconfig);
            expect(typeof kubeconfig).toBe("string");
            expect(kubeconfig).toContain("apiVersion: client.authentication.k8s.io/v1beta1");
            expect(kubeconfig).not.toContain("apiVersion: client.authentication.k8s.io/v1\n");
            expect(cluster.k8sProviderArgs!.clusterIdentifier).toBe(cluster.clusterId);
            expect(cluster.k8sProviderArgs!.deleteUnreachable).toBe(true);
        });

        it("should use default nodeDiskType=pd-standard when not provided", async () => {
            const cluster = new CastAiGkeCluster("default-disk-type", {
                clusterName: "default-disk-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            await promisify(cluster.clusterId);
            expect(cluster.defaultNodeConfigArgs).toBeDefined();
            const gke = await promisify(pulumi.output(cluster.defaultNodeConfigArgs!.gke));
            expect(gke!.diskType).toBe("pd-standard");
            expect(gke!.maxPodsPerNode).toBe(110);
        });

        it("should flow a custom nodeDiskType into the node configuration", async () => {
            const cluster = new CastAiGkeCluster("custom-disk-type", {
                clusterName: "custom-disk-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                nodeDiskType: "pd-ssd",
            });

            await promisify(cluster.clusterId);
            expect(cluster.defaultNodeConfigArgs).toBeDefined();
            const gke = await promisify(pulumi.output(cluster.defaultNodeConfigArgs!.gke));
            expect(gke!.diskType).toBe("pd-ssd");
            expect(gke!.maxPodsPerNode).toBe(110);
        });

        it("should flow a custom nodeMaxPodsPerNode into the node configuration", async () => {
            const cluster = new CastAiGkeCluster("custom-max-pods", {
                clusterName: "custom-max-pods-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                nodeMaxPodsPerNode: 64,
            });

            await promisify(cluster.clusterId);
            expect(cluster.defaultNodeConfigArgs).toBeDefined();
            const gke = await promisify(pulumi.output(cluster.defaultNodeConfigArgs!.gke));
            expect(gke!.diskType).toBe("pd-standard");
            expect(gke!.maxPodsPerNode).toBe(64);
        });

        it("should flow both custom nodeDiskType and nodeMaxPodsPerNode together", async () => {
            const cluster = new CastAiGkeCluster("custom-both", {
                clusterName: "custom-both-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                nodeDiskType: "pd-balanced",
                nodeMaxPodsPerNode: 32,
            });

            await promisify(cluster.clusterId);
            expect(cluster.defaultNodeConfigArgs).toBeDefined();
            const gke = await promisify(pulumi.output(cluster.defaultNodeConfigArgs!.gke));
            expect(gke!.diskType).toBe("pd-balanced");
            expect(gke!.maxPodsPerNode).toBe(32);
        });

        it("should accept pulumi.Input values for nodeDiskType and nodeMaxPodsPerNode", async () => {
            const cluster = new CastAiGkeCluster("custom-inputs", {
                clusterName: "custom-inputs-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                nodeDiskType: pulumi.output("pd-extreme"),
                nodeMaxPodsPerNode: pulumi.output(16),
            });

            await promisify(cluster.clusterId);
            expect(cluster.defaultNodeConfigArgs).toBeDefined();
            const gke = await promisify(pulumi.output(cluster.defaultNodeConfigArgs!.gke));
            const diskType = await promisify(pulumi.output(gke!.diskType));
            const maxPods = await promisify(pulumi.output(gke!.maxPodsPerNode));
            expect(diskType).toBe("pd-extreme");
            expect(maxPods).toBe(16);
        });
    });

    describe("Impersonation fallback and key rotation", () => {
        it("should still create a service account key when useImpersonation is true (GKE fallback)", async () => {
            const cluster = new CastAiGkeCluster("test-impersonation-fallback", {
                clusterName: "impersonation-fallback-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                useImpersonation: true,
            });

            // Fallback: even with the flag enabled, a JSON service-account key
            // is still issued because GKE impersonation is unsupported upstream.
            expect(cluster.serviceAccountKey).toBeDefined();
            const isKeySecret = await pulumi.isSecret(cluster.serviceAccountKey!);
            expect(isKeySecret).toBe(true);

            const [keyJson] = await promisifyAll(cluster.serviceAccountKey!);
            expect(keyJson).toBeDefined();
            expect(typeof keyJson).toBe("string");
            expect(() => JSON.parse(keyJson)).not.toThrow();
            expect(JSON.parse(keyJson).type).toBe("service_account");
        });

        it("should include a rotation suffix when keyRotationDays is provided", async () => {
            const cluster = new CastAiGkeCluster("test-key-rotation", {
                clusterName: "key-rotation-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
                keyRotationDays: 30,
            });

            expect(cluster.serviceAccountKeyName).toBeDefined();

            const [keyName] = await promisifyAll(cluster.serviceAccountKeyName!);
            expect(typeof keyName).toBe("string");
            // Format is `${name}-key-${rotationSuffix}` where rotationSuffix is
            // a non-negative integer derived from the current timestamp.
            expect(keyName).toMatch(/-key-\d+$/);

            // Verify it does NOT match the un-suffixed default.
            expect(keyName).not.toMatch(/-key$/);

            // Extract the trailing numeric suffix (rotation boundary index).
            const match = keyName.match(/-key-(\d+)$/);
            expect(match).not.toBeNull();
            const suffix = parseInt(match![1], 10);
            expect(Number.isFinite(suffix)).toBe(true);
            expect(suffix).toBeGreaterThan(0);

            // Cross-check the suffix matches the expected formula at runtime.
            const expectedSuffix = Math.floor(Date.now() / (30 * 24 * 60 * 60 * 1000));
            // Allow the boundary to advance between the two reads.
            expect([expectedSuffix - 1, expectedSuffix, expectedSuffix + 1]).toContain(suffix);
        });

        it("should omit the rotation suffix when keyRotationDays is not provided", async () => {
            const cluster = new CastAiGkeCluster("test-no-rotation", {
                clusterName: "no-rotation-cluster",
                location: "us-central1",
                projectId: "test-project",
                apiToken: "mock-token",
                subnets: ["default"],
                networkTags: ["tag"],
            });

            expect(cluster.serviceAccountKeyName).toBeDefined();

            const [keyName] = await promisifyAll(cluster.serviceAccountKeyName!);
            // Default format is `${name}-key` with no trailing numeric suffix.
            expect(keyName).toMatch(/-key$/);
            expect(keyName).not.toMatch(/-key-\d+$/);
        });
    });
});
