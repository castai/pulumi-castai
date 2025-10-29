/**
 * Mock Tests for CAST AI EKS Cluster Creation (TypeScript)
 *
 * These tests use Pulumi's built-in mocking to test EKS cluster creation
 * without making actual API calls to CAST AI or AWS.
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
    /**
     * Mock resource creation.
     */
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs = { ...args.inputs };

        // Mock CAST AI EKS Cluster
        if (args.type === "castai:aws:EksCluster") {
            return {
                id: `${args.name}-cluster-id-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    id: `${args.name}-cluster-id-${this.hash(args.name)}`,
                    clusterToken: `mock-eks-token-${this.hash(args.name)}`,  // EKS uses agentToken
                    credentialsId: `mock-credentials-${this.hash(args.name)}`,
                },
            };
        }

        // Mock AWS IAM Role
        if (args.type === "aws:iam/role:Role") {
            const accountId = args.inputs.accountId || "123456789012";
            return {
                id: `${args.name}-role-id`,
                state: {
                    ...outputs,
                    id: `${args.name}-role-id`,
                    arn: `arn:aws:iam::${accountId}:role/${args.name}`,
                    uniqueId: "AIDACKCEVSQ6C2EXAMPLE",
                },
            };
        }

        // Mock AWS Security Group
        if (args.type === "aws:ec2/securityGroup:SecurityGroup") {
            return {
                id: `sg-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    id: `sg-${this.hash(args.name)}`,
                    arn: `arn:aws:ec2:us-west-2:123456789012:security-group/sg-${args.name}`,
                },
            };
        }

        // Mock AWS Subnet
        if (args.type === "aws:ec2/subnet:Subnet") {
            return {
                id: `subnet-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    id: `subnet-${this.hash(args.name)}`,
                    availabilityZone: "us-west-2a",
                },
            };
        }

        // Mock IAM Policy Attachment
        if (args.type === "aws:iam/rolePolicyAttachment:RolePolicyAttachment") {
            return {
                id: `${args.name}-policy-attachment-id`,
                state: outputs,
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
        if (args.token === "aws:getCallerIdentity:getCallerIdentity") {
            return {
                accountId: "123456789012",
                arn: "arn:aws:iam::123456789012:user/test-user",
                userId: "AIDACKCEVSQ6C2EXAMPLE",
            };
        }

        if (args.token === "aws:ec2/getSubnets:getSubnets") {
            return {
                ids: ["subnet-12345678", "subnet-87654321"],
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

describe("EKS Cluster Creation", () => {
    it("should create an EKS cluster with correct configuration", async () => {
        const cluster = new castai.EksCluster("test-eks-cluster", {
            accountId: "123456789012",
            region: "us-west-2",
            name: "my-eks-cluster",
            deleteNodesOnDisconnect: true,
        });

        const [clusterName, clusterToken, accountId, region] = await promisifyAll(
            cluster.name,
            cluster.clusterToken,  // In v7.73.0, EKS uses clusterToken
            cluster.accountId,
            cluster.region
        );

        expect(clusterName).toBe("my-eks-cluster");

        expect(clusterToken).toBeDefined();
        expect(clusterToken).toContain("mock-eks-token");

        expect(accountId).toBe("123456789012");
        expect(region).toBe("us-west-2");
    });

    it("should handle cluster name configuration", async () => {
        const clusterName = "my-custom-cluster";

        const cluster = new castai.EksCluster("test-eks-name", {
            accountId: "123456789012",
            region: "us-east-1",
            name: clusterName,
            deleteNodesOnDisconnect: true,
        });

        const name = await promisify(cluster.name);

        expect(name).toBeDefined();
        expect(name).toBe(clusterName);
    });

    it("should handle assume role ARN configuration", async () => {
        const assumeRoleArn = "arn:aws:iam::123456789012:role/MyCustomRole";

        const cluster = new castai.EksCluster("test-eks-custom-role", {
            accountId: "123456789012",
            region: "us-west-2",
            name: "custom-role-cluster",
            deleteNodesOnDisconnect: false,
            assumeRoleArn: assumeRoleArn,
        });

        const roleArn = await promisify(cluster.assumeRoleArn);

        expect(roleArn).toBeDefined();
        expect(roleArn).toBe(assumeRoleArn);
    });

    it("should handle delete_nodes_on_disconnect setting", async () => {
        const clusterDelete = new castai.EksCluster("test-eks-delete", {
            accountId: "123456789012",
            region: "us-west-2",
            name: "delete-cluster",
            deleteNodesOnDisconnect: true,
        });

        const clusterKeep = new castai.EksCluster("test-eks-keep", {
            accountId: "123456789012",
            region: "us-west-2",
            name: "keep-cluster",
            deleteNodesOnDisconnect: false,
        });

        const [deleteSetting, keepSetting] = await promisifyAll(
            clusterDelete.deleteNodesOnDisconnect,
            clusterKeep.deleteNodesOnDisconnect
        );

        expect(deleteSetting).toBe(true);
        expect(keepSetting).toBe(false);
    });

    it("should support multiple AWS regions", async () => {
        const regions = ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"];

        const clusters = regions.map(
            (region) =>
                new castai.EksCluster(`test-eks-${region}`, {
                    accountId: "123456789012",
                    region: region,
                    name: `cluster-${region}`,
                    deleteNodesOnDisconnect: true,
                })
        );

        const clusterRegions = await Promise.all(clusters.map((c) => promisify(c.region))) as string[];

        clusterRegions.forEach((region, i) => {
            expect(region).toBe(regions[i]);
        });
    });

    it("should handle assume role ARN", async () => {
        const assumeRoleArn = "arn:aws:iam::123456789012:role/CastAIRole";

        const cluster = new castai.EksCluster("test-eks-assume-role", {
            accountId: "123456789012",
            region: "us-west-2",
            name: "assume-role-cluster",
            deleteNodesOnDisconnect: true,
            assumeRoleArn: assumeRoleArn,
        });

        const roleArn = await promisify(cluster.assumeRoleArn);

        expect(roleArn).toBeDefined();
        expect(roleArn).toBe(assumeRoleArn);
        expect(roleArn).toContain("arn:aws:iam::");
    });

    it("should properly handle credentials", async () => {
        const cluster = new castai.EksCluster("test-eks-credentials", {
            accountId: "123456789012",
            region: "us-west-2",
            name: "creds-cluster",
            deleteNodesOnDisconnect: true,
        });

        const credsId = await promisify(cluster.credentialsId);

        expect(credsId).toBeDefined();
        expect(credsId).toContain("mock-credentials");
    });
});

describe("EKS Cluster Validation", () => {
    it("should validate required fields", async () => {
        // This tests that the resource accepts required fields
        expect(() => {
            new castai.EksCluster("test-validation", {
                accountId: "123456789012",
                region: "us-west-2",
                name: "validation-cluster",
                deleteNodesOnDisconnect: true,
            });
        }).not.toThrow();
    });

    it("should handle different account IDs", async () => {
        const accountIds = ["111111111111", "222222222222", "333333333333"];

        const clusters = accountIds.map(
            (accountId, i) =>
                new castai.EksCluster(`test-account-${i}`, {
                    accountId: accountId,
                    region: "us-west-2",
                    name: `cluster-${accountId}`,
                    deleteNodesOnDisconnect: true,
                })
        );

        const clusterAccountIds = await Promise.all(clusters.map((c) => promisify(c.accountId))) as string[];

        clusterAccountIds.forEach((accountId, i) => {
            expect(accountId).toBe(accountIds[i]);
        });
    });
});
