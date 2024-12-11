#!/bin/bash

echo "🚀 Starting complete setup process..."

# Install Node.js and npm if not present
if ! command -v node &> /dev/null; then
    echo "📦 Node.js not found. Installing Node.js and npm..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install Netlify CLI globally
echo "🌐 Installing Netlify CLI..."
npm install -g netlify-cli

# Create base directory if it doesn't exist
echo "📁 Setting up project structure..."
mkdir -p RN
cd RN

# Create project directory structure
mkdir -p {src,public,netlify/functions}

# Initialize package.json
echo "📦 Initializing package.json..."
npm init -y

# Install dependencies
echo "📚 Installing dependencies..."
npm install react react-dom @netlify/functions node-fetch dotenv \
    date-fns lucide-react \
    @radix-ui/react-slot \
    @radix-ui/react-alert-dialog \
    tailwindcss postcss autoprefixer \
    @types/node @types/react @types/react-dom \
    typescript eslint prettier

# Initialize TypeScript
echo "⚙️ Setting up TypeScript..."
npx tsc --init

# Create environment file
echo "🔒 Creating environment file..."
cat > .env << EOL
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id
EOL

# Create netlify.toml
echo "⚡ Creating Netlify configuration..."
cat > netlify.toml << EOL
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[dev]
  command = "npm run dev"
  functions = "netlify/functions"
  publish = "dist"
EOL

# Create the Square API function
echo "🔄 Creating Square API function..."
cat > netlify/functions/fetch-sales.js << EOL
const fetch = require('node-fetch');

exports.handler = async () => {
  const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
  const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
  const BASE_URL = 'https://connect.squareup.com/v2';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  if (!ACCESS_TOKEN || !LOCATION_ID) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: "Missing configuration" })
    };
  }

  try {
    const response = await fetch(
      \`\${BASE_URL}/payments?location_id=\${LOCATION_ID}&begin_time=\${todayISO}&sort_order=DESC\`,
      {
        headers: {
          'Authorization': \`Bearer \${ACCESS_TOKEN}\`,
          'Content-Type': 'application/json',
          'Square-Version': '2024-01-17'
        }
      }
    );

    if (!response.ok) throw new Error(\`Square API error: \${response.statusText}\`);

    const data = await response.json();
    
    const dailyStats = {
      total_sales: 0,
      transaction_count: 0,
      transactions: []
    };

    if (data.payments) {
      dailyStats.total_sales = data.payments.reduce((sum, payment) => 
        sum + (payment.approved_money?.amount || 0), 0);
      dailyStats.transaction_count = data.payments.length;
      dailyStats.transactions = data.payments.map(payment => ({
        id: payment.id,
        amount: payment.approved_money?.amount || 0,
        time: payment.created_at,
        status: payment.status
      }));
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dailyStats)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
EOL

# Create gitignore
echo "📝 Creating .gitignore..."
cat > .gitignore << EOL
node_modules
.env
.netlify
dist
.DS_Store
EOL

# Initialize Git repository
echo "🔄 Initializing Git repository..."
git init
git add .
git commit -m "Initial commit"

echo "✨ Setup complete! Next steps:"
echo "1. Update .env with your Square API credentials"
echo "2. Run 'npm install' to install dependencies"
echo "3. Run 'netlify login' to authenticate with Netlify"
echo "4. Run 'netlify dev' to start development server"
echo "5. Deploy to Netlify with 'netlify deploy'"

# Make the script executable
chmod +x setup.sh
