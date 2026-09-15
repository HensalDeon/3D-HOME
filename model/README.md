# Interactive model source

The development model displays the approved R14 TV joinery beneath the lower stair flight. `src/tv-joinery-preview.js` defines the shallow cabinet, screen and backing; the backing profile is sampled against the existing stair meshes. `src/house.js` assembles the house and the separate basin nook.

## Deliverables and drawing scope

The current interior deliverable is [the offline R14 review](../interiors/R14-review.html). The published standalone explorer at `../drawings/compact-v4/interactive-3d.html`, the combined PDF and `src/under-stair-layout.json` still describe the coordinated R13 drawing revision. R14 visual approval has not yet been propagated into that drawing package.

A full standalone rebuild currently combines the development model with the retained drawing assets. Coordinate the R14 drawing annotations before replacing the published package.

## Local development and checks

Use Node 22 or newer. From this directory:

```sh
npm ci
npm run dev
npm test
node --test scripts/r14-preview.test.mjs
```

Check for an existing server before starting Vite on its default port 5173. Use another port if occupied.

`npm test` covers the coordinated plan data and architectural preservation. The dedicated R14 test checks the shallow footprint, access separation and backing clearance. [revisions/README.md](revisions/README.md) documents the three baseline fixtures required by those tests.

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

`extract_plan.py` refreshes plan data from the drawing sources. `make_assets.py` embeds the current sheet images and PDF. `revision-review.mjs` refreshes the embedded stair detail and façade reference. `npm run build` creates the Vite output and the standalone explorer. Resolve the R14/R13 coordination described above before using this sequence to publish a replacement package.

`node scripts/browser-check.mjs` verifies the standalone explorer. `node scripts/revision-browser-check.mjs` checks the published revision UI. QA images for the published R13 package are retained separately from the R14 review images.

## Retained source and limits

`src/geometry.js` provides walls, openings, levels and stair geometry. `src/plan-data.json`, `src/structural-frame.json` and `src/under-stair-layout.json` retain coordinated drawing data. `references/` contains original visual references, and `revisions/` contains only required preservation fixtures.

Plan x increases north and plan y increases west. The model uses x = plan x − 3, vertical y = finished height, and z = 4.85 − plan y, in metres. The ground floor datum is +0.45 m, first floor +3.45 m and roof +6.45 m.

The living/stair opening retains its header from +2.10 m to +2.85 m above the ground finished floor. Stair waist slabs and support zones are conceptual structural massing. Model fit checks do not establish fabrication, reinforcement or structural design. Unspecified finish details are illustrative; the drawing set and viewer notes record architectural assumptions.

Three.js is MIT licensed; see `THIRD_PARTY_LICENSE.txt`. The standalone explorer embeds its runtime and drawing assets for offline viewing.
