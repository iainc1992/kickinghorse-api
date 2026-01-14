import express from "express";
import { scrapeWeather } from "./scraper.js";

const app = express();
const PORT = 3000;

let cachedData = [];

async function updateData() {
  try {
    cachedData = await scrapeWeather();
    console.log("Weather data updated");
  } catch (err) {
    console.error("Scrape failed", err);
  }
}

// Initial load + hourly refresh
updateData();
setInterval(updateData, 60 * 60 * 1000);

app.get("/api/weather", (req, res) => {
  res.json(cachedData);
});

app.listen(PORT, () =>
  console.log(`API running at http://localhost:${PORT}`)
);
