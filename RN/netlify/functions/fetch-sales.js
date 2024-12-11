const fetch = require('node-fetch');

exports.handler = async () => {
    const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN; // Access token from environment variables
    const LOCATION_ID = process.env.SQUARE_LOCATION_ID;   // Location ID from environment variables
    const BASE_URL = 'https://connect.squareup.com/v2';

    if (!ACCESS_TOKEN || !LOCATION_ID) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Environment variables not set" }),
        };
    }

    try {
        const response = await fetch(`${BASE_URL}/payments?location_id=${LOCATION_ID}`, {
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching sales: ${response.statusText}`);
        }

        const data = await response.json();

        // Calculate total sales
        const totalSales = data.payments.reduce((sum, payment) => {
            return sum + (payment.approved_money?.amount || 0);
        }, 0);

        return {
            statusCode: 200,
            body: JSON.stringify({
                total_sales: totalSales,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
