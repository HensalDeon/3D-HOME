# Hensal House Explorer

R17 aligns connected internal walls and rear pier caps to common finished faces, at **150 mm total including plaster**. The central spine is x = 3.10–3.25 on both floors; bedroom and bathroom front walls share y = 6.10–6.25. The upstairs passage remains 900 mm. Southwest bedrooms are 2.950 × 3.300 m; Bedroom 3 is 2.580 × 3.575 m. Each ensuite is 1.215 × 2.100 m, with a 900 mm shower zone and 600 mm walk-in entry and a maximum installed WC projection of 550 mm (665 mm clear in front). Bedroom 3 uses a surface-sliding ensuite door. The rear work counter is 450 mm deep, leaving an 820 mm aisle.

Gross covered areas remain **638.34 sq ft ground + 629.84 sq ft first = 1,268.19 sq ft** (total calculated before rounding each floor). Including the 97.09 sq ft roof enclosure, the total is **1,365.28 sq ft**. Room clear areas and named-zone totals are derived from the new wall faces in `dimensions.json`; they exclude wall bands/door reveals and include stairs/covered outdoor zones, so they are not statutory carpet areas.

These are compact single-user clearances. The [NKBA planning guide](https://media.nkba.org/uploads/2022/05/Bath-Planning-Guidelines.pdf) recommends larger fixture-front space (762 mm); this layout provides 665 mm at the WCs and is not full NKBA or universal-access compliance. A [540 mm compact WC example](https://www.uk.roca.com/products/vitreous-china-wall-hung-rimless-wc-34647L..0?sku=A34647L000) shows the intended fixture class, not a selected product. Verify the complete installed projection, carrier/cistern and tile build-up without consuming the published clearances. No structural member has been reduced to conceal a projection: grid B/pier finishes and the revised rear cross-beam need engineering coordination. Directions and the exterior envelope are preserved; complete Vastu compliance is not certified.

The design of record is **R17**: the fitted TV joinery beneath the lower stair flight, with the washbasin continuing that same run to the bedroom wall. Open the [current interior review](interiors/R14-review.html) for the living-room view, stair/TV composition and storage detail. The page embeds its images and works offline.

The TV unit has a 2.25 m long, 350 mm deep cabinet with its top 450 mm above finished floor. A 30 mm oak backing follows the actual stair underside with a modeled minimum 60 mm vertical gap. The 960 × 540 mm screen has its centre 870 mm above finished floor. The staircase keeps its geometry; the retained header keeps its height and becomes 150 mm finished in thickness. R15 brings the washbasin into the same band rather than leaving it in the corner: a 0.62 × 0.35 m vanity at x = 0.69–1.04, y = 5.48–6.10, on the same depth and the same face plane at x = 1.04 and facing the same way, so the under-stair volume reads as one continuous 2.90 m fitted run. A full-height oak fin at y = 5.45–5.48 separates the wet zone from the joinery. Rim, mirror, standing zone and the 0.90 m archway are unchanged, and clear height becomes a uniform 1.95 m.

**R17 is propagated through the drawing and model outputs.** The 12-sheet PDF, the plan gallery, `dimensions.json` and the standalone explorer all carry the joinery and the basin in the lower-flight bay. Model and drawings read the same published geometry in `model/src/under-stair-layout.json`, and the model checks its backing profile against the real stair meshes as it builds, so the two cannot drift apart again.

- [Interior review](interiors/R14-review.html) and [verification notes](interiors/R14-review.md) — these renders are the R14 set and still show the basin in its old corner position; the drawings and model are at R17; existing QA captures document R15
- [Published interactive house explorer](drawings/compact-v4/interactive-3d.html)
- [Plan gallery](drawings/compact-v4/index.html) and [complete plans PDF](drawings/compact-v4/Hensal_Complete_House_Plans.pdf)
- [Model source and rebuild instructions](model/README.md)
- [Interior image register](interiors/IMAGE_REVIEW.md)

The wall above the living/stair opening remains a plastered header from +2.10 m to the +2.85 m slab soffit. The photographic views retain the actual wall and header. Structural massing and fit checks are conceptual, not construction detailing.

Superseded changelogs, supplementary revision studies, old screenshots and the duplicate baseline application have been removed. Original inputs, rebuild dependencies and the three fixtures required by architectural preservation tests are retained.
