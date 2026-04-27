import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';

// Initialize Stripe (placeholder key, replace with environment variable)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-04-22.dahlia', // using latest stable or default depending on version
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Get user session to authenticate the request
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, totalAmount } = body;

    if (!items || !totalAmount) {
      return NextResponse.json({ error: 'Missing items or totalAmount' }, { status: 400 });
    }

    // 2. Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100, // Stripe expects amounts in cents for most currencies
      currency: 'thb',
      metadata: {
        userId: user.id,
      },
    });

    // 3. Save Order to Supabase (Pending Status)
    const { data: order, error: supabaseError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: totalAmount,
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
      })
      .select()
      .single();

    if (supabaseError) {
      console.error('Supabase Error:', supabaseError);
      return NextResponse.json({ error: 'Failed to create order in database' }, { status: 500 });
    }

    // 4. Return Payment Intent client secret to the frontend
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id
    });

  } catch (error) {
    console.error('Create Order Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
