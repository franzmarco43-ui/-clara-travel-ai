# Clara Live-Recherche einrichten

## Was eingebaut wurde

Claras Netlify-Chat kann bei Orts- und Reisezielfragen, aktuellen Angaben, Veranstaltungs- und Öffnungszeitenfragen sowie Schleusen-/Wasserstraßenthemen automatisch eine Websuche über die Tavily Search API ausführen.

- Einfache Suche mit maximal fünf Ergebnissen pro Anfrage.
- Die Antwort bekommt die gefundenen Textauszüge und Quellenlinks.
- Die Chat-Oberfläche zeigt die tatsächlich abgerufenen Quellen unter Claras Antwort.
- Aktuelle/variable Angaben dürfen ohne erfolgreiche Recherche nicht als bestätigt ausgegeben werden.
- Für sicherheits-, schifffahrts- und mobilitätsbezogene Fragen sind offizielle Behörden-/Betreiberquellen erforderlich.
- Suchauszüge werden als nicht vertrauenswürdige Daten behandelt; darin enthaltene Anweisungen werden ignoriert.
- Wiederholte identische Suchen werden im warmen Function-Prozess bis zu zehn Minuten zwischengespeichert.
- Der Suchschlüssel bleibt serverseitig. Er gehört nicht in `index.html`, GitHub oder den Browser.
- Rollator-Fragen bleiben entsprechend der Produktentscheidung bei einem neutralen Hinweis ohne konkrete Eignungsurteile.

## Einmalige Einrichtung

1. Bei [Tavily](https://app.tavily.com/) ein Konto anlegen und einen API-Schlüssel erzeugen.
2. In Netlify die Website **clara-travel-ai** öffnen.
3. Zu **Project configuration → Environment variables** gehen.
4. Eine Variable mit diesem Namen anlegen:

   `TAVILY_API_KEY`

5. Den Tavily-Schlüssel als geheimen Wert hinterlegen. Die Variable muss für **Functions** verfügbar sein (wenn keine Scope-Auswahl angeboten wird, die Standardverfügbarkeit verwenden).
6. Speichern und anschließend einen neuen Deploy auslösen. Netlify übernimmt Änderungen an Runtime-Umgebungsvariablen erst in einem neuen Deploy.

**Sicherheit:** Den Schlüssel niemals in GitHub-Dateien, Chatnachrichten, Screenshots, `index.html` oder öffentlich sichtbaren Build-Variablen speichern. Falls er versehentlich öffentlich wird, sofort bei Tavily widerrufen und ersetzen.

## Test nach Einrichtung

Im Clara-Chat nacheinander testen:

- `Welche Sehenswürdigkeiten sollte ich in Budapest besuchen?`
- `Welche Öffnungszeiten hat das Parlament heute?`
- `Wie ist der aktuelle Status der Schleuse Kachlet?`

Bei erfolgreich ausgeführten Suchen muss Clara Quellenlinks unter ihrer Antwort anzeigen. Bei fehlendem Schlüssel, Zeitüberschreitung, erschöpftem Kontingent oder unzureichenden offiziellen Quellen muss sie das offen sagen und darf keine aktuelle Antwort erfinden.

## Kostenkontrolle

Tavily führt einen kostenlosen Einstieg mit 1.000 API-Credits pro Monat auf. Clara nutzt standardmäßig die einfache Suche (`basic`), höchstens fünf Ergebnisse und keine zusätzliche Rohseiten-Extraktion. Die tatsächliche Credit-Nutzung und das verbleibende Kontingent im Tavily-Dashboard prüfen.
