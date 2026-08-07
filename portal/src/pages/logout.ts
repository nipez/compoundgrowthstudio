import type { APIRoute } from 'astro';
import { clearDemoSession } from '../lib/auth';
import { createSupabaseServerClient } from '../lib/supabase';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  clearDemoSession(cookies);
  const supabase = createSupabaseServerClient(request, cookies);
  if (supabase) {
    await supabase.auth.signOut();
  }
  return redirect('/login/');
};

export const POST: APIRoute = GET;
