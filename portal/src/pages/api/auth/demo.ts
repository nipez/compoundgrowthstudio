import type { APIRoute } from 'astro';
import { homeForRole, writeDemoSession } from '../../../lib/auth';
import type { PortalRole } from '../../../lib/types';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const form = await request.formData();
  const role = String(form.get('role') || 'client') as PortalRole;
  const safeRole: PortalRole = role === 'cgs_staff' ? 'cgs_staff' : 'client';
  writeDemoSession(cookies, safeRole);
  return redirect(homeForRole(safeRole));
};
