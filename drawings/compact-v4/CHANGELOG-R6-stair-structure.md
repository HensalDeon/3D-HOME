# R6 / R7 — Conceptual RCC staircase and whole-house framing (10 September 2026)

Makes the staircase structurally realistic and buildable without redesigning it. Riser count,
tread size, flight width, landings, floor levels, room layout, walls, doors, windows and the
under-stair functions are all unchanged.

> **STAIR SHOWN AS CONCEPTUAL RCC WAIST-SLAB SYSTEM. FINAL WAIST-SLAB THICKNESS, LANDING BEAMS,
> SUPPORT CONDITIONS, REINFORCEMENT AND CONNECTIONS TO BE DESIGNED BY STRUCTURAL ENGINEER.
> 100 MM PARTITION WALLS ARE NOT TO BE ASSUMED LOAD-BEARING.**
>
> This revision is **not construction-ready without structural engineer approval.**

## 1. Structural representation adopted

Conventional cast-in-situ RCC dog-leg, modelled as a folded plate:

| Element | Representation |
|---|---|
| Flights | Continuous waist slab under each 900 mm flight, indicative **150 mm** |
| Turns | **150 mm** landing slabs, monolithic with the flights |
| Finish | 20 mm stone/tile as a separate layer **over** the concrete; no walking level moves |
| Waist top plane | On the internal corners of the steps, one riser below the nosing line |
| Construction depth at each nosing | one riser (176.47 mm) + waist |
| Bottom support | Starter landing at +0.353 bearing on plinth fill |
| Side support | 150 mm west external wall (x = 0.00–0.15) |
| Landing support | **Landing beam zone inside the existing 100 mm bedroom cross-wall line, y = 6.10–6.20**, spanning the west external wall to the retained wall junction at x = 3.05–3.15 |
| Top support | Floor-slab trimmer at the stairwell edge, y = 3.45 (upper flight) / y = 3.20 (FF lower flight) |
| FF → roof | Same system repeated, 9 + 8 unchanged |

Explicitly excluded: cantilevered individual treads, steel stringers, any wall below the upper
flight, any new column in the living area, and any load on either 100 mm partition. No
reinforcement, bar diameter, spacing, beam size, column size or footing is invented — only
massing and two marked support zones, both drawn inside walls and slab edges that already exist.

## 2. Clash detected and resolved

A waist soffit is an inclined plane; the superseded model gave each tread a flat 120 mm lid,
which is only achievable with cantilevered treads. The real soffit is therefore lower, and it
hangs one riser plus the waist below each nosing. Five joinery heights no longer fitted.
**Only joinery tops were changed. No plan position, riser, tread, landing or floor level moved.**

| Item | R5 | R6 soffit | R6 object | Note |
|---|---|---|---|---|
| Store carcass, under landing slab | 1.42 | 1.418 | **1.37** | door still 1.40 m, clears |
| Store carcass, landing extension | 1.42 | 1.418 | **1.37** | |
| Store carcass, waist springing | 1.59 | 1.380 | **1.33** | |
| Store carcass, under riser 11 | 1.77 | 1.557 | **1.51** | |
| Mirror partition top | 1.75 | 1.698 | **1.65** | mirror top 1.65 → **1.61** |
| Cabinet height | 1.080 | 0.851 | **0.80** | biggest single change |
| Store volume | 3.7 m³ | — | **≈3.5 m³** | floor area 2.6 m² unchanged |

Clear heights, all measured to the conceptual soffit (plan positions unmoved):

| Where | R5 | R6 |
|---|---|---|
| 150 mm leaning strip / standing zone | 2.17 | **1.98** |
| Body line | 2.35 | **2.09** |
| Rear of standing zone | 2.53 | **2.40** |
| Back of the basin bowl | 2.00 | **1.73** |
| Cabinet stoop strip | 2.00–2.17 | **1.73–2.09** |
| Walking line on the flights | 2.50 | **2.26** |
| Disclosed fallback (basin front at 2.00 m) | 2.35 | **2.16** |

**Disclosed:** the whole standing zone is now below the 2.20 m benchmark, where R5 was 30 mm
below it at one point only. Walking-line headroom on the flights stays clear of the benchmark
at 2.26 m. Soffit plaster or render is additional and still to be confirmed.

## 3. Preserved without change

Footprint and room layout; stair location, 900 mm width, 2 + 7 + 8 and 9 + 8 risers at
176.47 mm, 250 mm treads, both landings and the 500 mm landing extension; all floor levels
(+0.45 / +3.45 / +6.45 / cover +9.00); every wall, door and window; the 900 × 1400 mm store
opening; store, mirror partition, basin, standing zone and cabinet plan positions; the TV at
y = 4.125 m with screen centre +1.10 m and the oak closing panel (both beside the flight, never
beneath it); roof access geometry. No new wall blocks the under-stair space.

## 4. Files changed

### Drawings — `drawings/compact-v4/`
| File | Change |
|---|---|
| `.source/under_stair_revision.py` | Superseded 120 mm tread zone replaced by the shared waist/landing/finish constants; `soffits()` returns the inclined soffit; `bay_section()` draws a continuous waist + landing slab + landing beam zone; new `structure_plan()` hatches the two support zones in plan; lower-flight mini-section gains its waist; `section()` (sheet 08) rebuilt with slab depth and soffit on both storeys; sheets 03 and 07 retitled and all figures/notes revised |
| `.source/make_roof_study.py` | Sheet 08 subtitle and both paragraphs |
| `.source/make_complete_plans.py` | Cover index entries 07 and 08; review-basis note |
| `Hensal_Complete_House_Plans.pdf` | Rebuilt — sheets **03, 07, 08** and the cover index; other 8 sheets identical |
| `00-cover`, `02-ground`, `05-stair-vastu`, `09-stair-section` `.png`/`.svg` | Regenerated previews |
| other `.png` / `.svg`, `index.html`, `dimensions.json`, `interactive-3d.html` | Regenerated by the build |
| `CHANGELOG-R6-stair-structure.md` | This file |

### 3D model — `model/`
| File | Change |
|---|---|
| `src/under-stair-layout.json` | New `structure` block (system, waist, landing slab, finish, supports, beam zones, exclusions, engineer note) shared with the Python drawings; revised store zone tops/clears, partition height, mirror height, cabinet height; `wash.clearHeights` added |
| `src/geometry.js` | `STAIR_STRUCTURE`, `STAIR_BEAM_ZONES`, `stairFlights()`, `stairLandingSlabs()`, `stairSoffit()` added; stair, wash, store and cabinet room descriptions revised. `stairTreads()` and `stairLandingExtensions()` untouched |
| `src/house.js` | New `concrete` material and `slopedSlab()` helper; the 17 floating tread slabs replaced by waist slabs → solid concrete steps → 20 mm stone finish; landing slabs at real thickness; conceptual beam-zone massing; two structural labels |
| `src/revision.js` | R6 id/status, `structure` exposed, `assumedStairThickness` → `supersededTreadZone`, demolition status revised |
| `src/stair-options.js` | `modeledHeadroom()` measures against the waist/landing soffit; both study options re-evaluated (2.29 → **2.26 m** and 2.17 → **1.91 m**); notes revised |
| `index.html` | Revision dialog rewritten to R6 with a new "Conceptual RCC stair structure" card; model-notes dialog revised |
| `scripts/revision.test.mjs` | Clearance helper switched to the soffit model; 4 tests re-based; 3 new tests — structure/support rules, geometry-unchanged guard, and a raycast check that every waist slab is seated on the flight line under every tread |
| `scripts/revision-browser-check.mjs`, `scripts/under-stair-visual-check.mjs` | R6 assertions and QA filenames |
| `src/plan-data.json`, `src/assets.json`, `src/revision-assets.json`, `dist/` | Regenerated |
| `README.md` | R6 status, revised figures, new PDF SHA-256 `c8604212b707945b594f27cfe100e3f9950829e9a751e377ea4100e3d52e5630` |
| `qa/R6-*.png` | New QA renders |

## 5. Validation performed

- `npm test` — **21/21 pass**, including the guards that compare every stair tread, landing,
  wall, opening and room boundary against the fixed `revisions/r2-architecture.json` and
  `revisions/baseline-v4` fixtures.
- Raycast test confirms each waist slab's top face lies on its flight line and every tread is
  seated on it with no void.
- `revision-browser-check.mjs` and `browser-check.mjs` — pass, zero JS errors, 11 sheets.
- Model compared against sheets 03, 07 and 08: riser counts, tread dimensions, landings and
  floor levels identical; under-stair store, basin, mirror, standing zone and cabinet all fit;
  no new wall in the under-stair space; the stair continues 9 + 8 to the roof unchanged.

## 6. Still open for the structural engineer

Waist-slab thickness; landing beam sizes, positions and connections; the support condition at
each end of every flight; reinforcement throughout; the connection to the floor slabs; whether
the 900 × 1400 mm store opening may be cut; and soffit finish allowances.


---

# R7 — Whole-house conceptual framing, and one modelling fix (10 September 2026)

> **STRUCTURE SHOWN AS CONCEPTUAL FRAMING MASSING ONLY. COLUMN AND BEAM SIZES, SLAB THICKNESSES,
> REINFORCEMENT, FOUNDATIONS AND ALL CONNECTIONS TO BE DESIGNED BY STRUCTURAL ENGINEER. THE GRID
> AND MEMBER POSITIONS ARE ONE COORDINATED OPTION, NOT A STRUCTURAL DESIGN.**

## 1. The frame

A simple cast-in-situ RCC frame on three longitudinal grids and six transverse grids. **Every
grid line is set out on a wall or pier that already exists in the plan** — verified by test.

| | Line | Set out on |
|---|---|---|
| A | x = 0.075 | west external wall, 150 mm |
| B | x = 3.100 | central spine wall line, 100 mm, with the existing front and rear piers |
| C | x = 5.925 | east external wall, 150 mm, with its piers |
| 1 | y = 0.075 | front (east) face |
| 2 | y = 1.275 | sit-out and balcony edge wall |
| 3 | y = 2.250 | kitchen / stair cross wall |
| 4 | y = 6.150 | bedroom cross wall — also the R6 stair landing beam |
| 5 | y = 8.250 | rear cross wall |
| 6 | y = 9.625 | rear face |

**15 column zones, 21 beam lines, 2 stairwell trimmers.** Fourteen columns fall on an existing
wall junction or pier; **only C4 is new**, standing inside the 150 mm east external wall beside
the rear service passage to keep the grid C span under 5 m. Longest beam span 4.88 m (C2–C4),
shortest 0.97 m. Floor slabs stay the 150 mm two-way slabs already assumed. Columns A3 and A4
continue past the roof slab to the stair-cover at +9.00 m.

## 2. How members are sized, and why it matters

Members are drawn at the thickness of their host wall where that is 150 mm, so they stay
concealed. Where the host is a **100 mm** wall they are drawn 230 mm wide and carried across the
wall to **one declared side** — this is a real coordination decision, not cosmetic:

| Grid | Projects | Why that side |
|---|---|---|
| B | east, into the living / service side | clear of kitchen, stair and bedrooms |
| 3 | south, into the kitchen | projecting into the stair side would leave only **2.20 m** over the stair starter landing |
| 4 | north, into Bedroom 1 | projecting into the stair side would **clash with the under-stair store** |
| 5 | north, into the rear work area | — |

An indicative 300 mm downstand leaves about **2.55 m** clear under a beam line, against 2.85 m
elsewhere. 230 mm and 300 mm are indicative only.

## 3. Modelling fix — the free-standing "pillar"

The stair-side partition was left with a **50 mm × 2.85 m sliver of wall standing on its own** in
the stair entry, between the stair-entry opening ending at y = 3.20 and the joinery opening
starting at y = 3.25. It appeared in the 3D model and in the interior renders as a slim post in
front of the TV panel. It was a modelling leftover, not architecture. The two openings now meet at
y = 3.20 and the sliver is gone; `wallPieces` also drops any zero-width sliver from float noise.
This is the second and last disclosed change to the locked R2 wall set, alongside the store door.

## 4. Files changed

### Drawings — `drawings/compact-v4/`
| File | Change |
|---|---|
| `.source/structural_framing.py` | **New.** Framing plan, grid bubbles, member massing, storey-depth diagram and all sheet text, reading the shared frame data |
| `.source/make_complete_plans.py` | `TOTAL` 11 → 12; framing sheet inserted at position 09; cover index entries |
| `Hensal_Complete_House_Plans.pdf` | Rebuilt as **12 sheets**; new sheet 09; former 09–11 renumbered 10–12 |
| `11-structural-framing.png` / `.svg` | New sheet exports |
| `00-cover`, `index.html`, `dimensions.json`, `interactive-3d.html` | Regenerated |

### 3D model — `model/`
| File | Change |
|---|---|
| `src/structural-frame.json` | **New.** Grid, 15 columns, 21 beams, trimmers, slabs, projection sides, coordination notes; shared with the drawings |
| `src/geometry.js` | `FRAME`, `frameColumns`, `frameBeams`, `frameTrimmers`, `frameLevels`, `frameSpans`; zero-width wall slivers dropped |
| `src/house.js` | Frame rendered as its own group, hidden by default |
| `src/revision.js` | Joinery opening extended to y = 3.20, removing the sliver |
| `src/main.js`, `index.html` | "Conceptual structure" layer toggle; 12-sheet titles and caption |
| `scripts/make_assets.py`, `scripts/browser-check.mjs` | 12 sheets |
| `scripts/revision-browser-check.mjs` | Captures `qa/R7-structure.png` and asserts the layer |
| `scripts/revision.test.mjs` | Frame test (grids trace to real walls, sizing rule, spans, no member on the stair or in the under-stair unit, grid 3/4 projection sides); sliver disclosed in the architecture lock |
| `README.md` | 12 sheets, R7 summary, PDF SHA-256 `1d63e0d6eb744da07006a0307df6fa9b492e682ac9a21baaaa4c0da669ddaba7` |

### Interiors — `interiors/.source/`
| File | Change |
|---|---|
| `generate.py` | **New.** Image-generation runner with 429 backoff |
| `jobs-r6-stair.json` | **New.** Three edit jobs for `03-stair-tv-wide`, `04-storage-wide`, `05-wash-wide` |
| `qa/source-cameras/03,04,05` | Re-captured from the updated model (untracked) |

## 5. Not done — interior images

`interiors/images/03-stair-tv-wide.png`, `04-storage-wide.png` and `05-wash-wide.png` still show
the superseded floating treads, and `03` still shows the removed pillar. The Gemini API key in
`.env` has **no image-generation quota left** — every image model answers HTTP 429, and
`gemini-3-pro-image` reports `limit: 0` on the free tier, so nothing could be generated. The
source cameras have been re-captured and the jobs are written; once quota is available:

```
cd interiors/.source && set -a && . ../../.env && set +a
IMAGE_MODEL=gemini-2.5-flash-image python3 generate.py jobs-r6-stair.json
python3 promote_image.py 03-stair-tv-wide "R6 solid RCC stair; modelling pillar removed"
python3 build_pdf.py
```

## 6. Validation

`npm test` 22/22, `browser-check` (12 sheets), `revision-browser-check` (R6/R7 layer) all pass.
