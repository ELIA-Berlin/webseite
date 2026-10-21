# Partner und Sponsoren eintragen

Pro Partner oder Sponsor eine Datei `<name>.yaml` in diesem Ordner, z. B. `cashwerk.yaml`.
Das Logo kommt vorher nach `public/bilder/partner/`.

Vorlage zum Kopieren:

```yaml
name: cashwerk
art: sponsor
reihenfolge: 1
logo: /bilder/partner/cashwerk.svg
link: https://www.cashwerk.de
text: Ein Satz, wie uns der Partner unterstützt.
```

- `art`: `sponsor` (Logo-Raster) oder `institution` (z. B. HTW Berlin, DGLR)
- `reihenfolge`: kleinere Zahl steht weiter vorne
- `stufe` (optional, nur Sponsoren): z. B. `Gold`; wird nicht angezeigt. Jede Stufe ist eine eigene Zeile, die Zeilen werden nach unten kleiner (Reihenfolge nach `reihenfolge`). Gleiche Schreibweise für gleiche Stufen verwenden.
- `logo`: Pfad ab `/bilder/...`, genau wie der Dateiname im Ordner (Groß-/Kleinschreibung beachten)
- `text` und `link` sind optional
