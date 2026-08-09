// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Marketing forms POST wherever this points — a Google Apps Script web app,
// the CRM, or any other collector — so no database key ships in the bundle.
const formEndpoint =
  process.env.FORM_ENDPOINT ||
  process.env.PUBLIC_FORM_ENDPOINT ||
  process.env.CRM_LEADS_ENDPOINT ||
  process.env.PUBLIC_CRM_LEADS_ENDPOINT;
process.env.PUBLIC_FORM_ENDPOINT = formEndpoint || '';
if (!formEndpoint) {
  console.warn(
    '[cgs] FORM_ENDPOINT is not set — form submissions will fail until it points at a collector.',
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
