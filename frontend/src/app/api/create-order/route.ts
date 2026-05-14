import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSession } from '@/lib/auth-utils';

// Initialize Stripe (placeholder key, replace with environment variable)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-04-22.dahlia' as any, // Cast to any to handle potential version discrepancies in development
});

export async function POST(request: Request) {
  try {
    // 1. Get user session to authenticate the request using unified session
    const session = await getSession();
    const user = session?.user;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, totalAmount, addressId, successUrl, cancelUrl } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Missing items' }, { status: 400 });
    }

    // 2. Create Stripe Checkout Session
    const session_stripe = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'thb',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: successUrl || `${request.headers.get('origin')}/account/orders?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${request.headers.get('origin')}/checkout`,
      metadata: {
        userId: String(user.id),
      },
    });

    // 3. Save Order to External API (Pending Status)
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://possimon.onrender.com';
    const token = session?.user?.access_token;
    
    try {
      console.log('Sending order to external API:', `${API_BASE_URL}/api/orders`);
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Payload matching OrderCreate schema
      const orderPayload = {
        user_id: user.id,
        total_amount: totalAmount,
        payment_method: 'credit_card', // Must be one of: cash, promptpay, qr, credit_card, transfer
        order_type: 'online',
        address_id: addressId ? parseInt(addressId) : null,
        items: items.map((item: any) => ({
          product_id: parseInt(item.id),
          quantity: item.quantity,
          price: item.price
        }))
      };

      const apiResponse = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error('External API Order Error:', errorText);
      }

      const apiData = await apiResponse.json().catch(() => ({}));
      const orderId = apiData.id || Date.now(); 

      // 4. Return Checkout URL
      return NextResponse.json({
        url: session_stripe.url,
        orderId: orderId
      });
    } catch (apiError) {
      console.error('External API Exception:', apiError);
      // Final fallback to local DB
      try {
        const { query } = await import('@/lib/db');
        const orderResult = await query(
          'INSERT INTO orders (user_id, total_amount, status, stripe_payment_intent_id) VALUES ($1, $2, $3, $4) RETURNING id',
          [String(user.id), totalAmount, 'pending', session_stripe.id]
        );
        return NextResponse.json({
          url: session_stripe.url,
          orderId: orderResult.rows[0].id
        });
      } catch (dbError) {
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
      }
    }

  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
