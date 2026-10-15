# ELIA Webseite

Webseite von ELIA, der studentischen Raumfahrtinitiative an der HTW Berlin (Nachwuchsgruppe der DGLR).

**Aktueller Stand:** Startseite, Impressum und Datenschutz sind fertig. Alle Unterseiten sind als Gerüst angelegt, ihre Inhalte werden nach und nach eingetragen. Der Online-Editor folgt.

## Aufbau der Seite

```
Startseite                /
├── Themen                /themen
│   ├── Rover             /themen/rover
│   ├── Rakete            /themen/rakete
│   ├── Space Law         /themen/space-law
│   └── Entrepreneurship  /themen/entrepreneurship
├── News                  /news  (Filter: /news?thema=rover)
│   └── Beitrag           /news/<adresse>
├── Mitmachen             /mitmachen
├── Partner & Sponsoren   /partner
├── Über uns              /ueber-uns
└── Impressum, Datenschutz
```

**Leere Abschnitte:** Solange ein Abschnitt leer ist, zeigt er lokal und in Netlify-Vorschauen einen gestrichelten Kasten „Inhalt folgt“. Auf der echten Seite (eliaspace.de) wird ein leerer Abschnitt einfach weggelassen.

**Optionale Abschnitte auf Themenseiten:** „Wettbewerb“ erscheint nur mit Häkchen, „Technik / Vertiefung“ nur mit Überschrift, „Formate“ nur mit mindestens einem Eintrag. Die neuesten News zum Thema erscheinen automatisch.

## Texte ändern

Alle Texte stehen als Dateien in [`src/content/`](src/content/), nichts davon steht fest im Code:

| Datei / Ordner | Im Editor | Inhalt |
|---|---|---|
| `startseite.yaml` | Seiten → Startseite | Texte der Startseite |
| `seiten/themen.yaml`, `seiten/news.yaml`, `seiten/mitmachen.yaml`, `seiten/partner.yaml`, `seiten/ueber-uns.yaml` | Seiten → … | Texte der jeweiligen Seite |
| `themen/` | Inhalte → Themen | eine Datei pro Thema; erscheint auf Startseite, Themenübersicht und als eigene Seite |
| `news/` | Inhalte → News | eine Datei pro Beitrag |
| `personen/` | Inhalte → Personen | Ansprechpersonen und Vorstand (Fotos nur mit Einwilligung) |
| `partner/` | Inhalte → Partner & Sponsoren | eine Datei pro Partner oder Sponsor mit Logo |
| `allgemein.yaml` | Allgemein → Menü & Beschriftungen | Menü, Fußzeile, Kontakt-E-Mail, wiederkehrende Beschriftungen |

Bilder, die über den Editor hochgeladen werden, landen in `public/bilder/`, die Sponsoringmappe in `public/dateien/`.

Es gibt drei Wege, Texte zu ändern. Neue News, Personen oder Partner legt man am einfachsten mit dem Editor an (Weg 2 oder 3).

### Weg 1: Direkt auf GitHub (geht sofort, ohne Installation)

1. Auf GitHub die Datei öffnen, z. B. [`src/content/startseite.yaml`](src/content/startseite.yaml).
2. Oben rechts auf das **Stift-Symbol** (Edit this file) klicken.
3. Den Text hinter dem Doppelpunkt ändern.
4. Oben rechts auf **Commit changes…** klicken, kurz beschreiben, was geändert wurde, und bestätigen.

Dabei bitte beachten:

- Den Feldnamen vor dem Doppelpunkt nicht ändern, z. B. `titel:`.
- Steht nach dem Doppelpunkt `>-` oder `|-`, folgt der Text eingerückt in den nächsten Zeilen. Die Einrückung (zwei Leerzeichen) muss bleiben.
- In längeren Texten beginnt eine Leerzeile einen neuen Absatz.
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

- **Editor:** http://localhost:4321/keystatic → links die Seite oder Sammlung wählen, Texte ändern, oben rechts **Save**.
- **Vorschau:** http://localhost:4321 zeigt die Änderung sofort.

Die Änderung landet in der passenden Datei unter `src/content/` und wird wie gewohnt mit Git committet und gepusht.

### Weg 3: Online-Editor (folgt)

Sobald die Seite bei Netlify läuft und der Login über GitHub eingerichtet ist, funktioniert derselbe Editor direkt unter `https://<unsere-domain>/keystatic`. Dann reicht ein GitHub-Account mit Schreibrechten, und jede gespeicherte Änderung ist nach ein bis zwei Minuten online.

### Welches Feld steht wo? (Startseite)

| Feld in `startseite.yaml` | Auf der Seite |
|---|---|
| `unterzeile`, `titel`, `einleitung` | dunkler Kopfbereich mit Raster |
| `knopfMitmachen`, `knopfThemen` | die beiden Buttons im Kopfbereich |
| `flugprofil` | Beschriftungen der animierten Flugbahn rechts im Kopf (Start, Brennschluss, Apogäum, Fallschirm, Landung) |
| `werWirSindTitel`, `werWirSindText` | weißer Bereich unter dem Kopf (erster Absatz groß) |
| `themenAufruf` | gestrichelter Kasten „Dein Bauteil fehlt noch“ unter den Themen |
| `missionslogTitel`, `missionslogLink` | dunkles Band mit der Zeitleiste; die Einträge stehen in `seiten/ueber-uns.yaml` unter `rueckblick` |
| `mitmachenTitel`, `mitmachenText`, `mitmachenKnopf`, `mitmachenEmail` | grauer Bereich unten; der Button schreibt an `mitmachenEmail` (leer = allgemeine Kontakt-E-Mail) |

Das Themenraster selbst kommt aus der Sammlung **Themen** (Felder „Skizze“, „Kleine Zeile über dem Namen“ und „Kurztext für die Startseite“, Reihenfolge über das Feld „Reihenfolge“).

**Raketenzeichnung (Stella):** steht auf der Themenseite Rakete im Abschnitt „Technik“. Beschriftungen und Schriftfeld in [`src/content/themen/rakete.yaml`](src/content/themen/rakete.yaml) unter `technik` → `raketenzeichnung`; `anzeigen: false` blendet sie aus.

**Missionslog:** Die Zeitleiste steht auf der Startseite und auf „Über uns“. Einträge ändern in [`src/content/seiten/ueber-uns.yaml`](src/content/seiten/ueber-uns.yaml) unter `rueckblick`. Jeder Eintrag hat `zeitpunkt`, `titel`, `text` und `geplant` (`true` = noch nicht erreicht, wird gestrichelt gezeigt).

### Skizzen der Themen austauschen

Jedes Thema hat eine Linienzeichnung. Sie erscheint auf der Startseite, in der Themenübersicht und (weiß eingefärbt) im Kopf der Themenseite. Die Dateien liegen in [`public/grafiken/themen/`](public/grafiken/themen/):

| Datei | Thema |
|---|---|
| `rover.svg` | Rover |
| `rakete.svg` | Rakete |
| `space-law.svg` | Space Law |
| `entrepreneurship.svg` | Entrepreneurship |

**Neue Skizze auf GitHub hochladen:**

1. Ordner [`public/grafiken/themen/`](public/grafiken/themen/) öffnen, oben rechts **Add file → Upload files**.
2. Die neue Datei mit **genau demselben Namen** hochladen, z. B. `rover.svg`. Sie ersetzt die alte.
3. Unten „Commit changes“. Nach etwa einer Minute ist die neue Skizze online.

Eine Datei mit anderem Namen oder als PNG geht auch. Dann zusätzlich in der Datei des Themas (z. B. [`src/content/themen/rover.yaml`](src/content/themen/rover.yaml)) die Zeile `skizze:` anpassen, z. B. `skizze: /grafiken/themen/doug.png`.

So sieht eine gute Skizze aus:
- Linienzeichnung in einer dunklen Farbe (am besten Navy `#182c3c`), **durchsichtiger Hintergrund**. Im dunklen Seitenkopf wird sie automatisch weiß.
- Querformat, etwa 16 : 10. Am besten SVG (bleibt scharf), sonst PNG mit mindestens 800 px Breite.
- Keine Fotos: Ein Foto für den Seitenkopf gehört ins Feld „Bild im Seitenkopf“ und hat dort Vorrang vor der Skizze.

**Impressum und Datenschutz** stehen als Textdateien in [`src/content/rechtliches/`](src/content/rechtliches/) und lassen sich wie oben (Weg 1) direkt auf GitHub ändern. Überschriften beginnen mit `##`, ein `\` am Zeilenende erzwingt einen Zeilenumbruch.

## Gestaltung

- **Leitidee: technische Zeichnung.** Dunkle Flächen sind fast schwarz (`--nacht`) mit feinem Millimeterraster und weichem Leuchten oben rechts. Die Startseite zeigt ein animiertes Flugprofil (`src/components/Flugprofil.astro`; bei „Bewegung reduzieren“ steht es still), die Raketenseite Stella als beschriftete Schnittzeichnung, jedes Thema hat eine eigene Skizze.
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
src/pages/                 eine Datei pro Seite; themen/[slug].astro ist die Vorlage für alle Themenseiten
src/components/            Bausteine: Seitenkopf, Abschnitt (mit Platzhalter), News-Liste
src/lib/inhalte.ts         liest die Inhalte, Hilfsfunktionen
src/layouts/Basis.astro    Kopfzeile, Navigation, Fußzeile
src/styles/global.css      Farben, Schriften, Grundgestaltung
public/                    Logo, Favicon, hochgeladene Bilder und Dateien
public/grafiken/themen/    Skizzen der vier Themen
```

`npm run build` erzeugt die fertige Seite in `dist/`, `npm run check` prüft den Code.

**Englisch später:** Deutsch bleibt auf der Hauptadresse, Englisch käme unter `/en/…`. Deshalb stehen alle Texte, auch Menü und Buttons, in `src/content/` und nicht im Code.
