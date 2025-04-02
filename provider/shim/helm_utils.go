package shim

import (
	"fmt"
	"os/exec"
	"strings"
)

// installCastaiAgent installs the CAST AI agent using Helm
func installCastaiAgent(clusterID, apiToken, apiURL, agentMode string) error {
	fmt.Printf("Installing CAST AI agent: clusterID=%s, apiURL=%s, agentMode=%s\n", clusterID, apiURL, agentMode)

	// Add the CAST AI Helm repository
	fmt.Println("Adding CAST AI Helm repository...")
	addRepoCmd := exec.Command("helm", "repo", "add", "castai-helm", "https://castai.github.io/helm-charts")
	if output, err := addRepoCmd.CombinedOutput(); err != nil {
		fmt.Printf("Error adding CAST AI Helm repository: %v - %s\n", err, string(output))
		return fmt.Errorf("error adding CAST AI Helm repository: %v - %s", err, string(output))
	}
	fmt.Println("CAST AI Helm repository added successfully.")

	// Update the Helm repositories
	fmt.Println("Updating Helm repositories...")
	updateRepoCmd := exec.Command("helm", "repo", "update")
	if output, err := updateRepoCmd.CombinedOutput(); err != nil {
		fmt.Printf("Error updating Helm repositories: %v - %s\n", err, string(output))
		return fmt.Errorf("error updating Helm repositories: %v - %s", err, string(output))
	}
	fmt.Println("Helm repositories updated successfully.")

	// Prepare the Helm install command
	fmt.Println("Preparing Helm install command...")
	helmArgs := []string{
		"install", "castai-agent", "castai-helm/castai-agent",
		"--namespace", "castai-agent",
		"--create-namespace",
		"--set", fmt.Sprintf("apiKey=%s", apiToken),
		"--set", fmt.Sprintf("apiURL=%s", apiURL),
		"--set", fmt.Sprintf("clusterID=%s", clusterID),
	}

	// Add agent mode configuration
	if agentMode == "read-only" {
		fmt.Println("Configuring agent for read-only mode...")
		helmArgs = append(helmArgs, "--set", "readOnlyMode=true")
	} else {
		fmt.Println("Configuring agent for full-access mode...")
	}

	// Run the Helm install command
	fmt.Println("Installing CAST AI agent...")
	installCmd := exec.Command("helm", helmArgs...)
	if output, err := installCmd.CombinedOutput(); err != nil {
		// Check if the error is because the release already exists
		if strings.Contains(string(output), "cannot re-use a name that is still in use") {
			fmt.Println("CAST AI agent is already installed, upgrading...")

			// Change install to upgrade
			helmArgs[0] = "upgrade"

			// Run the Helm upgrade command
			fmt.Println("Upgrading CAST AI agent...")
			upgradeCmd := exec.Command("helm", helmArgs...)
			if upgradeOutput, upgradeErr := upgradeCmd.CombinedOutput(); upgradeErr != nil {
				fmt.Printf("Error upgrading CAST AI agent: %v - %s\n", upgradeErr, string(upgradeOutput))
				return fmt.Errorf("error upgrading CAST AI agent: %v - %s", upgradeErr, string(upgradeOutput))
			}

			fmt.Println("CAST AI agent upgraded successfully.")
			return nil
		}

		fmt.Printf("Error installing CAST AI agent: %v - %s\n", err, string(output))
		return fmt.Errorf("error installing CAST AI agent: %v - %s", err, string(output))
	}

	fmt.Println("CAST AI agent installed successfully.")
	return nil
}
