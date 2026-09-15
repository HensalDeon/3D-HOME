# Hensal House — interior visual style reference

Established from the original room images on 15 September 2026, following the user's request to retain their color theme and photographic realism throughout the house.

Open the [visual reference board](STYLE_REFERENCE.html) for the photographs, palette, and room examples together. Open the [revised living / stair / storage set](R14-review.html) to see the application.

## Governing references

1. [Kitchen wide](images/06-kitchen-wide.png) governs overall daylight, exposure, muted oak, creamy paint, pale stone, and black accents.
2. [Kitchen detail](images/06-kitchen-detail.png) governs wood-grain scale, stone texture, ceramic and metal response, and concealed task lighting.
3. [Dining](images/16-dining-wide.png) governs the wider living-area atmosphere, upholstery, timber furniture, and gentle floor reflections.
4. The bedroom, bathroom, study, and gallery originals demonstrate how the same palette carries between rooms. Their image roles are recorded in [the source manifest](.source/house-style.json).

These references govern finishes and photographic appearance. The current approved model and its camera references govern layout. Older photographs can contain superseded architecture; copying their stairs, doors, furniture positions, or room dimensions is not part of a style match.

## Palette and materials

The hexadecimal values below are approximate visual communication swatches, chosen by eye. They are not sampled paint specifications, manufacturer matches, or linear rendering material values. The original photographs remain the color reference.

| Element | Visual swatch | Required appearance |
|---|---|---|
| Walls / ceiling | Warm ivory `#E7DECE` | Creamy off-white plaster; light, subtly textured, with neutral highlights |
| Floor / stairs / counters | Sandy stone `#CEC0A8` | Pale beige mineral variation, fine joints, restrained satin reflections |
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
| `07-bedroom1-wide`, `07-bedroom1-detail`, `07-bedroom1-opposite` | Same oak and stone; oatmeal upholstery, textured cream linen, sage accents, linen blind |
| `08-bedroom2-wide`, `08-bedroom2-detail`, `08-bedroom2-opposite` | Same base palette; olive throw and cushion, woven runner, simple oak bedside furniture |
| `09-bedroom3-wide`, `09-bedroom3-detail`, `09-bedroom3-opposite` | Same base palette; clay cushion, fine-grained oak wardrobe and dark pulls |
| `10-study-wide` | Beige fabric sofa, sage cushion, shallow oak desk, woven rug, soft tropical daylight |
| `10-passage-wide`, `17-front-gallery-wide` | Light walls and floor, oak and charcoal edges, restrained framed art, daylight and greenery |
| `11-bathroom1-wide`, `12-bathroom2-wide`, `13-bathroom3-wide` | Pale stone tiles, oak vanity, white sanitaryware, dark fittings, soft mirror glow and textured towels |
| `14-balcony-wide`, `15-terrace-wide` | Same pale surfaces, natural timber/woven seating and tropical context; terrace daylight is cooler and brighter |

`05-wash-wide.png` is an earlier geometry-led revision and is not a primary photographic benchmark. The rejected direct renders and `04-storage-wide-imagegen.png` are also excluded from the style-reference library. Their inclusion in the working image folder does not make them style authorities.

## Reusable generation brief

> Edit the supplied approved geometry view into a convincing interior photograph of the same house as the original kitchen wide and kitchen detail references. The geometry image governs camera, stair route, treads, landings, slab/header profiles, openings, fixture positions, cabinetry, shelving, clearances and room proportions. The kitchen photographs govern muted natural oak, creamy off-white plaster, pale sandy stone, quiet greige fronts, restrained charcoal hardware, subtle material texture, soft daylight and warm diffused practical light. Preserve the selected joinery profiles. Retain fine grain, mineral variation, contact shadows, ceramic and glass reflections, natural contrast and straight verticals. Keep neighboring views consistent in materials and time of day. Do not invent openings, furniture, fluting, extra stairs or new light fittings. No orange wood, coarse repeated grain, glowing neon edges, plastic surfaces, enlarged rooms, illustration, labels or watermark.

For another angle of the same room, also supply the first successful finished view as a consistency reference, while retaining that angle's own geometry image as the camera authority.

## Review before replacing an image

1. Compare the candidate beside both kitchen references at the same display size: oak saturation, ivory/stone separation, grain scale, LED brightness, and photographic detail.
2. Compare it with its saved geometry view: stair silhouette and route, landings, header, openings, TV location, cabinet divisions, shelves, basin and circulation.
3. Compare all views of that room together. Material colors, profiles and fixtures must agree. Correct a drifting view rather than adopting its mistake in the other views.
4. Preserve the geometry source, exact prompts, reference-image hashes, output hashes and review notes. Verify unrelated model files and original room images are unchanged.
5. Record generated presentation imagery accurately. Visual review is not proof of pixel-exact dimensions or user approval of the finished image; the model governs measured geometry.

## Current application

The three replacements use the built-in image-generation tool. Exact prompts are saved in [prompts.json](.source/style-revision-2026-09-15/prompts.json); the original R14 geometry views are preserved in [.source/style-revision-2026-09-15/geometry/](.source/style-revision-2026-09-15/geometry/). The [revision audit](.source/style-revision-2026-09-15/audit.json) records outputs and unchanged source files. The original references remain the style authority for future revisions.
