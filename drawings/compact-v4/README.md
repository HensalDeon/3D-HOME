# Hensal — coordinated house plans

The 9 October Bedroom 1 rear window is enlarged from 600 × 700 mm to 1200 × 1200 mm, sill +1.00 m and head +2.20 m above bedroom floor. Its left jamb stays at plan x = 0.50 m. Sheet 03 labels the opening and sheet 06 shows the enlarged rear elevation; the plan gallery and offline explorer include those exports. The 1400 × 1200 mm side window, furniture, room dimensions, compass directions and gross areas are retained. Coordinate the opening lintel and fixing details with the existing frame.

R19 opens the first-floor stair-side partition below 2550 mm, retaining the overhead band to the 2850 mm slab soffit. Slim charcoal vertical guards with oak top rails protect the passage drop and roof stair flight; level access to the study and stair remains open. Proposed guards are 1100 mm high, with 100 mm maximum baluster centre pitch. Their footprints stay within the former wall band, preserving the 900 mm design passage width. The bedroom doorway now looks down this passage, and the study image has no partition nib. Existing stairs, main frame and roof enclosure retain their geometry. Guard connections, fixings and overhead support require structural design. The shared source is `model/src/stair-passage-layout.json` (repository-relative path). The former wall band is reserved for guard details rather than added to named clear areas; the total remains **1,365.28 sq ft**.

R18 adds fitted wardrobe lofts and enclosed bed storage in the existing bedroom footprints, and opens the family/tailoring room to the stair base. The main wardrobes remain 2100 mm high, with 400 mm lofts to 2500 mm and open space above. Matte ivory fronts and sides, muted oak accent bays, narrow paired doors and recessed plinths replace the boxy timber massing. A 750 × 450 mm shared linen cabinet is tucked beside the tailoring benches. All three beds gain panel-lined lift-up storage bases; no side drawers enter the compact aisles. Lofts add **1.210 m³ gross external volume** before panels/hardware, including shared linen storage; the three bed cavities provide **1.415 m³ nominal panel-lined volume** before mechanisms/dividers. These are not net usable-capacity claims. Cabinet tops stay 50 mm below the indicative beam soffit. Cosmetic ceiling bands are removed; the loft tops remain visible. Bedroom 3 uses a continuous 90° L carcass without a solid corner filler.

[Interior image register](../../interiors/IMAGE_REVIEW.md). Cabinet geometry, finishes and height/capacity basis are coordinated through `model/src/storage-layout.json` (repository-relative path). Furniture-supplier checks remain required for hinges, corner access, lift mechanisms, ventilation, fixings and measured site dimensions. Gross floor areas and bedroom/bed footprints are unchanged. The study/stair partition is removed while retaining the beam and stair structure; the study zone becomes 2.950 × 2.130 m and gains 0.4425 m² (4.76 sq ft) of clear floor area. Three sewing stations use two compact benches, with a 650 mm aisle between occupied chair footprints and 2500 mm clear at the stair connection beside the cabinet. Final machine and chair dimensions require supplier coordination.

R17 aligns connected internal walls and rear pier caps to common finished faces, at **150 mm total including plaster**. The central spine is x = 3.10–3.25 on both floors; bedroom and bathroom front walls share y = 6.10–6.25. The upstairs passage remains 900 mm. Southwest bedrooms are 2.950 × 3.300 m; Bedroom 3 is 2.580 × 3.575 m. Each ensuite is 1.215 × 2.100 m, with a 900 mm shower zone and 600 mm walk-in entry and a maximum installed WC projection of 550 mm (665 mm clear in front). Bedroom 3 uses a surface-sliding ensuite door. The rear work counter is 450 mm deep, leaving an 820 mm aisle.

Gross covered areas remain **638.34 sq ft ground + 629.84 sq ft first = 1,268.19 sq ft** (total calculated before rounding each floor). Including the 97.09 sq ft roof enclosure, the total is **1,365.28 sq ft**. Room clear areas and named-zone totals are derived from the new wall faces in `dimensions.json`; they exclude wall bands/door reveals and include stairs/covered outdoor zones, so they are not statutory carpet areas.

These are compact single-user clearances. The [NKBA planning guide](https://media.nkba.org/uploads/2022/05/Bath-Planning-Guidelines.pdf) recommends larger fixture-front space (762 mm); this layout provides 665 mm at the WCs and is not full NKBA or universal-access compliance. A [540 mm compact WC example](https://www.uk.roca.com/products/vitreous-china-wall-hung-rimless-wc-34647L..0?sku=A34647L000) shows the intended fixture class, not a selected product. Verify the complete installed projection, carrier/cistern and tile build-up without consuming the published clearances. No structural member has been reduced to conceal a projection: grid B/pier finishes and the revised rear cross-beam need engineering coordination. Directions and the exterior envelope are preserved; complete Vastu compliance is not certified.

This folder contains the published **R19** architectural review set. R14 moved the under-stair TV joinery out of the stair-side wall line and into the bay under the lower/west flight: a 2.25 × 0.35 m unit at x = 0.69–1.04, y = 3.20–5.45, facing east and read from the living room through the retained 2.00 m headed opening. R15 then brings the washbasin into that same bay, continuing the run past its end bay to the bedroom wall as a 0.62 × 0.35 m vanity at y = 5.48–6.10 on the same face plane, divided from the joinery by a full-height oak fin. Sheet 03 shows the run in plan; sheet 07 sections it, and the upper-flight bay it vacated is now drawn empty. The stair, landings, trimmer, supports, the +2.10 m wall opening with its retained plastered header and the 0.90 m archway retain their heights and clearances; R16 widens the finished header toward living.

## Retained deliverables

- `Hensal_Complete_House_Plans.pdf`: combined 12-sheet A3 review package.
- `index.html`: self-contained plan gallery with PDF download.
- `interactive-3d.html`: published offline house explorer.
- Numbered PNG/SVG exports: the individual sheets used by the gallery and model.
- `dimensions.json`: the published dimensional data.
- `exterior-concept.png`: retained exterior appearance reference.

The sheet set covers the site, ground and first floors, roof access, elevations, stair geometry, conceptual structural framing, roof setbacks, original style references and exterior appearance. Print at A3 actual size when using the scales marked on the sheets.

## Rebuild sources

`.source/make_complete_plans.py` generates the combined package with Python, ReportLab and PyMuPDF. The other drawing modules are dependencies of that generator; do not run them independently to replace the published set. `.source/inputs/` retains original user drawings and references. The saved exterior image is reused without making an image-generation request.

Supplementary R11–R13 study sheets and all revision changelogs have been removed. The original inputs and modules required to rebuild the retained package remain.

## Design scope

The dimensioned drawings govern the architectural review; rendered images illustrate appearance. The retained header above the living/stair opening runs from +2.10 m to the +2.85 m slab soffit. The current interior images retain this header and do not specify a full-height wall removal; they are the R14 render set and still show the basin in its former corner position.

The package is a design-review set, not a signed construction or permit set. Structural detailing, site set-out, waterproofing and services remain subject to professional coordination.
