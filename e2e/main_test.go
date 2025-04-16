package e2e

import (
	"log"
	"os"
	"testing"

	"github.com/joho/godotenv"

	"github.com/castai/pulumi-castai/e2e/config"
)

var (
	cfg *config.Config
)

func TestMain(m *testing.M) {
	// Load config from the repository root .env file
	var err error
	
	// First try the symlinked .env file in the e2e directory
	err = godotenv.Load()
	if err != nil {
		// Then try the root .env file
		err = godotenv.Load("../.env")
		if err != nil {
			log.Println("unable to load dotfile from e2e or root directory:", err)
		}
	}
	
	cfg, err = config.Load()
	if err != nil {
		log.Fatalf("loading config: %v", err)
	}

	// Run all tests.
	code := m.Run()

	os.Exit(code)
}
