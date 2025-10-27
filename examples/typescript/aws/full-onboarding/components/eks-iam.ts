/**
 * EKS IAM Component Resource
 *
 * This component encapsulates all IAM resources needed for CAST AI to manage an EKS cluster.
 * It provides a simplified interface similar to the Terraform eks-role-iam module.
 *
 * Creates:
 * - IAM role for CAST AI (with trust relationship to CAST AI user)
 * - IAM policies for cluster management
 * - IAM role for worker nodes
 * - Instance profile for worker nodes
 * - Security group for CAST AI nodes
 * - EKS access entry for node authentication (API mode)
 * - Optional: aws-auth ConfigMap update (API_AND_CONFIG_MAP mode)
 *
 * Authentication Modes:
 * This component handles ALL EKS authentication modes (matching CAST AI onboarding script):
 * - API mode: Only requires EKS access entry (always created)
 * - CONFIG_MAP mode: Requires aws-auth ConfigMap update (when k8sProvider provided)
 * - API_AND_CONFIG_MAP mode: Requires both (when k8sProvider provided)
 *
 * Best Practice: Always provide k8sProvider to support all modes. The component will
 * safely read the existing ConfigMap, merge entries, and update without data loss.
 *
 * Outputs:
 * - roleArn: ARN of the CAST AI IAM role (for assumeRoleArn)
 * - instanceProfileArn: ARN of the instance profile (for node configurations)
 * - nodeRoleArn: ARN of the node IAM role
 * - securityGroupId: ID of the CAST AI security group
 */

import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as k8s from "@pulumi/kubernetes";
import * as command from "@pulumi/command";

export interface EksIamArgs {
    /**
     * Name of the EKS cluster
     */
    clusterName: string;

    /**
     * AWS region where the cluster is located
     */
    region: string;

    /**
     * AWS account ID
     */
    accountId: pulumi.Input<string>;

    /**
     * VPC ID where the EKS cluster is running
     */
    vpcId: pulumi.Input<string>;

    /**
     * CAST AI user ARN for IAM trust relationship
     */
    castaiUserArn: pulumi.Input<string>;

    /**
     * Cluster ID from CAST AI (for tagging)
     */
    clusterId: pulumi.Input<string>;

    /**
     * Kubernetes provider for ConfigMap operations (recommended)
     * Provide this to support all authentication modes (API, CONFIG_MAP, API_AND_CONFIG_MAP).
     * When provided, the component will safely update aws-auth ConfigMap by merging entries.
     * If not provided, only EKS access entries will be created (suitable for pure API mode).
     */
    k8sProvider?: k8s.Provider;
}

export class EksIamResources extends pulumi.ComponentResource {
    public readonly roleArn: pulumi.Output<string>;
    public readonly instanceProfileArn: pulumi.Output<string>;
    public readonly nodeRoleArn: pulumi.Output<string>;
    public readonly securityGroupId: pulumi.Output<string>;

    constructor(name: string, args: EksIamArgs, opts?: pulumi.ComponentResourceOptions) {
        super("castai:aws:EksIamResources", name, {}, opts);

        const componentOpts = { parent: this };

        // Create IAM role for CAST AI
        const castaiRole = new aws.iam.Role(`${name}-role`, {
            // Use first 8 chars of cluster ID to keep name under 64 char limit
            name: pulumi.interpolate`cast-eks-${args.clusterName}-role-${pulumi.output(args.clusterId).apply((id: string) => id.substring(0, 8))}`,
            description: `CAST AI role for EKS cluster ${args.clusterName}`,
            assumeRolePolicy: pulumi.all([args.castaiUserArn]).apply(([arn]) => JSON.stringify({
                Version: "2012-10-17",
                Statement: [{
                    Effect: "Allow",
                    Principal: {
                        AWS: arn,
                    },
                    Action: "sts:AssumeRole",
                }],
            })),
            tags: {
                "cast:cluster-id": args.clusterId,
            },
        }, componentOpts);

        // Create IAM policy with required permissions
        const castaiPolicy = new aws.iam.Policy(`${name}-policy`, {
            name: `castai-eks-${args.clusterName}`,
            description: `CAST AI policy for EKS cluster ${args.clusterName}`,
            policy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [
                    {
                        Sid: "RunInstancesTagging",
                        Effect: "Allow",
                        Action: "ec2:CreateTags",
                        Resource: "*",
                        Condition: {
                            StringEquals: {
                                "ec2:CreateAction": ["RunInstances"],
                            },
                        },
                    },
                    {
                        Sid: "RunInstances",
                        Effect: "Allow",
                        Action: "ec2:RunInstances",
                        Resource: [
                            "arn:aws:ec2:*::image/*",
                            "arn:aws:ec2:*::snapshot/*",
                            "arn:aws:ec2:*:*:instance/*",
                            "arn:aws:ec2:*:*:key-pair/*",
                            "arn:aws:ec2:*:*:launch-template/*",
                            "arn:aws:ec2:*:*:network-interface/*",
                            "arn:aws:ec2:*:*:security-group/*",
                            "arn:aws:ec2:*:*:subnet/*",
                            "arn:aws:ec2:*:*:volume/*",
                        ],
                    },
                    {
                        Sid: "RunInstancesInstanceProfile",
                        Effect: "Allow",
                        Action: "iam:PassRole",
                        Resource: "*",
                        Condition: {
                            StringEquals: {
                                "iam:PassedToService": "ec2.amazonaws.com",
                            },
                        },
                    },
                    {
                        Sid: "InstanceActions",
                        Effect: "Allow",
                        Action: [
                            "ec2:TerminateInstances",
                            "ec2:StartInstances",
                            "ec2:StopInstances",
                            "ec2:ModifyInstanceAttribute",
                        ],
                        Resource: "*",
                        Condition: {
                            StringEquals: {
                                [`ec2:ResourceTag/kubernetes.io/cluster/${args.clusterName}`]: "owned",
                            },
                        },
                    },
                    {
                        Sid: "AutoscalingGroups",
                        Effect: "Allow",
                        Action: [
                            "autoscaling:UpdateAutoScalingGroup",
                            "autoscaling:SuspendProcesses",
                            "autoscaling:ResumeProcesses",
                            "autoscaling:TerminateInstanceInAutoScalingGroup",
                        ],
                        Resource: "*",
                        Condition: {
                            StringEquals: {
                                [`autoscaling:ResourceTag/kubernetes.io/cluster/${args.clusterName}`]: "owned",
                            },
                        },
                    },
                    {
                        Sid: "EC2CreateTags",
                        Effect: "Allow",
                        Action: "ec2:CreateTags",
                        Resource: "*",
                    },
                    {
                        Sid: "EKS",
                        Effect: "Allow",
                        Action: [
                            "eks:Describe*",
                            "eks:List*",
                        ],
                        Resource: "*",
                    },
                    {
                        Sid: "EC2Read",
                        Effect: "Allow",
                        Action: [
                            "ec2:DescribeInstances",
                            "ec2:DescribeImages",
                            "ec2:DescribeVolumes",
                            "ec2:DescribeSecurityGroups",
                            "ec2:DescribeSubnets",
                            "ec2:DescribeInstanceTypes",
                            "ec2:DescribeInstanceTypeOfferings",
                            "ec2:DescribeLaunchTemplateVersions",
                            "ec2:DescribeAvailabilityZones",
                            "ec2:DescribeSpotPriceHistory",
                            "ec2:DescribeRegions",
                        ],
                        Resource: "*",
                    },
                    {
                        Sid: "AutoscalingRead",
                        Effect: "Allow",
                        Action: [
                            "autoscaling:DescribeAutoScalingGroups",
                            "autoscaling:DescribeLaunchConfigurations",
                            "autoscaling:DescribeScalingActivities",
                        ],
                        Resource: "*",
                    },
                    {
                        Sid: "IAMRead",
                        Effect: "Allow",
                        Action: [
                            "iam:GetInstanceProfile",
                            "iam:GetRole",
                            "iam:SimulatePrincipalPolicy",
                        ],
                        Resource: "*",
                    },
                ],
            }),
        }, componentOpts);

        // Attach custom policy to role
        new aws.iam.RolePolicyAttachment(`${name}-policy-attachment`, {
            role: castaiRole.name,
            policyArn: castaiPolicy.arn,
        }, componentOpts);

        // Attach AWS managed policies to role
        new aws.iam.RolePolicyAttachment(`${name}-ec2-readonly`, {
            role: castaiRole.name,
            policyArn: "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess",
        }, componentOpts);

        new aws.iam.RolePolicyAttachment(`${name}-iam-readonly`, {
            role: castaiRole.name,
            policyArn: "arn:aws:iam::aws:policy/IAMReadOnlyAccess",
        }, componentOpts);

        // Create IAM role for worker nodes
        const nodeRole = new aws.iam.Role(`${name}-node-role`, {
            name: `cast-eks-${args.clusterName}-node-role`,
            assumeRolePolicy: JSON.stringify({
                Version: "2012-10-17",
                Statement: [{
                    Effect: "Allow",
                    Principal: {
                        Service: "ec2.amazonaws.com",
                    },
                    Action: "sts:AssumeRole",
                }],
            }),
        }, componentOpts);

        // Attach AWS managed policies for EKS worker nodes
        const nodePolicies = [
            { name: "eks-worker-node", arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy" },
            { name: "eks-cni", arn: "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy" },
            { name: "ecr-readonly", arn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly" },
            { name: "ssm-managed", arn: "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore" },
            { name: "ebs-csi", arn: "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy" },
        ];

        nodePolicies.forEach(policy => {
            new aws.iam.RolePolicyAttachment(`${name}-node-${policy.name}`, {
                role: nodeRole.name,
                policyArn: policy.arn,
            }, componentOpts);
        });

        // Create instance profile
        const instanceProfile = new aws.iam.InstanceProfile(`${name}-instance-profile`, {
            // Use first 8 chars of cluster ID to keep name under 128 char limit
            name: pulumi.interpolate`cast-eks-${args.clusterName}-profile-${pulumi.output(args.clusterId).apply((id: string) => id.substring(0, 8))}`,
            role: nodeRole.name,
        }, componentOpts);

        // Create security group for CAST AI nodes
        const securityGroup = new aws.ec2.SecurityGroup(`${name}-security-group`, {
            name: `cast-eks-${args.clusterName}-sg`,
            description: `Security group for CAST AI nodes in cluster ${args.clusterName}`,
            vpcId: args.vpcId,
            tags: {
                "cast:cluster-id": args.clusterId,
            },
        }, componentOpts);

        // Allow all traffic within the security group
        new aws.ec2.SecurityGroupRule(`${name}-sg-self-ingress`, {
            type: "ingress",
            fromPort: 0,
            toPort: 0,
            protocol: "-1",
            securityGroupId: securityGroup.id,
            sourceSecurityGroupId: securityGroup.id,
        }, componentOpts);

        // Create EKS access entry for node authentication (API mode)
        new aws.eks.AccessEntry(`${name}-access-entry`, {
            clusterName: args.clusterName,
            principalArn: nodeRole.arn,
            type: "EC2_LINUX",
        }, componentOpts);

        // Update aws-auth ConfigMap if Kubernetes provider is provided
        // This is needed for clusters using API_AND_CONFIG_MAP authentication mode
        if (args.k8sProvider) {
            // Use kubectl command to safely patch the ConfigMap
            // This approach avoids SSA conflicts and properly handles existing entries
            const awsAuthPatch = new command.local.Command(`${name}-aws-auth-patch`, {
                create: nodeRole.arn.apply((arn: string) => {
                    // Use kubectl to read, merge, and update the ConfigMap
                    const patchCmd = `
# Read existing ConfigMap
EXISTING_MAP_ROLES=$(kubectl get configmap aws-auth -n kube-system -o jsonpath='{.data.mapRoles}')

# Parse and merge
CAST_ROLE='- rolearn: ${arn}
  username: system:node:{{EC2PrivateDNSName}}
  groups:
    - system:bootstrappers
    - system:nodes'

# Check if role already exists
if echo "$EXISTING_MAP_ROLES" | grep -q "${arn}"; then
  echo "CAST AI role already exists in aws-auth ConfigMap"
  exit 0
fi

# Append the role
UPDATED_ROLES="$EXISTING_MAP_ROLES
$CAST_ROLE"

# Create patch JSON
PATCH_JSON=$(cat <<EOF
{
  "data": {
    "mapRoles": $(echo "$UPDATED_ROLES" | jq -Rs .)
  }
}
EOF
)

# Apply patch
kubectl patch configmap aws-auth -n kube-system -p "$PATCH_JSON"
echo "CAST AI role added to aws-auth ConfigMap"
`;
                    return patchCmd;
                }),
            }, {
                ...componentOpts,
                dependsOn: [nodeRole],
            });
        }

        // Set outputs
        this.roleArn = castaiRole.arn;
        this.instanceProfileArn = instanceProfile.arn;
        this.nodeRoleArn = nodeRole.arn;
        this.securityGroupId = securityGroup.id;

        this.registerOutputs({
            roleArn: this.roleArn,
            instanceProfileArn: this.instanceProfileArn,
            nodeRoleArn: this.nodeRoleArn,
            securityGroupId: this.securityGroupId,
        });
    }
}
