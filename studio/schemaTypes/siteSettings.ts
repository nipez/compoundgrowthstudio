import {defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'navCtaLabel',
      title: 'Nav CTA label',
      type: 'string',
      initialValue: 'Find Your Growth Gaps',
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA label',
      type: 'string',
      initialValue: 'Find the Gaps in Your Growth System',
    }),
    defineField({
      name: 'footerBlurb',
      title: 'Footer blurb',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'leadMagnetTitle',
      title: 'Lead magnet title',
      type: 'string',
    }),
    defineField({
      name: 'leadMagnetBody',
      title: 'Lead magnet body',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
