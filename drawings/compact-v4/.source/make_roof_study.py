#!/usr/bin/env python3
"""Roof-access addendum to compact-v4; does not alter accepted bedroom plans."""
from pathlib import Path
import json
import make_ensuite_plans as v4
from make_plans import Plan
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
from reportlab.lib.colors import white, HexColor
import pymupdf

OUT=Path(__file__).resolve().parent/'roof-study'
T=v4.TEAL; I=v4.INK; M=v4.MUTED; B=v4.BLUE
FOOTPRINT=6*9.7
HEAD=(0,2.15,2.2,6.25)
HEAD_AREA=(HEAD[2]-HEAD[0])*(HEAD[3]-HEAD[1])
GF=.45; FF=3.45; RF=6.45; COVER_UNDER=8.85; COVER_TOP=9.0

def base(c,n,title,sub):
 c.setFillColor(white);c.rect(0,0,*v4.PAGE,fill=1,stroke=0)
 v4.tx(c,16,280,'HENSAL / REGULAR ROOF ACCESS',9,T,True)
 v4.tx(c,16,266,title,23,I,True)
 v4.tx(c,16,256,sub,8,M)
 c.setStrokeColor(v4.LINE);c.line(16*mm,249*mm,404*mm,249*mm);c.line(16*mm,19*mm,404*mm,19*mm)
 v4.tx(c,16,12,'ROOF ADDENDUM / 08 SEP 2026 / COORDINATE WITH COMPACT V4 FLOOR PLANS',7,M)
 v4.tx(c,299,12,f'CONCEPT - NOT FOR CONSTRUCTION    {n} / 3',7,M)

def roof_plan(p):
 p.fill_rect(0,0,6,9.7,v4.PALE)
 p.rect(.15,.15,5.85,9.55,M,.5)
 # 1.10 m perimeter guard; symbol at edge does not specify structural thickness.
 for coords in [(0,0,6,0),(6,0,6,9.7),(6,9.7,0,9.7),(0,9.7,0,0)]:p.railing(*coords)
 p.fill_rect(*HEAD,white)
 for r in [(0,2.15,.15,6.25),(2.05,2.15,2.2,6.25),(.15,2.15,2.05,2.3),(.15,6.1,2.05,6.25)]:p.wall(*r)
 v4.stair(p,'FF',False)
 p.door(2.05,2.35,.90,.15,'v',+1,'lo')
 p.window(.55,2.15,.90,.15,'h');p.window(.55,6.1,.90,.15,'h')
 p.rect(2.2,2.3,3.3,3.45,T,.6,dash=[2,2])
 p.text(3.42,2.80,'EXIT LANDING',5.5,col=T,align='l')
 p.text(1.1,6.57,'STAIR HEADHOUSE',7,True)
 p.text(1.1,6.88,'2.20 x 4.10 m OUTSIDE',5.8,col=B)
 p.text(4.12,5.75,'OPEN ROOF TERRACE',8,True,col=T)
 p.text(4.12,5.38,'ROOF FFL +6.45 m',6,col=M)
 # Light indicative seating, no additional canopy/covered roof room.
 p.circle(4.4,7.4,.38,M,.5)
 for x,y in [(3.8,7.4),(5.0,7.4)]:p.chair(x,y,.40)
 p.text(4.4,8.1,'SEATING / OPEN TO SKY',5.5,col=M)
 # Proposed south-west reserve only, not an installed tank.
 p.rect(.35,7.5,1.8,9.05,M,.5,dash=[2,2])
 p.text(1.05,8.3,'SERVICES',5.5,col=M)
 p.text(1.05,7.94,'RESERVE*',5.5,col=M)
 # Indicative SW -> NE drainage, outlets on north edge, away from entrance.
 for pts in [[(1.0,7.2),(2.8,6.55)],[(3.45,8.9),(4.9,4.5)],[(3.5,4.7),(5.65,.55)],[(.8,1.7),(4.7,.55)]]:p.polyline(pts,B,.7,True)
 p.circle(5.62,.45,.10,B,.8);p.text(5.45,.8,'RWO',5.5,col=B)
 p.line(5.75,1.05,6.12,1.05,B,1);p.text(6.2,1.05,'OVERFLOW',5,col=B,align='l')
 p.text(3.8,1.45,'FALLS / OUTLETS INDICATIVE',5.4,col=B)
 p.dims('x',10.2,0,[6],size=7);p.dims('y',-.65,0,[9.7],size=7)
 p.dims('x',1.75,0,[2.2],size=6)
 p.text(3,-.45,'FRONT / EAST',7,True,col=T)
 p.text(3,10.6,'REAR / WEST',7,True,col=T)
 v4.compass(p,7.4,8.8)


def sheet1(c):
 base(c,1,'Roof plan / full stair access','PROPOSED ROOF PLAN 1:55 AT A3 / SAME SOUTH STAIR CONTINUES FROM FIRST FLOOR')
 roof_plan(Plan(c,37,43,1000/55))
 y=231
 y=v4.block(c,227,y,'FULL STAIRS, NOT A LADDER','Continue the south dog-leg stair from the first floor to roof level. The roof arrival uses a full landing and an outward-opening 900 mm door. The front study and the three bedroom suites can remain in their existing locations.',170)
 y=v4.block(c,227,y,'THE ROOF ENCLOSURE IS ADDITIONAL AREA',f'Ground and first floors remain {FOOTPRINT:.2f} m2 / {FOOTPRINT/.09290304:.1f} sq ft each. The roof stair enclosure adds {HEAD_AREA:.2f} m2 / {HEAD_AREA/.09290304:.1f} sq ft. Counted conservatively, the three levels total {(2*FOOTPRINT+HEAD_AREA)/.09290304:.1f} sq ft. It is not included in the earlier two-floor total.',170)
 y=v4.block(c,227,y,'GUARDING AND ROOF HEIGHT','Provide continuous 1.10 m concept-height guarding at exposed roof edges, subject to final local detailing. The stair enclosure has 2.40 m clear space above roof landing level; its roof top is +9.00 m. These are additions to the previous exterior.',170)
 y=v4.block(c,227,y,'DRAINAGE IS NOW SHOWN AT CONCEPT LEVEL','Arrows indicate falls toward a northeast outlet, with a separate visible overflow. Confirm actual falls, waterproofing build-up, outlet sizes and concealed downpipe routes. Drain the stair-cover roof separately toward its north edge, away from the exit. This is not a finished drainage installation.',170)
 y=v4.block(c,227,y,'OPEN TERRACE / SERVICES RESERVE','The terrace is open to the sky; no extra covered room or pergola is included. The southwest dashed box is only a services reserve. Tank loads, solar equipment, furniture loads and plumbing positions require structural/site coordination.',170)


def level(p,z,label):
 p.line(-.2,z,6.2,z,M,.4,dash=[2,2]);p.text(6.35,z-.05,label,6,col=B,align='l')

def section(p):
 # Developed profile of one storey, repeated vertically. Flight runs unfolded.
 # Each rise occurs before a tread: lower 9R/8T, upper 8R/7T, 0.90 landing.
 p.fill_rect(-.1,GF-.15,5.1,GF,HexColor('#d2d6d3'))
 for z in [FF,RF]:p.fill_rect(4.65,z-.15,5.4,z,HexColor('#d2d6d3'))
 r=3/17
 for z0 in [GF,FF]:
  pts=[(0,z0)]
  x=0;z=z0
  for n in range(9):
   z+=r;pts.append((x,z))
   if n<8:x+=.25;pts.append((x,z))
  x+=.9;pts.append((x,z))
  for n in range(8):
   z+=r;pts.append((x,z))
   if n<7:x+=.25;pts.append((x,z))
  p.polyline(pts,I,.9)
  p.polyline([(0.25,z0+.25),(2.0,z0+1.82),(2.75,z0+1.82),(4.5,z0+3.2)],T,.55,True)
  p.text(2.42,z0+1.40,'MID-LANDING',5,col=M)
 p.fill_rect(-.1,COVER_UNDER,5.4,COVER_TOP,HexColor('#d2d6d3'))
 p.line(5.4,RF,5.4,COVER_UNDER,I,.7)
 p.dims('y',5.75,RF,[COVER_UNDER-RF],size=6,side=-1)
 for z,txt in [(GF,'GF +0.45'),(FF,'FF +3.45'),(RF,'ROOF +6.45'),(COVER_TOP,'COVER +9.00')]:level(p,z,txt)
 p.text(2.5,-.25,'UNFOLDED FLIGHTS / NOT A STRAIGHT BUILDING SECTION',5.5,col=M)


def sheet2(c):
 base(c,2,'First-floor stair and roof headroom','PROPOSED FIRST-FLOOR STAIR 1:35 / DEVELOPED STAIR PROFILE 1:50 AT A3')
 p=Plan(c,27,90-2.3*1000/35,1000/35)
 v4.stair(p,'FF',False,continue_to_roof=True)
 # An upper UP flight and lower DN arrival share the same plan projection.
 p.polyline([(1.85,3.25),(1.85,4.7)],M,.5,True)
 p.text(1.1,6.50,'FIRST FLOOR / +3.45 m',7,True,col=T)
 p.text(1.1,6.18,'UPPER FLIGHTS SHOWN; LOWER ARRIVAL BELOW',4.9,col=M)
 v4.para(c,25,74,'Remove the former guard across the bottom of the upward flight at first-floor level. The north return flight lands from below; the south flight begins the next rise to the roof.',117,8,4.5)
 v4.para(c,25,46,'Two rises of 3.00 m: GF to FF, then FF to roof. Each storey has 17 equal risers of 176.47 mm, 250 mm treads and 900 mm clear flights/landing. Structural stair thickness and all walking-line headroom still require verification.',117,8,4.5)
 section(Plan(c,180,53,20))
 v4.para(c,180,36,'R2 developed paths: GF has a 2 + 7 + 8-riser turn; first-to-roof retains 9 + 8. The GF upper flight and first-floor connection are fixed. Do not set out horizontal building dimensions from this diagram.',215,8,4.5)
 v4.para(c,180,239,'The existing +7.40 m decorative screen is too low to be a roof-access enclosure. The new stair cover is +9.00 m, set back 2.15 m from the front and 3.45 m from the rear. Setbacks reduce visibility; they do not guarantee an unchanged roof silhouette.',215,8,4.5)


def roof_elevation(p,rear=False):
 # Draw the setback enclosure first, then the existing facade in front of it.
 x0=3.8 if rear else 0
 p.fill_rect(x0,RF,x0+2.2,COVER_UNDER,HexColor('#e3e5df'))
 p.fill_rect(x0,COVER_UNDER,x0+2.2,COVER_TOP,v4.DARK)
 v4.glazing(p,x0+.55,7.95,.90,.45,'obscured')
 v4.elevation(p,rear,False)
 # Slim guarding shown explicitly; not hidden to preserve an impossible old silhouette.
 p.line(0,RF+1.1,6,RF+1.1,I,.8)
 for k in range(13):
  x=k*.5
  if (not rear and x>3.4) or (rear and x<2.6):p.line(x,RF,x,RF+1.1,I,.5)
 for z,txt in [(RF,'ROOF +6.45'),(RF+1.1,'GUARD +7.55'),(COVER_TOP,'COVER +9.00')]:
  p.line(6.1,z,6.5,z,B,.5);p.text(6.6,z-.05,txt,5.5,col=B,align='l')
 p.dims('x',-.65,0,[6],size=6)


def sheet3(c):
 base(c,3,'Roof access changes the roofline','HEIGHT STUDY / ELEVATIONS 1:55 AT A3 / REVISED REAR UPPER FACADE AND PLAN OPENINGS')
 v4.tx(c,28,238,'FRONT / EAST',10,T,True);v4.tx(c,231,238,'REAR / WEST',10,T,True)
 roof_elevation(Plan(c,28,60,1000/55),False)
 roof_elevation(Plan(c,231,60,1000/55),True)
 v4.para(c,28,41,'The existing decorative screen remains in front of the setback stair enclosure. The enclosure and roof-edge guarding are shown at their full projected heights; they cannot simply be omitted from the exterior drawing.',172,8,4.4)
 v4.para(c,231,41,'The first-floor facade now follows the rear reference, with a short canopy return and two toilet vents; balcony entry is on the side. This separate full-stair option adds the visible headhouse and guarding above the reference roofline.',172,8,4.4)


def main():
 assert abs(HEAD_AREA-9.02)<1e-8
 assert abs(COVER_UNDER-RF-2.4)<1e-8
 assert abs(17*(3/17)-3)<1e-8
 pdf=OUT/'Hensal_Roof_Access_Study.pdf'
 c=canvas.Canvas(str(pdf),pagesize=v4.PAGE);c.setTitle('Hensal roof access - full south stair')
 for fn in [sheet1,sheet2,sheet3]:fn(c);c.showPage()
 c.save()
 d=pymupdf.open(pdf)
 for pg,name in zip(d,['01-roof-plan','02-roof-stair-section','03-roofline-impact']):
  pg.get_pixmap(matrix=pymupdf.Matrix(1.3,1.3)).save(OUT/f'{name}.png')
  (OUT/f'{name}.svg').write_text(pg.get_svg_image())
 (OUT/'roof-dimensions.json').write_text(json.dumps({'roof_enclosure_m2':HEAD_AREA,'main_floor_m2_each':FOOTPRINT,'enclosure_top_m':COVER_TOP,'landing_clear_height_m':2.4,'rooftop_access':'full south stair','status':'concept/addendum; exterior coordination pending'},indent=2))
 # Keep the existing self-contained review gallery coordinated on each rebuild.
 import base64, re
 gallery=OUT/'index.html'
 if gallery.exists():
  html=gallery.read_text()
  images=iter(['01-roof-plan','02-roof-stair-section','03-roofline-impact'])
  html=re.sub(r'data:image/png;base64,[A-Za-z0-9+/=]+',lambda match:
   'data:image/png;base64,'+base64.b64encode((OUT/(next(images)+'.png')).read_bytes()).decode(),html)
  html=html.replace('The rear layout has not yet been revised; the work-area access choice remains open.',
   'The upper rear facade follows the revised reference, with two toilet vents and a side balcony entry. Full roof stairs add the taller enclosure and guarding shown here.')
  gallery.write_text(html)
 print(pdf)
if __name__=='__main__':main()
