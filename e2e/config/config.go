package config

import (
	"fmt"
	"os"
)

type Config struct {
	Token  string
	APIURL string
}

func Load() (*Config, error) {
	token := os.Getenv("CASTAI_API_TOKEN")
	if token == "" {
		return nil, fmt.Errorf("CASTAI_API_TOKEN environment variable is required")
	}

	apiURL := os.Getenv("CASTAI_API_URL")
	if apiURL == "" {
		apiURL = "https://api.cast.ai"
	}

	return &Config{
		Token:  token,
		APIURL: apiURL,
	}, nil
}
