const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Using the same credentials from your Python script
    const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN || 'EAAAl-h3evzXiERJMwK0uirGJlq_Pe-KTUgy-7j_buUEFkeUVTNXSkPbrBtpOgsd';
    const LOCATION_ID = process.env.SQUARE_LOCATION_ID || 'L1B1NDVKJX5K0';
    const BASE_URL = 'https://connect.squareup.com/v2';

    // Using the same date range as Python script
    const params = new URLSearchParams({
        location_id: LOCATION_ID,
        begin_time: '2024-01-01T00:00:00Z',
        end_time: '2024-12-31T23:59:59Z'
    });

    try {
        const response = await fetch(`${BASE_URL}/payments?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'Square-Version': '2024-01-17'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Square API Error:', data);
            throw new Error(`Square API error: ${JSON.stringify(data.errors)}`);
        }

        const payments = data.payments || [];
        console.log(`Fetched ${payments.length} transactions`);

        // Calculate total sales from payments
        const totalSales = payments.reduce((sum, payment) => {
            return sum + (payment.amount_money?.amount || 0);
        }, 0);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                total_sales: totalSales,
                transaction_count: payments.length,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: "Failed to fetch sales data",
                message: error.message
            })
        };
    }
};
