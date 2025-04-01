import pulumi
import pulumi_castai as castai

# Placeholder: Assume cluster_id is obtained from an existing cluster resource
# e.g., eks_cluster = castai.aws.EksCluster(...)
# cluster_id = eks_cluster.id
cluster_id = "your-cluster-id" # Replace with a valid cluster ID

# Create a commitment plan
commitments_kwargs = {
    "name": "production-py-commitments",
    "auto_apply": True,
    "auto_apply_label": "environment=production",
    "compute_unit_hourly_rate": 0.0294, # Example rate, replace with actual value
    "instances": [{
        "cluster_id": cluster_id,
        "compute_units": 100,
        "start_date": "2024-01-01T00:00:00Z", # Adjust dates as needed
        "end_date": "2024-12-31T23:59:59Z",
    }]
}

commitments = castai.Commitments("example-py-commitments", **commitments_kwargs)

# Create a reservation of compute instances
reservations_kwargs = {
    "cluster_id": cluster_id,
    "instances": [{
        "instance_type": "m5.2xlarge",
        "provider": "aws", # Or gcp, azure
        "zone": "us-west-2a", # Adjust zone
        "spot_instance": False,
        "count": 3,
        "start_date": "2024-01-01T00:00:00Z", # Adjust dates
        "end_date": "2024-06-30T23:59:59Z",
        "labels": {
            "reserved": "true",
            "workload": "database"
        },
        "taints": [{
            "key": "reserved",
            "value": "database",
            "effect": "NoSchedule"
        }]
    }],
    # "node_configuration_id": "your-node-config-id" # Optional
}

reservations = castai.Reservations("example-py-reservations", **reservations_kwargs)

# Export commitment and reservation IDs
pulumi.export("commitment_py_id", commitments.id)
pulumi.export("reservation_py_id", reservations.id) 