# Wave 3 sector-anchor research brief

Badass Logistics (industrial rigging contractor) is building city pages for 7
specialty rigging services. A service only gets a page in a metro where that
sector genuinely exists, and the page copy names real anchors to prove it.
You research REAL, CURRENT (2026), VERIFIABLE anchors per metro.

For every metro key you are given ("City|ST"), produce:

```json
"City|ST": {
  "health":     ["named health systems / academic medical centers / major hospital campuses in the metro"],
  "research":   ["research universities, national labs, research parks, biotech/pharma/semiconductor R&D or manufacturing campuses"],
  "print":      ["named commercial printing plants, newspaper/print production facilities, packaging/converting plants, paper or board mills in the metro"],
  "datacenter": ["named data-center campuses or operators with facilities in the metro, or the named data-center submarket"],
  "energy":     ["the electric utility serving the metro, named power plants / substations / refineries / petrochem complexes / energy-equipment plants"],
  "buildings":  "one sentence on the commercial/institutional building stock that carries large HVAC plant (downtown towers, hospital & university campuses, airports, casinos, etc.) — specific to this metro",
  "grade": { "health": "strong|some|none", "research": "...", "print": "...", "datacenter": "...", "energy": "...", "buildings": "..." }
}
```

Rules — these are hard:
- 2–4 entries per list, each a short proper-noun phrase (e.g. "Texas Medical Center", "Dominion Energy", "QTS Atlanta Metro campus"). No descriptions longer than ~8 words.
- Only include an anchor you have confirmed exists in that metro (WebSearch it if not certain). Wrong facts are worse than empty lists. An empty list with grade "none" is a correct answer.
- Grade: "strong" = a recognised regional/national concentration (e.g. Ashburn-scale data centers, a top-tier academic medical center, a biotech cluster); "some" = real but modest presence; "none" = nothing worth naming.
- Do not invent facility names. Prefer well-known institutions over obscure plants. For print, a named company plant (e.g. "Quad/Graphics Sussex plant", "WestRock mill") — if unsure, leave it out.
- No prices, no claims that Badass has worked for anyone. These are just facts about the metro.
- Be efficient: you can rely on well-known knowledge for obvious anchors (e.g. Mayo, Cleveland Clinic) and spend searches on the uncertain categories (print, datacenter).

Write the result as ONE JSON object keyed by "City|ST" to the output file you are given, valid JSON (check with `node -e 'require("./file.json")'`). Return only a one-line summary: metros done, and count of "strong" grades per category.
