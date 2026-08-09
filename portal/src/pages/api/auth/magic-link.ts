import type { APIRoute } from 'astro';
import { createSupabaseServerClient, hasSupabaseConfig } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  if (!hasSupabaseConfig()) {
    return redirect('/login/?error=' + encodeURIComponent('Auth is not configured.'));
  }

  const form = await request.formData();
  const email = String(form.get('email') || '').trim().toLowerCase();
  if (!email) {
    return redirect('/login/?error=' + encodeURIComponent('Email is required.'));
  }

  const supabase = createSupabaseServerClient(request, cookies);
  if (!supabase) {
    return redirect('/login/?error=' + encodeURIComponent('Auth is not configured.'));
  }

  const origin = new URL(request.url).origin;
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/api/auth/callback/`,
    },
  });

  if (error) {
    return redirect('/login/?error=' + encodeURIComponent(error.message));
  }

  return redirect('/login/?error=' + encodeURIComponent('Check your email for a magic link.'));
};
