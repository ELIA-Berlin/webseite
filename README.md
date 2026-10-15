# ELIA Webseite

Webseite von ELIA, der studentischen Raumfahrtinitiative an der HTW Berlin (Nachwuchsgruppe der DGLR).

- **Inhalte pflegen ohne Programmierkenntnisse:** [docs/redaktion.md](docs/redaktion.md)
- **Einmalige Einrichtung (Netlify, Domain, Login):** [docs/einrichtung.md](docs/einrichtung.md)
- **Am Code arbeiten:** dieses Dokument

## Technik im Überblick

| Teil | Wofür | Doku |
|---|---|---|
| [Astro](https://docs.astro.build) | erzeugt aus Vorlagen und Inhalten statische HTML-Seiten | `src/pages`, `src/layouts`, `src/components` |
| [Keystatic](https://keystatic.com/docs) | Redaktionsbereich unter `/keystatic`, speichert Inhalte als Dateien im Repo | `keystatic.config.ts` |
| [Netlify](https://docs.netlify.com) | baut und hostet die Seite bei jedem Push auf `main` | `netlify.toml` |
| GitHub | Quelle aller Inhalte und des Codes, Login für die Redaktion | Organisation `ELIA-Berlin` |

Es gibt keine Datenbank. Alle Texte liegen in `src/content`, alle Bilder in `public/images`. Wer im Redaktionsbereich speichert, erzeugt einen Commit auf `main`, und Netlify veröffentlicht die Änderung nach ein bis zwei Minuten.

## Lokal starten

Voraussetzung: Node.js 22.12 oder neuer.

```bash
npm install
npm run dev
```

- Seite: http://localhost:4321
- Redaktionsbereich: http://localhost:4321/keystatic (speichert lokal direkt in die Dateien, kein Login nötig)

Weitere Befehle:

```bash
npm run build   # erzeugt die fertige Seite in dist/
npm run check   # prüft Typen und Vorlagen
```

## Aufbau des Repos

```
keystatic.config.ts      Welche Inhalte es gibt und welche Felder sie haben
src/
  content/               Alle Inhalte (von Keystatic geschrieben)
    news/                Beiträge, eine .mdoc-Datei pro Beitrag
    projekte/            Projektseiten
    team/                eine .yaml-Datei pro Person
    sponsoren/           eine .yaml-Datei pro Partner
    seiten/              Startseite, Kontakt, Impressum, Datenschutz
  lib/inhalte.ts         liest Inhalte für die Seiten, nur hier wird Keystatic angesprochen
  layouts/Basis.astro    Kopf, Navigation, Fußzeile
  components/            wiederverwendbare Bausteine
  pages/                 jede Datei wird zu einer URL
  styles/global.css      Farben, Schriften, Grundgestaltung
public/
  images/                hochgeladene Bilder, nach Bereich sortiert
docs/                    Anleitungen
```

## Häufige Änderungen

**Neues Feld für einen Inhaltstyp** (z. B. ein Datum für Projekte):
1. Feld in `keystatic.config.ts` im passenden `schema` ergänzen.
2. Feld in der zugehörigen Seite unter `src/pages` ausgeben.

**Neuer Inhaltstyp** (z. B. Veranstaltungen):
1. Neue `collection` in `keystatic.config.ts` anlegen und in `ui.navigation` eintragen.
2. Lese-Funktion in `src/lib/inhalte.ts` ergänzen.
3. Seiten unter `src/pages` anlegen und im Menü in `src/layouts/Basis.astro` verlinken.

**Farben oder Schriften ändern:** Variablen am Anfang von `src/styles/global.css`.

## Gestaltung

- Farben: Nachtblau `#1a1e4a` als Grund- und Textfarbe, kühles Papierweiß `#f5f7fc` als Hintergrund, Zündgelb `#ffc93c` als Akzent nur auf dunklem Grund.
- Schriften: [Unbounded](https://fonts.google.com/specimen/Unbounded) für Überschriften, [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible) für Text. Beide werden über `@fontsource` selbst ausgeliefert, damit keine Daten an Google gehen.
- Die Flugbahn im Kopf der Startseite ist die einzige Animation. Sie wird bei „Bewegung reduzieren“ im Betriebssystem abgeschaltet.

## Datenschutz-Grundsätze

Die Seite setzt keine Cookies, nutzt kein Tracking und lädt nichts von fremden Servern. Wer Karten, Videos, Formulare oder Analyse-Tools einbaut, muss die Datenschutzerklärung im Redaktionsbereich anpassen.
