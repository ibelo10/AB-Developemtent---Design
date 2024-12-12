#!/bin/bash

echo "Starting cleanup process..."

# Clean up existing files
echo "Cleaning up node_modules and build files..."
rm -rf node_modules
rm -rf projects/transaction-ticker/node_modules
rm -rf projects/transaction-ticker/build
rm -f package-lock.json
rm -f projects/transaction-ticker/package-lock.json

# Create project structure
echo "Creating project structure..."
mkdir -p projects/transaction-ticker/src
mkdir -p projects/transaction-ticker/public

# Create necessary files
echo "Creating configuration files..."
echo "18.19.0" > .nvmrc

# Navigate to project directory and install
echo "Installing dependencies..."
cd projects/transaction-ticker
npm install --legacy-peer-deps

echo "Testing build..."
npm run build

echo "Cleanup process complete!"