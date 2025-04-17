#!/bin/bash

echo "🧹 Cleaning up all Go installations..."

# Remove Go from common locations
echo "Removing Go from common installation locations..."
sudo rm -rf /usr/local/go
sudo rm -rf /usr/lib/golang
sudo rm -rf /usr/bin/go
sudo rm -rf /usr/bin/gofmt
sudo rm -rf /usr/share/go

# Remove user-specific Go directories
echo "Removing user-specific Go directories..."
rm -rf ~/go
rm -rf ~/golang
rm -rf ~/.go
rm -rf ~/.cache/go-build

# Clean up PATH in .bashrc and .profile
echo "Cleaning Go references from shell profile files..."
if [ -f ~/.bashrc ]; then
    # Remove Go path entries
    sed -i '/export.*GOPATH/d' ~/.bashrc
    sed -i '/export.*\/go\/bin/d' ~/.bashrc
    sed -i '/export.*\/usr\/local\/go/d' ~/.bashrc
fi

if [ -f ~/.profile ]; then
    sed -i '/export.*GOPATH/d' ~/.profile
    sed -i '/export.*\/go\/bin/d' ~/.profile
    sed -i '/export.*\/usr\/local\/go/d' ~/.profile
fi

if [ -f ~/.bash_profile ]; then
    sed -i '/export.*GOPATH/d' ~/.bash_profile
    sed -i '/export.*\/go\/bin/d' ~/.bash_profile
    sed -i '/export.*\/usr\/local\/go/d' ~/.bash_profile
fi

# Clean up environment variables for current session
unset GOPATH
unset GOROOT

echo "✅ Go has been completely removed from your system."
echo "You can now run 'just dev' to install a fresh Go version." 