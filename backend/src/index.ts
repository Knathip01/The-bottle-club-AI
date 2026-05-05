import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize Stripe Client
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-04-22.dahlia',
});

app.use(cors());
// Need raw body for stripe webhooks
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhooks/stripe') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Create Stripe Checkout Session
app.post('/api/checkout', async (req, res) => {
  try {
    const { items, successUrl, cancelUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'promptpay'],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: 'thb',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: item.price * 100, // Stripe expects amounts in cents/satang
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
