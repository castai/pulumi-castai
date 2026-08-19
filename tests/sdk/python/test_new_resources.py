"""
Mock Tests for newly added CAST AI resources and data sources (Python).

Verifies that the new resource and data source classes are importable from
the SDK package and can be constructed. These are smoke tests only.
"""

import pulumi


@pulumi.runtime.test
def test_cache_group_is_constructable():
    import pulumi_castai as castai

    assert castai.CacheGroup is not None
    res = castai.CacheGroup(
        "test-cache-group",
        name="test-cache-group",
        protocol_type="MySQL",
    )

    def check(args):
        name, rid = args
        assert name == "test-cache-group"
        assert rid is not None

    return pulumi.Output.all(res.name, res.id).apply(check)


@pulumi.runtime.test
def test_cache_configuration_is_constructable():
    import pulumi_castai as castai

    assert castai.CacheConfiguration is not None
    res = castai.CacheConfiguration(
        "test-cache-config",
        cache_group_id="cg-123",
        database_name="appdb",
        mode="Auto",
    )

    def check(rid):
        assert rid is not None

    return res.id.apply(check)


@pulumi.runtime.test
def test_cache_rule_is_constructable():
    import pulumi_castai as castai

    assert castai.CacheRule is not None
    res = castai.CacheRule(
        "test-cache-rule",
        cache_configuration_id="cc-123",
        cache_group_id="cg-123",
        mode="Auto",
    )

    def check(rid):
        assert rid is not None

    return res.id.apply(check)


@pulumi.runtime.test
def test_ai_optimizer_model_registry_is_constructable():
    import pulumi_castai as castai

    assert castai.AiOptimizerModelRegistry is not None
    res = castai.AiOptimizerModelRegistry(
        "test-model-registry",
        credentials="mock-credentials",
    )

    def check(rid):
        assert rid is not None

    return res.id.apply(check)


@pulumi.runtime.test
def test_ai_optimizer_model_specs_is_constructable():
    import pulumi_castai as castai

    assert castai.AiOptimizerModelSpecs is not None
    res = castai.AiOptimizerModelSpecs(
        "test-model-specs",
        model="my-model",
        registry_type="public",
    )

    def check(rid):
        assert rid is not None

    return res.id.apply(check)


@pulumi.runtime.test
def test_ai_optimizer_hosted_model_is_constructable():
    import pulumi_castai as castai

    assert castai.AiOptimizerHostedModel is not None
    res = castai.AiOptimizerHostedModel(
        "test-hosted-model",
        cluster_id="cluster-123",
        model_specs_id="ms-123",
        port=8080,
        service="svc-123",
    )

    def check(rid):
        assert rid is not None

    return res.id.apply(check)


@pulumi.runtime.test
def test_enterprise_service_account_is_constructable():
    import pulumi_castai as castai

    assert castai.EnterpriseServiceAccount is not None
    res = castai.EnterpriseServiceAccount(
        "test-enterprise-sa",
        enterprise_id="ent-123",
    )

    def check(rid):
        assert rid is not None

    return res.id.apply(check)


@pulumi.runtime.test
def test_workload_custom_metrics_data_source_is_constructable():
    import pulumi_castai as castai
    from pulumi_castai import workload as _workload

    assert castai.WorkloadCustomMetricsDataSource is not None
    res = castai.WorkloadCustomMetricsDataSource(
        "test-workload-cmd",
        cluster_id="cluster-123",
        prometheus=_workload.WorkloadCustomMetricsDataSourcePrometheusArgs(
            url="http://prometheus:9090",
        ),
    )

    def check(rid):
        assert rid is not None

    return res.id.apply(check)


@pulumi.runtime.test
def test_pod_mutation_is_constructable():
    import pulumi_castai as castai

    assert castai.PodMutation is not None
    res = castai.PodMutation(
        "test-pod-mutation",
        cluster_id="cluster-123",
        enabled=True,
        filter_v2=castai.PodMutationFilterV2Args(),
    )

    def check(rid):
        assert rid is not None

    return res.id.apply(check)


def test_data_source_functions_are_exported():
    import pulumi_castai as castai

    assert callable(castai.get_workload_scaling_policies)
    assert callable(castai.get_workload_scaling_policies_output)
    assert callable(castai.get_cache_group)
    assert callable(castai.get_cache_group_output)
    assert callable(castai.get_impersonation_service_account)
    assert callable(castai.get_impersonation_service_account_output)
