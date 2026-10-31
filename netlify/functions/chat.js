
exports.handler = async function (event) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Bitte POST verwenden." })
    };
  }

  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY fehlt in Netlify.");
    }

    const data = JSON.parse(event.body || "{}");
    const userMessage = data.message || data.prompt;

    if (!userMessage || typeof userMessage !== "string") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Nachricht fehlt." })
      };
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `Du bist Clara, eine deutschsprachige,
              freundliche und kompetente Reisebegleiterin.
              Du kennst die europäischen Flüsse, insbesondere
              die Donau. Hilf bei Reisezielen, Ausflügen,
              regionaler Küche, Kultur und Flusskreuzfahrten.
              Erfinde keine aktuellen Öffnungszeiten,
              Veranstaltungen, Wetterdaten oder Pegelstände.
              Kennzeichne Informationen, die aktuell geprüft
              werden müssen, ausdrücklich als ungeprüft.`
            },
            {
              role: "user",
              content: userMessage
            }
          ],
          temperature: 0.5,
          max_completion_tokens: 1000
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: result.error?.message || "Groq-Anfrage fehlgeschlagen."
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply: result.choices?.[0]?.message?.content || ""
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};

