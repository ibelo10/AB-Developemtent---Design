async function fetchSalesTotal() {
    try {
        const response = await fetch('/.netlify/functions/fetch-sales');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || `API error: ${response.statusText}`);
        }

        if (data.error) {
            throw new Error(data.message || 'Unknown error occurred');
        }

        const totalSales = `$${(data.total_sales / 100).toFixed(2)}`;
        document.getElementById('sales-total').textContent = totalSales;
        document.getElementById('update-time').textContent = 
            `Last updated: ${new Date().toLocaleTimeString()}`;
        
        document.getElementById('sales-total').style.color = '#00ff7f';
        
    } catch (error) {
        console.error('Error fetching sales total:', error);
        document.getElementById('sales-total').textContent = 'Error';
        document.getElementById('sales-total').style.color = '#ff4444';
        document.getElementById('update-time').textContent = 
            `Error: ${error.message}`;
    }
}

fetchSalesTotal();
setInterval(fetchSalesTotal, 60000);
