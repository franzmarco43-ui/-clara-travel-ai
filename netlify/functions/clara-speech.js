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

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { "Allow": "POST" }, body: "Method not allowed" };
  }

  const speechKey = process.env.AZURE_SPEECH_KEY;
  const region = (process.env.AZURE_SPEECH_REGION || "").trim().toLowerCase();

  if (!speechKey || !region) {
    const missing = [];
    if (!speechKey) missing.push("AZURE_SPEECH_KEY");
    if (!region) missing.push("AZURE_SPEECH_REGION");
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        error: "Azure Speech-Konfiguration unvollständig.",
        missing
      })
    };
  }

  let text, language;
  try {
    const payload = JSON.parse(event.body || "{}");
    text = typeof payload.text === "string" ? payload.text.trim() : "";
    language = String(payload.language || "de").toLowerCase();
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

  const speechProfiles = {
    de: { locale: "de-DE", voice: "de-DE-SeraphinaMultilingualNeural" },
    en: { locale: "en-GB", voice: "en-GB-SoniaNeural" },
    nl: { locale: "nl-NL", voice: "nl-NL-FennaNeural" },
    fr: { locale: "fr-FR", voice: "fr-FR-DeniseNeural" },
    ro: { locale: "ro-RO", voice: "ro-RO-AlinaNeural" }
  };
  const profile = speechProfiles[language] || speechProfiles.de;
  const ssml = `<?xml version="1.0" encoding="UTF-8"?>
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${profile.locale}">
  <voice name="${profile.voice}">
    <prosody rate="0%" pitch="0%">${escapeXml(text)}</prosody>
  </voice>
</speak>`;

  const azureUrl = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

  try {
    const azureResponse = await fetch(azureUrl, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": speechKey,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "riff-24khz-16bit-mono-pcm",
        "User-Agent": "ClaraTravelAI"
      },
      body: ssml
    });

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
      body: JSON.stringify({ error: "Verbindung zu Azure Speech fehlgeschlagen." })
    };
  }
};
