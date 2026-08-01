import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Page title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (r) => r.required(),
    }),
  ],
})

export const ctaLink = defineType({
  name: 'ctaLink',
  title: 'CTA link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string'}),
    defineField({name: 'href', title: 'URL path', type: 'string'}),
  ],
})

export const textBlock = defineType({
  name: 'textBlock',
  title: 'Title + body',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
  ],
})

export const pillar = defineType({
  name: 'pillar',
  title: 'Pillar',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'body', title: 'Body', type: 'text', rows: 3}),
  ],
})

export const pricingTier = defineType({
  name: 'pricingTier',
  title: 'Pricing tier',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Eyebrow / badge', type: 'string'}),
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'price', title: 'Price', type: 'string'}),
    defineField({name: 'priceNote', title: 'Price note', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
    defineField({name: 'features', title: 'Features', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'ctaLabel', title: 'CTA label', type: 'string'}),
    defineField({name: 'ctaHref', title: 'CTA href', type: 'string'}),
    defineField({name: 'featured', title: 'Featured (highlighted)', type: 'boolean', initialValue: false}),
  ],
})

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'object',
  fields: [
    defineField({name: 'question', title: 'Question', type: 'string'}),
    defineField({name: 'answer', title: 'Answer', type: 'text', rows: 4}),
  ],
})

export const personCard = defineType({
  name: 'personCard',
  title: 'Person',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'role', title: 'Role', type: 'string'}),
    defineField({name: 'bio', title: 'Bio', type: 'text', rows: 4}),
    defineField({name: 'image', title: 'Photo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'helps', title: 'Helps with', type: 'array', of: [{type: 'string'}]}),
  ],
})
