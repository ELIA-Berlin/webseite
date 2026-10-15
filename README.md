# ELIA Webseite

Webseite von ELIA, der studentischen Raumfahrtinitiative an der HTW Berlin (Nachwuchsgruppe der DGLR).

**Aktueller Stand:** Startseite, Impressum und Datenschutz sind fertig. Unterseiten und Online-Editor folgen Schritt für Schritt.

**Neue Unterseite im Menü anzeigen:** in `src/layouts/Basis.astro` in der Liste `navigation` eintragen.

## Texte ändern

Alle Texte der Startseite stehen in einer einzigen Datei: [`src/content/startseite.yaml`](src/content/startseite.yaml). Es gibt drei Wege, sie zu ändern.

### Weg 1: Direkt auf GitHub (geht sofort, ohne Installation)

1. Auf GitHub die Datei [`src/content/startseite.yaml`](src/content/startseite.yaml) öffnen.
2. Oben rechts auf das **Stift-Symbol** (Edit this file) klicken.
3. Den Text hinter dem Doppelpunkt ändern.
4. Oben rechts auf **Commit changes…** klicken, kurz beschreiben, was geändert wurde, und bestätigen.

Dabei bitte beachten:

- Den Feldnamen vor dem Doppelpunkt nicht ändern, z. B. `titel:`.
- Steht nach dem Doppelpunkt `>-` oder `|-`, folgt der Text eingerückt in den nächsten Zeilen. Die Einrückung (zwei Leerzeichen) muss bleiben.
- Bei `werWirSindText` beginnt eine Leerzeile einen neuen Absatz.
- Enthält ein einzeiliger Text einen Doppelpunkt, den ganzen Text in Anführungszeichen setzen: `titel: "Ziel: der Weltraum"`.

### Weg 2: Mit dem Editor auf dem eigenen Rechner

Der Editor zeigt alle Texte als Formular, ohne dass man auf die Schreibweise achten muss.

Voraussetzung ist [Node.js](https://nodejs.org) ab Version 22.12.

```bash
git clone https://github.com/ELIA-Berlin/webseite.git
cd webseite
npm install
npm run dev
```

Dann im Browser öffnen:

- **Editor:** http://localhost:4321/keystatic → links auf **Startseite** klicken, Texte ändern, oben rechts **Save**.
- **Vorschau:** http://localhost:4321 zeigt die Änderung sofort.

Die Änderung landet in `src/content/startseite.yaml` und wird wie gewohnt mit Git committet und gepusht.

### Weg 3: Online-Editor (folgt)

Sobald die Seite bei Netlify läuft und der Login über GitHub eingerichtet ist, funktioniert derselbe Editor direkt unter `https://<unsere-domain>/keystatic`. Dann reicht ein GitHub-Account mit Schreibrechten, und jede gespeicherte Änderung ist nach ein bis zwei Minuten online.

### Welches Feld steht wo?

| Feld in `startseite.yaml` | Im Editor | Auf der Seite |
|---|---|---|
| `unterzeile` | Zeile über der Überschrift | kleine Zeile über dem großen Titel |
| `titel` | Überschrift | großer Titel neben dem Logo |
| `einleitung` | Einleitung unter der Überschrift | Text unter dem Titel |
| `werWirSindTitel`, `werWirSindText` | Abschnitt „Wer wir sind“ | weißer Bereich unter dem Kopf |
| `projekte` | Projektbereiche | Raster mit den Bereichen; Reihenfolge in der Datei = Reihenfolge auf der Seite |
| `projekteAufruf` | Letztes Feld im Projektraster | Feld „Dein Bauteil fehlt noch“ |
| `mitmachenTitel`, `mitmachenText` | Abschnitt „Mach mit“ | dunkler Bereich unten |
| `kontaktEmail` | E-Mail-Adresse für „Kontakt aufnehmen“ | Ziel des Buttons im Bereich „Mach mit“ |

**Impressum und Datenschutz** stehen als Textdateien in [`src/content/rechtliches/`](src/content/rechtliches/) und lassen sich wie oben (Weg 1) direkt auf GitHub ändern. Überschriften beginnen mit `##`, ein `\` am Zeilenende erzwingt einen Zeilenumbruch.

Die Beschriftung der Buttons, die Navigation und die Fußzeile stehen noch im Code (`src/pages/index.astro`, `src/layouts/Basis.astro`). Sie kommen in den Editor, sobald die Struktur der Seite feststeht.

## Gestaltung

- **Farben** aus dem Logo: Navy `#182c3c`, Ring-Grau `#eeeeee`, Weiß. Keine weiteren Akzentfarben.
- **Schriften:** Barlow Semi Condensed für Überschriften (an DIN angelehnt, passt zur Logo-Umschrift), Source Sans 3 für Fließtext. Beide liegen auf dem eigenen Server, es gehen keine Daten an Google.
- Festgelegt in [`src/styles/global.css`](src/styles/global.css).

## Für Entwickler

| Teil | Wofür |
|---|---|
| [Astro](https://docs.astro.build) | baut die Seite als statisches HTML |
| [Keystatic](https://keystatic.com/docs) | Editor unter `/keystatic`, Felder definiert in `keystatic.config.ts` |
| Netlify | Hosting, Einstellungen in `netlify.toml` (Einrichtung folgt) |

```
keystatic.config.ts        welche Texte im Editor bearbeitbar sind
src/content/               die Texte selbst
src/pages/index.astro      Startseite
src/layouts/Basis.astro    Kopfzeile, Navigation, Fußzeile
src/styles/global.css      Farben, Schriften, Grundgestaltung
public/                    Logo und Favicon
```

`npm run build` erzeugt die fertige Seite in `dist/`, `npm run check` prüft den Code.
