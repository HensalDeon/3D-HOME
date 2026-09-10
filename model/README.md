# Interactive model source

**R6 status:** the stair is represented as a conventional cast-in-situ RCC staircase - a continuous waist slab under each flight, monolithic with the landing slabs - replacing the superseded model of 17 separate 120 mm treads. Riser count, tread size, flight width, landings and floor levels are untouched; the R5 built-in unit keeps every plan position and only its joinery tops come down to suit the new soffit. Thicknesses are conceptual massing: waist-slab thickness, landing beams, support conditions, reinforcement and connections are TO BE DESIGNED / VERIFIED BY STRUCTURAL ENGINEER, and the 100 mm partitions are not to be assumed load-bearing.

The space beneath the upper flight remains one built-in unit: an under-landing store, a mirror partition, a semi-recessed west-facing basin and the retained TV panel and cabinet. All distances below are measured from the stair-side face of the bedroom wall (plan y = 6.10 m). The complete R2 stair geometry, landings, upper-floor connection, kitchen, bedrooms and every wall, door and window remain fixed, with one disclosed exception: the 900 × 1400 mm store-door aperture in the stair-side partition at y = 5.20–6.10 m. `revisions/r2-architecture.json` records the pre-change coordinates; the tests compare every element and allow only that aperture.

Store: 0–1.40 m from the wall, footprint 1.90 × 1.35 m (plan x 0.15–2.05, y 4.75–6.10), about 2.6 m² and 3.5 m³ against 0.27 m³ in the cabinet. R6 carcass tops: 1.37 m under the intermediate landing slab and its extension, 1.33 m where the waist springs off the landing and 1.51 m under riser 11, about 50 mm below each soffit (R5 read 1.42 / 1.59 / 1.77 m against the superseded flat tread lid). Two 450 mm bifold leaves, 1.40 m high, open from the passage face beside the bedroom door, where the person stands under the full 2.85 m slab; the pocket under the lower landing is crouch-in bulk storage. The 1.40 m leaves still clear the 1.42 m landing soffit and the wall above the door head remains. R6 carries the intermediate landing on a beam zone inside the existing bedroom cross-wall line rather than on the stair-side partition, but the support system and the cut still require structural design and verification; the fallback is a mirror-fronted door on the partition with no wall change.

Partition and basin: the mirror partition (plan y 4.70–4.75) is the store's east face and the visual back of the wash; its top comes down from +1.75 to +1.65 m under the 1.70 m waist soffit, and the mirror to +1.61 m. The 500 × 350 mm basin sits on a 350 mm counter with a drawer at plan x 1.55–2.05, y 4.35–4.70 (1.40–1.75 m from the wall), rim +0.86 m, against the back of the TV panel - unmoved; 1.73 m at the back of the bowl. The 750 × 600 mm standing zone at y 3.75–4.35 (1.75–2.35 m from the wall) is also unmoved and still faces WEST, but against the inclined waist soffit it has 1.98 m over the 150 mm leaning strip, 2.09 m over the body line and 2.40 m at the rear. DISCLOSED: the whole standing zone is now under the 2.20 m benchmark, where R5 was 30 mm under it at one point only. A front edge at 2.00 m would give 2.16 m. Access uses the existing 900 mm stair-entry opening behind the TV panel. Hand washing only.

TV and cabinet: unchanged. TV center plan y = 4.125 m, screen center +1.10 m, 950 × 50 × 1700 mm backing at x = 2.05–2.10 m. A fixed oak panel of the same height closes the former 600 mm opening at y = 4.60–5.20 m so the passage reads as one joinery wall. The cabinet keeps its 500 × 550 mm footprint under the last two lower-flight treads; its height comes down from 1080 to 800 mm under the 0.85 m lower-flight waist soffit, because a waist slab hangs one riser plus its own thickness below each nosing. Its doors are still reached from the wash side through a 400 mm strip beside the basin, now under a 1.73–2.09 m soffit.

The R2 stair remains SOUTH → WEST → EAST, 2 + 7 + 8 equal risers of 176.47 mm, 250 mm treads and 900 mm flights, with its existing lower-side landing extension, continuing 9 + 8 to the roof. Walking-line headroom on the flights is 2.26 m against the R6 soffit, still clear of the 2.20 m benchmark. Kitchen stays 2.90 × 2.05 m. Earlier alternatives remain historical studies only.

R6 structure (conceptual massing only): the waist top plane sits on the internal corners of the steps, one riser below the nosing line, so the construction depth at each nosing is one riser plus the waist. Indicative 150 mm waist and 150 mm landing slabs, with the 20 mm stone finish as a separate layer over the concrete so no walking level moves. Support is taken only from elements that already exist - the plinth under the starter landing, the 150 mm west external wall, a landing beam zone inside the existing 100 mm bedroom cross-wall line at y = 6.10–6.20, and the floor-slab trimmer at the stairwell edge. No cantilevered treads, no steel stringers, no wall below the upper flight, no new column in the living area. No reinforcement, bar size, spacing, beam size, column size or footing is implied.

`src/under-stair-layout.json` supplies fixture coordinates and the `structure` block to both the model and `.source/under_stair_revision.py`. R6 changes PDF sheets 03, 07 and 08 (and the cover index); R7 inserts a new sheet 09, Conceptual structural framing, pushing the former 09-11 to 10-12. The other eight pages render identically to R5. The existing wardrobe and facade model revisions are retained.

The revised front ribbons use explicit open cubic paths in `src/facade.js`, with a 145 mm face and the existing 80 mm projection. They follow the original front photograph and do not move building geometry. The first-floor band is deliberately open-ended on the left.

After changing stair review data, run `node scripts/revision-review.mjs` before building to refresh the embedded current stair detail. The dedicated revision tests verify preserved geometry, store zone clearances and volume, basin position and headroom, route clearance, wardrobe conflicts, band topology, cabinet fit, TV alignment and exact R2 architectural preservation apart from the disclosed store-door aperture. `node scripts/revision-browser-check.mjs` checks the review UI; `node scripts/under-stair-visual-check.mjs` (needs the dev server) renders the under-stair unit from the passage and from the stair entry into `qa/`.

The deliverable is `../drawings/compact-v4/interactive-3d.html`. It embeds Three.js, the model geometry, all 11 current PNG sheets and the complete PDF. No CDN, remote fonts, external assets or server are required at viewing time. The roughly 20 MB size is intentional: the original drawing package travels with the model.

## Rebuild

Use Node 22+ (Node 22.20 used for verification):

```sh
cd model
npm ci
npm run build
npm test
```

`npm run build` creates both a normal Vite build in `dist/` and the standalone HTML deliverable. The model build uses the current drawing exports. For development use `npm run dev`, after checking that port 5173 is free; change the port if occupied.

To refresh geometry from the existing drawing functions, create a Python environment with `reportlab` and `pymupdf`, then run `scripts/extract_plan.py`. To refresh embedded sheets/PDF, run `scripts/make_assets.py`. These scripts read the retained drawing sources and current exports; they do not rebuild or change the original PDF. Review any design changes before refreshing. `src/geometry.js` also contains room metadata and the explicitly modeled stair geometry.

## Source traceability

Source: `Hensal_Complete_House_Plans.pdf`, coordinated review set dated 08 September 2026 with the R6 sheets 03, 07 and 08 and the new R7 framing sheet 09 dated 10 September 2026, 12 sheets.

SHA-256: `1d63e0d6eb744da07006a0307df6fa9b492e682ac9a21baaaa4c0da669ddaba7`

`src/plan-data.json` records the original wall, door, window, furniture and drawing commands directly from the retained ground/first/roof drawing functions. The drawing coordinates increase north in x and west in y. Model coordinates are x = plan x − 3, vertical y = finished height, z = 4.85 − plan y. One scene unit is one metre.

The model has a 900 mm ground stair opening and a dedicated under-flight access aperture. Ground and first main slabs have actual stair holes; both storeys have 17 equal risers. The roof view includes the arriving stair from below. Furniture footprints come from the drawings; furniture heights and detailing are illustrative.

## Known source limits and modeling decisions

- Main slabs: assumed 150 mm. Main clear walls: 2.85 m derived from 3.00 m storeys. The stair is the only structure modeled, as conceptual RCC massing; the PDF explicitly reserves structural design and stair headroom checks, and the stair is not construction-ready without structural engineer approval.
- Front/rear scheduled opening heights and roof door/vents follow the drawing sources. Interior door heights default to 2.10 m. Side windows generally use a 1.00 m sill and 1.20 m height; the north ensuite window uses 1.65 m / 0.50 m. These side-window elevations are assumptions.
- Plan room/wall geometry governs over the appearance images. The GF service door remains in the recessed wall at plan y = 8.20 m. Its elevation projects it into the rear façade.
- Both roof vent x positions follow the roof plan at x = 0.55 m; the rear elevation implies a 0.20 m lateral shift. This discrepancy is disclosed in the viewer.
- The FF north bedroom has no side passage opening in the retained source. Its entry remains through the common front gallery. The master balcony door is in the side wall and does not pass through either ensuite.
- Finish thicknesses and corner profiles are illustrative. Thin material skins use a 3 mm visual offset to avoid z-fighting; frame depths are assumed. These do not redefine the stated dimensional/area basis.
- The nominal rectangular site, car body/stall/gate dimensions, well/septic marks and services reserve follow the site study. Vehicle turning, surveyed boundaries, actual azimuth and well/septic compliance are not verified.
- The roof drainage arrows, outlet/overflow and service box are concept indications. Falls and pipework are not engineered. The reserve is not an installed tank. Planting and lighting are illustrative.
- Separate floors introduces 4.40 m display gaps; those gaps are never treated as physical storey heights.
- Doors are displayed open with source hinge/swing direction. Open doors may appear edge-on in elevations. The exterior is an architectural model, not a photorealistic render.

## Verification

`npm test` verifies source hash, area/level arithmetic, every wall aperture, private ensuite connections and dimensions, rear vents and master side door, both flight dimensions and 17 equal risers, and outward roof access.

Browser checks:

```sh
npx playwright install chromium  # only if a compatible browser is not already available
node scripts/browser-check.mjs
```

The check can use `PLAYWRIGHT_CHROMIUM_EXECUTABLE`; on Apple Silicon it also recognizes an existing Playwright Chrome installation. Checks cover actual orbit/zoom, all floor and camera controls, room selection, all 11 embedded sheets, a byte-exact PDF download, furniture/dimension toggles, cutaway and separated views, PNG export, notes dialogs and a 390 px mobile layout. Runtime errors and external requests must both be zero. Screenshots are saved in `qa/` for visual comparison with the source drawings.

Runtime Three.js is MIT licensed; its license accompanies this folder and is embedded in the standalone HTML.

## Coordinated R5 rebuild

Run the combined PDF generator first (Python with reportlab and pymupdf), then refresh assets and build:

```sh
python drawings/compact-v4/.source/make_complete_plans.py
python model/scripts/extract_plan.py
python model/scripts/make_assets.py
cd model
node scripts/revision-review.mjs
npm test
npm run build
node scripts/revision-browser-check.mjs
```
