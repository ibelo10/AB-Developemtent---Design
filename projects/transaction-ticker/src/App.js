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
