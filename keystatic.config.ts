/**
 * Keystatic: der Editor für die Texte der Webseite (erreichbar unter /keystatic).
 *
 * Hier wird festgelegt, welche Texte im Editor bearbeitet werden können.
 * Gespeichert wird alles als Datei im Repo, z. B. src/content/startseite.yaml.
 * Wie man Texte ändert, steht in der README.
 */
import { config, fields, singleton } from '@keystatic/core';

export default config({
  // Lokal schreibt der Editor direkt in die Dateien.
  // Online kommt später die Anmeldung über GitHub dazu.
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'ELIA Webseite' },
  },

  singletons: {
    startseite: singleton({
      label: 'Startseite',
      path: 'src/content/startseite',
      format: 'yaml',
      schema: {
        unterzeile: fields.text({
          label: 'Zeile über der Überschrift',
          description: 'Kleine Zeile über dem großen Titel.',
        }),
        titel: fields.text({ label: 'Überschrift' }),
        einleitung: fields.text({ label: 'Einleitung unter der Überschrift', multiline: true }),

        werWirSindTitel: fields.text({ label: 'Abschnitt „Wer wir sind“: Überschrift' }),
        werWirSindText: fields.text({
          label: 'Abschnitt „Wer wir sind“: Text',
          description: 'Eine Leerzeile beginnt einen neuen Absatz.',
          multiline: true,
        }),

        projekte: fields.array(
          fields.object({
            einordnung: fields.text({ label: 'Kleine Zeile darüber', description: 'z. B. Wettbewerb oder Bereich' }),
            titel: fields.text({ label: 'Titel' }),
            text: fields.text({ label: 'Kurzbeschreibung', multiline: true }),
          }),
          {
            label: 'Projektbereiche',
            description: 'Reihenfolge per Ziehen ändern.',
            itemLabel: (eintrag) => eintrag.fields.titel.value || 'Neuer Bereich',
          },
        ),
        projekteAufruf: fields.object(
          {
            einordnung: fields.text({ label: 'Kleine Zeile darüber' }),
            titel: fields.text({ label: 'Titel' }),
            text: fields.text({ label: 'Text', multiline: true }),
          },
          { label: 'Letztes Feld im Projektraster (Aufruf zum Mitmachen)' },
        ),

        mitmachenTitel: fields.text({ label: 'Abschnitt „Mach mit“: Überschrift' }),
        mitmachenText: fields.text({ label: 'Abschnitt „Mach mit“: Text', multiline: true }),
        kontaktEmail: fields.text({
          label: 'E-Mail-Adresse für „Kontakt aufnehmen“',
          description: 'Wohin der Button im Abschnitt „Mach mit“ eine E-Mail schickt.',
        }),
      },
    }),
  },
});
