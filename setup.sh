#!/bin/bash

# Create main project directory and navigate into it
echo "🚀 Creating project structure..."
mkdir -p RN/{public,netlify/functions}
cd RN

# Create netlify.toml
echo "Creating netlify.toml..."
cat > netlify.toml << 'EOL'
[build]
  functions = "netlify/functions"
  publish = "public"

[dev]
  functions = "netlify/functions"
  publish = "public"
EOL

# Create public/index.html
echo "Creating index.html..."
cat > public/index.html << 'EOL'
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

# Create public/styles.css
echo "Creating styles.css..."
cat > public/styles.css << 'EOL'
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

# Create public/app.js
echo "Creating app.js..."
cat > public/app.js << 'EOL'
async function fetchSalesTotal() {
    try {
        const response = await fetch('/.netlify/functions/fetch-sales');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        const totalSales = `$${(data.total_sales / 100).toFixed(2)}`;
        document.getElementById('sales-total').textContent = totalSales;
        document.getElementById('update-time').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        console.error('Error fetching sales total:', error);
        document.getElementById('sales-total').textContent = 'Error';
    }
}

// Fetch initially and then every minute
fetchSalesTotal();
setInterval(fetchSalesTotal, 60000);
EOL

# Create netlify/functions/fetch-sales.js
echo "Creating fetch-sales.js..."
cat > netlify/functions/fetch-sales.js << 'EOL'
const fetch = require('node-fetch');

exports.handler = async () => {
    const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
    const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
    const BASE_URL = 'https://connect.squareup.com/v2';
    const TODAY = new Date().toISOString().split('T')[0];

    if (!ACCESS_TOKEN || !LOCATION_ID) {
        return {
            statusCode: 500,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: "Missing required configuration" })
        };
    }

    try {
        const response = await fetch(`${BASE_URL}/payments?location_id=${LOCATION_ID}&begin_time=${TODAY}`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'Square-Version': '2024-01-17',
            },
        });

        if (!response.ok) {
            throw new Error(`Square API error: ${response.statusText}`);
        }

        const data = await response.json();
        const totalSales = data.payments?.reduce((sum, payment) => {
            return sum + (payment.approved_money?.amount || 0);
        }, 0) || 0;

        return {
            statusCode: 200,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ total_sales: totalSales })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: "Failed to fetch sales data" })
        };
    }
};
EOL

# Create .env file and prompt for credentials
echo "Creating .env file..."
echo "Enter your Square Access Token:"
read -r access_token
echo "Enter your Square Location ID:"
read -r location_id

cat > .env << EOL
SQUARE_ACCESS_TOKEN=${access_token}
SQUARE_LOCATION_ID=${location_id}
EOL

# Create .gitignore
echo "Creating .gitignore..."
cat > .gitignore << 'EOL'
node_modules
.env
.netlify
dist
.DS_Store
EOL

# Initialize package.json
echo "Initializing package.json..."
cat > package.json << 'EOL'
{
  "name": "sales-stream",
  "version": "1.0.0",
  "description": "Live Sales Stream Display",
  "main": "index.js",
  "scripts": {
    "start": "netlify dev"
  },
  "dependencies": {
    "node-fetch": "^2.6.1"
  }
}
EOL

# Install dependencies
echo "Installing dependencies..."
npm install

echo "✅ Setup complete! To start the development server:"
echo "1. cd RN"
echo "2. npm install -g netlify-cli"
echo "3. netlify login"
echo "4. netlify dev"
echo ""
echo "Make sure you have installed the Netlify CLI globally with 'npm install -g netlify-cli'"

chmod +x setup.sh