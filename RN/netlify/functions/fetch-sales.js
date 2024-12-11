const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
    const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
    const BASE_URL = 'https://connect.squareup.com/v2';
    
    // Get today's date in UTC
    const today = new Date();
    today.setHours(0,0,0,0);
    const beginTime = today.toISOString();

    console.log('Environment check:', {
        hasToken: !!ACCESS_TOKEN,
        hasLocation: !!LOCATION_ID,
        beginTime
    });

    if (!ACCESS_TOKEN || !LOCATION_ID) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: "Configuration Error",
                message: "Missing API credentials"
            })
        };
    }

    try {
        const response = await fetch(`${BASE_URL}/payments?location_id=${LOCATION_ID}&begin_time=${beginTime}`, {
            headers: {
                'Square-Version': '2024-01-17',
                'Authorization': `Bearer ${ACCESS_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Square API Error:', errorData);
            throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        const totalSales = data.payments?.reduce((sum, payment) => {
            return sum + (payment.amount_money?.amount || 0);
        }, 0) || 0;

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                error: "API Error",
                message: error.message
            })
        };
    }
};
