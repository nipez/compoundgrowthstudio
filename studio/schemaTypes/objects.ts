import {defineArrayMember, defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
  ],
})

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'href', type: 'string', validation: (r) => r.required()}),
  ],
})

export const cta = defineType({
  name: 'cta',
  title: 'Button / CTA',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'href', type: 'string', validation: (r) => r.required()}),
  ],
})

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'object',
  fields: [
    defineField({name: 'question', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'answer', type: 'text', rows: 5, validation: (r) => r.required()}),
  ],
  preview: {select: {title: 'question'}},
})

export const featureCard = defineType({
  name: 'featureCard',
  title: 'Feature card',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'body', type: 'text', rows: 4}),
  ],
  preview: {select: {title: 'title'}},
})

export const numberedBlock = defineType({
  name: 'numberedBlock',
  title: 'Numbered block',
  type: 'object',
  fields: [
    defineField({name: 'number', type: 'string'}),
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'body', type: 'text', rows: 4}),
  ],
  preview: {select: {title: 'title', subtitle: 'number'}},
})

export const stagePill = defineType({
  name: 'stagePill',
  title: 'Stage pill',
  type: 'object',
  fields: [
    defineField({name: 'number', type: 'string'}),
    defineField({name: 'title', type: 'string'}),
  ],
  preview: {select: {title: 'title', subtitle: 'number'}},
})

export const statCard = defineType({
  name: 'statCard',
  title: 'Stat / metric',
  type: 'object',
  fields: [
    defineField({name: 'value', type: 'string'}),
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'label', type: 'string'}),
    defineField({name: 'body', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'value', subtitle: 'title'}},
})

export const pricingTier = defineType({
  name: 'pricingTier',
  title: 'Pricing tier',
  type: 'object',
  fields: [
    defineField({name: 'badge', type: 'string', description: 'Optional badge above the name'}),
    defineField({name: 'name', type: 'string'}),
    defineField({name: 'price', type: 'string'}),
    defineField({name: 'period', type: 'string', description: 'e.g. /month'}),
    defineField({name: 'description', type: 'text', rows: 3}),
    defineField({
      name: 'features',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'ctaLabel', type: 'string'}),
    defineField({name: 'ctaHref', type: 'string'}),
    defineField({name: 'highlighted', type: 'boolean', initialValue: false}),
  ],
  preview: {select: {title: 'name', subtitle: 'price'}},
})

export const serviceItem = defineType({
  name: 'serviceItem',
  title: 'Service item',
  type: 'object',
  fields: [
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'body', type: 'text', rows: 3}),
  ],
  preview: {select: {title: 'title'}},
})

export const serviceGroup = defineType({
  name: 'serviceGroup',
  title: 'Service group',
  type: 'object',
  fields: [
    defineField({name: 'number', type: 'string', description: 'e.g. Stage 1'}),
    defineField({name: 'stage', type: 'string', description: 'e.g. Visibility'}),
    defineField({
      name: 'items',
      type: 'array',
      of: [defineArrayMember({type: 'serviceItem'})],
    }),
  ],
  preview: {select: {title: 'stage', subtitle: 'number'}},
})

export const systemStage = defineType({
  name: 'systemStage',
  title: 'System stage',
  type: 'object',
  fields: [
    defineField({name: 'number', type: 'string'}),
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'tag', type: 'string', description: 'Short tagline'}),
    defineField({name: 'desc', title: 'Description', type: 'text', rows: 4}),
    defineField({
      name: 'builds',
      title: 'What we build',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({name: 'handoffLabel', type: 'string'}),
    defineField({name: 'handoff', type: 'string'}),
  ],
  preview: {select: {title: 'title', subtitle: 'number'}},
})

export const personCard = defineType({
  name: 'personCard',
  title: 'Person',
  type: 'object',
  fields: [
    defineField({name: 'name', type: 'string'}),
    defineField({name: 'role', type: 'string'}),
    defineField({name: 'bio', type: 'text', rows: 5}),
    defineField({
      name: 'photoUrl',
      title: 'Photo URL',
      type: 'string',
      description: 'Path like /images/conor.jpg or a full URL',
    }),
    defineField({name: 'photoAlt', type: 'string'}),
    defineField({
      name: 'helps',
      title: 'Helps with',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'role'}},
})

export const closingCta = defineType({
  name: 'closingCta',
  title: 'Closing CTA',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', type: 'string'}),
    defineField({name: 'title', type: 'string'}),
    defineField({name: 'body', type: 'text', rows: 3}),
    defineField({name: 'ctaLabel', type: 'string'}),
    defineField({name: 'ctaHref', type: 'string'}),
  ],
})

export const formCopy = defineType({
  name: 'formCopy',
  title: 'Form copy',
  type: 'object',
  fields: [
    defineField({name: 'emailPlaceholder', type: 'string'}),
    defineField({name: 'namePlaceholder', type: 'string'}),
    defineField({name: 'clinicPlaceholder', type: 'string'}),
    defineField({name: 'messagePlaceholder', type: 'string'}),
    defineField({name: 'newsletterCheckboxLabel', type: 'string'}),
    defineField({name: 'submitLabelIdle', type: 'string'}),
    defineField({name: 'submitLabelDone', type: 'string'}),
    defineField({name: 'noteIdle', type: 'string'}),
    defineField({name: 'noteDone', type: 'string'}),
  ],
})
