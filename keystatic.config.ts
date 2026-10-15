/**
 * Keystatic-Konfiguration: legt fest, welche Inhalte im Redaktionsbereich
 * (/keystatic) bearbeitet werden können und wo sie im Repo gespeichert werden.
 *
 * Lokal (npm run dev) wird direkt in die Dateien geschrieben.
 * Einrichtung und Pflege: siehe docs/einrichtung.md und docs/redaktion.md.
 * Online wird jede Änderung als Commit im GitHub-Repo gespeichert,
 * danach baut Netlify die Seite automatisch neu.
 */
import { config, fields, collection, singleton } from '@keystatic/core';

const bildOptionen = (ordner: string) => ({
  directory: `public/images/${ordner}`,
  publicPath: `/images/${ordner}/`,
});

const fliesstext = (label = 'Inhalt') =>
  fields.markdoc({
    label,
    options: { image: bildOptionen('inhalte') },
  });

export default config({
  // Online (und beim einmaligen Einrichten mit `npm run keystatic:setup`) über GitHub,
  // sonst lokal direkt in die Dateien.
  storage:
    import.meta.env.PROD || import.meta.env.PUBLIC_KEYSTATIC_GITHUB === 'true'
      ? { kind: 'github', repo: 'ELIA-Berlin/webseite' }
      : { kind: 'local' },

  ui: {
    brand: { name: 'ELIA Redaktion' },
    navigation: {
      Inhalte: ['news', 'projekte', 'team', 'sponsoren'],
      Seiten: ['startseite', 'kontakt', 'impressum', 'datenschutz'],
    },
  },

  collections: {
    news: collection({
      label: 'News',
      slugField: 'titel',
      path: 'src/content/news/*',
      format: { contentField: 'inhalt' },
      entryLayout: 'content',
      columns: ['titel', 'datum'],
      schema: {
        titel: fields.slug({ name: { label: 'Titel' } }),
        datum: fields.date({
          label: 'Datum',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        zusammenfassung: fields.text({
          label: 'Kurzfassung',
          description: 'Ein bis zwei Sätze für die Übersicht und Vorschauen in sozialen Netzwerken.',
          multiline: true,
          validation: { length: { min: 1, max: 300 } },
        }),
        bild: fields.image({ label: 'Titelbild', ...bildOptionen('news') }),
        bildAlt: fields.text({
          label: 'Bildbeschreibung',
          description: 'Was ist auf dem Bild zu sehen? Wichtig für Screenreader.',
        }),
        inhalt: fliesstext(),
      },
    }),

    projekte: collection({
      label: 'Projekte',
      slugField: 'titel',
      path: 'src/content/projekte/*',
      format: { contentField: 'inhalt' },
      entryLayout: 'content',
      columns: ['titel', 'reihenfolge'],
      schema: {
        titel: fields.slug({ name: { label: 'Titel' } }),
        kurzbeschreibung: fields.text({
          label: 'Kurzbeschreibung',
          multiline: true,
          validation: { length: { min: 1, max: 240 } },
        }),
        wettbewerb: fields.text({
          label: 'Wettbewerb oder Rahmen',
          description: 'Optional, z. B. „European Rover Challenge“.',
        }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Aktiv', value: 'aktiv' },
            { label: 'In Planung', value: 'planung' },
            { label: 'Abgeschlossen', value: 'abgeschlossen' },
          ],
          defaultValue: 'aktiv',
        }),
        reihenfolge: fields.integer({
          label: 'Reihenfolge',
          description: 'Kleinere Zahl = weiter vorne.',
          defaultValue: 10,
        }),
        bild: fields.image({ label: 'Titelbild', ...bildOptionen('projekte') }),
        bildAlt: fields.text({ label: 'Bildbeschreibung' }),
        inhalt: fliesstext(),
      },
    }),

    team: collection({
      label: 'Team',
      slugField: 'name',
      path: 'src/content/team/*',
      format: 'yaml',
      columns: ['name', 'rolle'],
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        rolle: fields.text({ label: 'Rolle', description: 'z. B. „Vorsitz“ oder „Teamleitung Rover“' }),
        bereich: fields.select({
          label: 'Bereich',
          options: [
            { label: 'Vorstand', value: 'vorstand' },
            { label: 'Teamleitung', value: 'leitung' },
            { label: 'Mitglied', value: 'mitglied' },
            { label: 'Beratend', value: 'beratend' },
          ],
          defaultValue: 'mitglied',
        }),
        studiengang: fields.text({ label: 'Studiengang (optional)' }),
        foto: fields.image({ label: 'Foto', ...bildOptionen('team') }),
        linkedin: fields.url({ label: 'LinkedIn (optional)' }),
        reihenfolge: fields.integer({ label: 'Reihenfolge', defaultValue: 10 }),
      },
    }),

    sponsoren: collection({
      label: 'Sponsoren & Partner',
      slugField: 'name',
      path: 'src/content/sponsoren/*',
      format: 'yaml',
      columns: ['name', 'stufe'],
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        stufe: fields.select({
          label: 'Art der Unterstützung',
          options: [
            { label: 'Hauptsponsor', value: 'haupt' },
            { label: 'Sponsor', value: 'sponsor' },
            { label: 'Partner', value: 'partner' },
          ],
          defaultValue: 'sponsor',
        }),
        logo: fields.image({ label: 'Logo', ...bildOptionen('sponsoren') }),
        website: fields.url({ label: 'Website' }),
        beschreibung: fields.text({ label: 'Was unterstützt der Partner? (optional)', multiline: true }),
        reihenfolge: fields.integer({ label: 'Reihenfolge', defaultValue: 10 }),
      },
    }),
  },

  singletons: {
    startseite: singleton({
      label: 'Startseite',
      path: 'src/content/seiten/startseite',
      format: 'yaml',
      schema: {
        titel: fields.text({ label: 'Überschrift' }),
        einleitung: fields.text({ label: 'Einleitung', multiline: true }),
        ueberUns: fields.text({ label: 'Über uns', multiline: true }),
        mitmachenTitel: fields.text({ label: 'Mitmachen: Überschrift' }),
        mitmachenText: fields.text({ label: 'Mitmachen: Text', multiline: true }),
        sponsorenText: fields.text({ label: 'Sponsoren: Aufruf', multiline: true }),
      },
    }),

    kontakt: singleton({
      label: 'Kontakt & Social Media',
      path: 'src/content/seiten/kontakt',
      format: 'yaml',
      schema: {
        email: fields.text({ label: 'E-Mail-Adresse' }),
        anschrift: fields.text({ label: 'Anschrift', multiline: true }),
        instagram: fields.url({ label: 'Instagram' }),
        linkedin: fields.url({ label: 'LinkedIn' }),
        hinweis: fields.text({ label: 'Text auf der Kontaktseite', multiline: true }),
      },
    }),

    impressum: singleton({
      label: 'Impressum',
      path: 'src/content/seiten/impressum',
      format: { contentField: 'inhalt' },
      entryLayout: 'content',
      schema: { inhalt: fliesstext('Impressum') },
    }),

    datenschutz: singleton({
      label: 'Datenschutz',
      path: 'src/content/seiten/datenschutz',
      format: { contentField: 'inhalt' },
      entryLayout: 'content',
      schema: { inhalt: fliesstext('Datenschutzerklärung') },
    }),
  },
});
