# Hensal House — interior visual style reference

Established from the original room images on 15 September 2026, following the user's request to retain their color theme and photographic realism throughout the house.

Open the [visual reference board](STYLE_REFERENCE.html) for the photographs, palette, and room examples together. The [image register](IMAGE_REVIEW.md) links the current room photographs and records their status.

## Governing references

1. [Kitchen wide](images/06-kitchen-wide.png) governs overall daylight, exposure, muted oak, creamy paint, pale stone, and black accents.
2. [Kitchen detail](images/06-kitchen-detail.png) governs wood-grain scale, stone texture, ceramic and metal response, and concealed task lighting.
3. [Dining](images/16-dining-wide.png) governs the wider living-area atmosphere, upholstery, timber furniture, and gentle floor reflections.
4. The bedroom, bathroom, study, and gallery originals demonstrate how the same palette carries between rooms. Their image roles are recorded in [the source manifest](.source/house-style.json).
5. For the living photograph, the user's explicit 8 October selection makes [ground-floor overview](images/02-ground-floor-overview-wide.png) the reference for staircase tread/support/handrail appearance and the rectangular six-seater dining set. The accepted square-on living wall and rear passage remain the framing/layout reference. This is a photographic presentation preference; the measured model and drawings still govern construction geometry.
6. For bedroom flooring, the user's explicit 8 October selection makes [Bedroom 1 wide](images/07-bedroom1-wide.png) the finish reference: light oak wood-look planks, fine grain, narrow joints and staggered ends. Apply this appearance inside the bedroom; retain pale stone beyond its doorway. This visual reference does not establish a tile manufacturer or whether the photographed material is timber or ceramic.
7. The 9 October Bedroom 1 wide view replaces its old camera and small rear opening, using the current model guide. Its plank finish is carried forward from the preceding photo at `abe0fd7`; that historical photo remains the source for the 8 October floor edit records. Other bedroom wide views guide photographic composition, not Bedroom 1's architecture. Rear exterior views use the same enlarged opening as the drawing schedule.

These references govern finishes and photographic appearance. The current approved model and its camera references govern layout, with the user's specific living staircase/dining presentation selection above applied to those photographed elements. Other older photographs can contain superseded architecture; copying their stairs, doors, furniture positions, or room dimensions is not part of a general style match.

## Palette and materials

The hexadecimal values below are approximate visual communication swatches, chosen by eye. They are not sampled paint specifications, manufacturer matches, or linear rendering material values. The original photographs remain the color reference.

| Element | Visual swatch | Required appearance |
|---|---|---|
| Walls / ceiling | Warm ivory `#E7DECE` | Creamy off-white plaster; light, subtly textured, with neutral highlights |
| Common-area floors / stairs / counters | Sandy stone `#CEC0A8` | Pale beige mineral variation, fine joints, restrained satin reflections |
| Bedroom floor | Bedroom 1 wide photograph | Light oak wood-look plank appearance, subtle grain, narrow staggered joints and low sheen; cream skirting retained |
| Cabinet fronts | Warm greige `#C4B69F` | Quiet matte finish with clean reveals |
| Timber | Muted oak `#AE916B` | Natural light-to-medium oak, fine grain and modest board variation |
| Linen / upholstery | Oatmeal `#D9CDB9` | Visible weave, soft folds, matte surfaces |
| Hardware / window frames | Charcoal `#30302B` | Small dark accents with believable edge highlights |
| Bedroom 1 / study accents | Sage `#8B9078` | Muted textile and foliage accents |
| Master bedroom accents | Olive `#79765A` | Restrained cushions, throws, and artwork |
| Bedroom 3 accents | Clay `#B07D60` | Small terracotta textile accents |

Wood must not become orange, glossy, heavily knotted, or dominated by repeated oversized grain. Stone must not become blank plastic, glittery marble, or heavily veined luxury cladding. Keep the difference between matte plaster, satin stone, timber, glass, metal, and ceramic visible.

Fluting is a local joinery treatment visible in the user's earlier stair/TV references, not a pattern to apply to every timber surface. Preserve the selected joinery design. The current R14 geometry references have flat oak backing and four greige cabinet fronts; this finish pass retains those profiles.

## Lighting and photographic treatment

- Use daylight from the room's existing openings. Preserve the same apparent time of day between views of one room.
- Balance warm practical lighting with daylight so white surfaces retain creamy neutral highlights.
- Aim for the appearance of gentle 2700–3000 K practical lighting; this is a suggested rendering target, not a measured property of the reference photographs.
- Conceal and diffuse LED sources. Light should fall onto adjacent materials with a soft gradient, with no clipped neon outlines or orange wash over the room.
- Show plausible shadow direction, soft shadow edges, contact shadows, reflected light, and controlled reflections in glass and screens.
- Preserve the approved camera and room scale. Wide views explain the space; detail views show materials and joinery. Do not invent visible furniture just to fill a crop.
- Use straight architectural verticals, natural contrast, and fine surface detail. Avoid fisheye distortion, artificial blur, excessive sharpening, sepia grading, and smooth game-engine surfaces.
- Retain existing plants, textiles, books, ceramics, and everyday details. New staging must not block circulation or disguise geometry errors.

## Room-by-room continuity

| Original images | Shared cues / room variation |
|---|---|
| `01-entrance-wide` | Warm timber, ivory walls, charcoal facade and frames, sandy steps, woven chairs, tropical greenery; evening light is an exterior variation |
| `06-kitchen-wide`, `06-kitchen-detail`, `06-kitchen-opposite` | Primary oak/ivory/stone palette; restrained black fittings; natural plants, ceramics and woven runner; warm task light |
| `07-bedroom1-wide`, `07-bedroom1-detail`, `07-bedroom1-opposite` | Light oak wood-look bedroom flooring; oatmeal upholstery, textured cream linen, sage accents, linen blind |
| `08-bedroom2-wide`, `08-bedroom2-detail`, `08-bedroom2-opposite` | Same base palette; olive throw and cushion, woven runner, simple oak bedside furniture |
| `09-bedroom3-wide`, `09-bedroom3-detail`, `09-bedroom3-opposite` | Same base palette; clay cushion, matte ivory wardrobe with fine-grained oak accent bay and recessed charcoal pulls |
| `10-study-wide`, `10-study-storage` | Retained family/tailoring workspace; ivory shared cabinet, natural oak, soft tropical daylight |
| `10-passage-wide`, `17-front-gallery-wide` | Light walls and floor, oak and charcoal edges, restrained framed art, daylight and greenery |
| `11-bathroom1-wide`, `12-bathroom2-wide`, `13-bathroom3-wide` | Pale stone tiles, oak vanity, white sanitaryware, dark fittings, soft mirror glow and textured towels |
| `14-balcony-wide`, `15-terrace-wide` | Same pale surfaces, natural timber/woven seating and tropical context; terrace daylight is cooler and brighter |

`05-wash-wide.png` is an earlier geometry-led revision and is not a primary photographic benchmark. Rejected direct renders are excluded from the style-reference library. Their inclusion in the working image folder does not make them style authorities.

## Reusable generation brief

> Edit the supplied approved geometry view into a convincing interior photograph of the same house as the original kitchen wide and kitchen detail references. The geometry image governs camera, stair route, treads, landings, slab/header profiles, openings, fixture positions, cabinetry, shelving, clearances and room proportions. The kitchen photographs govern muted natural oak, creamy off-white plaster, pale sandy stone, quiet greige fronts, restrained charcoal hardware, subtle material texture, soft daylight and warm diffused practical light. Preserve the selected joinery profiles. Retain fine grain, mineral variation, contact shadows, ceramic and glass reflections, natural contrast and straight verticals. Keep neighboring views consistent in materials and time of day. Do not invent openings, furniture, fluting, extra stairs or new light fittings. No orange wood, coarse repeated grain, glowing neon edges, plastic surfaces, enlarged rooms, illustration, labels or watermark.

For another angle of the same room, also supply the first successful finished view as a consistency reference, while retaining that angle's own geometry image as the camera authority.
For bedroom floor revisions, explicitly supply `07-bedroom1-wide.png` as the floor authority. Its wood-look planks take precedence over the kitchen's stone floor inside the bedroom; the kitchen originals continue to govern overall palette and realism.

## Review before replacing an image

1. Compare the candidate beside both kitchen references at the same display size: oak saturation, ivory/stone separation, grain scale, LED brightness, and photographic detail.
2. Compare it with its saved geometry view: stair silhouette and route, landings, header, openings, TV location, cabinet divisions, shelves, basin and circulation.
3. Compare all views of that room together. Material colors, profiles and fixtures must agree. Correct a drifting view rather than adopting its mistake in the other views.
4. Preserve the geometry source, exact prompts, reference-image hashes, output hashes and review notes. Verify unrelated model files and original room images are unchanged.
5. Record generated presentation imagery accurately. Visual review is not proof of pixel-exact dimensions or user approval of the finished image; the model governs measured geometry.

## Current application

The 9 October camera/window update uses a new current-model Bedroom 1 guide and retains the same-room sage/ivory/oak finish. Its 1200 × 1200 mm rear opening is coordinated in the drawing/model sources and two rear exterior photographs. Exact built-in prompts, current geometry/camera audit and source/output hashes are under `bedroom1_window_camera_generation_history` in [image-release.json](.source/image-release.json). Previous camera/window and floor-reference photos remain recoverable from `abe0fd7`.

The 8 October bedroom floor edits match `07-bedroom1-opposite.png`, `08-bedroom2-opposite.png` and `09-bedroom3-wide.png` to the unchanged Bedroom 1 wide reference. Only exposed bedroom flooring changes; the door sightlines, storage, right-angle wardrobe corner, rugs, skirting and common-area stone are retained. Exact built-in prompts, source roles/hashes and reviews are consolidated under `bedroom_floor_generation_history` in [image-release.json](.source/image-release.json). Previous photos are recoverable from `00d26d1`; measured model/drawing files and areas are unchanged.

The earlier three R14 replacements used the built-in image-generation tool. Exact prompts are saved in [prompts.json](.source/style-revision-2026-09-15/prompts.json); the original R14 geometry views are preserved in [.source/style-revision-2026-09-15/geometry/](.source/style-revision-2026-09-15/geometry/). The [revision audit](.source/style-revision-2026-09-15/audit.json) records outputs and unchanged source files. The original references remain the style authority for future revisions.

R18 updates the bedroom wardrobe views and adds a shared-cabinet close view. Those revised photographs are finish examples, rather than original geometry references. The original kitchen wide/detail remain unchanged and govern visual style. Exact R18 prompts, input roles/hashes and camera records are consolidated in [image-release.json](.source/image-release.json). Bulky working images were removed at user request; historical inputs remain recoverable from Git commit `0333b6d`.

R19 opens the first-floor stair side and corrects the passage, master doorway and study nib. Their native model camera references are retained in `.source/geometry/`, with exact prompts and hashes in the release manifest. Earlier R18 photo targets are recoverable from commit `65c5704`. The original kitchen images continue to govern finishes.

The user selected the earlier photographic staircase appearance for the R19 passage, while keeping its revised study end. The measured stair treads and waist profile are unchanged in the plan/model; the photograph remains an illustrative presentation. This preference is recorded in the release manifest.

After the user rejected the oblique living edits for wall and rear-route positioning, the living photograph was rebuilt directly from a new square-on current-model camera. That native view continues to govern its framing, front wall, perpendicular return and far rear-work door. The original kitchen references continue to govern photographic finishes; the later stair/dining selection below governs those presentation elements. The overview retains its earlier composition and footprint-reference role. Exact prompts, camera verification, user feedback and input/output hashes are recorded under `wall_corner_generation_history` in the release manifest. Earlier living-photo audits and camera records are historical; rejected inputs are recoverable from `7b52dc7`.

The user accepted that wall/passage and requested the overview's staircase/support design and six-seater dining furniture. The latest living edit applies those selected photographic elements while retaining the accepted frontage, rear route and camera. The native guide remains the wall/camera reference; it is not the authority for the selected stair appearance or dining set. Exact prompt, source roles/hashes and scoped approval are recorded under `living_fixture_generation_history` in the release manifest. The preceding accepted wall/passage photograph is recoverable from `9c3f2f8`.
