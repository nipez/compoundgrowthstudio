import type { APIRoute } from 'astro';
import { getSessionUser } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const user = await getSessionUser(request, cookies);
  if (!user) return redirect('/login/');

  // Demo stub — production inserts into messages (+ optional internal flag for staff).
  const dest = user.role === 'cgs_staff' ? '/cgs/messages/' : '/client/messages/';
  return redirect(`${dest}?sent=1`);
};
