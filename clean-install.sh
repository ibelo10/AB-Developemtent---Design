#!/bin/bash

echo "Cleaning npm cache and node_modules..."
rm -rf node_modules
rm -rf projects/transaction-ticker/node_modules
rm -rf projects/transaction-ticker/build
rm -f package-lock.json
rm -f projects/transaction-ticker/package-lock.json
npm cache clean --force

echo "Installing dependencies..."
cd projects/transaction-ticker
npm install

echo "Verifying installation..."
npm ls

echo "Running build test..."
npm run build

echo "Installation complete. Check above for any remaining warnings."