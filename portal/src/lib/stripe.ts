import Stripe from 'stripe';

/** Stripe Billing helper — Checkout + Customer Portal for retainers. */
export function getStripe() {
  const key = import.meta.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, {
    apiVersion: '2025-08-27.basil',
    typescript: true,
  });
}

export function priceIdForPlan(plan: 'community' | 'conversion_foundation') {
  if (plan === 'community') return import.meta.env.STRIPE_PRICE_COMMUNITY;
  return import.meta.env.STRIPE_PRICE_CONVERSION_FOUNDATION;
}

/**
 * Create a subscription Checkout Session.
 * Do not pass payment_method_types — let Stripe use dynamic payment methods.
 */
export async function createSubscriptionCheckout(opts: {
  customerId?: string;
  customerEmail?: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  organizationId: string;
}) {
  const stripe = getStripe();
  if (!stripe) throw new Error('Stripe is not configured');

  return stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: opts.customerId,
    customer_email: opts.customerId ? undefined : opts.customerEmail,
    line_items: [{ price: opts.priceId, quantity: 1 }],
    success_url: opts.successUrl,
    cancel_url: opts.cancelUrl,
    client_reference_id: opts.organizationId,
    metadata: { organization_id: opts.organizationId },
  });
}

export async function createBillingPortalSession(opts: {
  customerId: string;
  returnUrl: string;
}) {
  const stripe = getStripe();
  if (!stripe) throw new Error('Stripe is not configured');
  return stripe.billingPortal.sessions.create({
    customer: opts.customerId,
    return_url: opts.returnUrl,
  });
}
