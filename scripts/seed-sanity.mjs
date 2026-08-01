/**
 * Seed Sanity singletons from extracted site copy.
 * Usage: node scripts/seed-sanity.mjs
 */
import {createClient} from '@sanity/client'
import {readFileSync} from 'fs'
import {fileURLToPath} from 'url'
import {dirname, join} from 'path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function env(name) {
  const fromProcess = process.env[name]
  if (fromProcess) return fromProcess
  try {
    const text = readFileSync(join(root, '.env'), 'utf8')
    const line = text.split('\n').find((l) => l.startsWith(`${name}=`))
    return line ? line.slice(name.length + 1).trim() : ''
  } catch {
    return ''
  }
}

function key(prefix, i) {
  return `${prefix}${i + 1}`
}

function withKeys(arr, prefix) {
  return (arr || []).map((item, i) =>
    typeof item === 'string'
      ? item
      : {_key: item._key || key(prefix, i), ...item},
  )
}

const token = env('SANITY_AUTH_TOKEN')
if (!token) {
  console.error('Missing SANITY_AUTH_TOKEN')
  process.exit(1)
}

const extract = JSON.parse(readFileSync(join(root, 'scripts/data/sanity-content.json'), 'utf8'))

const seo = {
  homePage: {
    title: 'Compound Growth Studio | Clinic Growth Strategy & Digital Marketing',
    description:
      'Visibility, education, trust, conversion, follow-up, and optimization — combined into one connected growth system for medically guided programs.',
  },
  servicesPage: {
    title: 'Marketing Services for Modern Health Clinics | Compound Growth Studio',
    description:
      'Local SEO, paid acquisition, treatment education, provider authority, conversion copy, follow-up, and reporting for modern health clinics.',
  },
  systemPage: {
    title: 'The Clinic Growth System | Compound Growth Studio',
    description:
      'A six-stage growth system — visibility, education, trust, conversion, follow-up, and optimization — built for medically guided clinic programs.',
  },
  glpPage: {
    title: 'GLP-1 + Peptide Marketing for Clinics | Compound Growth Studio',
    description:
      'Compliant Meta and Google campaigns, eligibility-first landing pages, and patient education for GLP-1 and peptide clinic programs.',
  },
  pricingPage: {
    title: 'Get Started | Compound Growth Studio',
    description:
      'Start with a clinic growth community, conversion foundation, full growth system, or a one-time ad account recovery — then scale what works.',
  },
  leadershipPage: {
    title: 'Leadership | Compound Growth Studio',
    description:
      'Meet the operators behind Compound Growth Studio — experience scaling brands, healthcare networks, and high-growth demand systems.',
  },
  faqPage: {
    title: 'FAQ | Compound Growth Studio',
    description:
      'Answers about compliance, medical claim review, timelines, engagement options, and what to expect on a clinic growth gap call.',
  },
  contactPage: {
    title: 'Book a Clinic Growth Call | Compound Growth Studio',
    description:
      'Request a growth gap review for your clinic. We’ll identify acquisition opportunities, conversion gaps, and follow-up improvements.',
  },
  aiVoicePage: {
    title: '24/7 AI Inbound Voice Agent | Compound Growth Studio',
    description:
      'A 24/7 AI inbound voice agent demo for clinics — answer calls, qualify interest, and keep the consult pipeline moving after hours.',
  },
}

const h = extract.homePage
const s = extract.servicesPage
const sys = extract.systemPage
const g = extract.glpPage
const p = extract.pricingPage
const l = extract.leadershipPage
const f = extract.faqPage
const c = extract.contactPage
const a = extract.aiVoicePage
const settings = extract.siteSettings

const docs = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    brandName: settings.brand.name,
    brandMark: settings.brand.mark,
    navItems: withKeys(settings.nav.items, 'nav'),
    navCtaLabel: settings.nav.cta.label,
    navCtaHref: settings.nav.cta.href,
    primaryCtaLabel: settings.primaryCtaLabel,
    footerBlurb: settings.footer.blurb,
    footerLeadMagnetTitle: settings.footer.leadMagnet.title,
    footerLeadMagnet: {
      emailPlaceholder: settings.footer.leadMagnet.emailPlaceholder,
      submitLabelIdle: settings.footer.leadMagnet.submitLabelIdle,
      submitLabelDone: settings.footer.leadMagnet.submitLabelDone,
    },
    footerExploreHeading: settings.footer.explore.heading,
    footerExploreLinks: withKeys(settings.footer.explore.links, 'ex'),
    footerGetStartedHeading: settings.footer.getStarted.heading,
    footerGetStartedLinks: withKeys(settings.footer.getStarted.links, 'gs'),
    footerDisclaimer: settings.footer.disclaimer,
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    seo: seo.homePage,
    eyebrow: h.hero.eyebrow,
    headline: h.hero.headline,
    subhead: h.hero.subhead,
    primaryCtaLabel: h.hero.primaryCta.label,
    primaryCtaHref: h.hero.primaryCta.href,
    secondaryCtaLabel: h.hero.secondaryCta.label,
    secondaryCtaHref: h.hero.secondaryCta.href,
    heroStats: withKeys(h.heroStats, 'hs'),
    heroSupport: h.heroSupport,
    marqueeItems: h.marqueeItems,
    whyEyebrow: h.whyUs.eyebrow,
    whyTitle: h.whyUs.title,
    whyBody: h.whyUs.body,
    pillars: withKeys(h.whyUs.cards, 'p'),
    systemEyebrow: h.growthSystem.eyebrow,
    systemTitle: h.growthSystem.title,
    systemStages: withKeys(h.growthSystem.stages, 'ss'),
    systemCtaLabel: h.growthSystem.cta.label,
    systemCtaHref: h.growthSystem.cta.href,
    leadMagnetEyebrow: h.leadMagnet.eyebrow,
    leadMagnetTitle: h.leadMagnet.title,
    leadMagnetBody: h.leadMagnet.body,
    leadMagnetForm: h.leadMagnet.form,
    provenEyebrow: h.provenExperience.eyebrow,
    provenTitle: h.provenExperience.title,
    provenStats: withKeys(h.provenExperience.stats, 'ps'),
  },
  {
    _id: 'servicesPage',
    _type: 'servicesPage',
    seo: seo.servicesPage,
    eyebrow: s.hero.eyebrow,
    headline: s.hero.headline,
    subhead: s.hero.subhead,
    serviceGroups: withKeys(
      s.serviceGroups.map((grp, i) => ({
        _key: key('sg', i),
        number: grp.number,
        stage: grp.stage,
        items: withKeys(grp.items, `sgi${i}`),
      })),
      'sg',
    ),
    closingCta: {
      eyebrow: s.closingCta.eyebrow,
      title: s.closingCta.title,
      body: s.closingCta.body,
      ctaLabel: s.closingCta.cta.label,
      ctaHref: s.closingCta.cta.href,
    },
  },
  {
    _id: 'systemPage',
    _type: 'systemPage',
    seo: seo.systemPage,
    eyebrow: sys.hero.eyebrow,
    headline: sys.hero.headline,
    subhead: sys.hero.subhead,
    stageLabels: withKeys(sys.hero.stageLabels, 'sl'),
    timelineHeader: sys.timelineHeader,
    stages: withKeys(sys.stages, 'st'),
    closingCta: {
      eyebrow: sys.closingCta.eyebrow,
      title: sys.closingCta.title,
      body: sys.closingCta.body,
      ctaLabel: sys.closingCta.cta.label,
      ctaHref: sys.closingCta.cta.href,
    },
  },
  {
    _id: 'glpPage',
    _type: 'glpPage',
    seo: seo.glpPage,
    eyebrow: g.hero.eyebrow,
    headline: g.hero.headline,
    subhead: g.hero.subhead,
    primaryCtaLabel: g.hero.primaryCta.label,
    primaryCtaHref: g.hero.primaryCta.href,
    secondaryCtaLabel: g.hero.secondaryCta.label,
    secondaryCtaHref: g.hero.secondaryCta.href,
    whyEyebrow: g.whyDifferent.eyebrow,
    whyTitle: g.whyDifferent.title,
    whyCards: withKeys(g.whyDifferent.cards, 'wc'),
    stackEyebrow: g.whatWeBuild.eyebrow,
    stackTitle: g.whatWeBuild.title,
    stackItems: withKeys(g.whatWeBuild.items, 'si'),
    complianceEyebrow: g.compliance.eyebrow,
    complianceTitle: g.compliance.title,
    complianceBody: g.compliance.body,
    compliancePoints: withKeys(g.compliance.points, 'cp'),
    closingCta: {
      eyebrow: g.closingCta.eyebrow,
      title: g.closingCta.title,
      body: g.closingCta.body,
      ctaLabel: g.closingCta.cta.label,
      ctaHref: g.closingCta.cta.href,
    },
  },
  {
    _id: 'pricingPage',
    _type: 'pricingPage',
    seo: seo.pricingPage,
    eyebrow: p.hero.eyebrow,
    headline: p.hero.headline,
    subhead: p.hero.subhead,
    intro: p.intro,
    tiers: withKeys(
      p.tiers.map((t) => ({
        badge: t.badge || undefined,
        name: t.name,
        price: t.price,
        period: t.period,
        description: t.description,
        features: t.features,
        ctaLabel: t.cta.label,
        ctaHref: t.cta.href,
        highlighted: Boolean(t.highlighted),
      })),
      't',
    ),
    recoveryEyebrow: p.recovery.eyebrow,
    recoveryTitle: p.recovery.title,
    recoveryBody: p.recovery.body,
    recoveryPriceLabel: p.recovery.priceLabel,
    recoveryTimeline: p.recovery.timeline,
    recoveryCtaLabel: p.recovery.cta.label,
    recoveryCtaHref: p.recovery.cta.href,
    footerNoteBefore: p.footerNote.textBeforeLink,
    footerNoteLinkLabel: p.footerNote.linkLabel,
    footerNoteLinkHref: p.footerNote.linkHref,
    newsletter: p.newsletter,
  },
  {
    _id: 'leadershipPage',
    _type: 'leadershipPage',
    seo: seo.leadershipPage,
    eyebrow: l.hero.eyebrow,
    headline: l.hero.headline,
    subhead: l.hero.subhead,
    founders: withKeys(l.founders, 'f'),
    partnersTitle: l.partnersSection.title,
    partnersSubhead: l.partnersSection.subhead,
    partners: withKeys(l.partnersSection.partners, 'pr'),
    trackRecordTitle: l.trackRecord.title,
    trackRecordItems: l.trackRecord.items,
  },
  {
    _id: 'faqPage',
    _type: 'faqPage',
    seo: seo.faqPage,
    eyebrow: f.hero.eyebrow,
    headline: f.hero.headline,
    subhead: f.hero.subhead || undefined,
    faqs: withKeys(f.faqs, 'fq'),
    closingCta: {
      title: f.closingCta.title,
      body: f.closingCta.body,
      ctaLabel: f.closingCta.cta.label,
      ctaHref: f.closingCta.cta.href,
    },
  },
  {
    _id: 'contactPage',
    _type: 'contactPage',
    seo: seo.contactPage,
    eyebrow: c.hero.eyebrow,
    headline: c.hero.headline,
    subhead: c.hero.subhead,
    bullets: c.bullets,
    form: {
      namePlaceholder: c.form.fields.find((x) => x.name === 'name')?.placeholder,
      clinicPlaceholder: c.form.fields.find((x) => x.name === 'clinic')?.placeholder,
      emailPlaceholder: c.form.fields.find((x) => x.name === 'email')?.placeholder,
      messagePlaceholder: c.form.fields.find((x) => x.name === 'message')?.placeholder,
      newsletterCheckboxLabel: c.form.newsletterCheckboxLabel,
      submitLabelIdle: c.form.submitLabelIdle,
      submitLabelDone: c.form.submitLabelDone,
      noteIdle: c.form.noteIdle,
      noteDone: c.form.noteDone,
    },
  },
  {
    _id: 'aiVoicePage',
    _type: 'aiVoicePage',
    seo: seo.aiVoicePage,
    eyebrow: a.hero.eyebrow,
    headline: a.hero.headline,
    headlineHighlight: a.hero.headlineHighlight,
    subhead: a.hero.subhead,
    liveBadge: a.hero.liveBadge,
    embedUrl: a.demo.embedUrl,
    iframeTitle: a.demo.iframeTitle,
    demoCaption: a.demo.caption,
    features: withKeys(a.features, 'af'),
    closingCta: {
      title: a.closingCta.title,
      body: a.closingCta.body,
      ctaLabel: a.closingCta.cta.label,
      ctaHref: a.closingCta.cta.href,
    },
  },
]

const client = createClient({
  projectId: '4rag8303',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

const tx = client.transaction()
for (const doc of docs) tx.createOrReplace(doc)
const result = await tx.commit()
console.log(`Seeded ${docs.length} documents`, result.results?.length ?? '')
