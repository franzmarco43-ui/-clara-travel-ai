const VOICE_NAME = "de-DE-SeraphinaMultilingualNeural";
const MAX_TEXT_LENGTH = 4000;

function json(statusCode, payload, headers) {
  return {
    statusCode,
    headers: { ...headers, "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload)
  };
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

exports.handler = async function (event) {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  const allowedOrigin =
    origin === "https://clara-travel-ai.netlify.app" ||
    /^https:\/\/deploy-preview-\d+--clara-travel-ai\.netlify\.app$/.test(origin) ||
    origin === "http://localhost:8888" ||
    origin === "http://127.0.0.1:8888";

  const headers = {
    "Access-Control-Allow-Origin": allowedOrigin ? origin : "https://clara-travel-ai.netlify.app",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
    "Cache-Control": "no-store"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Bitte POST verwenden." }, headers);
  }
  if (origin && !allowedOrigin) {
    return json(403, { error: "Diese Herkunft ist für Claras Sprachdienst nicht freigegeben." }, headers);
  }

  try {
    const key = process.env.AZURE_SPEECH_KEY;
    const region = String(process.env.AZURE_SPEECH_REGION || "").trim().toLowerCase();

    if (!key || !region) {
      return json(503, {
        error: "Claras Seraphina-Sprachdienst ist noch nicht eingerichtet. Bitte AZURE_SPEECH_KEY und AZURE_SPEECH_REGION in Netlify unter Functions hinterlegen."
      }, headers);
    }
    if (!/^[a-z0-9]+$/.test(region)) {
      return json(500, { error: "Die Azure-Speech-Region ist ungültig konfiguriert." }, headers);
    }

    let data;
    try {
      data = JSON.parse(event.body || "{}");
    } catch (_) {
      return json(400, { error: "Die Anfrage enthält kein gültiges JSON." }, headers);
    }

    const text = typeof data.text === "string" ? data.text.trim() : "";
    if (!text) return json(400, { error: "Bitte einen Sprechertext eingeben." }, headers);
    if (text.length > MAX_TEXT_LENGTH) {
      return json(413, { error: "Der Sprechertext ist zu lang. Bitte auf maximal 4.000 Zeichen kürzen." }, headers);
    }

    const requestedRate = Number(data.rate ?? 1);
    const safeRate = Number.isFinite(requestedRate) ? Math.max(0.88, Math.min(1.0, requestedRate)) : 1.0;
    // User's "1.00 / natürlich, etwas schneller" maps to +3% SSML speed.
    const ratePercent = Math.round(((safeRate - 0.94) / 0.06) * 3);
    const rate = (ratePercent >= 0 ? "+" : "") + ratePercent + "%";
    const ssml = [
      '<speak version="1.0" xml:lang="de-DE">',
      '<voice name="' + VOICE_NAME + '">',
      '<prosody rate="' + rate + '">' + escapeXml(text) + '</prosody>',
      '</voice>',
      '</speak>'
    ].join("");

    const endpoint = "https://" + region + ".tts.speech.microsoft.com/cognitiveservices/v1";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-160kbitrate-mono-mp3",
        "User-Agent": "ClaraTravelAI"
      },
      body: ssml,
      signal: AbortSignal.timeout(45000)
    });

    if (!response.ok) {
      console.warn("Clara Azure TTS returned HTTP", response.status);
      if (response.status === 401 || response.status === 403) {
        return json(502, { error: "Microsoft Speech hat den Schlüssel oder die Region nicht akzeptiert. Bitte Azure-Konfiguration prüfen." }, headers);
      }
      if (response.status === 429) {
        return json(429, { error: "Das kostenlose Kontingent oder das Anfragelimit von Microsoft Speech ist erreicht. Bitte später erneut versuchen." }, headers);
      }
      return json(502, { error: "Microsoft Speech konnte Claras Sprachspur gerade nicht erzeugen (HTTP " + response.status + ")." }, headers);
    }

    const audio = Buffer.from(await response.arrayBuffer());
    if (!audio.length || audio.length > 5 * 1024 * 1024) {
      return json(502, { error: "Die erzeugte Audiodatei ist leer oder überschreitet die erlaubte Dateigröße." }, headers);
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'attachment; filename="clara-seraphina-voiceover.mp3"'
      },
      isBase64Encoded: true,
      body: audio.toString("base64")
    };
  } catch (error) {
    console.error("Clara TTS error:", error?.name || "unknown");
    const timeout = error?.name === "TimeoutError" || error?.name === "AbortError";
    return json(502, {
      error: timeout
        ? "Microsoft Speech hat für diese Sprachspur zu lange benötigt. Bitte den Text kürzen und erneut versuchen."
        : "Claras Sprachdienst ist vorübergehend nicht erreichbar."
    }, headers);
  }
};
