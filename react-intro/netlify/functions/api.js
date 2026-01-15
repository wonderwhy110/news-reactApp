const axios = require('axios');

exports.handler = async (event, context) => {
  const path = event.path.replace('/api', ''); // убираем /api
  const backendURL = `http://176.123.167.59${path}`;
  
  console.log(`📡 Proxying ${event.httpMethod} ${event.path} → ${backendURL}`);
  
  try {
    const response = await axios({
      method: event.httpMethod,
      url: backendURL,
      data: event.body,
      headers: {
        'Content-Type': 'application/json',
        ...(event.headers.authorization && { 
          'Authorization': event.headers.authorization 
        })
      },
      params: event.queryStringParameters
    });
    
    return {
      statusCode: response.status,
      body: JSON.stringify(response.data),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Content-Type': 'application/json'
      }
    };
  } catch (error) {
    console.error('❌ Proxy error:', {
      message: error.message,
      url: backendURL,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data
      }),
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
}; 