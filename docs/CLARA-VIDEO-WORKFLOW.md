# Clara Video Workflow – erster sprechender Avatar

## Ziel

Eine kurze vertikale Videobotschaft mit Claras festgelegtem Erscheinungsbild und ihrer ausgewählten deutschen Stimme erstellen:

1. Ein freigegebenes Clara-Masterporträt
2. Eine mit Microsoft Edge / Seraphina erzeugte Audiospur
3. Ein audio-gesteuertes Talking-Head-Video
4. MP4-Ausgabe und später Untertitel / Reise-B-Roll

## Schritt 1 – Sprachspur in Clara aufnehmen

In der produktiven Clara-App im Bereich **Claras Donau-Wissen → Clara Video Studio**:

1. Den endgültigen Sprechertext in das Textfeld einfügen.
2. Sicherstellen, dass im Chat-Bereich **Microsoft Seraphina Online (Natural) – German (Germany)** ausgewählt ist.
3. Auf **Sprachspur mit Claras Stimme aufnehmen** klicken.
4. Im Browserdialog den aktuellen Microsoft-Edge-Tab wählen und **Tab-Audio teilen** aktivieren.
5. Nach Ende der Sprachausgabe wird eine lokale Audiodatei `clara-voiceover-YYYY-MM-DD.webm` heruntergeladen.

Die Funktion nimmt nur den freigegebenen Tab-Ton auf. Sie fordert keinen Mikrofonzugriff an und lädt die Audiodatei nicht zu Netlify hoch. Die Browseraufnahme benötigt HTTPS sowie eine explizite Freigabe des Benutzers.

Falls keine Audiospur aufgenommen wurde: noch einmal starten und im Dialog ausdrücklich den Edge-Tab mit aktiviertem Tab-Audio auswählen. Die fertige Datei im Player gegenhören, bevor sie weiterverwendet wird.

## Schritt 2 – Porträt + Audio animieren

Für den ersten Prototyp ist **SadTalker** der einfachste Open-Source-Weg: ein einzelnes Porträtbild plus Audiodatei ergeben ein Talking-Head-Video. Das offizielle Repository führt Apache-2.0 als Lizenz und beschreibt diese Kombination ausdrücklich.

- Projekt: https://github.com/OpenTalker/SadTalker
- Im offiziellen README verlinkte Colab-Notebook-Vorlage: https://colab.research.google.com/github/Winfredy/SadTalker/blob/main/quick_demo.ipynb

In Colab:

1. Notebook öffnen und bei Google anmelden.
2. Unter **Runtime → Change runtime type** GPU wählen, sofern eine kostenlose GPU angeboten wird.
3. Notebook-Zellen der Reihe nach ausführen.
4. Das Clara-Masterporträt (JPG/PNG) und die zuvor heruntergeladene Sprachspur hochladen.
5. Falls das Notebook WAV benötigt, die WebM-Datei in Colab mit FFmpeg konvertieren:

   `ffmpeg -y -i clara-voiceover.webm -ar 16000 -ac 1 clara-voiceover.wav`

6. In SadTalker das Porträt als Source Image und die WAV-Datei als Driven Audio verwenden.
7. Das gerenderte MP4 herunterladen und Gesicht, Lippen-Synchronität sowie Ton kontrollieren.

**Wichtige Einschränkungen:** Google Colab stellt kostenlose GPU-Ressourcen ohne Garantie bereit; Verfügbarkeit und Laufzeitlimits schwanken. Die verlinkte SadTalker-Vorlage ist ein älteres Community-Notebook und kann Anpassungen benötigen. Deshalb zunächst nur einen kurzen Testclip von etwa 8–12 Sekunden verwenden. Nicht versuchen, SadTalker oder MuseTalk auf dem Intel Celeron N5095 / Intel UHD lokal zu rendern.

## Schritt 3 – Marken- und Qualitätsprüfung

Vor jeder Veröffentlichung:

- Nur das freigegebene Clara-Masterporträt verwenden.
- Keine fremde oder nicht bestätigte HeyGen-Voice-ID angeben. Die aufgenommene Sprachspur stammt aus der ausgewählten Edge-Stimme.
- Prüfen, ob Lippenbewegungen zur Audiospur passen.
- Tatsachen zu Reiseziel, Öffnungszeiten, Preisen und Anlegestellen separat aktuell belegen.
- Rechte und Lizenzen aller Modellgewichte und Zusatzkomponenten prüfen. Die SadTalker-Code-Lizenz allein klärt nicht automatisch die Lizenzen sämtlicher Drittmodelle und Abhängigkeiten.
- Das Resultat als KI-generierten Avatar kennzeichnen, wo dies bei der Plattform oder rechtlich erforderlich ist.

## Technische Abgrenzung

Der Browser kann Claras Seraphina-Stimme in der Chat-Oberfläche wiedergeben und über Tab-Audio lokal aufnehmen. Er stellt aber keine exportierbare Microsoft-Voice-ID oder direkte MP3-API bereit. Die Videoanimation läuft deshalb getrennt von Netlify und wird nicht im normalen Chat-Request ausgeführt.

Die lokale PC-Hardware (Intel Celeron N5095, 16 GB RAM, Intel UHD) bleibt für App-Bedienung und Sprachaufnahme zuständig. Die rechenintensive Avatar-Animation wird bei Bedarf in einer verfügbaren GPU-Umgebung ausgeführt.
