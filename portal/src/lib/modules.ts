import type { ModuleDef, NavItem } from './types';

/** Canonical product modules for the CGS portal. */
export const PORTAL_MODULES: ModuleDef[] = [
  {
    id: 'auth',
    name: 'Auth & dual portals',
    summary: 'Client and CGS logins with role-based routing.',
    clientHref: '/client/',
    cgsHref: '/cgs/',
    phase: 'v1',
  },
  {
    id: 'onboarding',
    name: 'Onboarding & intake',
    summary: 'Clinic questionnaire, asset checklist, kickoff readiness.',
    clientHref: '/client/onboarding/',
    cgsHref: '/cgs/intake/',
    phase: 'v1',
  },
  {
    id: 'billing',
    name: 'Billing & payments',
    summary: 'Stripe subscriptions, invoices, Customer Portal self-serve.',
    clientHref: '/client/billing/',
    cgsHref: '/cgs/billing/',
    phase: 'v1',
  },
  {
    id: 'comms',
    name: 'Communications',
    summary: 'Threaded messages between clinic and CGS (internal notes for staff).',
    clientHref: '/client/messages/',
    cgsHref: '/cgs/messages/',
    phase: 'v1',
  },
  {
    id: 'deliverables',
    name: 'Deliverables & reports',
    summary: 'Monthly reports, landing pages, campaign summaries.',
    clientHref: '/client/deliverables/',
    cgsHref: '/cgs/projects/',
    phase: 'v1',
  },
  {
    id: 'approvals',
    name: 'Approvals',
    summary: 'Creative / copy / landing-page sign-off with audit trail.',
    clientHref: '/client/approvals/',
    phase: 'v1',
  },
  {
    id: 'documents',
    name: 'Document vault',
    summary: 'Contracts, brand kits, compliance packs.',
    clientHref: '/client/documents/',
    phase: 'v1',
  },
  {
    id: 'performance',
    name: 'Performance dashboard',
    summary: 'KPI snapshots from Meta/Google (synced or embedded).',
    phase: 'next',
  },
  {
    id: 'tasks',
    name: 'Shared task board',
    summary: 'CGS assigns work; clients complete assets and approvals.',
    phase: 'next',
  },
  {
    id: 'meetings',
    name: 'Meeting scheduler',
    summary: 'Book strategy and growth-gap calls.',
    phase: 'next',
  },
  {
    id: 'notifications',
    name: 'Notifications center',
    summary: 'In-app + email digests for invoices, messages, approvals.',
    phase: 'next',
  },
];

export const CLIENT_NAV: NavItem[] = [
  { label: 'Home', href: '/client/', description: 'Engagement snapshot' },
  { label: 'Onboarding', href: '/client/onboarding/', description: 'Intake & checklist' },
  { label: 'Billing', href: '/client/billing/', description: 'Invoices & payment' },
  { label: 'Messages', href: '/client/messages/', description: 'Talk with CGS' },
  { label: 'Deliverables', href: '/client/deliverables/', description: 'Reports & work' },
  { label: 'Approvals', href: '/client/approvals/', description: 'Sign off creative' },
  { label: 'Documents', href: '/client/documents/', description: 'Files & contracts' },
];

export const CGS_NAV: NavItem[] = [
  { label: 'Ops home', href: '/cgs/', description: 'Pipeline overview' },
  { label: 'Clients', href: '/cgs/clients/', description: 'Organizations' },
  { label: 'Projects', href: '/cgs/projects/', description: 'Engagements' },
  { label: 'Intake', href: '/cgs/intake/', description: 'Review submissions' },
  { label: 'Billing', href: '/cgs/billing/', description: 'Revenue & invoices' },
  { label: 'Messages', href: '/cgs/messages/', description: 'Client threads' },
  { label: 'Team', href: '/cgs/team/', description: 'CGS staff' },
];
