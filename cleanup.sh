#!/bin/bash

# Clean up existing files
echo "Cleaning up..."
rm -rf node_modules
rm -rf projects/transaction-ticker/node_modules
rm -rf projects/transaction-ticker/build
rm -f package-lock.json
rm -f projects/transaction-ticker/package-lock.json

# Ensure correct Node version
echo "Setting up Node version..."
if command -v nvm &> /dev/null; then
    nvm install 18.19.0
    nvm use 18.19.0
fi

# Install dependencies
echo "Installing dependencies..."
cd projects/transaction-ticker
npm install

echo "Build test..."
npm run build

echo "Setup complete!"