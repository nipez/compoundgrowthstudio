import type { EngagementStatus, PlanType } from './types';

export type DemoOrg = {
  id: string;
  name: string;
  status: string;
  website: string;
};

export type DemoEngagement = {
  id: string;
  orgId: string;
  name: string;
  planType: PlanType;
  status: EngagementStatus;
  mrrCents: number;
  strategist: string;
};

export type DemoTask = {
  id: string;
  title: string;
  ownerSide: 'client' | 'cgs';
  status: 'todo' | 'in_progress' | 'blocked' | 'done';
};

export type DemoMessage = {
  id: string;
  from: string;
  side: 'client' | 'cgs';
  body: string;
  at: string;
};

export type DemoInvoice = {
  id: string;
  number: string;
  status: string;
  amountCents: number;
  dueDate: string;
};

export type DemoApproval = {
  id: string;
  title: string;
  kind: string;
  status: 'pending' | 'approved' | 'changes_requested';
};

export type DemoDeliverable = {
  id: string;
  title: string;
  kind: string;
  period: string;
  status: string;
};

export type DemoDocument = {
  id: string;
  title: string;
  category: string;
  updated: string;
};

export const demoOrg: DemoOrg = {
  id: 'org_demo',
  name: 'Summit Metabolic Clinic',
  status: 'onboarding',
  website: 'https://summitmetabolic.example',
};

export const demoEngagement: DemoEngagement = {
  id: 'eng_demo',
  orgId: demoOrg.id,
  name: 'Conversion Foundation — GLP-1',
  planType: 'conversion_foundation',
  status: 'onboarding',
  mrrCents: 100000,
  strategist: 'Conor',
};

export const demoTasks: DemoTask[] = [
  { id: 't1', title: 'Complete clinic intake questionnaire', ownerSide: 'client', status: 'in_progress' },
  { id: 't2', title: 'Upload brand kit & logo files', ownerSide: 'client', status: 'todo' },
  { id: 't3', title: 'Share Meta Business Manager access', ownerSide: 'client', status: 'todo' },
  { id: 't4', title: 'Draft compliant landing page outline', ownerSide: 'cgs', status: 'todo' },
  { id: 't5', title: 'Map intake → CRM / calendar flow', ownerSide: 'cgs', status: 'todo' },
];

export const demoMessages: DemoMessage[] = [
  {
    id: 'm1',
    from: 'Conor',
    side: 'cgs',
    body: 'Welcome aboard — once intake is in, we’ll lock the landing page structure for GLP-1 eligibility.',
    at: '2026-07-28T14:10:00Z',
  },
  {
    id: 'm2',
    from: 'Dr. Avery Chen',
    side: 'client',
    body: 'Sounds good. We’re finishing brand assets this week and can share BM access Friday.',
    at: '2026-07-29T16:40:00Z',
  },
];

export const demoInvoices: DemoInvoice[] = [
  {
    id: 'inv1',
    number: 'CGS-00421',
    status: 'paid',
    amountCents: 100000,
    dueDate: '2026-07-01',
  },
  {
    id: 'inv2',
    number: 'CGS-00448',
    status: 'open',
    amountCents: 100000,
    dueDate: '2026-08-01',
  },
];

export const demoApprovals: DemoApproval[] = [
  {
    id: 'a1',
    title: 'GLP-1 landing page — first draft',
    kind: 'landing_page',
    status: 'pending',
  },
  {
    id: 'a2',
    title: 'Meta primary text set A',
    kind: 'ad_creative',
    status: 'changes_requested',
  },
];

export const demoDeliverables: DemoDeliverable[] = [
  {
    id: 'd1',
    title: 'July conversion foundation report',
    kind: 'report',
    period: 'Jul 2026',
    status: 'shared',
  },
  {
    id: 'd2',
    title: 'Eligibility-first landing page v1',
    kind: 'landing_page',
    period: 'Kickoff',
    status: 'draft',
  },
];

export const demoDocuments: DemoDocument[] = [
  { id: 'doc1', title: 'Master services agreement', category: 'contract', updated: '2026-07-20' },
  { id: 'doc2', title: 'Brand kit', category: 'brand', updated: '2026-07-27' },
  { id: 'doc3', title: 'Prescription-ad compliance notes', category: 'compliance', updated: '2026-07-22' },
];

export const demoClients = [
  {
    id: 'org_demo',
    name: 'Summit Metabolic Clinic',
    plan: 'Conversion Foundation',
    status: 'onboarding',
    mrr: '$1,000',
    nextAction: 'Review intake',
  },
  {
    id: 'org_2',
    name: 'Lakeview Longevity',
    plan: 'Full Growth System',
    status: 'active',
    mrr: 'Custom',
    nextAction: 'Share August report',
  },
  {
    id: 'org_3',
    name: 'Northshore Peptides',
    plan: 'Community',
    status: 'active',
    mrr: '$100',
    nextAction: 'None',
  },
  {
    id: 'org_4',
    name: 'Prairie Weight Clinic',
    plan: 'Ad Account Recovery',
    status: 'active',
    mrr: '—',
    nextAction: 'Week-2 creative rebuild',
  },
];

export const intakeFields = [
  { key: 'clinic_name', label: 'Clinic name', type: 'text' as const },
  { key: 'primary_contact', label: 'Primary contact', type: 'text' as const },
  { key: 'programs', label: 'Programs offered (GLP-1, peptides, etc.)', type: 'textarea' as const },
  { key: 'markets', label: 'Primary markets / service areas', type: 'textarea' as const },
  { key: 'monthly_budget', label: 'Monthly media budget (if any)', type: 'text' as const },
  { key: 'crm', label: 'CRM / scheduling tools', type: 'text' as const },
  { key: 'compliance_notes', label: 'Compliance or medical-review constraints', type: 'textarea' as const },
  { key: 'goals_90', label: '90-day goals', type: 'textarea' as const },
];
