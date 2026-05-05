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
    const { items, totalAmount, successUrl, cancelUrl } = body;

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

    // 3. Save Order to Database (Pending Status)
    const { query } = await import('@/lib/db');

    try {
      const orderResult = await query(
        'INSERT INTO orders (user_id, total_amount, status, stripe_payment_intent_id) VALUES ($1, $2, $3, $4) RETURNING id',
        [String(user.id), totalAmount, 'pending', session_stripe.id]
      );

      const order = orderResult.rows[0];

      // 4. Return Checkout URL
      return NextResponse.json({
        url: session_stripe.url,
        orderId: order.id
      });
    } catch (dbError) {
      console.error('Database Error:', dbError);
      return NextResponse.json({ error: 'Failed to create order in database' }, { status: 500 });
    }

  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
