const speechSdk = require("microsoft-cognitiveservices-speech-sdk");

const voices = {
  de: { locale: "de-DE", name: "de-DE-KatjaNeural" },
  en: { locale: "en-GB", name: "en-GB-SoniaNeural" },
  nl: { locale: "nl-NL", name: "nl-NL-FennaNeural" },
  fr: { locale: "fr-FR", name: "fr-FR-DeniseNeural" },
  ro: { locale: "ro-RO", name: "ro-RO-AlinaNeural" }
};

exports.handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const allowedOrigin =
    origin === "https://clara-travel-ai.netlify.app" ||
    /^https:\/\/deploy-preview-\d+--clara-travel-ai\.netlify\.app$/i.test(origin);
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };
  if (allowedOrigin) headers["Access-Control-Allow-Origin"] = origin;

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: allowedOrigin ? 204 : 403, headers, body: "" };
  }
  if (!allowedOrigin) {
    return { statusCode: 403, headers, body: JSON.stringify({ error: "Ursprung nicht freigegeben." }) };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Bitte POST verwenden." }) };
  }

  const speechKey = process.env.AZURE_SPEECH_KEY;
  if (!speechKey) {
    return { statusCode: 503, headers, body: JSON.stringify({ error: "Azure Speech ist auf dem Preview-Deployment nicht konfiguriert." }) };
  }

  let payload = {};
  try { payload = JSON.parse(event.body || "{}"); }
  catch (_) { return { statusCode: 400, headers, body: JSON.stringify({ error: "Ungültige JSON-Anfrage." }) }; }

  const text = typeof payload.text === "string" ? payload.text.trim() : "";
  const language = typeof payload.language === "string" ? payload.language.toLowerCase() : "de";
  if (!text) return { statusCode: 400, headers, body: JSON.stringify({ error: "Bitte gib einen Text ein." }) };
  if (text.length > 1800) return { statusCode: 413, headers, body: JSON.stringify({ error: "Der Text ist zu lang. Bitte maximal 1.800 Zeichen verwenden." }) };

  const selectedVoice = voices[language] || voices.de;
  const rawRegion = (process.env.AZURE_SPEECH_REGION || "").trim().toLowerCase();
  const region = rawRegion.replace(/[\s_-]/g, "") || "germanywestcentral";
  let synthesizer;

  try {
    const speechConfig = speechSdk.SpeechConfig.fromSubscription(speechKey, region);
    speechConfig.speechSynthesisVoiceName = selectedVoice.name;
    speechConfig.speechSynthesisLanguage = selectedVoice.locale;
    const pcmFormat = speechSdk.SpeechSynthesisOutputFormat?.Riff24Khz16BitMonoPcm;
    if (pcmFormat) speechConfig.speechSynthesisOutputFormat = pcmFormat;
    synthesizer = new speechSdk.SpeechSynthesizer(speechConfig, null);

    const result = await new Promise((resolve, reject) => {
      let settled = false;
      const finish = (error, value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        try { synthesizer.close(); } catch (_) {}
        if (error) reject(error);
        else resolve(value);
      };
      const timer = setTimeout(() => finish(new Error("Azure Speech hat nach 20 Sekunden nicht geantwortet.")), 20000);
      const visemes = [];
      synthesizer.visemeReceived = (_sender, args) => {
        const audioOffset = Number(args?.audioOffset);
        const visemeId = Number(args?.visemeId);
        if (Number.isFinite(audioOffset) && Number.isFinite(visemeId) && visemes.length < 3000) {
          visemes.push({ audioOffset, visemeId });
        }
      };
      synthesizer.speakTextAsync(text, speechResult => {
        if (!speechResult || speechResult.reason !== speechSdk.ResultReason.SynthesizingAudioCompleted || !speechResult.audioData) {
          finish(new Error(speechResult?.errorDetails || "Azure Speech konnte keine Audiodaten erzeugen."));
          return;
        }
        const audio = Buffer.from(speechResult.audioData);
        if (!audio.length) {
          finish(new Error("Azure Speech hat eine leere Audiodatei geliefert."));
          return;
        }
        visemes.sort((a, b) => a.audioOffset - b.audioOffset);
        finish(null, { audio: audio.toString("base64"), visemes });
      }, error => finish(new Error(String(error || "Azure Speech synthesis failed."))));
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        audio: result.audio,
        visemes: result.visemes,
        contentType: "audio/wav",
        voice: selectedVoice.name,
        visemeTimebase: "100ns"
      })
    };
  } catch (error) {
    console.error("Clara viseme speech failed:", String(error?.message || error).slice(0, 400));
    try { synthesizer?.close(); } catch (_) {}
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        error: error?.message?.includes("20 Sekunden")
          ? "Azure Speech hat nicht rechtzeitig geantwortet."
          : "Azure Speech mit Visem-Ereignissen ist fehlgeschlagen."
      })
    };
  }
};
