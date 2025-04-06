#!/usr/bin/env bash
echo "Installing system dependencies..."
# Install Python dependencies
echo "Installing Python dependencies..."
python -m pip install --upgrade pip
python -m pip install build twine pytest pytest-cov mypy ruff black
# Install Node.js dependencies
echo "Installing Node.js dependencies..."
npm install -g typescript @types/node
# Install Go dependencies
echo "Installing Go dependencies..."
# Clean any existing Go installation
sudo rm -rf /usr/local/go
rm -rf ~/go
rm -rf ~/.cache/go-build
# Download and install Go 1.22 (latest stable version)
echo "Installing Go 1.22.3 (latest stable)..."
wget https://go.dev/dl/go1.22.3.linux-arm64.tar.gz
sudo tar -C /usr/local -xzf go1.22.3.linux-arm64.tar.gz
rm go1.22.3.linux-arm64.tar.gz
# Set up Go environment
echo "Setting up Go environment..."
mkdir -p ~/go/{bin,src,pkg}
echo "export GOPATH=$HOME/go" > ~/.go-env
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> ~/.go-env
# Source the environment file
. ~/.go-env
# Explicitly add Go to PATH for this shell session
export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin
# Verify Go installation
/usr/local/go/bin/go version
# Install Go tools with specific versions that don't require Go 1.23
echo "Installing Go tools..."
/usr/local/go/bin/go install golang.org/x/tools/cmd/goimports@v0.15.0
/usr/local/go/bin/go install github.com/golangci/golangci-lint/cmd/golangci-lint@v1.55.2
# Fix any go.mod files that require Go 1.23 (which doesn't exist yet)
echo "Fixing any go.mod files that require Go 1.23..."
find . -name "go.mod" -exec sed -i 's/go 1.23/go 1.22/g' {} \;
# Check if Pulumi is installed, if not install it
if ! command -v pulumi &> /dev/null; then
    echo "Installing Pulumi..."
    curl -fsSL https://get.pulumi.com | sh
    export PATH=$PATH:$HOME/.pulumi/bin
    echo 'export PATH=$PATH:$HOME/.pulumi/bin' >> ~/.bashrc
fi

# Install Pulumi dependencies
echo "Installing Pulumi dependencies..."
pulumi plugin ls
pulumi plugin install resource aws
pulumi plugin install resource azure
pulumi plugin install resource gcp