// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

// Die Seiten werden als statisches HTML gebaut.
// Nur der Editor unter /keystatic braucht einen kleinen Server-Teil (Netlify Function).
export default defineConfig({
  site: 'https://eliaspace.de',
  output: 'static',
  adapter: netlify(),
  integrations: [react(), keystatic()],
});
