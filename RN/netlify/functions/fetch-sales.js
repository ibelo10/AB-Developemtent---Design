const fetch = require('node-fetch');

exports.handler = async () => {
    const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
    const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
    const BASE_URL = 'https://connect.squareup.com/v2';

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
