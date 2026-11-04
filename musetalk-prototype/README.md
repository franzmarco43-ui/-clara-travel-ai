# Clara – MuseTalk-On-Demand-Prototyp

Dieser Branch ist eine isolierte Teststrecke. Die produktive Website auf `main` bleibt unverändert.

## Ziel des ersten Tests

Aus Claras bestehendem Master-Porträt (`/clara-avatar.jpg`) und einer von Azure Speech erzeugten WAV-Datei wird ein kurzes MP4 mit audio-synchronisierten Mundbewegungen erzeugt.

**Wichtige Abgrenzung:** Der erste Proof of Concept ist bewusst ein kurzer, bedarfsweise gestarteter Clip (Batch-Inferenz), noch kein kontinuierlicher Live-WebRTC-Stream. Erst wenn Bildqualität, Identität, Lippensynchronität und Kosten stimmen, wird eine Streaming-Variante geplant.

## Bestandteile

- Bestehende Netlify-Website, Groq/Tavily-Chat und Azure-Speech bleiben unverändert.
- MuseTalk 1.5 läuft auf einer temporär gestarteten NVIDIA-GPU-Instanz.
- Die GPU wird nur für einen ausdrücklich gestarteten Test verwendet und danach gestoppt.
- Keine API-Schlüssel im Browser, Git-Repository oder in Logs.
- Das Clara-Porträt und Test-Audio nur über private, kurzlebige Uploads übertragen; keine öffentlichen Beispiel-URLs verwenden.

## Warum zuerst ein Batch-Test?

MuseTalks offizielles Repository dokumentiert die Echtzeit-Inferenz mit vorbereiteten Avatar-Daten und Audio-Clips. Für den ersten Test ist die normale Inferenz mit einem einzelnen Bild/Video und einer WAV-Datei einfacher zu prüfen. Die Echtzeit-Pipeline benötigt eine einmalige Vorbereitung des Avatars. Sie wird erst nach erfolgreichem Qualitätscheck aktiviert.

Offizielle Anleitung: https://github.com/TMElyralab/MuseTalk

## Testablauf

1. NVIDIA-GPU-Instanz nur für die Einrichtung starten.
2. MuseTalk 1.5 und die erforderlichen Modellgewichte gemäß offizieller Anleitung installieren.
3. Ein kurzes, rechtmäßig verwendbares Clara-Testbild bzw. Master-Porträt und eine kurze Azure-WAV-Datei in den privaten Arbeitsbereich laden.
4. MuseTalk mit genau diesem Bild/Video und Audio ausführen.
5. Ergebnis lokal prüfen: Gesichtsähnlichkeit, Mundform, Synchronität, Bildflackern und Audio.
6. GPU-Instanz nach dem Test stoppen und abrechenbare Laufzeit kontrollieren.

## Sicherheits- und Kostenregeln

- Niemals `LIVEAVATAR_API_KEY`, `AZURE_SPEECH_KEY`, `GROQ_API_KEY` oder `TAVILY_API_KEY` in diesen Branch schreiben.
- Für den ersten Test ist kein LiveAvatar-Schlüssel erforderlich.
- Keine GPU dauerhaft laufen lassen. Instanz nach jeder Testsession explizit stoppen oder löschen.
- Modell-Downloads und GPU-Laufzeit können Kosten verursachen. Vor dem Start Tarif, Speichergebühren und Abrechnungsmodus beim GPU-Anbieter prüfen.
- Modellgewichte und Drittanbieter-Abhängigkeiten haben eigene Lizenzbedingungen; vor kommerziellem Einsatz die jeweiligen Lizenzen kontrollieren.

## Noch nicht implementiert

- Keine Änderung an `index.html` oder produktiven Netlify Functions.
- Noch keine RunPod-API-Integration oder automatisches Starten/Stoppen.
- Noch kein öffentlich erreichbarer Upload-/Render-Endpunkt.
- Noch keine Live-Ausgabe im Chat.

Diese Punkte kommen erst nach dem erfolgreichen manuellen Qualitäts- und Kosten-Prototyp.
