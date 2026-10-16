// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';

/**
 * Der Editor unter /keystatic läuft bewusst NUR lokal (npm run dev). Im lokalen Modus
 * hat er keine Anmeldung: Würde er mit auf eliaspace.de ausgeliefert, könnte jeder
 * den Editor öffnen und die Dateiliste des Servers abrufen.
 *
 * Astro teilt jeder Erweiterung mit, ob gerade „dev“ oder „build“ läuft. Nur bei „dev“
 * wird Keystatic eingebunden; der Build für die Live-Seite enthält ihn nicht.
 *
 * Für den Online-Editor (Anmeldung über GitHub) wird später ein Adapter für den
 * Hoster ergänzt und Keystatic auch im Build eingebunden. Siehe README, „Weg 3“.
 */
const editorNurLokal = () => {
  const editor = keystatic();
  return {
    name: 'keystatic-nur-lokal',
    hooks: {
      /** @param {any} optionen */
      'astro:config:setup': (optionen) => {
        if (optionen.command === 'dev') editor.hooks['astro:config:setup']?.(optionen);
      },
    },
  };
};

// Die Seite wird komplett als statisches HTML gebaut, ohne Server-Teil.
export default defineConfig({
  site: 'https://eliaspace.de',
  output: 'static',
  integrations: [react(), editorNurLokal()],
});
