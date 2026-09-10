"""Persist the pre-generation review; never treat old selection files as approval."""
from pathlib import Path
from collections import Counter
import json, hashlib

ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'interiors'
notes={
'01-entrance-wide':('REMOVE','Superseded same camera; unnecessary perforations in side wall.'),
'01-entrance-wide-v2':('CORRECT','Useful entrance view; compare curved bands and door/window proportions to full elevation before acceptance.'),
'02-living-wide':('REMOVE','Superseded camera; incorrect rear opening and bedroom window.'),
'02-living-wide-v2':('REGENERATE','Bedroom 1 ensuite wall mass is omitted/compressed; the bathroom and independent service passage are not correctly distinguished. Stair/wash access must be rebuilt from a full-source camera.'),
'03-stair-tv-wide':('REMOVE','Near duplicate of later composition; plant change adds no information.'),
'03-stair-tv-wide-v2':('REGENERATE','Isolated-stair reference omitted enclosure. Its camera was outside the north wall. Missing surrounding walls and behind-TV access invalidate this room view.'),
'04-storage-wide':('REMOVE','Near duplicate of later storage image; trailing plant adds no functional information.'),
'04-storage-wide-v2':('REGENERATE','Retained partition above the 1400 mm store door is missing. Open storage must follow actual stepped soffits and conditional R5 wall aperture.'),
'05-wash-wide':('REGENERATE','Freestanding-looking TV backing and excessively open space above vanity do not establish the actual upper-flight soffit or west-facing standing area.'),
'06-kitchen-wide':('CORRECT','North sink return appears substantially longer than the 550 mm approved return. Verify camera and cabinet endpoints; preserve east hob/window and north entrance.'),
'06-kitchen-opposite':('REGENERATE','Adds a south counter, turning the approved short-return L into a U-shaped kitchen.'),
'06-kitchen-detail':('CORRECT','Inherits exaggerated north sink run and overheads; detail must fit the 550 mm return and adjacent door.'),
'07-bedroom1-wide':('REMOVE','Superseded view; wrong west vent shape and south-window relationship.'),
'07-bedroom1-wide-v2':('REMOVE','Superseded view with south window over the bedhead instead of east of the bed.'),
'07-bedroom1-wide-v3':('CORRECT','West window aspect improved; camera and bed clearance still need comparison against room and ensuite boundary.'),
'07-bedroom1-opposite':('CORRECT','Opening relationships broadly plausible; entrance finish differs from living and wardrobe/door widths need full-model camera comparison.'),
'07-bedroom1-detail':('KEEP','Distinct material/bedside detail. No conflicting opening or bathroom geometry is shown; retain the sage linen, small plant and wall lamp.'),
'08-bedroom2-wide':('REMOVE','Superseded bed orientation; head appears on west wall.'),
'08-bedroom2-wide-v2':('KEEP','Retain established south-head bed, solid west wall and north private balcony door; verify visible projection with source camera before final release.'),
'08-bedroom2-opposite':('KEEP','Useful reverse view distinguishes private balcony, ensuite and entrance with wardrobe on east wall; source-camera review still required for final release.'),
'08-bedroom2-detail':('KEEP','Useful close material/bedside view with restrained lamp and plant; no conflicting openings shown.'),
'09-bedroom3-wide':('REMOVE','Superseded mirrored room and curtain crowding at wardrobe corner.'),
'09-bedroom3-wide-v2':('REMOVE','Superseded mirrored north window and L wardrobe.'),
'09-bedroom3-wide-v3':('KEEP','North window and L wardrobe now on correct sides from west looking east; Roman blind clears the short corner return. Source-camera review required before release.'),
'09-bedroom3-opposite':('KEEP','Distinct reverse view: west ensuite door, north window and retained south-head bed; source-camera review required before release.'),
'09-bedroom3-detail':('KEEP','Useful corner-access detail of the continuous L wardrobe; keep paired access and Roman blind.'),
'10-study-wide':('REGENERATE','Furniture and adjacent openings disagree with source: model has east-window desk and north cabinet, not this sofa/desk arrangement and open stair seen through gallery.'),
'11-bathroom1-wide':('REMOVE','Superseded basin on wrong wall.'),
'11-bathroom1-wide-v2':('REGENERATE','Camera is framed as an east-wall doorway although private entry is on south side. Removing the basin from the frame did not correct the architecture.'),
'12-bathroom2-wide':('REMOVE','Superseded basin on wrong wall.'),
'12-bathroom2-wide-v2':('REGENERATE','Same false east-wall doorway as Ensuite 1; actual private entrance is south-side pocket opening.'),
'13-bathroom3-wide':('REMOVE','Superseded basin moved to south wall.'),
'13-bathroom3-wide-v2':('CORRECT','West shower and two vents are useful, but the source east basin overlaps the entrance. Resolve this source conflict rather than hiding the basin behind camera.'),
'14-balcony-wide':('REMOVE','Superseded view inventing stair directly inside the common gallery.'),
'14-balcony-wide-v2':('KEEP','Useful compact balcony view with empty gallery and two small chairs; exterior band section must pass final source-camera check.'),
'15-terrace-wide':('REMOVE','Superseded view omitting roof enclosure end vent.'),
'15-terrace-wide-v2':('KEEP','End vent restored; retains north exit and restrained terrace furniture. Verify door swing and perimeter against source camera before release.'),
'16-dining-wide':('REGENERATE','Inherits living rear-boundary problem and inconsistent table/window relationship; pendant is absent from the corresponding living view.'),
}
rows=[]
for f in sorted((OUT/'images').glob('*.png')):
    status,reason=notes[f.stem]
    rows.append(dict(file=f.name,status=status,reason=reason,sha256=hashlib.sha256(f.read_bytes()).hexdigest(),pdf_eligible=False))
sources={str(p.relative_to(ROOT)):hashlib.sha256(p.read_bytes()).hexdigest() for p in [ROOT/'drawings/compact-v4/Hensal_Complete_House_Plans.pdf',*[ROOT/'model/src'/n for n in ['geometry.js','plan-data.json','revision.js','under-stair-layout.json','house.js','facade.js']]]}
data={'phase':'pre-generation audit','approval':'KEEP preserves useful design; final source-camera check and release are separate. No image is user-approved by this checklist.','sources':sources,'counts':dict(Counter(r['status'] for r in rows)),'images':rows,'source_conflicts':[{'id':'B3-BASIN-DOOR','description':'Ensuite 3 source basin footprint x=4.70–5.10, y=6.20–6.52 overlaps east entrance x=4.85–5.60 by 250 mm. Architecture remains locked. A fixture-only alternative needs resolution.'},{'id':'R5-HEADROOM','description':'R5 leaning strip is 2.17 m against source 2.20 m benchmark; body line 2.35 m. Do not add height or move basin silently.'},{'id':'R5-STORE','description':'900 × 1400 mm store aperture in retained partition is conditional on structural verification; wall above stays.'},{'id':'KITCHEN-EXTRACT','description':'Retained east hob lies under approved window. Chimney/window coordination unresolved; never delete the window to install a conventional hood.'}]}
(OUT/'.source/image-audit.json').write_text(json.dumps(data,indent=2)+'\n')
md=['# Interior image review','', 'Pre-generation audit against the saved R5 architecture. KEEP means preserve the useful view; it does not mean dimensional certification or user approval. All images require a final release check before PDF inclusion.','', ' | Status | Count |','|---|---:|',*[f'| {k} | {v} |' for k,v in data['counts'].items()],'','| Image | Decision | Reason |','|---|---|---|',*[f"| {r['file']} | **{r['status']}** | {r['reason']} |" for r in rows],'','## Source conflicts','',*[f"- **{s['id']}**: {s['description']}" for s in data['source_conflicts']]]
(OUT/'IMAGE_REVIEW.md').write_text('\n'.join(md)+'\n')
print(json.dumps(data['counts']))
