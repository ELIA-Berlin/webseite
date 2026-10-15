# Einmalige Einrichtung

Diese Schritte sind nur einmal nötig. Sie brauchen Owner-Rechte in der GitHub-Organisation `ELIA-Berlin`.

## 1. Netlify verbinden

1. Bei [Netlify](https://app.netlify.com) mit einer ELIA-Adresse registrieren, nicht mit einer privaten. Am besten direkt ein Netlify-Team „ELIA“ anlegen und eine zweite Person als Owner einladen.
2. **Add new project → Import an existing project → GitHub** wählen und das Repo `ELIA-Berlin/webseite` freigeben.
3. Netlify liest die Einstellungen aus `netlify.toml`, es muss nichts geändert werden. Mit **Deploy** starten.
4. Nach ein bis zwei Minuten ist die Seite unter einer Adresse wie `irgendwas.netlify.app` erreichbar. Unter **Project configuration → Change project name** lässt sie sich z. B. in `elia-berlin.netlify.app` umbenennen.

Ab jetzt wird jede Änderung auf `main` automatisch veröffentlicht.

## 2. Redaktions-Login über GitHub einrichten

Damit Teammitglieder online unter `/keystatic` bearbeiten können, braucht Keystatic eine GitHub-App. Keystatic legt sie selbst an.

1. Repo lokal klonen, `npm install` ausführen und dann:
   ```bash
   npm run keystatic:setup
   ```
2. http://localhost:4321/keystatic öffnen. Keystatic bietet an, eine GitHub-App zu erstellen. Als Namen z. B. `ELIA Redaktion` wählen. Wird nach einer Organisation gefragt, `ELIA-Berlin` eintragen.
3. Nach dem Erstellen schreibt Keystatic eine Datei `.env` mit vier Werten in den Projektordner. Diese Datei **nicht committen** (sie steht bereits in `.gitignore`).
4. Die App auf dem Repo `ELIA-Berlin/webseite` installieren, wenn GitHub danach fragt.
5. In den Einstellungen der GitHub-App unter **Callback URLs** zusätzlich die Online-Adresse eintragen:
   ```
   https://elia-berlin.netlify.app/api/keystatic/github/oauth/callback
   ```
   Sobald die eigene Domain läuft, auch diese ergänzen, z. B. `https://www.eure-domain.de/api/keystatic/github/oauth/callback`.
6. In Netlify unter **Project configuration → Environment variables** die vier Werte aus `.env` eintragen:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
7. In Netlify **Deploys → Trigger deploy** auslösen. Danach funktioniert der Login unter `https://…/keystatic`.

Wurde die App unter einem privaten Account erstellt, kann sie in ihren Einstellungen unter **Advanced → Transfer ownership** an `ELIA-Berlin` übertragen werden.

## 3. Redakteurinnen und Redakteure freischalten

Wer Inhalte bearbeiten soll, braucht einen eigenen GitHub-Account mit Schreibrechten auf das Repo.

1. In der Organisation unter **Teams** ein Team `redaktion` anlegen.
2. Im Repo unter **Settings → Collaborators and teams** dem Team die Rolle **Write** geben.
3. Neue Leute in die Organisation einladen und dem Team hinzufügen.

Wer das Team verlässt, wird einfach aus dem Team entfernt.

## 4. Eigene Domain von Strato verbinden

Die Domain bleibt bei Strato, nur die DNS-Einträge zeigen auf Netlify.

1. In Netlify unter **Domain management → Add a domain** die Domain eintragen, z. B. `www.eure-domain.de`. Netlify zeigt danach die genauen Einträge an, die gesetzt werden müssen.
2. Bei Strato unter **Domains → Domainverwaltung → DNS** für die Domain:
   - für `www` einen **CNAME** auf `elia-berlin.netlify.app` setzen,
   - für die Hauptdomain ohne `www` einen **A-Eintrag** auf die IP-Adresse setzen, die Netlify anzeigt,
   - vorhandene A- und AAAA-Einträge, die noch auf Strato zeigen, entfernen.
3. Warten, bis Netlify die Domain als verbunden anzeigt (meist unter einer Stunde, selten bis zu 24 Stunden). Das HTTPS-Zertifikat kommt automatisch.
4. In `astro.config.mjs` den Wert `site` auf die neue Adresse ändern und die Callback-URL der GitHub-App ergänzen (siehe Schritt 2.5).

## 5. Vor dem Start prüfen

- [ ] Impressum und Datenschutzerklärung im Redaktionsbereich vollständig ausgefüllt, alle Platzhalter in eckigen Klammern ersetzt
- [ ] Kontakt-E-Mail und Social-Media-Links eingetragen
- [ ] Projekttexte ergänzt, Platzhalter entfernt
- [ ] Team-Einträge nur mit Einverständnis der jeweiligen Person, Fotos nur mit Zustimmung
- [ ] Logos von Sponsoren nur mit deren Erlaubnis
- [ ] Mindestens zwei Personen haben Owner-Rechte bei GitHub und Netlify
