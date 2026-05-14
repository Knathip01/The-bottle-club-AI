import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getSession();
    const token = session?.user?.access_token;
    
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://possimon.onrender.com';
    const targetUrl = `${API_BASE_URL}/api/users/addresses`;
    
    console.log('--- Address Proxy Request ---');
    console.log('Target:', targetUrl);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Proxy the request to the external API
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers,
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
    console.log('Address Success:', data);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Proxy Exception:', error.message || error);
    return NextResponse.json(
      { error: 'Internal Proxy Error', details: error.message || String(error) },
      { status: 500 }
    );
  }
}
