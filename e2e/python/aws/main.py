"""
E2E test for CAST AI AWS (EKS) integration using Python
"""

import json
import pulumi
import pulumi_aws as aws
import pulumi_eks as eks
import pulumi_kubernetes as k8s
import pulumi_castai as castai
from pulumi import Output

# Configuration
config = pulumi.Config()
region = config.get("aws:region") or "us-west-2"
castai_token = config.require_secret("castai:apiToken")
castai_url = config.get("castai:apiUrl") or "https://api.cast.ai"
cluster_name = "pulumi-castai-e2e-test-eks-py"

# Create a VPC for our cluster
vpc = aws.ec2.Vpc(
    "castai-e2e-vpc-py",
    cidr_block="10.0.0.0/16",
    enable_dns_hostnames=True,
    enable_dns_support=True,
    tags={
        "Name": f"{cluster_name}-vpc",
    },
)

# Get availability zones
availability_zones = aws.get_availability_zones()
public_subnet_ids = []
private_subnet_ids = []

# Create public subnets
for i in range(2):
    public_subnet = aws.ec2.Subnet(
        f"castai-e2e-public-subnet-py-{i}",
        vpc_id=vpc.id,
        cidr_block=f"10.0.{i}.0/24",
        availability_zone=availability_zones.names[i],
        map_public_ip_on_launch=True,
        tags={
            "Name": f"{cluster_name}-public-subnet-{i}",
            "kubernetes.io/role/elb": "1",
        },
    )
    public_subnet_ids.append(public_subnet.id)

    private_subnet = aws.ec2.Subnet(
        f"castai-e2e-private-subnet-py-{i}",
        vpc_id=vpc.id,
        cidr_block=f"10.0.{i + 128}.0/24",
        availability_zone=availability_zones.names[i],
        tags={
            "Name": f"{cluster_name}-private-subnet-{i}",
            "kubernetes.io/role/internal-elb": "1",
        },
    )
    private_subnet_ids.append(private_subnet.id)

# Create an internet gateway
internet_gateway = aws.ec2.InternetGateway(
    "castai-e2e-igw-py",
    vpc_id=vpc.id,
    tags={
        "Name": f"{cluster_name}-igw",
    },
)

# Create a route table for public subnets
public_route_table = aws.ec2.RouteTable(
    "castai-e2e-public-rt-py",
    vpc_id=vpc.id,
    routes=[
        aws.ec2.RouteTableRouteArgs(
            cidr_block="0.0.0.0/0",
            gateway_id=internet_gateway.id,
        ),
    ],
    tags={
        "Name": f"{cluster_name}-public-rt",
    },
)

# Associate public subnets with the public route table
for i in range(2):
    aws.ec2.RouteTableAssociation(
        f"castai-e2e-public-rta-py-{i}",
        subnet_id=public_subnet_ids[i],
        route_table_id=public_route_table.id,
    )

# Create EKS cluster
cluster = eks.Cluster(
    cluster_name,
    vpc_id=vpc.id,
    subnet_ids=[*public_subnet_ids, *private_subnet_ids],
    instance_type="t3.medium",
    desired_capacity=1,
    min_size=1,
    max_size=2,
    storage_classes="gp2",
    deploy_dashboard=False,
    version="1.27",
    skip_default_node_group=False,
    node_associate_public_ip_address=True,
    endpoint_private_access=False,
    endpoint_public_access=True,
    enabled_cluster_log_types=[
        "api",
        "audit",
        "authenticator",
    ],
    tags={
        "Name": cluster_name,
        "Environment": "test",
    },
)

# Create IAM resources for CAST AI
castai_policy = aws.iam.Policy(
    "castai-e2e-policy-py",
    policy=json.dumps({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "autoscaling:*",
                    "ec2:*",
                    "eks:*",
                    "iam:*",
                    "ecr:*",
                ],
                "Resource": "*",
            },
        ],
    }),
)

# Create a role for CAST AI
castai_role = aws.iam.Role(
    "castai-e2e-role-py",
    assume_role_policy=json.dumps({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "AWS": "arn:aws:iam::396686879907:root",
                },
                "Action": "sts:AssumeRole",
                "Condition": {
                    "StringEquals": {
                        "sts:ExternalId": "castai-eks-test-py",
                    },
                },
            },
        ],
    }),
)

# Attach policy to role
castai_policy_attachment = aws.iam.RolePolicyAttachment(
    "castai-e2e-policy-attachment-py",
    role=castai_role.name,
    policy_arn=castai_policy.arn,
)

# Get account ID
caller_identity = aws.get_caller_identity()

# Create the CAST AI EKS integration
castai_eks_cluster = castai.EksCluster(
    "castai-e2e-eks-py",
    eks_cluster_name=cluster.eks_cluster.name,
    eks_cluster_arn=cluster.eks_cluster.arn,
    account_id=caller_identity.account_id,
    region=region,
    assume_role_arn=castai_role.arn,
    external_id="castai-eks-test-py",
    delete_nodes_on_disconnect=True,
    node_configurations={
        "default": castai.EksClusterNodeConfigurationArgs(
            subnets=private_subnet_ids,
            security_groups=[cluster.node_security_group.id],
            instance_profile_arn=cluster.instance_profile.arn,
            tags={
                "castai-e2e-test-py": "true",
            },
        ),
    },
    node_templates={
        "default": castai.EksClusterNodeTemplateArgs(
            name="default-by-castai",
            configuration_id="${castai_node_configuration_id.default}",
            is_default=True,
            should_taint=False,
            constraints=castai.EksClusterNodeTemplateConstraintsArgs(
                on_demand=True,
                spot=True,
                use_spot_fallbacks=True,
                enable_spot_diversity=False,
                spot_diversity_price_increase_limit_percent=20,
            ),
        ),
        "spot_template": castai.EksClusterNodeTemplateArgs(
            configuration_id="${castai_node_configuration_id.default}",
            should_taint=True,
            constraints=castai.EksClusterNodeTemplateConstraintsArgs(
                on_demand=False,
                spot=True,
                use_spot_fallbacks=True,
                min_cpu=4,
                max_cpu=100,
                instance_families=castai.EksClusterNodeTemplateConstraintsInstanceFamiliesArgs(
                    exclude=["t2", "t3"],
                ),
            ),
        ),
    },
    autoscaler_policies_json=json.dumps({
        "enabled": True,
        "isScopedMode": True,
        "unschedulablePods": {
            "enabled": True,
        },
        "nodeDownscaler": {
            "emptyNodes": {
                "enabled": True,
            },
        },
    }),
)

# Export the CAST AI cluster ID
pulumi.export("castai_cluster_id", castai_eks_cluster.id) 