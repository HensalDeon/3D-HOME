# Interactive model source

R19 opens the first-floor stair-side partition below 2550 mm, retaining the overhead band to the 2850 mm slab soffit. Slim charcoal vertical guards with oak top rails protect the passage drop and roof stair flight; level access to the study and stair remains open. Proposed guards are 1100 mm high, with 100 mm maximum baluster centre pitch. Their footprints stay within the former wall band, preserving the 900 mm design passage width. The bedroom doorway now looks down this passage, and the study image has no partition nib. Existing stairs, main frame and roof enclosure retain their geometry. Guard connections, fixings and overhead support require structural design. The shared source is `model/src/stair-passage-layout.json` (repository-relative path). The former wall band is reserved for guard details rather than added to named clear areas; the total remains **1,365.28 sq ft**.

R18 adds fitted wardrobe lofts and enclosed bed storage in the existing bedroom footprints, and opens the family/tailoring room to the stair base. The main wardrobes remain 2100 mm high, with 400 mm lofts to 2500 mm and open space above. Matte ivory fronts and sides, muted oak accent bays, narrow paired doors and recessed plinths replace the boxy timber massing. A 750 × 450 mm shared linen cabinet is tucked beside the tailoring benches. All three beds gain panel-lined lift-up storage bases; no side drawers enter the compact aisles. Lofts add **1.210 m³ gross external volume** before panels/hardware, including shared linen storage; the three bed cavities provide **1.415 m³ nominal panel-lined volume** before mechanisms/dividers. These are not net usable-capacity claims. Cabinet tops stay 50 mm below the indicative beam soffit. Cosmetic ceiling bands are removed; the loft tops remain visible. Bedroom 3 uses a continuous 90° L carcass without a solid corner filler.

[Interior image register](../interiors/IMAGE_REVIEW.md). Cabinet geometry, finishes and height/capacity basis are coordinated through `model/src/storage-layout.json` (repository-relative path). Furniture-supplier checks remain required for hinges, corner access, lift mechanisms, ventilation, fixings and measured site dimensions. Gross floor areas and bedroom/bed footprints are unchanged. The study/stair partition is removed while retaining the beam and stair structure; the study zone becomes 2.950 × 2.130 m and gains 0.4425 m² (4.76 sq ft) of clear floor area. Three sewing stations use two compact benches, with a 650 mm aisle between occupied chair footprints and 2500 mm clear at the stair connection beside the cabinet. Final machine and chair dimensions require supplier coordination.

R17 aligns connected internal walls and rear pier caps to common finished faces, at **150 mm total including plaster**. The central spine is x = 3.10–3.25 on both floors; bedroom and bathroom front walls share y = 6.10–6.25. The upstairs passage remains 900 mm. Southwest bedrooms are 2.950 × 3.300 m; Bedroom 3 is 2.580 × 3.575 m. Each ensuite is 1.215 × 2.100 m, with a 900 mm shower zone and 600 mm walk-in entry and a maximum installed WC projection of 550 mm (665 mm clear in front). Bedroom 3 uses a surface-sliding ensuite door. The rear work counter is 450 mm deep, leaving an 820 mm aisle.

Gross covered areas remain **638.34 sq ft ground + 629.84 sq ft first = 1,268.19 sq ft** (total calculated before rounding each floor). Including the 97.09 sq ft roof enclosure, the total is **1,365.28 sq ft**. Room clear areas and named-zone totals are derived from the new wall faces in `dimensions.json`; they exclude wall bands/door reveals and include stairs/covered outdoor zones, so they are not statutory carpet areas.

These are compact single-user clearances. The [NKBA planning guide](https://media.nkba.org/uploads/2022/05/Bath-Planning-Guidelines.pdf) recommends larger fixture-front space (762 mm); this layout provides 665 mm at the WCs and is not full NKBA or universal-access compliance. A [540 mm compact WC example](https://www.uk.roca.com/products/vitreous-china-wall-hung-rimless-wc-34647L..0?sku=A34647L000) shows the intended fixture class, not a selected product. Verify the complete installed projection, carrier/cistern and tile build-up without consuming the published clearances. No structural member has been reduced to conceal a projection: grid B/pier finishes and the revised rear cross-beam need engineering coordination. Directions and the exterior envelope are preserved; complete Vastu compliance is not certified.

The model displays the published R14 TV joinery beneath the lower stair flight. `src/tv-joinery-preview.js` builds the cabinet, screen and backing from `src/under-stair-layout.json` — the same file the drawing scripts read — and samples the backing profile against the existing stair meshes, throwing if the measured soffit departs from the published `tv.panelTopProfile` by more than 5 mm. `src/house.js` assembles the house and, at R15, the basin that continues that same run: `revision.wash` is read from the identical file, and the vanity, backing, mirror and dividing fin sit on the joinery's own depth and face plane rather than in the old corner against the bedroom wall.

`slopedSlab()` builds each inclined waist as an extruded prism with a **vertical** depth and **vertical** end faces. It was previously a rotated box, which silently turned the 208 mm waist zone into a 255 mm vertical drop and overran the foot of each flight by 0.13 m in plan; the modelled soffit was 67 mm below the drawn one everywhere. Modelled and canonical soffits now agree to 0.7 mm on all four flights.

## Deliverables and drawing scope

The current [image register](../interiors/IMAGE_REVIEW.md) links the canonical photographs. The standalone explorer, combined PDF, `dimensions.json`, `src/storage-layout.json`, `src/under-stair-layout.json` and `src/stair-passage-layout.json` hold the coordinated R19 design. Duplicate interior review pages have been removed.

Rebuild order matters, because each artefact embeds the previous one: build the drawings first (`drawings/compact-v4/.source/make_complete_plans.py`), then `scripts/extract_plan.py`, `scripts/make_assets.py`, `scripts/revision-review.mjs`, then `npm run build`.

## Local development and checks

Use Node 22 or newer. From this directory:

```sh
npm ci
npm run dev
npm test
node --test scripts/r14-preview.test.mjs
```

Check for an existing server before starting Vite on its default port 5173. Use another port if occupied.

`npm test` covers PDF traceability, wall apertures, 150 mm finished wall bands, the 900 mm passage, room and furniture clearances, retained roof architecture and stair geometry. The R19 test verifies the upper opening, overhead band, drop guards and clear passage against the built meshes. The dedicated R14 test checks the shallow footprint, access separation and backing clearance; the R15 test checks that the basin holds the joinery's depth, face plane and orientation, that the fin closes the run, and that the clear height is uniform. [revisions/README.md](revisions/README.md) documents the three baseline fixtures required by those tests.

## Interior references and photographs

`src/storage-layout.json` controls wardrobe footprints, paired fronts, lofts and bed cavities. `src/storage-joinery.js` builds the cupboard panels; `src/under-stair-layout.json` controls the stair and TV/basin composition. These source files are required for rebuilding the model and drawings.

Generate an actual-model geometry reference without creating revision folders:

```sh
node scripts/interior-references.mjs --view 08-bedroom2-opposite --output /tmp/hensal-interior-references
```

Omit `--view` to export all six configured cameras. The projector writes PPMs and a camera/source-hash audit; convert the native renders to PNG when needed. These flat geometry views are references, not final photographs. The browser geometry renderer `scripts/r14-reference-render.mjs` remains available for the living/stair cameras and accepts `DEV_SERVER` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.

Finished images use built-in imagegen with the original kitchen wide/detail as style references. Read [the style brief](../interiors/STYLE_REFERENCE.md) first. Review geometry and finishes, then update the canonical image, `image-release.json`, `image-inventory.json` and image register. Exact R18/R19 prompts, source roles, hashes and camera records are consolidated in `interiors/.source/image-release.json`; superseded source pixels remain recoverable from Git commits `0333b6d` and `65c5704`. Rebuild the live style board with `python interiors/.source/build_style_reference.py` from the repository root.

## Rebuild the coordinated drawing package

The drawing generator needs Python with ReportLab and PyMuPDF. From the project root:

```sh
python drawings/compact-v4/.source/make_complete_plans.py
python model/scripts/extract_plan.py
python model/scripts/make_assets.py
cd model
node scripts/revision-review.mjs
npm test
npm run build
```

`extract_plan.py` refreshes plan data from the drawing sources. `make_assets.py` embeds the current sheet images and PDF. `revision-review.mjs` refreshes the embedded stair detail and façade reference. `npm run build` creates the Vite output and the standalone explorer. Run the drawing sources first: each artefact embeds the previous one, so the sheets must be rebuilt before `extract_plan.py` refreshes the PDF hash that `browser-check.mjs` asserts against.

`node scripts/browser-check.mjs` verifies the standalone explorer. `node scripts/revision-browser-check.mjs` checks the published revision UI. `node scripts/under-stair-visual-check.mjs` renders the `qa/R15-under-stair-*` views and needs a dev server; it honours `DEV_SERVER` if port 5173 is already taken.

## Retained source and limits

`src/geometry.js` provides walls, openings, levels and stair geometry. `src/plan-data.json`, `src/structural-frame.json` and `src/under-stair-layout.json` retain coordinated drawing data. `references/` contains original visual references, and `revisions/` contains only required preservation fixtures.

Plan x increases north and plan y increases west. The model uses x = plan x − 3, vertical y = finished height, and z = 4.85 − plan y, in metres. The ground floor datum is +0.45 m, first floor +3.45 m and roof +6.45 m.

The living/stair opening retains its header from +2.10 m to +2.85 m above the ground finished floor. Stair waist slabs and support zones are conceptual structural massing. Model fit checks do not establish fabrication, reinforcement or structural design. Unspecified finish details are illustrative; the drawing set and viewer notes record architectural assumptions.

Three.js is MIT licensed; see `THIRD_PARTY_LICENSE.txt`. The standalone explorer embeds its runtime and drawing assets for offline viewing.

## Landing support coordination

The indicative landing beam formerly extended to x = 3.05 at landing height and crossed the bedroom entrances. Its massing now ends at the actual landing edge x = 2.05 on both levels. The right-end bearing, connections and reinforcement require structural design; the partitions are not assumed load-bearing. The separate full-height frame beams, stair treads, waist slabs and floor areas retain their geometry. The regression test checks the support meshes against every door aperture on both levels.
