const fetch = require('node-fetch');

exports.handler = async () => {
    const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
    const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
    const BASE_URL = 'https://connect.squareup.com/v2';
    const TODAY = new Date().toISOString().split('T')[0];

    if (!ACCESS_TOKEN || !LOCATION_ID) {
        return {
            statusCode: 500,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: "Missing required configuration" })
        };
    }

    try {
        const response = await fetch(`${BASE_URL}/payments?location_id=${LOCATION_ID}&begin_time=${TODAY}`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'Square-Version': '2024-01-17',
            },
        });

        if (!response.ok) {
            throw new Error(`Square API error: ${response.statusText}`);
        }

        const data = await response.json();
        const totalSales = data.payments?.reduce((sum, payment) => {
            return sum + (payment.approved_money?.amount || 0);
        }, 0) || 0;

        return {
            statusCode: 200,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ total_sales: totalSales })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ error: "Failed to fetch sales data" })
        };
    }
};
