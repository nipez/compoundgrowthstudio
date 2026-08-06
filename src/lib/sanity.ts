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

export type SanityDocumentBase<TType extends string> = {
  _id?: string;
  _type?: TType;
  _createdAt?: string;
  _updatedAt?: string;
  _rev?: string;
};

export type Seo = {
  title?: string;
  description?: string;
};

export type Link = {
  label?: string;
  href?: string;
};

export type Cta = Link;

export type FaqItem = {
  question?: string;
  answer?: string;
};

export type FeatureCard = {
  title?: string;
  body?: string;
};

export type NumberedBlock = {
  number?: string;
  title?: string;
  body?: string;
};

export type StagePill = {
  number?: string;
  title?: string;
};

export type StatCard = {
  value?: string;
  title?: string;
  label?: string;
  body?: string;
};

export type PricingTier = {
  badge?: string | null;
  name?: string;
  price?: string;
  period?: string;
  description?: string;
  features?: string[];
  ctaLabel?: string;
  ctaHref?: string;
  highlighted?: boolean;
};

export type ServiceItem = {
  title?: string;
  body?: string;
  href?: string;
  linkLabel?: string;
};

export type ServiceGroup = {
  badge?: string;
  number?: string;
  stage?: string;
  items?: ServiceItem[];
};

export type SystemStage = {
  number?: string;
  title?: string;
  tag?: string;
  desc?: string;
  builds?: string[];
  handoffLabel?: string;
  handoff?: string;
};

export type PersonCard = {
  name?: string;
  role?: string;
  bio?: string;
  photoUrl?: string;
  /** Legacy Sanity field from early seed data */
  photoSrc?: string;
  photoAlt?: string;
  helps?: string[];
};

export type CompareRow = {
  label?: string;
  without?: string;
  withUs?: string;
};

export type ClosingCta = {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type FormCopy = {
  emailPlaceholder?: string;
  namePlaceholder?: string;
  clinicPlaceholder?: string;
  messagePlaceholder?: string;
  newsletterCheckboxLabel?: string;
  submitLabelIdle?: string;
  submitLabelDone?: string;
  noteIdle?: string;
  noteDone?: string;
};

export type HeroFields = {
  eyebrow?: string;
  headline?: string;
  subhead?: string;
};

export type HomeDoc = SanityDocumentBase<'homePage'> &
  HeroFields & {
    seo?: Seo;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    heroStats?: StatCard[];
    heroSupport?: string;
    heroExpandNote?: string;
    marqueeItems?: string[];
    whyEyebrow?: string;
    whyTitle?: string;
    whyBody?: string;
    pillars?: FeatureCard[];
    programsTitle?: string;
    programsPrimaryHeading?: string;
    programsPrimary?: string[];
    programsSecondaryHeading?: string;
    programsSecondary?: string[];
    programsClosing?: string;
    systemEyebrow?: string;
    systemTitle?: string;
    systemStages?: NumberedBlock[];
    systemCtaLabel?: string;
    systemCtaHref?: string;
    compareEyebrow?: string;
    compareTitle?: string;
    compareWithoutLabel?: string;
    compareWithLabel?: string;
    compareRows?: CompareRow[];
    teamEyebrow?: string;
    teamTitle?: string;
    teamSubhead?: string;
    teamMembers?: PersonCard[];
    teamCtaLabel?: string;
    teamCtaHref?: string;
    teamSecondaryLabel?: string;
    teamSecondaryHref?: string;
    leadMagnetEyebrow?: string;
    leadMagnetTitle?: string;
    leadMagnetBody?: string;
    leadMagnetForm?: FormCopy;
    provenEyebrow?: string;
    provenTitle?: string;
    provenStats?: StatCard[];
  };

export type ServicesDoc = SanityDocumentBase<'servicesPage'> &
  HeroFields & {
    seo?: Seo;
    serviceGroups?: ServiceGroup[];
    closingCta?: ClosingCta;
  };

export type SystemDoc = SanityDocumentBase<'systemPage'> &
  HeroFields & {
    seo?: Seo;
    stageLabels?: StagePill[];
    timelineHeader?: string;
    stages?: SystemStage[];
    closingCta?: ClosingCta;
  };

export type GlpDoc = SanityDocumentBase<'glpPage'> &
  HeroFields & {
    seo?: Seo;
    primaryCtaLabel?: string;
    primaryCtaHref?: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    whyEyebrow?: string;
    whyTitle?: string;
    whyCards?: FeatureCard[];
    stackEyebrow?: string;
    stackTitle?: string;
    stackItems?: NumberedBlock[];
    complianceEyebrow?: string;
    complianceTitle?: string;
    complianceBody?: string;
    compliancePoints?: FeatureCard[];
    closingCta?: ClosingCta;
  };

export type PricingDoc = SanityDocumentBase<'pricingPage'> &
  HeroFields & {
    seo?: Seo;
    intro?: string;
    tiers?: PricingTier[];
    recoveryEyebrow?: string;
    recoveryTitle?: string;
    recoveryBody?: string;
    recoveryPriceLabel?: string;
    recoveryTimeline?: string;
    recoveryCtaLabel?: string;
    recoveryCtaHref?: string;
    footerNoteBefore?: string;
    footerNoteLinkLabel?: string;
    footerNoteLinkHref?: string;
    newsletter?: FormCopy;
  };

export type LeadershipDoc = SanityDocumentBase<'leadershipPage'> &
  HeroFields & {
    seo?: Seo;
    founders?: PersonCard[];
    partnersTitle?: string;
    partnersSubhead?: string;
    partners?: PersonCard[];
    trackRecordTitle?: string;
    trackRecordItems?: string[];
  };

export type FaqDoc = SanityDocumentBase<'faqPage'> &
  HeroFields & {
    seo?: Seo;
    faqs?: FaqItem[];
    closingCta?: ClosingCta;
  };

export type ContactDoc = SanityDocumentBase<'contactPage'> &
  HeroFields & {
    seo?: Seo;
    bullets?: string[];
    form?: FormCopy;
  };

export type AiVoiceDoc = SanityDocumentBase<'aiVoicePage'> &
  HeroFields & {
    seo?: Seo;
    headlineHighlight?: string;
    liveBadge?: string;
    embedUrl?: string;
    iframeTitle?: string;
    demoCaption?: string;
    features?: FeatureCard[];
    closingCta?: ClosingCta;
  };

export type SiteSettings = SanityDocumentBase<'siteSettings'> & {
  brandName?: string;
  brandMark?: string;
  navItems?: Link[];
  navCtaLabel?: string;
  navCtaHref?: string;
  primaryCtaLabel?: string;
  footerBlurb?: string;
  footerLeadMagnetTitle?: string;
  footerLeadMagnet?: FormCopy;
  footerExploreHeading?: string;
  footerExploreLinks?: Link[];
  footerGetStartedHeading?: string;
  footerGetStartedLinks?: Link[];
  footerDisclaimer?: string;
};

export type PageDocument =
  | HomeDoc
  | ServicesDoc
  | SystemDoc
  | GlpDoc
  | PricingDoc
  | LeadershipDoc
  | FaqDoc
  | ContactDoc
  | AiVoiceDoc;
