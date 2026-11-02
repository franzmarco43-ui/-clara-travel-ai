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
   const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    const passauKnowledge = require("./data/passau.json");
    const danubeLocksKnowledge = require("./data/danube-locks.json");
    const danubeDestinationsKnowledge = require("./data/danube-destinations.json");

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

    const asksAboutPassau = /passau|dreifl[uü]sseeck|veste oberhaus|dom st\\.? stephan/i.test(userMessage);
    const destinationKnowledge = asksAboutPassau
      ? "\\n\\nSTRUKTURIERTES REISEWISSEN PASSAU (als Faktenbasis verwenden):\\n" +
        JSON.stringify(passauKnowledge) +
        "\\nAntworte in der Sprache der Anfrage (Deutsch, Englisch, Niederländisch, Französisch oder Rumänisch). " +
        "Nutze nur die passenden Fakten. Erfinde keine Öffnungszeiten, Preise, Fahrpläne oder aktuellen Verfügbarkeiten. " +
        "Bei Kreuzfahrtfragen zuerst nach dem konkreten Liegeplatz fragen, falls er fehlt. " +
        "Nenne bei veränderlichen Angaben die offizielle Quelle und weise auf Live-Prüfung hin."
      : "";


    // Destination-specific travel knowledge for all Danube stations.
    // Attach only matching locations to keep the prompt focused.
    const normalizePlace = value => String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    const normalizedQuery = " " + normalizePlace(userMessage) + " ";
    const matchedDestinationRecords = danubeDestinationsKnowledge.records.filter(place => {
      const names = [place.name, ...(place.aliases || [])];
      return names.some(name => {
        const normalizedName = normalizePlace(name);
        return normalizedName && normalizedQuery.includes(" " + normalizedName + " ");
      });
    });
    const destinationRecordsForPrompt = matchedDestinationRecords.filter(place =>
      !(asksAboutPassau && place.name === "Passau")
    );
    const destinationContext = destinationRecordsForPrompt.length
      ? "\n\nSTRUKTURIERTES DONAU-REISEWISSEN (nur passende, in der Nutzerfrage erkannte Orte):\n" +
        JSON.stringify({records:destinationRecordsForPrompt, responseRules:danubeDestinationsKnowledge.responseRules}) +
        "\nNutze die Einträge als redaktionelle Faktenbasis. Antworte in der Sprache der Anfrage. " +
        "Unterscheide feste Ortsinformationen von veränderlichen Informationen. Erfinde keine aktuellen Öffnungszeiten, Preise, Fahrpläne, Liegeplätze oder Verfügbarkeiten. " +
        "Bei Flusskreuzfahrtfragen vor konkreten Wegbeschreibungen nach dem tatsächlichen Liegeplatz fragen, wenn er nicht genannt wurde. " +
        "Berücksichtige Liegezeit, Mobilität, Steigungen, Transfers und Rückkehr zum Schiff."
      : "";

    // Neutral rollator notice only. Do not assess or recommend specific routes.
    const asksAboutRollator = /rollator|gehwagen|gehstock|gehst[uü]tze|rollatornutz|mit gehhilfe|gehbehindert|eingeschr[aä]nkte gehf[aä]higkeit/i.test(userMessage);
    const rollatorContext = asksAboutRollator
      ? "\n\nALLGEMEINER HINWEIS FÜR GÄSTE MIT ROLLATOR:\n" +
        String(danubeDestinationsKnowledge.rollatorNotice || "Bitte kläre vor dem Landgang mit Reederei oder Tourist-Information, ob die geplante Strecke für dich passend ist.") +
        "\nWichtig: Dies ist ausschließlich ein allgemeiner Hinweis. Gib KEINE konkrete Aussage oder Bewertung zur Eignung/Barrierefreiheit einer Stadt, Sehenswürdigkeit oder Wegstrecke. Empfiehl oder verwerfe keine bestimmten Wege. Erfinde keine Angaben zu Pflaster, Steigung, Stufen oder Bordsteinen an einem konkreten Ort. Verweise nur darauf, die geplante Strecke und den tatsächlichen Liegeplatz vorab mit Reederei oder örtlicher Tourist-Information abzuklären."
      : "";

    // Fail closed for rollator questions until live, source-backed research is integrated.
    // Do not pass these questions to the language model, which could otherwise infer route suitability.
    if (asksAboutRollator) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ reply: danubeDestinationsKnowledge.rollatorNotice })
      };
    }
    // Technical reference data for all 18 locks on the Danube main waterway.
    // This is static reference information, not live operating status.
    const asksAboutLocks = /schleus|locks?|lock chamber|lock dimensions|kammermaß|kammerlänge|kammerbreite|funkkanal|strom.?km|haltungsunterschied|hubhöhe/i.test(userMessage);
    let lockKnowledge = "";
    if (asksAboutLocks) {
      const normalize = value => String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const query = normalize(userMessage);
      const matchedLocks = danubeLocksKnowledge.records.filter(lock => {
        const names = [lock.name, lock.name.replace(/\s*\([^)]*\)/g, ""), lock.name.replace("Eisernes Tor", "Iron Gate")];
        return names.some(name => name && query.includes(normalize(name)));
      });
      const records = matchedLocks.length ? matchedLocks : danubeLocksKnowledge.records;
      lockKnowledge =
        "\n\nTECHNISCHE SCHLEUSEN-DATENBANK (statische Referenz, keine Live-Betriebsdaten):\n" +
        JSON.stringify({datasetTitle:danubeLocksKnowledge.datasetTitle,sourceNote:danubeLocksKnowledge.sourceNote,records}) +
        "\nVerwende die Daten für Kammermaße, Anzahl der Kammern, Stromkilometer, Funkkanal, Telefonnummer und die hinterlegten technischen Zusatzwerte. " +
        "Unterscheide Kammerabmessungen von zulässigen Schiffs-/Verbandsabmessungen. Bei abweichenden Werten nenne den Quellenhinweis aus dem Datensatz. " +
        "Die Donau-Hauptwasserstraße hat 18 Schleusenstandorte; auf der mittleren und unteren Donau liegen die beiden Schleusen am Eisernen Tor I und II. Russe (Ruse) in Bulgarien ist ein Donauhafen, aber kein Schleusenstandort in dieser 18er-Liste. " +
        "Die technische Haupttabelle für Drempeltiefe, Brückenhöhe, maximalen Haltungsunterschied und Verbandsabmessungen stammt von der Donaukommission: https://www.danubecommission.org/dc/de/die-donauschifffahrt/schleusen-an-der-donau/. " +
        "Stromkilometer, Kammerabmessungen, Kammeranzahl, UKW-Kanal und Telefonnummern sind mit der DoRIS-Tabelle abgeglichen: https://www.doris.bmimi.gv.at/services/schleusen-an-der-donau. " +
        "Behaupte niemals, dass ein statischer Wert den aktuellen Schleusenstatus, Wartezeit, Wasserstand oder eine momentane Sperre beschreibt. " +
        "Verweise für Live-Status und Sperrungen auf DoRIS / viadonau: https://www.doris.bmimi.gv.at/en/fairway-information/lock-status.";
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
                "Öffnungszeiten, Veranstaltungen, Wetterdaten, Pegelstände, " +
                "Preise, Wege, Entfernungen oder Zugänglichkeitsangaben. " +
                "Jede konkrete Tatsachenbehauptung muss durch einen passenden Datensatz oder eine tatsächlich geprüfte, verlässliche Quelle gestützt sein. " +
                "Dieses Backend verfügt derzeit über keine eigene Live-Websuche. Behaupte niemals, online recherchiert oder eine aktuelle Quelle geprüft zu haben. " +
                "Wenn eine Antwort aktuelle oder ortsspezifische Recherche erfordert und diese nicht verfügbar ist, sage offen, dass du es nicht verlässlich feststellen kannst. Rate nicht und ergänze keine plausibel klingenden Details. " +
                "Wenn eine Live-Recherche-Funktion künftig verfügbar ist, recherchiere selbstständig zuerst bei offiziellen Behörden, Betreibern, Reedereien, Sehenswürdigkeiten und Tourismusstellen; vergleiche passende Quellen, prüfe das Datum und nenne die tatsächlich verwendeten Quellen. " +
                "Bei Rollator- oder Mobilitätsfragen niemals konkrete Weg-Eignung, Barrierefreiheit oder Routen behaupten, solange dafür keine verlässliche aktuelle Quelle tatsächlich geprüft wurde. Ohne solche Prüfung ausschließlich den neutralen Hinweis aus der Wissensdatei verwenden. " +
                "Schreibe Zeitangaben immer vollständig aus: Minuten statt min, Stunden statt h oder Std. Verwende keine abgekürzten Zeiteinheiten. Formuliere zum Beispiel 10 bis 15 Minuten oder 2 Stunden und 30 Minuten. " +
                memoryText + destinationKnowledge + destinationContext + rollatorContext + lockKnowledge
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
