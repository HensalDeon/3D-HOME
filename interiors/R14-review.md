# R14 interior presentation — kitchen-matched finish

The living, stair-TV and storage images were rebuilt on 15 September 2026 using the original kitchen wide and detail images as the primary style references. The approved R14 layout and cameras were supplied through the saved direct model renders. All three final PNGs are 1536 × 1024.

| Presentation | Preserved geometry reference |
|---|---|
| [Living-room view](images/02-living-wide.png) | [.source/style-revision-2026-09-15/geometry/02-living-wide.png](.source/style-revision-2026-09-15/geometry/02-living-wide.png) |
| [Stair and TV](images/03-stair-tv-wide.png) | [.source/style-revision-2026-09-15/geometry/03-stair-tv-wide.png](.source/style-revision-2026-09-15/geometry/03-stair-tv-wide.png) |
| [Storage detail](images/04-storage-wide.png) | [.source/style-revision-2026-09-15/geometry/04-storage-wide.png](.source/style-revision-2026-09-15/geometry/04-storage-wide.png) |

## Finish and method

The built-in image-generation tool applied muted fine-grained oak, warm ivory plaster, sandy stone, quiet greige cabinet fronts, soft daylight and controlled warm lighting. The first finished living image also served as a consistency reference for the closer views. The current selected backing remains flat oak, with the source model’s four-front cabinet and shelving profiles.

These are generated presentation images. Visual review checked the stair route and silhouette, landings and header, door and window openings, TV and cabinetry arrangement, shelves and separate basin nook against the geometry references. This is not a pixel-exact or dimensional certification. The model and drawings govern measured geometry. User approval of the final finishes is pending.

## Reference package

- [Visual style board](STYLE_REFERENCE.html): original photographs, palette and room examples.
- [Style brief](STYLE_REFERENCE.md): material rules, lighting, room variations, reusable prompt and review criteria.
- [.source/house-style.json](.source/house-style.json): 22 original style-reference images, their roles and SHA-256 hashes; approximate palette swatches.
- [.source/style-revision-2026-09-15/prompts.json](.source/style-revision-2026-09-15/prompts.json): exact prompts and input roles.
- [.source/style-revision-2026-09-15/audit.json](.source/style-revision-2026-09-15/audit.json): final hashes, dimensions, visual review and unchanged-source verification.

## Rebuild the pages

From the project root:

```sh
python3 interiors/.source/build_style_reference.py
node model/scripts/r14-review-page.mjs
```

The review page embeds the three canonical PNGs for offline viewing. Keep `STYLE_REFERENCE.html` with its neighboring `images/` folder; the reference board displays the original files directly and does not alter their pixels.

## Geometry sources and earlier workflow

The earlier direct-render audit in `model/qa/interior-render-audit.json` describes the saved geometry-reference renders, not the current generated presentation pixels. The exporter and Blender script remain available for new geometry references:

```sh
node model/scripts/export-interior.mjs
blender --background --python interiors/.source/render_interior.py
```

Their outputs stay in `.source/render/`. The legacy promotion script now stops before overwriting the selected generated presentations. Follow the style brief for any future final-image replacement. The older `04-storage-wide-imagegen.png` is superseded by the canonical `04-storage-wide.png`.

The architecture, drawings, published PDF and standalone model were not changed by this finish revision.
