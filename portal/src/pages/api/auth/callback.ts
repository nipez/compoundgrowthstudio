import type { APIRoute } from 'astro';
import { homeForRole } from '../../../lib/auth';
import { createSupabaseServerClient } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request, cookies, redirect, url }) => {
  const code = url.searchParams.get('code');
  const supabase = createSupabaseServerClient(request, cookies);

  if (!supabase || !code) {
    return redirect('/login/?error=' + encodeURIComponent('Invalid auth callback.'));
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return redirect('/login/?error=' + encodeURIComponent(error.message));
  }

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  let role: 'client' | 'cgs_staff' = 'client';
  if (userId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('portal_role')
      .eq('id', userId)
      .maybeSingle();
    if (profile?.portal_role === 'cgs_staff') role = 'cgs_staff';
  }

  return redirect(homeForRole(role));
};
