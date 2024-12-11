const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
    const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
    const BASE_URL = 'https://connect.squareup.com/v2';
    
    // Format today's date properly for Square API
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const beginTime = startOfDay.toISOString();

    if (!ACCESS_TOKEN || !LOCATION_ID) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify({
                error: "Configuration Error",
                message: "Missing API credentials"
            })
        };
    }

    try {
        // Query parameters must be properly encoded
        const queryParams = new URLSearchParams({
            location_id: LOCATION_ID,
            begin_time: beginTime
        }).toString();

        const response = await fetch(`${BASE_URL}/payments?${queryParams}`, {
            method: 'GET',
            headers: {
                'Square-Version': '2024-01-17',
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Square API Error:', data);
            throw new Error(`Square API error: ${data.errors ? JSON.stringify(data.errors) : response.statusText}`);
        }

        const totalSales = data.payments?.reduce((sum, payment) => {
            if (payment.status === 'COMPLETED') {
                return sum + (payment.amount_money?.amount || 0);
            }
            return sum;
        }, 0) || 0;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify({
                total_sales: totalSales,
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            },
            body: JSON.stringify({
                error: "Failed to fetch sales data",
                message: error.message
            })
        };
    }
};