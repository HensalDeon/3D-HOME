# Interior image register

## Video-reference furnishings and evening variant · 25 October 2026

**Drawings and model coordinated (25 October 2026).** Only the dining fit-out is scheduled: [fitout-layout.json](../model/src/fitout-layout.json) now specifies light-oak wishbone chairs with paper-cord seats and a dimmable 0.55 m woven cane globe pendant, and records the evening lighting scheme from [02-living-evening.png](images/02-living-evening.png) as a note for the electrical layout. Sheet 03, `dimensions.json` and the 3D model are rebuilt to match. The cushions, throw, walnut stool, mushroom lamps, vases, mirrors and kitchen canister shelf are loose decor and remain photographic staging.

The supplied dining prompt ran first. Its reviewed wishbone chairs, charcoal vase/dried seed-head branches, smoked-glass bowl and cane globe pendant are the explicit consistency input for both living views. The six day photographs receive only the requested styling concept; the optional dusk prompt is included as a separate [evening living image](images/02-living-evening.png), preserving the daylight default.

| Saved image | Visual review |
|---|---|
| [16-dining-wide.png](images/16-dining-wide.png) | Two light muted-oak wishbone chairs with woven paper-cord seats replace upholstered chairs, with cushioned oak bench retained. Tall charcoal vase/dried seed-head branches and low smoked-glass bowl replace fruit bowl. Woven cane globe replaces linen drum. Table, artwork, window/door, matte floor and source camera visually retained. Selected first for living-view consistency. |
| [02-living-wide.png](images/02-living-wide.png) | Dining chairs/centre-piece/cane globe follow the reviewed dining output. Caramel boucle cushion and tan fringed throw added beside existing sage textile; dark walnut three-leg stool with books beside sofa; softly glowing alabaster-look mushroom lamp at TV cabinet/cubby. Source stair/guards/TV joinery/basin, sofa, coffee table, rug, floor lamp, curtains and matte floor visually retained. |
| [02-ground-floor-overview-wide.png](images/02-ground-floor-overview-wide.png) | Same wishbone dining set/centre-piece/cane globe and requested sofa textiles, walnut stool/books and mushroom lamp carried into the source overview. Original stair silhouette, TV/basin joinery/mirror, bedroom opening, sofas, coffee table, rug and matte floor visually retained. |
| [17-front-gallery-wide.png](images/17-front-gallery-wide.png) | Two framed bench prints replaced by one softly asymmetric thin dark-bronze-framed pebble mirror reflecting the gallery slider/light/greenery. Clay-brown earthenware vase with sparse tall branches added beside existing brass lamp. Bench/textiles, desk, oak door, runner, curtain, slider, balcony chair and source camera visually retained. |
| [09-bedroom3-opposite.png](images/09-bedroom3-opposite.png) | Thin black-framed rounded organic mirror added above original floating shelf, reflecting window/ripple curtains; small warm alabaster-look mushroom lamp fits between original vase and books. Corrected candidate retains source shelf extent, vase/dried stems and book positions. Bed/textiles, rug, door, artwork/reading light, wardrobe edge and matte plank floor visually retained. |
| [06-kitchen-wide.png](images/06-kitchen-wide.png) | Two-tier light-oak counter shelf right of sink holds exactly four matching matte ivory canisters with light wood lids, two per tier. Round oak serving board added behind existing cutting board. Current solid hood/filter underside, cupboards/lofts, counters, sink/tap/hob, window/door, runner, plants and matte floor visually retained. |
| [02-living-evening.png](images/02-living-evening.png) | Separate early-evening variant of updated living wide. Existing staged objects and composition retained; window turns blue dusk, ceiling downlights off, warm practical light from cane pendant, floor/mushroom lamps, TV-cabinet glow and basin wall light. Daylight default remains separate. |

The first Bedroom 3 candidate widened the shelf and moved its vase/books. It was rejected; one targeted correction retains the original shelf extent and prop positions. Seven selected PNGs are copied directly from built-in imagegen without compositing, cropping, resizing or other raster edits. Five modified outputs retain source dimensions; dining’s native height is 1027 rather than 1026 pixels. The evening canvas matches the updated living source. Assistant visual comparison is complete; user acceptance is pending. Object dimensions and lighting colour are illustrative, not measured product specifications, and generative editing does not establish pixel-identical preservation.

Six original photographs change, one evening variant is added, and the other 27 original photos remain unchanged. The protected user-selected kitchen opposite, kitchen detail, measured model/drawing files and default selected-wide mapping are unchanged. Six source frames are retained under `.source/materials/video-references/`; no video or working revision folder was created. Exact user/generation prompts, ordered input roles/hashes, the rejected attempt, frame provenance and selected output hashes are under `video_inspired_styling_generation_history` and `video_inspired_styling_decision` in [the release manifest](.source/image-release.json). Pre-edit photographs are recoverable from Git `98eb109a5ea257fd7843f212dd3cc9cd8b2e5593`.

## User-selected original kitchen opposite · 24 October 2026

The user explicitly identified the original generated [kitchen opposite](images/06-kitchen-opposite.png) as the correct image. That exact file is restored byte-for-byte. The later assistant composite, including its fridge door-proportion remapping, is superseded. No new generation, compositing, crop or resize was performed. The current wide-view file and all other photographs/model/drawing files are unchanged in this follow-up.

User acceptance applies to this selected opposite image. Its SHA-256 is `2774bc6e6f0c26f9b96a4ad8890cc55d37180e876a637f4b659c2ab720107864`; provenance and restoration verification are under `kitchen_appliance_user_selection` in [the release manifest](.source/image-release.json). The composite checks in the older section below describe the superseded file and do not apply to the current opposite photo.

## Earlier kitchen appliance composites · 24 October 2026

[Kitchen wide](images/06-kitchen-wide.png) now has a solid matte-charcoal inclined hood in place of the thin sheet-like form. Its rectangular chimney meets the loft; the flat stainless underside shows two baffle-filter panels and two warm round lights. This reviewed composite was the hood reference for [kitchen opposite](images/06-kitchen-opposite.png). The opposite fridge now has brushed-stainless two-door surfaces, a roughly two-thirds upper door, a continuous front/side gap, vertical left-edge bar handles, right-side hinge details, thin gaskets, rounded edges, bottom grille and the retained narrow top ventilation gap. Its size, position and oak housing remain unchanged.

Initial wide imagegen candidates shifted the framing and were not installed. After the assistant explicitly proposed local compositing and the user instructed “continue”, generated appliance parts were composited onto the original photographs. The third wide candidate supplies the hood only; the opposite candidate supplies the hood and frontal fridge details. Door textures were remapped to the existing fridge outline and its front/side split aligned. Tiny local warm-light pools affect only the hob area. Original cameras, canvas dimensions and all pixels outside the appliance/light masks are preserved exactly; these preservation checks apply to the actual final composites, not the rejected full frames.

Both composites were reviewed full size and in enlarged appliance crops. Assistant visual/pixel review passed; final user acceptance is pending. Appliance dimensions/clearances remain the user’s design intent, not measured installation certification. Kitchen detail, matte floors, the other 31 canonical images and all measured model/drawing files are unchanged. No project working-image folder or duplicate final assets were added.

Exact user/generation prompts, the rejected attempts, donor hashes, original-source recovery, complete local compositing script/coordinates and pixel-preservation checks are under `kitchen_appliance_detail_generation_history` and `kitchen_appliance_detail_decision` in [the release manifest](.source/image-release.json). Pre-edit canonical photos are recoverable from Git `bc265a53b66ff7328d581f0dc65ec7525ae5b6c5`.

## Matte stone floors and fine tread grooves · 24 October 2026

The living photograph was edited first and selected after assistant visual review. Its new matte pale warm beige stone-look floor is Image 2 for every subsequent run. The same pre-batch kitchen-wide photograph remains the palette input throughout; unchanged kitchen detail is Image 4. Six other common-area photos follow the living matte floor, and both kitchen photos use a matching soft-matte finish while retaining honed counters. Fine paired grooves are added only to existing stone tread tops. Oak treads, staircase geometry and visible bedroom wood-look flooring are retained.

Nine targets were generated separately, one run each, in the requested order. Review compared each target's existing contents and layout with the candidate. Assistant review is complete; user acceptance is pending. The photographs are illustrative, not pixel-identical measured drawings or verified material performance tests. Eight outputs retain source pixel dimensions; dining is saved at its native 1532 × 1026 instead of 1531 × 1027, a one-pixel export rounding with framing visually retained. No external raster resizing/cropping was applied.

| Updated image | Visible review |
|---|---|
| [02-living-wide.png](images/02-living-wide.png) | Selected first: pale warm beige matte stone-look floor with fine joints, reduced veining and diffuse sunlight; furniture/window reflections and glossy glare removed. Fine paired grooves added on visible stone tread tops. Stair geometry/guards/handrail, TV/basin joinery, dining set, sofa, rug and bedroom doorway visually retained. |
| [02-ground-floor-overview-wide.png](images/02-ground-floor-overview-wide.png) | Floor matched to the selected living matte finish. Fine grooves visible at stone stair nosings; upper oak treads retained. Existing stair silhouette, railings, TV/basin/mirror, dining set, sofas and bedroom planks through doorway visually retained. |
| [16-dining-wide.png](images/16-dining-wide.png) | Dining floor now reads matte without the previous bright window/furniture reflections, matching the living material. Two near-side chairs, cushioned bench, table, artwork, linen pendant, window and door visually retained. Native imagegen export is 1532 x 1026 rather than source 1531 x 1027; no external resize or crop was applied. |
| [03-stair-tv-wide.png](images/03-stair-tv-wide.png) | Under-cabinet light now falls diffusely on matte stone-look floor, without a mirrored LED band. Fine paired grooves on lower stone steps; upper oak tread caps retained. TV, cabinets, basin/mirror, sofa crop and bedroom wood-look floor visually retained. |
| [04-storage-wide.png](images/04-storage-wide.png) | Foreground floor matched to living matte stone, reducing marble-like veining and reflected cabinet glow. Fine grooves on cropped stone steps; oak treads retained. TV, joinery, vase, basin/mirror, lighting and bedroom doorway visually retained. |
| [05-wash-wide.png](images/05-wash-wide.png) | Small visible common-area floor changed to low-variation matte stone, with diffuse light. Bedroom planks remain beyond their threshold. Honed basin counter, vanity, mirror/sconce, TV crop, door and bed view visually retained; tiny oak stair crop left unchanged. |
| [10-passage-wide.png](images/10-passage-wide.png) | Passage stone floor matched to the living matte appearance, without the prior bright reflective band. Fine paired grooves added to visible stone treads. Stair/guard geometry, oak rails, picture/light and distant study benches/chairs/machines/window visually retained. |
| [06-kitchen-wide.png](images/06-kitchen-wide.png) | Kitchen floor now has pale sandy soft-matte stone-look tiles, low mineral variation and diffuse sun patches without cabinet/window reflections or glare streaks. Honed counters/backsplash, cabinetry, lofts, slanted hood, hob, sink, door/window and cotton runner visually retained. |
| [06-kitchen-opposite.png](images/06-kitchen-opposite.png) | Reverse kitchen floor matched to pale sandy soft-matte stone, reducing veining and reflected fridge/window glare while keeping diffuse sunlight. Honed counters, hob/hood, oak storage/ivory lofts, open bay, fridge/housing, straight wall and runner visually retained. |

The other 24 canonical images, including kitchen detail, all bedrooms, study photographs, front/rear galleries, bathrooms, balcony and terrace, are unchanged. All model/drawing files are unchanged. The existing board and image inventory use current final hashes; no project working-image folder or duplicate final images were added. Pre-edit photographs are recoverable from Git `2ff86b6c42e8a8a0d527b9bcec18c0e9a81abe04`. Exact supplied/generation prompts, input roles/hashes, living-reference selection and final hashes are under `common_stone_matte_floor_generation_history` and `common_stone_matte_floor_decision` in [the release manifest](.source/image-release.json).

## Matte bedroom plank floors and doorway transitions · 24 October 2026

Five named bedroom photographs now follow the user-supplied floor-only prompts, using unchanged Bedroom 1 wide as Image 2 and kitchen wide/detail as Images 3/4. The finish is pale natural oak/honey-beige matte porcelain wood-look planks with fine grain, narrow joints and a one-third stagger; nominal 200 × 1200 mm is design intent rather than a measured image claim. Glossy floor glare is reduced while soft daylight remains. Cream skirting, original camera/framing, cupboards and recessed pulls, peg rails, beds, curtains, furniture and other room contents are visually retained.

| Updated photograph | Floor/continuity review |
|---|---|
| [09-bedroom3-opposite.png](images/09-bedroom3-opposite.png) | Bedroom floor now has pale honey-beige natural-oak wood-look planks with fine grain, narrow joints and a matte surface without glossy glare. Clay/cream bed, rug, floating shelf/vase/books, door, window, curtains and wardrobe edge visually retained. |
| [09-bedroom3-detail.png](images/09-bedroom3-detail.png) | Small bedroom floor area below the L wardrobe converted from stone to light natural-oak wood-look planks with a matte fine-grained finish. Narrow doorway beyond retains sandy stone. Original wardrobe close-up camera, oak main doors, ivory lofts, recessed pulls, right-angle corner and curtain retained. Initial wrong-camera output was rejected and never installed. |
| [08-bedroom2-opposite.png](images/08-bedroom2-opposite.png) | Existing bedroom plank direction retained, with a paler, less saturated matte oak finish and reduced reflective glare. Planks stop at the bedroom threshold; passage retains sandy stone. Wardrobe, peg rail/shirt, bed, curtains, open entry door and distant tailoring view visually retained. |
| [07-bedroom1-opposite.png](images/07-bedroom1-opposite.png) | Bedroom floor matched to the light natural-oak matte reference, with soft diffuse sunlight. A slim flush transition separates bedroom planks from large pale sandy stone tiles in the passage and distant rooms. Wardrobe, wall peg rail/shirt, bed, curtains, doors and original camera visually retained. |
| [08-bedroom2-detail.png](images/08-bedroom2-detail.png) | Only the small visible floor area receives light natural-oak matte wood-look planks; bed/headboard, olive throw, white linen, rug, bedside cabinet/books/plant, black lamp and artwork visually retained. |

Each target was generated separately. Four needed one run; Bedroom 3 detail's first candidate incorrectly copied the floor-reference camera and was rejected. One target-identity correction restored the wardrobe close-up before saving. No rejected output was installed. Assistant visual review is complete; user acceptance is pending. Generative editing does not guarantee pixel-identical preservation.

Only the five named photos change; the other 28 canonical images, three input references and all model/drawing files remain unchanged. The existing review board is updated in place with hash-versioned links. No working revision directory or extra project image copies were added. Exact user/generation prompts, all four ordered input roles/hashes, both detail attempts and final hashes are under `bedroom_matte_floor_generation_history` and `bedroom_matte_floor_decision` in [the release manifest](.source/image-release.json). Pre-edit photographs are recoverable from Git `be81f684cedb0eeca83906b6707e6122b0386bdf`.

## Drawings and model coordinated to these images · R20 · 23 October 2026

The built-in joinery, fixtures, finishes and fixed exterior elements in the accepted 23 October photographs are now carried into [the complete house plans](../drawings/compact-v4/Hensal_Complete_House_Plans.pdf) and the 3D model. They come from one shared source, [fitout-layout.json](../model/src/fitout-layout.json), plus the existing storage and under-stair layouts:

- oak wardrobe doors with ivory lofts;
- kitchen oak uppers, loft bridge, hood, 350 mm pantry and fridge housing;
- ensuite vanities, niches, drains and floors;
- the under-stair under-counter basin, oak-framed mirror and sconce, with the stair-soffit strip removed;
- the dining table, two chairs and bench, and the coffee table;
- the terrace pergola, bench, raised guard and planters;
- the drying-balcony louvre screen;
- one honey-oak exterior timber, an oak front door, a charcoal rear door and warm pavers.

The plans' exterior concept image is now a front/rear composite of `19-exterior-front-wide.png` and `20-exterior-rear-backyard-wide.png`.

Artwork, rugs, lamps, curtains, plants, peg rails, the Bedroom 3 shelf and accessories remain photographic staging and are not drawn. The 23 October entry below, which says the measured files are unchanged, records the state before this coordination. No image in this folder was changed by R20.

## Study right-wall bench layout · 23 October 2026

[10-study-wide.png](images/10-study-wide.png) now replaces the projecting industrial-machine table and rear table with one continuous oak waterfall workbench against the right wall. White and charcoal domestic machines, two task lamps, a window-end thread-cone stand and two curved-rail oak chairs occupy that side; the centre aisle and floor below the window are clear. The left desk and surrounding room features are visually retained. This supersedes the earlier wide-study bench-layout retention instruction.

The first candidate introduced extra worktop items; a targeted cleanup removed them before saving. Assistant visual review is complete; user acceptance is pending. Generated dimensions remain approximate. Only this photograph changes; the other 32 canonical images and model/drawing files are unchanged. Pre-edit inputs are recoverable from Git `2f2626d0a8fa010a10d48fa15e93c6972200f137`. Exact user and generation prompts, five input roles/hashes, both attempts and final hash are under `study_right_wall_bench_generation_history` in [the release manifest](.source/image-release.json). The [review board](STYLE_REFERENCE.html#library) uses the new hash version.

## Detail refinements and corrected consistency review · 23 October 2026

Seven specifically named images are revised after the user identified remaining mismatches. The preceding wide-study photo still had its old chairs and angled thread rack; it now uses the storage view's curved-rail chairs and pegboard. The dining pendant and wider/lower artwork have a clear bare-wall gap. The living view now has two long-side chairs and one cushioned bench, without end chairs, while its pendant position is retained. The overview basin mirror has one uninterrupted glass sheet and a matte black tap. Three exterior views use moderated oak tones guided by the unchanged entrance and rear-utility references.

Review checked the visible details rather than relying only on changed hashes. The first front recolour incorrectly turned rooftop boards horizontal and was corrected before canonical replacement. The living candidate initially left a far-end chair back and needed one targeted removal. Both attempts are retained in the prompt audit. Assistant visual comparison is complete; user acceptance remains pending. Generative images are illustrative rather than pixel-identical or dimensionally certified.

Only these seven images change in this pass; the other 26 photographs, model and drawing files remain unchanged. Pre-edit photographs are recoverable from Git `8750ad3eabc89ab882fb1164d1a6a4e3d49e80ff`. The [review board](STYLE_REFERENCE.html#library) now versions image URLs by hash to refresh changed PNGs. Exact user prompts, all generation/correction prompts, input roles/hashes and final hashes are under `house_detail_refinement_generation_history` and `house_detail_refinement_decision` in [the release manifest](.source/image-release.json). Earlier records below describe prior versions and are superseded for these details.

| Updated image | Visible change checked |
|---|---|
| [20-exterior-rear-backyard-wide.png](images/20-exterior-rear-backyard-wide.png) | Timber recoloured to a softer, less orange warm oak using the rear-utility and entrance views; open railing, laundry and short-end louvres retained. |
| [19-exterior-front-wide.png](images/19-exterior-front-wide.png) | Timber panels moderated toward the entrance/rear-utility oak references. Original vertical rooftop boarding restored after candidate review; source furniture and facade retained. |
| [21-exterior-south-parking-wide.png](images/21-exterior-south-parking-wide.png) | Moderate warm oak coordinated across rooftop, parapet, balcony soffit, front panels and side strips while retaining existing board directions. |
| [10-study-wide.png](images/10-study-wide.png) | Both visible chairs now match storage: curved continuous top rails, slender spindles, splayed legs and solid oak seats. Left wall now has the matching oak thread-spool pegboard. Other study elements retained. |
| [16-dining-wide.png](images/16-dining-wide.png) | Wider, lower 100 × 50 cm landscape abstract and slightly raised drum pendant, with a visible bare-wall gap and no overlap. |
| [02-living-wide.png](images/02-living-wide.png) | Near-end and far-end dining chairs removed; two left-long-side chairs and the cushioned window-side oak bench remain. Living-view pendant stays in place. |
| [02-ground-floor-overview-wide.png](images/02-ground-floor-overview-wide.png) | Single uninterrupted mirror glass in one thin oak frame, centred charcoal sconce and matte black tap. Staircase and other overview details retained. |

## Consistency follow-up · 23 October 2026

Twelve photographs are updated in the requested dependency order using built-in imagegen. The study storage photograph establishes the corrected chair, shelf and thread-rack design; the wide study, passage and distant master-bedroom view follow it. The rear balconies restore their open long railings from the supplied pre-edit originals, with louvres confined to the left short end. All four exterior views use warmer honey-oak/light-teak timber. The dining artwork is now landscape and fully inside the frame. The overview follows the corrected dining/living fixtures and two-chair-plus-bench arrangement. The optional living pendant correction is included; the wardrobe close-up now uses the shorter recessed pulls.

The other 21 current photographs, including both kitchen references, are unchanged from the start of this follow-up. Model and drawing files are unchanged. No project working-image folder was added. Earlier 23 October records below describe the preceding image versions and are superseded for these twelve files.

Assistant visual review is complete; user acceptance is pending. Generated dimensions and placement remain approximate, and visual review does not establish pixel-identical geometry. Exact user prompts, every generation/correction prompt, input roles and hashes, prior-image recovery paths and final hashes are under `house_consistency_followup_generation_history` and `house_consistency_followup_decision` in [the release manifest](.source/image-release.json).

[Open the updated review board](STYLE_REFERENCE.html#library).

| Updated image | Changes |
|---|---|
| [10-study-storage.png](images/10-study-storage.png) | Three matching curved-back solid oak chairs; two lidded oatmeal linen boxes on each of four shelves; left-wall thread-spool rack. Window, blind, benches, machines and lamps retained. |
| [22-exterior-rear-utility-wide.png](images/22-exterior-rear-utility-wide.png) | Open long charcoal balcony railing restored from the supplied pre-edit original; louvres confined to the left short end, with garments partly visible. Warm honey-oak timber across rear cladding, soffit and rooftop boards. |
| [20-exterior-rear-backyard-wide.png](images/20-exterior-rear-backyard-wide.png) | Matching open long railing, narrow left short-end louvres and partly visible drying garments; consistent warm honey-oak cladding, soffit and rooftop boards. |
| [19-exterior-front-wide.png](images/19-exterior-front-wide.png) | Consistent warm natural honey-oak/light-teak timber and two woven upper-balcony armchairs with a round charcoal table; source front architecture and sitout retained. |
| [21-exterior-south-parking-wide.png](images/21-exterior-south-parking-wide.png) | Parking angle coordinated with warm oak timber and woven upper-balcony chairs/charcoal table; source gate, numerals, car and paving retained. |
| [10-study-wide.png](images/10-study-wide.png) | Three-pane black-framed window with visible palms and half-raised Roman blind, waterfall left desk and exactly two oatmeal linen boxes per shelf. Existing chairs and right benches retained. |
| [10-passage-wide.png](images/10-passage-wide.png) | Only the distant tailoring room updated to waterfall oak benches, curved-back oak chairs, linen boxes and task lamps; foreground passage and stair retained. |
| [08-bedroom2-opposite.png](images/08-bedroom2-opposite.png) | Only the distant tailoring view updated to an oak waterfall bench, black sewing machine, charcoal lamp, curved-back oak chair and linen boxes. Bedroom and passage railing retained. |
| [16-dining-wide.png](images/16-dining-wide.png) | Landscape 90 × 60 cm oatmeal/sage/clay abstract lowered fully inside the camera frame; pendant, table, two near-side chairs and tucked cushioned bench retained. |
| [02-living-wide.png](images/02-living-wide.png) | Optional correction applied: existing linen drum pendant lowered and centred over the dining table. Other living furnishings and source composition retained. |
| [02-ground-floor-overview-wide.png](images/02-ground-floor-overview-wide.png) | Drum pendant and landscape abstract coordinated with dining, wider oak-framed basin mirror and under-counter basin; two room-side chairs and a cushioned window-side bench, with no end chairs. Source staircase retained. |
| [09-bedroom3-detail.png](images/09-bedroom3-detail.png) | Short recessed charcoal edge pulls coordinated with the wide wardrobe view, retaining oak main doors, ivory lofts, door divisions and the 90-degree corner. |

## Coordinated house finish edits · 23 October 2026

All 29 specifically requested photographs now use the built-in imagegen edits listed below. The source photographs govern each camera and architectural composition. The pre-edit kitchen wide and unchanged kitchen detail govern materials; completed same-room views provide fixture consistency. Newer instructions replace the earlier tree-style bedroom stands with wall peg rails in the named views.

The kitchen detail, Bedroom 1 detail, master wide and master detail are unchanged. All measured model/drawing files remain unchanged. Pre-edit photographs are recoverable from Git `7f2136ec45715d62b453b395612474c332264c2d`; no working image folder was added to the project.

Assistant visual review is complete; user acceptance is pending. These are generated photographic presentations, with approximate dimensions and placement, rather than pixel-identical or measured images. Small hardware and texture details may vary between angles. The dining artwork extends above the existing camera crop at its requested high mounting position.

Exact prompts for every generation and correction, input roles/hashes, source-camera authority and final output hashes are under `house_finish_generation_history` and `house_finish_decision` in [the release manifest](.source/image-release.json). Open the [updated visual board](STYLE_REFERENCE.html#library) to review every image at full size.

| Edited image | Visible changes |
|---|---|
| [01-entrance-wide.png](images/01-entrance-wide.png) | Muted oak/greyed teak cladding and door, warmer pavers and larger coir mat. |
| [02-living-wide.png](images/02-living-wide.png) | Oak-framed basin mirror with charcoal downlight, under-counter basin, closed lower cubby, larger oatmeal rug, round coffee table, floor lamp, open sheers and drum dining pendant; four-chair and bench arrangement. |
| [02-ground-floor-overview-wide.png](images/02-ground-floor-overview-wide.png) | Coordinated basin and cubby, larger rug and round coffee table, open sheers and dining bench; original pendant and source stair presentation retained. |
| [03-stair-tv-wide.png](images/03-stair-tv-wide.png) | Plain oak-framed mirror, charcoal downlight, under-counter basin, closed lower left cubby and single vase above; stair LED and towel ring removed. |
| [04-storage-wide.png](images/04-storage-wide.png) | Coordinated TV/basin joinery close-up with closed lower cubby, framed mirror and downlight; under-cabinet glow retained. |
| [05-wash-wide.png](images/05-wash-wide.png) | Framed mirror and charcoal downlight, clean slab counter and under-counter basin; towel ring and stair LED removed. |
| [16-dining-wide.png](images/16-dining-wide.png) | Two near-side chairs and tucked upholstered bench, linen drum pendant, large abstract art mounted high and cropped at the existing upper frame, and open sheer curtains. |
| [06-kitchen-wide.png](images/06-kitchen-wide.png) | Slim inclined charcoal hood and oatmeal cotton runner with fine charcoal edge stripe. |
| [06-kitchen-opposite.png](images/06-kitchen-opposite.png) | Matching inclined hood and runner, oak fridge enclosure, shallow full-height end-wall storage and clear central aisle; fridge-top plant removed. |
| [07-bedroom1-wide.png](images/07-bedroom1-wide.png) | Oak main wardrobe doors, ivory loft doors and recessed charcoal pulls; existing door divisions, bed, curtains and plank floor retained. |
| [07-bedroom1-opposite.png](images/07-bedroom1-opposite.png) | Oak main wardrobe doors and ivory lofts, recessed pulls, wall peg rail with linen shirt and ivory sliding-track pelmet. |
| [08-bedroom2-opposite.png](images/08-bedroom2-opposite.png) | Oak main wardrobe doors and ivory lofts, recessed pulls, wall peg rail with linen shirt and ivory sliding-track pelmet; source passage sightline retained. |
| [09-bedroom3-wide.png](images/09-bedroom3-wide.png) | Oak main doors on both wardrobe legs, ivory lofts, recessed pulls and three-peg wall rail with linen shirt; L corner retained. |
| [09-bedroom3-detail.png](images/09-bedroom3-detail.png) | Oak main wardrobe doors, ivory lofts and recessed pulls in the retained 90-degree corner. |
| [09-bedroom3-opposite.png](images/09-bedroom3-opposite.png) | Floating oak shelf with one stoneware vase, dried stems and two linen-covered books; slim recessed wardrobe-edge pull. |
| [10-study-wide.png](images/10-study-wide.png) | Three task lamps, three lidded linen boxes on each shelf and solid oak chair seats; source machines, benches and Roman blind retained. |
| [10-study-storage.png](images/10-study-storage.png) | Oak waterfall bench sides and solid oak chairs, linen boxes and a task lamp at each machine. |
| [10-passage-wide.png](images/10-passage-wide.png) | One large oak-framed oatmeal/sage/clay abstract with charcoal picture light; source staircase and distant study retained. |
| [17-front-gallery-wide.png](images/17-front-gallery-wide.png) | Two larger oak-framed oatmeal/sage botanical and abstract prints above the existing bench. |
| [11-bathroom1-wide.png](images/11-bathroom1-wide.png) | Stone counter with under-counter basin, mirror cabinet lit beneath, stoneware counter set, tiled niche with three amber bottles, large-format floor and waffle mat. |
| [12-bathroom2-wide.png](images/12-bathroom2-wide.png) | Coordinated stone counter/basin, mirror cabinet, stoneware counter set, tiled niche, large-format floor and waffle mat. |
| [13-bathroom3-wide.png](images/13-bathroom3-wide.png) | Coordinated stone counter/basin, mirror cabinet, stoneware counter set, tiled niche, large-format floor and waffle mat; both source windows retained. |
| [14-balcony-wide.png](images/14-balcony-wide.png) | Woven chairs angled toward palm view with charcoal side table between them, on an oatmeal outdoor rug. |
| [15-terrace-wide.png](images/15-terrace-wide.png) | Charcoal pergola with bamboo shade, ivory masonry bench with seat cushions, outdoor rug, three textured planters, festoon lights, paler oak stair timber and sandy terrace floor. |
| [18-rear-gallery-wide.png](images/18-rear-gallery-wide.png) | Muted oak soffit and vertical oak-toned aluminium laundry screen at the drying zone. |
| [19-exterior-front-wide.png](images/19-exterior-front-wide.png) | Muted oak/greyed teak cladding and front door, woven sitout chairs, no hanging balcony planters and warmer paving. |
| [21-exterior-south-parking-wide.png](images/21-exterior-south-parking-wide.png) | Parking angle coordinated with edited entrance/front finishes, woven sitout chairs and no hanging balcony planters. |
| [20-exterior-rear-backyard-wide.png](images/20-exterior-rear-backyard-wide.png) | Muted cladding and soffits with vertical laundry-screen louvres; original subdued sky restored after review. |
| [22-exterior-rear-utility-wide.png](images/22-exterior-rear-utility-wide.png) | Muted cladding and soffits with vertical laundry-screen louvres, retaining the utility yard and existing text. |

## Ceiling-height curtains and compact wooden dress stands · 18 October 2026

Bedroom 1 remains the ceiling-level curtain reference. The master [wide](images/08-bedroom2-wide.png) and [opposite](images/08-bedroom2-opposite.png), and Bedroom 3 [wide](images/09-bedroom3-wide.png) and [opposite](images/09-bedroom3-opposite.png), now extend the oatmeal ripple-fold headers to the actual ceiling datum. In views cropped below the ceiling, fabric continues through the upper image edge. The difference was a generated mounting offset, not a window-height requirement; the common model clear ceiling is 2850 mm. Window openings, frames and sills retain their positions.

One compact muted-oak wooden dress stand is added in [Bedroom 1 opposite](images/07-bedroom1-opposite.png), [master opposite](images/08-bedroom2-opposite.png) and [Bedroom 3 wide](images/09-bedroom3-wide.png). The user's uploaded reference inspires the staggered tree-like uprights, short hooks, two small round trays and round plinth. Bedroom 1/master use the narrow entry-to-wardrobe niche; Bedroom 3 uses a slimmer stand on the short headboard-wall strip beside the open entry leaf and existing bedside unit. Its lower section is naturally occluded. A lightweight neutral shirt and folded cloth keep staging compact. Other views do not gain duplicate stands simply to make the object visible.

Five canonical photographs are replaced; Bedroom 1 wide and all three detail closeups remain unchanged. Existing beds, bedside furniture, wardrobe profiles, doors, circulation geometry, floor finishes and camera crops are visually retained. These are illustrative furniture envelopes, not selected products or measured furniture installation drawings. Model and drawing files, other rooms and the removed video remain unchanged. No working revision folder was created.

Bedroom desks are withdrawn at the user's request; active desk-study links are removed. The PDF was already absent when this revision began. Historical feasibility calculations remain in the release audit.

Exact built-in imagegen prompts, input roles/hashes, camera/geometry authority, source-attachment interpretation and output hashes are under `bedroom_ceiling_valet_generation_history` and `bedroom_ceiling_valet_decision` in [the release manifest](.source/image-release.json). Pre-edit photographs are recoverable from Git commit `4f84d7672b40f0154d5cb9d7fa9c54504421f9d1`. Assistant visual review passed; user acceptance of the finished edits is pending.

## Earlier ripple curtain pass · 18 October 2026

Roman blinds are replaced by warm oatmeal, floor-length ripple-fold curtains on discreet ceiling tracks in [Bedroom 1 wide](images/07-bedroom1-wide.png), [Bedroom 1 opposite](images/07-bedroom1-opposite.png), [master wide](images/08-bedroom2-wide.png), [master opposite](images/08-bedroom2-opposite.png), [Bedroom 3 wide](images/09-bedroom3-wide.png), [Bedroom 3 detail](images/09-bedroom3-detail.png) and [Bedroom 3 opposite](images/09-bedroom3-opposite.png). Curtains are drawn open for daylight, with compact stacks clear of wardrobe faces and the master's balcony door. Cameras, openings, beds, fitted storage, floor finishes and furniture positions are retained. Bedroom 1/master bed-detail closeups have no visible window treatment and remain unchanged. The distant study Roman blind through the master doorway is outside this bedroom-only change and is retained.

Exact built-in imagegen prompts, input roles/hashes and final hashes are under `bedroom_ripple_curtain_generation_history` in [the release manifest](.source/image-release.json). Pre-edit photos are recoverable from Git commit `401c9d111305d55e16daba61279c5158708f0b49`. Assistant visual review passed; user acceptance is pending. No working revision folder was added, and the removed video remains absent.

The earlier master/Bedroom 3 desk feasibility proposal is withdrawn. No desk, chair or wardrobe reallocation was implemented; historical measurements and assumptions remain under `bedroom_desk_feasibility` in the release manifest.

## Continuous kitchen upper storage and chimney · 17 October 2026

The latest finish pass changes the main upper doors to the same muted natural oak as the lower cupboards across all three kitchen views. The topmost loft row and window-side bridge remain creamy ivory; cupboard divisions, chimney and all existing room/fixture positions are retained. Exact material-edit prompts and hashes are under `kitchen_oak_upper_generation_history` in [the release manifest](.source/image-release.json). The preceding photographs are recoverable from Git commit `93a0161bebf167e76c9af4e5224eac8f4e3d5ad2`. Assistant visual review passed; user acceptance of the new finish is pending. The video, its timing/source manifest and rebuild script were removed at the user's request, along with their active links.

[Kitchen wide](images/06-kitchen-wide.png), [kitchen opposite](images/06-kitchen-opposite.png) and [kitchen detail](images/06-kitchen-detail.png) now show one coordinated upper-storage concept inspired by the user's attached reference. Matte solid ivory loft cupboards connect the end-wall groups around the upper window-side perimeter and continue above the fridge. Deeper main cupboards remain on the solid end walls; the sink-side open bay becomes closed storage. A compact charcoal metal chimney with a stainless underside sits above the existing two-burner hob and appears consistently from both wide cameras; it is outside the sink close-up. Glazing remains behind the added appliance and high-level joinery.

The existing camera compositions, door, sink, counter/base joinery, hob location, window sill/mullions, fridge, straight right wall, floor/runner and original oak/ivory/stone palette are retained. This is a photographic concept revision; the measured plans/model and duct route are unchanged. Exact built-in imagegen prompts, source roles/hashes, attachment role and final hashes are consolidated under `kitchen_continuous_upper_chimney_generation_history` in [the release manifest](.source/image-release.json). Pre-edit photographs are recoverable from Git commit `8d67d35350c2824be497e1104d13ca9a9c8c195d`. Assistant visual review passed; user acceptance is pending. No working revision folder was created.

## Kitchen plan correction · 12 October 2026

[Kitchen wide](images/06-kitchen-wide.png) and [kitchen detail](images/06-kitchen-detail.png) were explicitly accepted by the user and remain unchanged in this follow-up. [Kitchen opposite](images/06-kitchen-opposite.png) faces south: the visible end is a solid wall, the east/window hob counter continues along the left to that wall, and the southwest fridge is on the right against the west wall. After the user found the first cupboards too small, the end-wall unit was enlarged in width and height: three taller ivory main doors, a full row of four closed loft cupboards near the ceiling, one narrow open oak display bay and soft concealed task lighting. The design uses the reference's finishes while providing more closed storage. Countertop clearance, window and fridge aisle remain clear, and all other room elements retain their positions. This storage design is shown in the presentation; the drawing/model files are unchanged. The northwest door and north sink return remain behind this camera, matching their positions in the accepted wide photograph and on page 3 of [the complete house plans](../drawings/compact-v4/Hensal_Complete_House_Plans.pdf). The earlier west-facing opposite image, with a door on the visible end wall and fridge at back-left, was rejected by the user.

The right/west fridge wall and skirting remain straight, as drawn on PDF page 3. The wide and detail retain user acceptance and are unchanged. The kitchen working folder was removed at the user's request; exact built-in imagegen prompts, source roles/hashes, PDF crop recipe, camera audit and final hashes, including the cupboard addition, are consolidated in [the release manifest](.source/image-release.json). Original style inputs remain recoverable from Git commit `12e352ed27b39eb4b067b05daf43ecc3e3e2a4ca`; generated intermediates remain outside the project. Assistant visual review passed for the cupboard addition; user acceptance of this latest edit is pending. These photographs are illustrative. 

## Bedroom 1 camera and rear window · 9 October 2026

[Bedroom 1 wide](images/07-bedroom1-wide.png) uses a level entrance-side camera showing the bed, wardrobe and two perpendicular windows together. The user requested a better angle following the other bedroom wide views and chose to enlarge the actual rear opening. It is now 1200 × 1200 mm, sill +1.00 m and head +2.20 m; the side window remains 1400 × 1200 mm. The shared drawing schedule governs the PDF, rear elevation and model. Bed orientation, fitted storage, plank flooring and floor areas are retained.

[Rear backyard](images/20-exterior-rear-backyard-wide.png) and [rear utility](images/22-exterior-rear-utility-wide.png) carry the same local window enlargement. The native Bedroom 1 camera guide is retained in `.source/geometry/07-bedroom1-wide.png`; the source photographs, including the preceding floor reference, are recoverable from `abe0fd7`. Exact built-in imagegen prompts, input roles/hashes and reviews are under `bedroom1_window_camera_generation_history` in [the release manifest](.source/image-release.json). Assistant visual review passed; user acceptance of the new photographs is pending. The rear exterior photographs remain in the image library. The other 30 canonical room images are unchanged from `abe0fd7`.

## Bedroom flooring · 8 October 2026

[Bedroom 1 wide](images/07-bedroom1-wide.png) is the user's selected reference for light oak wood-look plank flooring. [Bedroom 1 opposite](images/07-bedroom1-opposite.png), [Bedroom 2 opposite](images/08-bedroom2-opposite.png) and [Bedroom 3 wide](images/09-bedroom3-wide.png) now match its pale tone, fine grain, narrow seams and staggered plank ends. The bedroom finish stops at the entry threshold; stone floors beyond the doors are retained. Existing wardrobe/loft designs, the 90° Bedroom 3 corner, rugs, cream skirting and doorway sightlines are preserved.

These are localized built-in imagegen finish edits. Exact prompts, source roles/hashes, retained geometry authority and reviews are under `bedroom_floor_generation_history` in [the release manifest](.source/image-release.json). Assistant visual review passed; user acceptance of the new floor photographs is pending. The reference and other 29 canonical images, measured model/drawing files and areas are unchanged from `00d26d1`; that commit retains the preceding three photos.

## Bedroom / bathroom wall corner · 8 October 2026

The user accepted the straight living wall and rear passage, then selected [ground-floor overview](images/02-ground-floor-overview-wide.png) as the reference for staircase steps/upper support and the six-seater dining set. [Living room](images/02-living-wide.png) now uses that continuous inclined stair-support profile, oak/charcoal railing, rectangular oak table and six matching chairs, while retaining the accepted frontage, route and camera. The overview itself is unchanged. Exact prompt and source roles/hashes are under `living_fixture_generation_history` in [the release manifest](.source/image-release.json). The native guide remains the frontage/camera reference; the stair and furniture appearance follows the explicit photographic preference. Assistant visual review passed; user acceptance of this fixture edit is pending.

[Living room](images/02-living-wide.png) is rebuilt from a current-model camera facing the bedroom/ensuite frontage squarely. Its doorway, ceiling junction and skirting now read horizontally along one flat wall. At the bathroom corner, a narrow perpendicular return leads into the 1.165 m clear rear route, which runs 2.25 m to the work-area door. The view through that door shows the covered utility-room wall. The original kitchen palette remains the finish reference.

The user rejected the earlier living edits for tilted frontage and incorrect rear-route positioning. Those rejected photographs and the prior oblique camera remain recoverable from `92f83e5` and `7b52dc7`; their feedback is recorded in the release manifest. This replacement uses the native model as the photographic base instead of retaining the rejected image composition. The measured stair/header, TV/basin bay and furnishings are seen from the new camera. [Ground-floor overview](images/02-ground-floor-overview-wide.png) is unchanged in this follow-up.

The measured plan/model already contained this orthogonal L-shaped boundary, so dimensions and gross area remain unchanged. The new living geometry/camera view is retained in `.source/geometry/02-living-wide.png`, with numerical verification that its front wall projects horizontally. The overview geometry view remains a footprint reference for its earlier photograph. Exact built-in imagegen prompts, input roles/hashes, camera records, user feedback and output hashes are under `wall_corner_generation_history` in [the release manifest](.source/image-release.json). The projection verification applies to the native model guide; the finished photo remains illustrative. The user accepted this wall/passage; that preceding photograph is recoverable from `9c3f2f8`. At that release, the other 32 canonical room images retained their `9c3f2f8` hashes; the later bedroom floor edits are recorded above.

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
