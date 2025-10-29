/**
 * Mock Tests for CAST AI AKS Cluster Creation (TypeScript)
 *
 * These tests use Pulumi's built-in mocking to test AKS cluster creation
 * without making actual API calls to CAST AI or Azure.
 *
 * Run with: npm test
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";
import { promisify, promisifyAll } from "./test-utils";

/**
 * Mock implementation for CAST AI and Azure resources.
 */
class CastAIMocks implements pulumi.runtime.Mocks {
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs = { ...args.inputs };

        if (args.type === "castai:azure:AksCluster") {
            return {
                id: `${args.name}-cluster-id-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    id: `${args.name}-cluster-id-${this.hash(args.name)}`,
                    clusterToken: `mock-aks-token-${this.hash(args.name)}`,
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

describe("AKS Cluster Creation", () => {
    it("should create an AKS cluster with correct configuration", async () => {
        const cluster = new castai.AksCluster("test-aks-cluster", {
            subscriptionId: "12345678-1234-1234-1234-123456789012",
            tenantId: "87654321-4321-4321-4321-210987654321",
            clientId: "abcdef12-3456-7890-abcd-ef1234567890",
            clientSecret: "mock-client-secret-value",
            name: "my-aks-cluster",
            region: "eastus",
            nodeResourceGroup: "MC_my-rg_my-aks-cluster_eastus",
            deleteNodesOnDisconnect: true,
        });

        const [clusterName, clusterToken, subscriptionId, region] =
            await promisifyAll(
                cluster.name,
                cluster.clusterToken,
                cluster.subscriptionId,
                cluster.region
            );

        expect(clusterName).toBe("my-aks-cluster");
        expect(clusterToken).toBeDefined();
        expect(typeof clusterToken).toBe("string");
        expect((clusterToken as string).length).toBeGreaterThan(0);
        expect(subscriptionId).toBe("12345678-1234-1234-1234-123456789012");
        expect(region).toBe("eastus");
    });

    it("should create AKS clusters in different Azure regions", async () => {
        const regions = ["eastus", "westus2", "northeurope", "southeastasia"];

        for (const region of regions) {
            const cluster = new castai.AksCluster(`test-aks-${region}`, {
                subscriptionId: "12345678-1234-1234-1234-123456789012",
                tenantId: "87654321-4321-4321-4321-210987654321",
                clientId: "abcdef12-3456-7890-abcd-ef1234567890",
                clientSecret: "mock-secret",
                name: `cluster-${region}`,
                region: region,
                nodeResourceGroup: `MC_rg_cluster-${region}_${region}`,
                deleteNodesOnDisconnect: false,
            });

            const r = await promisify(cluster.region);
            expect(r).toBe(region);
        }
    });

    it("should handle delete_nodes_on_disconnect setting", async () => {
        const clusterDelete = new castai.AksCluster("test-aks-delete", {
            subscriptionId: "12345678-1234-1234-1234-123456789012",
            tenantId: "87654321-4321-4321-4321-210987654321",
            clientId: "abcdef12-3456-7890-abcd-ef1234567890",
            clientSecret: "mock-secret",
            name: "delete-cluster",
            region: "eastus",
            nodeResourceGroup: "MC_rg_delete-cluster_eastus",
            deleteNodesOnDisconnect: true,
        });

        const clusterKeep = new castai.AksCluster("test-aks-keep", {
            subscriptionId: "12345678-1234-1234-1234-123456789012",
            tenantId: "87654321-4321-4321-4321-210987654321",
            clientId: "abcdef12-3456-7890-abcd-ef1234567890",
            clientSecret: "mock-secret",
            name: "keep-cluster",
            region: "westus",
            nodeResourceGroup: "MC_rg_keep-cluster_westus",
            deleteNodesOnDisconnect: false,
        });

        const [deleteVal, keepVal] = await promisifyAll(
            clusterDelete.deleteNodesOnDisconnect,
            clusterKeep.deleteNodesOnDisconnect
        );

        expect(deleteVal).toBe(true);
        expect(keepVal).toBe(false);
    });

    it("should create AKS cluster with custom node resource group", async () => {
        // Azure creates a separate resource group for cluster nodes
        const nodeRg = "MC_custom-rg_production-aks_eastus2";

        const cluster = new castai.AksCluster("test-aks-node-rg", {
            subscriptionId: "12345678-1234-1234-1234-123456789012",
            tenantId: "87654321-4321-4321-4321-210987654321",
            clientId: "abcdef12-3456-7890-abcd-ef1234567890",
            clientSecret: "mock-secret",
            name: "production-aks",
            region: "eastus2",
            nodeResourceGroup: nodeRg,
            deleteNodesOnDisconnect: false,
        });

        const [rg, clusterName] = await promisifyAll(
            cluster.nodeResourceGroup,
            cluster.name
        );

        expect(rg).toBe(nodeRg);
        expect(clusterName).toBe("production-aks");
    });

    it("should create AKS cluster with service principal authentication", async () => {
        // Service principal credentials
        const spClientId = "11111111-2222-3333-4444-555555555555";
        const spClientSecret = "mock-service-principal-secret-value";

        const cluster = new castai.AksCluster("test-aks-sp", {
            subscriptionId: "12345678-1234-1234-1234-123456789012",
            tenantId: "87654321-4321-4321-4321-210987654321",
            clientId: spClientId,
            clientSecret: spClientSecret,
            name: "sp-cluster",
            region: "westeurope",
            nodeResourceGroup: "MC_rg_sp-cluster_westeurope",
            deleteNodesOnDisconnect: true,
        });

        const [clientId, clusterName] = await promisifyAll(
            cluster.clientId,
            cluster.name
        );

        expect(clientId).toBe(spClientId);
        expect(clusterName).toBe("sp-cluster");
    });

    it("should create AKS clusters across different Azure subscriptions", async () => {
        const subscriptions = [
            "11111111-1111-1111-1111-111111111111",
            "22222222-2222-2222-2222-222222222222",
            "33333333-3333-3333-3333-333333333333",
        ];

        for (let i = 0; i < subscriptions.length; i++) {
            const subId = subscriptions[i];
            const cluster = new castai.AksCluster(`test-aks-sub-${i}`, {
                subscriptionId: subId,
                tenantId: "87654321-4321-4321-4321-210987654321",
                clientId: "abcdef12-3456-7890-abcd-ef1234567890",
                clientSecret: "mock-secret",
                name: `cluster-sub-${i}`,
                region: "eastus",
                nodeResourceGroup: `MC_rg_cluster-sub-${i}_eastus`,
                deleteNodesOnDisconnect: false,
            });

            const sub = await promisify(cluster.subscriptionId);
            expect(sub).toBe(subId);
        }
    });

    it("should validate AKS cluster required fields", async () => {
        // Test that resource creation accepts all required fields
        const cluster = new castai.AksCluster("test-validation", {
            subscriptionId: "12345678-1234-1234-1234-123456789012",
            tenantId: "87654321-4321-4321-4321-210987654321",
            clientId: "abcdef12-3456-7890-abcd-ef1234567890",
            clientSecret: "mock-secret",
            name: "validation-cluster",
            region: "eastus",
            nodeResourceGroup: "MC_rg_validation-cluster_eastus",
            deleteNodesOnDisconnect: true,
        });

        const clusterName = await promisify(cluster.name);
        expect(clusterName).toBe("validation-cluster");
    });

    it("should create AKS cluster with minimal required configuration", async () => {
        const cluster = new castai.AksCluster("test-aks-minimal", {
            subscriptionId: "99999999-9999-9999-9999-999999999999",
            tenantId: "88888888-8888-8888-8888-888888888888",
            clientId: "77777777-7777-7777-7777-777777777777",
            clientSecret: "minimal-secret",
            name: "minimal-aks",
            region: "centralus",
            nodeResourceGroup: "MC_minimal_minimal-aks_centralus",
            deleteNodesOnDisconnect: false,
        });

        const [clusterName, subscriptionId] = await promisifyAll(
            cluster.name,
            cluster.subscriptionId
        );

        expect(clusterName).toBe("minimal-aks");
        expect(subscriptionId).toBe("99999999-9999-9999-9999-999999999999");
    });
});
