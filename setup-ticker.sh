#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Transaction Ticker...${NC}"

# Create directory structure
mkdir -p projects/transaction-ticker/public projects/transaction-ticker/src

# Create package.json
echo -e "${GREEN}Creating package.json...${NC}"
cat > projects/transaction-ticker/package.json << 'EOL'
{
  "name": "transaction-ticker",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
EOL

# Create public/index.html
echo -e "${GREEN}Creating index.html...${NC}"
cat > projects/transaction-ticker/public/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Live Transaction Ticker" />
    <title>Transaction Ticker</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
EOL

# Create src/App.js
echo -e "${GREEN}Creating App.js...${NC}"
cat > projects/transaction-ticker/src/App.js << 'EOL'
import React, { useState, useEffect } from 'react';
import './styles.css';

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Sample data for testing
        const sampleData = [
          { id: 1, amount: 150.00, created_at: new Date().toISOString() },
          { id: 2, amount: 75.50, created_at: new Date().toISOString() },
          { id: 3, amount: 200.00, created_at: new Date().toISOString() }
        ];
        setTransactions(sampleData);
        
        // Uncomment for real API usage
        /*
        const response = await fetch('https://connect.squareup.com/v2/payments', {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_SQUARE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        setTransactions(data.payments || []);
        */
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 300000);
    return () => clearInterval(interval);
  }, []);

  const formatTransaction = (transaction) => {
    const amount = transaction.amount.toFixed(2);
    const date = new Date(transaction.created_at).toLocaleTimeString();
    return `💰 $${amount} at ${date}`;
  };

  return (
    <div className="ticker-container">
      <div className="ticker-content">
        <span className="transaction-item header-text">
          LATEST TRANSACTIONS:
        </span>
        {transactions.map(transaction => (
          <span key={transaction.id} className="transaction-item">
            {formatTransaction(transaction)}
          </span>
        ))}
      </div>
    </div>
  );
}

export default App;
EOL

# Create src/index.js
echo -e "${GREEN}Creating index.js...${NC}"
cat > projects/transaction-ticker/src/index.js << 'EOL'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOL

# Create src/styles.css
echo -e "${GREEN}Creating styles.css...${NC}"
cat > projects/transaction-ticker/src/styles.css << 'EOL'
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: transparent;
}

.ticker-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  overflow: hidden;
  height: 48px;
}

.ticker-content {
  white-space: nowrap;
  display: inline-block;
  animation: ticker 30s linear infinite;
  padding: 14px 0;
}

@keyframes ticker {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}

.transaction-item {
  display: inline-block;
  margin-right: 32px;
  font-size: 18px;
}

.header-text {
  color: #FCD34D;
  font-weight: bold;
}
EOL

# Update or create netlify.toml
echo -e "${GREEN}Updating netlify.toml...${NC}"
cat > netlify.toml << 'EOL'
[[headers]]
  for = "/*"
  [headers.values]
    Content-Security-Policy = """
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      connect-src 'self' connect.squareup.com;
    """

[build]
  command = "cd projects/transaction-ticker && npm install && npm run build"
  publish = "projects/transaction-ticker/build"

[[redirects]]
  from = "/projects/transaction-ticker/*"
  to = "/projects/transaction-ticker/index.html"
  status = 200
EOL

# Create or update .gitignore
echo -e "${GREEN}Updating .gitignore...${NC}"
cat > .gitignore << 'EOL'
# Dependencies
node_modules/

# Build output
dist/
build/

# Environment files
.env
.env.local
.env.development
.env.test
.env.production

# Editor directories
.vscode/
.idea/
*.sublime-*

# System files
.DS_Store
Thumbs.db
*.log

# Local Netlify folder
.netlify

# Cache directories
.cache/
.parcel-cache/

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Coverage directory
coverage/
EOL

# Make the script executable
chmod +x setup-ticker.sh

echo -e "${BLUE}Setup complete!${NC}"
echo -e "${GREEN}Next steps:${NC}"
echo "1. Create .env file with your Square API token:"
echo "REACT_APP_SQUARE_ACCESS_TOKEN=your_token_here"
echo "2. Install dependencies: cd projects/transaction-ticker && npm install"
echo "3. Test locally: npm start"
echo "4. Commit and push to GitHub"
echo "5. Configure environment variable in Netlify dashboard"
EOL

chmod +x setup-ticker.sh

Save this script as `setup-ticker.sh` in your repository root. To use it:

1. Make it executable:
```bash
chmod +x setup-ticker.sh
```

2. Run it:
```bash
./setup-ticker.sh
```

3. After running:
```bash
cd projects/transaction-ticker
npm install
npm start  # to test locally
```

4. Create `.env` file:
```bash
echo "REACT_APP_SQUARE_ACCESS_TOKEN=your_token_here" > projects/transaction-ticker/.env
```

5. Commit and push:
```bash
git add .
git commit -m "Add transaction ticker feature"
git push origin main
```

The script:
- Creates all necessary directories and files
- Sets up React project structure
- Configures Netlify deployment
- Updates .gitignore
- Provides next steps

Would you like me to:
1. Add more configuration options to the script?
2. Include additional setup steps?
3. Add error handling to the script?
4. Include cleanup functionality?