/**
 * Zugriff auf die Inhalte aus src/content/ (dieselben Dateien, die der Editor bearbeitet).
 */
import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

/** Leerzeile im Editor = neuer Absatz */
export const absaetze = (text?: string | null) =>
  (text ?? '').split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean);

/**
 * Leere Abschnitte werden als gestrichelter Platzhalter angezeigt, damit man die Struktur sieht.
 * Das passiert nur lokal und in Netlify-Vorschauen. Auf der echten Seite (eliaspace.de)
 * werden leere Abschnitte einfach weggelassen.
 */
export const zeigePlatzhalter = process.env.CONTEXT !== 'production';

export const allgemein = () => reader.singletons.allgemein.readOrThrow();

/** Alle Themen, sortiert nach dem Feld „Reihenfolge“ */
export async function alleThemen() {
  const themen = await reader.collections.themen.all();
  return themen.sort((a, b) => (a.entry.reihenfolge ?? 99) - (b.entry.reihenfolge ?? 99));
}

/** Alle News, neueste zuerst */
export async function alleNews() {
  const news = await reader.collections.news.all();
  return news.sort((a, b) => (b.entry.datum ?? '').localeCompare(a.entry.datum ?? ''));
}

export const datumLang = (iso: string) =>
  new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
