#!/bin/bash

# Text styling
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Setting up Sales Dashboard...${NC}"

# Prompt for Square API credentials
echo -e "${BLUE}Enter your Square Access Token:${NC}"
read -r SQUARE_ACCESS_TOKEN
echo -e "${BLUE}Enter your Square Location ID:${NC}"
read -r SQUARE_LOCATION_ID

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p RN/{public,netlify/functions}
cd RN

# Create netlify.toml
echo "📝 Creating netlify.toml..."
cat > netlify.toml << EOL
[build]
  functions = "netlify/functions"
  publish = "public"

[dev]
  functions = "netlify/functions"
  publish = "public"
EOL

# Create package.json for functions
echo "📦 Creating functions package.json..."
cd netlify/functions
cat > package.json << EOL
{
  "name": "netlify-functions",
  "version": "1.0.0",
  "dependencies": {
    "node-fetch": "^2.6.9",
    "dotenv": "^16.0.3",
    "@netlify/functions": "^2.0.0",
    "square": "^25.1.0"
  }
}
EOL

# Install functions dependencies
echo "📚 Installing functions dependencies..."
npm install

# Create fetch-sales.js function
echo "⚡ Creating fetch-sales function..."
cat > fetch-sales.js << EOL
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
    const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
    const BASE_URL = 'https://connect.squareup.com/v2';
    
    // Get today's date in UTC
    const today = new Date();
    today.setHours(0,0,0,0);
    const beginTime = today.toISOString();

    console.log('Environment check:', {
        hasToken: !!ACCESS_TOKEN,
        hasLocation: !!LOCATION_ID,
        beginTime
    });

    if (!ACCESS_TOKEN || !LOCATION_ID) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: "Configuration Error",
                message: "Missing API credentials"
            })
        };
    }

    try {
        const response = await fetch(\`\${BASE_URL}/payments?location_id=\${LOCATION_ID}&begin_time=\${beginTime}\`, {
            headers: {
                'Square-Version': '2024-01-17',
                'Authorization': \`Bearer \${ACCESS_TOKEN}\`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Square API Error:', errorData);
            throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        const totalSales = data.payments?.reduce((sum, payment) => {
            return sum + (payment.amount_money?.amount || 0);
        }, 0) || 0;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                total_sales: totalSales,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: "API Error",
                message: error.message
            })
        };
    }
};
EOL

# Return to root directory
cd ../..

# Create public files
echo "🎨 Creating frontend files..."
cd public

# Create index.html
cat > index.html << EOL
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Sales Stream</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="overlay">
        <div class="title">Daily Sales Total</div>
        <div class="total" id="sales-total">$0.00</div>
        <div class="update-time" id="update-time">Last updated: --</div>
    </div>
    <script src="app.js"></script>
</body>
</html>
EOL

# Create styles.css
cat > styles.css << EOL
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #121212;
    color: #fff;
}

.overlay {
    position: fixed;
    bottom: 0;
    width: 100%;
    background: linear-gradient(90deg, #1e1e1e, #333);
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
    padding: 10px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.overlay .title {
    font-size: 1.2rem;
    font-weight: bold;
}

.overlay .total {
    font-size: 1.5rem;
    font-weight: bold;
    color: #00ff7f;
}

.overlay .update-time {
    font-size: 0.9rem;
    color: #ccc;
}
EOL

# Create app.js
cat > app.js << EOL
async function fetchSalesTotal() {
    try {
        const response = await fetch('/.netlify/functions/fetch-sales');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || \`API error: \${response.statusText}\`);
        }

        if (data.error) {
            throw new Error(data.message || 'Unknown error occurred');
        }

        const totalSales = \`\$\${(data.total_sales / 100).toFixed(2)}\`;
        document.getElementById('sales-total').textContent = totalSales;
        document.getElementById('update-time').textContent = 
            \`Last updated: \${new Date().toLocaleTimeString()}\`;
        
        document.getElementById('sales-total').style.color = '#00ff7f';
        
    } catch (error) {
        console.error('Error fetching sales total:', error);
        document.getElementById('sales-total').textContent = 'Error';
        document.getElementById('sales-total').style.color = '#ff4444';
        document.getElementById('update-time').textContent = 
            \`Error: \${error.message}\`;
    }
}

fetchSalesTotal();
setInterval(fetchSalesTotal, 60000);
EOL

# Return to root directory
cd ..

# Create .env file
echo "🔒 Creating .env file..."
cat > .env << EOL
SQUARE_ACCESS_TOKEN=${SQUARE_ACCESS_TOKEN}
SQUARE_LOCATION_ID=${SQUARE_LOCATION_ID}
EOL

# Create .gitignore
echo "📝 Creating .gitignore..."
cat > .gitignore << EOL
node_modules
.env
.netlify
dist
.DS_Store
EOL

# Setup Netlify environment variables
echo "⚙️ Setting up Netlify environment variables..."
netlify env:set SQUARE_ACCESS_TOKEN "$SQUARE_ACCESS_TOKEN"
netlify env:set SQUARE_LOCATION_ID "$SQUARE_LOCATION_ID"

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod

echo -e "${GREEN}✅ Setup complete!${NC}"
echo -e "${BLUE}Your sales dashboard is now deployed.${NC}"
echo "To view function logs, run: netlify functions:logs"