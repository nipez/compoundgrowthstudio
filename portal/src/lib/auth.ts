import type { AstroCookies } from 'astro';
import type { PortalRole, SessionUser } from './types';

const DEMO_COOKIE = 'cgs_portal_demo';

export function readDemoSession(cookies: AstroCookies): SessionUser | null {
  const raw = cookies.get(DEMO_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as SessionUser;
    if (parsed?.role === 'client' || parsed?.role === 'cgs_staff') {
      return { ...parsed, isDemo: true };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function writeDemoSession(cookies: AstroCookies, role: PortalRole) {
  const user: SessionUser =
    role === 'cgs_staff'
      ? {
          id: 'demo_cgs',
          email: 'ops@compoundgrowthstudio.com',
          fullName: 'CGS Ops (Demo)',
          role: 'cgs_staff',
          isDemo: true,
        }
      : {
          id: 'demo_client',
          email: 'avery@summitmetabolic.example',
          fullName: 'Dr. Avery Chen',
          role: 'client',
          isDemo: true,
        };

  cookies.set(DEMO_COOKIE, JSON.stringify(user), {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  });
  return user;
}

export function clearDemoSession(cookies: AstroCookies) {
  cookies.delete(DEMO_COOKIE, { path: '/' });
}

export function homeForRole(role: PortalRole) {
  return role === 'cgs_staff' ? '/cgs/' : '/client/';
}

/** Returns a redirect path when the session is missing or the wrong role. */
export function gateUser(user: SessionUser | null, expected?: PortalRole): string | null {
  if (!user) return '/login/';
  if (expected && user.role !== expected) return homeForRole(user.role);
  return null;
}
