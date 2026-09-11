# R8 — External wall thickness, 220 mm ground / 170 mm first (11 September 2026)

Internal partitions stay 100 mm throughout. No room was redesigned, the staircase was not
touched, and the under-stair unit carried over unchanged.

## 1. How the thickness was absorbed

The plot is fixed at 9.70 × 16.80 m, so the extra thickness had to come from somewhere. A
**hybrid** rule was used, per edge:

| Edge | Direction | Why |
|---|---|---|
| West | **outward**, into the 2.70 m parking strip | it is the stair's wall — growing inward would cut the 900 mm flight to 830 mm |
| Rear | **outward**, into the 4.10 m garden | the most generous setback |
| East | **inward** | faces the 1.00 m path, the tightest setback, which must not shrink |
| Front | **inward** | faces the 3.00 m front yard |

Every **inner face** the staircase and the under-stair unit depend on is therefore unmoved.

## 2. What changed

| | Before | After |
|---|---|---|
| Ground external walls | 150 mm | **220 mm** |
| First-floor external walls | 150 mm | **170 mm** |
| Internal partitions | 100 mm | 100 mm (unchanged) |
| Ground envelope | 6.00 × 9.70 m · 58.20 m² · 626.5 sq ft | **6.07 × 9.77 m · 59.30 m² · 638.3 sq ft** |
| First envelope | 6.00 × 9.70 m · 58.20 m² · 626.5 sq ft | **6.02 × 9.72 m · 58.51 m² · 629.8 sq ft** |
| Main floors + roof enclosure | 125.42 m² | **126.84 m²** |
| North path setback | 1.00 m | 1.00 m (unchanged) |
| Front yard setback | 3.00 m | 3.00 m (unchanged) |
| South parking strip | 2.70 m | **2.63 m** |
| Rear garden | 4.10 m | **4.03 m** |

Rooms against a face that moved inward:

| Room | Before | After |
|---|---|---|
| Kitchen | 2.90 × 2.05 | 2.90 × **1.98** |
| Living & dining | 2.70 × 4.75 | **2.63** × 4.75 |
| East sit-out | 2.70 × 1.20 | **2.63** × 1.20 |
| Rear work area | 2.70 × 1.40 | **2.63 × 1.47** |
| Rear service passage | 1.30 clear | **1.23** clear |
| Study / family | 2.90 × 2.05 | 2.90 × **2.03** |
| Bedroom 3 | 2.70 × 3.60 | **2.68** × 3.60 |
| Ensuite 3 | 1.30 × 2.00 | **1.28** × 2.00 |
| Front balcony | 2.70 × 1.20 | **2.68** × 1.20 |
| Rear drying balcony | 2.70 × 1.40 | **2.68 × 1.42** |

Unchanged: Bedroom 1 (2.90 × 3.35), Master (2.90 × 3.35), Ensuites 1 and 2 (1.30 × 2.00), the
stair and both landings, and the whole under-stair store / basin / cabinet unit.

## 3. Things worth knowing

- **The first floor is 629.8 sq ft against a 630 guard** — 0.2 sq ft of headroom. Any further
  thickening of the first-floor external walls breaks it.
- Apertures were widened to match their host wall. They previously carried a hardcoded 150 mm
  thickness, which inside a 220 mm wall would have left a 70 mm sliver of wall behind each
  window and door — the same defect as the R7 "pillar".
- All first-floor walls sit within the ground-floor wall footprint, so nothing is unsupported.
- The R7 structural grid was regenerated: grids A, C, 1 and 6 now sit in 220 mm walls and fully
  conceal their members, so only the 100 mm grids B, 3, 4 and 5 still need a projection side.
- **This is still a framed scheme.** 220/170 is the classic Kerala load-bearing spec, but R6 and
  R7 print that the 100 mm partitions are not load-bearing and carry the house on columns and
  beams. If the intent is to switch to load-bearing masonry, the structural sheets need reworking.

## 4. Files changed

| File | Change |
|---|---|
| `.source/make_ensuite_plans.py` | `EXT` per-floor thickness, `grow`/`west`/`envelope`/`floor_area` helpers, parameterised `outer()`, per-floor `dimensions()`, aperture thickness follows its wall, site setbacks, `validate()` and all affected labels and text |
| `.source/make_complete_plans.py` | Cover areas and subtitle |
| `Hensal_Complete_House_Plans.pdf` + sheet exports | Rebuilt; SHA-256 `343a4c1de5a3707043f1bf767217aa6bd03de74db074623d7ca698999cf22ee9` |
| `model/src/geometry.js` | `EXTERNAL_WALL`, `ENVELOPE`, eleven room boxes and dimension strings, privacy screen |
| `model/src/house.js` | Plinth and every suspended slab follow the envelope of the storey below; site dimensions |
| `model/src/revision.js` | R1 spine-wall split matches the grown rear face |
| `model/src/structural-frame.json` | Grid hosts, member boxes and sizes regenerated |
| `model/index.html`, `src/main.js` | Per-floor envelope figures, combined area, R8 badge |
| `model/scripts/revision.test.mjs` | Per-level R8 transform encoded in the architecture lock; new R8 test |
| `model/scripts/model.test.mjs` | Per-floor areas; Ensuite 3 width |
| `model/README.md` | R8 status and new PDF SHA-256 |

## 5. Validation

`npm test` 23/23, including the locks proving that apart from the disclosed R6/R7/R8 changes
nothing else moved, and a new test pinning the per-floor wall thicknesses, the preserved inner
faces, the untouched stair and the unchanged tight setbacks. `browser-check` (12 sheets) and
`revision-browser-check` both pass.
