exports.handler = async function (event) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "https://clara-travel-ai.netlify.app",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin"
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
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY fehlt in Netlify.");
    }

    const data = JSON.parse(event.body || "{}");
    const userMessage = data.message || data.prompt;

    if (typeof userMessage !== "string" || !userMessage.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Nachricht fehlt." })
      };
    }

    let memoryText = "";
    const authHeader =
      event.headers.authorization ||
      event.headers.Authorization ||
      "";
    const bearer = authHeader.match(/^Bearer\s+(.+)$/i);

    // Nutzer zuerst bei Supabase authentifizieren.
    if (bearer && supabaseUrl && supabaseKey) {
      const accessToken = bearer[1];

      const authResponse = await fetch(
        `${supabaseUrl}/auth/v1/user`,
        {
          headers: {
            "apikey": supabaseKey,
            "Authorization": `Bearer ${accessToken}`
          }
        }
      );

      if (authResponse.ok) {
        const user = await authResponse.json();

        if (user && user.id) {
          const profileUrl =
            `${supabaseUrl}/rest/v1/clara_profiles` +
            `?select=display_name,interests,travel_pace,budget_level,consent_memory` +
            `&user_id=eq.${encodeURIComponent(user.id)}&limit=1`;

          const profileResponse = await fetch(profileUrl, {
            headers: {
              "apikey": supabaseKey,
              "Authorization": `Bearer ${accessToken}`
            }
          });

          if (profileResponse.ok) {
            const profiles = await profileResponse.json();
            const profile = profiles[0];

            // Ohne ausdrückliche Zustimmung keine persönlichen Daten laden.
            if (profile && profile.consent_memory === true) {
              const memoryUrl =
                `${supabaseUrl}/rest/v1/clara_memories` +
                `?select=memory_type,content,created_at` +
                `&user_id=eq.${encodeURIComponent(user.id)}` +
                `&order=created_at.desc&limit=20`;

              const memoryResponse = await fetch(memoryUrl, {
                headers: {
                  "apikey": supabaseKey,
                  "Authorization": `Bearer ${accessToken}`
                }
              });

              const facts = [];

              if (profile.display_name) {
                facts.push(`Name: ${profile.display_name}`);
              }
              if (Array.isArray(profile.interests) && profile.interests.length) {
                facts.push(`Interessen: ${profile.interests.join(", ")}`);
              }
              if (profile.travel_pace) {
                facts.push(`Reisetempo: ${profile.travel_pace}`);
              }
              if (profile.budget_level) {
                facts.push(`Budget: ${profile.budget_level}`);
              }

              if (memoryResponse.ok) {
                const memories = await memoryResponse.json();

                for (const item of memories) {
                  const content = item && item.content;
                  if (!content || typeof content !== "object") continue;

                  if (
                    content.favorite_destination &&
                    !facts.some(x => x.startsWith("Lieblingsreiseziel:"))
                  ) {
                    facts.push(
                      `Lieblingsreiseziel: ${content.favorite_destination}`
                    );
                  }
                }
              }

              if (facts.length) {
                memoryText =
                  "\n\nFreigegebene persönliche Angaben aus Clara Memory:\n" +
                  facts.join("\n") +
                  "\nNutze diese Angaben nur, wenn sie zur Frage passen. " +
                  "Erfinde keine persönlichen Angaben.";
              }
            }
          }
        }
      }
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
          model: "openai/gpt-oss-120b",
          messages: [
            {
              role: "system",
              content:
                "Du bist Clara, eine deutschsprachige, freundliche und " +
                "kompetente Reisebegleiterin für europäische Flüsse. " +
                "Du hilfst bei Reisezielen, Ausflügen, regionaler Küche, " +
                "Kultur und Flusskreuzfahrten. Erfinde keine aktuellen " +
                "Öffnungszeiten, Veranstaltungen, Wetterdaten oder " +
                "Pegelstände. Kennzeichne ungeprüfte Informationen. " +
                memoryText
            },
            {
              role: "user",
              content: userMessage.trim()
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
    console.error("Clara chat error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Clara konnte die Anfrage gerade nicht verarbeiten."
      })
    };
  }
};
