"""
Mock Tests for Connecting Existing GKE Clusters to CAST AI (Python)

These tests simulate connecting an existing GKE cluster to CAST AI for optimization.
The cluster already exists - we're just onboarding it to CAST AI.

Run with: pytest test_gke_existing_cluster.py -v
"""

import pulumi


@pulumi.runtime.test
def test_connect_existing_gke_cluster():
    """Test connecting an existing GKE cluster to CAST AI"""
    import pulumi_castai as castai

    # Simulated GCP service account credentials
    mock_credentials = '{"type": "service_account", "project_id": "my-gcp-project"}'

    # Connect existing cluster - in real scenario, cluster already exists in GCP
    cluster = castai.GkeCluster(
        "existing-gke-cluster",
        project_id="my-gcp-project-123",
        location="us-central1",
        name="production-gke-cluster",  # Existing cluster name
        delete_nodes_on_disconnect=False,  # Don't delete nodes when disconnecting
        credentials_json=mock_credentials,
    )

    def check_outputs(outputs):
        cluster_id, cluster_name, cluster_token, project_id = outputs
        assert cluster_id is not None
        assert cluster_name == "production-gke-cluster"
        assert cluster_token is not None
        assert "token" in str(cluster_token).lower() or len(str(cluster_token)) > 0
        assert project_id == "my-gcp-project-123"

    return pulumi.Output.all(
        cluster.id, cluster.name, cluster.cluster_token, cluster.project_id
    ).apply(check_outputs)


@pulumi.runtime.test
def test_connect_existing_gke_with_ssh_key():
    """Test connecting existing GKE cluster with SSH key for node access"""
    import pulumi_castai as castai

    mock_credentials = '{"type": "service_account", "project_id": "my-project"}'
    ssh_public_key = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ... gke-access-key"

    cluster = castai.GkeCluster(
        "existing-gke-ssh",
        project_id="my-project-456",
        location="europe-west1",
        name="staging-gke-cluster",
        delete_nodes_on_disconnect=True,
        credentials_json=mock_credentials,
        ssh_public_key=ssh_public_key,
    )

    def check_ssh_key(outputs):
        ssh_key, cluster_name = outputs
        assert ssh_key == ssh_public_key
        assert cluster_name == "staging-gke-cluster"

    return pulumi.Output.all(cluster.ssh_public_key, cluster.name).apply(check_ssh_key)


@pulumi.runtime.test
def test_connect_existing_gke_regional_cluster():
    """Test connecting existing regional GKE cluster (high availability)"""
    import pulumi_castai as castai

    mock_credentials = '{"type": "service_account", "project_id": "prod-project"}'

    # Regional cluster for HA (vs zonal cluster)
    cluster = castai.GkeCluster(
        "existing-gke-regional",
        project_id="prod-project-789",
        location="us-central1",  # Region (not a zone like us-central1-a)
        name="ha-gke-cluster",
        delete_nodes_on_disconnect=False,
        credentials_json=mock_credentials,
    )

    def check_regional(outputs):
        location, cluster_name = outputs
        assert location == "us-central1"
        assert "ha-gke-cluster" == cluster_name

    return pulumi.Output.all(cluster.location, cluster.name).apply(check_regional)


@pulumi.runtime.test
def test_connect_existing_gke_zonal_cluster():
    """Test connecting existing zonal GKE cluster"""
    import pulumi_castai as castai

    mock_credentials = '{"type": "service_account", "project_id": "dev-project"}'

    # Zonal cluster (single zone)
    cluster = castai.GkeCluster(
        "existing-gke-zonal",
        project_id="dev-project-321",
        location="us-east1-b",  # Specific zone
        name="dev-gke-cluster",
        delete_nodes_on_disconnect=True,
        credentials_json=mock_credentials,
    )

    def check_zonal(outputs):
        location, cluster_name = outputs
        assert location == "us-east1-b"
        assert cluster_name == "dev-gke-cluster"

    return pulumi.Output.all(cluster.location, cluster.name).apply(check_zonal)


@pulumi.runtime.test
def test_connect_existing_gke_minimal_config():
    """Test connecting existing GKE cluster with minimal configuration"""
    import pulumi_castai as castai

    mock_credentials = '{"type": "service_account", "project_id": "minimal-proj"}'

    # Minimal required configuration
    cluster = castai.GkeCluster(
        "existing-gke-minimal",
        project_id="minimal-proj-999",
        location="asia-southeast1",
        name="minimal-gke",
        delete_nodes_on_disconnect=True,
        credentials_json=mock_credentials,
    )

    def check_minimal(outputs):
        cluster_id, cluster_name, project_id = outputs
        assert cluster_id is not None
        assert cluster_name == "minimal-gke"
        assert project_id == "minimal-proj-999"

    return pulumi.Output.all(cluster.id, cluster.name, cluster.project_id).apply(
        check_minimal
    )


@pulumi.runtime.test
def test_connect_existing_gke_credentials_handling():
    """Test that GKE cluster properly handles service account credentials"""
    import pulumi_castai as castai

    # Realistic service account JSON structure
    realistic_credentials = """{
        "type": "service_account",
        "project_id": "my-production-project",
        "private_key_id": "abc123def456",
        "private_key": "-----BEGIN PRIVATE KEY-----\\nMOCK_KEY\\n-----END PRIVATE KEY-----\\n",
        "client_email": "castai-sa@my-production-project.iam.gserviceaccount.com",
        "client_id": "123456789012345678901",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token"
    }"""

    cluster = castai.GkeCluster(
        "existing-gke-creds",
        project_id="my-production-project",
        location="us-west1",
        name="prod-main-cluster",
        delete_nodes_on_disconnect=False,
        credentials_json=realistic_credentials,
    )

    def check_credentials(outputs):
        creds_json, credentials_id, cluster_name = outputs
        assert creds_json is not None
        assert credentials_id is not None
        assert "mock-credentials" in str(credentials_id).lower() or len(
            str(credentials_id)
        ) > 0
        assert cluster_name == "prod-main-cluster"

    return pulumi.Output.all(
        cluster.credentials_json, cluster.credentials_id, cluster.name
    ).apply(check_credentials)


@pulumi.runtime.test
def test_connect_existing_gke_multi_region():
    """Test connecting GKE clusters in different regions"""
    import pulumi_castai as castai

    mock_credentials = '{"type": "service_account", "project_id": "global-project"}'

    regions = ["us-central1", "europe-west1", "asia-east1"]
    clusters = []

    for region in regions:
        cluster = castai.GkeCluster(
            f"existing-gke-{region}",
            project_id="global-project-001",
            location=region,
            name=f"cluster-{region}",
            delete_nodes_on_disconnect=False,
            credentials_json=mock_credentials,
        )
        clusters.append(cluster)

    def check_multi_region(outputs):
        for i, (location, name) in enumerate(
            zip(outputs[::2], outputs[1::2])
        ):  # Every 2 outputs
            assert location == regions[i]
            assert name == f"cluster-{regions[i]}"

    all_outputs = []
    for cluster in clusters:
        all_outputs.extend([cluster.location, cluster.name])

    return pulumi.Output.all(*all_outputs).apply(check_multi_region)
