import type {StructureResolver} from 'sanity/structure'

const singleton = (S: any, type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .child(S.document().schemaType(type).documentId(type).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singleton(S, 'siteSettings', 'Site settings'),
      S.divider(),
      singleton(S, 'homePage', 'Home'),
      singleton(S, 'servicesPage', 'Services'),
      singleton(S, 'systemPage', 'Growth System'),
      singleton(S, 'glpPage', 'GLP-1 + Peptide Marketing'),
      singleton(S, 'pricingPage', 'Get Started / Pricing'),
      singleton(S, 'leadershipPage', 'Leadership'),
      singleton(S, 'faqPage', 'FAQ'),
      singleton(S, 'contactPage', 'Contact'),
      singleton(S, 'aiVoicePage', 'AI Voice Agent'),
    ])
