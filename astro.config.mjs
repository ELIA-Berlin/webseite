// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import netlify from '@astrojs/netlify';

// Alle Seiten werden beim Build als statisches HTML erzeugt.
// Nur der Redaktionsbereich /keystatic läuft als Netlify-Function.
export default defineConfig({
  site: 'https://elia-berlin.netlify.app',
  output: 'static',
  adapter: netlify(),
  integrations: [react(), keystatic()],
  trailingSlash: 'ignore',
});
