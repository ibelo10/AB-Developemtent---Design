// script.js
const TransactionTicker = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('https://connect.squareup.com/v2/payments', {
                    headers: {
                        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    params: {
                        'location_id': 'L1B1NDVKJX5K0',
                        'begin_time': '2024-01-01T00:00:00Z',
                        'end_time': '2024-12-31T23:59:59Z'
                    }
                });
                const data = await response.json();
                setTransactions(data.payments || []);
            } catch (error) {
                console.error('Error fetching transactions:', error);
                // Use sample data if API fails
                setTransactions([
                    { id: 1, amount_money: { amount: 15000, currency: 'USD' }, created_at: new Date().toISOString() },
                    { id: 2, amount_money: { amount: 7550, currency: 'USD' }, created_at: new Date().toISOString() }
                ]);
            }
        };

        fetchTransactions();
        const interval = setInterval(fetchTransactions, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, []);

    const formatTransaction = (transaction) => {
        const amount = (transaction.amount_money.amount / 100).toFixed(2);
        const date = new Date(transaction.created_at).toLocaleTimeString();
        return `💰 $${amount} at ${date}`;
    };

    return (
        <div className="ticker-container">
            <div className="ticker-content">
                <span className="transaction-item header-text">LATEST TRANSACTIONS:</span>
                {transactions.map(transaction => (
                    <span key={transaction.id} className="transaction-item">
                        {formatTransaction(transaction)}
                    </span>
                ))}
            </div>
        </div>
    );
};

ReactDOM.render(<TransactionTicker />, document.getElementById('root'));