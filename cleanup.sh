#!/bin/bash

echo "Starting cleanup process..."

# Clean up existing files
echo "Cleaning up node_modules and build files..."
rm -rf node_modules
rm -rf projects/transaction-ticker/node_modules
rm -rf projects/transaction-ticker/build
rm -f package-lock.json
rm -f projects/transaction-ticker/package-lock.json
npm cache clean --force

# Create necessary configuration files
echo "Creating configuration files..."

# Create .nvmrc
echo "18.19.0" > .nvmrc

# Create .npmrc
cat > .npmrc << EOL
save-exact=true
legacy-peer-deps=true
engine-strict=true
EOL

# Navigate to project directory and install
echo "Installing dependencies..."
cd projects/transaction-ticker
npm install --legacy-peer-deps

echo "Running build test..."
npm run build

echo "Cleanup process complete!"
