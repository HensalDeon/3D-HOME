"""Promote visually reviewed Cycles candidates into the canonical image slots."""
from pathlib import Path
import hashlib,json,shutil,struct

SRC=Path(__file__).resolve().parent
ROOT=SRC.parent.parent
FILES=['02-living-wide.png','03-stair-tv-wide.png','04-storage-wide.png']
audit=json.loads((SRC/'render/render-audit.json').read_text())
assert audit['geometryModifiers']==0
assert audit['maxVertexImportErrorMetres']<.000002
assert audit['resolution']==[1800,1200] and audit['samples']==128
assert len(audit['renderOnlyAdjustments']['joineryShelfShadowRaySuppression'])==6
assert hashlib.sha256((SRC/'render_interior.py').read_bytes()).hexdigest()==audit['rendererSha256']
for entry in audit['materials']:
    assert hashlib.sha256((SRC/'materials'/entry['file']).read_bytes()).hexdigest()==entry['sha256']
for filename,digest in audit['sourceHashes'].items():
    assert hashlib.sha256((ROOT/'model/src'/filename).read_bytes()).hexdigest()==digest,filename+' changed since mesh export'
for name in FILES:
    data=(SRC/'render'/name).read_bytes()
    assert data[:8]==b'\x89PNG\r\n\x1a\n'
    assert struct.unpack('>II',data[16:24])==(1800,1200)
    assert hashlib.sha256(data).hexdigest()==audit['outputs'][name]

release=json.loads((SRC/'image-release.json').read_text())
if any(release['images'].get(name,{}).get('method')=='built-in-imagegen-reference-edit' for name in FILES):
    raise SystemExit('The canonical slots now contain kitchen-matched photographic presentations. Keep Cycles outputs in .source/render/ as geometry references; review STYLE_REFERENCE.md before replacing the presentation set.')
inventory=json.loads((SRC/'image-inventory.json').read_text())
descriptions={
    FILES[0]:'Photographic Cycles render from the approved R14 living-room camera.',
    FILES[1]:'Photographic Cycles render from the approved R14 joinery close-up camera.',
    FILES[2]:'Photographic storage detail from the approved close-up position with a tighter lens.',
}
for name in FILES:
    shutil.copy2(SRC/'render'/name,SRC.parent/'images'/name)
    digest=audit['outputs'][name]
    release['images'][name]={'status':'accepted','sha256':digest,'review':descriptions[name]+' Actual model meshes retained; shader and lighting changes only.','reviewed_at':'2026-09-15','revision':'R14','method':'blender-cycles-direct-mesh-render','geometry_approval':'approved by user','render_review':'assistant visual QA; not a claim of user approval of final finishes'}
    entry=next((item for item in inventory if item['file']==name),None)
    if entry is None:entry={'file':name};inventory.append(entry)
    entry.update(size=[1800,1200],sha256=digest)

# Final images have only their canonical names. Historical originals remain in Git.
old=['R14-living-room-eye.png','R14-joinery-close.png','R14-geometry-in-stair.png']
for name in old:
    (SRC.parent/'images'/name).unlink(missing_ok=True)
    release['images'].pop(name,None)
inventory=[item for item in inventory if item['file'] not in old]
(SRC/'image-release.json').write_text(json.dumps(release,indent=2)+'\n')
(SRC/'image-inventory.json').write_text(json.dumps(inventory,indent=2)+'\n')
audit['reviewed_at']='2026-09-15'
audit['canonicalImages']=['interiors/images/'+name for name in FILES]
(ROOT/'model/qa/interior-render-audit.json').write_text(json.dumps(audit,indent=2)+'\n')
print('Promoted three canonical renders; removed three superseded R14 PNGs.')
