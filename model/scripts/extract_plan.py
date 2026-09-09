"""Read the retained drawing functions without regenerating or modifying the plans."""
from pathlib import Path
import sys,json,hashlib
ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT/'drawings/compact-v4/.source'))
import make_ensuite_plans as house
import make_roof_study as roof
class Recorder:
 def __init__(self): self.commands=[]
 def __getattr__(self,name):
  def record(*args,**kwargs):
   def clean(v):
    if hasattr(v,'hexval'): return v.hexval().replace('0x','#')
    if isinstance(v,(list,tuple)): return [clean(x) for x in v]
    return v
   self.commands.append({'op':name,'args':[clean(x) for x in args],'kwargs':{k:clean(v) for k,v in kwargs.items()}})
  return record
levels={}
for name,fn in [('ground',house.ground),('first',house.first),('roof',roof.roof_plan)]:
 p=Recorder();fn(p);levels[name]=p.commands
source=ROOT/'drawings/compact-v4/Hensal_Complete_House_Plans.pdf'
data={'source':source.name,'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'coordinates':'x increases north; y increases west; metres; house east/south corner is origin','levels':levels,'openings':{n:getattr(house,n) for n in ['FRONT_GF','FRONT_FF','REAR_GF','REAR_FF']},'dimensions':json.loads((source.parent/'dimensions.json').read_text())}
(ROOT/'model/src/plan-data.json').write_text(json.dumps(data,indent=2)+'\n')
print({k:len(v) for k,v in levels.items()})
