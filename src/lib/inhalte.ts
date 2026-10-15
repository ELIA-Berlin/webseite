/**
 * Zentrale Stelle zum Lesen der Inhalte, die über Keystatic gepflegt werden.
 * Seiten importieren nur aus dieser Datei, nicht direkt aus src/content.
 */
import { createReader } from '@keystatic/core/reader';
import Markdoc from '@markdoc/markdoc';
import keystaticConfig from '../../keystatic.config';

export const reader = createReader(process.cwd(), keystaticConfig);

// Keystatic bringt eine eigene Markdoc-Version mit, deshalb hier bewusst lose typisiert.
type MarkdocInhalt = () => Promise<{ node: unknown }>;

/** Wandelt einen Keystatic-Fließtext in HTML um. */
export async function alsHtml(inhalt: MarkdocInhalt): Promise<string> {
  const { node } = await inhalt();
  return Markdoc.renderers.html(Markdoc.transform(node as Parameters<typeof Markdoc.transform>[0]));
}

export async function projekte() {
  const alle = await reader.collections.projekte.all();
  return alle.sort((a, b) => (a.entry.reihenfolge ?? 99) - (b.entry.reihenfolge ?? 99));
}

export async function news() {
  const alle = await reader.collections.news.all();
  return alle.sort((a, b) => (b.entry.datum ?? '').localeCompare(a.entry.datum ?? ''));
}

const bereichsReihenfolge = ['vorstand', 'leitung', 'mitglied', 'beratend'];

export async function team() {
  const alle = await reader.collections.team.all();
  return alle.sort(
    (a, b) =>
      bereichsReihenfolge.indexOf(a.entry.bereich) - bereichsReihenfolge.indexOf(b.entry.bereich) ||
      (a.entry.reihenfolge ?? 99) - (b.entry.reihenfolge ?? 99),
  );
}

export async function sponsoren() {
  const alle = await reader.collections.sponsoren.all();
  return alle.sort((a, b) => (a.entry.reihenfolge ?? 99) - (b.entry.reihenfolge ?? 99));
}

export const formatDatum = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

export const statusText: Record<string, string> = {
  aktiv: 'Aktiv',
  planung: 'In Planung',
  abgeschlossen: 'Abgeschlossen',
};
