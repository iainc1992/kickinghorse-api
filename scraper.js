import fetch from "node-fetch";
import cheerio from "cheerio";

const URL = "https://kickinghorseresort.com/conditions/snow-report/";

let history = {};

export async function scrapeBowls() {
  const response = await fetch(URL);
  const html = await response.text();
  const $ = cheerio.load(html);

  const bowls = {};

  $("h3").each((_, el) => {
    const bowlName = $(el).text().trim();
    if (!bowlName) return;

    const runs = {};

    $(el).nextUntil("h3").each((__, node) => {
      const text = $(node).text().trim();
      const match = text.match(/^(.+?):\s*(OPEN|CLOSED)$/i);
      if (!match) return;

      const run = match[1].trim();
      const status = match[2].toUpperCase();

      const prev = history[bowlName]?.[run];

      runs[run] = {
        status,
        lastChanged:
          prev && prev.status === status
            ? prev.lastChanged
            : new Date().toISOString()
      };
    });

    if (Object.keys(runs).length) {
      bowls[bowlName] = runs;
    }
  });

  history = bowls;
  return bowls;
}

export function addDurationOpen(bowls) {
  const now = new Date();
  const result = {};

  for (const bowl in bowls) {
    result[bowl] = {};
    for (const run in bowls[bowl]) {
      const data = bowls[bowl][run];
      const last = new Date(data.lastChanged);
      const minutes = Math.floor((now - last) / 60000);

      result[bowl][run] = {
        ...data,
        durationOpenMinutes: data.status === "OPEN" ? minutes : 0
      };
    }
  }

  return result;
}
