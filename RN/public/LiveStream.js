async function fetchSalesTotal() {
    try {
        const response = await fetch('/.netlify/functions/fetch-sales');

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Format total sales
        const totalSales = `$${(data.total_sales / 100).toFixed(2)}`;

        // Update the overlay
        document.getElementById('sales-total').textContent = totalSales;
        document.getElementById('update-time').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    } catch (error) {
        console.error('Error fetching sales total:', error);
        document.getElementById('sales-total').textContent = 'Error';
    }
}

// Fetch sales total immediately and every hour (3600000ms)
fetchSalesTotal();
setInterval(fetchSalesTotal, 3600000);
