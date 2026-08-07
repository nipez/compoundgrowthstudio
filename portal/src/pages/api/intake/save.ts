import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const user = await getSessionUser(request, cookies);
  if (!user || user.role !== 'client') return redirect('/login/');

  // Demo / pre-wiring: accept POST and return to onboarding.
  // Production: upsert intake_forms.responses + status draft|submitted.
  return redirect('/client/onboarding/?saved=1');
};
