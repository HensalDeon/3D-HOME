from pathlib import Path
import json,base64
root=Path(__file__).resolve().parents[2]
p=root/'drawings/compact-v4'
names=['00-cover','01-site','02-ground','03-first','08-roof-plan','04-elevations','05-stair-vastu','09-stair-section','10-roof-setbacks','06-reference-comparison','07-exterior-concept']
def data(path,mime): return 'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()
(root/'model/src/assets.json').write_text(json.dumps({'sheets':[data(p/(n+'.png'),'image/png') for n in names],'pdf':data(p/'Hensal_Complete_House_Plans.pdf','application/pdf')}))
