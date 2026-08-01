import {createClient, type SanityClient} from '@sanity/client';
import groq from 'groq';

const projectId =
  import.meta.env.PUBLIC_SANITY_PROJECT_ID ||
  import.meta.env.SANITY_PROJECT_ID ||
  '4rag8303';
const dataset =
  import.meta.env.PUBLIC_SANITY_DATASET || import.meta.env.SANITY_DATASET || 'production';

export const sanityConfigured = Boolean(projectId && dataset);

export function getSanity(): SanityClient {
  return createClient({
    projectId,
    dataset,
    apiVersion: '2025-01-01',
    useCdn: true,
    perspective: 'published',
  });
}

export const pageIds = {
  home: 'homePage',
  services: 'servicesPage',
  system: 'systemPage',
  glp: 'glpPage',
  pricing: 'pricingPage',
  leadership: 'leadershipPage',
  faq: 'faqPage',
  contact: 'contactPage',
  aiVoice: 'aiVoicePage',
  settings: 'siteSettings',
} as const;

export async function fetchDocument<T>(id: string): Promise<T | null> {
  if (!sanityConfigured) return null;
  try {
    return await getSanity().fetch<T>(groq`*[_id == $id][0]`, {id});
  } catch (error) {
    console.warn('[sanity] fetch failed', id, error);
    return null;
  }
}

export type Seo = {title?: string; description?: string};
export type FaqDoc = {
  seo?: Seo;
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  faqs?: {question: string; answer: string}[];
};
export type PricingDoc = {
  seo?: Seo;
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  intro?: string;
  tiers?: {
    eyebrow?: string;
    name?: string;
    price?: string;
    priceNote?: string;
    description?: string;
    features?: string[];
    ctaLabel?: string;
    ctaHref?: string;
    featured?: boolean;
  }[];
  recoveryTitle?: string;
  recoveryBody?: string;
  recoveryCtaLabel?: string;
};
export type HomeDoc = {
  seo?: Seo;
  eyebrow?: string;
  headline?: string;
  subhead?: string;
  primaryCtaLabel?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  leadMagnetEyebrow?: string;
  leadMagnetTitle?: string;
  leadMagnetBody?: string;
};
export type SiteSettings = {
  navCtaLabel?: string;
  primaryCtaLabel?: string;
  footerBlurb?: string;
};
