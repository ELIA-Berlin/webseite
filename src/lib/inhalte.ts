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

/* ---------- Termine (Seite „Mitmachen“) ---------- */

export interface Termin {
  datum: string; // JJJJ-MM-TT
  titel: string;
  art: 'treffen' | 'event';
  uhrzeit?: string;
  ort?: string;
  beschreibung?: string;
  link?: string | null;
}

/** Heutiges Datum in Berlin als JJJJ-MM-TT */
export const heuteBerlin = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Berlin' });

const plusTage = (iso: string, tage: number) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + tage);
  return d.toISOString().slice(0, 10);
};

/**
 * Alle Termine ab heute für die nächsten 12 Monate, nach Datum sortiert:
 * regelmäßige Treffen (berechnet aus dem Rhythmus) plus einzelne Termine aus src/content/termine/.
 * Einträge mit „fällt aus“ entfernen das regelmäßige Treffen an diesem Tag.
 * Weil die Seite nur beim Veröffentlichen gebaut wird, blendet ein kleines Skript
 * auf der Seite später zusätzlich alles aus, was inzwischen vorbei ist.
 */
export async function kommendeTermine(): Promise<Termin[]> {
  const seite = await reader.singletons.mitmachen.readOrThrow();
  const eintraege = await reader.collections.termine.all();
  const heute = heuteBerlin();
  const bis = plusTage(heute, 366);

  const ausfaelle = new Set(eintraege.filter((e) => e.entry.faelltAus).map((e) => e.entry.datum));
  const termine: Termin[] = eintraege
    .filter((e) => !e.entry.faelltAus && e.entry.datum)
    .map(({ entry }) => ({
      datum: entry.datum!,
      titel: entry.titel,
      art: entry.art,
      uhrzeit: entry.uhrzeit || undefined,
      ort: entry.ort || undefined,
      beschreibung: entry.beschreibung || undefined,
      link: entry.link,
    }));

  const regel = seite.treffenRegel;
  const schritt = Math.max(1, regel.alleWochen ?? 1) * 7;
  if (regel.erstesDatum) {
    const einzeln = new Set(termine.filter((t) => t.art === 'treffen').map((t) => t.datum));
    for (let d = regel.erstesDatum; d <= bis; d = plusTage(d, schritt)) {
      if (d < heute || ausfaelle.has(d) || einzeln.has(d)) continue;
      termine.push({
        datum: d,
        titel: regel.name || 'Treffen',
        art: 'treffen',
        uhrzeit: regel.uhrzeit || undefined,
        ort: seite.treffenWo || undefined,
      });
    }
  }

  return termine
    .filter((t) => t.datum >= heute && t.datum <= bis)
    .sort((a, b) => a.datum.localeCompare(b.datum) || (a.uhrzeit ?? '').localeCompare(b.uhrzeit ?? ''));
}
