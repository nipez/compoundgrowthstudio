// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const supabaseUrl = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;
if (supabaseUrl) process.env.PUBLIC_SUPABASE_URL = supabaseUrl;
if (supabaseAnonKey) process.env.PUBLIC_SUPABASE_ANON_KEY = supabaseAnonKey;

export default defineConfig({
  site: process.env.PUBLIC_PORTAL_URL || 'https://app.compoundgrowthstudio.com',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'always',
  server: {
    port: 4322,
  },
  security: {
    checkOrigin: true,
    allowedDomains: [
      { hostname: 'localhost' },
      { hostname: 'app.compoundgrowthstudio.com', protocol: 'https' },
    ],
  },
});
