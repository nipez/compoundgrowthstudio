import {defineField, defineType} from 'sanity'

const seoField = defineField({name: 'seo', title: 'SEO', type: 'seo'})

const heroFields = [
  defineField({name: 'eyebrow', title: 'Eyebrow', type: 'string'}),
  defineField({name: 'headline', title: 'Headline', type: 'string'}),
  defineField({name: 'subhead', title: 'Supporting text', type: 'text', rows: 3}),
]

export const homePage = defineType({
  name: 'homePage',
  title: 'Home',
  type: 'document',
  fields: [
    seoField,
    ...heroFields,
    defineField({name: 'primaryCtaLabel', title: 'Primary CTA label', type: 'string'}),
    defineField({name: 'secondaryCtaLabel', title: 'Secondary CTA label', type: 'string'}),
    defineField({name: 'secondaryCtaHref', title: 'Secondary CTA href', type: 'string'}),
    defineField({
      name: 'pillarsSectionTitle',
      title: 'Why-us section title',
      type: 'string',
    }),
    defineField({name: 'pillars', title: 'Pillars', type: 'array', of: [{type: 'pillar'}]}),
    defineField({
      name: 'leadMagnetEyebrow',
      title: 'Lead magnet eyebrow',
      type: 'string',
    }),
    defineField({name: 'leadMagnetTitle', title: 'Lead magnet title', type: 'string'}),
    defineField({name: 'leadMagnetBody', title: 'Lead magnet body', type: 'text', rows: 3}),
  ],
  preview: {prepare: () => ({title: 'Home'})},
})

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services',
  type: 'document',
  fields: [seoField, ...heroFields],
  preview: {prepare: () => ({title: 'Services'})},
})

export const systemPage = defineType({
  name: 'systemPage',
  title: 'Growth System',
  type: 'document',
  fields: [seoField, ...heroFields],
  preview: {prepare: () => ({title: 'Growth System'})},
})

export const glpPage = defineType({
  name: 'glpPage',
  title: 'GLP-1 + Peptide Marketing',
  type: 'document',
  fields: [seoField, ...heroFields],
  preview: {prepare: () => ({title: 'GLP-1 + Peptide Marketing'})},
})

export const pricingPage = defineType({
  name: 'pricingPage',
  title: 'Get Started / Pricing',
  type: 'document',
  fields: [
    seoField,
    ...heroFields,
    defineField({name: 'intro', title: 'Intro under hero', type: 'string'}),
    defineField({name: 'tiers', title: 'Pricing tiers', type: 'array', of: [{type: 'pricingTier'}]}),
    defineField({
      name: 'recoveryTitle',
      title: 'Ad account recovery title',
      type: 'string',
    }),
    defineField({
      name: 'recoveryBody',
      title: 'Ad account recovery body',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'recoveryCtaLabel',
      title: 'Ad account recovery CTA',
      type: 'string',
    }),
  ],
  preview: {prepare: () => ({title: 'Get Started / Pricing'})},
})

export const leadershipPage = defineType({
  name: 'leadershipPage',
  title: 'Leadership',
  type: 'document',
  fields: [
    seoField,
    ...heroFields,
    defineField({name: 'founders', title: 'Founders', type: 'array', of: [{type: 'personCard'}]}),
    defineField({
      name: 'partnersTitle',
      title: 'Partners section title',
      type: 'string',
    }),
    defineField({
      name: 'partnersSubhead',
      title: 'Partners section subhead',
      type: 'text',
      rows: 2,
    }),
    defineField({name: 'partners', title: 'Partners', type: 'array', of: [{type: 'personCard'}]}),
  ],
  preview: {prepare: () => ({title: 'Leadership'})},
})

export const faqPage = defineType({
  name: 'faqPage',
  title: 'FAQ',
  type: 'document',
  fields: [
    seoField,
    ...heroFields,
    defineField({name: 'faqs', title: 'Questions', type: 'array', of: [{type: 'faqItem'}]}),
  ],
  preview: {prepare: () => ({title: 'FAQ'})},
})

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact',
  type: 'document',
  fields: [
    seoField,
    ...heroFields,
    defineField({
      name: 'submitLabel',
      title: 'Submit button label',
      type: 'string',
    }),
    defineField({
      name: 'submitNote',
      title: 'Submit note',
      type: 'string',
    }),
  ],
  preview: {prepare: () => ({title: 'Contact'})},
})

export const aiVoicePage = defineType({
  name: 'aiVoicePage',
  title: 'AI Voice Agent',
  type: 'document',
  fields: [
    seoField,
    ...heroFields,
    defineField({
      name: 'embedUrl',
      title: 'Demo embed URL',
      type: 'url',
    }),
  ],
  preview: {prepare: () => ({title: 'AI Voice Agent'})},
})
