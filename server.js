import express from "express";
import { scrapeBowls, addDurationOpen } from "./scraper.js";

const app = express();
const PORT = process.env.PORT || 3000;

let cachedData = {};
let lastUpdated = null;

async function updateData() {
  try {
    const raw = await scrapeBowls();
    cachedData = addDurationOpen(raw);
    lastUpdated = new Date().toISOString();
    console.log(`Updated at ${lastUpdated}`);
  } catch (err) {
    console.error("Update failed:", err.message);
  }
}

// Run once at startup
updateData();

// Update every 10 minutes
setInterval(updateData, 10 * 60 * 1000);

app.get("/", (req, res) => {
  res.send("Kicking Horse API is running");
});

app.get("/api/bowls", (req, res) => {
  res.json({
    lastUpdated,
    bowls: cachedData
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
