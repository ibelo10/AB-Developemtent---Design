#!/bin/bash

echo "Starting project setup..."

# Create project structure
mkdir -p projects/transaction-ticker/src
mkdir -p projects/transaction-ticker/public

# Create public/index.html
cat > projects/transaction-ticker/public/index.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Transaction Ticker" />
    <title>Transaction Ticker</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
EOL

# Create package.json
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
  "devDependencies": {
    "@babel/plugin-proposal-private-property-in-object": "^7.21.11"
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

# Create src/index.js
cat > projects/transaction-ticker/src/index.js << 'EOL'
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOL

# Create src/index.css
cat > projects/transaction-ticker/src/index.css << 'EOL'
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
EOL

# Create src/App.js
cat > projects/transaction-ticker/src/App.js << 'EOL'
import React from 'react';
import './App.css';

function App() {
  const transactions = [
    { id: 1, amount: 150.00, created_at: new Date().toISOString() },
    { id: 2, amount: 75.50, created_at: new Date().toISOString() },
    { id: 3, amount: 200.00, created_at: new Date().toISOString() }
  ];

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

# Create src/App.css
cat > projects/transaction-ticker/src/App.css << 'EOL'
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

echo "Installing dependencies..."
cd projects/transaction-ticker
npm install

echo "Building project..."
npm run build

echo "Project setup complete!"