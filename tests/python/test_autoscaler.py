"""
Mock Tests for CAST AI Autoscaler Resource (Python)

These tests use Pulumi's built-in mocking to test autoscaler configuration
without making actual API calls to CAST AI.

Test scenarios are based on the Terraform provider examples at:
terraform-provider-castai/examples/eks/eks_cluster_existing/castai.tf

Run with: pytest test_autoscaler.py -v
"""

import json
import pulumi


@pulumi.runtime.test
def test_autoscaler_basic_configuration():
    """Test creating an autoscaler with basic configuration"""
    import pulumi_castai as castai

    # Based on Terraform example: disabled autoscaler
    autoscaler_policies = {
        "enabled": False,
        "isScopedMode": False,
        "nodeTemplatesPartialMatchingEnabled": False,
        "unschedulablePods": {
            "enabled": False
        },
        "nodeDownscaler": {
            "enabled": False,
            "emptyNodes": {
                "enabled": False
            },
            "evictor": {
                "enabled": False,
                "aggressiveMode": False,
                "cycleInterval": "60s",
                "nodeGracePeriodMinutes": 10,
                "scopedMode": False
            }
        },
        "clusterLimits": {
            "enabled": False,
            "cpu": {
                "maxCores": 20,
                "minCores": 1
            },
            "spotBackups": {
                "enabled": False,
                "spotBackupRestoreRateSeconds": 1800
            }
        }
    }

    autoscaler = castai.Autoscaler(
        "test-autoscaler",
        cluster_id="test-cluster-id-123",
        autoscaler_policies_json=json.dumps(autoscaler_policies),
    )

    def check_outputs(outputs):
        cluster_id, policies_json = outputs
        assert cluster_id == "test-cluster-id-123"
        assert policies_json is not None

        # Verify the JSON can be parsed
        policies = json.loads(policies_json)
        assert policies["enabled"] == False
        assert policies["clusterLimits"]["cpu"]["maxCores"] == 20

    return pulumi.Output.all(
        autoscaler.cluster_id,
        autoscaler.autoscaler_policies_json,
    ).apply(check_outputs)


@pulumi.runtime.test
def test_autoscaler_enabled_configuration():
    """Test autoscaler with enabled features"""
    import pulumi_castai as castai

    # Enabled autoscaler with active features
    autoscaler_policies = {
        "enabled": True,
        "isScopedMode": False,
        "nodeTemplatesPartialMatchingEnabled": False,
        "unschedulablePods": {
            "enabled": True
        },
        "nodeDownscaler": {
            "enabled": True,
            "emptyNodes": {
                "enabled": True
            },
            "evictor": {
                "enabled": True,
                "aggressiveMode": False,
                "cycleInterval": "5m10s",
                "nodeGracePeriodMinutes": 10,
                "scopedMode": False
            }
        },
        "clusterLimits": {
            "enabled": True,
            "cpu": {
                "maxCores": 100,
                "minCores": 2
            },
            "spotBackups": {
                "enabled": True,
                "spotBackupRestoreRateSeconds": 1800
            }
        }
    }

    autoscaler = castai.Autoscaler(
        "test-autoscaler-enabled",
        cluster_id="enabled-cluster-123",
        autoscaler_policies_json=json.dumps(autoscaler_policies),
    )

    def check_outputs(outputs):
        cluster_id, policies_json = outputs
        assert cluster_id == "enabled-cluster-123"

        policies = json.loads(policies_json)
        assert policies["enabled"] == True
        assert policies["unschedulablePods"]["enabled"] == True
        assert policies["nodeDownscaler"]["enabled"] == True
        assert policies["nodeDownscaler"]["evictor"]["enabled"] == True
        assert policies["clusterLimits"]["enabled"] == True
        assert policies["clusterLimits"]["cpu"]["maxCores"] == 100

    return pulumi.Output.all(
        autoscaler.cluster_id,
        autoscaler.autoscaler_policies_json,
    ).apply(check_outputs)


@pulumi.runtime.test
def test_autoscaler_aggressive_evictor():
    """Test autoscaler with aggressive evictor mode"""
    import pulumi_castai as castai

    autoscaler_policies = {
        "enabled": True,
        "nodeDownscaler": {
            "enabled": True,
            "evictor": {
                "enabled": True,
                "aggressiveMode": True,  # Aggressive mode enabled
                "cycleInterval": "30s",  # Faster cycle
                "nodeGracePeriodMinutes": 5,  # Shorter grace period
                "scopedMode": False
            }
        }
    }

    autoscaler = castai.Autoscaler(
        "test-aggressive-evictor",
        cluster_id="aggressive-cluster-456",
        autoscaler_policies_json=json.dumps(autoscaler_policies),
    )

    def check_outputs(outputs):
        cluster_id, policies_json = outputs

        policies = json.loads(policies_json)
        evictor = policies["nodeDownscaler"]["evictor"]
        assert evictor["enabled"] == True
        assert evictor["aggressiveMode"] == True
        assert evictor["cycleInterval"] == "30s"
        assert evictor["nodeGracePeriodMinutes"] == 5

    return pulumi.Output.all(
        autoscaler.cluster_id,
        autoscaler.autoscaler_policies_json,
    ).apply(check_outputs)


@pulumi.runtime.test
def test_autoscaler_cluster_limits():
    """Test autoscaler with various cluster limits"""
    import pulumi_castai as castai

    # Test different cluster limit configurations
    autoscaler_policies = {
        "enabled": True,
        "clusterLimits": {
            "enabled": True,
            "cpu": {
                "maxCores": 50,
                "minCores": 5
            },
            "spotBackups": {
                "enabled": True,
                "spotBackupRestoreRateSeconds": 3600  # 1 hour
            }
        }
    }

    autoscaler = castai.Autoscaler(
        "test-cluster-limits",
        cluster_id="limited-cluster-789",
        autoscaler_policies_json=json.dumps(autoscaler_policies),
    )

    def check_outputs(outputs):
        cluster_id, policies_json = outputs

        policies = json.loads(policies_json)
        limits = policies["clusterLimits"]
        assert limits["enabled"] == True
        assert limits["cpu"]["maxCores"] == 50
        assert limits["cpu"]["minCores"] == 5
        assert limits["spotBackups"]["spotBackupRestoreRateSeconds"] == 3600

    return pulumi.Output.all(
        autoscaler.cluster_id,
        autoscaler.autoscaler_policies_json,
    ).apply(check_outputs)


@pulumi.runtime.test
def test_autoscaler_scoped_mode():
    """Test autoscaler with scoped mode enabled"""
    import pulumi_castai as castai

    autoscaler_policies = {
        "enabled": True,
        "isScopedMode": True,  # Scoped mode - only manages specific namespaces
        "nodeTemplatesPartialMatchingEnabled": True,
        "unschedulablePods": {
            "enabled": True
        },
        "nodeDownscaler": {
            "enabled": True,
            "evictor": {
                "enabled": True,
                "scopedMode": True  # Evictor also in scoped mode
            }
        }
    }

    autoscaler = castai.Autoscaler(
        "test-scoped-mode",
        cluster_id="scoped-cluster-321",
        autoscaler_policies_json=json.dumps(autoscaler_policies),
    )

    def check_outputs(outputs):
        cluster_id, policies_json = outputs

        policies = json.loads(policies_json)
        assert policies["isScopedMode"] == True
        assert policies["nodeTemplatesPartialMatchingEnabled"] == True
        assert policies["nodeDownscaler"]["evictor"]["scopedMode"] == True

    return pulumi.Output.all(
        autoscaler.cluster_id,
        autoscaler.autoscaler_policies_json,
    ).apply(check_outputs)


@pulumi.runtime.test
def test_autoscaler_minimal_configuration():
    """Test autoscaler with minimal required configuration"""
    import pulumi_castai as castai

    # Minimal configuration - just enable basic autoscaling
    autoscaler_policies = {
        "enabled": True
    }

    autoscaler = castai.Autoscaler(
        "test-minimal",
        cluster_id="minimal-cluster-999",
        autoscaler_policies_json=json.dumps(autoscaler_policies),
    )

    def check_outputs(outputs):
        cluster_id, policies_json = outputs
        assert cluster_id == "minimal-cluster-999"

        policies = json.loads(policies_json)
        assert policies["enabled"] == True

    return pulumi.Output.all(
        autoscaler.cluster_id,
        autoscaler.autoscaler_policies_json,
    ).apply(check_outputs)


@pulumi.runtime.test
def test_autoscaler_production_settings():
    """Test autoscaler with production-ready settings"""
    import pulumi_castai as castai

    # Production settings: enabled but conservative
    autoscaler_policies = {
        "enabled": True,
        "isScopedMode": False,
        "nodeTemplatesPartialMatchingEnabled": False,
        "unschedulablePods": {
            "enabled": True
        },
        "nodeDownscaler": {
            "enabled": True,
            "emptyNodes": {
                "enabled": True
            },
            "evictor": {
                "enabled": True,
                "aggressiveMode": False,  # Conservative for production
                "cycleInterval": "10m",  # Longer cycle for stability
                "nodeGracePeriodMinutes": 15,  # Longer grace period
                "scopedMode": False
            }
        },
        "clusterLimits": {
            "enabled": True,
            "cpu": {
                "maxCores": 200,  # Higher limit for production
                "minCores": 10  # Ensure baseline capacity
            },
            "spotBackups": {
                "enabled": True,
                "spotBackupRestoreRateSeconds": 1800
            }
        }
    }

    autoscaler = castai.Autoscaler(
        "prod-autoscaler",
        cluster_id="prod-cluster-001",
        autoscaler_policies_json=json.dumps(autoscaler_policies),
    )

    def check_outputs(outputs):
        cluster_id, policies_json = outputs
        assert cluster_id == "prod-cluster-001"

        policies = json.loads(policies_json)
        assert policies["enabled"] == True
        assert policies["nodeDownscaler"]["evictor"]["aggressiveMode"] == False
        assert policies["nodeDownscaler"]["evictor"]["nodeGracePeriodMinutes"] == 15
        assert policies["clusterLimits"]["cpu"]["minCores"] == 10

    return pulumi.Output.all(
        autoscaler.cluster_id,
        autoscaler.autoscaler_policies_json,
    ).apply(check_outputs)
