const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors());
app.use(express.json());

app.get("/health", function(req, res) {
  res.json({ ok: true, hasKey: !!API_KEY });
});

async function textSearch(query, pageToken) {
  var body = { textQuery: query, maxResultCount: 20 };
  if (pageToken) body.pageToken = pageToken;

  var res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,places.googleMapsUri,nextPageToken"
    },
    body: JSON.stringify(body)
  });
  return res.json();
}

function sleep(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

app.get("/scrape", async function(req, res) {
  if (!API_KEY) {
    return res.status(500).json({ error: "GOOGLE_MAPS_API_KEY not set on server." });
  }

  var niche = req.query.niche;
  var city = req.query.city;
  var state = req.query.state || "OH";
  var limit = Math.min(parseInt(req.query.limit) || 60, 60);

  if (!niche || !city) {
    return res.status(400).json({ error: "niche and city are required." });
  }

  var query = niche + " in " + city + ", " + state;
  var leads = [];
  var seen = new Set();
  var pageToken = null;

  try {
    for (var page = 0; page < 3 && leads.length < limit; page++) {
      if (page > 0 && pageToken) {
        await sleep(2000);
      }

      var data = await textSearch(query, pageToken);

      if (data.error) {
        return res.status(502).json({
          error: "Google API error: " + (data.error.message || JSON.stringify(data.error))
        });
      }

      var places = data.places || [];

      for (var i = 0; i < places.length && leads.length < limit; i++) {
        var pl = places[i];
        var id = pl.id;
        if (seen.has(id)) continue;
        seen.add(id);

        var score = 50;
        if (!pl.websiteUri) score += 25;
        if (pl.rating && pl.rating < 3.5) score += 15;
        if (!pl.nationalPhoneNumber) score += 10;
        if (pl.userRatingCount && pl.userRatingCount < 10) score += 10;
        if (score > 100) score = 100;

        var painPoints = [];
        if (!pl.websiteUri) painPoints.push("no website");
        if (!pl.nationalPhoneNumber) painPoints.push("no listed phone");
        if (pl.rating && pl.rating < 3.5) painPoints.push("low Google rating");
        if (pl.userRatingCount && pl.userRatingCount < 10) painPoints.push("very few reviews");

        var website = "";
        if (pl.websiteUri) {
          website = pl.websiteUri.replace(/^https?:\/\//, "").replace(/\/$/, "");
        }

        leads.push({
          name: (pl.displayName && pl.displayName.text) || "",
          phone: pl.nationalPhoneNumber || "",
          website: website,
          address: pl.formattedAddress || "",
          rating: pl.rating || null,
          reviewCount: pl.userRatingCount || 0,
          mapsUrl: pl.googleMapsUri || "",
          score: score,
          scoreReason: painPoints.length > 0
            ? "Missing: " + painPoints.join(", ")
            : "Has web presence but may need automation",
          painPoint: painPoints.length > 0
            ? painPoints.join(" · ")
            : "Could benefit from AI automation",
          source: "Google Maps"
        });
      }

      pageToken = data.nextPageToken || null;
      if (!pageToken) break;
    }

    res.json({ leads: leads, count: leads.length, query: query });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, "0.0.0.0", function() {
  console.log("Nexgen scraper running on port " + PORT);
});
