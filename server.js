const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/health", function(req, res) {
  res.json({ ok: true, hasKey: !!API_KEY });
});

async function textSearch(query, pageToken) {
  var url = "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" +
    encodeURIComponent(query) + "&key=" + API_KEY;
  if (pageToken) url += "&pagetoken=" + encodeURIComponent(pageToken);
  var res = await fetch(url);
  return res.json();
}

async function getDetails(placeId) {
  var fields = "name,formatted_phone_number,website,formatted_address,rating,user_ratings_total,url";
  var url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=" +
    placeId + "&fields=" + fields + "&key=" + API_KEY;
  var res = await fetch(url);
  var data = await res.json();
  return data.result || {};
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
  var limit = Math.min(parseInt(req.query.limit) || 60, 180);

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

      var searchData = await textSearch(query, pageToken);

      if (searchData.status !== "OK" && searchData.status !== "ZERO_RESULTS") {
        return res.status(502).json({
          error: "Google API error: " + searchData.status,
          detail: searchData.error_message || ""
        });
      }

      var places = searchData.results || [];

      for (var i = 0; i < places.length && leads.length < limit; i += 5) {
        var batch = places.slice(i, i + 5);
        var details = await Promise.all(
          batch.map(function(pl) { return getDetails(pl.place_id); })
        );

        for (var j = 0; j < batch.length; j++) {
          var pl = batch[j];
          var detail = details[j];

          if (seen.has(pl.place_id)) continue;
          seen.add(pl.place_id);

          var score = 50;
          if (!detail.website) score += 25;
          if (detail.rating && detail.rating < 3.5) score += 15;
          if (!detail.formatted_phone_number) score += 10;
          if (detail.user_ratings_total && detail.user_ratings_total < 10) score += 10;
          if (score > 100) score = 100;

          var painPoints = [];
          if (!detail.website) painPoints.push("no website");
          if (!detail.formatted_phone_number) painPoints.push("no listed phone");
          if (detail.rating && detail.rating < 3.5) painPoints.push("low Google rating");
          if (detail.user_ratings_total && detail.user_ratings_total < 10) painPoints.push("very few reviews");

          var website = "";
          if (detail.website) {
            website = detail.website.replace(/^https?:\/\//, "").replace(/\/$/, "");
          }

          leads.push({
            name: detail.name || pl.name || "",
            phone: detail.formatted_phone_number || "",
            website: website,
            address: detail.formatted_address || pl.formatted_address || "",
            rating: detail.rating || null,
            reviewCount: detail.user_ratings_total || 0,
            mapsUrl: detail.url || "",
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
      }

      pageToken = searchData.next_page_token || null;
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
