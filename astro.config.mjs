// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Map SUPABASE_* → PUBLIC_* so Railway/build env names match the README
// without dead-code-eliminating the Supabase client when values are empty.
const supabaseUrl = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;
if (supabaseUrl) process.env.PUBLIC_SUPABASE_URL = supabaseUrl;
if (supabaseAnonKey) process.env.PUBLIC_SUPABASE_ANON_KEY = supabaseAnonKey;

// https://astro.build/config
export default defineConfig({
  site: 'https://compoundgrowthstudio.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
