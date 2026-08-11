export const SITE_URL = 'https://compoundgrowthstudio.com';
export const SITE_NAME = 'Compound Growth Studio';

export type PageMeta = {
  path: string;
  title: string;
  description: string;
  /** When true, emit noindex and keep the page out of marketing surfaces. */
  noindex?: boolean;
};

/** Titles carried from /site/; descriptions derived from each page hero when absent in source. */
export const pages: Record<string, PageMeta> = {
  home: {
    path: '/',
    title: 'Compound Growth Studio | GLP-1 Retention & Clinic Growth',
    description:
      'Stop the month-four patient leak. Retention systems, compliant acquisition, and local visibility for GLP-1, weight loss, and med spa clinics.',
  },
  calculator: {
    path: '/calculator/',
    title: 'Patient Leak Calculator | Compound Growth Studio',
    description:
      'See patients lost per year, replacement cost, and what a 10-point retention lift is worth for your GLP-1 or weight loss clinic.',
  },
  'local-seo-for-glp1-clinics': {
    path: '/local-seo-for-glp1-clinics/',
    title: 'Local SEO for GLP-1 Clinics | Compound Growth Studio',
    description:
      'Patients search drug names, not “weight loss clinic.” Local SEO and Google Business Profile where Hims and Ro are structurally weak.',
  },
  'glp1-marketing-compliance': {
    path: '/glp1-marketing-compliance/',
    title: 'GLP-1 Marketing Compliance After May 2025 | Compound Growth Studio',
    description:
      'What changed for compounded semaglutide and tirzepatide marketing — and what it means for your ads and landing pages. Free compliance teardown.',
  },
  'ad-account-recovery': {
    path: '/ad-account-recovery/',
    title: 'Ad Account Recovery for Clinics | Compound Growth Studio',
    description:
      'Rejected or flagged clinic ads? Fixed-price ad account recovery in two weeks — compliant rebuild of creative and landing pages.',
  },
  services: {
    path: '/services/',
    title: 'Marketing Services for Modern Health Clinics | Compound Growth Studio',
    description:
      'Local SEO, paid acquisition, treatment education, provider authority, conversion copy, retention follow-up, and reporting for modern health clinics.',
  },
  system: {
    path: '/system/',
    title: 'The Clinic Growth System | Compound Growth Studio',
    description:
      'A six-stage growth system — visibility, education, trust, conversion, follow-up, and optimization — built for medically guided clinic programs.',
  },
  'glp-1-peptide-marketing': {
    path: '/glp-1-peptide-marketing/',
    title: 'GLP-1 + Peptide Marketing for Clinics | Compound Growth Studio',
    description:
      'Compliant Meta and Google campaigns, eligibility-first landing pages, and patient education for GLP-1 and peptide clinic programs.',
  },
  pricing: {
    path: '/pricing/',
    title: 'Get Started | Compound Growth Studio',
    description:
      'Start with a clinic growth community, conversion foundation, full growth system, or a one-time ad account recovery — then scale what works.',
  },
  leadership: {
    path: '/leadership/',
    title: 'Leadership | Compound Growth Studio',
    description:
      'Meet the operators behind Compound Growth Studio — experience scaling brands, healthcare networks, and high-growth demand systems.',
  },
  blog: {
    path: '/blog/',
    title: 'Blog | Compound Growth Studio',
    description:
      'Notes on clinic growth — retention, compliant acquisition, local visibility, and the systems behind them for GLP-1, weight loss, peptide, and med spa clinics.',
  },
  faq: {
    path: '/faq/',
    title: 'FAQ | Compound Growth Studio',
    description:
      'Answers about compliance, medical claim review, timelines, engagement options, and what to expect on a clinic growth gap call.',
  },
  contact: {
    path: '/contact/',
    title: 'Book a Clinic Growth Call | Compound Growth Studio',
    description:
      'Request a growth gap review for your clinic. We’ll identify acquisition opportunities, conversion gaps, and follow-up improvements.',
  },
  'ai-voice-agent': {
    path: '/ai-voice-agent/',
    title: '24/7 AI Inbound Voice Agent | Compound Growth Studio',
    description:
      'A 24/7 AI inbound voice agent demo for clinics — answer calls, qualify interest, and keep the consult pipeline moving after hours.',
  },
  'guides-meta-ads': {
    path: '/guides/meta-ads/',
    title: "Top 10 reasons your clinic's ads are struggling on Meta | Compound Growth Studio",
    description:
      'The rejection triggers, targeting mistakes, and landing-page gaps clinics hit most on Meta — and what to fix first.',
  },
};

export const NAV_CTA = 'Book a Growth Gap Call';
export const PRIMARY_CTA = 'Book a Growth Gap Call';
