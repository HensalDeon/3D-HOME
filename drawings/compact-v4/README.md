# Hensal — coordinated house plans

R17 aligns connected internal walls and rear pier caps to common finished faces, at **150 mm total including plaster**. The central spine is x = 3.10–3.25 on both floors; bedroom and bathroom front walls share y = 6.10–6.25. The upstairs passage remains 900 mm. Southwest bedrooms are 2.950 × 3.300 m; Bedroom 3 is 2.580 × 3.575 m. Each ensuite is 1.215 × 2.100 m, with a 900 mm shower zone and 600 mm walk-in entry and a maximum installed WC projection of 550 mm (665 mm clear in front). Bedroom 3 uses a surface-sliding ensuite door. The rear work counter is 450 mm deep, leaving an 820 mm aisle.

Gross covered areas remain **638.34 sq ft ground + 629.84 sq ft first = 1,268.19 sq ft** (total calculated before rounding each floor). Including the 97.09 sq ft roof enclosure, the total is **1,365.28 sq ft**. Room clear areas and named-zone totals are derived from the new wall faces in `dimensions.json`; they exclude wall bands/door reveals and include stairs/covered outdoor zones, so they are not statutory carpet areas.

These are compact single-user clearances. The [NKBA planning guide](https://media.nkba.org/uploads/2022/05/Bath-Planning-Guidelines.pdf) recommends larger fixture-front space (762 mm); this layout provides 665 mm at the WCs and is not full NKBA or universal-access compliance. A [540 mm compact WC example](https://www.uk.roca.com/products/vitreous-china-wall-hung-rimless-wc-34647L..0?sku=A34647L000) shows the intended fixture class, not a selected product. Verify the complete installed projection, carrier/cistern and tile build-up without consuming the published clearances. No structural member has been reduced to conceal a projection: grid B/pier finishes and the revised rear cross-beam need engineering coordination. Directions and the exterior envelope are preserved; complete Vastu compliance is not certified.

This folder contains the published **R17** architectural review set. R14 moved the under-stair TV joinery out of the stair-side wall line and into the bay under the lower/west flight: a 2.25 × 0.35 m unit at x = 0.69–1.04, y = 3.20–5.45, facing east and read from the living room through the retained 2.00 m headed opening. R15 then brings the washbasin into that same bay, continuing the run past its end bay to the bedroom wall as a 0.62 × 0.35 m vanity at y = 5.48–6.10 on the same face plane, divided from the joinery by a full-height oak fin. Sheet 03 shows the run in plan; sheet 07 sections it, and the upper-flight bay it vacated is now drawn empty. The stair, landings, trimmer, supports, the +2.10 m wall opening with its retained plastered header and the 0.90 m archway retain their heights and clearances; R16 widens the finished header toward living.

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
