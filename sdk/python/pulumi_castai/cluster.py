# coding=utf-8
# *** WARNING: this file was generated by the Pulumi Terraform Bridge (tfgen) Tool. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

import copy
import warnings
import sys
import pulumi
import pulumi.runtime
from typing import Any, Mapping, Optional, Sequence, Union, overload
if sys.version_info >= (3, 11):
    from typing import NotRequired, TypedDict, TypeAlias
else:
    from typing_extensions import NotRequired, TypedDict, TypeAlias
from . import _utilities
from . import outputs
from ._inputs import *

__all__ = ['ClusterArgs', 'Cluster']

@pulumi.input_type
class ClusterArgs:
    def __init__(__self__, *,
                 credentials: pulumi.Input[Sequence[pulumi.Input[str]]],
                 initialize_params: pulumi.Input['ClusterInitializeParamsArgs'],
                 region: pulumi.Input[str],
                 autoscaler_policies: Optional[pulumi.Input['ClusterAutoscalerPoliciesArgs']] = None,
                 name: Optional[pulumi.Input[str]] = None,
                 status: Optional[pulumi.Input[str]] = None,
                 vpn_type: Optional[pulumi.Input[str]] = None):
        """
        The set of arguments for constructing a Cluster resource.
        """
        pulumi.set(__self__, "credentials", credentials)
        pulumi.set(__self__, "initialize_params", initialize_params)
        pulumi.set(__self__, "region", region)
        if autoscaler_policies is not None:
            pulumi.set(__self__, "autoscaler_policies", autoscaler_policies)
        if name is not None:
            pulumi.set(__self__, "name", name)
        if status is not None:
            pulumi.set(__self__, "status", status)
        if vpn_type is not None:
            pulumi.set(__self__, "vpn_type", vpn_type)

    @property
    @pulumi.getter
    def credentials(self) -> pulumi.Input[Sequence[pulumi.Input[str]]]:
        return pulumi.get(self, "credentials")

    @credentials.setter
    def credentials(self, value: pulumi.Input[Sequence[pulumi.Input[str]]]):
        pulumi.set(self, "credentials", value)

    @property
    @pulumi.getter(name="initializeParams")
    def initialize_params(self) -> pulumi.Input['ClusterInitializeParamsArgs']:
        return pulumi.get(self, "initialize_params")

    @initialize_params.setter
    def initialize_params(self, value: pulumi.Input['ClusterInitializeParamsArgs']):
        pulumi.set(self, "initialize_params", value)

    @property
    @pulumi.getter
    def region(self) -> pulumi.Input[str]:
        return pulumi.get(self, "region")

    @region.setter
    def region(self, value: pulumi.Input[str]):
        pulumi.set(self, "region", value)

    @property
    @pulumi.getter(name="autoscalerPolicies")
    def autoscaler_policies(self) -> Optional[pulumi.Input['ClusterAutoscalerPoliciesArgs']]:
        return pulumi.get(self, "autoscaler_policies")

    @autoscaler_policies.setter
    def autoscaler_policies(self, value: Optional[pulumi.Input['ClusterAutoscalerPoliciesArgs']]):
        pulumi.set(self, "autoscaler_policies", value)

    @property
    @pulumi.getter
    def name(self) -> Optional[pulumi.Input[str]]:
        return pulumi.get(self, "name")

    @name.setter
    def name(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "name", value)

    @property
    @pulumi.getter
    def status(self) -> Optional[pulumi.Input[str]]:
        return pulumi.get(self, "status")

    @status.setter
    def status(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "status", value)

    @property
    @pulumi.getter(name="vpnType")
    def vpn_type(self) -> Optional[pulumi.Input[str]]:
        return pulumi.get(self, "vpn_type")

    @vpn_type.setter
    def vpn_type(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "vpn_type", value)


@pulumi.input_type
class _ClusterState:
    def __init__(__self__, *,
                 autoscaler_policies: Optional[pulumi.Input['ClusterAutoscalerPoliciesArgs']] = None,
                 credentials: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 initialize_params: Optional[pulumi.Input['ClusterInitializeParamsArgs']] = None,
                 kubeconfigs: Optional[pulumi.Input[Sequence[pulumi.Input['ClusterKubeconfigArgs']]]] = None,
                 name: Optional[pulumi.Input[str]] = None,
                 region: Optional[pulumi.Input[str]] = None,
                 status: Optional[pulumi.Input[str]] = None,
                 vpn_type: Optional[pulumi.Input[str]] = None):
        """
        Input properties used for looking up and filtering Cluster resources.
        """
        if autoscaler_policies is not None:
            pulumi.set(__self__, "autoscaler_policies", autoscaler_policies)
        if credentials is not None:
            pulumi.set(__self__, "credentials", credentials)
        if initialize_params is not None:
            pulumi.set(__self__, "initialize_params", initialize_params)
        if kubeconfigs is not None:
            pulumi.set(__self__, "kubeconfigs", kubeconfigs)
        if name is not None:
            pulumi.set(__self__, "name", name)
        if region is not None:
            pulumi.set(__self__, "region", region)
        if status is not None:
            pulumi.set(__self__, "status", status)
        if vpn_type is not None:
            pulumi.set(__self__, "vpn_type", vpn_type)

    @property
    @pulumi.getter(name="autoscalerPolicies")
    def autoscaler_policies(self) -> Optional[pulumi.Input['ClusterAutoscalerPoliciesArgs']]:
        return pulumi.get(self, "autoscaler_policies")

    @autoscaler_policies.setter
    def autoscaler_policies(self, value: Optional[pulumi.Input['ClusterAutoscalerPoliciesArgs']]):
        pulumi.set(self, "autoscaler_policies", value)

    @property
    @pulumi.getter
    def credentials(self) -> Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]:
        return pulumi.get(self, "credentials")

    @credentials.setter
    def credentials(self, value: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]]):
        pulumi.set(self, "credentials", value)

    @property
    @pulumi.getter(name="initializeParams")
    def initialize_params(self) -> Optional[pulumi.Input['ClusterInitializeParamsArgs']]:
        return pulumi.get(self, "initialize_params")

    @initialize_params.setter
    def initialize_params(self, value: Optional[pulumi.Input['ClusterInitializeParamsArgs']]):
        pulumi.set(self, "initialize_params", value)

    @property
    @pulumi.getter
    def kubeconfigs(self) -> Optional[pulumi.Input[Sequence[pulumi.Input['ClusterKubeconfigArgs']]]]:
        return pulumi.get(self, "kubeconfigs")

    @kubeconfigs.setter
    def kubeconfigs(self, value: Optional[pulumi.Input[Sequence[pulumi.Input['ClusterKubeconfigArgs']]]]):
        pulumi.set(self, "kubeconfigs", value)

    @property
    @pulumi.getter
    def name(self) -> Optional[pulumi.Input[str]]:
        return pulumi.get(self, "name")

    @name.setter
    def name(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "name", value)

    @property
    @pulumi.getter
    def region(self) -> Optional[pulumi.Input[str]]:
        return pulumi.get(self, "region")

    @region.setter
    def region(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "region", value)

    @property
    @pulumi.getter
    def status(self) -> Optional[pulumi.Input[str]]:
        return pulumi.get(self, "status")

    @status.setter
    def status(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "status", value)

    @property
    @pulumi.getter(name="vpnType")
    def vpn_type(self) -> Optional[pulumi.Input[str]]:
        return pulumi.get(self, "vpn_type")

    @vpn_type.setter
    def vpn_type(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "vpn_type", value)


class Cluster(pulumi.CustomResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 autoscaler_policies: Optional[pulumi.Input[Union['ClusterAutoscalerPoliciesArgs', 'ClusterAutoscalerPoliciesArgsDict']]] = None,
                 credentials: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 initialize_params: Optional[pulumi.Input[Union['ClusterInitializeParamsArgs', 'ClusterInitializeParamsArgsDict']]] = None,
                 name: Optional[pulumi.Input[str]] = None,
                 region: Optional[pulumi.Input[str]] = None,
                 status: Optional[pulumi.Input[str]] = None,
                 vpn_type: Optional[pulumi.Input[str]] = None,
                 __props__=None):
        """
        Create a Cluster resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: ClusterArgs,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        Create a Cluster resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param ClusterArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(ClusterArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 autoscaler_policies: Optional[pulumi.Input[Union['ClusterAutoscalerPoliciesArgs', 'ClusterAutoscalerPoliciesArgsDict']]] = None,
                 credentials: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 initialize_params: Optional[pulumi.Input[Union['ClusterInitializeParamsArgs', 'ClusterInitializeParamsArgsDict']]] = None,
                 name: Optional[pulumi.Input[str]] = None,
                 region: Optional[pulumi.Input[str]] = None,
                 status: Optional[pulumi.Input[str]] = None,
                 vpn_type: Optional[pulumi.Input[str]] = None,
                 __props__=None):
        opts = pulumi.ResourceOptions.merge(_utilities.get_resource_opts_defaults(), opts)
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.id is None:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = ClusterArgs.__new__(ClusterArgs)

            __props__.__dict__["autoscaler_policies"] = autoscaler_policies
            if credentials is None and not opts.urn:
                raise TypeError("Missing required property 'credentials'")
            __props__.__dict__["credentials"] = credentials
            if initialize_params is None and not opts.urn:
                raise TypeError("Missing required property 'initialize_params'")
            __props__.__dict__["initialize_params"] = initialize_params
            __props__.__dict__["name"] = name
            if region is None and not opts.urn:
                raise TypeError("Missing required property 'region'")
            __props__.__dict__["region"] = region
            __props__.__dict__["status"] = status
            __props__.__dict__["vpn_type"] = vpn_type
            __props__.__dict__["kubeconfigs"] = None
        super(Cluster, __self__).__init__(
            'castai:index:Cluster',
            resource_name,
            __props__,
            opts)

    @staticmethod
    def get(resource_name: str,
            id: pulumi.Input[str],
            opts: Optional[pulumi.ResourceOptions] = None,
            autoscaler_policies: Optional[pulumi.Input[Union['ClusterAutoscalerPoliciesArgs', 'ClusterAutoscalerPoliciesArgsDict']]] = None,
            credentials: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
            initialize_params: Optional[pulumi.Input[Union['ClusterInitializeParamsArgs', 'ClusterInitializeParamsArgsDict']]] = None,
            kubeconfigs: Optional[pulumi.Input[Sequence[pulumi.Input[Union['ClusterKubeconfigArgs', 'ClusterKubeconfigArgsDict']]]]] = None,
            name: Optional[pulumi.Input[str]] = None,
            region: Optional[pulumi.Input[str]] = None,
            status: Optional[pulumi.Input[str]] = None,
            vpn_type: Optional[pulumi.Input[str]] = None) -> 'Cluster':
        """
        Get an existing Cluster resource's state with the given name, id, and optional extra
        properties used to qualify the lookup.

        :param str resource_name: The unique name of the resulting resource.
        :param pulumi.Input[str] id: The unique provider ID of the resource to lookup.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        opts = pulumi.ResourceOptions.merge(opts, pulumi.ResourceOptions(id=id))

        __props__ = _ClusterState.__new__(_ClusterState)

        __props__.__dict__["autoscaler_policies"] = autoscaler_policies
        __props__.__dict__["credentials"] = credentials
        __props__.__dict__["initialize_params"] = initialize_params
        __props__.__dict__["kubeconfigs"] = kubeconfigs
        __props__.__dict__["name"] = name
        __props__.__dict__["region"] = region
        __props__.__dict__["status"] = status
        __props__.__dict__["vpn_type"] = vpn_type
        return Cluster(resource_name, opts=opts, __props__=__props__)

    @property
    @pulumi.getter(name="autoscalerPolicies")
    def autoscaler_policies(self) -> pulumi.Output[Optional['outputs.ClusterAutoscalerPolicies']]:
        return pulumi.get(self, "autoscaler_policies")

    @property
    @pulumi.getter
    def credentials(self) -> pulumi.Output[Sequence[str]]:
        return pulumi.get(self, "credentials")

    @property
    @pulumi.getter(name="initializeParams")
    def initialize_params(self) -> pulumi.Output['outputs.ClusterInitializeParams']:
        return pulumi.get(self, "initialize_params")

    @property
    @pulumi.getter
    def kubeconfigs(self) -> pulumi.Output[Sequence['outputs.ClusterKubeconfig']]:
        return pulumi.get(self, "kubeconfigs")

    @property
    @pulumi.getter
    def name(self) -> pulumi.Output[str]:
        return pulumi.get(self, "name")

    @property
    @pulumi.getter
    def region(self) -> pulumi.Output[str]:
        return pulumi.get(self, "region")

    @property
    @pulumi.getter
    def status(self) -> pulumi.Output[str]:
        return pulumi.get(self, "status")

    @property
    @pulumi.getter(name="vpnType")
    def vpn_type(self) -> pulumi.Output[Optional[str]]:
        return pulumi.get(self, "vpn_type")

