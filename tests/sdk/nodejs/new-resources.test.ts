/**
 * Mock Tests for newly added CAST AI resources and data sources (TypeScript).
 *
 * Verifies that the new resource and data source classes are exported from
 * the SDK and can be constructed. These are smoke tests only - they do not
 * exercise cloud-side behaviour.
 */

import * as pulumi from "@pulumi/pulumi";
import * as castai from "@castai/pulumi";
import { promisify } from "./test-utils";

/**
 * Default mock implementation that accepts every CAST AI token and returns
 * a deterministic id / pass-through state.
 */
class NewResourceMocks implements pulumi.runtime.Mocks {
    newResource(args: pulumi.runtime.MockResourceArgs): { id: string; state: any } {
        const outputs: any = { ...(args.inputs as any) };
        outputs.id = `${args.name}-id`;
        return { id: `${args.name}-id`, state: outputs };
    }

    call(args: pulumi.runtime.MockCallArgs): Record<string, any> {
        return {};
    }
}

pulumi.runtime.setMocks(new NewResourceMocks());

describe("New Resources", () => {
    it("exposes CacheGroup as a constructable resource", async () => {
        expect(castai.CacheGroup).toBeDefined();
        const res = new castai.CacheGroup("test-cache-group", {
            name: "test-cache-group",
            protocolType: "MySQL",
        });
        const id = await promisify(res.id);
        expect(id).toBeDefined();
    });

    it("exposes CacheConfiguration as a constructable resource", async () => {
        expect(castai.CacheConfiguration).toBeDefined();
        const res = new castai.CacheConfiguration("test-cache-config", {
            cacheGroupId: "cg-123",
            databaseName: "appdb",
            mode: "Auto",
        });
        const id = await promisify(res.id);
        expect(id).toBeDefined();
    });

    it("exposes CacheRule as a constructable resource", async () => {
        expect(castai.CacheRule).toBeDefined();
        const res = new castai.CacheRule("test-cache-rule", {
            cacheConfigurationId: "cc-123",
            cacheGroupId: "cg-123",
            mode: "Auto",
        });
        const id = await promisify(res.id);
        expect(id).toBeDefined();
    });

    it("exposes AiOptimizerModelRegistry as a constructable resource", async () => {
        expect(castai.AiOptimizerModelRegistry).toBeDefined();
        const res = new castai.AiOptimizerModelRegistry("test-model-registry", {
            credentials: "mock-credentials",
        });
        const id = await promisify(res.id);
        expect(id).toBeDefined();
    });

    it("exposes AiOptimizerModelSpecs as a constructable resource", async () => {
        expect(castai.AiOptimizerModelSpecs).toBeDefined();
        const res = new castai.AiOptimizerModelSpecs("test-model-specs", {
            model: "my-model",
            registryType: "public",
        });
        const id = await promisify(res.id);
        expect(id).toBeDefined();
    });

    it("exposes AiOptimizerHostedModel as a constructable resource", async () => {
        expect(castai.AiOptimizerHostedModel).toBeDefined();
        const res = new castai.AiOptimizerHostedModel("test-hosted-model", {
            clusterId: "cluster-123",
            modelSpecsId: "ms-123",
            port: 8080,
            service: "svc-123",
        });
        const id = await promisify(res.id);
        expect(id).toBeDefined();
    });

    it("exposes EnterpriseServiceAccount as a constructable resource", async () => {
        expect(castai.EnterpriseServiceAccount).toBeDefined();
        const res = new castai.EnterpriseServiceAccount("test-enterprise-sa", {
            enterpriseId: "ent-123",
        });
        const id = await promisify(res.id);
        expect(id).toBeDefined();
    });

    it("exposes WorkloadCustomMetricsDataSource as a constructable resource", async () => {
        expect(castai.WorkloadCustomMetricsDataSource).toBeDefined();
        const res = new castai.WorkloadCustomMetricsDataSource("test-workload-cmd", {
            clusterId: "cluster-123",
            prometheus: { url: "http://prometheus:9090" },
        });
        const id = await promisify(res.id);
        expect(id).toBeDefined();
    });

    it("exposes PodMutation as a constructable resource", async () => {
        expect(castai.PodMutation).toBeDefined();
        const res = new castai.PodMutation("test-pod-mutation", {
            clusterId: "cluster-123",
            enabled: true,
            filterV2: {},
        });
        const id = await promisify(res.id);
        expect(id).toBeDefined();
    });
});

describe("New Data Sources", () => {
    it("exposes getWorkloadScalingPolicies as a callable function", () => {
        expect(castai.getWorkloadScalingPolicies).toBeDefined();
        expect(typeof castai.getWorkloadScalingPolicies).toBe("function");
    });

    it("exposes getCacheGroup as a callable function", () => {
        expect(castai.getCacheGroup).toBeDefined();
        expect(typeof castai.getCacheGroup).toBe("function");
    });

    it("exposes getImpersonationServiceAccount as a callable function", () => {
        expect(castai.getImpersonationServiceAccount).toBeDefined();
        expect(typeof castai.getImpersonationServiceAccount).toBe("function");
    });
});
