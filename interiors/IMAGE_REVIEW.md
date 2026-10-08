# Interior image register

## Current bedroom and shared storage presentation · R18

Six views were revised or added on 8 October 2026. All cupboards stop at 2500 mm, with 400 mm storage lofts above the 2100 mm main units and open space above. Cosmetic ceiling bands are removed. Bedroom 3 has a connected 90° L carcass without a solid corner filler; its wide camera now shows both perpendicular door faces.

| Image | Role |
|---|---|
| `images/07-bedroom1-opposite.png` | Bedroom 1 fitted wardrobe, loft and closed storage bed |
| `images/08-bedroom2-opposite.png` | Master fitted wardrobe; retained common passage view |
| `images/09-bedroom3-wide.png` | Corrected right-angle L corner and lofts |
| `images/09-bedroom3-detail.png` | Closed paired-door corner detail |
| `images/09-bedroom3-opposite.png` | Local ivory finish update to the visible wardrobe edge |
| `images/10-study-storage.png` | Revised open family/tailoring room with side linen cabinet |

The measured model governs geometry. Finished photos use built-in imagegen with the original kitchen wide/detail as explicit style references. The opposite Bedroom 3 view is a limited finish edit to its existing composition. Assistant visual review is complete; user acceptance of these finished views is pending. The study/stair partition is removed below the retained beam. The 750 × 450 mm cabinet is tucked beside the tailoring benches, keeping the stair connection open. The 27 unrelated existing images, including the kitchen references and tailoring-room wide view, retain their baseline hashes.

- [Canonical image and release manifest](.source/image-release.json): exact prompts, input roles/hashes, current image hashes and historical camera/source records.
- [Measured storage layout](../model/src/storage-layout.json) and [stair/TV/basin layout](../model/src/under-stair-layout.json): authoritative geometry used by model and drawings.
- [Live style reference board](STYLE_REFERENCE.html).

Duplicate review pages and bulky working candidates were removed at the user's request. Historical source images remain recoverable from Git commit `0333b6d`.

Loft capacity is 1.210 m³ gross external volume before panels/hardware. Bed capacity is 1.415 m³ nominal panel-lined cavity before lift mechanisms/dividers. Supplier details must establish usable capacity, hinges, corner access, fixings and ventilation. Floor area remains 1365.28 sq ft including the roof enclosure.

## Earlier living / stair / storage presentation · R14

The three canonical files were revised on 15 September 2026 to follow the original kitchen photographs’ muted oak, creamy ivory, pale stone and natural photographic lighting.

| Image | Role |
|---|---|
| `images/02-living-wide.png` | View from the approved living-room camera |
| `images/03-stair-tv-wide.png` | Closer stair, TV cabinet, shelves and separate basin composition |
| `images/04-storage-wide.png` | Tight view of the low cabinet, backing and open shelves |

All three are reference-guided generated presentations made with the built-in image-generation tool. Their original direct R14 renders are retained in `.source/style-revision-2026-09-15/geometry/` as the layout and camera references. The unchanged model governs measured geometry; visual comparison of the generated images does not certify pixel-exact dimensions.

The user requested the house’s original photographic style. Assistant visual review is complete; user approval of these finished images is pending. Superseded review-page screenshots and the redundant R14 review notes were removed during cleanup.

- [Visual style board](STYLE_REFERENCE.html)
- [Style rules and reusable brief](STYLE_REFERENCE.md)
- [Exact generation prompts](.source/style-revision-2026-09-15/prompts.json)
- [Output hashes and unchanged-source audit](.source/style-revision-2026-09-15/audit.json)

The other room images and all model source files were left unchanged. `.source/image-inventory.json` and `.source/image-release.json` record the new image hashes and review status. `.source/selected-wide.json` continues to use the canonical numbered filenames.

## Bedroom doorway correction · 8 October 2026

The grey strip in the master-bedroom entrance came from a conceptual landing-support mesh extending across the door. Its footprint now ends at the stair landing edge x = 2.05 on both floors; the main frame, treads and areas are unchanged. The corrected master photograph uses the unobstructed current-model sightline. End bearing and reinforcement remain a structural-design coordination item. Exact edit prompt and source hashes are in the release manifest; user acceptance of the finished image remains pending.
