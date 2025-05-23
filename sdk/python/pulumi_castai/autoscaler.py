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

__all__ = ['AutoscalerArgs', 'Autoscaler']

@pulumi.input_type
class AutoscalerArgs:
    def __init__(__self__, *,
                 autoscaler_policies_json: Optional[pulumi.Input[str]] = None,
                 cluster_id: Optional[pulumi.Input[str]] = None):
        """
        The set of arguments for constructing a Autoscaler resource.
        :param pulumi.Input[str] autoscaler_policies_json: autoscaler policies JSON string to override current autoscaler settings
        :param pulumi.Input[str] cluster_id: CAST AI cluster id
        """
        if autoscaler_policies_json is not None:
            pulumi.set(__self__, "autoscaler_policies_json", autoscaler_policies_json)
        if cluster_id is not None:
            pulumi.set(__self__, "cluster_id", cluster_id)

    @property
    @pulumi.getter(name="autoscalerPoliciesJson")
    def autoscaler_policies_json(self) -> Optional[pulumi.Input[str]]:
        """
        autoscaler policies JSON string to override current autoscaler settings
        """
        return pulumi.get(self, "autoscaler_policies_json")

    @autoscaler_policies_json.setter
    def autoscaler_policies_json(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "autoscaler_policies_json", value)

    @property
    @pulumi.getter(name="clusterId")
    def cluster_id(self) -> Optional[pulumi.Input[str]]:
        """
        CAST AI cluster id
        """
        return pulumi.get(self, "cluster_id")

    @cluster_id.setter
    def cluster_id(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "cluster_id", value)


@pulumi.input_type
class _AutoscalerState:
    def __init__(__self__, *,
                 autoscaler_policies: Optional[pulumi.Input[str]] = None,
                 autoscaler_policies_json: Optional[pulumi.Input[str]] = None,
                 cluster_id: Optional[pulumi.Input[str]] = None):
        """
        Input properties used for looking up and filtering Autoscaler resources.
        :param pulumi.Input[str] autoscaler_policies: computed value to store full policies configuration
        :param pulumi.Input[str] autoscaler_policies_json: autoscaler policies JSON string to override current autoscaler settings
        :param pulumi.Input[str] cluster_id: CAST AI cluster id
        """
        if autoscaler_policies is not None:
            pulumi.set(__self__, "autoscaler_policies", autoscaler_policies)
        if autoscaler_policies_json is not None:
            pulumi.set(__self__, "autoscaler_policies_json", autoscaler_policies_json)
        if cluster_id is not None:
            pulumi.set(__self__, "cluster_id", cluster_id)

    @property
    @pulumi.getter(name="autoscalerPolicies")
    def autoscaler_policies(self) -> Optional[pulumi.Input[str]]:
        """
        computed value to store full policies configuration
        """
        return pulumi.get(self, "autoscaler_policies")

    @autoscaler_policies.setter
    def autoscaler_policies(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "autoscaler_policies", value)

    @property
    @pulumi.getter(name="autoscalerPoliciesJson")
    def autoscaler_policies_json(self) -> Optional[pulumi.Input[str]]:
        """
        autoscaler policies JSON string to override current autoscaler settings
        """
        return pulumi.get(self, "autoscaler_policies_json")

    @autoscaler_policies_json.setter
    def autoscaler_policies_json(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "autoscaler_policies_json", value)

    @property
    @pulumi.getter(name="clusterId")
    def cluster_id(self) -> Optional[pulumi.Input[str]]:
        """
        CAST AI cluster id
        """
        return pulumi.get(self, "cluster_id")

    @cluster_id.setter
    def cluster_id(self, value: Optional[pulumi.Input[str]]):
        pulumi.set(self, "cluster_id", value)


class Autoscaler(pulumi.CustomResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 autoscaler_policies_json: Optional[pulumi.Input[str]] = None,
                 cluster_id: Optional[pulumi.Input[str]] = None,
                 __props__=None):
        """
        CAST AI autoscaler resource to manage autoscaler settings

        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        :param pulumi.Input[str] autoscaler_policies_json: autoscaler policies JSON string to override current autoscaler settings
        :param pulumi.Input[str] cluster_id: CAST AI cluster id
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: Optional[AutoscalerArgs] = None,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        CAST AI autoscaler resource to manage autoscaler settings

        :param str resource_name: The name of the resource.
        :param AutoscalerArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(AutoscalerArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 autoscaler_policies_json: Optional[pulumi.Input[str]] = None,
                 cluster_id: Optional[pulumi.Input[str]] = None,
                 __props__=None):
        opts = pulumi.ResourceOptions.merge(_utilities.get_resource_opts_defaults(), opts)
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.id is None:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = AutoscalerArgs.__new__(AutoscalerArgs)

            __props__.__dict__["autoscaler_policies_json"] = autoscaler_policies_json
            __props__.__dict__["cluster_id"] = cluster_id
            __props__.__dict__["autoscaler_policies"] = None
        super(Autoscaler, __self__).__init__(
            'castai:autoscaling:Autoscaler',
            resource_name,
            __props__,
            opts)

    @staticmethod
    def get(resource_name: str,
            id: pulumi.Input[str],
            opts: Optional[pulumi.ResourceOptions] = None,
            autoscaler_policies: Optional[pulumi.Input[str]] = None,
            autoscaler_policies_json: Optional[pulumi.Input[str]] = None,
            cluster_id: Optional[pulumi.Input[str]] = None) -> 'Autoscaler':
        """
        Get an existing Autoscaler resource's state with the given name, id, and optional extra
        properties used to qualify the lookup.

        :param str resource_name: The unique name of the resulting resource.
        :param pulumi.Input[str] id: The unique provider ID of the resource to lookup.
        :param pulumi.ResourceOptions opts: Options for the resource.
        :param pulumi.Input[str] autoscaler_policies: computed value to store full policies configuration
        :param pulumi.Input[str] autoscaler_policies_json: autoscaler policies JSON string to override current autoscaler settings
        :param pulumi.Input[str] cluster_id: CAST AI cluster id
        """
        opts = pulumi.ResourceOptions.merge(opts, pulumi.ResourceOptions(id=id))

        __props__ = _AutoscalerState.__new__(_AutoscalerState)

        __props__.__dict__["autoscaler_policies"] = autoscaler_policies
        __props__.__dict__["autoscaler_policies_json"] = autoscaler_policies_json
        __props__.__dict__["cluster_id"] = cluster_id
        return Autoscaler(resource_name, opts=opts, __props__=__props__)

    @property
    @pulumi.getter(name="autoscalerPolicies")
    def autoscaler_policies(self) -> pulumi.Output[str]:
        """
        computed value to store full policies configuration
        """
        return pulumi.get(self, "autoscaler_policies")

    @property
    @pulumi.getter(name="autoscalerPoliciesJson")
    def autoscaler_policies_json(self) -> pulumi.Output[Optional[str]]:
        """
        autoscaler policies JSON string to override current autoscaler settings
        """
        return pulumi.get(self, "autoscaler_policies_json")

    @property
    @pulumi.getter(name="clusterId")
    def cluster_id(self) -> pulumi.Output[Optional[str]]:
        """
        CAST AI cluster id
        """
        return pulumi.get(self, "cluster_id")

