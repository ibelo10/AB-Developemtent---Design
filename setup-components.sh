#!/bin/bash

# Create necessary directories
mkdir -p src/components/Ticker
mkdir -p src/components/Widgets
mkdir -p src/components/VideoBackground
mkdir -p src/services
mkdir -p src/hooks
mkdir -p src/utils

# Create component files
cat > src/components/Ticker/TransactionTicker.jsx << 'EOF'
import React, { useEffect, useState } from 'react';
import './TransactionTicker.css';

const TransactionTicker = ({ transactions }) => {
  return (
    <div className="ticker-container">
      <div className="ticker-wrapper">
        {transactions.map((transaction, index) => (
          <div key={index} className="ticker-item">
            <span className="time">{new Date(transaction.created_at).toLocaleTimeString()}</span>
            <span className="amount">${transaction.amount / 100}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTicker;
EOF

cat > src/components/Ticker/TransactionTicker.css << 'EOF'
.ticker-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 10px;
  z-index: 1000;
}

.ticker-wrapper {
  display: flex;
  overflow: hidden;
  white-space: nowrap;
  animation: ticker 30s linear infinite;
}

.ticker-item {
  display: inline-flex;
  padding: 0 20px;
  align-items: center;
}

.ticker-item .time {
  margin-right: 10px;
  color: #888;
}

.ticker-item .amount {
  color: #00ff00;
  font-weight: bold;
}

@keyframes ticker {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
EOF

cat > src/components/Widgets/MetricsWidget.jsx << 'EOF'
import React from 'react';
import './MetricsWidget.css';

const MetricsWidget = ({ daily, weekly, monthly }) => {
  return (
    <div className="metrics-container">
      <div className="metric-card">
        <h3>Daily</h3>
        <p>${daily}</p>
      </div>
      <div className="metric-card">
        <h3>Weekly</h3>
        <p>${weekly}</p>
      </div>
      <div className="metric-card">
        <h3>Monthly</h3>
        <p>${monthly}</p>
      </div>
    </div>
  );
};

export default MetricsWidget;
EOF

cat > src/components/Widgets/MetricsWidget.css << 'EOF'
.metrics-container {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 20px;
  z-index: 1000;
}

.metric-card {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 10px;
  min-width: 120px;
  text-align: center;
}

.metric-card h3 {
  margin: 0;
  color: #888;
}

.metric-card p {
  margin: 10px 0 0;
  font-size: 1.5em;
  color: #00ff00;
}
EOF

cat > src/components/VideoBackground/VideoBackground.jsx << 'EOF'
import React, { useEffect, useState } from 'react';
import './VideoBackground.css';

const VideoBackground = () => {
  const [videoId, setVideoId] = useState('');
  
  useEffect(() => {
    // TODO: Implement YouTube API integration to get channel videos
    // This is a placeholder for the video ID
    setVideoId('PLACEHOLDER_VIDEO_ID');
  }, []);

  return (
    <div className="video-background">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoBackground;
EOF

cat > src/components/VideoBackground/VideoBackground.css << 'EOF'
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.video-background iframe {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
}
EOF

# Create service for Square API integration
cat > src/services/squareService.js << 'EOF'
const BASE_URL = 'https://connect.squareup.com/v2';
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN';

export const fetchTransactions = async () => {
  const response = await fetch(`${BASE_URL}/payments`, {
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
};

export const calculateMetrics = (transactions) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString();

  const daily = transactions
    .filter(t => t.created_at.startsWith(today))
    .reduce((sum, t) => sum + t.amount / 100, 0);

  const weekly = transactions
    .filter(t => t.created_at >= weekAgo)
    .reduce((sum, t) => sum + t.amount / 100, 0);

  const monthly = transactions
    .filter(t => t.created_at >= monthAgo)
    .reduce((sum, t) => sum + t.amount / 100, 0);

  return { daily, weekly, monthly };
};
EOF

# Create YouTube service
cat > src/services/youtubeService.js << 'EOF'
const CHANNEL_ID = 'YOUR_CHANNEL_ID';
const API_KEY = 'YOUR_YOUTUBE_API_KEY';

export const fetchChannelVideos = async () => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50`
  );
  return response.json();
};
EOF

# Update App.jsx
cat > src/App.jsx << 'EOF'
import React, { useEffect, useState } from 'react';
import VideoBackground from './components/VideoBackground/VideoBackground';
import TransactionTicker from './components/Ticker/TransactionTicker';
import MetricsWidget from './components/Widgets/MetricsWidget';
import { fetchTransactions, calculateMetrics } from './services/squareService';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState({ daily: 0, weekly: 0, monthly: 0 });

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchTransactions();
      setTransactions(data.payments || []);
      setMetrics(calculateMetrics(data.payments || []));
    };

    loadData();
    const interval = setInterval(loadData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <VideoBackground />
      <MetricsWidget {...metrics} />
      <TransactionTicker transactions={transactions} />
    </div>
  );
}

export default App;
EOF

# Update App.css
cat > src/App.css << 'EOF'
.app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
EOF

# Install necessary dependencies
npm install axios @youtube/iframe-api

echo "Component setup complete! Please update the following:"
echo "1. Add your Square API access token in src/services/squareService.js"
echo "2. Add your YouTube API key and channel ID in src/services/youtubeService.js"
echo "3. Run 'npm install' to install dependencies"
echo "4. Start the development server with 'npm run dev'"