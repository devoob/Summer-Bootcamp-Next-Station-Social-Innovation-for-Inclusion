import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { MTR_STATIONS, MtrStation } from "./src/data/mtrData.ts";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const STATION_IDS: Record<string, number> = {
  "central": 1, "admiralty": 2, "tsim sha tsui": 3, "jordan": 4,
  "yau ma tei": 5, "mong kok": 6, "shek kip mei": 7, "kowloon tong": 8,
  "lok fu": 9, "wong tai sin": 10, "diamond hill": 11, "choi hung": 12,
  "kowloon bay": 13, "ngau tau kok": 14, "kwun tong": 15, "prince edward": 16,
  "sham shui po": 17, "cheung sha wan": 18, "lai chi kok": 19, "mei foo": 20,
  "lai king": 21, "kwai fong": 22, "kwai hing": 23, "tai wo hau": 24,
  "tsuen wan": 25, "sheung wan": 26, "wan chai": 27, "causeway bay": 28,
  "tin hau": 29, "fortress hill": 30, "north point": 31, "quarry bay": 32,
  "tai koo": 33, "sai wan ho": 34, "shau kei wan": 35, "heng fa chuen": 36,
  "chai wan": 37, "lam tin": 38, "hong kong": 39, "kowloon": 40,
  "olympic": 41, "tsing yi": 42, "tung chung": 43, "hung hom": 64,
  "austin": 44, "nam cheong": 53, "sunny bay": 54, "disneyland resort": 55,
  "asiaworld-expo": 56, "lohas park": 57, "tsing yi2": 46, "kowloon2": 45,
  "hong kong2": 44, "airport": 47, "yau tong": 48, "tiu keng leng": 49,
  "tseung kwan o": 50, "hang hau": 51, "po lam": 52,
  "mong kok east": 65, "tai wai": 67, "sha tin": 68, "fo tan": 69,
  "racecourse": 70, "university": 71, "tai po market": 72, "tai wo": 73,
  "fanling": 74, "sheung shui": 75, "lo wu": 76, "lok ma chau": 78,
  "east tsim sha tsui": 80, "sai ying pun": 81, "hku": 82, "kennedy town": 83,
  "ho man tin": 84, "whampoa": 85, "ocean park": 86, "wong chuk hang": 87,
  "lei tung": 88, "south horizons": 89, "hin keng": 90, "kai tak": 91,
  "sung wong toi": 92, "to kwa wan": 93, "exhibition centre": 94,
  "che kung temple": 96, "sha tin wai": 97, "city one": 98, "shek mun": 99,
  "tai shui hang": 100, "heng on": 101, "ma on shan": 102, "wu kai sha": 103,
  "tsuen wan west": 104, "kam sheung road": 105, "yuen long": 106,
  "long ping": 107, "tin shui wai": 108, "siu hong": 109, "tuen mun": 110,
};

function matchStation(query: string): MtrStation | undefined {
  const q = query.toLowerCase();
  return MTR_STATIONS.find(s =>
    q.includes(s.name.toLowerCase()) ||
    q.includes(s.chineseName) ||
    s.name.toLowerCase().includes(q) ||
    s.chineseName.includes(q)
  );
}

function matchExit(station: MtrStation, query: string): string | null {
  const match = query.match(/exit\s+([a-z][0-9]?)/i);
  if (match) {
    const exitName = match[1].toUpperCase();
    const exit = station.exits.find(e => e.name.toUpperCase() === exitName);
    if (exit) return exitName;
  }
  return null;
}

function buildStationResponse(station: MtrStation, specificExit?: string | null): string {
  const lifts = station.exits.filter(e => e.hasLift);
  const escalators = station.exits.filter(e => e.hasEscalator && !e.hasLift);
  const stairs = station.exits.filter(e => !e.hasLift && !e.hasEscalator);

  if (specificExit) {
    const exit = station.exits.find(e => e.name.toUpperCase() === specificExit);
    if (exit) {
      let response = `${station.name} Station (${station.chineseName}) - Exit ${exit.name}\n\n`;
      if (exit.hasLift) response += `This exit has a passenger lift (elevator) making it wheelchair accessible. `;
      else if (exit.hasEscalator) response += `This exit has escalators but no lift. It is not wheelchair accessible. `;
      else response += `This exit has stairs only. It is not suitable for wheelchairs or heavy luggage. `;
      response += `Description: ${exit.description}`;
      if (exit.locationDetails) response += `\nLocation: ${exit.locationDetails}`;
      return response;
    }
  }

  let response = `${station.name} Station (${station.chineseName}) Accessibility\n\n`;

  if (lifts.length > 0) {
    response += `Exits with Passenger Lift (step-free, wheelchair accessible):\n`;
    lifts.forEach(e => {
      response += `- Exit ${e.name}: ${e.description}`;
      if (e.locationDetails) response += ` (${e.locationDetails})`;
      response += `\n`;
    });
  } else {
    response += `No exits with passenger lifts at this station.\n`;
  }

  if (escalators.length > 0) {
    response += `\nExits with Escalators Only (not wheelchair accessible):\n`;
    escalators.forEach(e => {
      response += `- Exit ${e.name}: ${e.description}`;
      if (e.locationDetails) response += ` (${e.locationDetails})`;
      response += `\n`;
    });
  }

  if (stairs.length > 0) {
    response += `\nExits with Stairs Only:\n`;
    stairs.forEach(e => {
      response += `- Exit ${e.name}: ${e.description}\n`;
    });
  }

  response += `\nTip: Use the Stations tab to view all exits visually, or start AR Navigation for step-by-step indoor guidance.`;

  return response;
}

function buildGeneralResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("lift") || q.includes("elevator") || q.includes("wheelchair") || q.includes("step-free") || q.includes("accessible")) {
    return `I can help with lift and accessibility information for these stations:\n\n- **Central** - Multiple lifts at exits A, G, H, K\n- **Mong Kok** - Lifts at exits C3, E1\n- **Admiralty** - Lift at Exit E only\n- **Tsim Sha Tsui** - Lifts at exits A1, H\n- **HKU** - Lifts at exits A1, A2, B2, C1\n- **Kennedy Town** - Lifts at exits A, B\n\nTry asking about a specific station, for example: "Which exits at Central have elevators?"`;
  }

  if (q.includes("route") || q.includes("path") || q.includes("way") || q.includes("navigate")) {
    return `You can use the AR Navigation feature from the Stations tab:\n- Select a station card\n- Tap **Start AR Navigation**\n- Choose an accessible path\n- Follow the step-by-step directions with optional live camera overlay.`;
  }

  if (q.includes("hello") || q.includes("hi") || q.includes("hey")) {
    return `Welcome to the HK MTR Accessibility Guide!\n\nI can help you find lifts, escalators, and step-free routes at Hong Kong MTR stations. Try asking:\n- "Which exits at Admiralty have elevators?"\n- "Is there a lift at Mong Kok Exit C3?"\n- "What is the step-free path through Central station?"`;
  }

  return `I have accessibility data for these stations:\n\n- **Central**\n- **Mong Kok**\n- **Admiralty**\n- **Tsim Sha Tsui**\n- **HKU**\n- **Kennedy Town**\n\nTry asking about a specific station, for example: "Which exits at Admiralty have lifts to street level?"`;
}

// Proxy the MTR barrier-free search and extract lift info
async function fetchMtrStationData(query: string): Promise<{ stationName: string; exits: { name: string; hasLift: boolean }[] } | null> {
  const q = query.toLowerCase().trim();
  const keys = Object.keys(STATION_IDS);
  const matchedKey = keys.find(k => q.includes(k));
  if (!matchedKey) return null;
  const stationId = STATION_IDS[matchedKey];

  try {
    const url = `https://www.mtr.com.hk/en/customer/services/free_search.php?query_type=search&station=${stationId}&disable_search=`;
    const resp = await fetch(url);
    const html = await resp.text();
    const stationName = html.match(/Search Result for "([^"]+)"/)?.[1] || matchedKey;

    const rows = html.split("<tr");
    const exits: { name: string; hasLift: boolean }[] = [];
    for (const row of rows) {
      const tds: string[] = [];
      const tdMatches = row.matchAll(/<td[^>]*>(.*?)<\/td>/gi);
      for (const m of tdMatches) tds.push(m[1].trim());
      if (tds.length === 0) continue;
      const facility = tds[0].toLowerCase();
      if (facility.includes("lift") && !facility.includes("stair") && !facility.includes("replacement")) {
        if (tds.length > 1) {
          const detailMatch = tds[1].match(/Exit\s+([A-Z][0-9]?)/i);
          if (detailMatch && !exits.find(e => e.name === detailMatch[1])) {
            exits.push({ name: detailMatch[1], hasLift: true });
          }
        }
      }
    }
    return { stationName, exits };
  } catch (err) {
    console.error("MTR fetch error:", err);
    return null;
  }
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const station = matchStation(message);
    const specificExit = station ? matchExit(station, message) : null;

    if (station) {
      const text = buildStationResponse(station, specificExit);
      return res.json({ text, groundingSources: [] });
    }

    // Try MTR live lookup for stations not in local data
    const mtrData = await fetchMtrStationData(message);
    if (mtrData && mtrData.exits.length > 0) {
      const text = `${mtrData.stationName} Station (from MTR live data)\n\nExits with lift access:\n${mtrData.exits.map(e => `- Exit ${e.name}`).join("\n")}\n\nData sourced from MTR's Barrier-Free Facilities Search.`;
      return res.json({ text, groundingSources: [] });
    }

    const text = buildGeneralResponse(message);
    return res.json({ text, groundingSources: [] });

  } catch (error: any) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to generate response.",
      details: error.message
    });
  }
});

app.get("/api/stations", (req, res) => {
  res.json(MTR_STATIONS);
});

app.get("/api/mtr-live", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "query param 'q' is required" });
    }
    const stationId = STATION_IDS[q.toLowerCase().trim()];
    if (!stationId) {
      return res.status(404).json({ error: "Station not found" });
    }
    const url = `https://www.mtr.com.hk/en/customer/services/free_search.php?query_type=search&station=${stationId}&disable_search=`;
    const resp = await fetch(url);
    const html = await resp.text();

    // Parse HTML by splitting on <tr> and extracting td values
    const rows = html.split("<tr");
    let currentExit = "";
    const liftExits: string[] = [];
    const stairLiftExits: string[] = [];
    let hasRamp = false;

    for (const row of rows) {
      // Extract text from each <td> in the row
      const tds: string[] = [];
      const tdMatches = row.matchAll(/<td[^>]*>(.*?)<\/td>/gi);
      for (const m of tdMatches) {
        tds.push(m[1].trim());
      }
      if (tds.length === 0) continue;

      // Check if this row has an exit name
      const exitMatch = tds[0].match(/Exit\s+([A-Z][0-9]?\s*(?:\/\s*[A-Z][0-9]?)?)/i);
      if (exitMatch) {
        currentExit = exitMatch[1].replace(/\s*\/\s*/g, " / ");
      }

      // Check facility type
      const facility = tds[0].toLowerCase();
      if (facility.includes("ramp") && tds[0] !== "") {
        hasRamp = true;
      }
      if (facility.includes("lift") && !facility.includes("stair") && !facility.includes("replacement")) {
        // Look for specific exit in the details column
        if (tds.length > 1) {
          const detailMatch = tds[1].match(/Exit\s+([A-Z][0-9]?)/i);
          if (detailMatch) {
            if (!liftExits.includes(detailMatch[1])) liftExits.push(detailMatch[1]);
          } else if (currentExit) {
            // If no specific exit mentioned, the current exit area has the lift
            const exits = currentExit.split(" / ");
            for (const e of exits) {
              const eTrim = e.trim();
              if (eTrim && !liftExits.includes(eTrim)) liftExits.push(eTrim);
            }
          }
        }
      }
      if (facility.includes("stair lift") || facility.includes("stairlift")) {
        if (tds.length > 1) {
          const detailMatch = tds[1].match(/Exit\s+([A-Z][0-9]?)/i);
          if (detailMatch && !stairLiftExits.includes(detailMatch[1])) {
            stairLiftExits.push(detailMatch[1]);
          }
        }
      }
    }

    const stationName = html.match(/Search Result for "([^"]+)"/)?.[1] || "Unknown Station";

    res.json({
      station: stationName,
      liftExits,
      stairLiftExits,
      hasRamp
    });
  } catch (error: any) {
    console.error("MTR live fetch error:", error);
    res.status(500).json({ error: "Failed to fetch MTR data" });
  }
});

async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in Development mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files in Production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Hong Kong MTR Waymap Server listening on http://localhost:${PORT}`);
  });
}

setupViteOrStatic();
