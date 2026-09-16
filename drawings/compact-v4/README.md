# Hensal — coordinated house plans

This folder contains the published **R14** architectural review set. R14 moves the under-stair TV joinery out of the stair-side wall line and into the bay under the lower/west flight: a 2.25 × 0.35 m unit at x = 0.69–1.04, y = 3.20–5.45, facing east and read from the living room through the retained 2.00 m headed opening. Sheet 03 shows it in plan; sheet 07 sections it in its own bay. The stair, landings, trimmer, supports, the +2.10 m wall opening with its retained plastered header, and the washbasin nook are all unchanged.

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

The dimensioned drawings govern the architectural review; rendered images illustrate appearance. The retained header above the living/stair opening runs from +2.10 m to the +2.85 m slab soffit. The current R14 interior images retain this header and do not specify a full-height wall removal.

The package is a design-review set, not a signed construction or permit set. Structural detailing, site set-out, waterproofing and services remain subject to professional coordination.
