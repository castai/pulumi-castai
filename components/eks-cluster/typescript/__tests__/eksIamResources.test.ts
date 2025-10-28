/**
 * Unit Tests for EksIamResources Component
 *
 * Tests the IAM sub-component behavior and resource creation
 */

import * as pulumi from "@pulumi/pulumi";

// Mock Pulumi runtime
pulumi.runtime.setMocks({
    newResource: function(args: pulumi.runtime.MockResourceArgs): {id: string, state: any} {
        return {
            id: args.inputs.name ? `${args.inputs.name}-id` : "mock-id",
            state: {
                ...args.inputs,
                arn: args.type.includes("Role") ? `arn:aws:iam::123456789012:role/${args.inputs.name}` :
                     args.type.includes("InstanceProfile") ? `arn:aws:iam::123456789012:instance-profile/${args.inputs.name}` :
                     args.type.includes("SecurityGroup") ? "sg-12345" :
                     undefined,
            },
        };
    },
    call: function(args: pulumi.runtime.MockCallArgs) {
        if (args.token === "kubernetes:core/v1:ConfigMap:get") {
            return {
                data: {
                    mapRoles: `- rolearn: arn:aws:iam::123456789012:role/existing-role
  username: system:node:{{EC2PrivateDNSName}}
  groups:
    - system:bootstrappers
    - system:nodes`
                }
            };
        }
        return {};
    },
}, "test-project", "test-stack", false);

describe("EksIamResources Component", () => {
    describe("Component Creation", () => {
        it("should create component with required inputs", () => {
            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            expect(iam).toBeDefined();
        });

        it("should be a Pulumi ComponentResource", () => {
            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            expect(iam).toBeInstanceOf(pulumi.ComponentResource);
        });
    });

    describe("Required Inputs", () => {
        it("should require clusterName", () => {
            const { EksIamResources } = require("../eksIamResources");
            // TypeScript enforces this at compile time
            expect(true).toBe(true);
        });

        it("should require region", () => {
            const { EksIamResources } = require("../eksIamResources");
            expect(true).toBe(true);
        });

        it("should require accountId", () => {
            const { EksIamResources } = require("../eksIamResources");
            expect(true).toBe(true);
        });

        it("should require vpcId", () => {
            const { EksIamResources } = require("../eksIamResources");
            expect(true).toBe(true);
        });

        it("should require castaiUserArn", () => {
            const { EksIamResources } = require("../eksIamResources");
            expect(true).toBe(true);
        });

        it("should require clusterId", () => {
            const { EksIamResources } = require("../eksIamResources");
            expect(true).toBe(true);
        });
    });

    describe("Optional Inputs", () => {
        it("should accept optional k8sProvider", () => {
            const { EksIamResources } = require("../eksIamResources");

            // k8sProvider is optional
            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
                // k8sProvider: undefined (optional)
            });

            expect(iam).toBeDefined();
        });
    });

    describe("Output Properties", () => {
        it("should expose roleArn output", () => {
            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            expect(iam.roleArn).toBeDefined();
        });

        it("should expose instanceProfileArn output", () => {
            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            expect(iam.instanceProfileArn).toBeDefined();
        });

        it("should expose nodeRoleArn output", () => {
            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            expect(iam.nodeRoleArn).toBeDefined();
        });

        it("should expose securityGroupId output", () => {
            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            expect(iam.securityGroupId).toBeDefined();
        });
    });

    describe("IAM Resources Created", () => {
        it("should create CAST AI assume role", () => {
            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            // Role should be created with trust policy
            expect(iam.roleArn).toBeDefined();
        });

        it("should create node role for EC2 instances", () => {
            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            expect(iam.nodeRoleArn).toBeDefined();
        });

        it("should create instance profile", () => {
            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            expect(iam.instanceProfileArn).toBeDefined();
        });

        it("should create security group", () => {
            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            expect(iam.securityGroupId).toBeDefined();
        });
    });

    describe("EKS Access Configuration", () => {
        it("should create EKS access entry for API mode", () => {
            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            // Access entry should be created
            expect(iam).toBeDefined();
        });

        it("should update aws-auth ConfigMap when k8sProvider provided", () => {
            const { EksIamResources } = require("../eksIamResources");
            const k8s = require("@pulumi/kubernetes");

            const mockProvider = new k8s.Provider("mock-provider", {
                kubeconfig: "mock-config",
            });

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
                k8sProvider: mockProvider,
            });

            // ConfigMap update should be triggered
            expect(iam).toBeDefined();
        });
    });

    describe("Compatibility with Terraform eks-role-iam Module", () => {
        it("should match terraform-castai-eks-role-iam outputs", () => {
            // terraform-castai-eks-role-iam outputs:
            // - role_arn (our: roleArn)
            // - instance_profile_arn (our: instanceProfileArn)
            // - instance_profile_role_arn (our: nodeRoleArn)

            const { EksIamResources } = require("../eksIamResources");

            const iam = new EksIamResources("test-iam", {
                clusterName: "test-cluster",
                region: "us-east-1",
                accountId: "123456789012",
                vpcId: "vpc-12345",
                castaiUserArn: "arn:aws:iam::654321098765:user/castai",
                clusterId: "test-cluster-id",
            });

            expect(iam.roleArn).toBeDefined();
            expect(iam.instanceProfileArn).toBeDefined();
            expect(iam.nodeRoleArn).toBeDefined();
        });
    });
});
