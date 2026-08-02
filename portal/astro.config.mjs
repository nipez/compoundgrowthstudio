// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const supabaseUrl = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;
if (supabaseUrl) process.env.PUBLIC_SUPABASE_URL = supabaseUrl;
if (supabaseAnonKey) process.env.PUBLIC_SUPABASE_ANON_KEY = supabaseAnonKey;

const portalUrl = process.env.PUBLIC_PORTAL_URL || 'https://app.compoundgrowthstudio.com';
let portalHostname = 'app.compoundgrowthstudio.com';
try {
  portalHostname = new URL(portalUrl).hostname;
} catch {
  /* keep default */
}

export default defineConfig({
  site: portalUrl,
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'always',
  server: {
    port: 4322,
    host: true,
  },
  security: {
    checkOrigin: true,
    // Trust Railway / custom domain X-Forwarded-* so demo login POSTs work behind the proxy.
    allowedDomains: [
      { hostname: 'localhost' },
      { hostname: portalHostname, protocol: 'https' },
      { hostname: '**.up.railway.app', protocol: 'https' },
      { hostname: 'app.compoundgrowthstudio.com', protocol: 'https' },
    ],
  },
});
