import fetch from "node-fetch";
import cheerio from "cheerio";

const URL = "https://kickinghorseresort.com/conditions/advanced-weather-data/";

export async function scrapeWeather() {
  const res = await fetch(URL);
  const html = await res.text();
  const $ = cheerio.load(html);

  const rows = [];
  
  // ⚠️ You will need to confirm selectors in DevTools
  $("table tbody tr").each((i, el) => {
    const cells = $(el).find("td");

    if (cells.length > 5) {
      rows.push({
        datetime: $(cells[0]).text().trim(),
        temperature: parseFloat($(cells[1]).text()),
        windSpeed: parseFloat($(cells[2]).text()),
        windDir: $(cells[3]).text().trim(),
        snowDepth: parseFloat($(cells[4]).text())
      });
    }
  });

  return rows;
}
