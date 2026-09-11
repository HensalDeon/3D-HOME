#!/usr/bin/env python3
"""Compact concept v4. Run with reportlab and pymupdf installed.
Geometry is metres; output is A3 vector PDF plus SVG/PNG review sheets.
Original v2 is preserved. Elevation opening locations derive from plan data.
"""
from pathlib import Path
import math, json, textwrap
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A3, landscape
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, Color, white, black
from make_plans import Plan

ROOT = Path(__file__).resolve().parent
OUT = ROOT / 'compact-v4'
PAGE = landscape(A3)
INK=HexColor('#25343b'); MUTED=HexColor('#60747c'); TEAL=HexColor('#197a77')
PALE=HexColor('#eaf3ef'); SAND=HexColor('#f0e7d9'); WOOD=HexColor('#986544')
DARK=HexColor('#42494d'); WALL=HexColor('#f1eeE8'); GLASS=HexColor('#b1c7c9')
BLUE=HexColor('#457b9d'); ROSE=HexColor('#f3e6df'); LINE=HexColor('#bdcbc9')
W,D=6.0,9.7
# R8 external wall thickness per floor: 220 mm on the ground, 170 mm on the first, with the
# internal partitions staying 100 mm throughout. Hybrid growth: the
# west wall grows outward into the 2.70 m parking strip and the rear wall into the 4.10 m garden,
# while the east and front walls thicken inward so the 1.00 m path and 3.00 m front yard keep
# their setbacks. Every inner face the stair and the under-stair unit depend on stays put.
EXT={'GF':.22,'FF':.17}
def grow(floor):
 """How far this floor's west and rear outer faces sit beyond the nominal envelope."""
 return EXT[floor]-.15
def west(floor):
 """West outer face. Avoids a negative zero on the floor that does not grow."""
 g=grow(floor);return -g if g else 0.0
def envelope(floor):
 return (west(floor),0,W,D+grow(floor))
AREA=W*D
def floor_area(floor):
 g=grow(floor);return (W+g)*(D+g)
GF_AREA=floor_area('GF');FF_AREA=floor_area('FF')
SQFT=AREA/0.09290304
GF_SQFT=GF_AREA/0.09290304;FF_SQFT=FF_AREA/0.09290304
# x increases north; y increases west. External envelope includes all covered utility/balconies.
# Opening tuples: (x, width, sill above finished floor, height, kind).
FRONT_GF=[(.60,1.70,1.00,1.15,'window'),(3.28,.90,0,2.20,'door'),(4.55,1.05,.75,1.45,'window')]
FRONT_FF=[(.60,1.70,.80,1.40,'window'),(3.45,2.05,0,2.20,'slider')]
REAR_GF=[(.50,.60,1.35,.70,'window'),(4.70,.90,0,2.15,'door'),(3.23,1.15,1.20,1.00,'obscured')]
REAR_FF=[(3.50,.65,1.65,.50,'obscured'),(4.90,.65,1.65,.50,'obscured')]
SOURCES=[
 ('Stair placement / ascent','https://www.architectureideas.info/2008/11/vastu-shastra-guidelines-staircases/comment-page-1/'),
 ('Kitchen placement','https://www.architectureideas.info/2009/01/vastu-kitchen/'),
 ('Bedrooms / sleeping direction','https://www.architectureideas.info/2008/11/vastu-shastra-guidelines-bedrooms/'),
 ('Bathroom Vastu placement','https://www.architectureideas.info/2009/01/vastu-shastra-guidelines-toilets-and-bathrooms/'),
 ('Kerala rules portal (verify amendments)','https://lsgkerala.gov.in/en/news-scroll-news-departmentnews/kerala-municipality-building-rules-2019-kerala-panchayat-building'),
]

def tx(c,x,y,s,size=9,color=INK,bold=False):
 c.setFillColor(color); c.setFont('Helvetica-Bold' if bold else 'Helvetica',size); c.drawString(x*mm,y*mm,s)

def para(c,x,y,s,width=150,size=8,leading=4.8,color=MUTED):
 from reportlab.pdfbase.pdfmetrics import stringWidth
 words=s.split(); lines=[]; line=''
 for word in words:
  t=(line+' '+word).strip()
  if stringWidth(t,'Helvetica',size)>width*mm:
   lines.append(line); line=word
  else: line=t
 if line: lines.append(line)
 for ln in lines: tx(c,x,y,ln,size,color); y-=leading
 return y

def block(c,x,y,title,body,width=145):
 tx(c,x,y,title,10,TEAL,True)
 return para(c,x,y-6,body,width)-8

def base(c,n,title,sub):
 c.setFillColor(white); c.rect(0,0,*PAGE,fill=1,stroke=0)
 tx(c,16,280,'HENSAL / COMPACT HOUSE',9,TEAL,True)
 tx(c,16,266,title,23,INK,True)
 tx(c,16,256,sub,8,MUTED)
 c.setStrokeColor(LINE); c.setLineWidth(.5); c.line(16*mm,249*mm,404*mm,249*mm)
 c.line(16*mm,19*mm,404*mm,19*mm)
 tx(c,16,12,'V4  /  08 SEP 2026     |     EAST-FACING CONCEPT     |     ALL DIMENSIONS IN METRES',7,MUTED)
 tx(c,282,12,f'DESIGN STUDY - NOT FOR CONSTRUCTION     {n:02d} / 07',7,MUTED)

def compass(p,x,y):
 p.circle(x,y,.38,TEAL,.5)
 p.polyline([(x-.32,y),(x+.55,y)],TEAL,.9,True)
 for xx,yy,s in [(x+.72,y-.06,'N'),(x-.68,y-.06,'S'),(x,y+.62,'W'),(x,y-.70,'E')]:p.text(xx,yy,s,7,True,col=TEAL)

def fill(p,box,col):p.fill_rect(*box,col)
def label(p,x,y,s,dim=None):p.label(x,y,s,dim,7.2)

def outer(p,floor):
 g=grow(floor)
 fill(p,envelope(floor),white)
 fill(p,(3.15,0,W,1.2),SAND)
 fill(p,(3.15,8.3,W,D+g),PALE)
 fill(p,(.15,.15,3.05,2.2),SAND)
 fill(p,(.15,6.2,3.05,9.55),ROSE)
 fill(p,(3.15,6.2,4.45,8.2),HexColor('#e6eff3'))
 if floor=='FF':fill(p,(4.55,6.2,5.85,8.2),HexColor('#e6eff3'))
 for box in [(west(floor),0,.15,D+g),(.15,0,3.15,.15+g),(.15,9.55,3.15,D+g),(3.05,0,3.15,D+g),(5.85-g,1.2,6,8.3),(3.15,1.2,6,1.35)]:p.wall(*box)
 p.wall(.15,2.2,3.05,2.3)
 p.wall(.15,6.1,3.05,6.2)
 p.wall(2.05,2.3,2.15,6.1)
 # Ensuite touches bedroom directly; the former public lobby is eliminated.
 p.wall(3.15,6.1,4.55 if floor=='GF' else 5.85,6.2)
 p.wall(4.45,6.2,4.55,8.2)
 p.wall(3.15,8.2,5.85,8.3)
 # SW bedroom entrance from the level passage beside the stair.
 p.door(2.20,6.1,.80,.10,'h',+1,'lo')
 # Sliding door in the long wall to avoid a leaf obstructing the narrow ensuite.
 p.opening(3.05,6.40,.75,.10,'v')
 p.line(3.035,7.15,3.035,7.90,TEAL,.8)
 p.text(2.87,6.8,'SL',4.8,col=TEAL)
 if floor=='GF':
  p.opening(3.05,2.45,.85,.10,'v')
  p.opening(3.05,5.2,.90,.10,'v')
  p.door(4.70,8.2,.90,.10,'h',-1,'hi')
 else:
  # Bath 3 belongs only to the north bedroom. Door swings out into its clear rear aisle.
  p.door(4.85,6.1,.75,.10,'h',-1,'hi')
  # Rear drying balcony is private to the master; side entrance, not through a bathroom.
  p.door(3.05,8.40,.85,.10,'v',-1,'hi')
 p.window(west(floor),6.3,1.4,.15+g,'v')
 p.window(west(floor),4.1,1.0,.15+g,'v')
 p.opening(2.05,2.35,.80,.10,'v')
 if floor=='FF':p.window(5.85,7.0,.55,.15,'v')
 for x,w,sill,h,kind in (FRONT_GF if floor=='GF' else FRONT_FF):
  yy=0 if x<3.05 else 1.2
  t=(.15+g) if yy==0 else .15
  if kind=='door':p.door(x,yy,w,t,'h',+1,'lo')
  elif kind=='slider':
   p.window(x,yy,w,t,'h');p.text(x+w/2,yy+.25,'SLIDING DOOR',5,col=BLUE)
  else:p.window(x,yy,w,t,'h')
 for x,w,sill,h,kind in (REAR_GF if floor=='GF' else REAR_FF):
  if kind=='door':continue
  yy=9.55 if x<3.05 else 8.2
  p.window(x,yy,w,(.15+g) if x<3.05 else .10,'h')
 p.fill_rect(5.85-g,8.3,6,D+g,DARK)
 # Corner piers follow the same per-edge rule as the walls they belong to.
 for x,y in [(3.05,0),(5.85,0),(3.05,9.55),(5.85,9.55)]:
  # Front piers thicken inward from the fixed outer face; rear piers grow outward from the
  # fixed inner face. Both therefore run y to y+0.15+g. East piers thicken inward in x.
  p.wall(x-g if x>5 else x, y, x+.15, y+.15+g)
 if floor=='FF':
  p.railing(3.15,0,5.85,0);p.railing(5.93,0,5.93,1.2)
  p.railing(3.15,9.63,5.85,9.63)


def stair(p,floor,show_passage=True,continue_to_roof=False):
 # 17 risers at 3/17 m. First flight 9R, 8T; second 8R, 7T.
 # 0.90 m clear flights + 0.10 central well, 0.90 m intermediate landing.
 fill(p,(.15,2.3,2.05,6.1),HexColor('#f4f5f3'))
 p.rect(.15,2.3,2.05,6.1,INK,.6)
 p.line(1.05,3.2,1.05,5.2,INK,.7);p.line(1.15,3.45,1.15,5.2,INK,.7)
 for i in range(9):p.line(.15,3.2+i*.25,1.05,3.2+i*.25,INK,.4)
 for i in range(8):p.line(1.15,3.45+i*.25,2.05,3.45+i*.25,INK,.4)
 p.line(.15,5.2,2.05,5.2,INK,.5)
 pts=[(.60,3.25),(.60,5.65),(1.60,5.65),(1.60,3.47)]
 if floor=='FF' and not continue_to_roof:pts=pts[::-1]
 p.polyline(pts,TEAL,.9,True)
 if continue_to_roof:
  p.text(.60,3.03,'UP / ROOF',4.8,True,col=TEAL)
  p.text(1.60,3.03,'DN / GF',4.8,True,col=MUTED)
 else:
  p.text(.60 if floor=='GF' else 1.60,3.03,'UP' if floor=='GF' else 'DN',6,True,col=TEAL)
 p.text(1.10,5.80,'LANDING',5,True)
 p.text(1.10,2.55,'17R / 176.5 mm',5.4,col=BLUE)
 if show_passage:p.text(2.62,4.25,'PASSAGE 0.90',5.6,rot=90,col=MUTED)
 # Roof arrival is guarded; the first-floor upward flight remains accessible.
 if floor=='FF' and not continue_to_roof:p.railing(.15,3.2,1.05,3.2)


def bathroom(p,floor):
 for x,n in [(3.15,'1' if floor=='GF' else '2')]+([(4.55,'3')] if floor=='FF' else []):
  p.shower(x,7.4,x+1.3,8.2)
  p.wc(x+1.25,7.0,'-x') # seated facing south
  p.basin(x+.35,6.2,.4,.32,'y0')
  p.text(x+.65,7.63,'SHOWER',4.8,col=MUTED)
  p.text(x+.65,6.68,'ENSUITE '+n,5.8,True)
  p.text(x+.65,6.45,('%.2f x 2.00'%(1.3-grow(floor))) if n=='3' else '1.30 x 2.00',5.6,col=BLUE)


def bedroom(p,floor):
 # Bed turned 90 deg from the earlier head-west layout so the sleeper's head points
 # south, the classical preference for the SW corner; south window moved clear of it.
 p.bed(.20,7.70,2.20,9.20,'x0')
 p.rect(.15,6.2,1.65,6.75);p.text(.90,6.42,'WARDROBE',5)
 label(p,1.58,6.78,'BED 1 / SW' if floor=='GF' else 'MASTER / SW','2.90 x 3.35')
 p.text(.35,8.45,'HEAD SOUTH',5,rot=90,col=TEAL)


def ground(p):
 outer(p,'GF');stair(p,'GF');bedroom(p,'GF');bathroom(p,'GF')
 # SE kitchen with east-facing cook and separate sink on north counter.
 p.rect(.15,.15,2.95,.75);p.rect(2.45,.75,3.05,1.30)
 p.rect(.70,.22,1.32,.65)
 for x in [.86,1.16]:p.circle(x,.42,.09)
 p.polyline([(1.01,1.20),(1.01,.80)],TEAL,.5,True)
 p.text(1.07,1.35,'FACE EAST',5,col=TEAL)
 p.basin(3.02,1.01,.40,.45,'x1')
 p.rect(.15,1.5,.80,2.2);p.text(.47,1.8,'FR',6)
 # Door moved off the living-facing wall onto the passage wall, so cooking odours
 # vent through the service corridor rather than straight into the sitting/dining room.
 p.door(2.10,2.20,.80,.10,'h',-1,'lo')
 label(p,1.78,1.83,'KITCHEN / SE','2.90 x 1.98')
 # Indicative store/wash nook in the tallest part of the void under the rising
 # flight, near the mid-landing; headroom tapers toward the ground-floor entry,
 # so treat as a study item pending a stair section check.
 p.rect(.15,4.50,1.05,5.10,TEAL,.7,dash=[2,2])
 p.text(.60,4.80,'STORE/WASH - VERIFY HEADROOM',4,True,rot=90,col=TEAL)
 # NE living and dining share the north bay; central walking route stays open.
 p.rect(5.12,2.0,5.85,3.8)
 for y in [2.6,3.2]:p.line(5.12,y,5.85,y,MUTED,.3)
 p.rect(3.2,3.4,3.43,4.4);p.text(3.32,3.9,'TV',5,rot=90)
 label(p,4.40,2.85,'LIVING / NE')
 p.circle(4.88,4.65,.45)
 for x,y in [(4.88,4.0),(4.88,5.30),(5.5,4.65)]:p.chair(x,y,.38)
 label(p,4.62,5.70,'DINING','OPEN WITH LIVING')
 p.text(5.20,7.3,'PUBLIC ROUTE 1.30',5.5,rot=90,col=MUTED)
 # NE prayer niche in living, clear of bathroom/stair on both floors.
 p.rect(5.35,1.35,5.85,1.72,TEAL,.6);p.text(5.6,1.80,'PRAYER',4.8,col=TEAL)
 p.chair(4.65,.65,.45);p.chair(5.32,.65,.45)
 label(p,4.23,.23,'SIT-OUT / 2.63 x 1.20')
 p.steps(3.25,5.65,0,3,tread=.28)
 p.polyline([(3.73,-.95),(3.73,.70)],TEAL,.7,True)
 p.text(3.7,-1.15,'EAST ENTRY',6,True,col=TEAL)
 # Rear covered wash-only area, no cooking hearth in NW.
 p.rect(3.15,8.30,4.40,8.85)
 p.basin(3.83,8.82,.60,.38,'y1')
 p.rect(3.15,8.90,3.75,9.50);p.text(3.45,9.16,'WM',5.6)
 label(p,4.8,9.28,'REAR WORK','2.63 x 1.47')
 p.text(4.8,8.96,'WASH / PREP ONLY',5,col=TEAL)
 p.steps(4.6,5.7,9.7,3,rise_dir=1,tread=.28)
 p.polyline([(5.15,10.65),(5.15,9.90)],TEAL,.6,True)
 p.text(4.55,10.4,'BACK YARD ACCESS',5.8,col=TEAL)
 # Side windows aligned to the rooms, away from parked-car doors.
 p.window(5.85,3.45,1.10,.15,'v')
 dimensions(p,'GF')


def first(p):
 outer(p,'FF');stair(p,'FF',continue_to_roof=True);bedroom(p,'FF');bathroom(p,'FF')
 # SE study opens to the front gallery and stair base/arrival landing.
 p.rect(.25,.35,1.75,.90);p.chair(1.0,1.25,.45)
 p.rect(2.60,.3,3.05,1.3)
 p.opening(.95,2.2,.90,.10,'h')
 p.opening(3.05,1.35,.85,.10,'v')
 label(p,1.63,1.8,'STUDY / FAMILY','2.90 x 2.03')
 # Removing the public rear lobby makes the north bedroom rectangular.
 p.wall(3.15,2.4,5.85,2.5)
 p.door(3.25,2.4,.80,.10,'h',+1,'lo')
 p.window(5.85,3.5,1.3,.15,'v')
 p.bed(3.25,3.90,5.25,5.10,'x0')
 p.rect(5.3,2.6,5.85,3.35);p.text(5.57,2.95,'WARD.',5,rot=90)
 label(p,4.5,5.72,'BED 3 / NORTH','2.68 x 3.60')
 p.text(3.40,4.50,'HEAD SOUTH',5,rot=90,col=TEAL)
 p.text(4.95,1.9,'FRONT GALLERY',5.5,col=MUTED)
 p.chair(4.45,.62,.42);p.chair(5.25,.62,.42)
 p.text(4.5,.20,'FRONT BALCONY 2.68 x 1.20',6,True)
 p.line(3.4,9.07,5.6,9.07,MUTED,.5,dash=[2,2])
 p.line(3.4,9.32,5.6,9.32,MUTED,.5,dash=[2,2])
 label(p,4.48,8.78,'REAR DRYING','2.68 x 1.42')
 p.text(4.5,9.48,'COVERED / VENTILATED',5,col=TEAL)
 dimensions(p,'FF')


def dimensions(p,floor='GF'):
 # R8: the chains follow this floor's external wall thickness. The west and rear faces move out
 # by g, the east and front faces stay put, so only the living bay and the kitchen depth lose g.
 g=grow(floor);e=.15+g;wx=west(floor)
 p.dims('x',D+g+.50,wx,[e,2.90,.10,2.70-g,e],size=6)
 p.dims('x',D+g+1.05,wx,[W+g],size=7)
 p.dims('y',wx-.60,0,[e,2.05-g,.10,3.80,.10,3.35,e],size=6)
 p.dims('y',wx-1.2,0,[D+g],size=7)
 p.dims('y',W+.60,0,[1.20,.15,4.75,.10,2.00,.10,1.40+g],size=6,side=-1)
 p.text(wx-.22,D+g+.25,'SW',6,True,col=TEAL);p.text(W+.22,D+g+.25,'NW',6,True,col=TEAL)
 p.text(wx-.22,-.3,'SE',6,True,col=TEAL);p.text(W+.22,-.3,'NE',6,True,col=TEAL)


def site(c):
 base(c,1,'A smaller footprint. More useful yard.','SITE STUDY  /  1:100 AT A3  /  ROOF ENCLOSURE ADDITIONAL: 9.02 m2 / 97.1 SQ FT')
 p=Plan(c,35,61,10)
 p.fill_rect(0,0,9.7,16.8,PALE)
 p.fill_rect(0,0,2.7,16.8,SAND);p.fill_rect(8.7,0,9.7,16.8,SAND)
 p.fill_rect(-.5,-3.6,10.2,0,HexColor('#e2e6e7'))
 p.rect(0,0,9.7,16.8,INK,1)
 p.rect(2.7,3,8.7,12.7,INK,.8)
 p.fill_rect(2.7,3,8.7,12.7,HexColor('#d5e2de'))
 p.fill_rect(5.85,3,8.7,4.2,white);p.fill_rect(5.85,11.3,8.7,12.7,white)
 p.text(5.7,8.6,'6.00 x 9.70 m',11,True,col=TEAL)
 p.text(5.7,7.8,'59.30 / 58.51 m2',8,True)
 p.text(5.7,7.1,'626.5 sq ft / FLOOR',8)
 p.text(7.25,3.5,'SIT-OUT',6)
 p.text(7.25,11.8,'REAR WORK',6,True)
 p.steps(5.95,8.35,3,3,tread=.28)
 p.text(9.25,7.3,'WALKWAY / NOMINAL 1.00',6,rot=90)
 # Nominal 2.70 m south strip, swapped from the north so the car gate clears the
 # open-well corner the Vastu review reserves in the northeast (sheet 07/05).
 p.rect(.10,3.7,2.60,8.7,TEAL,.9,dash=[3,2])
 p.rect(.65,4.1,2.4,8.3,INK,.7)
 p.rect(.77,5.25,2.28,7.0,MUTED,.5)
 p.text(1.54,6.1,'COMPACT CAR',5.7,rot=90)
 p.text(1.47,9.05,'2.50 x 5.00 BAY',6,True,col=TEAL)
 p.text(1.4,11.3,'SOUTH / PARKING STRIP',6,rot=90)
 p.polyline([(1.3,.4),(1.3,3.45)],TEAL,.8,True)
 p.line(.05,0,2.65,0,white,2);p.line(.05,0,2.65,0,TEAL,.6,dash=[2,2])
 p.text(1.35,-.48,'2.60 CLEAR GATE*',5.8)
 p.line(5.95,0,7.1,0,white,2);p.line(5.95,0,7.1,0,TEAL,.6,dash=[2,2])
 p.text(6.55,1.0,'SEPARATE ENTRY PATH',5.5)
 p.text(4.85,14.7,'REAR GARDEN / 4.10 NOMINAL',7,True)
 p.text(4.85,13.9,'Work area opens directly to this yard',6)
 p.text(4.85,-2,'EAST / PRIVATE ROAD 3.60 m',7,True)
 g=grow('GF')
 p.dims('x',17.4,0,[2.7-g,W+g,1],size=7);p.dims('x',18.15,0,[9.7],size=7)
 p.dims('y',-1.1,0,[3,D+g,4.1-g],size=7)
 # Indicative well (NE) and septic tank (NW) positions, both along the long 16.8 m
 # axis rather than across the tight 9.7 m width, so the KPBR 7.5 m separation clears.
 p.circle(9.20,1.30,.28,TEAL,.7)
 p.text(9.55,1.30,'WELL - INDICATIVE',4.6,rot=90,col=TEAL)
 p.rect(8.85,13.30,9.55,14.30,MUTED,.7,dash=[1,1])
 p.text(9.55,13.80,'SEPTIC TANK - INDICATIVE',4.6,rot=90,col=MUTED)
 compass(p,12.8,15.8)
 tx(c,180,237,'AREA LIMIT / COUNTED CONSERVATIVELY',10,TEAL,True)
 y=225
 for a,b in [('Ground external envelope','59.30 m2 / 638.3 sq ft'),('First external envelope','58.51 m2 / 629.8 sq ft'),('Main floors only (roof additional)','117.82 m2 / 1,268.2 sq ft'),('Included on each floor','Walls, stairs + covered open spaces')]:
  tx(c,180,y,a,8);tx(c,290,y,b,8,INK,True);y-=8
 y=block(c,180,185,'SIDE PARKING - FITS AS A SPACE STUDY','A 2.50 x 5.00 m stall fits in the nominal 2.70 m south strip. The drawn car is 1.75 x 4.20 m without mirrors. This is for a compact car, with tight door clearance; no covered carport is added.',213)
 y=block(c,180,y,'THE GATE IS THE UNRESOLVED PART','The 3.60 m road, boundary-wall thickness and actual vehicle turning circle control entry. The arrow shows approach only, not a verified swept path. Confirm with the real car and surveyed gate position; do not infer parking approval from this rectangle.',213)
 y=block(c,180,y,'SOURCE PLOT IS SLIGHTLY SKEWED','The 4-cent plot sketch gives 9.70 m frontage/rear and side lengths 16.82 / 16.84 m, with 1.62 are stated area. This study uses a nominal 9.70 x 16.80 m rectangle. The separate old site plan has different geometry; a measured boundary overlay is needed before fixing yard clearances.',213)
 y=block(c,180,y,'WALKWAY AND BUILDING EDGES','Keep the north path free of equipment and the south parking strip free of projecting fins or drains. Yard widths shown are nominal wall-to-boundary distances, not guaranteed finished clear widths. Front and rear steps sit in the yards.',213)
 y=block(c,180,y,'INDICATIVE WELL AND SEPTIC POSITIONS','A well/borewell is marked in the northeast corner and a septic tank in the northwest corner, about 12.5 m apart along the plot depth. KPBR 2019 Rule 75 requires at least 7.5 m between any well and a septic tank or soak pit, plus 1.2 m from boundaries; this does not clear reliably across the 9.7 m width, only along the 16.8 m depth. Confirm exact points, and check for any neighbouring well within 7.5 m, with the panchayat engineer.',213)


def ground_sheet(c):
 base(c,2,'Ground floor / bedroom with ensuite','DIMENSIONED PLAN  /  1:55 AT A3  /  EAST AT BOTTOM, NORTH TO THE RIGHT')
 p=Plan(c,44,45,1000/55)
 ground(p)
 compass(Plan(c,0,0,10),23.4,22.1)
 y=231
 y=block(c,246,y,'638.3 AND 629.8 SQ FT, INCLUDING THE WORK AREA','R8: the 220 mm ground walls make that floor 6.07 x 9.77 m / 638.3 sq ft; the 170 mm first-floor walls make that one 6.02 x 9.72 m / 629.8 sq ft. Both include the front sit-out and the rear work area. Neither is added beyond the floor-area limit.',149)
 y=block(c,246,y,'SOUTH STAIR / NE KEPT LIGHT','The stair is in the south band. The main entrance and living room occupy the east/northeast. A small prayer niche is placed in the northeast of the living room.',149)
 y=block(c,246,y,'SE KITCHEN / SW BEDROOM','The hob faces east. The ground bedroom occupies the southwest, with the bed head to the south. Cooking remains in the kitchen; the rear work area has a sink and washing machine, with no second stove.',149)
 y=block(c,246,y,'A CONTINUOUS REAR ROUTE','The 1.30 m north-side internal passage leads from dining to the rear work area. It does not pass through the bedroom or its bathroom. The bedroom entrance is separately reached from the level passage beside the stair.',149)
 y=block(c,246,y,'PRIVATE ATTACHED BATHROOM','Ensuite 1 opens directly from Bedroom 1 through a sliding door. Its clear size is 1.30 x 2.00 m, with WC, basin and shower. There is no shared-bathroom entrance. All three bedrooms in this house have their own bathroom.',149)
 y=block(c,246,y,'DRAWING CONVENTIONS','Dark: walls. Fine lines: furniture. Dashed arcs: door swings. Blue: dimensions. Wall allowance is 150 mm external and 100 mm internal; this is a concept for an engineered frame, not a load-bearing masonry design.',149)


def first_sheet(c):
 base(c,3,'First floor / two bedrooms, two ensuites','DIMENSIONED PLAN  /  1:55 AT A3  /  TWO BEDROOMS, TWO ENSUITES, STUDY AND BALCONIES')
 p=Plan(c,44,45,1000/55);first(p)
 compass(Plan(c,0,0,10),23.4,22.1)
 y=231
 y=block(c,246,y,'FRONT MATCHES THE REFERENCE','The left window belongs to the study/family space. The front balcony is on the right, over the ground-floor sit-out, with a recessed sliding door and glass railing.',149)
 y=block(c,246,y,'BEDROOMS IN SW AND NORTH','The southwest master retains 2.90 x 3.35 m clear dimensions; its west and rear walls grew outward, so nothing inside it moved. The north bedroom is a 2.68 x 3.60 m rectangle (9.65 m2) after the 170 mm east wall thickened inward. Each bedroom has its own door into its own ensuite: 1.30 x 2.00 m, and 1.28 x 2.00 m for Ensuite 3 against that east wall.',149)
 y=block(c,246,y,'NO BEDROOM IN THE SOUTHEAST','The southeast front room is a study/family space above the kitchen. The child\'s bedroom is in the north band. The master stays southwest, with southward bed-head orientation.',149)
 y=block(c,246,y,'REAR DRYING TERRACE','The covered rear balcony remains above the work area. Access is now through a side door from the master bedroom, not through either ensuite. It is private to the master; the front balcony remains accessible from the common gallery.',149)
 y=block(c,246,y,'TWO SEPARATE ENSUITES','Ensuite 2 serves only the master and stacks above Ensuite 1. Ensuite 3 serves only Bedroom 3 and sits above the ground service passage, not a bedroom or kitchen. The two bathrooms are separated by a full-height wall. The south stair continues to the roof; see sheets 05 and 08 for roof access.',149)
 y=block(c,246,y,'AREA AND STRUCTURE','The whole first-floor envelope is counted at 58.51 m2 (6.02 x 9.72 m over 170 mm external walls), including the stair opening and both covered balconies. Columns, beams, slab thickness and wet-area waterproofing must be engineered without reducing the shown clear routes.',149)


def rr(p,x,y,w,h,r,fillcol,stroke=None,lw=1):
 c=p.c;c.saveState();c.setFillColor(fillcol);c.setStrokeColor(stroke or fillcol);c.setLineWidth(lw)
 c.roundRect(p.X(x),p.Y(y),p.L(w),p.L(h),p.L(r),stroke=bool(stroke),fill=1);c.restoreState()

def timber(p,x0,z0,x1,z1,vertical=False):
 p.fill_rect(x0,z0,x1,z1,WOOD)
 if vertical:
  for i in range(int((x1-x0)/.13)+1):p.line(x0+i*.13,z0,x0+i*.13,z1,HexColor('#714b36'),.3)
 else:
  for i in range(int((z1-z0)/.16)+1):p.line(x0,z0+i*.16,x1,z0+i*.16,HexColor('#714b36'),.3)

def glazing(p,x,z,w,h,kind):
 p.fill_rect(x-.045,z-.045,x+w+.045,z+h+.045,HexColor('#473e35'))
 p.fill_rect(x,z,x+w,z+h,GLASS if kind!='obscured' else HexColor('#d0d8d5'))
 if kind=='door':
  p.fill_rect(x,z,x+w,z+h,HexColor('#605140'))
  p.line(x+w-.1,z+.95,x+w-.1,z+1.15,GLASS,1)
 else:
  n=3 if w>1.3 else 2
  for i in range(1,n):p.line(x+w*i/n,z,x+w*i/n,z+h,HexColor('#473e35'),1.5)
  if kind=='obscured':
   for i in range(int(w/.08)):p.line(x+.04+i*.08,z,x+.04+i*.08,z+h,white,.2)

def elevation(p,rear=False,labels=True):
 # Height datum: ground 0, GF FFL .45, FF FFL 3.45, roof top 6.45, screen 7.40.
 p.fill_rect(0,.45,6,6.45,WALL)
 p.fill_rect(0,.22,6,.45,HexColor('#c9c6bf'))
 if not rear:
  timber(p,0.05,.60,3.08,2.92)
  p.fill_rect(0.05,3.48,3.05,6.24,DARK)
  p.fill_rect(.55,3.65,2.38,4.27,WALL)
  timber(p,5.5,3.5,5.95,6.3)
  # Elevated screen sits along the south wing, visible left at front and right at rear.
  timber(p,.05,6.35,3.25,7.20,True)
  p.fill_rect(0,7.2,3.4,7.40,DARK);p.fill_rect(.04,7.20,3.35,7.28,WALL)
  # Full-width rounded GF frame; its opening leaves the same window/door order as photo.
  rr(p,.02,.42,5.96,2.82,.35,DARK)
  rr(p,.22,.60,5.53,2.38,.22,WALL)
  timber(p,.28,.66,3.10,2.88)
  p.fill_rect(3.15,.65,5.70,2.9,HexColor('#ded8ce'))
  for x,w,sill,h,kind in FRONT_GF:glazing(p,x,.45+sill,w,h,kind)
  p.fill_rect(.2,3.14,5.95,3.33,WALL)
  # Upper C-shaped surround continuing from left lintel into right balcony box.
  rr(p,.32,3.32,5.48,3.01,.35,DARK)
  rr(p,.50,3.50,5.10,2.64,.23,HexColor('#ddd5ca'))
  p.fill_rect(.30,3.48,2.99,5.95,DARK)
  p.fill_rect(.0,3.32,3.05,3.48,WALL)
  p.fill_rect(.55,3.75,2.39,4.20,WALL)
  for x,w,sill,h,kind in FRONT_FF:glazing(p,x,3.45+sill,w,h,kind)
  timber(p,3.13,5.87,5.56,6.1)
  # Balcony opaque low frame and transparent rail, all within footprint in plan.
  rr(p,3.07,3.32,2.73,.40,.20,DARK)
  p.fill_rect(3.2,3.72,5.59,4.54,Color(.67,.78,.78,alpha=.40))
  p.line(3.18,4.55,5.59,4.55,WOOD,1.4)
  for x in [3.2,4.4,5.58]:p.line(x,3.72,x,4.55,MUTED,.6)
  # Entry steps and seat silhouettes.
  for i in range(3):p.fill_rect(3.23-i*.08,.15*i,5.68+i*.08,.15*(i+1),HexColor('#c8c5bd'))
  for x in [4.67,5.28]:rr(p,x-.16,.62,.32,.40,.05,HexColor('#665d52'))
  for x in [3.8,5.0]:rr(p,x,3.72,.35,.45,.06,HexColor('#727a76'))
  p.line(.5,5.97,5.45,5.97,HexColor('#ead1a1'),1)
 else:
  # Rear reference: open left balcony, short canopy downturn and tall right jamb.
  # The source image does NOT have a full-height charcoal frame at the left.
  p.fill_rect(0,3.45,6,6.45,white)
  p.fill_rect(.68,5.55,2.68,6.65,WALL)
  p.fill_rect(.64,6.60,2.68,6.68,HexColor('#c9c6bf'))
  timber(p,2.48,6.35,5.95,7.2,True)
  p.fill_rect(2.40,7.20,6,7.40,DARK)
  p.fill_rect(2.44,7.18,5.96,7.28,WALL)
  p.fill_rect(.22,3.52,2.95,5.95,HexColor('#ddd5ca'))
  timber(p,2.95,3.52,5.78,6.12)
  timber(p,1.03,5.88,2.95,6.12)
  # A single open-bottom canopy profile, with rounded upper corners.
  c=p.c;c.saveState();c.setFillColor(DARK)
  q=c.beginPath();q.moveTo(p.X(.94),p.Y(5.60))
  q.lineTo(p.X(.80),p.Y(5.92))
  q.curveTo(p.X(.80),p.Y(6.18),p.X(.98),p.Y(6.37),p.X(1.24),p.Y(6.37))
  q.lineTo(p.X(5.56),p.Y(6.37))
  q.curveTo(p.X(5.82),p.Y(6.37),p.X(5.96),p.Y(6.18),p.X(5.96),p.Y(5.94))
  q.lineTo(p.X(5.96),p.Y(3.52));q.lineTo(p.X(5.76),p.Y(3.52))
  q.lineTo(p.X(5.76),p.Y(5.94))
  q.curveTo(p.X(5.76),p.Y(6.08),p.X(5.69),p.Y(6.14),p.X(5.55),p.Y(6.14))
  q.lineTo(p.X(1.24),p.Y(6.14))
  q.curveTo(p.X(1.09),p.Y(6.14),p.X(1.01),p.Y(6.06),p.X(1.01),p.Y(5.93))
  q.lineTo(p.X(1.13),p.Y(5.60));q.close()
  c.drawPath(q,fill=1,stroke=0);c.restoreState()
  for x in [1.45,2.35]:p.line(x,6.00,x+.07,6.00,HexColor('#ffe2a1'),1.8)
  for x in [3.15,5.20]:p.line(x,7.10,x+.07,7.10,HexColor('#ffe2a1'),1.8)
  # Work canopy below, north screen left.
  p.fill_rect(.15,.45,2.85,3.15,HexColor('#ddd8ce'))
  for x,w,sill,h,kind in REAR_GF:glazing(p,6-x-w,.45+sill,w,h,kind)
  for x,w,sill,h,kind in REAR_FF:glazing(p,6-x-w,3.45+sill,w,h,kind)
  p.fill_rect(.10,3.12,3.05,3.30,DARK)
  for x in [.15,2.80]:p.fill_rect(x,.45,x+.10,3.15,DARK)
  # Recessed counter and freestanding sink; aligns with x4.25..5.85 plan counter.
  p.fill_rect(1.60,.45,2.85,1.20,HexColor('#a09d94'))
  p.fill_rect(1.87,.88,2.47,1.26,HexColor('#c4c7be'))
  p.line(2.17,1.26,2.17,1.5,DARK,1);p.line(2.17,1.5,2.27,1.5,DARK,1)
  p.fill_rect(.02,.45,.15,3.0,HexColor('#777874'))
  # Balcony rail and hanging lines, no opaque panel across its left opening.
  p.fill_rect(.02,3.45,.22,4.55,WALL)
  p.fill_rect(.12,3.45,2.85,3.61,WALL)
  p.line(.16,4.55,2.83,4.55,WOOD,1)
  for i in range(18):p.line(.17+i*.15,3.6,.17+i*.15,4.55,WOOD,.5)
  for z in [4.85,5.0]:p.line(.27,z,2.4,z,MUTED,.4)
  for i in range(4):p.fill_rect(.35+i*.43,4.44,.63+i*.43,4.93,HexColor(['#d8e2e1','#8faeba','#e5d7ce','#d3d9d1'][i]))
  p.fill_rect(2.84,3.24,6,3.44,WALL)
  for i in range(3):p.fill_rect(.3-i*.05,.15*i,1.4+i*.05,.15*(i+1),HexColor('#c8c5bd'))
  # Warm wall lights on opaque cladding.
  p.fill_rect(4.3,4.75,4.40,4.95,DARK)
 p.line(-.25,0,6.3,0,MUTED,.6)
 if labels:
  for z,s in [(0,'GROUND'),(.45,'GF +0.45'),(3.45,'FF +3.45'),(6.45,'ROOF +6.45'),(7.40,'SCREEN +7.40')]:
   p.line(6.10,z,6.50,z,BLUE,.5);p.text(6.57,z-.07,s,6,col=BLUE,align='l')
  p.dims('x',-.65,0,[6],size=7)
  p.text(3,-1.15,'NORTH / LEFT' if rear else 'SOUTH / LEFT',5,align='r',col=MUTED)
  p.text(3.2,-1.15,'SOUTH / RIGHT' if rear else 'NORTH / RIGHT',5,align='l',col=MUTED)


def elevations_sheet(c):
 base(c,4,'Front and rear / one coordinated house','COLOURED ORTHOGRAPHIC ELEVATIONS  /  1:50 AT A3  /  OPENINGS TRACK THE FLOOR PLANS')
 tx(c,30,236,'EAST / FRONT',11,TEAL,True);tx(c,232,236,'WEST / REAR',11,TEAL,True)
 elevation(Plan(c,30,77,20),False)
 elevation(Plan(c,232,77,20),True)
 para(c,30,41,'Front: left stacked windows, right sit-out and balcony, rounded charcoal frames, timber soffits and a raised south-wing roof screen.',160,8,4.3)
 para(c,232,41,'Rear upper floor follows the reference: open left balcony, short rounded canopy return, timber right wall and raised screen. Two toilet vents replace the rear-facing door; master entry is on the side. Ground service openings retain the plan positions.',165,8,4.3)


def detail_sheet(c):
 base(c,5,'Stair geometry and Vastu review','REVIEW NOTES  /  STAIR PLAN 1:35 AT A3')
 tx(c,25,235,'SOUTH STAIR / CLOCKWISE ASCENT',11,TEAL,True)
 p=Plan(c,23,110-2.3*(1000/35),1000/35);stair(p,'GF',False)
 p.dims('x',6.35,.15,[.90,.10,.90],size=7)
 p.dims('y',2.5,2.3,[.90,2.0,.90],size=7,side=-1)
 tx(c,25,95,'17 risers x 176.47 mm = 3.00 m',9,INK,True)
 tx(c,25,88,'Flights: 9 risers + 8 risers; treads 250 mm.',8,MUTED)
 tx(c,25,82,'Clear flights / mid-landing: 900 mm.',8,MUTED)
 tx(c,25,76,'900 mm ground entry landing; 1,150 mm upper landing.',8,MUTED)
 para(c,25,66,'Count is the designed number of risers, including the top-floor rise. Equal risers govern; do not change them on site to alter the traditional step count.',140,8,4.5)
 para(c,25,43,'The south stair continues from first floor to roof. Keep the upward flight accessible and verify clear headroom along both storeys, including stair thickness and beams. See sheet 08 for the developed profile.',140,8,4.5)
 y=235
 y=block(c,181,y,'VASTU PRINCIPLES APPLIED','East/northeast entrance and living; northeast prayer niche; southeast kitchen with east-facing cook; south stair rising clockwise; southwest principal bedrooms with heads south; north child\'s bedroom; three private bathrooms in the northwest/west band, with no toilet over a bedroom, kitchen or prayer niche.',215)
 y=block(c,181,y,'WHY THE REAR WORK AREA HAS NO STOVE','Its northwest location is used for washing, laundry and preparation. Keeping the principal cooking fire southeast avoids adding another fire zone at the rear merely to reproduce the reference\'s outdoor hearth.',215)
 y=block(c,181,y,'WHAT IS NOT CLAIMED','This is a layout following the stated directional Vastu preferences, not a certificate of universal Vastu compliance. Exact compass bearing, entrance pada, site slope, well/septic locations and the chosen Kerala Vastu tradition remain to be checked. The plot sketch supports east-facing access but not an accurate surveyed azimuth.',215)
 y=block(c,181,y,'STRUCTURE AND PERMIT REVIEW','The old load-bearing scheme is not carried over. Allow for an engineered RCC frame, particularly the front recesses and balcony frames. Verify current local rules, room dimensions, daylight, setbacks, parking access and fire/escape requirements with the local architect. No current permit compliance is asserted.',215)
 tx(c,181,y,'REFERENCE BASIS',10,TEAL,True);y-=7
 for title,url in SOURCES:
  tx(c,181,y,title,8,BLUE);c.linkURL(url,(181*mm,(y-1)*mm,390*mm,(y+3)*mm),relative=0)
  y-=7
 para(c,181,y-2,'Vastu sources describe traditional design preferences. They are used here for spatial choices, not as evidence of health or prosperity effects.',215,8,4.5)


def references_sheet(c):
 base(c,6,'Reference fidelity / what was translated','YOUR PROVIDED IMAGES, COMPARED WITH THE COMPACT ELEVATIONS  /  DIAGRAMS NOT TO SCALE')
 tx(c,25,234,'FRONT REFERENCE',10,TEAL,True);tx(c,231,234,'REAR REFERENCE / UPPER OPENINGS UPDATED',10,TEAL,True)
 c.drawImage(str(ROOT.parent/'frontview.jpeg'),25*mm,78*mm,width=104*mm,height=151*mm,preserveAspectRatio=True,anchor='c')
 c.drawImage(str(ROOT.parent/'rearview-updated.png'),231*mm,78*mm,width=104*mm,height=151*mm,preserveAspectRatio=True,anchor='c')
 elevation(Plan(c,140,120,10.5),False,False)
 elevation(Plan(c,343,120,9),True,False)
 tx(c,141,106,'COMPACT FRONT',8,TEAL,True);tx(c,343,106,'COMPACT REAR',8,TEAL,True)
 para(c,25,65,'Kept: stacked left windows; right recessed porch and balcony; charcoal rounded frames; warm timber accents; glass railing; raised roof screen on the left. The upper left room is a study, so the SE kitchen below does not force an SE bedroom.',177,8,4.5)
 para(c,231,65,'Upper reference revised: old door replaced by two toilet vents; balcony entry is on its side. The vector retains the short curved canopy return, open left balcony and timber screen. The photo keeps the original ground floor; the coordinated plan/vector governs the revised ground service openings and wash-only use.',173,8,4.5)


def validate():
 assert FF_SQFT<=630       # first floor with its 170 mm walls
 assert GF_SQFT<=645       # ground floor with its 220 mm walls; see R8
 # The plot is fixed. The west wall grows into the parking strip and the rear into the garden,
 # so those two setbacks absorb the whole increase; the 1.00 m path and 3.00 m yard do not move.
 assert abs(1+W+(2.7-grow('GF'))+grow('GF')-9.7)<1e-9
 assert abs(3+D+(4.1-grow('GF'))+grow('GF')-16.8)<1e-9
 assert abs((9+8)*(3/17)-3)<1e-9
 assert .9+8*.25+.9<=3.8+1e-9
 assert .9+7*.25+.9<=3.8+1e-9
 for ops in [FRONT_GF,FRONT_FF,REAR_GF,REAR_FF]:
  for x,w,sill,h,kind in ops:
   assert 0<=x<x+w<=W and sill+h<=3
 # Three distinct ensuites and a full rectangular north bedroom.
 child_area=(2.7-grow('FF'))*3.6
 assert abs(child_area-9.648)<1e-8
 assert 1.3*2.0>=2.2
 return {'width_m':W,'depth_m':D,'external_wall_mm':{k:round(v*1000) for k,v in EXT.items()},'ground_envelope_m':[round(W+grow('GF'),3),round(D+grow('GF'),3)],'ground_envelope_m2':round(GF_AREA,4),'ground_envelope_sqft':round(GF_SQFT,2),'first_envelope_m':[round(W+grow('FF'),3),round(D+grow('FF'),3)],'first_envelope_m2':round(FF_AREA,4),'first_envelope_sqft':round(FF_SQFT,2),'setbacks_m':{'north_path':1.0,'front_yard':3.0,'south_parking_strip':round(2.7-grow('GF'),3),'rear_garden':round(4.1-grow('GF'),3)},'gross_envelope_m2_per_floor':AREA,'gross_envelope_sqft_per_floor':SQFT,'both_floors_m2':2*AREA,'bedroom_sw_clear_m2':2.9*3.35,'child_clear_m2':child_area,'front_sitout_balcony_clear_m2':2.7*1.2,'rear_work_drying_clear_m2':2.7*1.4,'ensuite_count':3,'ensuite_clear_m':[1.3,2.0],'ensuite_clear_m2_each':2.6,'bedroom_bathroom_pairs':{'GF_Bed1':'GF_Ensuite1','FF_Master':'FF_Ensuite2','FF_Bed3':'FF_Ensuite3'},'rear_balcony_access':'private side door from master','rear_work_access':'independent north passage','stair_risers':17,'stair_riser_mm':3000/17,'stair_tread_mm':250,'stair_clear_width_mm':900,'assumed_car_body_m':[1.75,4.2],'parking_stall_m':[2.5,5.0],'parking_access_verified':False,'survey_setout_verified':False,'vastu_certified':False}


def exterior_sheet(c):
 base(c,7,'Exterior concept / reference-led appearance','PHOTOREALISTIC STUDY  /  NOT TO SCALE  /  DIMENSIONED PLANS GOVERN')
 c.drawImage(str(OUT/'exterior-concept.png'),50*mm,43*mm,width=320*mm,height=200*mm,preserveAspectRatio=True,anchor='c')
 para(c,25,34,'Reference materials and curved frames are retained. Rear service openings adapt to three private ensuites; the rear balcony has a master-bedroom side entrance. The generated image illustrates appearance, not exact construction dimensions.',370,8,4.3)


def gallery():
 import base64
 pages=[('07-exterior-concept','Exterior'),('02-ground','Ground floor'),('03-first','First floor'),('04-elevations','Elevations'),('01-site','Site + parking'),('05-stair-vastu','Stair + Vastu'),('06-reference-comparison','References')]
 buttons=''.join(f'<button role="tab" aria-selected="{str(i==0).lower()}" data-target="{slug}" aria-controls="{slug}" id="tab-{slug}">{name}</button>' for i,(slug,name) in enumerate(pages))
 panels=''.join(f'<section role="tabpanel" id="{slug}" aria-labelledby="tab-{slug}" '+('' if i==0 else 'hidden')+'><img alt="'+name+' drawing sheet" src="data:image/png;base64,'+base64.b64encode((OUT/f'{slug}.png').read_bytes()).decode()+'"></section>' for i,(slug,name) in enumerate(pages))
 html='''<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hensal / Three ensuites v4</title><style>*{box-sizing:border-box}body{margin:0;background:#edf0eb;color:#25343b;font:15px system-ui,sans-serif}header{max-width:1450px;margin:auto;padding:30px 28px 20px}small{color:#197a77;letter-spacing:.15em;font-weight:700}h1{font-size:34px;letter-spacing:-.04em;margin:10px 0}p{line-height:1.6;max-width:1100px}nav{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}button{border:1px solid #b8c6c0;border-radius:30px;padding:11px 18px;color:#25343b;background:transparent;cursor:pointer;font:inherit}button[aria-selected=true]{background:#197a77;color:white;border-color:#197a77}button:focus-visible{outline:3px solid #ca9b56;outline-offset:3px}main{max-width:1450px;margin:0 auto;padding:0 18px 24px}img{width:100%;display:block;background:white;box-shadow:0 6px 28px #25343b14}footer{max-width:1450px;margin:auto;padding:0 28px 30px;color:#60747c;font-size:13px}@media(max-width:600px){header{padding:20px 16px}h1{font-size:26px}button{font-size:13px;padding:9px 12px}main{padding:0 6px 20px}}</style><header><small>HENSAL / COMPACT VARIANT V4</small><h1>Three bedrooms. Three attached bathrooms.</h1><p>626.5 sq ft per floor, including the covered outdoor spaces. The rear work area has independent access; the drying balcony is private to the master bedroom. South staircase, southeast kitchen and side parking retained.</p><nav role="tablist" aria-label="Drawing sheets">'''+buttons+'''</nav></header><main>'''+panels+'''</main><footer>Exterior appearance follows your references, with service-opening changes for the ensuites. Concept for review: measured boundaries, vehicle entry, detailed Vastu and structural design remain to be verified. Use the A3 PDF for drawing scales.</footer><script>const tabs=[...document.querySelectorAll('[role=tab]')];function activate(t){tabs.forEach(b=>b.setAttribute('aria-selected',String(b===t)));document.querySelectorAll('[role=tabpanel]').forEach(p=>p.hidden=p.id!==t.dataset.target)}tabs.forEach((t,i)=>{t.onclick=()=>activate(t);t.onkeydown=e=>{let j;if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;else return;e.preventDefault();activate(tabs[j]);tabs[j].focus()}});</script></html>'''
 (OUT/'index.html').write_text(html)


def main():
 data=validate()
 pdf=OUT/'Hensal_Compact_630_v4.pdf'
 c=canvas.Canvas(str(pdf),pagesize=PAGE)
 c.setTitle('Hensal - Compact 626.5 sq ft per floor - v4');c.setAuthor('Hensal residence design study')
 for fn in [site,ground_sheet,first_sheet,elevations_sheet,detail_sheet,references_sheet,exterior_sheet]:fn(c);c.showPage()
 c.save()
 import pymupdf
 doc=pymupdf.open(pdf)
 names=['01-site','02-ground','03-first','04-elevations','05-stair-vastu','06-reference-comparison','07-exterior-concept']
 for page,name in zip(doc,names):
  page.get_pixmap(matrix=pymupdf.Matrix(1.3,1.3),alpha=False).save(OUT/f'{name}.png')
  (OUT/f'{name}.svg').write_text(page.get_svg_image())
 (OUT/'dimensions.json').write_text(json.dumps(data,indent=2)+'\n')
 gallery()
 print(pdf)
 print(json.dumps(data,indent=2))

if __name__=='__main__':main()
