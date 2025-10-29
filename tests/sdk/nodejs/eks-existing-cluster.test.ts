/**
 * Mock Tests for Connecting Existing EKS Clusters to CAST AI (TypeScript)
 *
 * These tests simulate connecting an existing EKS cluster to CAST AI for optimization.
 * The cluster already exists - we're just onboarding it to CAST AI.
 *
 * Run with: npm test
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";
import { promisify, promisifyAll } from "./test-utils";

/**
 * Mock implementation for CAST AI and AWS resources.
 */
class CastAIMocks implements pulumi.runtime.Mocks {
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs = { ...args.inputs };

        if (args.type === "castai:aws:EksCluster") {
            return {
                id: `${args.name}-cluster-id-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    id: `${args.name}-cluster-id-${this.hash(args.name)}`,
                    clusterToken: `mock-eks-token-${this.hash(args.name)}`,
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

describe("EKS Existing Cluster Connection", () => {
    it("should connect an existing EKS cluster to CAST AI", async () => {
        const cluster = new castai.EksCluster("existing-eks-cluster", {
            accountId: "123456789012",
            region: "us-east-1",
            name: "production-eks-cluster", // Existing cluster name
            deleteNodesOnDisconnect: false, // Don't delete nodes when disconnecting
        });

        const [clusterName, clusterToken, accountId] = await promisifyAll(
            cluster.name,
            cluster.clusterToken,
            cluster.accountId
        );

        expect(clusterName).toBe("production-eks-cluster");
        expect(clusterToken).toBeDefined();
        expect(accountId).toBe("123456789012");
    });

    it("should connect existing EKS cluster using IAM assume role", async () => {
        const assumeRoleArn = "arn:aws:iam::123456789012:role/CastAI-CrossAccountRole";

        const cluster = new castai.EksCluster("existing-eks-assume-role", {
            accountId: "123456789012",
            region: "us-west-2",
            name: "staging-eks-cluster",
            deleteNodesOnDisconnect: false,
            assumeRoleArn: assumeRoleArn,
        });

        const [roleArn, clusterName] = await promisifyAll(
            cluster.assumeRoleArn,
            cluster.name
        );

        expect(roleArn).toBe(assumeRoleArn);
        expect(clusterName).toBe("staging-eks-cluster");
    });

    it("should connect existing EKS cluster with minimal configuration", async () => {
        const cluster = new castai.EksCluster("existing-eks-minimal", {
            accountId: "111111111111",
            region: "ap-southeast-1",
            name: "minimal-eks",
            deleteNodesOnDisconnect: true,
        });

        const [clusterName, accountId] = await promisifyAll(
            cluster.name,
            cluster.accountId
        );

        expect(clusterName).toBe("minimal-eks");
        expect(accountId).toBe("111111111111");
    });

    it("should handle delete_nodes_on_disconnect for production clusters", async () => {
        // Production: keep nodes when disconnecting (safety)
        const prodCluster = new castai.EksCluster("existing-eks-prod", {
            accountId: "333333333333",
            region: "us-east-1",
            name: "prod-critical-cluster",
            deleteNodesOnDisconnect: false, // IMPORTANT: Don't delete in production
        });

        // Dev: can delete nodes when disconnecting
        const devCluster = new castai.EksCluster("existing-eks-dev", {
            accountId: "333333333333",
            region: "us-west-2",
            name: "dev-test-cluster",
            deleteNodesOnDisconnect: true, // Safe for dev environments
        });

        const [prodDelete, devDelete] = await promisifyAll(
            prodCluster.deleteNodesOnDisconnect,
            devCluster.deleteNodesOnDisconnect
        );

        expect(prodDelete).toBe(false);
        expect(devDelete).toBe(true);
    });

    it("should connect multiple existing EKS clusters across regions", async () => {
        const regions = ["us-east-1", "us-west-2", "eu-west-1"];
        const clusters = regions.map(
            (region, i) =>
                new castai.EksCluster(`existing-eks-${region}`, {
                    accountId: "444444444444",
                    region: region,
                    name: `cluster-${region}`,
                    deleteNodesOnDisconnect: false,
                })
        );

        const clusterRegions = await Promise.all(
            clusters.map((c) => promisify(c.region))
        ) as string[];

        clusterRegions.forEach((region, i) => {
            expect(region).toBe(regions[i]);
        });
    });
});
