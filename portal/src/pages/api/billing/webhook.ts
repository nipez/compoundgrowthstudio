import type { APIRoute } from 'astro';
import { getStripe } from '../../../lib/stripe';

/**
 * Stripe webhook stub.
 * Wire to sync subscription status → engagements and invoices → billing_invoices.
 * Events to handle: customer.subscription.*, invoice.paid, invoice.finalized, checkout.session.completed
 */
export const POST: APIRoute = async ({ request }) => {
  const stripe = getStripe();
  const secret = import.meta.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return new Response('Stripe webhook not configured', { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing signature', { status: 400 });
  }

  const payload = await request.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid payload';
    return new Response(message, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'invoice.paid':
    case 'invoice.finalized':
      // TODO: persist with SUPABASE_SERVICE_ROLE_KEY
      break;
    default:
      break;
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
