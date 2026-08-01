/**
 * Seed Sanity singletons from current site copy.
 * Usage: SANITY_AUTH_TOKEN=... node scripts/seed-sanity.mjs
 */
import {createClient} from '@sanity/client'
import {readFileSync} from 'fs'

function env(name) {
  const fromProcess = process.env[name]
  if (fromProcess) return fromProcess
  try {
    const text = readFileSync(new URL('../.env', import.meta.url), 'utf8')
    const line = text.split('\n').find((l) => l.startsWith(`${name}=`))
    return line ? line.slice(name.length + 1).trim() : ''
  } catch {
    return ''
  }
}

const token = env('SANITY_AUTH_TOKEN')
if (!token) {
  console.error('Missing SANITY_AUTH_TOKEN')
  process.exit(1)
}

const client = createClient({
  projectId: '4rag8303',
  dataset: 'production',
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
})

const docs = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    navCtaLabel: 'Find Your Growth Gaps',
    primaryCtaLabel: 'Find the Gaps in Your Growth System',
    footerBlurb:
      'A boutique growth strategy and digital marketing studio for modern health clinics offering high-value GLP-1, peptide therapy, medical weight loss, hormone health, longevity, metabolic, functional health, and wellness programs.',
    leadMagnetTitle: "Top 10 reasons your clinic's ads are struggling on Meta",
    leadMagnetBody:
      'The rejection triggers, targeting mistakes, and landing-page gaps we see most — and what to fix first. Straight to your inbox.',
  },
  {
    _id: 'homePage',
    _type: 'homePage',
    seo: {
      title: 'Compound Growth Studio | Clinic Growth Strategy & Digital Marketing',
      description:
        'Visibility, education, trust, conversion, follow-up, and optimization — combined into one connected growth system for medically guided programs.',
    },
    eyebrow: 'Marketing for modern health clinics',
    headline: "The clinics that win aren't running better ads. They're running compliant ones.",
    subhead:
      'Visibility, education, trust, conversion, follow-up, and optimization — combined into one connected growth system for medically guided programs.',
    primaryCtaLabel: 'Find the Gaps in Your Growth System',
    secondaryCtaLabel: 'See the growth system →',
    secondaryCtaHref: '/system/',
    pillarsSectionTitle: 'Specialized Growth Strategy for High-Value Health Programs',
    pillars: [
      {
        _key: 'p1',
        title: 'We understand the patient journey',
        body: 'Patients need education, reassurance, and trust before they ever request a consultation.',
      },
      {
        _key: 'p2',
        title: 'We avoid hype-driven marketing',
        body: 'Responsible messaging, provider credibility, and claims clinics can review before publishing.',
      },
      {
        _key: 'p3',
        title: 'We build connected systems',
        body: 'Content, visibility, landing pages, follow-up, and reporting work together — not in silos.',
      },
      {
        _key: 'p4',
        title: 'We focus on consult-ready demand',
        body: 'Not just impressions — clearer education, stronger trust, and more qualified consultations.',
      },
    ],
    leadMagnetEyebrow: 'Free guide',
    leadMagnetTitle: "Top 10 reasons your clinic's ads are struggling on Meta.",
    leadMagnetBody:
      'The rejection triggers, targeting mistakes, and landing-page gaps we see most — and what to fix first. Straight to your inbox.',
  },
  {
    _id: 'servicesPage',
    _type: 'servicesPage',
    seo: {
      title: 'Marketing Services for Modern Health Clinics | Compound Growth Studio',
      description:
        'Local SEO, paid acquisition, treatment education, provider authority, conversion copy, follow-up, and reporting for modern health clinics.',
    },
    eyebrow: 'Services',
    headline: 'Marketing services for modern health clinics',
    subhead:
      'Connected work across visibility, education, trust, conversion, follow-up, and optimization.',
  },
  {
    _id: 'systemPage',
    _type: 'systemPage',
    seo: {
      title: 'The Clinic Growth System | Compound Growth Studio',
      description:
        'A six-stage growth system — visibility, education, trust, conversion, follow-up, and optimization — built for medically guided clinic programs.',
    },
    eyebrow: 'Growth system',
    headline: 'The Clinic Growth System',
    subhead: 'Six stages that compound — designed for medically guided programs.',
  },
  {
    _id: 'glpPage',
    _type: 'glpPage',
    seo: {
      title: 'GLP-1 + Peptide Marketing for Clinics | Compound Growth Studio',
      description:
        'Compliant Meta and Google campaigns, eligibility-first landing pages, and patient education for GLP-1 and peptide clinic programs.',
    },
    eyebrow: 'GLP-1 + Peptide',
    headline: 'GLP-1 + peptide marketing that clears review',
    subhead: 'Compliant acquisition, education, and conversion for high-value clinic programs.',
  },
  {
    _id: 'pricingPage',
    _type: 'pricingPage',
    seo: {
      title: 'Get Started | Compound Growth Studio',
      description:
        'Start with a clinic growth community, conversion foundation, full growth system, or a one-time ad account recovery — then scale what works.',
    },
    eyebrow: 'Get started',
    headline: 'Start small. Scale when it works.',
    subhead:
      'Four ways in — a compliant foundation, ongoing strategy, a full growth system, or a one-time fix when your ads are stuck.',
    intro: 'One path, four entry points — most clinics start in the middle and grow up.',
    tiers: [
      {
        _key: 't1',
        name: 'Clinic Growth Community',
        price: '$100',
        priceNote: '/month',
        description:
          'Strategy, ideas, and frameworks before execution — for clinics that want direction without a full engagement.',
        features: [
          'Practical clinic marketing guidance',
          'Patient education ideas and templates',
          'Frameworks you can apply immediately',
          'Strategy support before you commit',
        ],
        ctaLabel: 'Join the Community',
        ctaHref: '/contact/',
        featured: false,
      },
      {
        _key: 't2',
        eyebrow: 'Where most clinics start',
        name: 'Conversion Foundation',
        price: '$1,000',
        priceNote: '/month',
        description:
          'A managed acquisition foundation for one program: compliant landing page, intake flow, and continuous optimization. No setup fee, cancel anytime.',
        features: [
          'Compliant landing page + full intake flow',
          'Written to pass prescription-ad review',
          'Ongoing updates and A/B testing monthly',
          'Conversion tracking + monthly reporting',
          'Grows with you — add paid, SEO, or nurture',
        ],
        ctaLabel: 'Start With the Foundation',
        ctaHref: '/contact/',
        featured: true,
      },
      {
        _key: 't3',
        name: 'Full Growth System',
        price: 'Custom',
        priceNote: ' / retainer',
        description:
          'The complete six-stage system run as one engine — visibility, education, trust, conversion, follow-up, and optimization working together.',
        features: [
          'All six stages managed as one system',
          'Paid acquisition, local SEO, and content',
          'Provider authority + reputation systems',
          'Email/SMS nurture for the undecided',
          'Fractional growth leadership for your clinic',
        ],
        ctaLabel: 'Book a Growth Call',
        ctaHref: '/contact/',
        featured: false,
      },
    ],
    recoveryTitle: 'Ad Account Recovery',
    recoveryBody:
      'Ads rejected, account flagged, or campaigns stuck in review? We audit your setup, rebuild the copy and landing page for compliance, and get you clear to run — in a fixed two-week window, no retainer required.',
    recoveryCtaLabel: "See What's Included",
  },
  {
    _id: 'leadershipPage',
    _type: 'leadershipPage',
    seo: {
      title: 'Leadership | Compound Growth Studio',
      description:
        'Meet the operators behind Compound Growth Studio — experience scaling brands, healthcare networks, and high-growth demand systems.',
    },
    eyebrow: 'Leadership',
    headline: 'Operators, not account managers.',
    subhead:
      'Experience across healthcare, SaaS, fintech, B2B, consumer, media, and multi-location growth environments — applied to modern health clinics.',
    founders: [
      {
        _key: 'conor',
        name: 'Conor',
        role: 'Co-founder · Brand & Demand',
        bio: 'Supported B2B revenue growth from $20M to $150M through integrated strategy and demand generation, and built a global media brand to 300,000+ followers and 4B+ impressions.',
      },
      {
        _key: 'nick',
        name: 'Nick',
        role: 'Co-founder · Growth & Healthcare',
        bio: "Scaled Bitwage's U.S. ARR from zero to ~$25M as VP of Growth, and directed marketing for a PE-backed healthcare organization with 100+ locations across multiple states.",
      },
    ],
    partnersTitle: 'Specialist partners',
    partnersSubhead:
      'Co-founders lead the studio. Specialist partners support client delivery across creative, systems, and client experience.',
    partners: [
      {
        _key: 'tony',
        name: 'Tony Pardilla',
        role: 'Creative Partner, Design & Web',
        bio: 'Tony supports creative and web execution behind the studio’s clinic growth work — turning strategy into polished landing pages, campaign creative, visual systems, and conversion-focused digital experiences.',
        helps: [
          'Website design direction',
          'Landing pages',
          'Brand identity support',
          'Campaign creative',
          'Social templates',
          'Conversion-focused design',
        ],
      },
      {
        _key: 'chris',
        name: 'Chris Cyril',
        role: 'Systems & Technology Partner',
        bio: 'Chris supports the systems and technology layer behind the growth engine — connecting forms, tracking, CRM workflows, automation, integrations, analytics, and reporting.',
        helps: [
          'Lead form setup',
          'CRM workflow support',
          'Tracking',
          'Automation systems',
          'Funnel infrastructure',
          'Reporting systems',
        ],
      },
      {
        _key: 'jessica',
        name: 'Jessica Rodrigues',
        role: 'Client Experience Coordinator',
        bio: 'Jessica supports onboarding, communication, scheduling, follow-ups, asset collection, and project coordination — so clinic teams always know what is happening and what comes next.',
        helps: [
          'Onboarding',
          'Scheduling',
          'Client communication',
          'Follow-ups',
          'Asset collection',
          'Project coordination',
        ],
      },
    ],
  },
  {
    _id: 'faqPage',
    _type: 'faqPage',
    seo: {
      title: 'FAQ | Compound Growth Studio',
      description:
        'Answers about compliance, medical claim review, timelines, engagement options, and what to expect on a clinic growth gap call.',
    },
    eyebrow: 'FAQ',
    headline: 'Questions clinics ask before we start',
    subhead: 'Straight answers on compliance, scope, timelines, and how we work together.',
    faqs: [
      {
        _key: 'f1',
        question: 'Do you only work with GLP-1 and weight loss clinics?',
        answer:
          'Those are the most common, but the system applies to any medically guided program with a high-value consultation: peptide therapy, hormone health, longevity, metabolic and functional health, and wellness programs.',
      },
      {
        _key: 'f2',
        question: 'Can you keep our ads from getting rejected?',
        answer:
          'We structure pages, creative, and copy around prescription-advertising policy from the start — that is the single biggest reason clinic campaigns stall. We cannot guarantee a platform decision, but compliance is designed in rather than patched later.',
      },
      {
        _key: 'f3',
        question: 'Who approves medical claims?',
        answer:
          'You do. Every treatment detail, eligibility statement, and patient-facing clinical claim goes to your licensed providers for review before it publishes. We write for review, not around it.',
      },
      {
        _key: 'f4',
        question: 'How long until we see results?',
        answer:
          'Conversion work (landing pages, intake flows, follow-up) tends to show movement in the first 30–60 days. Visibility and education compound over 3–6 months. We report on both timelines so you can tell which is which.',
      },
      {
        _key: 'f5',
        question: 'Do we have to buy the whole system?',
        answer:
          'No. Most clinics start with one stage — usually Conversion — and add Visibility, Follow-Up, or Optimization as capacity and demand grow. The stages are built to connect later.',
      },
      {
        _key: 'f6',
        question: 'Will you work with our existing website or agency?',
        answer:
          'Yes. We often build alongside an existing site and hand off documentation. If you already have an agency running paid media, we can own conversion and follow-up and feed them better inputs.',
      },
      {
        _key: 'f7',
        question: 'What do you need from us to start?',
        answer:
          'Access to your site, ad accounts, and analytics; one clinical reviewer for content approval; and roughly an hour a month from someone who can answer program questions. We handle the rest.',
      },
      {
        _key: 'f8',
        question: 'What happens on the growth gap call?',
        answer:
          'Thirty minutes. We look at your visibility, your consult path, and your follow-up, then send a written summary of the gaps we found and what we would fix first — whether or not you hire us.',
      },
    ],
  },
  {
    _id: 'contactPage',
    _type: 'contactPage',
    seo: {
      title: 'Book a Clinic Growth Call | Compound Growth Studio',
      description:
        'Request a growth gap review for your clinic. We’ll identify acquisition opportunities, conversion gaps, and follow-up improvements.',
    },
    eyebrow: 'Clinic growth call',
    headline: 'Bring us the clinic. We’ll map the growth system.',
    subhead:
      'In one call, we’ll identify the clearest acquisition opportunities, conversion gaps, and follow-up improvements for your clinic.',
    submitLabel: 'Request My Growth Gap Review',
    submitNote: 'No obligation. We’ll never share your clinic details.',
  },
  {
    _id: 'aiVoicePage',
    _type: 'aiVoicePage',
    seo: {
      title: '24/7 AI Inbound Voice Agent | Compound Growth Studio',
      description:
        'A 24/7 AI inbound voice agent demo for clinics — answer calls, qualify interest, and keep the consult pipeline moving after hours.',
    },
    eyebrow: 'AI voice agent',
    headline: '24/7 AI inbound voice agent',
    subhead: 'Try the embedded demo — answers calls, qualifies interest, and books the next step.',
    embedUrl: 'https://midwest-exteriors-production.up.railway.app/receptionist/wellness?embed=1',
  },
]

const tx = client.transaction()
for (const doc of docs) {
  tx.createOrReplace(doc)
}
const result = await tx.commit()
console.log(`Seeded ${docs.length} documents`, result.results?.length ?? '')
