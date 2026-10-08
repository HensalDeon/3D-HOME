# Interior image register

The [two-minute interior video](Hensal_Interior_Tour.mp4) presents 22 current photographs in house-tour order, at 1920 × 1080 and 24 fps. It uses gentle fitted-image motion, 0.75-second dissolves and room captions, with no audio. The export includes the rebuilt living-room view with a square-on frontage and visible rear route. [Video timings and source hashes](.source/video-tour.json) and [the rebuild script](.source/build_video.py) keep this export reproducible without retaining temporary frames.

## Bedroom / bathroom wall corner · 8 October 2026

The user accepted the straight living wall and rear passage, then selected [ground-floor overview](images/02-ground-floor-overview-wide.png) as the reference for staircase steps/upper support and the six-seater dining set. [Living room](images/02-living-wide.png) now uses that continuous inclined stair-support profile, oak/charcoal railing, rectangular oak table and six matching chairs, while retaining the accepted frontage, route and camera. The overview itself is unchanged. Exact prompt and source roles/hashes are under `living_fixture_generation_history` in [the release manifest](.source/image-release.json). The native guide remains the frontage/camera reference; the stair and furniture appearance follows the explicit photographic preference. Assistant visual review passed; user acceptance of this fixture edit is pending.

[Living room](images/02-living-wide.png) is rebuilt from a current-model camera facing the bedroom/ensuite frontage squarely. Its doorway, ceiling junction and skirting now read horizontally along one flat wall. At the bathroom corner, a narrow perpendicular return leads into the 1.165 m clear rear route, which runs 2.25 m to the work-area door. The view through that door shows the covered utility-room wall. The original kitchen palette remains the finish reference.

The user rejected the earlier living edits for tilted frontage and incorrect rear-route positioning. Those rejected photographs and the prior oblique camera remain recoverable from `92f83e5` and `7b52dc7`; their feedback is recorded in the release manifest. This replacement uses the native model as the photographic base instead of retaining the rejected image composition. The measured stair/header, TV/basin bay and furnishings are seen from the new camera. [Ground-floor overview](images/02-ground-floor-overview-wide.png) is unchanged in this follow-up.

The measured plan/model already contained this orthogonal L-shaped boundary, so dimensions and gross area remain unchanged. The new living geometry/camera view is retained in `.source/geometry/02-living-wide.png`, with numerical verification that its front wall projects horizontally. The overview geometry view remains a footprint reference for its earlier photograph. Exact built-in imagegen prompts, input roles/hashes, camera records, user feedback and output hashes are under `wall_corner_generation_history` in [the release manifest](.source/image-release.json). The projection verification applies to the native model guide; the finished photo remains illustrative. The user accepted this wall/passage; that preceding photograph is recoverable from `9c3f2f8`. The other 32 canonical room images retain their `9c3f2f8` hashes.

## Open stair passage and corrected views · R19

The first-floor stair-side partition is open below the retained 2550–2850 mm overhead band. Guards occupy the former wall band, keeping the 900 mm design passage clear. Actual stair treads, landings, main frame and roof enclosure retain their geometry; the gross total remains **1365.28 sq ft**.

| Image | Correction |
|---|---|
| [Study / storage](images/10-study-storage.png) | Removed the partition nib that looked like a pillar; left sewing bench is unobstructed |
| [Passage](images/10-passage-wide.png) | Previous photographic staircase/railings retained at user request; corrected distant tailoring room |
| [Bedroom 2 / opposite](images/08-bedroom2-opposite.png) | Doorway looks down the actual passage with stair guards and the distant study |

These are built-in imagegen presentations reviewed with the actual model camera exports in `.source/geometry/`. The passage keeps the earlier photographic staircase appearance at the user’s request; its stair silhouette is illustrative. Measured stair geometry remains in the PDF/model. The original kitchen wide/detail remain the finish references. Exact prompts, input roles/hashes, camera records and final hashes are in [the release manifest](.source/image-release.json). Assistant visual review is complete; user acceptance of the new photographs is pending. The other 30 canonical room images retain their dev-baseline hashes. Earlier R18 entries below describe the retained storage design; R19 supersedes its study and master doorway photographs.

[Stair/passage layout](../model/src/stair-passage-layout.json) governs the measured opening and guards. Support, guard loads, fixings and rail connections require engineering coordination. Superseded R18 photographs and geometry are recoverable from commit `65c5704`; no bulky working revision folder is needed.

## Bedroom and shared storage design · R18

Six views were revised or added on 8 October 2026. All cupboards stop at 2500 mm, with 400 mm storage lofts above the 2100 mm main units and open space above. Cosmetic ceiling bands are removed. Bedroom 3 has a connected 90° L carcass without a solid corner filler; its wide camera now shows both perpendicular door faces.

| Image | Role |
|---|---|
| `images/07-bedroom1-opposite.png` | Bedroom 1 fitted wardrobe, loft and closed storage bed |
| `images/08-bedroom2-opposite.png` | Master fitted wardrobe; retained common passage view |
| `images/09-bedroom3-wide.png` | Corrected right-angle L corner and lofts |
| `images/09-bedroom3-detail.png` | Closed paired-door corner detail |
| `images/09-bedroom3-opposite.png` | Local ivory finish update to the visible wardrobe edge |
| `images/10-study-storage.png` | Revised open family/tailoring room with side linen cabinet |

The measured model governs geometry. Finished photos use built-in imagegen with the original kitchen wide/detail as explicit style references. The opposite Bedroom 3 view is a limited finish edit to its existing composition. Assistant visual review is complete; user acceptance of these finished views is pending. The study/stair partition is removed below the retained beam. The 750 × 450 mm cabinet is tucked beside the tailoring benches, keeping the stair connection open. The kitchen references and tailoring-room wide view retain their baseline hashes; the R19 passage/view corrections above are recorded separately.

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
