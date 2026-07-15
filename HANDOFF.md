# Estancias del Bosque — Launch Handoff

Status as of 2026-07-15. The website build is **complete for everything achievable in code** (see `git log`). What remains are inputs only the **client** or a **vendor** can provide. This doc turns each into a request you can forward directly. Every spot is also flagged in `index.html` with a `POR CONFIRMAR` comment.

---

## A) Send to the CLIENT — 3 decisions/data points

**1. Exact square footage per model.** The site currently shows `~2,850 sq ft*` with a "por confirmar" footnote on all three. Please confirm exact sq ft for each:
- Modelo Flamboyán (two-story, 3BR): ________
- Modelo Ceiba (single-story, 4BR): ________
- Modelo Yagrumo (single-story, 3BR): ________

**2. Final project name.** "Reserve" has been removed everywhere per your note that the surname isn't decided. Site currently reads **"Estancias del Bosque"** only. Confirm final name (or that "Estancias del Bosque" stands).

**3. Availability + dates per model.** Catalog labels currently read: Flamboyán = "Disponible en julio", Ceiba = "Disponible", Yagrumo = "Consúltanos". Confirm the correct label/date for each.

*(Also confirm the ones you already implied so we can lock them: 3.5 baths ✓, lots ~600 m² ✓, 18-month delivery ✓, 2-story layout dims master 13×18 / walk-in 6.5×11.5 / bath 12×11 ✓. Note: you gave "master 13×18" in the 2-story layout but "master 18×20" in the differentiators — which applies where?)*

---

## B) Send to the RENDER / VIDEO VENDOR — asset brief

The page has placeholder slots wired for all of these; drop-in ready.

**1. Renders with people.** Current renders (render-1/2/3) are clean (no Gemini watermark — verified) but empty. Re-render or composite with **couples/families** for emotional connection. Same 1672×941 framing so they drop in without layout changes.

**2. "Three houses together" hero shot.** One photo or short video showing all 3 models together for full-project perspective. (Note: `collection-cover.jpg` is unusable — it has "Reserve" and a watermark baked in.)

**3. Four interior renders** (finished): master bedroom, living room ×2, kitchen — plus any additional ones pending. For the Gallery section.

**4. Per-model videos** with transitions between them (one per model), replacing the two generic tour clips currently in the "Virtual Tour" section.

**5. Promo video with background music**, aligned to brand aesthetic (forest green / light gray / beige; serious, natural, sober).

**Any new renders must ship without the Gemini logo.**

---

## C) One technical credential (then the form is fully live)

**Monday integration.** The contact form works *today* via an email fallback to `office@aarealtorpr.com`. To send directly into Monday board **"Citas Propiedades: Estancias del Bosque"**, create a webhook/form-automation on that board and paste its URL into `MONDAY_ENDPOINT` in `js/main.js` (line ~155). No other change needed.

---

## Already done (no action needed)
Single-page merge · Home nav + clickable logo · scroll fixed · "Reserve" removed · slide counter relabeled/moved · 2-story ordered first · story labels corrected to match renders · price "Desde $787K" only · Community + minutes-to-POI in-flow · always-visible catalog with availability pills · craftsmanship/perks/differentiators/upgrades/tone copy · phone `(787)` + clickable · Google Maps pin verified · form validation + fallback.
