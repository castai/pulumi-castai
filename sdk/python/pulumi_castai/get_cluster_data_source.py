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

__all__ = [
    'GetClusterDataSourceResult',
    'AwaitableGetClusterDataSourceResult',
    'get_cluster_data_source',
    'get_cluster_data_source_output',
]

@pulumi.output_type
class GetClusterDataSourceResult:
    """
    A collection of values returned by GetClusterDataSource.
    """
    def __init__(__self__, autoscaler_policies=None, credentials=None, id=None, kubeconfigs=None, name=None, region=None, status=None):
        if autoscaler_policies and not isinstance(autoscaler_policies, list):
            raise TypeError("Expected argument 'autoscaler_policies' to be a list")
        pulumi.set(__self__, "autoscaler_policies", autoscaler_policies)
        if credentials and not isinstance(credentials, list):
            raise TypeError("Expected argument 'credentials' to be a list")
        pulumi.set(__self__, "credentials", credentials)
        if id and not isinstance(id, str):
            raise TypeError("Expected argument 'id' to be a str")
        pulumi.set(__self__, "id", id)
        if kubeconfigs and not isinstance(kubeconfigs, list):
            raise TypeError("Expected argument 'kubeconfigs' to be a list")
        pulumi.set(__self__, "kubeconfigs", kubeconfigs)
        if name and not isinstance(name, str):
            raise TypeError("Expected argument 'name' to be a str")
        pulumi.set(__self__, "name", name)
        if region and not isinstance(region, str):
            raise TypeError("Expected argument 'region' to be a str")
        pulumi.set(__self__, "region", region)
        if status and not isinstance(status, str):
            raise TypeError("Expected argument 'status' to be a str")
        pulumi.set(__self__, "status", status)

    @property
    @pulumi.getter(name="autoscalerPolicies")
    def autoscaler_policies(self) -> Sequence['outputs.GetClusterDataSourceAutoscalerPolicyResult']:
        return pulumi.get(self, "autoscaler_policies")

    @property
    @pulumi.getter
    def credentials(self) -> Sequence[str]:
        return pulumi.get(self, "credentials")

    @property
    @pulumi.getter
    def id(self) -> str:
        """
        The ID of this resource.
        """
        return pulumi.get(self, "id")

    @property
    @pulumi.getter
    def kubeconfigs(self) -> Sequence['outputs.GetClusterDataSourceKubeconfigResult']:
        return pulumi.get(self, "kubeconfigs")

    @property
    @pulumi.getter
    def name(self) -> str:
        return pulumi.get(self, "name")

    @property
    @pulumi.getter
    def region(self) -> str:
        return pulumi.get(self, "region")

    @property
    @pulumi.getter
    def status(self) -> str:
        return pulumi.get(self, "status")


class AwaitableGetClusterDataSourceResult(GetClusterDataSourceResult):
    # pylint: disable=using-constant-test
    def __await__(self):
        if False:
            yield self
        return GetClusterDataSourceResult(
            autoscaler_policies=self.autoscaler_policies,
            credentials=self.credentials,
            id=self.id,
            kubeconfigs=self.kubeconfigs,
            name=self.name,
            region=self.region,
            status=self.status)


def get_cluster_data_source(id: Optional[str] = None,
                            opts: Optional[pulumi.InvokeOptions] = None) -> AwaitableGetClusterDataSourceResult:
    """
    Use this data source to access information about an existing resource.

    :param str id: The ID of this resource.
    """
    __args__ = dict()
    __args__['id'] = id
    opts = pulumi.InvokeOptions.merge(_utilities.get_invoke_opts_defaults(), opts)
    __ret__ = pulumi.runtime.invoke('castai:index:GetClusterDataSource', __args__, opts=opts, typ=GetClusterDataSourceResult).value

    return AwaitableGetClusterDataSourceResult(
        autoscaler_policies=pulumi.get(__ret__, 'autoscaler_policies'),
        credentials=pulumi.get(__ret__, 'credentials'),
        id=pulumi.get(__ret__, 'id'),
        kubeconfigs=pulumi.get(__ret__, 'kubeconfigs'),
        name=pulumi.get(__ret__, 'name'),
        region=pulumi.get(__ret__, 'region'),
        status=pulumi.get(__ret__, 'status'))
def get_cluster_data_source_output(id: Optional[pulumi.Input[str]] = None,
                                   opts: Optional[Union[pulumi.InvokeOptions, pulumi.InvokeOutputOptions]] = None) -> pulumi.Output[GetClusterDataSourceResult]:
    """
    Use this data source to access information about an existing resource.

    :param str id: The ID of this resource.
    """
    __args__ = dict()
    __args__['id'] = id
    opts = pulumi.InvokeOutputOptions.merge(_utilities.get_invoke_opts_defaults(), opts)
    __ret__ = pulumi.runtime.invoke_output('castai:index:GetClusterDataSource', __args__, opts=opts, typ=GetClusterDataSourceResult)
    return __ret__.apply(lambda __response__: GetClusterDataSourceResult(
        autoscaler_policies=pulumi.get(__response__, 'autoscaler_policies'),
        credentials=pulumi.get(__response__, 'credentials'),
        id=pulumi.get(__response__, 'id'),
        kubeconfigs=pulumi.get(__response__, 'kubeconfigs'),
        name=pulumi.get(__response__, 'name'),
        region=pulumi.get(__response__, 'region'),
        status=pulumi.get(__response__, 'status')))
