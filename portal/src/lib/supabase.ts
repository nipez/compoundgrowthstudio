import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';
import type { SessionUser } from './types';
import { readDemoSession } from './auth';

export function hasSupabaseConfig() {
  return Boolean(import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY);
}

export function createSupabaseServerClient(request: Request, cookies: AstroCookies) {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return parseCookieHeader(request.headers.get('Cookie') ?? '').map((c) => ({
          name: c.name,
          value: c.value ?? '',
        }));
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies.set(name, value, options);
        });
      },
    },
  });
}

/** Resolve session: real Supabase user, else demo cookie. */
export async function getSessionUser(
  request: Request,
  cookies: AstroCookies,
): Promise<SessionUser | null> {
  const demo = readDemoSession(cookies);
  if (demo) return demo;

  const supabase = createSupabaseServerClient(request, cookies);
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, portal_role, email')
    .eq('id', data.user.id)
    .maybeSingle();

  return {
    id: data.user.id,
    email: profile?.email ?? data.user.email ?? '',
    fullName: profile?.full_name ?? data.user.email ?? 'User',
    role: profile?.portal_role === 'cgs_staff' ? 'cgs_staff' : 'client',
    isDemo: false,
  };
}
