# Interactive model source

The model displays the published R14 TV joinery beneath the lower stair flight. `src/tv-joinery-preview.js` builds the cabinet, screen and backing from `src/under-stair-layout.json` — the same file the drawing scripts read — and samples the backing profile against the existing stair meshes, throwing if the measured soffit departs from the published `tv.panelTopProfile` by more than 5 mm. `src/house.js` assembles the house and, at R15, the basin that continues that same run: `revision.wash` is read from the identical file, and the vanity, backing, mirror and dividing fin sit on the joinery's own depth and face plane rather than in the old corner against the bedroom wall.

`slopedSlab()` builds each inclined waist as an extruded prism with a **vertical** depth and **vertical** end faces. It was previously a rotated box, which silently turned the 208 mm waist zone into a 255 mm vertical drop and overran the foot of each flight by 0.13 m in plan; the modelled soffit was 67 mm below the drawn one everywhere. Modelled and canonical soffits now agree to 0.7 mm on all four flights.

## Deliverables and drawing scope

The current interior deliverable is [the offline R14 review](../interiors/R14-review.html). The standalone explorer at `../drawings/compact-v4/interactive-3d.html`, the combined PDF, `dimensions.json` and `src/under-stair-layout.json` are all at R15. The linked review page is the R14 render set and still shows the basin in its former corner position.

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

`npm test` covers the coordinated plan data and architectural preservation. The dedicated R14 test checks the shallow footprint, access separation and backing clearance; the R15 test checks that the basin holds the joinery's depth, face plane and orientation, that the fin closes the run, and that the clear height is uniform. [revisions/README.md](revisions/README.md) documents the three baseline fixtures required by those tests.

## Refresh the interior review

The final interior images use Cycles to render the approved meshes with photographic materials and lighting. From the project root:

```sh
node model/scripts/export-interior.mjs
blender --background --python interiors/.source/render_interior.py
```

Review the candidates in `interiors/.source/render/`, then run `python interiors/.source/promote_renders.py` to update the three canonical images, their metadata and the mesh audit. Run `node model/scripts/r14-review-page.mjs` to rebuild the offline page.

The exporter preserves existing vertices, triangle indices and normals. Cycles uses surface shaders and lighting only, with no geometry modifiers. The first two cameras match the approved R14 views; storage uses the close-up camera position with a tighter lens. See [rendering notes](../interiors/R14-review.md).

The basic browser renderer, `scripts/r14-reference-render.mjs`, writes geometry references into `qa/` and accepts `DEV_SERVER` and `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. It never overwrites the photographic deliverables.

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

`node scripts/browser-check.mjs` verifies the standalone explorer. `node scripts/revision-browser-check.mjs` checks the published revision UI. `node scripts/under-stair-visual-check.mjs` renders the `qa/R15-under-stair-*` views and needs a dev server; it honours `DEV_SERVER` if port 5173 is already taken. The `qa/R14-review-*` captures document the unchanged R14 review page and are kept separately.

## Retained source and limits

`src/geometry.js` provides walls, openings, levels and stair geometry. `src/plan-data.json`, `src/structural-frame.json` and `src/under-stair-layout.json` retain coordinated drawing data. `references/` contains original visual references, and `revisions/` contains only required preservation fixtures.

Plan x increases north and plan y increases west. The model uses x = plan x − 3, vertical y = finished height, and z = 4.85 − plan y, in metres. The ground floor datum is +0.45 m, first floor +3.45 m and roof +6.45 m.

The living/stair opening retains its header from +2.10 m to +2.85 m above the ground finished floor. Stair waist slabs and support zones are conceptual structural massing. Model fit checks do not establish fabrication, reinforcement or structural design. Unspecified finish details are illustrative; the drawing set and viewer notes record architectural assumptions.

Three.js is MIT licensed; see `THIRD_PARTY_LICENSE.txt`. The standalone explorer embeds its runtime and drawing assets for offline viewing.
