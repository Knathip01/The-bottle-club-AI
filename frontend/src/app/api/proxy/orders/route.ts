import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('--- Order Proxy Request ---');
    console.log('Target:', 'https://possimon.onrender.com/orders');
    console.log('Body:', JSON.stringify(body, null, 2));
    
    // Proxy the request to the external API
    const response = await fetch('https://possimon.onrender.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log('External API Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API Error:', errorText);
      return NextResponse.json(
        { error: 'External API error', status: response.status, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Order Success:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy Exception:', error.message || error);
    return NextResponse.json(
      { error: 'Internal Proxy Error', details: error.message || String(error) },
      { status: 500 }
    );
  }
}
