# Anleitung: News-Beitrag veröffentlichen

Für alle, die Beiträge auf eliaspace.de schreiben (Öffentlichkeitsarbeit). Du brauchst keine Programmierkenntnisse, alles läuft im Browser. Das Formular lässt nur zu, was die Seite verträgt: Fehlt etwas oder ist ein Feld zu lang, lässt sich nicht speichern.

**So läuft es:** Du schreibst und speicherst den Beitrag. Er ist dann noch **nicht** öffentlich, sondern wartet auf die Freigabe durch den Vorstand. Erst wenn der Vorstand freigibt, erscheint er auf der Webseite (1 bis 2 Minuten später).

## Aufbau eines Beitrags (feste Vorlage)

| Nr. | Feld | Regel |
|---|---|---|
| 1 | **Bild** (+ Bildbeschreibung) | Querformat 3:2. Bei einem **Video** hier das Vorschaubild (16:9) hochladen und zusätzlich den **YouTube-Link** eintragen |
| 2 | **Überschrift** | 5 bis 90 Zeichen |
| 3 | **Untertitel** | 1 Satz, 10 bis 200 Zeichen (erscheint auch in der Übersicht) |
| 4 | **Text** | 200 bis **3500 Zeichen**, nur Fließtext, Leerzeile = neuer Absatz |
| 5 | **Abbinder** („Über ELIA“) | steht **automatisch** unter jedem Beitrag, nichts einzutragen |

Zusätzlich: **Datum** (ist schon „heute“) und optional ein **Thema** (Rover, Rakete …), dann erscheint der Beitrag auch auf der Themenseite.

**Schreibstil:** wie eine Pressemitteilung, aber lockerer. Korrekte Fakten (Wer, Was, Wann, Wo, Warum), aus der Wir-Perspektive („Wir haben …“, „Unser Team …“). Keine Formatierung, keine Links im Text.

## Einmalig: Zugang einrichten

Du brauchst ein GitHub-Konto mit **Zwei-Faktor-Anmeldung** und Schreibrechte auf das Repo `ELIA-Berlin/webseite` (Jonas lädt dich ein).

1. Auf GitHub oben rechts auf dein Profilbild → **Settings** → ganz unten links **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. **Token name:** „ELIA News-Editor“. **Expiration:** 1 Jahr. **Resource owner:** **ELIA-Berlin**.
3. **Repository access:** *Only select repositories* → `ELIA-Berlin/webseite`.
4. **Permissions → Repository permissions → Contents:** *Read and write*. Sonst nichts.
5. **Generate token** und den angezeigten Token sofort kopieren (er wird nur einmal gezeigt). Nicht weitergeben, nicht in Mails oder Chats einfügen.
6. Öffne **https://eliaspace.de/admin/**, klicke **Sign In Using Access Token** und füge den Token ein. Der Browser merkt ihn sich. Auf fremden oder gemeinsam genutzten Rechnern danach abmelden (Menü oben rechts).

## Jeder neue Beitrag

1. **https://eliaspace.de/admin/** öffnen (ggf. anmelden), links **News** → **New News-Beitrag**.
2. Felder von oben nach unten ausfüllen (siehe Tabelle):
   - **Bild:** höchstens ca. 1 MB, Metadaten/GPS vorher entfernen, nur eigene Bilder oder Bilder, die wir zeigen dürfen. **Bildbeschreibung:** ein Satz, was zu sehen ist.
   - **Video:** Video bei YouTube hochladen, Link aus der Adressleiste kopieren (`https://www.youtube.com/watch?v=…` oder `https://youtu.be/…`) und ins Feld „YouTube-Link“ einfügen. Das Vorschaubild kommt ins Feld „Bild“. Das Video wird nicht eingebettet: Besucher klicken auf das Bild, und YouTube öffnet sich in einem neuen Tab.
   - **Text:** Mehr als 3500 Zeichen lassen sich nicht speichern.
3. Oben rechts **Save**. Rote Hinweise am Feld sagen, was fehlt oder zu lang ist.
4. Jetzt **Jonas (oder jemand anderen aus dem Vorstand) Bescheid geben**, dass ein Beitrag zur Freigabe wartet. Auf GitHub liegt unter *Pull requests* ein Eintrag „Neue News zur Freigabe“.
5. Nach der Freigabe ist der Beitrag nach 1 bis 2 Minuten unter https://eliaspace.de/news zu sehen.

## Vor dem Speichern prüfen

- [ ] Namen, Zahlen, Daten und Orte stimmen
- [ ] Wir-Perspektive, keine Wertung ohne Beleg
- [ ] Bild/Video darf gezeigt werden (Rechte, abgebildete Personen einverstanden)
- [ ] Rechtschreibung gelesen

## Beitrag ändern oder löschen

Im Editor unter *News* den Beitrag öffnen, ändern und **Save**, oder oben **Delete**. Auch das geht erst nach Freigabe durch den Vorstand live.

## Wenn etwas nicht klappt

- **„Sign in“ klappt nicht oder „Not Found“:** Token abgelaufen oder falsch eingestellt (Schritt 1 bis 5 prüfen, Contents = Read and write, Repository = webseite). Neuen Token erzeugen.
- **Speichern geht nicht:** Rote Hinweise am Feld lesen. Meist ist ein Pflichtfeld leer oder der Text zu lang/kurz.
- **Der Beitrag ist nach der Freigabe nicht online:** Im Repo unter *Actions* beim Lauf „Webseite veröffentlichen“ nachsehen. Ein rotes Kreuz heißt, die Seite bleibt unverändert: Jonas Bescheid geben.
- **Token verloren oder Rechner gestohlen:** GitHub → Settings → Developer settings → Personal access tokens → Token löschen.

## Den Abbinder ändern (nur Vorstand)

Der gleichbleibende Schlusstext steht in `src/content/seiten/news.yaml` (Feld `abbinder`, auf GitHub mit dem Stift-Symbol bearbeiten) bzw. lokal im Editor unter *Seiten → News (Übersicht)*. Eine Änderung gilt für **alle** Beiträge, auch alte.
