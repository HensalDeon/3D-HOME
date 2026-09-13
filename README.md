# Hensal House — design review package

A G+1 (ground + first floor, with full roof access) house design for a 4.00-cent east-facing plot at Thiruvaniyoor, Kunnathunadu Taluk, Ernakulam District, Kerala (plot per sketch Re-Sy 168/2-2; private road on the east). The plan is developed for three bedrooms, each with a private ensuite, a compact staircase carrying store/wash/TV joinery underneath it, and full stair access to an open roof terrace.

**This is a design-review set, not a signed construction or permit set.** Structural sizing, reinforcement, foundations, waterproofing, services and a measured site survey remain to be completed by the relevant professionals before anything is built.

## Current status: R8

- **Footprint / walls:** external walls are 220 mm on the ground floor and 170 mm on the first, with 100 mm internal partitions throughout. The plot is fixed, so the extra thickness was absorbed asymmetrically — the west and rear walls grew outward into the parking strip and the garden, while the east and front walls thickened inward — so the 1.00 m north path and 3.00 m front yard setbacks, and every inner face the stair depends on, are unchanged.
- **Areas:** ground floor 6.07 × 9.77 m (59.30 m² / 638.3 sq ft); first floor 6.02 × 9.72 m (58.51 m² / 629.8 sq ft); roof enclosure +9.02 m² / 97.09 sq ft. Combined main floors 117.82 m² / 1,268.2 sq ft; conservative total including the roof enclosure 126.84 m² / 1,365.3 sq ft.
- **Staircase:** SOUTH → WEST → EAST, 2 + 7 + 8 risers to the first floor and 9 + 8 continuing to the roof, 17 equal risers per storey at 176.47 mm, 250 mm treads, 900 mm clear flights. It is modelled as a conceptual cast-in-situ RCC waist-slab staircase (continuous waist and landing slabs, not the earlier separate-tread look) carried on the plinth, the west external wall, a landing beam zone in the bedroom cross-wall, and the floor-slab trimmer — **conceptual massing only**; final waist thickness, landing beams, supports, reinforcement and connections are for the structural engineer to design and verify, and the 100 mm partitions are not to be assumed load-bearing.
- **Structural frame:** the whole house is also shown on one conceptual column-and-beam grid (drawing sheet 9), set out on the walls and piers that already exist — again massing only, not a structural design.
- **Under-stair unit:** one built-in zone under the upper flight — a store under the landing, a mirror partition, a west-facing basin, and the retained TV panel/cabinet — with joinery heights re-checked against the RCC soffit.

> ⚠️ **Known open item:** the first floor's 629.8 sq ft sits just under this project's 630 sq ft per-floor guard, and the combined 1,268.2 sq ft main-floor area is close to a stated 1,260 sq ft cap under discussion. Any further growth on the first floor, or a decision to cap total area, needs a deliberate area-reduction pass, not an incidental one.

Full change-by-change history: [`CHANGELOG-R6-stair-structure.md`](drawings/compact-v4/CHANGELOG-R6-stair-structure.md) (RCC stair + structural framing) and [`CHANGELOG-R8-wall-thickness.md`](drawings/compact-v4/CHANGELOG-R8-wall-thickness.md) (wall thickness).

## What's in this repo

| Folder | What it is |
|---|---|
| [`drawings/compact-v4/`](drawings/compact-v4/) | The dimensioned drawing set — the single source of truth. `Hensal_Complete_House_Plans.pdf` is the 12-sheet PDF to share with an architect or builder; `.source/` holds the Python generators it's built from. |
| [`model/`](model/) | The interactive 3D model (Three.js) built from the same drawing data, plus its test suite and build tooling. |
| [`interiors/`](interiors/) | A photographic-style interior design proposal book (finishes, furniture, materials) laid over the approved architecture — illustrative, not part of the dimensioned drawing set. |

## View the plans

- **PDF:** [`drawings/compact-v4/Hensal_Complete_House_Plans.pdf`](drawings/compact-v4/Hensal_Complete_House_Plans.pdf) — 12 A3 sheets: cover & index, site & parking, ground floor, first floor, roof plan, front & rear elevations, stair geometry & Vastu, stair section & headroom, conceptual structural framing, roof setbacks & exit, historical style references, current exterior appearance.
- **3D model:** open [`drawings/compact-v4/interactive-3d.html`](drawings/compact-v4/interactive-3d.html) in any modern browser, or in the desktop Preview tab. It's a single self-contained offline HTML file — no install, server or internet connection needed. Orbit, zoom and pan; isolate the ground floor, first floor or roof; toggle a cutaway, separated floors, furniture, dimensions or the conceptual structural frame; select any room for its exact dimensions; save a PNG. The dimensioned PDF and the source data are embedded in the file itself.
- **Plan gallery:** [`drawings/compact-v4/index.html`](drawings/compact-v4/index.html) is a simpler scrollable gallery of the same 12 sheets with a PDF download link.

The dimensioned drawings govern over any rendered image. Unspecified heights, illustrative finishes and known source discrepancies are listed in the model's **Model assumptions & source notes** (the ⓘ button on narrow screens) and in [`model/README.md`](model/README.md).

## For developers / rebuilding

Rebuilding the drawings or the model requires Python (`reportlab`, `pymupdf`) and Node 22+. Start with [`model/README.md`](model/README.md) for the full rebuild pipeline and test suite; [`drawings/compact-v4/README.md`](drawings/compact-v4/README.md) documents the drawing package on its own. In short:

```sh
python drawings/compact-v4/.source/make_complete_plans.py   # rebuild the PDF + sheet exports
cd model
npm ci
npm run build   # rebuilds the standalone 3D model from the current drawing exports
npm test         # 23 checks: geometry, apertures, stair, frame, and every disclosed revision
```
