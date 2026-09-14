# Interior image register

**R14 was visually approved by the user on 14 September 2026.** The [current offline review](R14-review.html) contains three direct model renders.

| Image | Purpose |
|---|---|
| `images/R14-living-room-eye.png` | Living-room composition with the actual room walls and retained header |
| `images/R14-joinery-close.png` | Close view of the approved TV joinery beneath the lower flight |
| `images/R14-geometry-in-stair.png` | Isolated geometry inspection with the retained header outlined |

Both eye-level views pass the four-corner TV visibility check. The inspection view exposes the geometry by omitting room walls; part of the screen is obscured from that elevated camera. [Review notes](R14-review.md) record the checks and reproduction commands.

## Published-plan image baseline

The published drawing set remains R13. Its images below remain relevant to that package, while R14 is the latest approved joinery direction:

- `images/02-living-wide.png`
- `images/03-stair-tv-wide.png`
- `images/04-storage-wide.png`
- `images/05-wash-wide.png`
- `images/R13-living-room-eye.png`

The other 22 room images remain in use: entrance, kitchen, bedrooms, study, passage, bathrooms, balconies, terrace, dining and front gallery. They are illustrative room images; the dimensioned architectural set governs their stated scope.

`.source/image-inventory.json`, `.source/image-release.json` and `.source/selected-wide.json` retain the numbered room-image inventory and review metadata used by the image-book tools. Those records have not been promoted to a coordinated R14 publication. Current render verification lives in `model/qa/R14-visual-audit.json` (project-relative).

Superseded R6/R12 generation jobs, supplementary revision sheets and old revision screenshots have been removed. Original source references and the current image-processing tools remain.
