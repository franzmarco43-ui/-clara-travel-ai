// Clara Travel AI — Azure Speech synthesis endpoint
// Keeps AZURE_SPEECH_KEY on Netlify's server; never expose it to the browser.

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      },
      body: ""
    };
  }

  const speechKey = process.env.AZURE_SPEECH_KEY;
  // The existing Azure Speech resource is hosted in Germany West Central.
  // Keep that known-good region as a safe fallback if the Netlify variable
  // was accidentally removed; an explicitly configured region always wins.
  const configuredRegion = (process.env.AZURE_SPEECH_REGION || "").trim().toLowerCase();
  const region = configuredRegion || "germanywestcentral";

  // Safe diagnostic endpoint: confirms configuration without exposing secrets.
  if (event.httpMethod === "GET") {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
      body: JSON.stringify({
        service: "clara-speech",
        ready: Boolean(speechKey && region),
        keyConfigured: Boolean(speechKey),
        regionConfigured: Boolean(configuredRegion),
        regionFallbackActive: !configuredRegion
      })
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { "Allow": "GET, POST, OPTIONS" }, body: "Method not allowed" };
  }

  if (!speechKey || !region) {
    const missing = [];
    if (!speechKey) missing.push("AZURE_SPEECH_KEY");
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        error: "Azure Speech-Konfiguration unvollständig.",
        missing
      })
    };
  }

  let text;
  let language = "de";
  try {
    const payload = JSON.parse(event.body || "{}");
    text = typeof payload.text === "string" ? payload.text.trim() : "";
    language = typeof payload.language === "string" ? payload.language.toLowerCase() : "de";
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "Ungültige JSON-Anfrage." })
    };
  }

  if (!text) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "Bitte gib einen Text ein." })
    };
  }
  if (text.length > 1800) {
    return {
      statusCode: 413,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: "Der Text ist zu lang. Bitte maximal 1.800 Zeichen verwenden." })
    };
  }

  const escapeXml = (value) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  language = String(language || "de").toLowerCase();
  const voices = {
    de: { locale: "de-DE", name: "de-DE-KatjaNeural" },
    en: { locale: "en-GB", name: "en-GB-SoniaNeural" },
    nl: { locale: "nl-NL", name: "nl-NL-FennaNeural" },
    fr: { locale: "fr-FR", name: "fr-FR-DeniseNeural" },
    ro: { locale: "ro-RO", name: "ro-RO-AlinaNeural" }
  };
  const selectedVoice = voices[language] || voices.de;
  const ssml = `<?xml version="1.0" encoding="UTF-8"?>
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${selectedVoice.locale}">
  <voice name="${selectedVoice.name}">
    <prosody rate="-4%" pitch="+1%"><break time="120ms"/>${escapeXml(text)}</prosody>
  </voice>
</speak>`;

  const azureUrl = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let azureResponse;
    try {
      azureResponse = await fetch(azureUrl, {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Ocp-Apim-Subscription-Key": speechKey,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
        "User-Agent": "ClaraTravelAI"
      },
      body: ssml
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!azureResponse.ok) {
      const detail = await azureResponse.text();
      console.error("Azure Speech error", azureResponse.status, detail.slice(0, 1200));
      return {
        statusCode: 502,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          error: "Azure Speech konnte die Stimme nicht erzeugen.",
          azureStatus: azureResponse.status,
          detail: detail.slice(0, 500)
        })
      };
    }

    const audio = Buffer.from(await azureResponse.arrayBuffer());
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff"
      },
      isBase64Encoded: true,
      body: audio.toString("base64")
    };
  } catch (error) {
    console.error("Clara Speech function failed", error);
    return {
      statusCode: 502,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        error: error && error.name === "AbortError"
          ? "Azure Speech hat nach 12 Sekunden nicht geantwortet."
          : "Verbindung zu Azure Speech fehlgeschlagen."
      })
    };
  }
};
