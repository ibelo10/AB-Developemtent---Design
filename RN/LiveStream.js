const { ACCESS_TOKEN, LOCATION_ID } = CONFIG;
const BASE_URL = 'https://connect.squareup.com/v2';

async function fetchSalesTotal() {
    try {
        const response = await fetch(`${BASE_URL}/payments?location_id=${LOCATION_ID}`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Calculate total sales
        const totalSales = data.payments.reduce((sum, payment) => sum + (payment.approved_money?.amount || 0), 0);
        document.getElementById('sales-total').textContent = `$${(totalSales / 100).toFixed(2)}`;
        document.getElementById('update-time').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        console.error('Error fetching sales total:', error);
        document.getElementById('sales-total').textContent = 'Error';
    }
}

fetchSalesTotal();
setInterval(fetchSalesTotal, 3600000);
