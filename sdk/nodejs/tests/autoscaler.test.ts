/**
 * Mock Tests for CAST AI Autoscaler Resource (TypeScript)
 *
 * These tests use Pulumi's built-in mocking to test autoscaler configuration
 * without making actual API calls to CAST AI.
 *
 * Test scenarios are based on the Terraform provider examples at:
 * terraform-provider-castai/examples/eks/eks_cluster_existing/castai.tf
 *
 * Run with: npm test
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";
import { promisify, promisifyAll } from "./test-utils";

/**
 * Mock implementation for CAST AI Autoscaler resources.
 */
class CastAIMocks implements pulumi.runtime.Mocks {
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs = { ...args.inputs };

        if (args.type === "castai:autoscaling:Autoscaler") {
            return {
                id: `${args.name}-autoscaler-id-${this.hash(args.name)}`,
                state: {
                    ...outputs,
                    id: `${args.name}-autoscaler-id-${this.hash(args.name)}`,
                    autoscalerPolicies: outputs.autoscalerPoliciesJson || "{}",
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

describe("Autoscaler Configuration Tests", () => {
    it("should create autoscaler with basic disabled configuration", async () => {
        // Based on Terraform example: disabled autoscaler
        const autoscalerPolicies = {
            enabled: false,
            isScopedMode: false,
            nodeTemplatesPartialMatchingEnabled: false,
            unschedulablePods: {
                enabled: false,
            },
            nodeDownscaler: {
                enabled: false,
                emptyNodes: {
                    enabled: false,
                },
                evictor: {
                    enabled: false,
                    aggressiveMode: false,
                    cycleInterval: "60s",
                    nodeGracePeriodMinutes: 10,
                    scopedMode: false,
                },
            },
            clusterLimits: {
                enabled: false,
                cpu: {
                    maxCores: 20,
                    minCores: 1,
                },
                spotBackups: {
                    enabled: false,
                    spotBackupRestoreRateSeconds: 1800,
                },
            },
        };

        const autoscaler = new castai.Autoscaler("test-autoscaler", {
            clusterId: "test-cluster-id-123",
            autoscalerPoliciesJson: JSON.stringify(autoscalerPolicies),
        });

        const [clusterId, policiesJson] = await promisifyAll(
            autoscaler.clusterId,
            autoscaler.autoscalerPoliciesJson
        );

        expect(clusterId).toBe("test-cluster-id-123");
        expect(policiesJson).toBeDefined();

        const policies = JSON.parse(policiesJson!);
        expect(policies.enabled).toBe(false);
        expect(policies.clusterLimits.cpu.maxCores).toBe(20);
    });

    it("should create autoscaler with enabled features", async () => {
        const autoscalerPolicies = {
            enabled: true,
            isScopedMode: false,
            nodeTemplatesPartialMatchingEnabled: false,
            unschedulablePods: {
                enabled: true,
            },
            nodeDownscaler: {
                enabled: true,
                emptyNodes: {
                    enabled: true,
                },
                evictor: {
                    enabled: true,
                    aggressiveMode: false,
                    cycleInterval: "5m10s",
                    nodeGracePeriodMinutes: 10,
                    scopedMode: false,
                },
            },
            clusterLimits: {
                enabled: true,
                cpu: {
                    maxCores: 100,
                    minCores: 2,
                },
                spotBackups: {
                    enabled: true,
                    spotBackupRestoreRateSeconds: 1800,
                },
            },
        };

        const autoscaler = new castai.Autoscaler("test-autoscaler-enabled", {
            clusterId: "enabled-cluster-123",
            autoscalerPoliciesJson: JSON.stringify(autoscalerPolicies),
        });

        const [clusterId, policiesJson] = await promisifyAll(
            autoscaler.clusterId,
            autoscaler.autoscalerPoliciesJson
        );

        expect(clusterId).toBe("enabled-cluster-123");

        const policies = JSON.parse(policiesJson!);
        expect(policies.enabled).toBe(true);
        expect(policies.unschedulablePods.enabled).toBe(true);
        expect(policies.nodeDownscaler.enabled).toBe(true);
        expect(policies.nodeDownscaler.evictor.enabled).toBe(true);
        expect(policies.clusterLimits.enabled).toBe(true);
        expect(policies.clusterLimits.cpu.maxCores).toBe(100);
    });

    it("should create autoscaler with aggressive evictor mode", async () => {
        const autoscalerPolicies = {
            enabled: true,
            nodeDownscaler: {
                enabled: true,
                evictor: {
                    enabled: true,
                    aggressiveMode: true, // Aggressive mode enabled
                    cycleInterval: "30s", // Faster cycle
                    nodeGracePeriodMinutes: 5, // Shorter grace period
                    scopedMode: false,
                },
            },
        };

        const autoscaler = new castai.Autoscaler("test-aggressive-evictor", {
            clusterId: "aggressive-cluster-456",
            autoscalerPoliciesJson: JSON.stringify(autoscalerPolicies),
        });

        const [clusterId, policiesJson] = await promisifyAll(
            autoscaler.clusterId,
            autoscaler.autoscalerPoliciesJson
        );

        const policies = JSON.parse(policiesJson!);
        const evictor = policies.nodeDownscaler.evictor;
        expect(evictor.enabled).toBe(true);
        expect(evictor.aggressiveMode).toBe(true);
        expect(evictor.cycleInterval).toBe("30s");
        expect(evictor.nodeGracePeriodMinutes).toBe(5);
    });

    it("should create autoscaler with various cluster limits", async () => {
        const autoscalerPolicies = {
            enabled: true,
            clusterLimits: {
                enabled: true,
                cpu: {
                    maxCores: 50,
                    minCores: 5,
                },
                spotBackups: {
                    enabled: true,
                    spotBackupRestoreRateSeconds: 3600, // 1 hour
                },
            },
        };

        const autoscaler = new castai.Autoscaler("test-cluster-limits", {
            clusterId: "limited-cluster-789",
            autoscalerPoliciesJson: JSON.stringify(autoscalerPolicies),
        });

        const [clusterId, policiesJson] = await promisifyAll(
            autoscaler.clusterId,
            autoscaler.autoscalerPoliciesJson
        );

        const policies = JSON.parse(policiesJson!);
        const limits = policies.clusterLimits;
        expect(limits.enabled).toBe(true);
        expect(limits.cpu.maxCores).toBe(50);
        expect(limits.cpu.minCores).toBe(5);
        expect(limits.spotBackups.spotBackupRestoreRateSeconds).toBe(3600);
    });

    it("should create autoscaler with scoped mode enabled", async () => {
        const autoscalerPolicies = {
            enabled: true,
            isScopedMode: true, // Scoped mode - only manages specific namespaces
            nodeTemplatesPartialMatchingEnabled: true,
            unschedulablePods: {
                enabled: true,
            },
            nodeDownscaler: {
                enabled: true,
                evictor: {
                    enabled: true,
                    scopedMode: true, // Evictor also in scoped mode
                },
            },
        };

        const autoscaler = new castai.Autoscaler("test-scoped-mode", {
            clusterId: "scoped-cluster-321",
            autoscalerPoliciesJson: JSON.stringify(autoscalerPolicies),
        });

        const [clusterId, policiesJson] = await promisifyAll(
            autoscaler.clusterId,
            autoscaler.autoscalerPoliciesJson
        );

        const policies = JSON.parse(policiesJson!);
        expect(policies.isScopedMode).toBe(true);
        expect(policies.nodeTemplatesPartialMatchingEnabled).toBe(true);
        expect(policies.nodeDownscaler.evictor.scopedMode).toBe(true);
    });

    it("should create autoscaler with minimal configuration", async () => {
        // Minimal configuration - just enable basic autoscaling
        const autoscalerPolicies = {
            enabled: true,
        };

        const autoscaler = new castai.Autoscaler("test-minimal", {
            clusterId: "minimal-cluster-999",
            autoscalerPoliciesJson: JSON.stringify(autoscalerPolicies),
        });

        const [clusterId, policiesJson] = await promisifyAll(
            autoscaler.clusterId,
            autoscaler.autoscalerPoliciesJson
        );

        expect(clusterId).toBe("minimal-cluster-999");

        const policies = JSON.parse(policiesJson!);
        expect(policies.enabled).toBe(true);
    });

    it("should create autoscaler with production-ready settings", async () => {
        // Production settings: enabled but conservative
        const autoscalerPolicies = {
            enabled: true,
            isScopedMode: false,
            nodeTemplatesPartialMatchingEnabled: false,
            unschedulablePods: {
                enabled: true,
            },
            nodeDownscaler: {
                enabled: true,
                emptyNodes: {
                    enabled: true,
                },
                evictor: {
                    enabled: true,
                    aggressiveMode: false, // Conservative for production
                    cycleInterval: "10m", // Longer cycle for stability
                    nodeGracePeriodMinutes: 15, // Longer grace period
                    scopedMode: false,
                },
            },
            clusterLimits: {
                enabled: true,
                cpu: {
                    maxCores: 200, // Higher limit for production
                    minCores: 10, // Ensure baseline capacity
                },
                spotBackups: {
                    enabled: true,
                    spotBackupRestoreRateSeconds: 1800,
                },
            },
        };

        const autoscaler = new castai.Autoscaler("prod-autoscaler", {
            clusterId: "prod-cluster-001",
            autoscalerPoliciesJson: JSON.stringify(autoscalerPolicies),
        });

        const [clusterId, policiesJson] = await promisifyAll(
            autoscaler.clusterId,
            autoscaler.autoscalerPoliciesJson
        );

        expect(clusterId).toBe("prod-cluster-001");

        const policies = JSON.parse(policiesJson!);
        expect(policies.enabled).toBe(true);
        expect(policies.nodeDownscaler.evictor.aggressiveMode).toBe(false);
        expect(policies.nodeDownscaler.evictor.nodeGracePeriodMinutes).toBe(15);
        expect(policies.clusterLimits.cpu.minCores).toBe(10);
    });
});
