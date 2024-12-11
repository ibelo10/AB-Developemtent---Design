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
fetchSalesTotal();
setInterval(fetchSalesTotal, 3600000);
