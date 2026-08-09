// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Marketing forms POST to the CRM instead of talking to a database directly,
// so no database key ships in the static bundle.
const crmLeadsEndpoint = process.env.CRM_LEADS_ENDPOINT || process.env.PUBLIC_CRM_LEADS_ENDPOINT;
process.env.PUBLIC_CRM_LEADS_ENDPOINT = crmLeadsEndpoint || '';
if (!crmLeadsEndpoint) {
  console.warn(
    '[cgs] CRM_LEADS_ENDPOINT is not set — form submissions will fail until it points at the CRM lead intake route.',
  );
}

const sanityProjectId = process.env.SANITY_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || '4rag8303';
const sanityDataset = process.env.SANITY_DATASET || process.env.PUBLIC_SANITY_DATASET || 'production';
process.env.PUBLIC_SANITY_PROJECT_ID = sanityProjectId;
process.env.PUBLIC_SANITY_DATASET = sanityDataset;


// https://astro.build/config
export default defineConfig({
  site: 'https://compoundgrowthstudio.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/preview/'),
    }),
  ],
});
