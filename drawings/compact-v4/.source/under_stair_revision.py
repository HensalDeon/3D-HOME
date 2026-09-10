"""R5 drawing overlay, shared with the 3D model; retained base functions stay reusable."""
from pathlib import Path
import json
from reportlab.lib.colors import HexColor, Color
from reportlab.lib.units import mm
import make_ensuite_plans as h
import make_roof_study as roof
L=json.loads((Path(__file__).resolve().parents[3]/'model/src/under-stair-layout.json').read_text())
R=3/17
ST=L['structure']   # R6 conceptual RCC stair, shared with the 3D model
WAIST,LAND,FIN=ST['waist'],ST['landingSlab'],ST['finish']
SLOPE=(.25**2+R**2)**.5
WZONE=(WAIST+FIN)*SLOPE/.25   # vertical construction zone under the finished nosing line
LZONE=LAND+FIN                # landing slab plus its finish
NOSE=lambda d: 10*R+(d-1.15)*4*R   # upper-flight waist top: the internal-corner line, one riser
                                   # below the nosing line, against distance from the bedroom wall
WALL=L['bedroomWallFace']
OLD_GROUND=h.ground
OLD_STAIR=h.stair
OLD_SECTION=roof.section
OAK=HexColor('#b69873'); CARCASS=HexColor('#e3cfaf'); BASIN=HexColor('#dce8e2'); SLAB=HexColor('#d2d6d3')
STORE=Color(.85,.75,.58,alpha=.5)   # translucent, so the landing and tread lines beneath stay legible

def steps():
 s=[([1.05,2.3,1.3,3.2],R),([.15,2.3,1.05,3.2],2*R)]
 s += [([.15,3.2+i*.25,1.05,3.45+i*.25],(3+i)*R) for i in range(6)]
 s += [([.15,5.2,2.05,6.1],9*R)]
 s += [([1.15,4.95-i*.25,2.05,5.2-i*.25],(10+i)*R) for i in range(7)]
 s += [([1.15,2.3,2.05,3.45],3)]
 return s

def soffits():
 """(start, end, lowest clear height) along the upper-flight bay, measured from the stair-side
 face of the bedroom wall. R6: the landing slab governs the first 0.90 m, then the inclined
 waist soffit governs; each band is quoted at its lowest point."""
 return [(0,.9,9*R-LZONE)]+[(.9+i*.25,1.15+i*.25,NOSE(.9+i*.25)-WZONE) for i in range(7)]+[(2.65,3.8,2.85)]

def stair(p,floor,show_passage=True,continue_to_roof=False):
 if floor!='GF':return OLD_STAIR(p,floor,show_passage,continue_to_roof)
 p.fill_rect(.15,2.3,2.05,6.1,HexColor('#f4f5f3'))
 # Upper flight overhead is dashed; starting flight remains prominent.
 for i,(b,z) in enumerate(steps()):
  p.rect(*b,h.MUTED if i>=9 else h.INK,.45,dash=[2,2] if i>=9 else None)
 p.rect(*L['stair']['landingExtension'],h.INK,.45)
 p.line(.15,5.2,1.05,5.2,h.PALE,1)
 structure_plan(p)
 p.polyline([(1.40,2.7),(.60,2.7),(.60,5.65),(1.60,5.65),(1.60,3.47)],h.TEAL,.9,True)
 p.text(1.08,2.48,'UP / S',4.6,True,col=h.TEAL)
 p.text(.60,4.90,'9R LANDING',4.2,col=h.TEAL)
 if show_passage:p.text(2.63,4.25,'OPEN ACCESS',4.5,rot=90,col=h.MUTED)

def structure_plan(p,label=True):
 """R6 conceptual RCC support zones in plan: they sit inside walls and slab edges that already
 exist, so no room, no under-stair function and no living-area floor area is taken."""
 for zone in ST['beamZones']:
  b=zone['box']
  p.fill_rect(*b,HexColor('#c8ccc6'))
  p.rect(*b,h.INK,.35,dash=[2,1.5])
 if label:
  p.text(1.10,6.26,'LANDING BEAM ZONE / TO BE DESIGNED',3.4,col=h.MUTED)
  p.text(1.60,3.30,'SLAB TRIMMER ZONE',3.2,col=h.MUTED)

def poly(p,pts,fill=None,stroke=None,lw=.6):
 c=p.c;c.saveState()
 if fill:c.setFillColor(fill)
 if stroke:c.setStrokeColor(stroke);c.setLineWidth(lw)
 q=c.beginPath();q.moveTo(p.X(pts[0][0]),p.Y(pts[0][1]))
 for x,y in pts[1:]:q.lineTo(p.X(x),p.Y(y))
 q.close();c.drawPath(q,fill=1 if fill else 0,stroke=1 if stroke else 0);c.restoreState()

def bifold(p,y0,y1,hinge_lo):
 # Plan symbol for one 450 mm bifold leaf in the stair-side partition, folding toward the passage.
 p.fill_rect(2.05,y0,2.15,y1,h.white)
 p.line(2.05,y0,2.05,y1,h.INK,.3,dash=[1.5,1]);p.line(2.15,y0,2.15,y1,h.INK,.3,dash=[1.5,1])
 hy,d=(y0,1) if hinge_lo else (y1,-1)
 p.polyline([(2.15,hy),(2.36,hy+d*.11),(2.15,hy+d*.225)],h.INK,.5)

def fixtures(p,detail=False):
 old=L['oldSlopedStorageFootprint'];tc=L['tv']['oldStorageCenter'];s=L['store'];w=L['wash'];pt=L['partition']
 # Dashed outline is the TV locating reference only, not an installed cabinet.
 p.rect(*old,h.MUTED,.4,dash=[1,2])
 # Under-landing store: zones follow the landing, its extension and risers 10-11.
 for z in s['zones']:p.fill_rect(*z['box'],STORE)
 p.rect(*s['box'],h.TEAL,.7)
 for z in s['zones'][2:]:p.line(z['box'][0],z['box'][3],z['box'][2],z['box'][3],h.TEAL,.35)
 if detail:
  p.text(1.1,5.50,'UNDER-LANDING STORE',4.6,True,col=h.TEAL)
  p.text(1.1,5.33,'1.38-1.56 m CLEAR / 2.6 m2',3.4,col=h.TEAL)
 else:p.text(1.1,5.42,'STORE',4,True,col=h.TEAL)
 # Mirror partition 1.40 m from the bedroom wall, then the basin and its standing zone.
 p.fill_rect(*pt['box'],h.TEAL)
 p.line(pt['mirror']['x'][0],pt['box'][1]-.012,pt['mirror']['x'][1],pt['box'][1]-.012,h.GLASS,1.2)
 b=w['box'];p.fill_rect(*b,BASIN);p.rect(*b,h.TEAL,.7);p.rect(b[0]+.05,b[1]+.03,b[2]-.05,b[3]-.04,h.TEAL,.4)
 p.text((b[0]+b[2])/2,b[1]+.13,'BASIN',3.8 if detail else 3.3,col=h.TEAL)
 p.rect(*w['standing'],h.TEAL,.6,dash=[2,2])
 p.polyline([(1.62,3.85),(1.62,4.22)],h.TEAL,.7,True)
 p.text(1.62,3.98,'FACE W',4.2 if detail else 3.6,True,col=h.TEAL)
 # Cabinet retained beneath the last two lower-flight treads; doors are now reached from the wash side.
 for cab in L['storage']:
  cb=cab['box'];p.fill_rect(*cb,CARCASS);p.rect(*cb,h.TEAL,.7)
  mid=(cb[1]+cb[3])/2;p.line(cb[2],cb[1],cb[2],cb[3],h.TEAL,1.1)
  p.text((cb[0]+cb[2])/2,mid,'CAB.',3.8,True,rot=90,col=h.TEAL)
  p.rect(*cab['doorSweep'],h.MUTED,.4,dash=[1,2])
  p.polyline([(1.03,mid),(1.26,mid)],h.TEAL,.5,True)
 # TV backing and the fixed panel that closes the former 600 mm opening on the same line.
 p.fill_rect(*L['tv']['panel'],OAK);p.fill_rect(*L['closingPanel']['box'],OAK)
 p.fill_rect(*L['tv']['box'],h.INK);p.text(2.32,tc,'TV',5,rot=90)
 # Store doors on the passage face beside the bedroom door.
 d=s['door'];dm=(d['box'][1]+d['box'][3])/2
 if detail:p.wall(2.05,5.2,2.15,6.1);p.wall(.15,6.1,2.3,6.2)
 bifold(p,d['box'][1],dm,True);bifold(p,dm,d['box'][3],False)
 p.polyline(w['approach'],h.BLUE,.55,True)
 p.polyline(L['storage'][0]['approach'],h.BLUE,.55,True)
 p.polyline([(2.9,5.85),(2.42,5.85)],h.BLUE,.55,True)
 p.line(old[0],tc,L['tv']['box'][0],tc,h.BLUE,.35,dash=[2,2])
 if detail:
  p.text(.42,3.89,'OLD SPAN',3.9,rot=90,col=h.MUTED)
  p.text(2.88,4.125,'TV CL 4.125',4.2,rot=90,col=h.BLUE)
  p.text(2.9,5.55,'BIFOLD 2 x 450 / H 1.40',3.6,rot=90,col=h.TEAL)
  p.text(1.2,6.31,'BEDROOM WALL / STAIR-SIDE FACE y = 6.10',4,col=h.MUTED)


class GroundProxy:
 def __init__(self,p):self.p=p
 def __getattr__(self,n):return getattr(self.p,n)
 def wall(self,*a,**kw):
  if list(a[:4])==[3.05,0,3.15,9.7]:
   self.p.wall(3.05,0,3.15,2.3);self.p.wall(3.05,6.1,3.15,9.7)
  elif list(a[:4])==[2.05,2.3,2.15,6.1]:
   self.p.wall(2.05,2.3,2.15,3.25);self.p.wall(2.05,5.2,2.15,6.1)
  else:self.p.wall(*a,**kw)
 def opening(self,*a,**kw):
  if a[0]==3.05 and a[1] in [2.45,5.2]:return
  if a[0]==2.05 and a[1]==2.35:a=(2.05,2.3,.9,*a[3:])
  self.p.opening(*a,**kw)
 def rect(self,*a,**kw):
  if list(a[:4]) in [[.15,4.5,1.05,5.1],[3.2,3.4,3.43,4.4]]:return
  self.p.rect(*a,**kw)
 def text(self,*a,**kw):
  if a[2] in ['STORE/WASH - VERIFY HEADROOM','TV']:return
  self.p.text(*a,**kw)

def ground(p):
 OLD_GROUND(GroundProxy(p));fixtures(p)

def ground_sheet(c):
 h.base(c,3,'Ground floor / one built-in unit under the stair','R6 / 10 SEP 2026 / PLAN 1:55 AT A3 / CONCEPTUAL RCC STAIR ADDED; ARCHITECTURE, STAIR GEOMETRY AND UNDER-STAIR FUNCTIONS UNCHANGED')
 ground(h.Plan(c,44,45,1000/55));h.compass(h.Plan(c,0,0,10),23.4,22.1)
 y=231
 for title,body in [
 ('ONE BUILT-IN UNIT UNDER THE UPPER FLIGHT','Measured from the stair-side face of the bedroom wall: store 0-1.40 m, mirror partition at 1.40 m, semi-recessed basin 1.40-1.75 m, standing zone 1.75-2.35 m. Every plan position is unchanged from R5. R6 replaces the modelled separate treads with a continuous RCC waist slab, so each soffit is an inclined plane and sits lower: the zone under the landing is 1.42 m and the person stands under 1.98-2.40 m.'),
 ('UNDER-LANDING STORE','1.90 x 1.35 m floor, about 2.6 m2 and 3.5 m3, with a stepped carcass top 1.37 m under the landing slab, 1.33 m where the waist springs off it and 1.51 m under riser 11. The two 450 mm bifold leaves stay 1.40 m high and still clear the 1.42 m landing soffit; the 900 x 1400 mm opening is unchanged. The pocket under the lower landing is crouch-in bulk storage.'),
 ('WEST-FACING BASIN, SHIFTED ONLY AS FAR AS NEEDED','500 x 350 mm basin on a 350 mm counter with a drawer; rim +0.86 m; front edge 1.75 m from the wall, unmoved. Mirror on the partition, top lowered to +1.65 m under the 1.70 m waist soffit; 1.73 m at the back of the bowl. Standing zone 750 x 600 mm, unmoved: 1.98 m over the 150 mm leaning strip, 2.09 m over the body line, 2.40 m at the rear.'),
 ('CABINET, CLOSING PANEL AND TV','The cabinet keeps its 500 x 550 mm footprint under the last two lower-flight treads; its height comes down to 800 mm under the 0.85 m waist soffit, since the waist hangs one riser plus its own thickness below each nosing. Its doors are still reached from the wash side through a 400 mm strip beside the basin, now under a 1.73-2.09 m soffit (stoop access). The oak closing panel and the TV are beside the flight, not beneath it, and are unchanged: y = 4.125 m, screen centre +1.10 m.'),
 ('ROUTES AND HEADROOM BASIS','Basin: through the existing 900 mm stair entry, turning behind the TV panel. Store: from the passage face. Cabinet: past the basin. Blue arrows show the routes; the dashed old-storage outline is the TV reference only. Headroom now uses a 150 mm RCC waist plus 20 mm stone finish, an inclined soffit 209 mm under the finished nosing line, and a 150 mm landing slab. Soffit plaster is additional and to be confirmed. Fallback: basin front at 2.00 m raises the leaning strip to 2.16 m.'),
 ('CONCEPTUAL STRUCTURE / ARCHITECTURE OTHERWISE LOCKED','STAIR SHOWN AS CONCEPTUAL RCC WAIST-SLAB SYSTEM. FINAL WAIST-SLAB THICKNESS, LANDING BEAMS, SUPPORT CONDITIONS, REINFORCEMENT AND CONNECTIONS TO BE DESIGNED BY STRUCTURAL ENGINEER. 100 MM PARTITION WALLS ARE NOT TO BE ASSUMED LOAD-BEARING. The landing is carried on a beam zone inside the existing bedroom cross-wall line, the flights on the plinth and the floor-slab edges; no new wall or column is added and nothing stands below the upper flight. The 900 x 1400 mm store opening in the stair-side partition remains the only architectural change. Stair geometry, both landings, kitchen, bedroom and all other walls, doors and windows keep their R2 geometry.')]:
  y=h.block(c,246,y,title,body,149)

def bay_section(q):
 # Horizontal axis: distance from the stair-side face of the bedroom wall (plan y = 6.10 - d); west at left, looking south.
 q.fill_rect(-.1,0,0,2.85,h.INK);q.fill_rect(3.8,0,3.9,2.85,h.INK)
 q.fill_rect(-.3,-.15,3.9,0,SLAB)
 pts=[(0,9*R),(.9,9*R)]
 for i in range(7):
  z=(10+i)*R;d0=.9+i*.25;pts+=[(d0,z),(d0+.25,z)]
 pts+=[(2.65,3.0),(3.8,3.0),(3.8,2.85),(2.65,2.85)]
 # R6 underside: one continuous inclined waist soffit, stepping to the landing slab soffit.
 pts+=[(2.65,NOSE(2.65)-WZONE),(.9,NOSE(.9)-WZONE),(.9,9*R-LZONE),(0,9*R-LZONE)]
 poly(q,pts,SLAB,h.INK,.7)
 # Conceptual landing beam zone inside the existing bedroom cross-wall; no room is encroached.
 q.fill_rect(-.1,9*R-LZONE-.15,0,9*R,HexColor('#a9aea7'))
 q.line(-.1,9*R-LZONE-.15,0,9*R-LZONE-.15,h.INK,.5)
 q.text(.06,9*R+.10,'LANDING BEAM ZONE / TO BE DESIGNED',3.4,col=h.MUTED,align='l')
 q.text(.45,9*R-.095,'9R LANDING SLAB',3.6,col=h.MUTED)
 q.polyline([(2.42,NOSE(2.42)-WZONE-.02),(2.78,1.80)],h.MUTED,.4)
 q.text(3.18,1.72,'CONTINUOUS RCC WAIST SLAB %d mm'%(WAIST*1000),3.4,col=h.MUTED)
 for z in L['store']['zones']:
  if z['box'][2]<=1.15:continue   # the lower-bay pocket lies behind the section plane
  d0=WALL-z['box'][3];d1=WALL-z['box'][1]
  q.fill_rect(d0,.02,d1,z['top'],CARCASS);q.rect(d0,.02,d1,z['top'],h.TEAL,.6)
 q.text(.68,.78,'STORE',6,True,col=h.TEAL);q.text(.68,.55,'1.37 / 1.33 / 1.51 m',3.8,col=h.TEAL)
 pb=L['partition'];d0=WALL-pb['box'][3];d1=WALL-pb['box'][1]
 q.fill_rect(d0,0,d1,pb['height'],h.TEAL)
 mz=pb['mirror']['z'];q.line(d1+.012,mz[0],d1+.012,mz[1],h.GLASS,1.6)
 q.text(d1+.05,pb['height']-.02,'MIRROR / TOP +%.2f'%pb['height'],3.6,col=h.TEAL,align='l')
 w=L['wash'];wb=w['box'];c0=WALL-wb[3];c1=WALL-wb[1]
 q.fill_rect(c0,w['height']-.04,c1,w['height'],h.INK)
 q.rect(c0,w['counter']['drawerBottom'],c1,w['height']-.04,h.TEAL,.6)
 q.fill_rect(c0+.05,w['height']-.06,c1-.03,w['height']+.06,BASIN);q.rect(c0+.05,w['height']-.06,c1-.03,w['height']+.06,h.TEAL,.5)
 q.line(d1,.98,d1+.14,.98,h.INK,.9);q.line(d1+.14,.98,d1+.14,.92,h.INK,.9)
 q.text((c0+c1)/2,w['counter']['drawerBottom']+.12,'DRAWER',3.2,col=h.TEAL)
 q.text((c0+c1)/2,1.28,'BASIN +0.86',3.4,col=h.TEAL)
 hx=2.05
 q.circle(hx,1.62,.1,h.MUTED,.6);q.line(hx,.95,hx,1.52,h.MUTED,.6)
 q.line(hx,.95,hx-.11,0,h.MUTED,.6);q.line(hx,.95,hx+.11,0,h.MUTED,.6)
 q.line(hx,1.38,1.66,1.02,h.MUTED,.6)
 q.fill_rect(1.75,-.03,2.35,.03,h.TEAL)
 q.polyline([(2.5,2.0),(2.2,2.0)],h.TEAL,.8,True);q.text(2.55,1.97,'USER FACES WEST',4.2,True,col=h.TEAL,align='l')
 for a,b,z in soffits():
  q.text((a+b)/2+.03,z-.06,f'{z:.2f}',3.5,rot=90,col=h.BLUE,align='r')
 q.dims('x',-.32,0,[1.4,.35,.6],size=4.6)
 q.line(-.3,0,3.95,0,h.MUTED,.5)
 for z,t in [(0,'GF +0.45'),(3.0,'FF +3.45')]:q.line(3.9,z,4.05,z,h.BLUE,.5);q.text(4.1,z-.05,t,4.5,col=h.BLUE,align='l')
 q.text(-.2,1.45,'BEDROOM WALL',4,rot=90,col=h.MUTED)
 q.text(4.0,1.45,'KITCHEN WALL',4,rot=90,col=h.MUTED)
 q.text(.05,2.55,'< WEST',5,True,col=h.TEAL,align='l');q.text(3.7,2.55,'EAST >',5,True,col=h.TEAL,align='r')
 q.text(.05,2.42,'CLEAR HEIGHTS IN BLUE / %d mm RCC WAIST + %d mm FINISH'%(WAIST*1000,FIN*1000),3.8,col=h.MUTED,align='l')
 q.text(.05,2.27,'%d mm LANDING SLAB / CONCEPTUAL - VERIFY WITH ENGINEER'%(LAND*1000),3.4,col=h.MUTED,align='l')

def detail_sheet(c):
 h.base(c,7,'Under-stair built-in / conceptual RCC stair','R6 / 10 SEP 2026 / STAIR PLAN 1:25 AND BAY SECTION 1:40 AT A3 / STRUCTURE IS CONCEPTUAL MASSING, NOT A STRUCTURAL DESIGN')
 p=h.Plan(c,20,70-2.3*40,40);stair(p,'GF',False);fixtures(p,True)
 p.dims('x',6.45,.15,[.9,.1,.9],size=6)
 p.dims('y',2.35,3.75,[.6,.35,.05,1.35],size=4.6,side=-1)
 for yy,t in [(4.05,'STAND'),(4.52,'BASIN'),(5.42,'STORE')]:p.text(2.63,yy,t,3.6,rot=90,col=h.BLUE)
 p.text(3.1,3.05,'NORTH >',5.5,True,col=h.TEAL)
 h.tx(c,25,54,'One built-in unit under a conceptual RCC stair',8,h.TEAL,True)
 h.para(c,25,46,'Distances are measured from the stair-side face of the bedroom wall: store 0-1.40 m, mirror partition at 1.40 m, basin 1.40-1.75 m, standing zone 1.75-2.35 m, all unchanged. Grey hatch: conceptual landing beam and slab trimmer zones, inside walls and slab edges that already exist. Blue arrows: basin route from the stair entry, cabinet route beside the basin, store doors from the passage.',140,8,4.4)
 y=231
 for title,body in [
 ('1 / UNDER-LANDING STORE, 0-1.40 m FROM THE BEDROOM WALL','Floor 1.90 x 1.35 m unchanged, about 2.6 m2 and 3.5 m3. Against the RCC soffit the carcass top becomes 1.37 m under the landing slab, 1.33 m where the waist springs off it and 1.51 m under riser 11, keeping 45-55 mm below each soffit. The two 450 mm bifold leaves stay 1.40 m high and clear the 1.42 m landing soffit; the pocket under the lower landing is crouch-in bulk storage.'),
 ('2 / STEPPED VANITY, USER FACES WEST','Mirror partition still at 1.40 m; its top comes down from +1.75 to +1.65 m under the 1.70 m waist soffit. Basin, counter, drawer, +0.86 m rim, 1.75 m front edge and the 750 x 600 mm standing zone at 1.75-2.35 m do not move. DISCLOSED: a continuous waist soffit is an inclined plane and lower than the superseded separate-tread model, so clear heights fall to 1.98 m over the leaning strip, 2.09 m over the body line, 2.40 m at the rear and 1.73 m at the back of the bowl - the whole standing zone is now under the 2.20 m benchmark. Fallback: front edge at 2.00 m gives 2.16 m.'),
 ('3 / CABINET, CLOSING PANEL AND TV','The 500 W x 550 D mm cabinet stays under the last two lower-flight treads at y = 4.20-4.70 m; its height comes down from 1080 to 800 mm under the 0.85 m waist soffit, since the waist hangs one riser plus its own thickness below each nosing. Its doors are still reached from the wash side through a 400 mm strip beside the basin, now under a 1.73-2.09 m soffit: stoop access, not a passage. The oak closing panel and the TV sit on the stair boundary at x = 2.05-2.10 m, beside the flight and never beneath it, so both are unchanged.'),
 ('4 / CONCEPTUAL RCC STAIR / EVERYTHING ELSE LOCKED','STAIR SHOWN AS CONCEPTUAL RCC WAIST-SLAB SYSTEM. FINAL WAIST-SLAB THICKNESS, LANDING BEAMS, SUPPORT CONDITIONS, REINFORCEMENT AND CONNECTIONS TO BE DESIGNED BY STRUCTURAL ENGINEER. 100 MM PARTITION WALLS ARE NOT TO BE ASSUMED LOAD-BEARING. Support: the plinth, the 150 mm west external wall, a landing beam zone in the existing bedroom cross-wall line, the floor-slab trimmer. No cantilevered treads, no stringers, no wall under the upper flight, no new column, no load on the stair-side partition. Stair geometry and every other wall, door and window keep their R2 geometry.')]:y=h.block(c,180,y,title,body,216)
 h.tx(c,181,112,'SECTION / UPPER-FLIGHT BAY / LOOKING SOUTH / 1:40 / CONCEPTUAL RCC',8,h.TEAL,True)
 bay_section(h.Plan(c,190,33,25))
 h.tx(c,318,113,'LOWER FLIGHT / CABINET RETAINED',8,h.TEAL,True)
 q=h.Plan(c,320,42,25)
 top=[(0,2*R)]
 for i in range(6):
  x=i*.25;z=(3+i)*R;top+=[(x,z),(x+.25,z)]
 top+=[(1.5,9*R),(2.0,9*R)]
 bot=[(0,2*R-WZONE),(1.5,8*R-WZONE),(1.5,9*R-LZONE),(2.0,9*R-LZONE)]
 poly(q,top+bot[::-1],SLAB,h.INK,.7)
 for cab in L['storage']:
  b=cab['box'];q.rect(b[1]-3.2,.05,b[3]-3.2,cab['height'],h.TEAL,.8)
 q.line(0,0,2.0,0,h.MUTED,.5)
 q.polyline([(1.65,.55),(1.52,.55)],h.TEAL,.6,True)
 q.text(.62,3*R+.30,'RCC WAIST SLAB',3.4,col=h.MUTED)
 h.para(c,318,34,'500 x 550 x 800 mm under treads 7-8; doors face the wash side. Waist slab conceptual.',84,7,3.8)


def section(p):
 # Developed paths: GF starter + lower + retained upper; roof stair stays 9 + 8. R6 gives every
 # flight a continuous RCC waist slab and every turn a landing slab, so nothing reads as floating.
 for x0,x1,z in [(-.35,5.7,roof.GF),(-.35,0,roof.FF),(5.8,6.35,roof.FF),(4.65,5.2,roof.RF)]:
  p.fill_rect(x0,z-.15,x1,z,SLAB)
 for z0,groups in [(roof.GF,[(2,.9),(7,1.4),(8,0)]),(roof.FF,[(9,.9),(8,0)])]:
  top=[(0,z0)];bot=[];x=0;z=z0
  for count,landing in groups:
   fx,fz=x,z
   for i in range(count):
    z+=R;top.append((x,z))
    if i<count-1:x+=.25;top.append((x,z))
   # The waist soffit is the nosing line dropped by one construction zone; it dies into the
   # slab or landing it springs from at each end.
   bot+=[(fx,fz-WZONE),(x,z-R-WZONE)]
   if landing:
    bot+=[(x,z-LZONE)];x+=landing;top.append((x,z));bot+=[(x,z-LZONE)]
  poly(p,top+bot[::-1],SLAB,h.INK,.85)
  p.text(2.7,z0+.25,'2 + 7 + 8 / GF' if z0==roof.GF else '9 + 8 / TO ROOF',5,col=h.TEAL)
  p.text(2.7,z0+.05,'CONTINUOUS RCC WAIST SLAB / LANDING SLAB',3.8,col=h.MUTED)
 p.fill_rect(-.1,roof.COVER_UNDER,5.7,roof.COVER_TOP,SLAB)
 p.dims('y',6.0,roof.RF,[2.4],size=6,side=-1)
 for z,t in [(roof.GF,'GF +0.45'),(roof.FF,'FF +3.45'),(roof.RF,'ROOF +6.45'),(9,'COVER +9.00')]:roof.level(p,z,t)
 p.text(2.5,-.25,'UNFOLDED PATHS / NOT HORIZONTAL SET-OUT / %d mm WAIST + %d mm FINISH, INDICATIVE'%(WAIST*1000,FIN*1000),5,col=h.MUTED)

def install():
 h.stair=stair;h.ground=ground;h.ground_sheet=ground_sheet;h.detail_sheet=detail_sheet;roof.section=section
