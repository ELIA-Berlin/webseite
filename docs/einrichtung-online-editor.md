# Einrichtung Online-Editor für News (für den Vorstand, einmalig)

Ziel: Die Öffentlichkeitsarbeit schreibt News im Browser unter **https://eliaspace.de/admin/**. Veröffentlicht wird erst nach Freigabe durch den Vorstand. Du musst dafür **Owner** der GitHub-Organisation ELIA-Berlin sein. Gesamtdauer ca. 20 Minuten.

**Wie es technisch läuft:** Der Editor speichert Beiträge in den Zweig `redaktion`. Eine GitHub Action legt daraus automatisch einen Pull Request nach `main` an. Du gibst ihn frei (zusammenführen), dann baut die Seite sich neu und ist 1 bis 2 Minuten später live.

## Teil A: GitHub-Einstellungen (nur Owner)

1. **Zwei-Faktor-Anmeldung erzwingen.** github.com → Organisation **ELIA-Berlin** → **Settings** → **Authentication security** → **Require two-factor authentication** ankreuzen → speichern. (Wer noch keine 2FA hat, wird danach aufgefordert, sie einzurichten.)
2. **Persönliche Zugriffstoken für die Organisation erlauben.** Organisation → **Settings** → **Personal access tokens** → **Settings** (Reiter) → bei *Fine-grained personal access tokens* **Allow access via fine-grained personal access tokens** wählen. Empfehlung: *Require administrator approval* **aus** lassen, wenn du nur wenigen Personen vertraust, sonst musst du jeden Token freigeben.
3. **Actions dürfen Pull Requests anlegen.** Repo `webseite` → **Settings** → **Actions** → **General** → ganz unten *Workflow permissions* → **Allow GitHub Actions to create and approve pull requests** ankreuzen → **Save**.
4. **Pull-Request-Zusammenführung:** Repo → **Settings** → **General** → *Pull Requests* → **Allow merge commits** muss angekreuzt sein (Standard). Beim Freigeben immer „Create a merge commit“ wählen, nicht „Squash“.
5. **Deinen PR-Leiter einladen:** Repo → **Settings** → **Collaborators and teams** → **Add people** → GitHub-Name eingeben → Rolle **Write** (nicht Admin). Er nimmt die Einladung per E-Mail an.
6. **Schutz für `main` (empfohlen):** Repo → **Settings** → **Rules** → **Rulesets** → **New ruleset** → **New branch ruleset**.
   - *Ruleset name:* „main schützen“, *Enforcement status:* **Active**.
   - *Bypass list:* **Add bypass** → **Organization admin** (damit du selbst weiterarbeiten kannst).
   - *Target branches:* **Add target** → **Include default branch**.
   - Regeln ankreuzen: **Restrict deletions** und **Block force pushes**. Das schützt `main` vor Löschen und Überschreiben und kostet keinen Komfort.
   - **Optional, strenger:** zusätzlich **Require a pull request before merging** mit *Required approvals: 1*. Dann kann niemand außer dir (Bypass) direkt auf `main` schreiben. Achtung: Die geplante Aufgabe „ELIA Treffen abgleichen“ schreibt direkt auf `main` und würde dann ggf. scheitern. Nach dem Einschalten die Aufgabe einmal prüfen (Treffen im Kalender ändern, Lauf abwarten) oder bei Problemen diese Regel wieder ausschalten.
   - **Create** klicken.

## Teil B: Dein eigener Zugang und ein Testbeitrag

1. Mach dir einen eigenen Token (die Schritte stehen in [`news-anleitung.md`](news-anleitung.md) unter „Einmalig: Zugang einrichten“): fine-grained, Resource owner ELIA-Berlin, nur Repository `webseite`, **Contents: Read and write**, Laufzeit 1 Jahr.
2. **https://eliaspace.de/admin/** öffnen → **Sign In Using Access Token** → Token einfügen.
3. **News → New News-Beitrag**, ein Testbeitrag mit Bild ausfüllen (Überschrift z. B. „Test“), **Save**.
4. Auf GitHub im Repo **Pull requests**: Nach wenigen Sekunden steht dort **„Neue News zur Freigabe“** (falls nicht: Reiter *Actions* → „News zur Freigabe“ ansehen; sonst Pull Request von Hand anlegen: *New pull request*, base `main`, compare `redaktion`).
5. Pull Request öffnen, im Reiter **Files changed** den Beitrag ansehen (eine `.yaml`-Datei unter `src/content/news/` und das Bild), dann **Merge pull request → Create a merge commit → Confirm**.
6. Unter **Actions** läuft „Webseite veröffentlichen“. Bei grünem Haken ist der Beitrag unter https://eliaspace.de/news sichtbar.
7. Testbeitrag wieder entfernen: im Editor öffnen → **Delete** → ebenfalls per Pull Request freigeben.

## Teil C: Deinem PR-Leiter übergeben

- Link zur Anleitung [`docs/news-anleitung.md`](news-anleitung.md) (er braucht GitHub-Konto mit 2FA, die Einladung aus A5 und erstellt seinen Token nach der Anleitung).
- Vereinbart: Er speichert, **du gibst frei**. Er sagt dir Bescheid, wenn ein Beitrag wartet.

## Laufender Betrieb

- **Token läuft ab** (nach 1 Jahr): neuen Token erzeugen, im Editor neu anmelden.
- **Person scheidet aus:** Repo → Settings → Collaborators → Person entfernen. Ihre Token funktionieren dann nicht mehr.
- **Neues Thema auf der Webseite:** auch in `public/admin/config.yml` bei `thema` die Auswahlliste ergänzen.
- **Felder ändern:** immer in `keystatic.config.ts` **und** `public/admin/config.yml`.
- **Mehr Autoren:** Wenn viele schreiben sollen, lohnt sich die Anmeldung per GitHub-Konto statt Token (kleiner kostenloser Cloudflare Worker „sveltia-cms-auth“). Sag Bescheid, dann bereite ich das vor.

## Sicherheit in Kürze

- `/admin/` zeigt öffentlich nur die Anmeldung. Ohne gültigen Token mit Schreibrecht passiert nichts.
- Der Token gilt nur für **dieses eine Repo** und nur für Dateien (Contents). Er kann keine Organisation verwalten.
- Bis zur Freigabe ist nichts öffentlich auf der Seite. Der Vorstand ist die zweite Kontrolle.
- Der Token liegt im Browser der jeweiligen Person: nur auf eigenen Geräten verwenden, bei Verlust sofort löschen.
