# Anleitung: News-Beitrag veröffentlichen

Für alle, die Beiträge auf eliaspace.de schreiben (Öffentlichkeitsarbeit). Du brauchst keine Programmierkenntnisse. Das Formular lässt nur zu, was die Seite verträgt: Fehlt etwas oder ist ein Feld zu lang, lässt sich nicht speichern.

## Aufbau eines Beitrags (feste Vorlage)

| Nr. | Feld | Regel |
|---|---|---|
| 1 | **Medium** | entweder ein **Bild** oder ein **Video** (YouTube-Link + Vorschaubild) |
| 2 | **Überschrift** | 5 bis 90 Zeichen |
| 3 | **Untertitel** | 1 Satz, 10 bis 200 Zeichen (erscheint auch in der Übersicht) |
| 4 | **Text** | 200 bis **3500 Zeichen**, nur Fließtext, Leerzeile = neuer Absatz |
| 5 | **Abbinder** („Über ELIA“) | steht **automatisch** unter jedem Beitrag, nichts einzutragen |

Zusätzlich: **Datum** (ist schon „heute“) und optional ein **Thema** (Rover, Rakete …), dann erscheint der Beitrag auch auf der Themenseite.

**Schreibstil:** wie eine Pressemitteilung, aber lockerer. Korrekte Fakten (Wer, Was, Wann, Wo, Warum), aus der Wir-Perspektive („Wir haben …“, „Unser Team …“). Keine Formatierung, keine Links im Text.

## Einmalig einrichten

1. [Node.js](https://nodejs.org) (Version 22.12 oder neuer) installieren.
2. [GitHub Desktop](https://desktop.github.com) installieren und mit deinem GitHub-Konto anmelden. Du musst in der Organisation ELIA-Berlin Schreibrechte haben (Jonas trägt dich ein).
3. In GitHub Desktop: *File → Clone repository → ELIA-Berlin/webseite*.
4. Terminal im Ordner `webseite` öffnen (in GitHub Desktop: *Repository → Open in Terminal*) und einmal `npm install` eingeben.

## Jeder neue Beitrag

1. In GitHub Desktop auf **Fetch origin** / **Pull origin** klicken, damit du den neuesten Stand hast.
2. Im Terminal `npm run dev` eingeben und den Link **http://localhost:4321/keystatic** im Browser öffnen.
3. Links **News** wählen, oben rechts **Create entry**.
4. Felder von oben nach unten ausfüllen (siehe Tabelle):
   - **Bild:** Querformat (3:2), höchstens ca. 1 MB, Metadaten/GPS vorher entfernen, nur eigene Bilder. Dazu eine **Bildbeschreibung** (ein Satz, was zu sehen ist).
   - **Video:** Video auf YouTube hochladen, Link aus der Adressleiste kopieren (`https://www.youtube.com/watch?v=…` oder `https://youtu.be/…`), dazu ein **Vorschaubild** (16:9, z. B. Standbild) und eine Bildbeschreibung. Das Video wird nicht eingebettet: Besucher klicken auf das Vorschaubild und öffnen YouTube in einem neuen Tab.
   - **Überschrift:** Die „Adresse“ darunter erzeugt sich selbst, nicht ändern.
   - **Text:** Mehr als 3500 Zeichen lassen sich nicht speichern.
5. Oben rechts **Save**. Rote Hinweise am Feld sagen, was fehlt.
6. Die Vorschau prüfen: http://localhost:4321/news
7. In GitHub Desktop siehst du links die neuen Dateien (eine `.yaml`-Datei in `src/content/news/` und das Bild in `public/bilder/news/`). Unten links eine kurze Beschreibung eintragen, z. B. „News: Brenntest“, dann **Commit to main** und oben **Push origin**.
8. Nach 1 bis 2 Minuten ist der Beitrag live. Du erkennst es an einem grünen Haken im Reiter *Actions* des Repos (Workflow „Webseite veröffentlichen“). Ein rotes Kreuz heißt: Die Seite bleibt unverändert, melde dich bei Jonas.

## Vor dem Veröffentlichen prüfen

- [ ] Namen, Zahlen, Daten und Orte stimmen
- [ ] Wir-Perspektive, keine Wertung ohne Beleg
- [ ] Bild/Video darf gezeigt werden (Rechte, abgebildete Personen einverstanden)
- [ ] Rechtschreibung gelesen
- [ ] Vorschau auch im schmalen Browserfenster (Handy-Format) angesehen

## Beitrag ändern oder löschen

- **Ändern:** im Editor unter *News* den Beitrag öffnen, ändern, Save, dann wie oben committen und pushen.
- **Löschen:** im Editor den Beitrag öffnen, oben **Delete**, dann committen und pushen.

## Den Abbinder ändern

Der gleichbleibende Schlusstext steht im Editor unter *Seiten → News (Übersicht)* („Abbinder: Text“). Eine Änderung gilt für **alle** Beiträge, auch alte.
