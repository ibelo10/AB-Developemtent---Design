const fetch = require('node-fetch');

exports.handler = async () => {
  const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
  const LOCATION_ID = process.env.SQUARE_LOCATION_ID;
  const BASE_URL = 'https://connect.squareup.com/v2';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  if (!ACCESS_TOKEN || !LOCATION_ID) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: "Missing configuration" })
    };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/payments?location_id=${LOCATION_ID}&begin_time=${todayISO}&sort_order=DESC`,
      {
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
          'Square-Version': '2024-01-17'
        }
      }
    );

    if (!response.ok) throw new Error(`Square API error: ${response.statusText}`);

    const data = await response.json();
    
    const dailyStats = {
      total_sales: 0,
      transaction_count: 0,
      transactions: []
    };

    if (data.payments) {
      dailyStats.total_sales = data.payments.reduce((sum, payment) => 
        sum + (payment.approved_money?.amount || 0), 0);
      dailyStats.transaction_count = data.payments.length;
      dailyStats.transactions = data.payments.map(payment => ({
        id: payment.id,
        amount: payment.approved_money?.amount || 0,
        time: payment.created_at,
        status: payment.status
      }));
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dailyStats)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message })
    };
  }
};
