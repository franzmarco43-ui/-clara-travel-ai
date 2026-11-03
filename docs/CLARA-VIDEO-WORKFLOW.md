# Clara Video Workflow – sprechender Avatar

## Ziel

Eine kurze vertikale Videobotschaft mit Claras freigegebenem Masterporträt und ihrer festen Stimme erstellen:

1. Sprechertext mit Microsoft Seraphina Neural erzeugen
2. MP3-Datei herunterladen
3. Clara-Porträt mit SadTalker audio-gesteuert animieren
4. MP4 prüfen und später Untertitel / Reise-B-Roll ergänzen

## Schritt 1 – Microsoft Speech (kostenfreier F0-Tarif)

Claras Video Studio erzeugt die Sprachdatei direkt über die geschützte Netlify Function `/.netlify/functions/tts`. Die Function verwendet fest die offizielle Microsoft-Stimme:

- Voice ID: `de-DE-SeraphinaMultilingualNeural`
- Locale: `de-DE`
- Output: MP3, 24 kHz
- Maximale Eingabe: 4.000 Zeichen je Anfrage

Microsoft dokumentiert Seraphina als deutsche Neural-/Multilingual-Stimme. Der Azure Speech F0-Tarif bietet laut aktueller Preisseite 500.000 Zeichen Neural-TTS pro Monat kostenlos. Azure-Konto, Speech-Ressource und deren Schlüssel/Region sind trotzdem erforderlich. Prüfe beim Anlegen ausdrücklich den Tarif **Free F0** und kontrolliere im Azure-Portal das aktuelle Kontingent.

Offizielle Informationen:
- Stimmenliste: https://learn.microsoft.com/azure/ai-services/speech-service/language-support?tabs=tts
- REST-API und Authentifizierung: https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech
- Preise und Free-F0-Kontingent: https://azure.microsoft.com/de-de/pricing/details/speech/

### Einmalige Einrichtung der Azure Speech-Ressource

1. Im Azure-Portal eine **Speech**-Ressource erstellen.
2. Tarif **Free F0** wählen, Region **West Europe** (sofern bei der Ressourcenerstellung verfügbar).
3. Nach der Bereitstellung die Seite **Keys and Endpoint** öffnen.
4. Einen der Speech-Ressourcenschlüssel kopieren und die Region notieren. Den Schlüssel niemals in HTML, GitHub, Chat-Nachrichten oder einem öffentlichen Dokument hinterlegen.

### In Netlify hinterlegen

Im Netlify-Projekt **clara-travel-ai** zu **Project configuration → Environment variables** gehen und zwei Variablen anlegen:

- `AZURE_SPEECH_KEY` = der geheime Schlüssel der Speech-Ressource
- `AZURE_SPEECH_REGION` = `westeurope` (oder die tatsächlich angelegte Ressource-Region)

Die Schlüsselvariable nur für **Functions** verfügbar machen. Sie muss für Production und Deploy Previews gesetzt sein, falls die Funktion in beiden Kontexten getestet wird. Die Region ist keine geheime Information; sie kann ebenfalls auf Functions beschränkt werden. Danach ist ein neuer Deploy erforderlich, damit die Function die Variablen erhält.

Die Netlify-Function hält den Schlüssel serverseitig und gibt nur die MP3-Datei an den Browser zurück. Der Text wird über Netlify an Microsoft Speech gesendet. Die Audiodatei wird dann lokal im Browser wiedergegeben und heruntergeladen.

### MP3 erzeugen

1. In Clara **Donau-Wissen → Clara Video Studio** öffnen.
2. Den Sprechertext (bis 4.000 Zeichen) in das Textfeld einfügen.
3. **Seraphina-Sprachspur als MP3 erzeugen** klicken.
4. Die erzeugte MP3 im Player anhören und herunterladen.
5. Erst bei hörbarer, vollständiger Stimme die Datei für den Avatar verwenden.

Wenn die Function meldet, der Sprachdienst sei nicht eingerichtet, fehlen die beiden Netlify-Variablen oder sie sind für den Function-Kontext nicht verfügbar. Bei HTTP 401/403 Schlüssel und Region prüfen; bei HTTP 429 das F0-Kontingent und Limits prüfen.

## Schritt 2 – Porträt + Audio animieren

Für den ersten Prototyp ist **SadTalker** ein geeigneter Open-Source-Weg: ein einzelnes Porträtbild plus Audiodatei ergeben ein Talking-Head-Video. Das offizielle Repository nennt Apache-2.0 für den Projektcode.

- Projekt: https://github.com/OpenTalker/SadTalker
- Im Projekt verlinkte Colab-Notebook-Vorlage: https://colab.research.google.com/github/Winfredy/SadTalker/blob/main/quick_demo.ipynb

In Colab:

1. Notebook öffnen und bei Google anmelden.
2. Unter **Runtime → Change runtime type** GPU auswählen, sofern eine kostenlose GPU angeboten wird.
3. Notebook-Zellen der Reihe nach ausführen.
4. Das freigegebene Clara-Masterporträt (JPG/PNG) und die Seraphina-MP3-Datei hochladen.
5. Falls WAV benötigt wird, die MP3 in Colab mit FFmpeg konvertieren:

   `ffmpeg -y -i clara-seraphina-voiceover.mp3 -ar 16000 -ac 1 clara-voiceover.wav`

6. In SadTalker das Porträt als Source Image und die WAV-Datei als Driven Audio verwenden.
7. Das gerenderte MP4 herunterladen und Gesicht, Lippen-Synchronität sowie Ton kontrollieren.

**Wichtige Einschränkungen:** Google Colab stellt kostenlose GPU-Ressourcen ohne Garantie bereit; Verfügbarkeit und Laufzeitlimits schwanken. Die verlinkte SadTalker-Vorlage ist ein älteres Community-Notebook und kann Anpassungen benötigen. Deshalb zunächst nur einen kurzen Testclip von etwa 8–12 Sekunden verwenden. Nicht versuchen, SadTalker oder MuseTalk auf dem Intel Celeron N5095 / Intel UHD lokal zu rendern.

## Schritt 3 – Marken- und Qualitätsprüfung

Vor jeder Veröffentlichung:

- Nur das freigegebene Clara-Masterporträt verwenden.
- Die festgelegte Voice ID `de-DE-SeraphinaMultilingualNeural` beibehalten.
- Prüfen, ob Lippenbewegungen zur Audiospur passen.
- Tatsachen zu Reiseziel, Öffnungszeiten, Preisen und Anlegestellen separat aktuell belegen.
- Rechte und Lizenzen aller Modellgewichte und Zusatzkomponenten prüfen. Die SadTalker-Code-Lizenz allein klärt nicht automatisch die Lizenzen sämtlicher Drittmodelle und Abhängigkeiten.
- Das Resultat als KI-generierten Avatar kennzeichnen, wo dies bei Plattform oder Recht erforderlich ist.

## Technische Abgrenzung

Die Chat-Sprachausgabe kann weiter die verfügbare Seraphina-Browserstimme verwenden. Für exportierbare Video-Audiospuren wird die offizielle Microsoft-Speech-REST-API mit derselben Seraphina-Stimme verwendet, damit eine echte MP3-Datei entsteht. Die MP3-Erzeugung läuft in einer separaten Netlify Function und blockiert nicht den normalen Chat.

Die lokale PC-Hardware (Intel Celeron N5095, 16 GB RAM, Intel UHD) bleibt für App-Bedienung zuständig. Die rechenintensive Avatar-Animation wird in einer verfügbaren GPU-Umgebung ausgeführt.
