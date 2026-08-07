import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const user = await getSessionUser(request, cookies);
  if (!user || user.role !== 'client') return redirect('/login/');

  // Demo stub — production updates approvals.status + decided_by/at and writes activity_events.
  return redirect('/client/approvals/?updated=1');
};
