import {defineArrayMember, defineField, defineType} from 'sanity'

const seoField = defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'})

const heroFields = [
  defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string', group: 'hero'}),
  defineField({name: 'headline', title: 'Headline', type: 'string', group: 'hero'}),
  defineField({
    name: 'subhead',
    title: 'Supporting text',
    type: 'text',
    rows: 3,
    group: 'hero',
  }),
]

const groups = [
  {name: 'hero', title: 'Hero', default: true},
  {name: 'content', title: 'Content'},
  {name: 'seo', title: 'SEO'},
]

export const homePage = defineType({
  name: 'homePage',
  title: 'Home',
  type: 'document',
  groups,
  fields: [
    seoField,
    ...heroFields,
    defineField({name: 'primaryCtaLabel', type: 'string', group: 'hero'}),
    defineField({name: 'primaryCtaHref', type: 'string', group: 'hero', initialValue: '/contact/'}),
    defineField({name: 'secondaryCtaLabel', type: 'string', group: 'hero'}),
    defineField({name: 'secondaryCtaHref', type: 'string', group: 'hero'}),
    defineField({
      name: 'heroStats',
      title: 'Hero floating stats',
      type: 'array',
      group: 'hero',
      of: [defineArrayMember({type: 'statCard'})],
    }),
    defineField({
      name: 'heroSupport',
      title: 'Line under hero',
      type: 'text',
      rows: 2,
      group: 'hero',
      description: 'Shown directly under the hero section',
    }),
    defineField({
      name: 'marqueeItems',
      title: 'Marquee phrases',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'whyEyebrow', type: 'string', group: 'content'}),
    defineField({name: 'whyTitle', type: 'string', group: 'content'}),
    defineField({name: 'whyBody', type: 'text', rows: 3, group: 'content'}),
    defineField({
      name: 'pillars',
      title: 'Why-us pillars',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'featureCard'})],
    }),
    defineField({name: 'systemEyebrow', type: 'string', group: 'content'}),
    defineField({name: 'systemTitle', type: 'string', group: 'content'}),
    defineField({
      name: 'systemStages',
      title: 'Home system stages',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'numberedBlock'})],
    }),
    defineField({name: 'systemCtaLabel', type: 'string', group: 'content'}),
    defineField({name: 'systemCtaHref', type: 'string', group: 'content'}),
    defineField({name: 'leadMagnetEyebrow', type: 'string', group: 'content'}),
    defineField({name: 'leadMagnetTitle', type: 'string', group: 'content'}),
    defineField({name: 'leadMagnetBody', type: 'text', rows: 3, group: 'content'}),
    defineField({
      name: 'leadMagnetForm',
      title: 'Lead magnet form copy',
      type: 'formCopy',
      group: 'content',
    }),
    defineField({name: 'provenEyebrow', type: 'string', group: 'content'}),
    defineField({name: 'provenTitle', type: 'string', group: 'content'}),
    defineField({
      name: 'provenStats',
      title: 'Proven experience stats',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'statCard'})],
    }),
  ],
  preview: {prepare: () => ({title: 'Home'})},
})

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services',
  type: 'document',
  groups,
  fields: [
    seoField,
    ...heroFields,
    defineField({
      name: 'serviceGroups',
      title: 'Service groups',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'serviceGroup'})],
    }),
    defineField({
      name: 'closingCta',
      title: 'Closing CTA',
      type: 'closingCta',
      group: 'content',
    }),
  ],
  preview: {prepare: () => ({title: 'Services'})},
})

export const systemPage = defineType({
  name: 'systemPage',
  title: 'Growth System',
  type: 'document',
  groups,
  fields: [
    seoField,
    ...heroFields,
    defineField({
      name: 'stageLabels',
      title: 'Hero stage pills',
      type: 'array',
      group: 'hero',
      of: [defineArrayMember({type: 'stagePill'})],
    }),
    defineField({
      name: 'timelineHeader',
      title: 'Header above timeline',
      type: 'text',
      rows: 2,
      group: 'content',
    }),
    defineField({
      name: 'stages',
      title: 'Stage details',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'systemStage'})],
    }),
    defineField({
      name: 'closingCta',
      title: 'Closing CTA',
      type: 'closingCta',
      group: 'content',
    }),
  ],
  preview: {prepare: () => ({title: 'Growth System'})},
})

export const glpPage = defineType({
  name: 'glpPage',
  title: 'GLP-1 + Peptide Marketing',
  type: 'document',
  groups,
  fields: [
    seoField,
    ...heroFields,
    defineField({name: 'primaryCtaLabel', type: 'string', group: 'hero'}),
    defineField({name: 'primaryCtaHref', type: 'string', group: 'hero'}),
    defineField({name: 'secondaryCtaLabel', type: 'string', group: 'hero'}),
    defineField({name: 'secondaryCtaHref', type: 'string', group: 'hero'}),
    defineField({name: 'whyEyebrow', type: 'string', group: 'content'}),
    defineField({name: 'whyTitle', type: 'string', group: 'content'}),
    defineField({
      name: 'whyCards',
      title: 'Why different cards',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'featureCard'})],
    }),
    defineField({name: 'stackEyebrow', type: 'string', group: 'content'}),
    defineField({name: 'stackTitle', type: 'string', group: 'content'}),
    defineField({
      name: 'stackItems',
      title: 'Growth stack items',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'numberedBlock'})],
    }),
    defineField({name: 'complianceEyebrow', type: 'string', group: 'content'}),
    defineField({name: 'complianceTitle', type: 'string', group: 'content'}),
    defineField({name: 'complianceBody', type: 'text', rows: 4, group: 'content'}),
    defineField({
      name: 'compliancePoints',
      title: 'Compliance points',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'featureCard'})],
    }),
    defineField({
      name: 'closingCta',
      title: 'Closing CTA',
      type: 'closingCta',
      group: 'content',
    }),
  ],
  preview: {prepare: () => ({title: 'GLP-1 + Peptide Marketing'})},
})

export const pricingPage = defineType({
  name: 'pricingPage',
  title: 'Get Started / Pricing',
  type: 'document',
  groups,
  fields: [
    seoField,
    ...heroFields,
    defineField({name: 'intro', title: 'Intro under hero', type: 'string', group: 'content'}),
    defineField({
      name: 'tiers',
      title: 'Pricing tiers',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'pricingTier'})],
    }),
    defineField({name: 'recoveryEyebrow', type: 'string', group: 'content'}),
    defineField({name: 'recoveryTitle', type: 'string', group: 'content'}),
    defineField({name: 'recoveryBody', type: 'text', rows: 4, group: 'content'}),
    defineField({name: 'recoveryPriceLabel', type: 'string', group: 'content'}),
    defineField({name: 'recoveryTimeline', type: 'string', group: 'content'}),
    defineField({name: 'recoveryCtaLabel', type: 'string', group: 'content'}),
    defineField({name: 'recoveryCtaHref', type: 'string', group: 'content'}),
    defineField({name: 'footerNoteBefore', type: 'string', group: 'content'}),
    defineField({name: 'footerNoteLinkLabel', type: 'string', group: 'content'}),
    defineField({name: 'footerNoteLinkHref', type: 'string', group: 'content'}),
    defineField({
      name: 'newsletter',
      title: 'Newsletter form',
      type: 'formCopy',
      group: 'content',
    }),
  ],
  preview: {prepare: () => ({title: 'Get Started / Pricing'})},
})

export const leadershipPage = defineType({
  name: 'leadershipPage',
  title: 'Leadership',
  type: 'document',
  groups,
  fields: [
    seoField,
    ...heroFields,
    defineField({
      name: 'founders',
      title: 'Founders',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'personCard'})],
    }),
    defineField({name: 'partnersTitle', type: 'string', group: 'content'}),
    defineField({name: 'partnersSubhead', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'partners',
      title: 'Partners',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'personCard'})],
    }),
    defineField({name: 'trackRecordTitle', type: 'string', group: 'content'}),
    defineField({
      name: 'trackRecordItems',
      title: 'Track record items',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
  preview: {prepare: () => ({title: 'Leadership'})},
})

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ',
  type: 'document',
  groups,
  fields: [
    seoField,
    ...heroFields,
    defineField({
      name: 'faqs',
      title: 'Questions',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'faqItem'})],
    }),
    defineField({
      name: 'closingCta',
      title: 'Closing CTA',
      type: 'closingCta',
      group: 'content',
    }),
  ],
  preview: {prepare: () => ({title: 'FAQ'})},
})

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  groups,
  fields: [
    seoField,
    ...heroFields,
    defineField({
      name: 'bullets',
      title: 'Benefit bullets',
      type: 'array',
      group: 'hero',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'form',
      title: 'Form copy',
      type: 'formCopy',
      group: 'content',
    }),
  ],
  preview: {prepare: () => ({title: 'Contact'})},
})

export const aiVoicePage = defineType({
  name: 'aiVoicePage',
  title: 'AI Voice Agent',
  type: 'document',
  groups,
  fields: [
    seoField,
    ...heroFields,
    defineField({
      name: 'headlineHighlight',
      title: 'Headline highlight phrase',
      type: 'string',
      group: 'hero',
      description: 'Optional phrase within the headline to emphasize',
    }),
    defineField({name: 'liveBadge', type: 'string', group: 'hero'}),
    defineField({
      name: 'embedUrl',
      title: 'Demo embed URL',
      type: 'url',
      group: 'content',
    }),
    defineField({name: 'iframeTitle', type: 'string', group: 'content'}),
    defineField({name: 'demoCaption', type: 'text', rows: 2, group: 'content'}),
    defineField({
      name: 'features',
      title: 'Feature cards',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'featureCard'})],
    }),
    defineField({
      name: 'closingCta',
      title: 'Closing CTA',
      type: 'closingCta',
      group: 'content',
    }),
  ],
  preview: {prepare: () => ({title: 'AI Voice Agent'})},
})
