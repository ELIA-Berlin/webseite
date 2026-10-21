/**
 * Keystatic: der Editor für die Texte der Webseite (erreichbar unter /keystatic).
 *
 * Hier wird festgelegt, welche Texte im Editor bearbeitet werden können.
 * Gespeichert wird alles als Datei im Repo unter src/content/.
 *
 * - Sammlungen (collections) haben beliebig viele Einträge: Themen, News, Personen, Partner.
 * - Einzelseiten (singletons) gibt es genau einmal: Startseite, Mitmachen, Über uns usw.
 *
 * Wie man Texte ändert, steht in der README.
 */
import { collection, config, fields, singleton } from '@keystatic/core';

// Wiederkehrende Felder
const absatzText = (label: string, description = 'Eine Leerzeile beginnt einen neuen Absatz.') =>
  fields.text({ label, description, multiline: true });

const bild = (label: string, ordner: string, description?: string) =>
  fields.image({
    label,
    description,
    directory: `public/bilder/${ordner}`,
    publicPath: `/bilder/${ordner}/`,
  });

export default config({
  // Lokal schreibt der Editor direkt in die Dateien.
  // Online kommt später die Anmeldung über GitHub dazu.
  storage: { kind: 'local' },

  ui: {
    brand: { name: 'ELIA Webseite' },
    navigation: {
      Seiten: ['startseite', 'themenSeite', 'newsSeite', 'mitmachen', 'partnerSeite', 'ueberUns'],
      Inhalte: ['themen', 'news', 'positionen', 'termine', 'personen', 'partner'],
      Allgemein: ['allgemein', 'kalender'],
    },
  },

  collections: {
    /* ---------- Themen: Rover, Rakete, Space Law, Entrepreneurship ---------- */
    themen: collection({
      label: 'Themen',
      path: 'src/content/themen/*',
      slugField: 'titel',
      format: 'yaml',
      columns: ['titel', 'reihenfolge'],
      schema: {
        titel: fields.slug({
          name: { label: 'Name des Themas' },
          slug: { label: 'Adresse', description: 'Teil der Adresse, z. B. „rover“ → eliaspace.de/themen/rover' },
        }),
        reihenfolge: fields.integer({
          label: 'Reihenfolge',
          description: 'Kleinere Zahl steht weiter vorne (Startseite, Themenübersicht, News-Filter).',
          defaultValue: 1,
        }),
        einordnung: fields.text({ label: 'Kleine Zeile über dem Namen', description: 'z. B. Wettbewerb oder Bereich' }),
        kurztext: fields.text({ label: 'Kurztext für die Startseite', description: 'Ein kurzer Satz.' }),
        skizze: fields.image({
          label: 'Skizze (Startseite, Themenübersicht, Seitenkopf)',
          description: 'Linienzeichnung mit durchsichtigem Hintergrund, am besten als SVG im Querformat. Auf GitHub austauschbar unter public/grafiken/themen/ (gleicher Dateiname ersetzt die alte Skizze).',
          directory: 'public/grafiken/themen',
          publicPath: '/grafiken/themen/',
        }),
        modell3d: fields.select({
          label: '3D-Modell im Seitenkopf',
          description: 'Drehbares Modell statt der Skizze. Ein Foto im Feld „Bild im Seitenkopf“ hat Vorrang.',
          options: [
            { label: 'Keins (Skizze zeigen)', value: 'keins' },
            { label: 'Stella (Rakete)', value: 'stella' },
            { label: 'Doug (Rover)', value: 'doug' },
          ],
          defaultValue: 'keins',
        }),
        teaser: fields.text({
          label: 'Text für die Themenübersicht',
          description: 'Zwei bis drei Sätze, etwas ausführlicher als auf der Startseite.',
          multiline: true,
        }),

        // Kopf der Themenseite
        einzeiler: fields.text({ label: 'Einzeiler im Seitenkopf', multiline: true }),
        bild: bild('Bild im Seitenkopf', 'themen'),
        bildBeschreibung: fields.text({ label: 'Bildbeschreibung', description: 'Für Screenreader: Was ist auf dem Bild zu sehen?' }),

        worumEsGeht: absatzText('Worum es geht'),

        wettbewerb: fields.conditional(
          fields.checkbox({ label: 'Abschnitt „Wettbewerb“ anzeigen', defaultValue: false }),
          {
            true: fields.object({
              name: fields.text({ label: 'Name des Wettbewerbs', description: 'z. B. European Rover Challenge' }),
              link: fields.url({ label: 'Link zur Wettbewerbsseite' }),
              text: absatzText('Text'),
            }),
            false: fields.empty(),
          },
        ),

        stand: absatzText('Aktueller Stand'),
        meilensteine: fields.array(
          fields.object({
            zeitpunkt: fields.text({ label: 'Zeitpunkt', description: 'z. B. „Frühjahr 2026“ oder „geplant“' }),
            text: fields.text({ label: 'Was', multiline: true }),
            erreicht: fields.checkbox({ label: 'Schon erreicht', defaultValue: false }),
          }),
          {
            label: 'Meilensteine',
            description: 'Von früh nach spät. Erreichte und geplante Schritte.',
            itemLabel: (m) => [m.fields.zeitpunkt.value, m.fields.text.value].filter(Boolean).join(': ') || 'Neuer Meilenstein',
          },
        ),

        technik: fields.object(
          {
            titel: fields.text({ label: 'Überschrift', description: 'z. B. „Technik“ oder „Vertiefung“. Leer lassen, um den Abschnitt auszublenden.' }),
            text: absatzText('Text'),
            bild: bild('Bild oder Zeichnung', 'themen'),
            bildBeschreibung: fields.text({ label: 'Bildbeschreibung' }),
            raketenzeichnung: fields.object(
              {
                anzeigen: fields.checkbox({ label: 'Raketenzeichnung anzeigen', description: 'Beschriftete Schnittzeichnung von Stella. Nur für das Thema Rakete gedacht.', defaultValue: false }),
                nasenkonus: fields.text({ label: 'Nasenkonus' }),
                nutzlast: fields.text({ label: 'Nutzlast' }),
                avionik: fields.text({ label: 'Avionik' }),
                bergung: fields.text({ label: 'Bergung' }),
                motor: fields.text({ label: 'Motor' }),
                leitwerk: fields.text({ label: 'Leitwerk' }),
                hinweis: fields.text({ label: 'Hinweis unter der Zeichnung' }),
                beschreibung: fields.text({ label: 'Beschreibung für Screenreader', multiline: true }),
                schriftfeld: fields.array(
                  fields.object({
                    name: fields.text({ label: 'Feld', description: 'z. B. Benennung' }),
                    wert: fields.text({ label: 'Eintrag', description: 'z. B. Stella' }),
                  }),
                  {
                    label: 'Schriftfeld unter der Zeichnung',
                    description: 'Wie auf einer technischen Zeichnung. Am besten vier Felder.',
                    itemLabel: (f) => [f.fields.name.value, f.fields.wert.value].filter(Boolean).join(': ') || 'Neues Feld',
                  },
                ),
              },
              { label: 'Raketenzeichnung (optional)' },
            ),
          },
          { label: 'Abschnitt „Technik / Vertiefung“ (optional)' },
        ),

        formate: fields.array(
          fields.object({
            titel: fields.text({ label: 'Titel', description: 'z. B. Vortragsreihe, Workshop' }),
            text: fields.text({ label: 'Beschreibung', multiline: true }),
          }),
          {
            label: 'Formate (optional)',
            description: 'z. B. Vorträge, Workshops. Leer lassen, um den Abschnitt auszublenden.',
            itemLabel: (f) => f.fields.titel.value || 'Neues Format',
          },
        ),

        team: fields.object(
          {
            foto: bild('Teamfoto', 'themen', 'Querformat. Nur mit Einwilligung aller Personen auf dem Bild.'),
            fotoBeschreibung: fields.text({ label: 'Bildbeschreibung', description: 'Für Screenreader: Wer und was ist auf dem Bild zu sehen?' }),
            fotoFelder: fields.array(
              fields.object({
                name: fields.text({ label: 'Bezeichnung', description: 'z. B. Links, Rechts, Im Bild' }),
                wert: fields.text({ label: 'Eintrag', description: 'z. B. ein Name' }),
              }),
              {
                label: 'Schriftfeld unter dem Foto',
                description: 'Wer steht wo? Leere Liste = kein Schriftfeld.',
                itemLabel: (f) => [f.fields.name.value, f.fields.wert.value].filter(Boolean).join(': ') || 'Neues Feld',
              },
            ),
            text: absatzText('Text zum Team'),
          },
          { label: 'Abschnitt „Team“ (optional)', description: 'Erscheint, sobald Foto oder Text ausgefüllt sind.' },
        ),

        ansprechpersonen: fields.multiRelationship({
          label: 'Ansprechpersonen',
          description: 'Eine oder mehrere Personen aus der Sammlung „Personen“.',
          collection: 'personen',
        }),
        kontaktEmail: fields.text({
          label: 'Kontakt-E-Mail für dieses Thema (optional)',
          description: 'z. B. doug@elia-space.de. Leer lassen für die allgemeine Kontaktadresse.',
        }),
        ansprechpersonenBezeichnung: fields.text({
          label: 'Bezeichnung im Schriftfeld (optional)',
          description: 'z. B. „Teamleitung“. Leer lassen für „Ansprechperson“.',
        }),
        wenWirSuchen: absatzText('Wen wir suchen'),
      },
    }),

    /* ---------- News ---------- */
    news: collection({
      label: 'News',
      path: 'src/content/news/*',
      slugField: 'titel',
      format: { contentField: 'inhalt' },
      entryLayout: 'content',
      columns: ['titel', 'datum'],
      schema: {
        titel: fields.slug({
          name: { label: 'Titel' },
          slug: { label: 'Adresse', description: 'Teil der Adresse, z. B. eliaspace.de/news/<adresse>' },
        }),
        datum: fields.date({ label: 'Datum', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        thema: fields.relationship({
          label: 'Thema',
          description: 'Optional. Der Beitrag erscheint dann auch auf der Themenseite.',
          collection: 'themen',
        }),
        kurztext: fields.text({ label: 'Kurztext für die Übersicht', description: 'Ein bis zwei Sätze.', multiline: true }),
        titelbild: bild('Titelbild', 'news'),
        titelbildBeschreibung: fields.text({ label: 'Bildbeschreibung' }),
        inhalt: fields.markdoc({
          label: 'Text',
          options: {
            image: { directory: 'public/bilder/news', publicPath: '/bilder/news/' },
          },
        }),
      },
    }),

    /* ---------- Offene Positionen (Seite „Mitmachen“) ---------- */
    positionen: collection({
      label: 'Positionen & Bereiche',
      path: 'src/content/positionen/*',
      slugField: 'titel',
      format: 'yaml',
      columns: ['titel', 'anzeigen', 'grosserBedarf'],
      schema: {
        titel: fields.slug({
          name: { label: 'Titel', description: 'z. B. „Rover-Team“ oder „Elektronik für Doug“' },
        }),
        anzeigen: fields.checkbox({
          label: 'Anzeigen',
          description: 'Häkchen entfernen, um die Position auszublenden, ohne sie zu löschen.',
          defaultValue: true,
        }),
        grosserBedarf: fields.checkbox({
          label: 'Großer Bedarf',
          description: 'Wird hervorgehoben und steht oben.',
          defaultValue: false,
        }),
        thema: fields.relationship({
          label: 'Thema (optional)',
          description: 'Leer lassen für Aufgaben im ganzen Verein, z. B. Öffentlichkeitsarbeit.',
          collection: 'themen',
        }),
        bereich: fields.text({
          label: 'Bereich (optional)',
          description: 'Statt eines Themas, z. B. „Verein“ oder „Öffentlichkeitsarbeit“.',
        }),
        beschreibung: fields.text({ label: 'Was du machst', multiline: true }),
        mitbringen: fields.text({
          label: 'Was du mitbringen solltest (optional)',
          description: 'Kurz halten. Vorwissen ist bei uns keine Pflicht.',
          multiline: true,
        }),
        reihenfolge: fields.integer({ label: 'Reihenfolge', description: 'Kleinere Zahl steht weiter vorne.', defaultValue: 1 }),
      },
    }),

    /* ---------- Termine (Seite „Mitmachen“) ---------- */
    termine: collection({
      label: 'Termine (Events & Ausfälle)',
      path: 'src/content/termine/*',
      slugField: 'titel',
      format: 'yaml',
      columns: ['titel', 'datum'],
      schema: {
        titel: fields.slug({ name: { label: 'Titel', description: 'z. B. „Raketenstart in Brandenburg“' } }),
        datum: fields.date({ label: 'Datum', validation: { isRequired: true } }),
        uhrzeit: fields.text({ label: 'Uhrzeit (optional)', description: 'z. B. 17:30 oder 10–16 Uhr' }),
        art: fields.select({
          label: 'Art',
          options: [
            { label: 'Event (z. B. Messe, Start, Vortrag)', value: 'event' },
            { label: 'Treffen (einzelnes Treffen außerhalb des Rhythmus)', value: 'treffen' },
          ],
          defaultValue: 'event',
        }),
        ort: fields.text({ label: 'Ort (optional)' }),
        beschreibung: fields.text({ label: 'Beschreibung (optional)', multiline: true }),
        link: fields.url({ label: 'Link (optional)', description: 'z. B. zur Anmeldung oder zur Veranstaltung' }),
        faelltAus: fields.checkbox({
          label: 'Regelmäßiges Treffen fällt an diesem Tag aus',
          description: 'Nur für Ausfälle: Titel z. B. „Kein Treffen“, Datum = Tag des Treffens. Das Treffen verschwindet dann aus der Liste.',
          defaultValue: false,
        }),
      },
    }),

    /* ---------- Personen ---------- */
    personen: collection({
      label: 'Personen',
      path: 'src/content/personen/*',
      slugField: 'name',
      format: 'yaml',
      columns: ['name', 'rolle'],
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        rolle: fields.text({ label: 'Rolle', description: 'z. B. Vorsitz, Teamleitung Rover' }),
        vorstand: fields.checkbox({ label: 'Gehört zum Vorstand', defaultValue: false }),
        reihenfolge: fields.integer({ label: 'Reihenfolge', description: 'Kleinere Zahl steht weiter vorne.', defaultValue: 1 }),
        foto: bild('Foto', 'personen', 'Nur mit Einwilligung der Person.'),
        email: fields.text({ label: 'E-Mail (optional)' }),
      },
    }),

    /* ---------- Partner & Sponsoren ---------- */
    partner: collection({
      label: 'Partner & Sponsoren',
      path: 'src/content/partner/*',
      slugField: 'name',
      format: 'yaml',
      columns: ['name', 'art'],
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        art: fields.select({
          label: 'Art',
          options: [
            { label: 'Institutioneller Partner (z. B. HTW, DGLR, Kooperation)', value: 'institution' },
            { label: 'Sponsor', value: 'sponsor' },
          ],
          defaultValue: 'sponsor',
        }),
        stufe: fields.text({ label: 'Stufe (optional)', description: 'Nur für Sponsoren, z. B. Gold, Silber, Bronze. Wird nicht angezeigt: gleiche Stufen stehen in einer Zeile, die Zeilen werden nach unten kleiner (Reihenfolge nach „Reihenfolge“).' }),
        reihenfolge: fields.integer({ label: 'Reihenfolge', defaultValue: 1 }),
        logo: bild('Logo', 'partner'),
        link: fields.url({ label: 'Webseite' }),
        text: fields.text({ label: 'Kurzbeschreibung (optional)', multiline: true }),
      },
    }),
  },

  singletons: {
    /* ---------- Startseite ---------- */
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
        knopfMitmachen: fields.text({ label: 'Button „Mitmachen“' }),
        knopfThemen: fields.text({ label: 'Button zu den Themen' }),

        werWirSindTitel: fields.text({ label: 'Abschnitt „Wer wir sind“: Überschrift' }),
        werWirSindText: absatzText('Abschnitt „Wer wir sind“: Text'),

        flugprofil: fields.object(
          {
            start: fields.text({ label: 'Start' }),
            brennschluss: fields.text({ label: 'Brennschluss' }),
            apogaeum: fields.text({ label: 'Höchster Punkt (Apogäum)' }),
            fallschirm: fields.text({ label: 'Fallschirm' }),
            landung: fields.text({ label: 'Landung' }),
            beschreibung: fields.text({ label: 'Beschreibung für Screenreader', multiline: true }),
          },
          { label: 'Flugprofil im Kopf: Beschriftungen', description: 'Die animierte Flugbahn rechts neben der Überschrift.' },
        ),

        themenAufruf: fields.object(
          {
            einordnung: fields.text({ label: 'Kleine Zeile darüber' }),
            titel: fields.text({ label: 'Titel' }),
            text: fields.text({ label: 'Text', multiline: true }),
            link: fields.text({ label: 'Linktext' }),
          },
          {
            label: 'Streifen unter dem Themenraster (Aufruf zum Mitmachen)',
            description: 'Die Themen selbst kommen aus der Sammlung „Themen“.',
          },
        ),

        missionslogTitel: fields.text({
          label: 'Missionslog: Überschrift',
          description: 'Die Einträge kommen aus „Über uns“ → Rückblick. Leer lassen, um den Abschnitt auf der Startseite auszublenden.',
        }),
        missionslogLink: fields.text({ label: 'Missionslog: Link zu „Über uns“' }),

        mitmachenTitel: fields.text({ label: 'Abschnitt „Mach mit“: Überschrift' }),
        mitmachenText: fields.text({ label: 'Abschnitt „Mach mit“: Text', multiline: true }),
        mitmachenKnopf: fields.text({ label: 'Abschnitt „Mach mit“: Button' }),
        mitmachenEmail: fields.text({
          label: 'Abschnitt „Mach mit“: E-Mail für den Button',
          description: 'Leer lassen, dann wird die allgemeine Kontakt-E-Mail aus „Menü & Beschriftungen“ verwendet.',
        }),
      },
    }),

    /* ---------- Themenübersicht ---------- */
    themenSeite: singleton({
      label: 'Themen (Übersicht)',
      path: 'src/content/seiten/themen',
      format: 'yaml',
      schema: {
        titel: fields.text({ label: 'Überschrift' }),
        einleitung: absatzText('Einleitung: wie die Themen zusammenhängen'),
      },
    }),

    /* ---------- News-Übersicht ---------- */
    newsSeite: singleton({
      label: 'News (Übersicht)',
      path: 'src/content/seiten/news',
      format: 'yaml',
      schema: {
        titel: fields.text({ label: 'Überschrift' }),
        einleitung: fields.text({ label: 'Einleitung', multiline: true }),
        filterAlle: fields.text({ label: 'Filter: Beschriftung für „alle“' }),
        keineBeitraege: fields.text({ label: 'Hinweis, wenn es noch keine Beiträge gibt' }),
      },
    }),

    /* ---------- Mitmachen ---------- */
    mitmachen: singleton({
      label: 'Mitmachen',
      path: 'src/content/seiten/mitmachen',
      format: 'yaml',
      schema: {
        titel: fields.text({ label: 'Überschrift' }),
        einleitung: fields.text({ label: 'Einleitung', multiline: true }),
        bannerTitel: fields.text({ label: 'Banner oben: Beschriftung', description: 'z. B. „Nächstes Treffen“' }),
        bannerEvent: fields.text({ label: 'Banner oben: Beschriftung für Events', description: 'z. B. „Nächstes Event“. Erscheint nur, wenn ein Event eingetragen ist.' }),
        bannerBeginn: fields.text({ label: 'Banner oben: Beschriftung für die Uhrzeit', description: 'z. B. „Beginn“' }),
        bannerOrt: fields.text({ label: 'Banner oben: Beschriftung für den Ort' }),
        bannerRhythmus: fields.text({ label: 'Banner oben: Beschriftung für den Rhythmus' }),
        treffenWann: fields.text({ label: 'Regelmäßiges Treffen: wann (Text)', description: 'z. B. „Alle zwei Wochen dienstags, 17:30 Uhr“' }),
        treffenWo: fields.text({ label: 'Regelmäßiges Treffen: wo', description: 'Erscheint im Banner bei jedem Treffen.' }),
        treffenRegel: fields.object(
          {
            name: fields.text({ label: 'Name', description: 'z. B. Teamtreffen' }),
            erstesDatum: fields.date({ label: 'Erstes Treffen in diesem Rhythmus' }),
            alleWochen: fields.integer({ label: 'Alle … Wochen', description: '1 = jede Woche, 2 = alle zwei Wochen', defaultValue: 2 }),
            uhrzeit: fields.text({ label: 'Uhrzeit', description: 'z. B. 17:30' }),
          },
          {
            label: 'Regelmäßiges Treffen: Rhythmus',
            description: 'Daraus wird das nächste Treffen im Banner berechnet. Ausfälle und einzelne Treffen unter Inhalte → Termine eintragen.',
          },
        ),

        positionenTitel: fields.text({ label: 'Positionen & Bereiche: Überschrift' }),
        positionenText: fields.text({
          label: 'Positionen & Bereiche: Einleitung (optional)',
          description: 'Die Einträge selbst stehen unter Inhalte → Positionen & Bereiche.',
          multiline: true,
        }),
        positionenBedarf: fields.text({ label: 'Positionen & Bereiche: Markierung „großer Bedarf“' }),
        positionenMitbringen: fields.text({ label: 'Positionen & Bereiche: Beschriftung „Mitbringen“' }),
        positionenKnopf: fields.text({ label: 'Positionen & Bereiche: Button', description: 'Öffnet eine E-Mail mit dem Titel im Betreff.' }),
        positionenBetreff: fields.text({ label: 'Positionen & Bereiche: Betreff der E-Mail', description: 'Der Titel wird angehängt.' }),

        fuerWenTitel: fields.text({ label: 'Für wen: Überschrift' }),
        fuerWenText: absatzText('Für wen: Text'),
        wasDuMachstTitel: fields.text({ label: 'Was du bei uns machst: Überschrift' }),
        wasDuMachstText: absatzText('Was du bei uns machst: Text'),
        einstiegTitel: fields.text({ label: 'So läuft der Einstieg: Überschrift' }),
        einstiegSchritte: fields.array(
          fields.object({
            titel: fields.text({ label: 'Schritt' }),
            text: fields.text({ label: 'Beschreibung', multiline: true }),
          }),
          { label: 'So läuft der Einstieg: Schritte', itemLabel: (s) => s.fields.titel.value || 'Neuer Schritt' },
        ),

        kontaktTitel: fields.text({ label: 'Kontakt: Überschrift' }),
        kontaktText: fields.text({ label: 'Kontakt: Text', multiline: true }),
        kontaktEmail: fields.text({
          label: 'Kontakt: E-Mail',
          description: 'Für „Kontakt aufnehmen“ und die Buttons bei den Positionen. Leer lassen = allgemeine Kontakt-E-Mail.',
        }),
      },
    }),

    /* ---------- Partner & Sponsoren ---------- */
    partnerSeite: singleton({
      label: 'Partner (Übersicht, Sponsoren, Unterstützen)',
      path: 'src/content/seiten/partner',
      format: 'yaml',
      schema: {
        titel: fields.text({ label: 'Übersicht /partner: Überschrift' }),
        einleitung: fields.text({ label: 'Übersicht /partner: Einleitung', multiline: true }),
        uebersichtSponsoren: fields.object(
          {
            titel: fields.text({ label: 'Titel' }),
            text: fields.text({ label: 'Text', multiline: true }),
            knopf: fields.text({ label: 'Button' }),
          },
          { label: 'Übersicht: Kasten „Sponsoren & Partner“' },
        ),
        uebersichtUnterstuetzen: fields.object(
          {
            titel: fields.text({ label: 'Titel' }),
            text: fields.text({ label: 'Text', multiline: true }),
            knopf: fields.text({ label: 'Button' }),
          },
          { label: 'Übersicht: Kasten „Unterstützen“' },
        ),

        sponsorenSeiteTitel: fields.text({ label: 'Seite Sponsoren & Partner: Überschrift' }),
        sponsorenSeiteEinleitung: fields.text({ label: 'Seite Sponsoren & Partner: Einleitung', multiline: true }),
        sponsorenAufrufTitel: fields.text({ label: 'Seite Sponsoren & Partner: Aufruf unten, Überschrift' }),
        sponsorenAufrufText: fields.text({ label: 'Seite Sponsoren & Partner: Aufruf unten, Text', multiline: true }),
        sponsorenAufrufKnopf: fields.text({ label: 'Seite Sponsoren & Partner: Aufruf unten, Button' }),

        unterstuetzenTitel: fields.text({ label: 'Seite Unterstützen: Überschrift' }),
        unterstuetzenEinleitung: fields.text({ label: 'Seite Unterstützen: Einleitung', multiline: true }),
        wegeTitel: fields.text({ label: 'Seite Unterstützen: Überschrift „Wege“' }),
        wege: fields.array(
          fields.object({
            titel: fields.text({ label: 'Titel', description: 'z. B. Material und Bauteile' }),
            text: fields.text({ label: 'Beschreibung', multiline: true }),
          }),
          {
            label: 'Seite Unterstützen: Wege, uns zu unterstützen',
            itemLabel: (w) => w.fields.titel.value || 'Neuer Weg',
          },
        ),
        partnerEmail: fields.text({
          label: 'E-Mail für Sponsoring-Anfragen (optional)',
          description: 'Leer lassen = allgemeine Kontakt-E-Mail.',
        }),
        institutionenTitel: fields.text({ label: 'Institutionelle Partner: Überschrift' }),
        warumTitel: fields.text({ label: 'Warum unterstützen: Überschrift' }),
        warumText: absatzText('Warum unterstützen: Text'),
        mappeTitel: fields.text({ label: 'Sponsoring: Überschrift' }),
        mappeText: fields.text({ label: 'Sponsoring: Text', multiline: true }),
        mappe: fields.file({
          label: 'Sponsoringmappe (PDF)',
          directory: 'public/dateien',
          publicPath: '/dateien/',
        }),
        mappeKnopf: fields.text({ label: 'Button zum Herunterladen' }),
        kontaktKnopf: fields.text({ label: 'Button für Kontakt' }),
      },
    }),

    /* ---------- Über uns ---------- */
    ueberUns: singleton({
      label: 'Über uns',
      path: 'src/content/seiten/ueber-uns',
      format: 'yaml',
      schema: {
        titel: fields.text({ label: 'Überschrift' }),
        einleitung: fields.text({ label: 'Einleitung', multiline: true }),
        werWirSindTitel: fields.text({ label: 'Wer wir sind: Überschrift' }),
        werWirSindText: absatzText('Wer wir sind / Bedeutung des Namens: Text'),
        rueckblickTitel: fields.text({ label: 'Rückblick: Überschrift' }),
        rueckblick: fields.array(
          fields.object({
            zeitpunkt: fields.text({ label: 'Zeitpunkt', description: 'z. B. Ende 2025' }),
            titel: fields.text({ label: 'Titel', description: 'z. B. Gründung, ILA Berlin' }),
            text: fields.text({ label: 'Beschreibung', multiline: true }),
            geplant: fields.checkbox({ label: 'Noch geplant', description: 'Wird gestrichelt angezeigt.', defaultValue: false }),
          }),
          {
            label: 'Rückblick (Missionslog)',
            description: 'Von früh nach spät eintragen; angezeigt wird das Neueste zuerst. Erscheint auf „Über uns“, der Startseite und über den News.',
            itemLabel: (m) => [m.fields.zeitpunkt.value, m.fields.titel.value].filter(Boolean).join(': ') || 'Neuer Eintrag',
          },
        ),
        einordnungTitel: fields.text({ label: 'Einordnung: Überschrift' }),
        einordnungText: absatzText('Einordnung (DGLR, HTW, Verein): Text'),
        vorstandTitel: fields.text({ label: 'Vorstand: Überschrift', description: 'Die Personen kommen aus der Sammlung „Personen“ (Häkchen „Gehört zum Vorstand“).' }),
      },
    }),

    /* ---------- Treffen aus dem Google Kalender (wird automatisch geschrieben) ---------- */
    kalender: singleton({
      label: 'Treffen aus dem Kalender',
      path: 'src/content/kalender',
      format: 'yaml',
      schema: {
        hinweis: fields.text({
          label: 'Hinweis',
          description: 'Diese Seite wird dienstags automatisch aus dem Google Kalender des Vereins (Termine „ELIA Treffen“) überschrieben. Änderungen bitte im Kalender machen, nicht hier.',
        }),
        aktualisiert: fields.date({ label: 'Zuletzt abgeglichen' }),
        treffen: fields.array(
          fields.object({
            datum: fields.date({ label: 'Datum', validation: { isRequired: true } }),
            uhrzeit: fields.text({ label: 'Uhrzeit', description: 'z. B. 17:30' }),
            ort: fields.text({ label: 'Ort' }),
          }),
          {
            label: 'Nächste Treffen laut Kalender',
            itemLabel: (t) => [t.fields.datum.value, t.fields.uhrzeit.value].filter(Boolean).join(', ') || 'Treffen',
          },
        ),
      },
    }),

    /* ---------- Allgemein: Menü, Fußzeile, wiederkehrende Beschriftungen ---------- */
    allgemein: singleton({
      label: 'Menü & Beschriftungen',
      path: 'src/content/allgemein',
      format: 'yaml',
      schema: {
        navigation: fields.array(
          fields.object({
            text: fields.text({ label: 'Beschriftung' }),
            link: fields.text({ label: 'Adresse', description: 'z. B. /themen' }),
            unterpunkte: fields.array(
              fields.object({
                text: fields.text({ label: 'Beschriftung' }),
                link: fields.text({ label: 'Adresse', description: 'z. B. /partner/sponsoren' }),
                zeile: fields.text({ label: 'Kleine Zeile darunter (optional)' }),
              }),
              {
                label: 'Untermenü (optional)',
                description: 'Erscheint beim Darüberfahren. Bei „Themen“ kommen die Einträge automatisch aus der Themen-Sammlung.',
                itemLabel: (u) => u.fields.text.value || 'Neuer Unterpunkt',
              },
            ),
          }),
          {
            label: 'Menü',
            description: 'Reihenfolge per Ziehen ändern. Ist die Liste leer, wird kein Menü angezeigt.',
            itemLabel: (p) => p.fields.text.value || 'Neuer Menüpunkt',
          },
        ),
        menueKnopf: fields.text({ label: 'Menü-Button auf dem Handy' }),
        menueUnterKnopf: fields.text({ label: 'Menü: Vorlesetext für den Pfeil am Untermenü', description: 'Für Screenreader, z. B. „Untermenü“' }),
        kontaktEmail: fields.text({ label: 'Kontakt-E-Mail', description: 'Wird überall verwendet, wo „Kontakt aufnehmen“ steht.' }),
        kontaktKnopf: fields.text({ label: 'Button „Kontakt aufnehmen“' }),
        fussText: fields.text({ label: 'Fußzeile: Text links' }),
        fussFelder: fields.array(
          fields.object({
            name: fields.text({ label: 'Bezeichnung', description: 'kleine Zeile, z. B. Sitz' }),
            wert: fields.text({ label: 'Eintrag', description: 'z. B. HTW Berlin, Treskowallee 8' }),
          }),
          {
            label: 'Fußzeile: Schriftfeld',
            description: 'Angaben im Kästchenraster der Fußzeile. Kontakt-E-Mail, Impressum und Datenschutz kommen automatisch dazu.',
            itemLabel: (f) => [f.fields.name.value, f.fields.wert.value].filter(Boolean).join(': ') || 'Neues Feld',
          },
        ),
        fussKontakt: fields.text({ label: 'Fußzeile: Bezeichnung für die E-Mail' }),
        fussRechtliches: fields.text({ label: 'Fußzeile: Bezeichnung für Impressum und Datenschutz' }),
        fussImpressum: fields.text({ label: 'Fußzeile: Link Impressum' }),
        fussDatenschutz: fields.text({ label: 'Fußzeile: Link Datenschutz' }),
        themaAnsprechperson: fields.text({ label: 'Themenseite: Überschrift Ansprechperson' }),
        themaWenWirSuchen: fields.text({ label: 'Themenseite: Überschrift „Wen wir suchen“' }),
        themaWorumEsGeht: fields.text({ label: 'Themenseite: Überschrift „Worum es geht“' }),
        themaWettbewerb: fields.text({ label: 'Themenseite: Überschrift Wettbewerb' }),
        themaBereich: fields.text({ label: 'Schriftfeld: Bezeichnung für den Bereich eines Themas', description: 'z. B. Bereich' }),
        themaAnsprechpersonKurz: fields.text({ label: 'Schriftfeld: Bezeichnung für die Ansprechperson' }),
        themaTeam: fields.text({ label: 'Themenseite: Überschrift Team' }),
        themaAnsprechpersonen: fields.text({ label: 'Themenseite: Überschrift bei mehreren Ansprechpersonen' }),
        themaStand: fields.text({ label: 'Themenseite: Überschrift „Aktueller Stand“' }),
        themaFormate: fields.text({ label: 'Themenseite: Überschrift Formate' }),
        themaNews: fields.text({ label: 'Themenseite: Überschrift News' }),
        mehrNews: fields.text({ label: 'Link „Alle News“' }),
        zurueckNews: fields.text({ label: 'Link „Zurück zu den News“' }),
        mehrErfahren: fields.text({ label: 'Button zu einem Thema', description: 'Der Name des Themas wird angehängt, z. B. „Zum Thema“ → „Zum Thema Rover“.' }),
        zumMitmachen: fields.text({ label: 'Link zur Seite „Mitmachen“' }),
      },
    }),
  },
});
