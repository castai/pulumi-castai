"""
Example of using the CAST AI Pulumi provider to connect an EKS cluster.
"""

import pulumi
from pulumi_aws import eks
from pulumi_aws import iam
import pulumi_castai as castai

# Create an EKS cluster
eks_cluster = eks.Cluster("my-cluster",
    role_arn=iam.get_role(name="eks-cluster-role").arn,
    vpc_config=eks.ClusterVpcConfigArgs(
        subnet_ids=["subnet-12345", "subnet-67890"],
    ),
)

# Prepare keyword arguments for CAST AI EKS cluster
kwargs = {
    "account_id": "12345678901",
    "region": "us-west-2",
    "eks_cluster_name": eks_cluster.name,
    "delete_nodes_on_disconnect": True,
    "tags": {
        "environment": "dev",
        "managed-by": "pulumi",
    }
}

# Connect the EKS cluster to CAST AI
castai_cluster = castai.EksCluster("castai-eks-cluster", **kwargs)

# Export the CAST AI cluster ID
pulumi.export("castai_cluster_id", castai_cluster.id)