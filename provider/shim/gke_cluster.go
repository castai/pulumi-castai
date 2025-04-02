package shim

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/hashicorp/terraform-plugin-sdk/v2/diag"
	"github.com/hashicorp/terraform-plugin-sdk/v2/helper/schema"
)

// CAST AI API client
type castaiClient struct {
	apiURL   string
	apiToken string
	client   *http.Client
}

// GKE cluster registration request
type gkeClusterRegistrationRequest struct {
	Gke                    *gkeClusterParams `json:"gke,omitempty"`
	DeleteNodesOnDisconnect bool             `json:"deleteNodesOnDisconnect,omitempty"`
}

// GKE cluster parameters
type gkeClusterParams struct {
	ProjectId   *string `json:"projectId,omitempty"`
	Region      *string `json:"region,omitempty"`
	Location    *string `json:"location,omitempty"`
	ClusterName *string `json:"clusterName,omitempty"`
	Credentials *string `json:"credentials,omitempty"`
}

// GKE cluster registration response
type gkeClusterRegistrationResponse struct {
	Id            *string `json:"id,omitempty"`
	CredentialsId *string `json:"credentialsId,omitempty"`
}

// Cluster token response
type clusterTokenResponse struct {
	Token *string `json:"token,omitempty"`
}

// Helper function to convert a string to a pointer
func toPtr(s string) *string {
	return &s
}

// Create a new CAST AI API client
func newCastaiClient(apiURL, apiToken string) *castaiClient {
	return &castaiClient{
		apiURL:   apiURL,
		apiToken: apiToken,
		client:   &http.Client{Timeout: 10 * time.Second}, // Very short timeout for testing
	}
}

// Register a GKE cluster with CAST AI
func (c *castaiClient) registerGKECluster(ctx context.Context, req gkeClusterRegistrationRequest) (*gkeClusterRegistrationResponse, error) {
	// Validate API token
	if c.apiToken == "" {
		return nil, fmt.Errorf("CAST AI API token is required")
	}

	// Add a direct error message for testing
	fmt.Println("TESTING: Returning a direct error message to avoid hanging")
	return nil, fmt.Errorf("TESTING: Direct error message to avoid hanging")

	fmt.Println("\n\n==== REGISTERING GKE CLUSTER WITH CAST AI ====\n")
	fmt.Printf("Project ID: %s, Location: %s, Cluster Name: %s\n", *req.Gke.ProjectId, *req.Gke.Location, *req.Gke.ClusterName)
	fmt.Printf("API URL: %s\n", c.apiURL)

	// Prepare the request body
	reqBody, err := json.Marshal(req)
	if err != nil {
		return nil, fmt.Errorf("error marshaling request: %v", err)
	}

	// Create the HTTP request
	url := fmt.Sprintf("%s/v1/kubernetes/external-clusters", c.apiURL)
	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(reqBody))
	if err != nil {
		return nil, fmt.Errorf("error creating request: %v", err)
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("X-API-Key", c.apiToken)

	// Send the request
	fmt.Println("Sending request to CAST AI API...")
	resp, err := c.client.Do(httpReq)
	if err != nil {
		return nil, fmt.Errorf("error sending request: %v", err)
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %v", err)
	}

	// Check the response status
	fmt.Printf("Response status: %s\n", resp.Status)
	fmt.Printf("Response body: %s\n", string(body))

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("error from API: %s - %s", resp.Status, string(body))
	}

	// Parse the response
	var result gkeClusterRegistrationResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("error parsing response: %v", err)
	}

	return &result, nil
}

// Create a cluster token
func (c *castaiClient) createClusterToken(ctx context.Context, clusterID string) (string, error) {
	fmt.Println("\n\n==== CREATING CLUSTER TOKEN ====\n")
	fmt.Printf("Cluster ID: %s\n", clusterID)

	// Create the HTTP request
	url := fmt.Sprintf("%s/v1/kubernetes/clusters/%s/token", c.apiURL, clusterID)
	httpReq, err := http.NewRequestWithContext(ctx, "POST", url, nil)
	if err != nil {
		return "", fmt.Errorf("error creating request: %v", err)
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("X-API-Key", c.apiToken)

	// Send the request
	fmt.Println("Sending request to CAST AI API...")
	resp, err := c.client.Do(httpReq)
	if err != nil {
		return "", fmt.Errorf("error sending request: %v", err)
	}
	defer resp.Body.Close()

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response body: %v", err)
	}

	// Check the response status
	fmt.Printf("Response status: %s\n", resp.Status)
	fmt.Printf("Response body: %s\n", string(body))

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return "", fmt.Errorf("error from API: %s - %s", resp.Status, string(body))
	}

	// Parse the response
	var result clusterTokenResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return "", fmt.Errorf("error parsing response: %v", err)
	}

	if result.Token == nil {
		return "", fmt.Errorf("token is nil in response")
	}

	return *result.Token, nil
}

// resourceGKEClusterCreate implements the Create operation for GKE clusters
func resourceGKEClusterCreate(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	// Create a debug log file with a fixed name for easier tracking
	f, err := os.Create("/tmp/castai-gke-create-real.log")
	if err == nil {
		defer f.Close()
		f.WriteString("REAL GKE Cluster Create function called\n")
		f.WriteString(fmt.Sprintf("Name: %s\n", d.Get("name").(string)))
		f.WriteString(fmt.Sprintf("Project ID: %s\n", d.Get("project_id").(string)))
		f.WriteString(fmt.Sprintf("Location: %s\n", d.Get("location").(string)))
		f.WriteString(fmt.Sprintf("API Token: %s\n", os.Getenv("CASTAI_API_TOKEN")[:10] + "..."))
		f.WriteString(fmt.Sprintf("API URL: %s\n", os.Getenv("CASTAI_API_URL")))
	}

	// Print debug information to confirm this function is being called
	fmt.Println("\n\n==== REAL GKE CLUSTER CREATE FUNCTION CALLED ====\n")

	// Get the resource configuration
	name := d.Get("name").(string)
	projectID := d.Get("project_id").(string)
	location := d.Get("location").(string)

	// Get optional parameters
	var credentialsJSON string
	if v, ok := d.GetOk("credentials_json"); ok {
		credentialsJSON = v.(string)
	}

	var deleteNodesOnDisconnect bool
	if v, ok := d.GetOk("delete_nodes_on_disconnect"); ok {
		deleteNodesOnDisconnect = v.(bool)
	}

	// Get the provider configuration
	config, ok := m.(map[string]interface{})
	if !ok {
		// If the configuration is not available, use default values
		fmt.Println("WARNING: Provider configuration not available, using default values")
		config = map[string]interface{}{
			"api_url":   "https://api.cast.ai",
			"api_token": "dummy-token",
		}
	}

	apiURL, ok := config["api_url"].(string)
	if !ok {
		apiURL = "https://api.cast.ai"
	}
	fmt.Printf("Using API URL: %s\n", apiURL)

	apiToken, ok := config["api_token"].(string)
	if !ok {
		apiToken = "dummy-token"
	}
	fmt.Printf("API Token length: %d\n", len(apiToken))

	// Create a CAST AI API client
	fmt.Println("Creating CAST AI API client...")
	client := newCastaiClient(apiURL, apiToken)

	// Determine the region from the location
	region := location
	if len(strings.Split(location, "-")) > 2 {
		// If location is a zone like "us-central1-a", extract the region "us-central1"
		regionParts := strings.Split(location, "-")
		regionParts = regionParts[:2]
		region = strings.Join(regionParts, "-")
	}

	// Register the GKE cluster with CAST AI
	fmt.Printf("Registering GKE cluster with CAST AI: project=%s, region=%s, name=%s\n", projectID, region, name)
	fmt.Printf("Credentials JSON length: %d\n", len(credentialsJSON))
	fmt.Printf("Delete nodes on disconnect: %v\n", deleteNodesOnDisconnect)

	resp, err := client.registerGKECluster(ctx, gkeClusterRegistrationRequest{
		Gke: &gkeClusterParams{
			ProjectId:   toPtr(projectID),
			Region:      toPtr(region),
			Location:    toPtr(location),
			ClusterName: toPtr(name),
			Credentials: toPtr(credentialsJSON),
		},
		DeleteNodesOnDisconnect: deleteNodesOnDisconnect,
	})
	if err != nil {
		fmt.Printf("Error registering GKE cluster: %v\n", err)
		return diag.FromErr(fmt.Errorf("error registering GKE cluster: %v", err))
	}

	fmt.Println("GKE cluster registered successfully!")

	if resp.Id == nil {
		return diag.FromErr(fmt.Errorf("cluster ID is nil in response"))
	}

	// Create a cluster token
	token, err := client.createClusterToken(ctx, *resp.Id)
	if err != nil {
		return diag.FromErr(fmt.Errorf("error creating cluster token: %v", err))
	}

	// Set the resource ID
	d.SetId(*resp.Id)

	// Set the computed values
	if resp.CredentialsId != nil {
		if err := d.Set("credentials_id", *resp.CredentialsId); err != nil {
			return diag.FromErr(fmt.Errorf("error setting credentials ID: %v", err))
		}
	}

	if err := d.Set("cluster_token", token); err != nil {
		return diag.FromErr(fmt.Errorf("error setting cluster token: %v", err))
	}

	// Check if we should install the CAST AI agent
	installAgent := true
	if v, ok := d.GetOk("install_agent"); ok {
		installAgent = v.(bool)
	}

	if installAgent {
		// Get the agent mode
		agentMode := "full-access"
		if v, ok := d.GetOk("agent_mode"); ok {
			agentMode = v.(string)
		}

		// Install the CAST AI agent
		fmt.Println("Installing CAST AI agent...")
		if err := installCastaiAgent(*resp.Id, apiToken, apiURL, agentMode); err != nil {
			// Log the error but don't fail the resource creation
			fmt.Printf("WARNING: Failed to install CAST AI agent: %v\n", err)
			fmt.Println("You will need to install the CAST AI agent manually.")
		} else {
			fmt.Println("CAST AI agent installed successfully.")
		}
	}

	return resourceGKEClusterRead(ctx, d, m)
}

// resourceGKEClusterRead implements the Read operation for GKE clusters
func resourceGKEClusterRead(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	// Print debug information to confirm this function is being called
	fmt.Println("\n\n==== REAL GKE CLUSTER READ FUNCTION CALLED ====\n")
	fmt.Printf("Resource ID: %s\n", d.Id())

	// If the ID is empty, there's nothing to read
	if d.Id() == "" {
		return nil
	}

	// Get the provider configuration
	config, ok := m.(map[string]interface{})
	if !ok {
		// If the configuration is not available, use default values
		fmt.Println("WARNING: Provider configuration not available, using default values")
		config = map[string]interface{}{
			"api_url":   "https://api.cast.ai",
			"api_token": "dummy-token",
		}
	}

	apiURL, ok := config["api_url"].(string)
	if !ok {
		apiURL = "https://api.cast.ai"
	}

	apiToken, ok := config["api_token"].(string)
	if !ok {
		apiToken = "dummy-token"
	}

	// Create a CAST AI API client
	client := newCastaiClient(apiURL, apiToken)

	// Create the HTTP request to get the cluster
	url := fmt.Sprintf("%s/v1/kubernetes/clusters/%s", apiURL, d.Id())
	httpReq, err := http.NewRequestWithContext(ctx, "GET", url, nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("error creating request: %v", err))
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("X-API-Key", apiToken)

	// Send the request
	fmt.Println("Sending request to CAST AI API...")
	resp, err := client.client.Do(httpReq)
	if err != nil {
		return diag.FromErr(fmt.Errorf("error sending request: %v", err))
	}
	defer resp.Body.Close()

	// If the cluster doesn't exist, remove it from state
	if resp.StatusCode == http.StatusNotFound {
		d.SetId("")
		return nil
	}

	// Check for other errors
	if resp.StatusCode != http.StatusOK {
		body, _ := ioutil.ReadAll(resp.Body)
		return diag.FromErr(fmt.Errorf("error from API: %s - %s", resp.Status, string(body)))
	}

	// Read the response body
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return diag.FromErr(fmt.Errorf("error reading response body: %v", err))
	}

	// Parse the response
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		return diag.FromErr(fmt.Errorf("error parsing response: %v", err))
	}

	// Set the computed values
	if credentialsID, ok := result["credentialsId"].(string); ok {
		if err := d.Set("credentials_id", credentialsID); err != nil {
			return diag.FromErr(fmt.Errorf("error setting credentials ID: %v", err))
		}
	}

	return nil
}

// resourceGKEClusterUpdate implements the Update operation for GKE clusters
func resourceGKEClusterUpdate(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	// Print debug information to confirm this function is being called
	fmt.Println("\n\n==== REAL GKE CLUSTER UPDATE FUNCTION CALLED ====\n")
	fmt.Printf("Resource ID: %s\n", d.Id())

	// Only deleteNodesOnDisconnect can be updated
	if d.HasChange("delete_nodes_on_disconnect") {
		// Get the provider configuration
		config, ok := m.(map[string]interface{})
		if !ok {
			// If the configuration is not available, use default values
			fmt.Println("WARNING: Provider configuration not available, using default values")
			config = map[string]interface{}{
				"api_url":   "https://api.cast.ai",
				"api_token": "dummy-token",
			}
		}

		apiURL, ok := config["api_url"].(string)
		if !ok {
			apiURL = "https://api.cast.ai"
		}

		apiToken, ok := config["api_token"].(string)
		if !ok {
			apiToken = "dummy-token"
		}

		// Create a CAST AI API client
		client := newCastaiClient(apiURL, apiToken)

		// Get the new value
		deleteNodesOnDisconnect := d.Get("delete_nodes_on_disconnect").(bool)

		// Create the request body
		reqBody, err := json.Marshal(map[string]interface{}{
			"deleteNodesOnDisconnect": deleteNodesOnDisconnect,
		})
		if err != nil {
			return diag.FromErr(fmt.Errorf("error marshaling request: %v", err))
		}

		// Create the HTTP request
		url := fmt.Sprintf("%s/v1/kubernetes/clusters/%s", apiURL, d.Id())
		httpReq, err := http.NewRequestWithContext(ctx, "PATCH", url, bytes.NewBuffer(reqBody))
		if err != nil {
			return diag.FromErr(fmt.Errorf("error creating request: %v", err))
		}

		// Set headers
		httpReq.Header.Set("Content-Type", "application/json")
		httpReq.Header.Set("X-API-Key", apiToken)

		// Send the request
		fmt.Println("Sending request to CAST AI API...")
		resp, err := client.client.Do(httpReq)
		if err != nil {
			return diag.FromErr(fmt.Errorf("error sending request: %v", err))
		}
		defer resp.Body.Close()

		// Check the response status
		if resp.StatusCode != http.StatusOK {
			body, _ := ioutil.ReadAll(resp.Body)
			return diag.FromErr(fmt.Errorf("error from API: %s - %s", resp.Status, string(body)))
		}
	}

	return resourceGKEClusterRead(ctx, d, m)
}

// resourceGKEClusterDelete implements the Delete operation for GKE clusters
func resourceGKEClusterDelete(ctx context.Context, d *schema.ResourceData, m interface{}) diag.Diagnostics {
	// Print debug information to confirm this function is being called
	fmt.Println("\n\n==== REAL GKE CLUSTER DELETE FUNCTION CALLED ====\n")
	fmt.Printf("Resource ID: %s\n", d.Id())

	// Get the provider configuration
	config, ok := m.(map[string]interface{})
	if !ok {
		// If the configuration is not available, use default values
		fmt.Println("WARNING: Provider configuration not available, using default values")
		config = map[string]interface{}{
			"api_url":   "https://api.cast.ai",
			"api_token": "dummy-token",
		}
	}

	apiURL, ok := config["api_url"].(string)
	if !ok {
		apiURL = "https://api.cast.ai"
	}

	apiToken, ok := config["api_token"].(string)
	if !ok {
		apiToken = "dummy-token"
	}

	// Create a CAST AI API client
	client := newCastaiClient(apiURL, apiToken)

	// Create the HTTP request
	url := fmt.Sprintf("%s/v1/kubernetes/clusters/%s", apiURL, d.Id())
	httpReq, err := http.NewRequestWithContext(ctx, "DELETE", url, nil)
	if err != nil {
		return diag.FromErr(fmt.Errorf("error creating request: %v", err))
	}

	// Set headers
	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("X-API-Key", apiToken)

	// Send the request
	fmt.Println("Sending request to CAST AI API...")
	resp, err := client.client.Do(httpReq)
	if err != nil {
		return diag.FromErr(fmt.Errorf("error sending request: %v", err))
	}
	defer resp.Body.Close()

	// Check the response status
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusAccepted {
		body, _ := ioutil.ReadAll(resp.Body)
		return diag.FromErr(fmt.Errorf("error from API: %s - %s", resp.Status, string(body)))
	}

	// Set the ID to empty to indicate deletion
	d.SetId("")

	return nil
}
