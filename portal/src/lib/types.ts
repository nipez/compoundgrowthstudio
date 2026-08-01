export type PortalRole = 'client' | 'cgs_staff';

export type PlanType =
  | 'community'
  | 'conversion_foundation'
  | 'full_growth_system'
  | 'ad_account_recovery'
  | 'custom';

export type EngagementStatus =
  | 'intake'
  | 'onboarding'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: PortalRole;
  isDemo: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type ModuleDef = {
  id: string;
  name: string;
  summary: string;
  clientHref?: string;
  cgsHref?: string;
  phase: 'v1' | 'next';
};

export const PLAN_LABELS: Record<PlanType, string> = {
  community: 'Clinic Growth Community',
  conversion_foundation: 'Conversion Foundation',
  full_growth_system: 'Full Growth System',
  ad_account_recovery: 'Ad Account Recovery',
  custom: 'Custom engagement',
};

export const STATUS_LABELS: Record<EngagementStatus, string> = {
  intake: 'Intake',
  onboarding: 'Onboarding',
  active: 'Active',
  paused: 'Paused',
  completed: 'Completed',
  cancelled: 'Cancelled',
};
