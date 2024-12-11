#!/bin/bash

# Navigate to functions directory
cd RN/netlify/functions

# Initialize package.json for functions
echo "Initializing package.json for functions..."
cat > package.json << 'EOL'
{
  "name": "netlify-functions",
  "version": "1.0.0",
  "dependencies": {
    "node-fetch": "^2.6.9"
  }
}
EOL

# Install dependencies for functions
npm install

# Go back to root
cd ../../

# Verify netlify.toml
echo "Verifying netlify.toml..."
cat > netlify.toml << 'EOL'
[build]
  functions = "netlify/functions"
  publish = "public"

[dev]
  functions = "netlify/functions"
  publish = "public"
EOL

echo "✅ Fix complete! Now try:"
echo "1. netlify dev"
echo "2. If that doesn't work, try: netlify dev --live"