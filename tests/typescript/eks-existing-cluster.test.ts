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
                    agentToken: `mock-eks-token-${this.hash(args.name)}`,
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
            overrideSecurityGroups: ["sg-existing123"],
            subnets: ["subnet-existing-a", "subnet-existing-b"],
        });

        const [clusterId, clusterName, agentToken, accountId] = await promisifyAll(
            cluster.id,
            cluster.name,
            cluster.agentToken,
            cluster.accountId
        );

        expect(clusterId).toBeDefined();
        expect(clusterName).toBe("production-eks-cluster");
        expect(agentToken).toBeDefined();
        expect(accountId).toBe("123456789012");
    });

    it("should connect existing EKS cluster using IAM assume role", async () => {
        const assumeRoleArn = "arn:aws:iam::123456789012:role/CastAI-CrossAccountRole";

        const cluster = new castai.EksCluster("existing-eks-assume-role", {
            accountId: "123456789012",
            region: "us-west-2",
            name: "staging-eks-cluster",
            deleteNodesOnDisconnect: false,
            overrideSecurityGroups: ["sg-existing456"],
            subnets: ["subnet-existing-1", "subnet-existing-2"],
            assumeRoleArn: assumeRoleArn,
        });

        const [roleArn, clusterName] = await promisifyAll(
            cluster.assumeRoleArn,
            cluster.name
        );

        expect(roleArn).toBe(assumeRoleArn);
        expect(clusterName).toBe("staging-eks-cluster");
    });

    it("should connect existing EKS cluster with SSH public key", async () => {
        const sshPublicKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ... existing-key";

        const cluster = new castai.EksCluster("existing-eks-ssh", {
            accountId: "123456789012",
            region: "eu-west-1",
            name: "dev-eks-cluster",
            deleteNodesOnDisconnect: true,
            overrideSecurityGroups: ["sg-dev-123"],
            subnets: ["subnet-dev-a", "subnet-dev-b", "subnet-dev-c"],
            sshPublicKey: sshPublicKey,
        });

        const [sshKey, clusterName] = await promisifyAll(
            cluster.sshPublicKey,
            cluster.name
        );

        expect(sshKey).toBe(sshPublicKey);
        expect(clusterName).toBe("dev-eks-cluster");
    });

    it("should connect existing EKS cluster with resource tags", async () => {
        const clusterTags = {
            Environment: "production",
            ManagedBy: "castai",
            Team: "platform",
            CostCenter: "engineering",
        };

        const cluster = new castai.EksCluster("existing-eks-tags", {
            accountId: "987654321098",
            region: "us-east-2",
            name: "prod-eks-main",
            deleteNodesOnDisconnect: false,
            overrideSecurityGroups: ["sg-prod-main"],
            subnets: ["subnet-prod-1a", "subnet-prod-1b"],
            tags: clusterTags,
        });

        const [tags, clusterName] = await promisifyAll(cluster.tags, cluster.name);

        expect(tags).toBeDefined();
        if (tags) {
            expect(Object.keys(tags).length).toBe(4);
            expect(tags.Environment).toBe("production");
            expect(tags.Team).toBe("platform");
        }
        expect(clusterName).toBe("prod-eks-main");
    });

    it("should connect existing EKS cluster with minimal configuration", async () => {
        const cluster = new castai.EksCluster("existing-eks-minimal", {
            accountId: "111111111111",
            region: "ap-southeast-1",
            name: "minimal-eks",
            deleteNodesOnDisconnect: true,
            overrideSecurityGroups: ["sg-minimal"],
            subnets: ["subnet-min-a"],
        });

        const [clusterId, clusterName, accountId] = await promisifyAll(
            cluster.id,
            cluster.name,
            cluster.accountId
        );

        expect(clusterId).toBeDefined();
        expect(clusterName).toBe("minimal-eks");
        expect(accountId).toBe("111111111111");
    });

    it("should connect existing EKS cluster with custom DNS configuration", async () => {
        const customDnsIp = "172.20.0.10";

        const cluster = new castai.EksCluster("existing-eks-dns", {
            accountId: "222222222222",
            region: "us-west-2",
            name: "custom-dns-cluster",
            deleteNodesOnDisconnect: false,
            overrideSecurityGroups: ["sg-dns-123"],
            subnets: ["subnet-dns-1", "subnet-dns-2"],
            dnsClusterIp: customDnsIp,
        });

        const [dnsIp, clusterName] = await promisifyAll(
            cluster.dnsClusterIp,
            cluster.name
        );

        expect(dnsIp).toBe(customDnsIp);
        expect(clusterName).toBe("custom-dns-cluster");
    });

    it("should handle delete_nodes_on_disconnect for production clusters", async () => {
        // Production: keep nodes when disconnecting (safety)
        const prodCluster = new castai.EksCluster("existing-eks-prod", {
            accountId: "333333333333",
            region: "us-east-1",
            name: "prod-critical-cluster",
            deleteNodesOnDisconnect: false, // IMPORTANT: Don't delete in production
            overrideSecurityGroups: ["sg-prod"],
            subnets: ["subnet-prod-a", "subnet-prod-b"],
        });

        // Dev: can delete nodes when disconnecting
        const devCluster = new castai.EksCluster("existing-eks-dev", {
            accountId: "333333333333",
            region: "us-west-2",
            name: "dev-test-cluster",
            deleteNodesOnDisconnect: true, // Safe for dev environments
            overrideSecurityGroups: ["sg-dev"],
            subnets: ["subnet-dev-a"],
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
                    overrideSecurityGroups: ["sg-multi"],
                    subnets: ["subnet-multi"],
                })
        );

        const clusterRegions = await Promise.all(
            clusters.map((c) => promisify(c.region))
        );

        clusterRegions.forEach((region: string, i: number) => {
            expect(region).toBe(regions[i]);
        });
    });
});
