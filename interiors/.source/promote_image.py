"""Promote one manually reviewed image; archive its superseded file outside the project."""
from pathlib import Path
import json,sys,shutil,hashlib,datetime
SRC=Path(__file__).resolve().parent;OUT=SRC.parent
name,reason=sys.argv[1:3]
candidate=SRC/'qa/corrections'/f'{name}.png'
if not candidate.is_file():raise SystemExit('Missing candidate')
release=json.loads((SRC/'image-release.json').read_text()) if (SRC/'image-release.json').exists() else {'complete':False,'images':{},'approval':'Assistant visual review against full source cameras; user approval is separate.'}
dest=OUT/'images'/candidate.name
archive=Path.home()/'.Trash'/'Hensal-interior-replaced-20260910';archive.mkdir(parents=True,exist_ok=True)
old=[]
stem=name.removesuffix('-wide')
for p in sorted((OUT/'images').glob(stem+'-wide*.png')) if name.endswith('-wide') else [dest]:
 if p.exists():
  target=archive/p.name
  if target.exists():target=archive/(p.stem+'-'+hashlib.sha256(p.read_bytes()).hexdigest()[:8]+p.suffix)
  old.append({'file':p.name,'archive':str(target),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()});shutil.move(p,target)
shutil.copy2(candidate,dest)
release['images'][dest.name]={'status':'accepted','sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'review':reason,'source_camera':name,'superseded':old,'reviewed_at':datetime.datetime.now().isoformat(timespec='seconds')}
(SRC/'image-release.json').write_text(json.dumps(release,indent=2)+'\n')
if name.endswith('-wide'):
 select=json.loads((SRC/'selected-wide.json').read_text());select[stem]=name;(SRC/'selected-wide.json').write_text(json.dumps(select,indent=2)+'\n')
print(dest)
