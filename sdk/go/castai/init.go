// Code generated by the Pulumi Terraform Bridge (tfgen) Tool DO NOT EDIT.
// *** WARNING: Do not edit by hand unless you're certain you know what you are doing! ***

package castai

import (
	"fmt"

	"github.com/blang/semver"
	"github.com/cast-ai/pulumi-castai/sdk/go/castai/internal"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

type module struct {
	version semver.Version
}

func (m *module) Version() semver.Version {
	return m.version
}

func (m *module) Construct(ctx *pulumi.Context, name, typ, urn string) (r pulumi.Resource, err error) {
	switch typ {
	case "castai:autoscaling:Autoscaler":
		r = &Autoscaler{}
	case "castai:aws:EksCluster":
		r = &EksCluster{}
	case "castai:azure:AksCluster":
		r = &AksCluster{}
	case "castai:gcp:GkeCluster":
		r = &GkeCluster{}
	case "castai:index:Cluster":
		r = &Cluster{}
	case "castai:index:ClusterToken":
		r = &ClusterToken{}
	case "castai:index:Credentials":
		r = &Credentials{}
	default:
		return nil, fmt.Errorf("unknown resource type: %s", typ)
	}

	err = ctx.RegisterResource(typ, name, nil, r, pulumi.URN_(urn))
	return
}

type pkg struct {
	version semver.Version
}

func (p *pkg) Version() semver.Version {
	return p.version
}

func (p *pkg) ConstructProvider(ctx *pulumi.Context, name, typ, urn string) (pulumi.ProviderResource, error) {
	if typ != "pulumi:providers:castai" {
		return nil, fmt.Errorf("unknown provider type: %s", typ)
	}

	r := &Provider{}
	err := ctx.RegisterResource(typ, name, nil, r, pulumi.URN_(urn))
	return r, err
}

func init() {
	version, err := internal.PkgVersion()
	if err != nil {
		version = semver.Version{Major: 1}
	}
	pulumi.RegisterResourceModule(
		"castai",
		"autoscaling",
		&module{version},
	)
	pulumi.RegisterResourceModule(
		"castai",
		"aws",
		&module{version},
	)
	pulumi.RegisterResourceModule(
		"castai",
		"azure",
		&module{version},
	)
	pulumi.RegisterResourceModule(
		"castai",
		"gcp",
		&module{version},
	)
	pulumi.RegisterResourceModule(
		"castai",
		"index",
		&module{version},
	)
	pulumi.RegisterResourcePackage(
		"castai",
		&pkg{version},
	)
}
