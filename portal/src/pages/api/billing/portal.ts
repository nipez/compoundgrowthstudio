import type { APIRoute } from 'astro';
import { createBillingPortalSession, getStripe } from '../../../lib/stripe';
import { getSessionUser } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const user = await getSessionUser(request, cookies);
  if (!user || user.role !== 'client') {
    return redirect('/login/');
  }

  if (user.isDemo || !getStripe()) {
    return redirect('/client/billing/?notice=stripe-not-configured');
  }

  // Production: look up organizations.stripe_customer_id for the user's org.
  const customerId = '';
  if (!customerId) {
    return redirect('/client/billing/?notice=missing-customer');
  }

  const origin = new URL(request.url).origin;
  const session = await createBillingPortalSession({
    customerId,
    returnUrl: `${origin}/client/billing/`,
  });
  return redirect(session.url);
};
