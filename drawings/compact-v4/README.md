# Hensal — coordinated house plans

This folder contains the published **R13** architectural review set. The approved **R14** under-stair TV joinery is shown in the [current interior review](../../interiors/R14-review.html); it has not yet been propagated into these drawings or the standalone explorer.

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

The dimensioned drawings govern the architectural review; rendered images illustrate appearance. The retained header above the living/stair opening runs from +2.10 m to the +2.85 m slab soffit. The R14 inspection view outlines this header to reveal the furniture fit; it does not specify a full-height wall removal.

The package is a design-review set, not a signed construction or permit set. Structural detailing, site set-out, waterproofing and services remain subject to professional coordination.
