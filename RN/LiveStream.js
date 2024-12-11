const ACCESS_TOKEN = 'EAAAl-h3evzXiERJMwK0uirGJlq_Pe-KTUgy-7j_buUEFkeUVTNXSkPbrBtpOgsd';
const BASE_URL = 'https://connect.squareup.com/v2';
const LOCATION_ID = 'L1B1NDVKJX5K0';

async function fetchSalesTotal() {
    try {
        // Fetch transactions from Square API
        const response = await fetch(`${BASE_URL}/payments?location_id=${LOCATION_ID}`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Calculate total sales
        let totalSales = 0;
        if (data.payments && data.payments.length > 0) {
            totalSales = data.payments.reduce((sum, payment) => {
                return sum + (payment.approved_money?.amount || 0);
            }, 0);
        }

        // Format total sales to dollars
        const formattedTotal = `$${(totalSales / 100).toFixed(2)}`;

        // Update the overlay
        document.getElementById('sales-total').textContent = formattedTotal;

        // Update the timestamp
        const now = new Date();
        document.getElementById('update-time').textContent = `Last updated: ${now.toLocaleTimeString()}`;
    } catch (error) {
        console.error('Error fetching sales total:', error);
        document.getElementById('sales-total').textContent = 'Error';
    }
}

// Fetch sales total immediately and every hour (3600000ms)
fetchSalesTotal();
setInterval(fetchSalesTotal, 3600000);
