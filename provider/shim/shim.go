package shim

import (
	"context"
	"fmt"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

// Helper function to convert a string to a pointer
func stringPtr(s string) *string {
	return &s
}

// resourceGKEClusterCreate implements the Create operation for GKE clusters
func resourceGKEClusterCreate(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	// Create a unique ID for the resource
	name := d.Get("name").(string)
	projectID := d.Get("project_id").(string)
	location := d.Get("location").(string)

	// Create a unique ID based on the required properties
	id := fmt.Sprintf("gke-%s-%s-%s", projectID, location, name)
	d.SetId(id)

	// Set dummy cluster token for testing
	if err := d.Set("cluster_token", "sample-cluster-token"); err != nil {
		return diag.FromErr(fmt.Errorf("error setting cluster token: %v", err))
	}

	// Set a dummy credentials ID
	if err := d.Set("credentials_id", "sample-credentials-id"); err != nil {
		return diag.FromErr(fmt.Errorf("error setting credentials ID: %v", err))
	}

	return nil
}

// resourceGKEClusterRead implements the Read operation for GKE clusters
func resourceGKEClusterRead(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	// In a real implementation, this would fetch the current state from the API
	// For our temporary implementation, just return nil to indicate success
	return nil
}

// resourceGKEClusterUpdate implements the Update operation for GKE clusters
func resourceGKEClusterUpdate(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	// In a real implementation, this would update the resource
	// For our temporary implementation, just return nil to indicate success
	return nil
}

// resourceGKEClusterDelete implements the Delete operation for GKE clusters
func resourceGKEClusterDelete(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	// In a real implementation, this would delete the resource
	// For our temporary implementation, just return nil to indicate success
	d.SetId("")
	return nil
}

// Provider returns a schema.Provider for CAST AI
func Provider() *schema.Provider {
	// Create the GKE cluster resource schema
	gkeClusterResource := &schema.Resource{
		Schema: map[string]*schema.Schema{
			"name": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "GKE cluster name",
			},
			"project_id": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "GCP project id",
			},
			"location": {
				Type:        schema.TypeString,
				Required:    true,
				ForceNew:    true,
				Description: "GCP cluster zone in case of zonal or region in case of regional cluster",
			},
			"credentials_json": {
				Type:        schema.TypeString,
				Sensitive:   true,
				Optional:    true,
				Description: "GCP credentials.json from ServiceAccount with credentials for CAST AI",
			},
			"delete_nodes_on_disconnect": {
				Type:        schema.TypeBool,
				Optional:    true,
				Description: "Should CAST AI remove nodes managed by CAST.AI on disconnect",
			},
			"credentials_id": {
				Type:        schema.TypeString,
				Computed:    true,
				Description: "CAST AI credentials id for cluster",
			},
			"cluster_token": {
				Type:        schema.TypeString,
				Computed:    true,
				Sensitive:   true,
				Description: "CAST.AI agent cluster token",
			},
		},
		CreateContext: resourceGKEClusterCreate,
		ReadContext:   resourceGKEClusterRead,
		UpdateContext: resourceGKEClusterUpdate,
		DeleteContext: resourceGKEClusterDelete,
	}

	// Create the autoscaler resource schema
	autoscalerResource := &schema.Resource{
		Schema: map[string]*schema.Schema{
			"cluster_id": {
				Type:        schema.TypeString,
				Required:    true,
				Description: "ID of the cluster to configure autoscaling for",
			},
			"enabled": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     true,
				Description: "Whether autoscaling is enabled",
			},
			"is_scoped_mode": {
				Type:        schema.TypeBool,
				Optional:    true,
				Default:     false,
				Description: "Whether autoscaler only considers nodes with specific labels",
			},
			"unschedulable_pods": {
				Type:        schema.TypeSet,
				Optional:    true,
				Description: "Settings for handling unschedulable pods",
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"enabled": {
							Type:     schema.TypeBool,
							Optional: true,
							Default:  true,
						},
						"headroom": {
							Type:     schema.TypeSet,
							Optional: true,
							Elem: &schema.Resource{
								Schema: map[string]*schema.Schema{
									"enabled": {
										Type:     schema.TypeBool,
										Optional: true,
										Default:  true,
									},
									"cpu_percentage": {
										Type:     schema.TypeInt,
										Optional: true,
										Default:  10,
									},
									"memory_percentage": {
										Type:     schema.TypeInt,
										Optional: true,
										Default:  10,
									},
								},
							},
						},
					},
				},
			},
			"cluster_limits": {
				Type:        schema.TypeSet,
				Optional:    true,
				Description: "Overall cluster resource limits for autoscaling",
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"enabled": {
							Type:     schema.TypeBool,
							Optional: true,
							Default:  true,
						},
						"cpu": {
							Type:     schema.TypeSet,
							Optional: true,
							Elem: &schema.Resource{
								Schema: map[string]*schema.Schema{
									"min_cores": {
										Type:     schema.TypeInt,
										Optional: true,
										Default:  1,
									},
									"max_cores": {
										Type:     schema.TypeInt,
										Optional: true,
										Default:  50,
									},
								},
							},
						},
					},
				},
			},
			"node_downscaler": {
				Type:        schema.TypeSet,
				Optional:    true,
				Description: "Settings for node downscaling",
				Elem: &schema.Resource{
					Schema: map[string]*schema.Schema{
						"enabled": {
							Type:     schema.TypeBool,
							Optional: true,
							Default:  true,
						},
						"empty_nodes": {
							Type:     schema.TypeSet,
							Optional: true,
							Elem: &schema.Resource{
								Schema: map[string]*schema.Schema{
									"enabled": {
										Type:     schema.TypeBool,
										Optional: true,
										Default:  true,
									},
									"delay_seconds": {
										Type:     schema.TypeInt,
										Optional: true,
										Default:  180,
									},
								},
							},
						},
						"evictor": {
							Type:     schema.TypeSet,
							Optional: true,
							Elem: &schema.Resource{
								Schema: map[string]*schema.Schema{
									"enabled": {
										Type:     schema.TypeBool,
										Optional: true,
										Default:  true,
									},
								},
							},
						},
					},
				},
			},
		},
	}

	// Fallback implementation with empty schemas
	// This will be replaced by the actual implementation when properly imported
	return &schema.Provider{
		Schema: map[string]*schema.Schema{
			"api_url": {
				Type:        schema.TypeString,
				Required:    true,
				DefaultFunc: schema.EnvDefaultFunc("CASTAI_API_URL", "https://api.cast.ai"),
				Description: "CAST.AI API url.",
			},
			"api_token": {
				Type:        schema.TypeString,
				Required:    true,
				DefaultFunc: schema.EnvDefaultFunc("CASTAI_API_TOKEN", nil),
				Description: "The token used to connect to CAST AI API.",
			},
		},
		ResourcesMap: map[string]*schema.Resource{
			// Core Resources
			"castai_eks_cluster":                {},
			"castai_eks_clusterid":              {},
			"castai_gke_cluster":                gkeClusterResource, // Use our defined schema
			"castai_gke_cluster_id":             {},
			"castai_aks_cluster":                {},
			"castai_autoscaler":                 autoscalerResource, // Use our defined schema
			"castai_evictor_advanced_config":    {},
			"castai_node_template":              {},
			"castai_node_configuration":         {},
			"castai_node_configuration_default": {},
			"castai_eks_user_arn":               {},
			"castai_rebalancing_schedule":       {},
			"castai_rebalancing_job":            {},
			"castai_reservations":               {},
			"castai_commitments":                {},
			"castai_organization_members":       {},
			"castai_sso_connection":             {},
			"castai_service_account":            {},
			"castai_service_account_key":        {},
			"castai_workload_scaling_policy":    {},
			"castai_organization_group":         {},
			"castai_role_bindings":              {},
			"castai_cluster_token":              {},
		},
		DataSourcesMap: map[string]*schema.Resource{
			"castai_eks_settings":         {},
			"castai_gke_user_policies":    {},
			"castai_organization":         {},
			"castai_rebalancing_schedule": {},
			"castai_eks_user_arn":         {},
		},
	}
}
